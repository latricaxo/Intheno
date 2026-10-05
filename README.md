# INTHENO (In-The-Know)

An open-source knowledge network on Nostr. Ask a question and get an answer drawn from published NIP-54 knowledge articles, with the sources, books, and contributors behind it visible. Optional AI can synthesize what those sources say, but it is never the authority.

**Live app:** https://intheno.shakespeare.wtf

## Why INTHENO

Publishing on open networks does not make information easy to find, understand, or verify. Nostr provides decentralized publishing and NIP-54 defines knowledge articles, but people still need a way to ask a plain question and trace the result to its authors and sources. INTHENO adds that layer, using existing standards and no new protocol.

## Status

INTHENO is a working web app. It currently runs on clearly labeled demonstration articles stored in the app. The next stage is to replace them with 100 sourced NIP-54 articles published on Nostr relays, add expert review, build multi-relay retrieval, and measure the results publicly.

## What it does today

- Anyone can ask a question and read sourced results without an account.
- Publishes and reads NIP-54 knowledge articles (kind 30818) on live Nostr relays.
- Signer login with NIP-07.
- Optional AI synthesis for signed-in users.
- Source attribution and provenance: each result links to its sources and contributors.

Standards used: NIP-01, NIP-07, and NIP-54.

## Privacy

Reading sourced results requires no account and no AI. When a signed-in user requests AI synthesis, the question and retrieved article excerpts are sent to an AI service to generate the answer.

## Roadmap

1. 100 sourced NIP-54 articles published on Nostr relays, with expert review and public review records.
2. Multi-relay retrieval that keeps working when one of two read relays is unavailable.
3. Knowledge-gap handling: when sources do not support an answer, INTHENO says so instead of inventing one.
4. A documented 100-question test set, run at the start and end, with results published, including shortfalls.

## Run locally

```bash
npm install
npm run dev
```

Use a current Node.js LTS release. Other scripts:

- `npm run build` creates a production build.
- `npm test` runs the type check, lint, tests, and a build.

## Built with

React 19, TypeScript, Vite, Tailwind CSS, shadcn/ui and Radix UI components, TanStack Query, and the Nostr libraries Nostrify and nostr-tools. Built with AI coding agents and the Shakespeare platform.

## License

Software: MIT (see `LICENSE`). The published knowledge articles are planned for release under CC BY 4.0.

## Author

Latrica Williams
