import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSeoMeta } from '@unhead/react';
import { useQuery } from '@tanstack/react-query';
import { AppNav } from '@/components/AppNav';
import { KnowledgeCard } from '@/components/KnowledgeCard';
import { Button } from '@/components/ui/button';
import { ArrowRight, AlertTriangle, Wifi, PenLine, HelpCircle } from 'lucide-react';
import { useKnowledgeSynthesis } from '@/hooks/useKnowledgeSynthesis';
import { useNostrKnowledgeRepo } from '@/hooks/useNostrKnowledge';
import type { KnowledgeSearchResult } from '@/lib/knowledge/types';

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialQuery = searchParams.get('q') ?? '';
  const [inputValue, setInputValue] = useState(initialQuery);
  const [activeQuery, setActiveQuery] = useState(initialQuery);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const repo = useNostrKnowledgeRepo();

  useSeoMeta({
    title: activeQuery ? `${activeQuery} — INTHENO` : 'Search — INTHENO',
    description: `Open knowledge search for: ${activeQuery}`,
  });

  // Search knowledge
  const {
    data: searchResult,
    isLoading: isSearching,
    error: searchError,
  } = useQuery<KnowledgeSearchResult>({
    queryKey: ['knowledge-search', activeQuery],
    queryFn: () => repo.search(activeQuery, { limit: 8 }),
    enabled: !!activeQuery,
    staleTime: 60_000,
  });

  // AI synthesis
  const { synthesize, isSynthesizing } = useKnowledgeSynthesis();
  const [synthesis, setSynthesis] = useState<{
    answer: string;
    aiUnavailable?: boolean;
    insufficientKnowledge?: boolean;
  } | null>(null);
  const [hasSynthesized, setHasSynthesized] = useState(false);

  useEffect(() => {
    setSynthesis(null);
    setHasSynthesized(false);
  }, [activeQuery]);

  useEffect(() => {
    if (searchResult && !hasSynthesized && searchResult.articles.length > 0) {
      setHasSynthesized(true);
      synthesize(activeQuery, searchResult.articles).then(result => {
        setSynthesis(result);
      }).catch(() => {
        setSynthesis({
          answer: searchResult.articles[0]?.summary ?? '',
          aiUnavailable: true,
        });
      });
    } else if (searchResult && !hasSynthesized && searchResult.articles.length === 0) {
      setHasSynthesized(true);
      setSynthesis({ answer: '', insufficientKnowledge: true });
    }
  }, [searchResult, hasSynthesized, activeQuery, synthesize]);

  const handleSearch = useCallback(() => {
    const q = inputValue.trim();
    if (!q) return;
    setActiveQuery(q);
    navigate(`/search?q=${encodeURIComponent(q)}`, { replace: true });
  }, [inputValue, navigate]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSearch();
    }
  };

  const isLoading = isSearching || isSynthesizing;
  const hasResults = (searchResult?.articles.length ?? 0) > 0;
  const isKnowledgeGap = !isLoading && hasResults === false && !!activeQuery && hasSynthesized;
  const isNetworkError = !isLoading && !!searchError;

  return (
    <div className="min-h-screen bg-background">
      <AppNav />

      {/* Search bar */}
      <div className="border-b border-border bg-background sticky top-14 z-30 py-3">
        <div className="container">
          <div className="relative max-w-2xl">
            <textarea
              ref={textareaRef}
              className="w-full resize-none rounded-xl border border-border bg-card px-4 py-3 pr-14 text-sm text-foreground placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring min-h-[44px] max-h-32"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask a question..."
              rows={1}
              aria-label="Search knowledge"
            />
            <Button
              onClick={handleSearch}
              disabled={!inputValue.trim()}
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-lg"
              style={{ background: inputValue.trim() ? 'var(--intheno-brand)' : undefined }}
              aria-label="Search"
            >
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Results area */}
      <div className="container py-6 max-w-3xl">
        {/* No query state */}
        {!activeQuery && (
          <div className="text-center py-16">
            <p className="text-muted-foreground">Enter a question above to search the knowledge network.</p>
          </div>
        )}

        {/* Loading state */}
        {activeQuery && isLoading && (
          <div className="space-y-4 animate-pulse">
            <div className="h-6 w-48 rounded bg-muted" />
            <div className="rounded-2xl border border-border bg-card p-6 space-y-3">
              <div className="h-4 w-full rounded bg-muted" />
              <div className="h-4 w-5/6 rounded bg-muted" />
              <div className="h-4 w-4/6 rounded bg-muted" />
            </div>
            <div className="rounded-2xl border border-border bg-card p-4 space-y-2">
              <div className="h-3 w-32 rounded bg-muted" />
              <div className="h-3 w-full rounded bg-muted" />
              <div className="h-3 w-3/4 rounded bg-muted" />
            </div>
          </div>
        )}

        {/* Network error */}
        {isNetworkError && (
          <div className="rounded-2xl border border-border bg-card p-6 text-center">
            <Wifi className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
            <h2 className="font-semibold text-foreground mb-1">Knowledge relays temporarily unavailable</h2>
            <p className="text-sm text-muted-foreground">
              Some knowledge relays couldn't be reached. Results may be limited.
            </p>
          </div>
        )}

        {/* Knowledge Card — main result */}
        {!isLoading && hasResults && synthesis && (
          <KnowledgeCard
            question={activeQuery}
            synthesis={synthesis}
            articles={searchResult!.articles}
            hasConflicts={searchResult?.hasConflicts ?? false}
            relayStatus={searchResult?.relayStatus ?? 'not_queried'}
          />
        )}

        {/* Knowledge Gap */}
        {isKnowledgeGap && (
          <KnowledgeGapState question={activeQuery} />
        )}

        {/* Related Nostr relay notice */}
        {!isLoading && searchResult?.relayStatus === 'all_failed' && (
          <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 dark:border-amber-900/50 dark:bg-amber-950/20 p-4 flex gap-3">
            <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-amber-800 dark:text-amber-400">
              Some knowledge relays are currently unavailable. Showing available results only.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function KnowledgeGapState({ question }: { question: string }) {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-dashed border-border bg-card p-8 text-center">
        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
          <HelpCircle className="h-6 w-6 text-muted-foreground" />
        </div>
        <h2 className="text-lg font-semibold text-foreground mb-2">Knowledge Gap</h2>
        <p className="text-muted-foreground text-sm mb-1 max-w-md mx-auto">
          We don't have enough contributed knowledge to answer{' '}
          <em className="text-foreground not-italic font-medium">"{question}"</em>{' '}
          reliably yet.
        </p>
        <p className="text-muted-foreground/70 text-xs mb-6">
          This is a successful state — it means the knowledge network is growing.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={() => navigate(`/contribute?topic=${encodeURIComponent(question)}`)}
            style={{ background: 'var(--intheno-brand)' }}
            className="text-white"
          >
            <PenLine className="h-4 w-4 mr-2" />
            Contribute Knowledge
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate(`/request?q=${encodeURIComponent(question)}`)}
          >
            <HelpCircle className="h-4 w-4 mr-2" />
            Request Knowledge
          </Button>
        </div>
      </div>
    </div>
  );
}
