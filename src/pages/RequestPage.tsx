import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useSeoMeta } from '@unhead/react';
import { AppNav } from '@/components/AppNav';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { HelpCircle, CheckCircle, PenLine, Clock } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface KnowledgeRequest {
  id: string;
  question: string;
  askedAt: number;
  status: 'open';
}

export default function RequestPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [question, setQuestion] = useState(searchParams.get('q') ?? '');
  const [submitted, setSubmitted] = useState(false);
  const [requests, setRequests] = useLocalStorage<KnowledgeRequest[]>('intheno:requests', []);

  useSeoMeta({
    title: 'Request Knowledge — INTHENO',
    description: 'Submit a question that INTHENO doesn\'t yet have an answer for.',
  });

  const handleSubmit = () => {
    if (!question.trim()) return;
    const newRequest: KnowledgeRequest = {
      id: Math.random().toString(36).slice(2),
      question: question.trim(),
      askedAt: Math.floor(Date.now() / 1000),
      status: 'open',
    };
    setRequests(r => [newRequest, ...r]);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background">
        <AppNav />
        <div className="container py-16 max-w-lg text-center">
          <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-950 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-3">Request Saved</h1>
          <p className="text-muted-foreground mb-8">
            Your question has been noted. You can help fill this knowledge gap by contributing what you know.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={() => navigate(`/contribute?topic=${encodeURIComponent(question)}`)}
              style={{ background: 'var(--intheno-brand)' }}
              className="text-white"
            >
              <PenLine className="h-4 w-4 mr-2" />
              Contribute an Answer
            </Button>
            <Button variant="outline" onClick={() => { setSubmitted(false); setQuestion(''); }}>
              Request Another
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AppNav />

      <main className="container py-8 max-w-lg">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <HelpCircle className="h-5 w-5" style={{ color: 'var(--intheno-brand)' }} />
            <h1 className="text-2xl font-bold text-foreground tracking-tight">Request Knowledge</h1>
          </div>
          <p className="text-muted-foreground">
            What knowledge is missing? Submit a question that the network can't yet answer.
          </p>
        </div>

        <div className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="question" className="font-semibold">
              Your Question <span className="text-destructive">*</span>
            </Label>
            <Input
              id="question"
              value={question}
              onChange={e => setQuestion(e.target.value)}
              placeholder="What question needs an answer?"
              className="text-base"
              onKeyDown={e => { if (e.key === 'Enter') handleSubmit(); }}
            />
          </div>

          <Button
            onClick={handleSubmit}
            disabled={!question.trim()}
            className="w-full text-white"
            style={{ background: 'var(--intheno-brand)' }}
          >
            Submit Request
          </Button>
        </div>

        {/* Open requests */}
        {requests.length > 0 && (
          <div className="mt-10">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
              Knowledge Requested
            </h2>
            <div className="space-y-2">
              {requests.map(req => (
                <div key={req.id} className="rounded-xl border border-border bg-card p-4 flex items-start gap-3">
                  <HelpCircle className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{req.question}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(req.askedAt * 1000).toLocaleDateString()}
                      </span>
                      <span className="text-xs px-1.5 py-0.5 rounded-full border border-border text-muted-foreground">
                        Knowledge needed
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs flex-shrink-0"
                    onClick={() => navigate(`/contribute?topic=${encodeURIComponent(req.question)}`)}
                  >
                    Answer
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
