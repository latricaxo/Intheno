import { useNavigate } from 'react-router-dom';
import { useSeoMeta } from '@unhead/react';
import { useQuery } from '@tanstack/react-query';
import { useNostr } from '@nostrify/react';
import { AppNav } from '@/components/AppNav';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { parseNip54Event } from '@/lib/knowledge/nostrRepository';
import type { KnowledgeArticle } from '@/lib/knowledge/types';
import { PenLine, BookOpen, Clock, ExternalLink } from 'lucide-react';
import { LoginArea } from '@/components/auth/LoginArea';

export default function ContributionsPage() {
  const navigate = useNavigate();
  const { user } = useCurrentUser();
  const { nostr } = useNostr();

  useSeoMeta({
    title: 'My Contributions — INTHENO',
    description: 'Your published knowledge articles on INTHENO.',
  });

  const { data: articles, isLoading } = useQuery({
    queryKey: ['my-contributions', user?.pubkey],
    queryFn: async () => {
      if (!user?.pubkey) return [];
      const events = await nostr.query(
        [{ kinds: [30818], authors: [user.pubkey], limit: 50 }],
        { signal: AbortSignal.timeout(8000) }
      );
      return events
        .map(e => parseNip54Event(e))
        .filter((a): a is KnowledgeArticle => a !== null);
    },
    enabled: !!user?.pubkey,
    staleTime: 30_000,
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <AppNav />
        <div className="container py-16 max-w-lg text-center">
          <BookOpen className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-3">My Contributions</h1>
          <p className="text-muted-foreground mb-6">
            Sign in with your Nostr identity to see the knowledge you've contributed.
          </p>
          <LoginArea className="mx-auto w-full max-w-48" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AppNav />

      <main className="container py-8 max-w-2xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight mb-1">My Contributions</h1>
            <p className="text-muted-foreground text-sm">
              Knowledge you've published to the Nostr network.
            </p>
          </div>
          <Button
            onClick={() => navigate('/contribute')}
            style={{ background: 'var(--intheno-brand)' }}
            className="text-white hidden sm:flex"
          >
            <PenLine className="h-4 w-4 mr-2" />
            Contribute More
          </Button>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-20 rounded-xl" />)}
          </div>
        ) : !articles?.length ? (
          <div className="rounded-2xl border border-dashed border-border p-12 text-center">
            <BookOpen className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground mb-2">You haven't contributed any knowledge yet.</p>
            <p className="text-sm text-muted-foreground/70 mb-6">
              Share what you know with sourced, verifiable knowledge articles.
            </p>
            <Button
              onClick={() => navigate('/contribute')}
              style={{ background: 'var(--intheno-brand)' }}
              className="text-white"
            >
              <PenLine className="h-4 w-4 mr-2" />
              Contribute Knowledge
            </Button>
          </div>
        ) : (
          <>
            <p className="text-sm text-muted-foreground mb-4">
              {articles.length} article{articles.length !== 1 ? 's' : ''} published
            </p>
            <div className="space-y-3">
              {articles.map(article => (
                <ContributionItem
                  key={article.id}
                  article={article}
                  onView={() => navigate(`/search?q=${encodeURIComponent(article.question ?? article.title)}`)}
                />
              ))}
            </div>
          </>
        )}

        <Button
          onClick={() => navigate('/contribute')}
          style={{ background: 'var(--intheno-brand)' }}
          className="text-white mt-6 sm:hidden w-full"
        >
          <PenLine className="h-4 w-4 mr-2" />
          Contribute More
        </Button>
      </main>
    </div>
  );
}

function ContributionItem({
  article,
  onView,
}: {
  article: KnowledgeArticle;
  onView: () => void;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-start gap-3">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
          style={{ background: 'var(--intheno-brand-light)', color: 'var(--intheno-brand)' }}
        >
          <BookOpen className="w-4 h-4" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-foreground leading-snug">{article.title}</p>
          {article.summary && (
            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{article.summary}</p>
          )}
          <div className="flex items-center gap-3 mt-2">
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {new Date(article.createdAt * 1000).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
            </span>
            <span className="text-xs px-1.5 py-0.5 rounded-full bg-secondary text-secondary-foreground">
              {article.category}
            </span>
            {article.sources.length > 0 && (
              <span className="text-xs text-muted-foreground">{article.sources.length} source{article.sources.length !== 1 ? 's' : ''}</span>
            )}
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 flex-shrink-0"
          onClick={onView}
          aria-label="View article"
        >
          <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
        </Button>
      </div>
    </div>
  );
}
