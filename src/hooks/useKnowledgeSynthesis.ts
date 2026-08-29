import { useCallback, useState } from 'react';
import { useShakespeare } from './useShakespeare';
import type { KnowledgeArticle } from '@/lib/knowledge/types';

export interface SynthesisResult {
  answer: string;
  isAIGenerated: true;
  aiUnavailable?: boolean;
  insufficientKnowledge?: boolean;
}

const INTHENO_SYSTEM_PROMPT = `You are the INTHENO knowledge synthesis engine.

Your role is to answer users' questions using ONLY the Knowledge Articles provided to you.

Rules you MUST follow:
1. Answer ONLY using information from the provided Knowledge Articles.
2. Do NOT invent facts, sources, quotations, contributors, or citations.
3. CRITICAL: First check whether the Knowledge Articles actually address the user's specific question. If the articles are about a different topic — even a loosely related one — respond with exactly: "INSUFFICIENT_KNOWLEDGE". Do not answer a different question than what was asked.
4. If the retrieved knowledge is insufficient or off-topic, respond with exactly: "INSUFFICIENT_KNOWLEDGE"
5. If contributors or sources disagree, explain the disagreement clearly.
6. Preserve attribution — note when information comes from specific sources in the articles.
7. Write a clear, concise answer for a general audience (2–4 paragraphs maximum).
8. Do NOT imply that your AI-generated answer is independently verified.
9. Do NOT pretend to be a search engine or claim to have searched the internet.

Examples of when to respond INSUFFICIENT_KNOWLEDGE:
- User asks "what is the difference between a square and a rectangle" but articles are about the Pythagorean theorem
- User asks about a person but articles are about a different person
- User asks about a specific concept not covered in the provided articles

Format your answer in plain text. Do not use markdown headers. Keep it conversational and clear.`;

/**
 * Synthesize an AI answer grounded in retrieved Knowledge Articles.
 * The AI is explicitly instructed not to invent sources or facts.
 */
export function useKnowledgeSynthesis() {
  const { sendChatMessage, isLoading, error, isAuthenticated } = useShakespeare();
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [synthesisError, setSynthesisError] = useState<string | null>(null);

  const synthesize = useCallback(async (
    question: string,
    articles: KnowledgeArticle[]
  ): Promise<SynthesisResult> => {
    if (!isAuthenticated) {
      // Without AI we can't verify the retrieved articles actually answer
      // the question — serve the summary only if there are articles, and
      // clearly flag that AI synthesis was unavailable.
      if (articles.length > 0 && articles[0].summary) {
        return {
          answer: articles[0].summary,
          isAIGenerated: true,
          aiUnavailable: true,
        };
      }
      // No articles or no summary → honest knowledge gap
      return {
        answer: '',
        isAIGenerated: true,
        aiUnavailable: true,
        insufficientKnowledge: true,
      };
    }

    if (articles.length === 0) {
      return {
        answer: '',
        isAIGenerated: true,
        insufficientKnowledge: true,
      };
    }

    setIsSynthesizing(true);
    setSynthesisError(null);

    try {
      // Build the knowledge context from retrieved articles
      const knowledgeContext = articles.map((article, i) => {
        const sourceList = article.sources.map(s => `  - ${s.name}: "${s.title}"${s.url ? ` (${s.url})` : ''}`).join('\n');
        return `--- Knowledge Article ${i + 1} ---
Title: ${article.title}
${article.question ? `Question: ${article.question}` : ''}
Content: ${article.content.slice(0, 2000)}${article.content.length > 2000 ? '...' : ''}
Sources:
${sourceList || '  (No sources listed)'}
Contributor: ${article.author.displayName}
`;
      }).join('\n');

      const userMessage = `Question: ${question}

Retrieved Knowledge Articles:
${knowledgeContext}

Please synthesize an answer to the question using ONLY the information in these Knowledge Articles.`;

      const response = await sendChatMessage(
        [
          { role: 'system', content: INTHENO_SYSTEM_PROMPT },
          { role: 'user', content: userMessage },
        ],
        'shakespeare'
      );

      const content = response.choices[0]?.message?.content;
      const answerText = typeof content === 'string' ? content : '';

      if (answerText === 'INSUFFICIENT_KNOWLEDGE' || !answerText.trim()) {
        return {
          answer: '',
          isAIGenerated: true,
          insufficientKnowledge: true,
        };
      }

      return {
        answer: answerText,
        isAIGenerated: true,
      };
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'AI synthesis failed';
      setSynthesisError(errorMsg);

      // Fallback: use article summaries
      if (articles.length > 0) {
        const fallback = articles
          .map(a => a.summary ?? a.content.slice(0, 200))
          .filter(Boolean)
          .join(' ');
        return {
          answer: fallback,
          isAIGenerated: true,
          aiUnavailable: true,
        };
      }

      return {
        answer: '',
        isAIGenerated: true,
        aiUnavailable: true,
        insufficientKnowledge: true,
      };
    } finally {
      setIsSynthesizing(false);
    }
  }, [isAuthenticated, sendChatMessage]);

  return {
    synthesize,
    isSynthesizing: isSynthesizing || isLoading,
    synthesisError: synthesisError ?? error,
    isAuthenticated,
  };
}
