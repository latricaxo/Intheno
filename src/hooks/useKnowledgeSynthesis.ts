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
3. If the retrieved knowledge is insufficient, say so explicitly — do not fabricate an answer.
4. If contributors or sources disagree, explain the disagreement clearly.
5. Preserve attribution — note when information comes from specific sources in the articles.
6. Write a clear, concise answer for a general audience (2–4 paragraphs maximum).
7. Do NOT imply that your AI-generated answer is independently verified.
8. Do NOT pretend to be a search engine or claim to have searched the internet.
9. If the provided articles do not contain enough information to answer the question reliably, respond with exactly: "INSUFFICIENT_KNOWLEDGE"

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
      // Can still provide a basic answer from the first article's summary
      if (articles.length > 0 && articles[0].summary) {
        return {
          answer: articles[0].summary,
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
