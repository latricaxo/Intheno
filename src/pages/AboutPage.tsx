import { useSeoMeta } from '@unhead/react';
import { AppNav } from '@/components/AppNav';
import { Users, BookOpen, Zap, Search, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function AboutPage() {
  useSeoMeta({
    title: 'About INTHENO — Open Knowledge Network',
    description: 'INTHENO is an open knowledge network where people contribute sourced information and anyone can ask questions and discover where answers come from.',
  });

  return (
    <div className="min-h-screen bg-background">
      <AppNav />

      <main className="container py-12 max-w-2xl">
        {/* Hero */}
        <div className="mb-12">
          <h1 className="text-4xl font-extrabold tracking-[-0.04em] text-foreground mb-4 leading-tight">
            Knowledge should be open.
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            INTHENO is an open knowledge network where people contribute sourced information
            and anyone can ask questions and discover where answers come from.
          </p>
        </div>

        {/* How it works */}
        <section className="mb-12 space-y-6">
          {[
            {
              icon: Users,
              title: 'People contribute knowledge.',
              desc: 'Anyone can write and publish knowledge articles with sources. Contributors receive attribution for their work — permanently, on an open network.',
            },
            {
              icon: BookOpen,
              title: 'Nostr keeps contributions open and portable.',
              desc: 'Knowledge articles are published as NIP-54 events on Nostr — a decentralized protocol. No single company controls them. They exist across multiple relays.',
            },
            {
              icon: Zap,
              title: 'AI makes knowledge understandable.',
              desc: 'When you ask a question, AI synthesizes the retrieved knowledge into a clear answer. But the AI is not the source of truth — the contributors and their sources are.',
            },
            {
              icon: Search,
              title: 'Sources and contributors remain visible.',
              desc: 'Every Knowledge Card shows you who contributed the information and where their sources come from. You can inspect the underlying Nostr record at any time.',
            },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex gap-4">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ background: 'var(--intheno-brand-light)', color: 'var(--intheno-brand)' }}
              >
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold text-foreground">{title}</p>
                <p className="text-sm text-muted-foreground mt-0.5 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </section>

        {/* AI disclaimer */}
        <div className="rounded-2xl border border-border bg-card p-6 mb-12">
          <div className="flex gap-3">
            <Shield className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-foreground mb-2">The AI is not the source of truth.</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                AI in INTHENO synthesizes what human contributors have written. It does not invent facts,
                fabricate sources, or pretend that AI-generated answers are independently verified.
                If knowledge is missing, INTHENO says so honestly:{' '}
                <em className="text-foreground not-italic font-medium">We don't know yet.</em>
              </p>
            </div>
          </div>
        </div>

        {/* The experience */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-foreground mb-4">ASK → FIND → UNDERSTAND → VERIFY</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">
            The fundamental interaction is simple: ask a question, find relevant knowledge,
            understand the answer in plain language, and verify where it comes from.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            No centralized account is required to read. No blockchain transactions are needed.
            To contribute, you only need a Nostr identity — which you can create directly inside INTHENO.
          </p>
        </section>

        {/* Built on */}
        <section className="rounded-2xl border border-border bg-muted/30 p-6 mb-12">
          <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Built on</p>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p><span className="font-medium text-foreground">NIP-54</span> — Knowledge articles (kind 30818) published on Nostr</p>
            <p><span className="font-medium text-foreground">NIP-07</span> — Browser signer support for existing Nostr users</p>
            <p><span className="font-medium text-foreground">NIP-01</span> — Standard Nostr event model</p>
            <p><span className="font-medium text-foreground">Shakespeare AI</span> — AI synthesis grounded in retrieved knowledge</p>
          </div>
        </section>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link to="/">
            <Button style={{ background: 'var(--intheno-brand)' }} className="text-white">
              Ask a Question
            </Button>
          </Link>
          <Link to="/contribute">
            <Button variant="outline">
              Contribute Knowledge
            </Button>
          </Link>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-6 border-t border-border text-center">
          <p className="text-xs text-muted-foreground">
            INTHENO ·{' '}
            <a
              href="https://shakespeare.diy"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              Vibed with Shakespeare
            </a>
          </p>
        </div>
      </main>
    </div>
  );
}
