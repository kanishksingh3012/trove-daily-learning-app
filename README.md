# Daily Learning Companion

A personal, single-user PWA interface for the daily learning automation. Full context in [CLAUDE.md](./CLAUDE.md).

This app is the interface layer only — the Cowork scheduled task that picks topics, curates resources, and writes notes to Notion keeps running unchanged. Notion is the single source of truth; the app has no database of its own.

## Stack

- Next.js (App Router, TypeScript)
- PWA: `public/manifest.json` + `public/sw.js`, installed via "Add to Home Screen"
- Backend: Next.js API routes proxy to Notion's Markdown Content API — the Notion integration token never reaches the client

## Structure

```
app/            routes (App Router)
  api/notion/   backend routes that call Notion's Markdown Content API
components/     UI components
lib/            Notion API client
public/         manifest.json, service worker, icons
```

## Setup

```bash
npm install
cp .env.local.example .env.local
```

Fill in `NOTION_TOKEN` in `.env.local` with your Notion integration token.

```bash
npm run dev
```

## Status

Skeleton only — no screens built yet (Home, Topics, Note View, Settings). The Notion API route and client are scaffolded but not wired up.
