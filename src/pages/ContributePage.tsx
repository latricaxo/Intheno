import { useState, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useSeoMeta } from '@unhead/react';
import { AppNav } from '@/components/AppNav';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useNostrPublish } from '@/hooks/useNostrPublish';
import { KNOWLEDGE_CATEGORIES } from '@/lib/knowledge/types';
import { normalizeToSubject } from '@/lib/knowledge/repository';
import { sanitizeUrl } from '@/lib/sanitize';
import { PenLine, Plus, Trash2, CheckCircle, AlertTriangle, Shield, User } from 'lucide-react';
import { useLoginActions } from '@/hooks/useLoginActions';
import { generateSecretKey, getPublicKey, nip19 } from 'nostr-tools';

interface SourceEntry {
  id: string;
  name: string;
  title: string;
  url: string;
}

function makeSourceId() {
  return Math.random().toString(36).slice(2);
}

export default function ContributePage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useCurrentUser();
  const { mutateAsync: publish, isPending: isPublishing } = useNostrPublish();

  useSeoMeta({
    title: 'Contribute Knowledge — INTHENO',
    description: 'Share what you know. Contribute sourced knowledge to the open INTHENO network.',
  });

  const [topic, setTopic] = useState(searchParams.get('topic') ?? '');
  const [question, setQuestion] = useState(searchParams.get('topic') ?? '');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Science');
  const [tags, setTags] = useState('');
  const [sources, setSources] = useState<SourceEntry[]>([
    { id: makeSourceId(), name: '', title: '', url: '' },
  ]);
  const [showIdentityDialog, setShowIdentityDialog] = useState(false);
  const [publishedId, setPublishedId] = useState<string | null>(null);
  const [publishError, setPublishError] = useState<string | null>(null);

  const addSource = () => setSources(s => [...s, { id: makeSourceId(), name: '', title: '', url: '' }]);
  const removeSource = (id: string) => setSources(s => s.filter(x => x.id !== id));
  const updateSource = (id: string, field: keyof SourceEntry, value: string) =>
    setSources(s => s.map(x => x.id === id ? { ...x, [field]: value } : x));

  const validate = (): string | null => {
    if (!topic.trim()) return 'Topic is required.';
    if (!content.trim() || content.trim().length < 100) return 'Knowledge content must be at least 100 characters.';
    for (const s of sources) {
      if (s.url && !isValidUrl(s.url)) return `Invalid URL: ${s.url}`;
    }
    return null;
  };

  const handlePublish = useCallback(async () => {
    if (!user) {
      setShowIdentityDialog(true);
      return;
    }

    const err = validate();
    if (err) { setPublishError(err); return; }

    setPublishError(null);

    const subject = normalizeToSubject(topic);
    const tagList: string[][] = [
      ['d', subject],
      ['title', topic.trim()],
    ];

    if (question.trim()) tagList.push(['summary', question.trim()]);
    tagList.push(['t', category.toLowerCase()]);

    const extraTags = tags.split(',').map(t => t.trim()).filter(Boolean);
    for (const t of extraTags) tagList.push(['t', t.toLowerCase()]);

    for (const s of sources) {
      if (s.url && isValidUrl(s.url)) {
        tagList.push(['r', s.url, s.title || s.name || '']);
      }
    }

    tagList.push(['alt', `Knowledge article about: ${topic.trim()}`]);

    try {
      const event = await publish({
        kind: 30818,
        content: content.trim(),
        tags: tagList,
      });
      setPublishedId(event.id);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Publishing failed. Nothing was lost.';
      setPublishError(msg);
    }
  }, [user, topic, question, content, category, tags, sources, publish]);

  if (publishedId) {
    return (
      <div className="min-h-screen bg-background">
        <AppNav />
        <div className="container py-16 max-w-lg text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-950 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-3">Knowledge Published</h1>
          <p className="text-muted-foreground mb-2">
            Your knowledge article has been signed and published to the Nostr network.
          </p>
          <p className="text-xs text-muted-foreground/70 font-mono mb-8 break-all">{publishedId}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={() => navigate(`/search?q=${encodeURIComponent(question || topic)}`)}
              style={{ background: 'var(--intheno-brand)' }}
              className="text-white"
            >
              Find Your Knowledge
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/contributions')}
            >
              View My Contributions
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AppNav />

      <main className="container py-8 max-w-2xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <PenLine className="h-5 w-5" style={{ color: 'var(--intheno-brand)' }} />
            <h1 className="text-2xl font-bold text-foreground tracking-tight">Contribute Knowledge</h1>
          </div>
          <p className="text-muted-foreground">
            You know something worth preserving. Share it here — with sources — so others can learn and verify.
          </p>
        </div>

        {/* Identity notice */}
        {!user && (
          <div className="mb-6 rounded-xl border border-border bg-card p-4 flex gap-3">
            <User className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-foreground">Nostr identity required to publish</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                You can write your knowledge now. You'll set up or connect your Nostr identity when you publish.
              </p>
            </div>
          </div>
        )}

        {/* Form */}
        <div className="space-y-6">
          {/* Topic */}
          <div className="space-y-2">
            <Label htmlFor="topic" className="font-semibold">
              Topic <span className="text-destructive">*</span>
            </Label>
            <Input
              id="topic"
              value={topic}
              onChange={e => setTopic(e.target.value)}
              placeholder="e.g. Why is the sky blue?"
              className="text-base"
            />
            <p className="text-xs text-muted-foreground">The title of your knowledge article.</p>
          </div>

          {/* Question */}
          <div className="space-y-2">
            <Label htmlFor="question">Question or Summary</Label>
            <Input
              id="question"
              value={question}
              onChange={e => setQuestion(e.target.value)}
              placeholder="A concise summary of what this article covers"
            />
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="content" className="font-semibold">
              Knowledge <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="content"
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="Write or paste your knowledge here. Be clear, factual, and thorough. Use headings (## Section) for long content."
              className="min-h-[240px] text-sm font-mono"
            />
            <p className="text-xs text-muted-foreground">
              Write your knowledge in plain text or Markdown. Minimum 100 characters.
              <span className="ml-2">{content.length} characters</span>
            </p>
          </div>

          {/* Sources */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="font-semibold">Sources</Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={addSource}
                className="h-7 text-xs"
              >
                <Plus className="h-3 w-3 mr-1" />
                Add Source
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Sources make your knowledge verifiable. Add at least one source where possible.
            </p>
            <div className="space-y-3">
              {sources.map((source, i) => (
                <div key={source.id} className="rounded-xl border border-border bg-card p-4 space-y-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-muted-foreground">Source {i + 1}</span>
                    {sources.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => removeSource(source.id)}
                        aria-label="Remove source"
                      >
                        <Trash2 className="h-3 w-3 text-muted-foreground" />
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label htmlFor={`src-name-${source.id}`} className="text-xs">Publisher / Organization</Label>
                      <Input
                        id={`src-name-${source.id}`}
                        value={source.name}
                        onChange={e => updateSource(source.id, 'name', e.target.value)}
                        placeholder="e.g. NASA, Khan Academy"
                        className="text-sm h-8"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor={`src-title-${source.id}`} className="text-xs">Article / Page Title</Label>
                      <Input
                        id={`src-title-${source.id}`}
                        value={source.title}
                        onChange={e => updateSource(source.id, 'title', e.target.value)}
                        placeholder="e.g. Why Is the Sky Blue?"
                        className="text-sm h-8"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor={`src-url-${source.id}`} className="text-xs">URL (must begin with https://)</Label>
                    <Input
                      id={`src-url-${source.id}`}
                      value={source.url}
                      onChange={e => updateSource(source.id, 'url', e.target.value)}
                      placeholder="https://..."
                      type="url"
                      className="text-sm h-8"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category" className="font-semibold">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="category">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {KNOWLEDGE_CATEGORIES.map(c => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label htmlFor="tags">Tags <span className="text-muted-foreground font-normal">(optional)</span></Label>
            <Input
              id="tags"
              value={tags}
              onChange={e => setTags(e.target.value)}
              placeholder="e.g. physics, light, atmosphere (comma-separated)"
            />
          </div>

          {/* Error */}
          {publishError && (
            <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 flex gap-3">
              <AlertTriangle className="h-4 w-4 text-destructive flex-shrink-0 mt-0.5" />
              <p className="text-sm text-destructive">{publishError}</p>
            </div>
          )}

          {/* Publish button */}
          <div className="flex gap-3 pt-2">
            <Button
              onClick={handlePublish}
              disabled={isPublishing || !topic.trim() || !content.trim()}
              className="flex-1 text-white"
              style={{ background: 'var(--intheno-brand)' }}
            >
              {isPublishing ? 'Publishing…' : 'Publish Knowledge'}
            </Button>
          </div>

          {/* Security notice */}
          <div className="rounded-xl border border-border bg-muted/30 p-4 flex gap-3">
            <Shield className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground">
              Your knowledge will be published as a NIP-54 kind:30818 event on Nostr — a decentralized, open network.
              Your contribution will be signed with your Nostr identity and attributed to your public key.
              Your private key never leaves your device.
            </p>
          </div>
        </div>
      </main>

      {/* Identity dialog */}
      <IdentityRequiredDialog
        open={showIdentityDialog}
        onClose={() => setShowIdentityDialog(false)}
        onContinue={() => {
          setShowIdentityDialog(false);
          // After login, they can try again
        }}
      />
    </div>
  );
}

function isValidUrl(url: string): boolean {
  if (!url) return true;
  return sanitizeUrl(url) !== '#';
}

// Dialog shown when a user tries to publish without a Nostr identity
function IdentityRequiredDialog({
  open,
  onClose,
  onContinue,
}: {
  open: boolean;
  onClose: () => void;
  onContinue: () => void;
}) {
  const [step, setStep] = useState<'choose' | 'create' | 'backup'>('choose');
  const [newKeys, setNewKeys] = useState<{ nsec: string; npub: string; secretBytes: Uint8Array } | null>(null);
  const [backedUp, setBackedUp] = useState(false);
  const [copied, setCopied] = useState(false);
  const loginActions = useLoginActions();

  const handleCreateIdentity = useCallback(() => {
    const secretKey = generateSecretKey();
    const pubkey = getPublicKey(secretKey);
    const nsec = nip19.nsecEncode(secretKey);
    const npub = nip19.npubEncode(pubkey);
    setNewKeys({ nsec, npub, secretBytes: secretKey });
    setStep('backup');
  }, []);

  const handleCopyNsec = () => {
    if (!newKeys) return;
    navigator.clipboard.writeText(newKeys.nsec).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleLoginWithNewKey = useCallback(() => {
    if (!newKeys) return;
    try {
      loginActions.nsec(newKeys.nsec);
      onContinue();
    } catch {
      // Silently handle
    }
  }, [newKeys, loginActions, onContinue]);

  const handleConnectNostr = () => {
    onClose();
    // The LoginArea component handles NIP-07
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) { onClose(); setStep('choose'); } }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {step === 'choose' && 'Create your Nostr identity'}
            {step === 'create' && 'Creating your identity'}
            {step === 'backup' && 'Back up your private key'}
          </DialogTitle>
          <DialogDescription>
            {step === 'choose' && 'Create a decentralized identity to publish and receive attribution for your knowledge contributions.'}
            {step === 'backup' && 'Your private key controls your identity. INTHENO cannot recover it if you lose it.'}
          </DialogDescription>
        </DialogHeader>

        {step === 'choose' && (
          <div className="space-y-3 pt-2">
            <button
              onClick={handleCreateIdentity}
              className="w-full rounded-xl border border-border bg-card p-4 text-left hover:bg-accent transition-colors"
            >
              <p className="font-semibold text-foreground text-sm">I'm new to Nostr</p>
              <p className="text-xs text-muted-foreground mt-0.5">Create a new decentralized identity</p>
            </button>
            <button
              onClick={handleConnectNostr}
              className="w-full rounded-xl border border-border bg-card p-4 text-left hover:bg-accent transition-colors"
            >
              <p className="font-semibold text-foreground text-sm">I already have a Nostr identity</p>
              <p className="text-xs text-muted-foreground mt-0.5">Connect with a NIP-07 signer or nsec</p>
            </button>
          </div>
        )}

        {step === 'backup' && newKeys && (
          <div className="space-y-4 pt-2">
            {/* Security warning */}
            <div className="rounded-xl border border-amber-200 bg-amber-50 dark:border-amber-900/30 dark:bg-amber-950/20 p-4">
              <p className="text-sm font-semibold text-amber-800 dark:text-amber-400 mb-1">
                ⚠️ Your private key is your identity
              </p>
              <p className="text-xs text-amber-700 dark:text-amber-500">
                Anyone who has your private key can publish as you. INTHENO cannot recover it if you lose it.
                Save it somewhere safe before continuing.
              </p>
            </div>

            {/* Public key */}
            <div className="space-y-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Your Public Identity (npub)</p>
              <p className="text-xs font-mono break-all bg-muted p-3 rounded-lg text-foreground">
                {newKeys.npub}
              </p>
            </div>

            {/* Private key — masked until user acknowledges */}
            <div className="space-y-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Your Private Key (nsec)</p>
              <div className="relative">
                <p className="text-xs font-mono break-all bg-destructive/10 border border-destructive/20 p-3 rounded-lg text-foreground">
                  {newKeys.nsec}
                </p>
                <button
                  onClick={handleCopyNsec}
                  className="absolute top-2 right-2 text-xs px-2 py-0.5 rounded bg-background border border-border text-muted-foreground hover:text-foreground transition-colors"
                >
                  {copied ? '✓ Copied' : 'Copy'}
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                Save this in a password manager or secure note. Do not share it with anyone.
              </p>
            </div>

            {/* Acknowledgement */}
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={backedUp}
                onChange={e => setBackedUp(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-border"
              />
              <span className="text-sm text-foreground">
                I have saved my private key. I understand INTHENO cannot recover it.
              </span>
            </label>

            <Button
              onClick={handleLoginWithNewKey}
              disabled={!backedUp}
              className="w-full text-white"
              style={{ background: backedUp ? 'var(--intheno-brand)' : undefined }}
            >
              Continue to Publish
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
