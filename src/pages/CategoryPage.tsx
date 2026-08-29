import { useParams, useNavigate } from 'react-router-dom';
import { useSeoMeta } from '@unhead/react';
import { useQuery } from '@tanstack/react-query';
import { AppNav } from '@/components/AppNav';
import { Skeleton } from '@/components/ui/skeleton';
import { useNostrKnowledgeRepo } from '@/hooks/useNostrKnowledge';
import type { KnowledgeArticle } from '@/lib/knowledge/types';
import { KNOWLEDGE_CATEGORIES } from '@/lib/knowledge/types';
import NotFound from './NotFound';
import { BookOpen, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CategoryPage() {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();
  const repo = useNostrKnowledgeRepo();

  // Find proper-cased category
  const properCategory = KNOWLEDGE_CATEGORIES.find(
    c => c.toLowerCase() === (category ?? '').toLowerCase()
  );

  useSeoMeta({
    title: properCategory ? `${properCategory} — INTHENO` : 'Category — INTHENO',
    description: `Explore ${properCategory} knowledge articles on INTHENO.`,
  });

  const { data: articles, isLoading } = useQuery({
    queryKey: ['knowledge-category', properCategory],
    queryFn: () => repo.getByCategory(properCategory!),
    enabled: !!properCategory,
    staleTime: 120_000,
  });

  if (!properCategory) return <NotFound />;

  return (
    <div className="min-h-screen bg-background">
      <AppNav />

      <main className="container py-8 max-w-3xl">
        {/* Back */}
        <Button
          variant="ghost"
          size="sm"
          className="mb-6 -ml-1"
          onClick={() => navigate('/explore')}
        >
          <ArrowLeft className="h-4 w-4 mr-1.5" />
          Explore
        </Button>

        <h1 className="text-3xl font-bold text-foreground tracking-tight mb-2">{properCategory}</h1>
        <p className="text-muted-foreground mb-8">
          {articles?.length ?? 0} knowledge article{articles?.length !== 1 ? 's' : ''} in this category.
        </p>

        {isLoading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-20 rounded-xl" />)}
          </div>
        ) : !articles?.length ? (
          <div className="rounded-2xl border border-dashed border-border p-12 text-center">
            <BookOpen className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No knowledge articles yet in {properCategory}.</p>
            <Button
              className="mt-4"
              style={{ background: 'var(--intheno-brand)' }}
              onClick={() => navigate('/contribute')}
            >
              Contribute First Article
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {articles.map(article => (
              <CategoryArticleItem key={article.id} article={article} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function CategoryArticleItem({ article }: { article: KnowledgeArticle }) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(`/search?q=${encodeURIComponent(article.question ?? article.title)}`)}
      className="w-full rounded-xl border border-border bg-card p-4 text-left hover:shadow-sm transition-all group"
    >
      <p className="text-base font-semibold text-foreground leading-snug group-hover:underline decoration-muted-foreground">
        {article.title}
      </p>
      {article.summary && (
        <p className="text-sm text-muted-foreground mt-1.5 line-clamp-2">{article.summary}</p>
      )}
      <div className="flex items-center gap-3 mt-3">
        <span className="text-xs text-muted-foreground">{article.author.displayName}</span>
        {article.sources.length > 0 && (
          <span className="text-xs text-muted-foreground">
            {article.sources.length} source{article.sources.length !== 1 ? 's' : ''}
          </span>
        )}
        {article.isDemo && (
          <span className="text-xs px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground">Demo</span>
        )}
      </div>
    </button>
  );
}
