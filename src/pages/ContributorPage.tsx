import { useParams, useNavigate } from 'react-router-dom';
import { useSeoMeta } from '@unhead/react';
import { useQuery } from '@tanstack/react-query';
import { useNostr } from '@nostrify/react';
import { nip19 } from 'nostr-tools';
import { AppNav } from '@/components/AppNav';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuthor } from '@/hooks/useAuthor';
import { parseNip54Event } from '@/lib/knowledge/nostrRepository';
import type { KnowledgeArticle } from '@/lib/knowledge/types';
import { BookOpen, ArrowLeft, Clock, ExternalLink } from 'lucide-react';
import NotFound from './NotFound';

export default function ContributorPage() {
  const { npub } = useParams<{ npub: string }>();
  const navigate = useNavigate();
  const { nostr } = useNostr();

  // Decode npub to hex pubkey
  let pubkey = '';
  try {
    if (npub) {
      const decoded = nip19.decode(npub);
      if (decoded.type === 'npub') pubkey = decoded.data;
    }
  } catch {
    // Invalid npub
  }

  const author = useAuthor(pubkey || undefined);
  const metadata = author.data?.metadata;
  const displayName = metadata?.name ?? (npub ? npub.slice(0, 16) + '…' : 'Unknown');

  useSeoMeta({
    title: `${displayName} — INTHENO Contributor`,
    description: `Knowledge contributions by ${displayName} on INTHENO.`,
  });

  const { data: articles, isLoading } = useQuery({
    queryKey: ['contributor-articles', pubkey],
    queryFn: async () => {
      if (!pubkey) return [];
      const events = await nostr.query(
        [{ kinds: [30818], authors: [pubkey], limit: 50 }],
        { signal: AbortSignal.timeout(8000) }
      );
      return events
        .map(e => parseNip54Event(e))
        .filter((a): a is KnowledgeArticle => a !== null);
    },
    enabled: !!pubkey,
    staleTime: 60_000,
  });

  if (!npub || !pubkey) return <NotFound />;

  return (
    <div className="min-h-screen bg-background">
      <AppNav />

      <main className="container py-8 max-w-2xl">
        <Button
          variant="ghost"
          size="sm"
          className="mb-6 -ml-1"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4 mr-1.5" />
          Back
        </Button>

        {/* Contributor header */}
        <div className="rounded-2xl border border-border bg-card p-6 mb-8">
          <div className="flex items-start gap-4">
            {metadata?.picture ? (
              <img
                src={metadata.picture}
                alt={displayName}
                className="w-16 h-16 rounded-full object-cover flex-shrink-0"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center flex-shrink-0 text-xl font-bold text-muted-foreground">
                {displayName.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="min-w-0">
              <h1 className="text-xl font-bold text-foreground leading-tight">{displayName}</h1>
              {metadata?.nip05 && (
                <p className="text-sm text-muted-foreground mt-0.5">{metadata.nip05}</p>
              )}
              <p className="text-xs font-mono text-muted-foreground mt-1 break-all">{npub}</p>
              {metadata?.about && (
                <p className="text-sm text-muted-foreground mt-3">{metadata.about}</p>
              )}
              {metadata?.website && (
                <a
                  href={metadata.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs flex items-center gap-1 mt-2"
                  style={{ color: 'var(--intheno-brand)' }}
                >
                  <ExternalLink className="w-3 h-3" />
                  {metadata.website}
                </a>
              )}
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-border flex gap-4">
            <div className="text-center">
              <p className="text-xl font-bold text-foreground">{articles?.length ?? '—'}</p>
              <p className="text-xs text-muted-foreground">Articles</p>
            </div>
          </div>
        </div>

        {/* Articles */}
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
          Knowledge Contributions
        </h2>

        {isLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-20 rounded-xl" />)}
          </div>
        ) : !articles?.length ? (
          <div className="rounded-2xl border border-dashed border-border p-10 text-center">
            <BookOpen className="h-7 w-7 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground text-sm">No knowledge articles found for this contributor.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {articles.map(article => (
              <button
                key={article.id}
                onClick={() => navigate(`/search?q=${encodeURIComponent(article.question ?? article.title)}`)}
                className="w-full rounded-xl border border-border bg-card p-4 text-left hover:shadow-sm transition-all group"
              >
                <p className="text-sm font-semibold text-foreground group-hover:underline decoration-muted-foreground leading-snug">
                  {article.title}
                </p>
                {article.summary && (
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{article.summary}</p>
                )}
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(article.createdAt * 1000).toLocaleDateString('en-US', {
                      year: 'numeric', month: 'short', day: 'numeric'
                    })}
                  </span>
                  <span className="text-xs px-1.5 py-0.5 rounded-full bg-secondary text-secondary-foreground">
                    {article.category}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
