// INTHENO Knowledge Data Model
// This is an application-level model — NOT a new Nostr protocol.
// Articles are stored as NIP-54 kind:30818 events on Nostr.

export interface KnowledgeSource {
  name: string;
  title: string;
  url?: string;
  publishedAt?: string;
}

export interface KnowledgeContributor {
  pubkey: string;
  npub: string;
  displayName: string;
  nip05?: string;
  picture?: string;
}

export type EvidenceStatus = 'sufficient' | 'partial' | 'insufficient' | 'conflicting';

export interface KnowledgeArticle {
  id: string;                  // event ID (hex) or local demo ID
  title: string;
  subject: string;             // d-tag normalized form
  question?: string;           // The primary question this answers
  content: string;             // Full article content (Djot/Markdown)
  summary?: string;            // Short summary for cards
  author: KnowledgeContributor;
  createdAt: number;           // Unix timestamp
  updatedAt: number;           // Unix timestamp
  sources: KnowledgeSource[];
  tags: string[];
  category: string;
  related: string[];           // Related article d-tags or titles
  version?: string;
  forkOf?: string;             // a-tag of the original event
  deferredTo?: string;         // a-tag of a better version
  relaySources?: string[];     // Relay URLs where this was found
  nostrEvent?: NostrEventData; // Raw Nostr event data
  evidenceStatus: EvidenceStatus;
  isDemo?: boolean;            // Marks seed/demo content
}

export interface NostrEventData {
  id: string;
  pubkey: string;
  kind: number;
  created_at: number;
  tags: string[][];
  content: string;
  sig: string;
  relays?: string[];
}

export interface KnowledgeSearchResult {
  articles: KnowledgeArticle[];
  evidenceStatus: EvidenceStatus;
  hasConflicts: boolean;
  conflictingArticles?: KnowledgeArticle[];
  totalFound: number;
  relayStatus: 'all_ok' | 'partial' | 'all_failed' | 'not_queried';
}

export interface KnowledgeGap {
  id: string;
  question: string;
  askedAt: number;
  status: 'open' | 'answered';
}

export const KNOWLEDGE_CATEGORIES = [
  'Science',
  'Mathematics',
  'History',
  'Technology',
  'Nature',
  'Geography',
  'Philosophy',
  'Economics',
  'Arts',
  'Health',
] as const;

export type KnowledgeCategory = typeof KNOWLEDGE_CATEGORIES[number];
