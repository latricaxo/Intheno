import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSeoMeta } from '@unhead/react';
import { AppNav } from '@/components/AppNav';
import { Button } from '@/components/ui/button';
import { Search, ArrowRight, BookOpen, Users, Zap } from 'lucide-react';

const EXAMPLE_QUESTIONS = [
  'Why is the sky blue?',
  'How does photosynthesis work?',
  'What is the Pythagorean theorem?',
  'How does encryption work?',
  'What caused World War I?',
  'What is artificial intelligence?',
];

export default function Index() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  useSeoMeta({
    title: 'INTHENO — Stay in the Know',
    description: 'Ask questions. Discover open knowledge. See where the answers come from. Open knowledge, human contributions, traceable answers.',
  });

  const handleSearch = (q?: string) => {
    const search = (q ?? query).trim();
    if (!search) return;
    navigate(`/search?q=${encodeURIComponent(search)}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AppNav />

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12 sm:py-20">
        {/* Brand */}
        <div className="text-center mb-10 animate-fade-in">
          <div className="inline-flex items-center gap-3 mb-6">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center shadow-sm"
              style={{ background: 'var(--intheno-brand)' }}
            >
              <Search className="w-6 h-6 text-white" strokeWidth={2.5} />
            </div>
          </div>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-[-0.04em] text-foreground mb-4 leading-none">
            INTHENO
          </h1>
          <p className="text-xl sm:text-2xl text-muted-foreground font-light tracking-wide mb-2">
            What do you want to know?
          </p>
          <p className="text-sm text-muted-foreground/70 max-w-xs mx-auto">
            Open knowledge. Human contributions.{' '}
            <br />
            Traceable answers.
          </p>
        </div>

        {/* Search field */}
        <div className="w-full max-w-2xl animate-slide-up">
          <div className="relative group">
            <textarea
              className="w-full resize-none rounded-2xl border border-border bg-card px-5 py-4 pr-16 text-base text-foreground placeholder:text-muted-foreground/60 shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-transparent min-h-[60px] max-h-40"
              placeholder="Ask a question..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
              aria-label="Ask a question"
            />
            <Button
              onClick={() => handleSearch()}
              disabled={!query.trim()}
              className="absolute right-3 bottom-3 h-9 w-9 rounded-xl p-0"
              style={{ background: query.trim() ? 'var(--intheno-brand)' : undefined }}
              aria-label="Search knowledge"
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Example questions */}
          <div className="mt-5">
            <p className="text-xs text-muted-foreground/60 mb-3 text-center uppercase tracking-wider font-medium">
              Try asking
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {EXAMPLE_QUESTIONS.map(q => (
                <button
                  key={q}
                  onClick={() => handleSearch(q)}
                  className="text-sm px-3.5 py-1.5 rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-foreground/30 hover:bg-accent/60 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Feature highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-16 w-full max-w-2xl animate-slide-up">
          {[
            {
              icon: Users,
              title: 'Human Knowledge',
              desc: 'Every answer traces back to real contributors with real sources.',
            },
            {
              icon: BookOpen,
              title: 'Open & Portable',
              desc: 'Published on Nostr — decentralized, permanent, and not locked in.',
            },
            {
              icon: Zap,
              title: 'AI Synthesis',
              desc: 'AI explains what contributors have written — it doesn\'t invent.',
            },
          ].map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="rounded-xl border border-border bg-card p-4 text-center hover:border-border/80 transition-colors"
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center mx-auto mb-2"
                style={{ background: 'var(--intheno-brand-light)', color: 'var(--intheno-brand)' }}
              >
                <Icon className="w-4 h-4" />
              </div>
              <p className="text-sm font-semibold text-foreground mb-1">{title}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6 px-4">
        <div className="container flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            © 2026 INTHENO · Open knowledge for everyone
          </p>
          <a
            href="https://shakespeare.diy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Vibed with Shakespeare
          </a>
        </div>
      </footer>
    </div>
  );
}
