import { useParams, useNavigate } from 'react-router-dom';
import { useSeoMeta } from '@unhead/react';
import { useQuery } from '@tanstack/react-query';
import { AppNav } from '@/components/AppNav';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useNostrKnowledgeRepo } from '@/hooks/useNostrKnowledge';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { KnowledgeCard } from '@/components/KnowledgeCard';
import { useKnowledgeSynthesis } from '@/hooks/useKnowledgeSynthesis';
import { useState, useEffect } from 'react';

export default function KnowledgeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const repo = useNostrKnowledgeRepo();
  const { synthesize, isSynthesizing } = useKnowledgeSynthesis();
  const [synthesis, setSynthesis] = useState<{ answer: string; aiUnavailable?: boolean } | null>(null);

  const { data: article, isLoading } = useQuery({
    queryKey: ['knowledge-article', id],
    queryFn: () => repo.getById(id!),
    enabled: !!id,
    staleTime: 120_000,
  });

  useSeoMeta({
    title: article ? `${article.title} — INTHENO` : 'Knowledge Article — INTHENO',
    description: article?.summary,
  });

  useEffect(() => {
    if (article && !synthesis) {
      synthesize(article.question ?? article.title, [article]).then(setSynthesis);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [article?.id]);

  return (
    <div className="min-h-screen bg-background">
      <AppNav />

      <div className="container py-6 max-w-3xl">
        <Button
          variant="ghost"
          size="sm"
          className="mb-6 -ml-1"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4 mr-1.5" />
          Back
        </Button>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-48 rounded-2xl" />
          </div>
        ) : !article ? (
          <div className="text-center py-16">
            <BookOpen className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">Knowledge article not found.</p>
          </div>
        ) : synthesis ? (
          <KnowledgeCard
            question={article.question ?? article.title}
            synthesis={synthesis}
            articles={[article]}
            hasConflicts={false}
            relayStatus={article.relaySources?.length ? 'all_ok' : 'not_queried'}
          />
        ) : isSynthesizing ? (
          <div className="space-y-3 animate-pulse">
            <Skeleton className="h-7 w-1/2" />
            <Skeleton className="h-32 rounded-2xl" />
          </div>
        ) : null}
      </div>
    </div>
  );
}
