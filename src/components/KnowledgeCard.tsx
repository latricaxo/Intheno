import { useState } from 'react';
import { Link } from 'react-router-dom';
import { nip19 } from 'nostr-tools';
import {
  ChevronDown,
  ChevronUp,
  ExternalLink,
  AlertTriangle,
  Copy,
  Check,
  BookOpen,
  Users,
  Link2,
  Code2,
  Info,
  Zap,
  Clock,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { KnowledgeArticle } from '@/lib/knowledge/types';

import { sanitizeUrl } from '@/lib/sanitize';

interface KnowledgeCardProps {
  question: string;
  synthesis: {
    answer: string;
    aiUnavailable?: boolean;
    insufficientKnowledge?: boolean;
  };
  articles: KnowledgeArticle[];
  hasConflicts: boolean;
  relayStatus: string;
}

export function KnowledgeCard({
  question,
  synthesis,
  articles,
  hasConflicts,
}: KnowledgeCardProps) {
  const [showSources, setShowSources] = useState(false);
  const [showArticles, setShowArticles] = useState(false);
  const [showContributors, setShowContributors] = useState(false);
  const [expandedArticle, setExpandedArticle] = useState<string | null>(null);

  const allSources = articles.flatMap(a => a.sources);
  const uniqueSources = deduplicateSources(allSources);
  const uniqueContributors = deduplicateContributors(articles);
  const allTags = [...new Set(articles.flatMap(a => a.tags))].slice(0, 8);
  const allRelated = [...new Set(articles.flatMap(a => a.related))].slice(0, 5);

  return (
    <div className="space-y-3 animate-slide-up">
      {/* Question header */}
      <h1 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight leading-snug">
        {formatQuestion(question)}
      </h1>

      {/* AI Synthesis Card */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
        {/* Answer header */}
        <div className="flex items-center gap-2 px-5 py-3 border-b border-border bg-secondary/30">
          <div
            className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0"
            style={{ background: 'var(--intheno-brand)' }}
          >
            <Zap className="w-3 h-3 text-white" />
          </div>
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Knowledge Summary
          </span>
          {synthesis.aiUnavailable && (
            <span className="ml-auto text-xs text-muted-foreground/60 flex items-center gap-1">
              <Info className="w-3 h-3" />
              From article summaries
            </span>
          )}
        </div>

        {/* Answer body */}
        <div className="px-5 py-5">
          {synthesis.answer ? (
            <div className="prose-intheno text-base leading-relaxed whitespace-pre-wrap">
              {synthesis.answer}
            </div>
          ) : (
            <p className="text-muted-foreground italic text-sm">
              No AI summary available. See the Knowledge Articles below.
            </p>
          )}

          {synthesis.aiUnavailable && !synthesis.insufficientKnowledge && (
            <div className="mt-4 flex items-start gap-2 p-3 rounded-lg bg-muted/50 text-xs text-muted-foreground">
              <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
              <span>
                This summary was generated from article content. Log in with a Nostr account for AI-synthesized answers.
              </span>
            </div>
          )}
        </div>

        {/* Conflict warning */}
        {hasConflicts && (
          <div className="mx-5 mb-4 rounded-lg border border-amber-200 bg-amber-50 dark:border-amber-900/30 dark:bg-amber-950/20 p-3 flex gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-amber-800 dark:text-amber-400">Conflicting Knowledge</p>
              <p className="text-xs text-amber-700 dark:text-amber-500 mt-0.5">
                Multiple contributors have written about this topic with different perspectives. See the articles below.
              </p>
            </div>
          </div>
        )}

        {/* Sources section */}
        {uniqueSources.length > 0 && (
          <div className="border-t border-border">
            <button
              onClick={() => setShowSources(o => !o)}
              className="w-full flex items-center justify-between px-5 py-3 text-sm font-medium text-foreground hover:bg-muted/40 transition-colors"
              aria-expanded={showSources}
            >
              <span className="flex items-center gap-2">
                <Link2 className="w-4 h-4 text-muted-foreground" />
                Sources
                <span className="text-xs text-muted-foreground font-normal">({uniqueSources.length})</span>
              </span>
              {showSources ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
            </button>
            {showSources && (
              <div className="px-5 pb-4 space-y-2">
                {uniqueSources.map((source, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded bg-muted flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-mono text-muted-foreground">{i + 1}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground leading-tight">{source.name}</p>
                      {source.title && <p className="text-xs text-muted-foreground mt-0.5">{source.title}</p>}
                      {source.url && (
                        <a
                          href={sanitizeUrl(source.url)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs flex items-center gap-1 mt-1"
                          style={{ color: 'var(--intheno-brand)' }}
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span className="truncate">{source.url}</span>
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Knowledge articles */}
        <div className="border-t border-border">
          <button
            onClick={() => setShowArticles(o => !o)}
            className="w-full flex items-center justify-between px-5 py-3 text-sm font-medium text-foreground hover:bg-muted/40 transition-colors"
            aria-expanded={showArticles}
          >
            <span className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-muted-foreground" />
              Knowledge Articles
              <span className="text-xs text-muted-foreground font-normal">({articles.length})</span>
            </span>
            {showArticles ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
          </button>
          {showArticles && (
            <div className="px-5 pb-4 space-y-3">
              {articles.map(article => (
                <ArticlePreview
                  key={article.id}
                  article={article}
                  expanded={expandedArticle === article.id}
                  onToggle={() => setExpandedArticle(
                    expandedArticle === article.id ? null : article.id
                  )}
                />
              ))}
            </div>
          )}
        </div>

        {/* Contributors */}
        {uniqueContributors.length > 0 && (
          <div className="border-t border-border">
            <button
              onClick={() => setShowContributors(o => !o)}
              className="w-full flex items-center justify-between px-5 py-3 text-sm font-medium text-foreground hover:bg-muted/40 transition-colors"
              aria-expanded={showContributors}
            >
              <span className="flex items-center gap-2">
                <Users className="w-4 h-4 text-muted-foreground" />
                Contributors
                <span className="text-xs text-muted-foreground font-normal">({uniqueContributors.length})</span>
              </span>
              {showContributors ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
            </button>
            {showContributors && (
              <div className="px-5 pb-4 space-y-2">
                {uniqueContributors.map(contributor => (
                  <Link
                    key={contributor.pubkey}
                    to={`/contributor/${contributor.npub}`}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/40 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0 text-sm font-bold text-muted-foreground">
                      {contributor.displayName.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{contributor.displayName}</p>
                      {contributor.nip05 ? (
                        <p className="text-xs text-muted-foreground truncate">{contributor.nip05}</p>
                      ) : (
                        <p className="text-xs text-muted-foreground font-mono truncate">{contributor.npub.slice(0, 20)}…</p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Footer meta */}
        <div className="border-t border-border px-5 py-3 flex flex-wrap gap-4 items-center">
          <span className="text-xs text-muted-foreground flex items-center gap-1.5">
            <Clock className="w-3 h-3" />
            Updated {formatDate(articles[0]?.updatedAt ?? 0)}
          </span>
          {articles[0]?.isDemo && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">
              Demo Content
            </span>
          )}
        </div>
      </div>

      {/* Tags */}
      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {allTags.map(tag => (
            <Link
              key={tag}
              to={`/search?q=${encodeURIComponent(tag)}`}
              className="text-xs px-2.5 py-1 rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
            >
              {tag}
            </Link>
          ))}
        </div>
      )}

      {/* Related knowledge */}
      {allRelated.length > 0 && (
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Related Knowledge</p>
          <div className="flex flex-wrap gap-2">
            {allRelated.map(r => (
              <Link
                key={r}
                to={`/search?q=${encodeURIComponent(r)}`}
                className="text-sm px-3 py-1.5 rounded-lg border border-border text-foreground hover:bg-accent transition-colors"
              >
                {r}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ArticlePreview({
  article,
  expanded,
  onToggle,
}: {
  article: KnowledgeArticle;
  expanded: boolean;
  onToggle: () => void;
}) {
  const [copied, setCopied] = useState(false);

  const copyEventId = () => {
    navigator.clipboard.writeText(article.id).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  let naddrStr = '';
  if (article.nostrEvent) {
    try {
      naddrStr = nip19.naddrEncode({
        kind: 30818,
        pubkey: article.nostrEvent.pubkey,
        identifier: article.subject,
        relays: article.relaySources?.slice(0, 2),
      });
    } catch {
      naddrStr = '';
    }
  }

  return (
    <div className="rounded-xl border border-border overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-start gap-3 p-3 text-left hover:bg-muted/40 transition-colors"
        aria-expanded={expanded}
      >
        <div
          className="w-6 h-6 rounded flex items-center justify-center flex-shrink-0 mt-0.5"
          style={{ background: 'var(--intheno-brand-light)', color: 'var(--intheno-brand)' }}
        >
          <BookOpen className="w-3 h-3" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-foreground leading-tight">{article.title}</p>
          {article.summary && (
            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{article.summary}</p>
          )}
        </div>
        {expanded ? <ChevronUp className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-1" /> : <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-1" />}
      </button>

      {expanded && (
        <div className="px-3 pb-3 border-t border-border pt-3 space-y-3">
          {/* Article content */}
          <div className="prose-intheno text-sm max-h-64 overflow-y-auto">
            {article.content.slice(0, 1500)}
            {article.content.length > 1500 && '…'}
          </div>

          {/* Nostr Record */}
          {article.nostrEvent && (
            <details className="group">
              <summary className="flex items-center gap-1.5 cursor-pointer text-xs font-medium text-muted-foreground hover:text-foreground transition-colors list-none select-none">
                <Code2 className="w-3.5 h-3.5" />
                Nostr Record
                <ChevronDown className="w-3 h-3 group-open:rotate-180 transition-transform" />
              </summary>
              <div className="mt-2 rounded-lg bg-muted p-3 text-xs font-mono space-y-1.5 overflow-hidden">
                <NostrRecordRow label="Kind" value="30818 (NIP-54 Wiki)" />
                <NostrRecordRow label="Event ID" value={article.nostrEvent.id} copyable onCopy={copyEventId} copied={copied} />
                <NostrRecordRow label="Author" value={article.nostrEvent.pubkey} />
                <NostrRecordRow label="Subject" value={article.subject} />
                {naddrStr && <NostrRecordRow label="NIP-19 Address" value={naddrStr} />}
                {article.relaySources?.map(r => (
                  <NostrRecordRow key={r} label="Relay" value={r} />
                ))}
              </div>
            </details>
          )}
        </div>
      )}
    </div>
  );
}

function NostrRecordRow({
  label,
  value,
  copyable,
  onCopy,
  copied,
}: {
  label: string;
  value: string;
  copyable?: boolean;
  onCopy?: () => void;
  copied?: boolean;
}) {
  return (
    <div className="flex items-start gap-2">
      <span className="text-muted-foreground flex-shrink-0 w-28">{label}:</span>
      <span className="text-foreground break-all flex-1">{value}</span>
      {copyable && onCopy && (
        <button
          onClick={onCopy}
          className="flex-shrink-0 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Copy to clipboard"
        >
          {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
        </button>
      )}
    </div>
  );
}

// Helpers
function formatQuestion(q: string): string {
  if (!q) return '';
  const trimmed = q.trim();
  // Capitalize first letter
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
}

function formatDate(ts: number): string {
  if (!ts) return 'Unknown';
  const d = new Date(ts * 1000);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function deduplicateSources(sources: KnowledgeArticle['sources']): KnowledgeArticle['sources'] {
  const seen = new Set<string>();
  return sources.filter(s => {
    const key = s.url ?? s.name;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function deduplicateContributors(articles: KnowledgeArticle[]) {
  const seen = new Set<string>();
  return articles
    .map(a => a.author)
    .filter(c => {
      if (seen.has(c.pubkey)) return false;
      seen.add(c.pubkey);
      return true;
    });
}
