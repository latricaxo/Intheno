import { useState } from 'react';
import { useSeoMeta } from '@unhead/react';
import { AppNav } from '@/components/AppNav';
import { Bitcoin, Copy, Check, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

const BITCOIN_ADDRESS = 'bc1qjzmz6dpxn333levddqgum7p8l683tc9lhsfhmf';

export default function SupportPage() {
  const [copied, setCopied] = useState(false);

  useSeoMeta({
    title: 'Support INTHENO — Keep Knowledge Open',
    description: 'Support INTHENO with Bitcoin. Help keep open knowledge free and traceable for everyone.',
  });

  const handleCopy = () => {
    navigator.clipboard.writeText(BITCOIN_ADDRESS).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <AppNav />

      <main className="container py-12 max-w-lg">
        {/* Header */}
        <div className="text-center mb-10">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-sm"
            style={{ background: 'var(--intheno-brand)' }}
          >
            <Heart className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground mb-3">
            Support INTHENO
          </h1>
          <p className="text-muted-foreground leading-relaxed">
            INTHENO is built to keep knowledge open, traceable, and free from central control.
            If it's useful to you, a Bitcoin contribution helps keep it running and growing.
          </p>
        </div>

        {/* Bitcoin card */}
        <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm mb-8">
          <div className="flex items-center gap-2.5 px-5 py-3 border-b border-border bg-secondary/30">
            <Bitcoin className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Bitcoin Address
            </span>
          </div>

          <div className="px-5 py-6">
            <p className="text-xs text-muted-foreground mb-3">
              Send any amount of Bitcoin to this address. Every satoshi helps.
            </p>

            {/* Address display */}
            <div className="rounded-xl bg-muted px-4 py-3.5 flex items-center gap-3">
              <p className="text-sm font-mono text-foreground break-all flex-1 leading-relaxed select-all">
                {BITCOIN_ADDRESS}
              </p>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 flex-shrink-0"
                onClick={handleCopy}
                aria-label="Copy Bitcoin address"
              >
                {copied
                  ? <Check className="h-4 w-4 text-green-600" />
                  : <Copy className="h-4 w-4 text-muted-foreground" />
                }
              </Button>
            </div>

            {copied && (
              <p className="text-xs text-green-600 mt-2 text-center font-medium">
                Address copied to clipboard
              </p>
            )}

            <p className="text-xs text-muted-foreground/70 mt-4 text-center">
              This is a native Bitcoin (on-chain) address. Do not send tokens from other networks.
            </p>
          </div>
        </div>

        {/* Why it matters */}
        <div className="rounded-xl border border-border bg-muted/30 p-5 space-y-3">
          <p className="text-sm font-semibold text-foreground">Why support INTHENO?</p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-foreground mt-0.5">·</span>
              INTHENO is free to use — no ads, no subscriptions, no paywalls.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-foreground mt-0.5">·</span>
              Knowledge is published to Nostr — open, portable, not locked to any platform.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-foreground mt-0.5">·</span>
              Contributors receive full attribution. No corporate middleman.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-foreground mt-0.5">·</span>
              Your support helps cover infrastructure, AI synthesis, and development.
            </li>
          </ul>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-8">
          Thank you for keeping knowledge open.
        </p>
      </main>
    </div>
  );
}
