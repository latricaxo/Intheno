import { useContext, createContext } from 'react';
import type { KnowledgeRepository } from '@/lib/knowledge/repository';
import { LocalKnowledgeRepository } from '@/lib/knowledge/repository';

// Singleton local repo
const localRepo = new LocalKnowledgeRepository();

export const KnowledgeContext = createContext<KnowledgeRepository>(localRepo);

export function useKnowledge(): KnowledgeRepository {
  return useContext(KnowledgeContext);
}

export { localRepo as defaultKnowledgeRepo };
