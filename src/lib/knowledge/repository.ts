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

/**
 * Score how relevant an article is to a query.
 * Higher = more relevant.
 */
function scoreArticle(article: KnowledgeArticle, query: string, terms: string[]): number {
  let score = 0;
  const q = query.toLowerCase();
  const title = article.title.toLowerCase();
  const subject = article.subject.toLowerCase();
  const questionLower = (article.question ?? '').toLowerCase();
  const contentLower = article.content.toLowerCase();
  const tagsLower = article.tags.map(t => t.toLowerCase());
  const summaryLower = (article.summary ?? '').toLowerCase();

  // Exact matches score highest
  if (title === q) score += 100;
  if (subject === normalizeToSubject(query)) score += 80;
  if (questionLower === q || questionLower === q + '?') score += 90;

  // Partial title/question matches
  if (title.includes(q)) score += 40;
  if (questionLower.includes(q)) score += 35;
  if (summaryLower.includes(q)) score += 20;

  // Term-by-term matching
  for (const term of terms) {
    if (term.length < 3) continue;
    if (title.includes(term)) score += 15;
    if (questionLower.includes(term)) score += 12;
    if (tagsLower.some(t => t.includes(term))) score += 10;
    if (summaryLower.includes(term)) score += 8;
    if (contentLower.includes(term)) score += 4;
  }

  return score;
}

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
      .filter(s => s.score > 0)
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
