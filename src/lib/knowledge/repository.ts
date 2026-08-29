import type { KnowledgeArticle, KnowledgeSearchResult } from './types';
import { DEMO_ARTICLES } from './demoData';

/**
 * Abstract interface for a KnowledgeRepository.
 * The UI only depends on this interface — it doesn't care whether
 * data comes from local seed articles or live Nostr relays.
 */
export interface KnowledgeRepository {
  search(query: string, options?: SearchOptions): Promise<KnowledgeSearchResult>;
  getById(id: string): Promise<KnowledgeArticle | null>;
  getBySubject(subject: string): Promise<KnowledgeArticle[]>;
  getByCategory(category: string): Promise<KnowledgeArticle[]>;
  getRecent(limit?: number): Promise<KnowledgeArticle[]>;
  getFeatured(limit?: number): Promise<KnowledgeArticle[]>;
}

export interface SearchOptions {
  limit?: number;
  category?: string;
}

/**
 * Normalize a query string to a subject d-tag (NIP-54 rules)
 */
export function normalizeToSubject(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // remove punctuation
    .trim()
    .replace(/\s+/g, '-')    // whitespace → hyphen
    .replace(/-+/g, '-')     // collapse multiple hyphens
    .replace(/^-|-$/g, '');  // strip leading/trailing hyphens
}

// Common words that should not drive relevance on their own
const STOP_WORDS = new Set([
  'the', 'is', 'are', 'was', 'were', 'a', 'an', 'and', 'or', 'but', 'in',
  'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'as', 'it', 'its',
  'this', 'that', 'what', 'how', 'why', 'when', 'where', 'who', 'which',
  'does', 'do', 'did', 'have', 'has', 'had', 'be', 'been', 'being',
  'between', 'difference', 'differences', 'compare', 'comparison',
]);

/**
 * Score how relevant an article is to a query.
 * Higher = more relevant.
 *
 * IMPORTANT: An article only qualifies if it has meaningful overlap with the
 * query's core topic words in its title, subject, question, or tags.
 * Incidental word matches in body content alone do NOT qualify an article.
 */
function scoreArticle(article: KnowledgeArticle, query: string, terms: string[]): number {
  let score = 0;
  const q = query.toLowerCase();
  const title = article.title.toLowerCase();
  const subject = article.subject.toLowerCase();
  const questionLower = (article.question ?? '').toLowerCase();
  const tagsLower = article.tags.map(t => t.toLowerCase());
  const summaryLower = (article.summary ?? '').toLowerCase();
  const contentLower = article.content.toLowerCase();

  // Exact whole-query matches score highest
  if (title === q) score += 100;
  if (subject === normalizeToSubject(query)) score += 80;
  if (questionLower === q || questionLower === q + '?') score += 90;

  // Partial whole-query matches in title/question
  if (title.includes(q)) score += 40;
  if (questionLower.includes(q)) score += 35;
  if (summaryLower.includes(q)) score += 20;

  // Filter to meaningful terms only (no stop words, min 3 chars)
  const meaningfulTerms = terms.filter(t => t.length >= 3 && !STOP_WORDS.has(t));

  // Term-by-term matching in high-signal fields
  let topicFieldHits = 0; // hits in title, question, or tags
  for (const term of meaningfulTerms) {
    if (title.includes(term)) { score += 15; topicFieldHits++; }
    if (questionLower.includes(term)) { score += 12; topicFieldHits++; }
    if (tagsLower.some(t => t.includes(term))) { score += 10; topicFieldHits++; }
    if (summaryLower.includes(term)) score += 6;
    if (contentLower.includes(term)) score += 2; // content alone is very weak signal
  }

  // If there are meaningful terms but NONE appear in title/question/tags,
  // this article is not actually about the topic — disqualify it.
  if (meaningfulTerms.length > 0 && topicFieldHits === 0 && score <= 4) {
    return 0;
  }

  return score;
}

// Minimum score for an article to appear in results.
// This prevents tangential word matches from surfacing irrelevant articles.
const MIN_RELEVANCE_SCORE = 12;

/**
 * LocalKnowledgeRepository — backed by demo seed data.
 * Used as the primary/fallback repository when Nostr data is not yet loaded.
 */
export class LocalKnowledgeRepository implements KnowledgeRepository {
  private articles: KnowledgeArticle[];

  constructor(articles: KnowledgeArticle[] = DEMO_ARTICLES) {
    this.articles = articles;
  }

  async search(query: string, options: SearchOptions = {}): Promise<KnowledgeSearchResult> {
    const { limit = 10, category } = options;
    const q = query.trim().toLowerCase();

    if (!q) {
      return {
        articles: [],
        evidenceStatus: 'insufficient',
        hasConflicts: false,
        totalFound: 0,
        relayStatus: 'not_queried',
      };
    }

    const terms = q.split(/\s+/);
    let candidates = category
      ? this.articles.filter(a => a.category === category)
      : this.articles;

    const scored = candidates
      .map(a => ({ article: a, score: scoreArticle(a, q, terms) }))
      .filter(s => s.score >= MIN_RELEVANCE_SCORE)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    const articles = scored.map(s => s.article);

    return {
      articles,
      evidenceStatus: articles.length > 0 ? 'sufficient' : 'insufficient',
      hasConflicts: false,
      totalFound: articles.length,
      relayStatus: 'not_queried',
    };
  }

  async getById(id: string): Promise<KnowledgeArticle | null> {
    return this.articles.find(a => a.id === id) ?? null;
  }

  async getBySubject(subject: string): Promise<KnowledgeArticle[]> {
    return this.articles.filter(a => a.subject === subject);
  }

  async getByCategory(category: string): Promise<KnowledgeArticle[]> {
    return this.articles.filter(a => a.category === category);
  }

  async getRecent(limit = 10): Promise<KnowledgeArticle[]> {
    return [...this.articles]
      .sort((a, b) => b.updatedAt - a.updatedAt)
      .slice(0, limit);
  }

  async getFeatured(limit = 6): Promise<KnowledgeArticle[]> {
    // Return a diverse set of articles from different categories
    const byCategory = new Map<string, KnowledgeArticle[]>();
    for (const article of this.articles) {
      if (!byCategory.has(article.category)) byCategory.set(article.category, []);
      byCategory.get(article.category)!.push(article);
    }
    const featured: KnowledgeArticle[] = [];
    for (const [, articles] of byCategory) {
      if (featured.length >= limit) break;
      if (articles[0]) featured.push(articles[0]);
    }
    return featured.slice(0, limit);
  }

  /** Add articles (e.g., from Nostr) to the local cache */
  addArticles(articles: KnowledgeArticle[]): void {
    for (const article of articles) {
      const idx = this.articles.findIndex(a => a.id === article.id);
      if (idx >= 0) {
        this.articles[idx] = article;
      } else {
        this.articles.unshift(article);
      }
    }
  }
}
