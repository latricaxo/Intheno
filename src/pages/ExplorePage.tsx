import { useNavigate } from 'react-router-dom';
import { useSeoMeta } from '@unhead/react';
import { useQuery } from '@tanstack/react-query';
import { AppNav } from '@/components/AppNav';
import { Skeleton } from '@/components/ui/skeleton';
import { KNOWLEDGE_CATEGORIES } from '@/lib/knowledge/types';
import { useNostrKnowledgeRepo } from '@/hooks/useNostrKnowledge';
import type { KnowledgeArticle } from '@/lib/knowledge/types';
import { FlaskConical, Calculator, Landmark, Cpu, Leaf, Globe, Brain, TrendingUp, Palette, Heart } from 'lucide-react';

const CATEGORY_META: Record<string, { icon: React.FC<{ className?: string }>; color: string; bg: string }> = {
  Science:     { icon: FlaskConical,  color: 'hsl(200 65% 45%)', bg: 'hsl(200 65% 95%)' },
  Mathematics: { icon: Calculator,   color: 'hsl(250 55% 52%)', bg: 'hsl(250 55% 95%)' },
  History:     { icon: Landmark,     color: 'hsl(30 70% 48%)',  bg: 'hsl(30 70% 95%)' },
  Technology:  { icon: Cpu,          color: 'hsl(220 55% 45%)', bg: 'hsl(220 55% 95%)' },
  Nature:      { icon: Leaf,         color: 'hsl(140 55% 40%)', bg: 'hsl(140 55% 95%)' },
  Geography:   { icon: Globe,        color: 'hsl(180 55% 40%)', bg: 'hsl(180 55% 95%)' },
  Philosophy:  { icon: Brain,        color: 'hsl(290 45% 50%)', bg: 'hsl(290 45% 95%)' },
  Economics:   { icon: TrendingUp,   color: 'hsl(40 70% 45%)',  bg: 'hsl(40 70% 95%)' },
  Arts:        { icon: Palette,      color: 'hsl(340 60% 48%)', bg: 'hsl(340 60% 95%)' },
  Health:      { icon: Heart,        color: 'hsl(0 65% 50%)',   bg: 'hsl(0 65% 95%)' },
};

export default function ExplorePage() {
  const navigate = useNavigate();
  const repo = useNostrKnowledgeRepo();

  useSeoMeta({
    title: 'Explore Knowledge — INTHENO',
    description: 'Browse the open knowledge library. Explore categories from science to history to philosophy.',
  });

  const { data: featured, isLoading: featuredLoading } = useQuery({
    queryKey: ['knowledge-featured'],
    queryFn: () => repo.getFeatured(6),
    staleTime: 120_000,
  });

  const { data: recent, isLoading: recentLoading } = useQuery({
    queryKey: ['knowledge-recent'],
    queryFn: () => repo.getRecent(8),
    staleTime: 60_000,
  });

  return (
    <div className="min-h-screen bg-background">
      <AppNav />

      <main className="container py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground tracking-tight mb-2">Explore Knowledge</h1>
          <p className="text-muted-foreground">
            A library of human-contributed, sourced knowledge. Browse by category or discover recent additions.
          </p>
        </div>

        {/* Categories */}
        <section className="mb-10" aria-labelledby="categories-heading">
          <h2 id="categories-heading" className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
            Categories
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {KNOWLEDGE_CATEGORIES.map(cat => {
              const meta = CATEGORY_META[cat];
              const Icon = meta?.icon;
              return (
                <button
                  key={cat}
                  onClick={() => navigate(`/category/${cat.toLowerCase()}`)}
                  className="rounded-xl border border-border bg-card p-4 flex flex-col items-center gap-2 hover:border-opacity-80 hover:shadow-sm transition-all text-center group"
                >
                  {Icon && (
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ background: meta.bg, color: meta.color }}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                  )}
                  <span className="text-sm font-medium text-foreground group-hover:text-foreground">{cat}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Featured articles */}
        <section className="mb-10" aria-labelledby="featured-heading">
          <h2 id="featured-heading" className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
            Featured Knowledge
          </h2>
          {featuredLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-24 rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(featured ?? []).map(article => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          )}
        </section>

        {/* Recently updated */}
        <section aria-labelledby="recent-heading">
          <h2 id="recent-heading" className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
            Recently Updated
          </h2>
          {recentLoading ? (
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-16 rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {(recent ?? []).map(article => (
                <ArticleListItem key={article.id} article={article} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

function ArticleCard({ article }: { article: KnowledgeArticle }) {
  const navigate = useNavigate();
  const meta = CATEGORY_META[article.category];

  return (
    <button
      onClick={() => navigate(`/search?q=${encodeURIComponent(article.question ?? article.title)}`)}
      className="rounded-xl border border-border bg-card p-4 text-left hover:border-opacity-80 hover:shadow-sm transition-all group"
    >
      <div className="flex items-start gap-3">
        {meta?.icon && (
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
            style={{ background: meta.bg, color: meta.color }}
          >
            <meta.icon className="w-4 h-4" />
          </div>
        )}
        <div className="min-w-0">
          <p className="text-sm font-semibold text-foreground leading-snug line-clamp-1 group-hover:underline decoration-muted-foreground">
            {article.title}
          </p>
          {article.summary && (
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{article.summary}</p>
          )}
        </div>
      </div>
    </button>
  );
}

function ArticleListItem({ article }: { article: KnowledgeArticle }) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(`/search?q=${encodeURIComponent(article.question ?? article.title)}`)}
      className="w-full rounded-xl border border-border bg-card px-4 py-3 text-left flex items-center gap-3 hover:border-opacity-80 transition-all group"
    >
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-foreground leading-tight line-clamp-1 group-hover:underline decoration-muted-foreground">
          {article.title}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">{article.category} · {article.author.displayName}</p>
      </div>
      <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground flex-shrink-0">
        {article.category}
      </span>
    </button>
  );
}
