import { useNostr } from '@nostrify/react';
import { useCallback } from 'react';
import type { NostrEvent } from '@nostrify/nostrify';
import type { NostrQuerier, NostrQueryFilters } from '@/lib/knowledge/nostrRepository';
import { NostrKnowledgeRepository } from '@/lib/knowledge/nostrRepository';
import { defaultKnowledgeRepo } from './useKnowledge';

// Read relays to query for NIP-54 knowledge
const KNOWLEDGE_RELAYS = [
  'wss://relay.ditto.pub/',
  'wss://relay.dreamith.to/',
  'wss://nos.lol/',
  'wss://relay.nostr.band/',
];

const KIND_WIKI = 30818;

/**
 * Creates a NostrQuerier that wraps the Nostrify pool.
 */
function useNostrQuerier(): NostrQuerier {
  const { nostr } = useNostr();

  const queryArticles = useCallback(async (filters: NostrQueryFilters): Promise<NostrEvent[]> => {
    const { search, subject, ids, authors, limit = 20 } = filters;

    const filter: Record<string, unknown> = {
      kinds: [KIND_WIKI],
      limit,
    };

    if (ids?.length) filter['ids'] = ids;
    if (authors?.length) filter['authors'] = authors;
    if (subject) filter['#d'] = [subject];
    if (search) filter['search'] = search;

    const signal = AbortSignal.timeout(8000);

    try {
      const events = await nostr.query([filter], { signal });
      return events;
    } catch {
      // Try without search param if NIP-50 not supported
      if (search && !subject) {
        try {
          const fallbackFilter = { ...filter };
          delete (fallbackFilter as Record<string, unknown>)['search'];
          const events = await nostr.query([fallbackFilter], { signal: AbortSignal.timeout(5000) });
          return events;
        } catch {
          return [];
        }
      }
      return [];
    }
  }, [nostr]);

  return { queryArticles };
}

/**
 * Returns a NostrKnowledgeRepository backed by the live Nostr pool.
 * Falls back to local demo data when relays are unavailable.
 */
export function useNostrKnowledgeRepo(): NostrKnowledgeRepository {
  const querier = useNostrQuerier();
  return new NostrKnowledgeRepository(defaultKnowledgeRepo, querier);
}

export { KNOWLEDGE_RELAYS };
