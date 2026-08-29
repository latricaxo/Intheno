import type { NostrEvent } from '@nostrify/nostrify';
import { nip19 } from 'nostr-tools';
import type { KnowledgeArticle, KnowledgeContributor, KnowledgeSource, KnowledgeSearchResult } from './types';
import type { KnowledgeRepository, SearchOptions } from './repository';
import { LocalKnowledgeRepository, normalizeToSubject } from './repository';

const KIND_WIKI = 30818;

/**
 * Parse a NIP-54 kind:30818 Nostr event into a KnowledgeArticle.
 * Returns null if the event is not a valid NIP-54 article.
 */
export function parseNip54Event(event: NostrEvent, relayUrls?: string[]): KnowledgeArticle | null {
  if (event.kind !== KIND_WIKI) return null;

  const getTag = (name: string): string | undefined =>
    event.tags.find(([n]) => n === name)?.[1];

  const subject = getTag('d');
  if (!subject) return null;

  const title = getTag('title') ?? subject;
  const summary = getTag('summary');

  // Extract sources from r or source tags
  const sources: KnowledgeSource[] = event.tags
    .filter(([n]) => n === 'r' || n === 'source')
    .map(([, url, title]) => ({
      name: extractDomain(url ?? ''),
      title: title ?? extractDomain(url ?? ''),
      url: url && isValidUrl(url) ? url : undefined,
    }))
    .filter(s => s.url);

  // Extract tags (t tags)
  const tags = event.tags
    .filter(([n]) => n === 't')
    .map(([, v]) => v)
    .filter(Boolean);

  // Extract related (a tags without fork/defer marker)
  const related = event.tags
    .filter(([n, , , marker]) => n === 'a' && !marker)
    .map(([, addr]) => addr)
    .filter(Boolean);

  // Fork and defer
  const forkOf = event.tags.find(([n, , , m]) => n === 'a' && m === 'fork')?.[1];
  const deferredTo = event.tags.find(([n, , , m]) => n === 'a' && m === 'defer')?.[1];

  // Category from t tag
  const CATEGORIES = ['science', 'mathematics', 'history', 'technology', 'nature', 'geography', 'philosophy', 'economics', 'arts', 'health'];
  const categoryTag = tags.find(t => CATEGORIES.includes(t.toLowerCase()));
  const category = categoryTag
    ? categoryTag.charAt(0).toUpperCase() + categoryTag.slice(1)
    : 'Science';

  // Encode contributor's npub
  let npub = '';
  try {
    npub = nip19.npubEncode(event.pubkey);
  } catch {
    npub = event.pubkey;
  }

  const contributor: KnowledgeContributor = {
    pubkey: event.pubkey,
    npub,
    displayName: getTag('name') ?? npub.slice(0, 12) + '...',
    nip05: getTag('nip05'),
  };

  return {
    id: event.id,
    title,
    subject,
    content: event.content,
    summary,
    author: contributor,
    createdAt: event.created_at,
    updatedAt: event.created_at,
    sources,
    tags,
    category,
    related,
    forkOf,
    deferredTo,
    relaySources: relayUrls,
    nostrEvent: {
      id: event.id,
      pubkey: event.pubkey,
      kind: event.kind,
      created_at: event.created_at,
      tags: event.tags,
      content: event.content,
      sig: event.sig,
      relays: relayUrls,
    },
    evidenceStatus: sources.length > 0 ? 'sufficient' : 'partial',
    isDemo: false,
  };
}

function extractDomain(url: string): string {
  try {
    return new URL(url).hostname.replace('www.', '');
  } catch {
    return url;
  }
}

function isValidUrl(url: string): boolean {
  try {
    const u = new URL(url);
    return u.protocol === 'https:' || u.protocol === 'http:';
  } catch {
    return false;
  }
}

/**
 * NostrKnowledgeRepository — queries live Nostr relays for NIP-54 kind:30818 articles.
 * Falls back gracefully to the local repository if relays are unavailable.
 */
export class NostrKnowledgeRepository implements KnowledgeRepository {
  private localRepo: LocalKnowledgeRepository;
  private nostrQuerier: NostrQuerier;

  constructor(localRepo: LocalKnowledgeRepository, nostrQuerier: NostrQuerier) {
    this.localRepo = localRepo;
    this.nostrQuerier = nostrQuerier;
  }

  async search(query: string, options: SearchOptions = {}): Promise<KnowledgeSearchResult> {
    const { limit = 10 } = options;

    // Always get local results first
    const localResult = await this.localRepo.search(query, options);

    // Attempt Nostr search in parallel
    let nostrArticles: KnowledgeArticle[] = [];
    let relayStatus: KnowledgeSearchResult['relayStatus'] = 'not_queried';

    try {
      const subject = normalizeToSubject(query);
      const nostrEvents = await this.nostrQuerier.queryArticles({
        search: query,
        subject,
        limit,
      });

      if (nostrEvents.length > 0) {
        nostrArticles = nostrEvents
          .map(e => parseNip54Event(e))
          .filter((a): a is KnowledgeArticle => a !== null);
        // Add Nostr articles to local cache for future use
        this.localRepo.addArticles(nostrArticles);
        relayStatus = 'all_ok';
      } else {
        relayStatus = 'all_ok'; // Queried successfully, just empty
      }
    } catch {
      relayStatus = 'all_failed';
    }

    // Merge results, deduplicating by subject
    const seen = new Set<string>();
    const merged: KnowledgeArticle[] = [];

    for (const article of [...nostrArticles, ...localResult.articles]) {
      if (!seen.has(article.subject)) {
        seen.add(article.subject);
        merged.push(article);
      }
    }

    // Check for conflicting articles on same subject
    const subjectGroups = new Map<string, KnowledgeArticle[]>();
    for (const article of merged) {
      if (!subjectGroups.has(article.subject)) subjectGroups.set(article.subject, []);
      subjectGroups.get(article.subject)!.push(article);
    }
    const conflicting = [...subjectGroups.values()].filter(g => g.length > 1).flat();

    return {
      articles: merged.slice(0, limit),
      evidenceStatus: merged.length > 0 ? 'sufficient' : 'insufficient',
      hasConflicts: conflicting.length > 0,
      conflictingArticles: conflicting.length > 0 ? conflicting : undefined,
      totalFound: merged.length,
      relayStatus,
    };
  }

  async getById(id: string): Promise<KnowledgeArticle | null> {
    const local = await this.localRepo.getById(id);
    if (local) return local;

    try {
      const events = await this.nostrQuerier.queryArticles({ ids: [id], limit: 1 });
      if (events[0]) {
        const article = parseNip54Event(events[0]);
        if (article) {
          this.localRepo.addArticles([article]);
          return article;
        }
      }
    } catch {
      // Relay unavailable — return null
    }

    return null;
  }

  async getBySubject(subject: string): Promise<KnowledgeArticle[]> {
    const local = await this.localRepo.getBySubject(subject);

    try {
      const events = await this.nostrQuerier.queryArticles({ subject, limit: 10 });
      const nostrArticles = events
        .map(e => parseNip54Event(e))
        .filter((a): a is KnowledgeArticle => a !== null);
      this.localRepo.addArticles(nostrArticles);
      // Merge and deduplicate
      const all = [...nostrArticles, ...local];
      const seen = new Set<string>();
      return all.filter(a => {
        if (seen.has(a.id)) return false;
        seen.add(a.id);
        return true;
      });
    } catch {
      return local;
    }
  }

  async getByCategory(category: string): Promise<KnowledgeArticle[]> {
    return this.localRepo.getByCategory(category);
  }

  async getRecent(limit = 10): Promise<KnowledgeArticle[]> {
    try {
      const events = await this.nostrQuerier.queryArticles({ limit });
      const nostrArticles = events
        .map(e => parseNip54Event(e))
        .filter((a): a is KnowledgeArticle => a !== null);
      this.localRepo.addArticles(nostrArticles);
    } catch {
      // Silently fall back to local
    }
    return this.localRepo.getRecent(limit);
  }

  async getFeatured(limit = 6): Promise<KnowledgeArticle[]> {
    return this.localRepo.getFeatured(limit);
  }
}

// Query abstraction so the repository doesn't depend directly on React hooks
export interface NostrQueryFilters {
  search?: string;
  subject?: string;
  ids?: string[];
  authors?: string[];
  limit?: number;
}

export interface NostrQuerier {
  queryArticles(filters: NostrQueryFilters): Promise<NostrEvent[]>;
}
