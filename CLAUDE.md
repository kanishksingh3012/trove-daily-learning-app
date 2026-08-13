# CLAUDE.md — Daily Learning Companion App

## Overview

A personal, single-user Progressive Web App that serves as the primary interface for the daily learning automation. The automation itself (a Claude Cowork scheduled task) keeps running exactly as already built — picking a topic, curating resources, writing a note to Notion every morning. This app adds the interface layer on top: reading notes, picking tomorrow's topic, requesting custom topics, editing/highlighting notes, and managing the domain pool — replacing the current experience of doing all of this through a Cowork chat thread.

## What this app is NOT

- Not a replacement for the Cowork scheduling engine — the daily trigger, the topic auto-pick fallback, and resource curation continue to run unchanged.
- Not real-time — custom topic requests are queued, not generated on demand.
- Not multi-user — single person, single Notion workspace, no auth system.
- Not going to an app store — a PWA, installed via "Add to Home Screen," never published anywhere.

## Core principle (carried over from the automation itself)

Every session — a Cowork run, or this app's backend — is stateless. Nothing is assumed to be "remembered." Notion is the only thing that persists across interactions, for both the automation and the app. The app never keeps its own local copy as a source of truth; it always reads from and writes to Notion directly.

## Screens & features

### 1. Home
- Header: greeting + a quick-note icon (top right) — a lightweight, separate capture flow for jotting a topic to remember later, distinct from the main daily flow
- Today's topic card: topic name, category, "Read now" → opens Note View
- "For tomorrow, select" section: the same 3-4 option cards the Cowork task already generates each run — tapping one writes that topic into the `Selected Topic` field in Notion
- Yesterday's topic: smaller preview below
- Bottom nav: Home / Topics / Settings / Add (+)

### 2. Add (+) — custom topic request
- Bottom sheet: topic name (text input), domain/category (dropdown, sourced from the Domains list)
- Submit → writes into the same `Selected Topic` field used by the "pick tomorrow" flow on Home — this is the same underlying operation, not a separate system
- Confirmation state ("we'll let you know"), then a notification once the next Cowork run has produced the note
- **Queued, not immediate** — the note appears after the next scheduled run, not instantly. This must be clear in the UI copy.

### 3. Topics / Directory
- Toggle: **All** / **Categorical**
  - All → flat list of every note across domains
  - Categorical → grid of domains (existing behavior) → tap a domain → notes filtered to that domain
- Add a new domain directly — writes to the same Domains list, which Cowork reads at the start of each run

### 4. Note View
- Heading + category tag
- Index icon: shows a jump-to-section outline
- Body: tap anywhere to enter edit mode
- Edit tools: add/remove text, highlight (wraps the selection in `<span color="yellow_bg">...</span>`), add images, add links for extra resources
- All edits write back to the real Notion page via the markdown API — there is no separate local copy; Notion is the single source of truth

### 5. Settings
- The prompt — reference/view only
- Timing — **display only**. The real schedule lives in Cowork's own UI; this app must not attempt to change it
- Notifications — on/off, which events trigger one
- Stats — topic counts by domain, pulled from the Learnings database

## Architecture

```
[App — Next.js, PWA]  <-->  [Backend — Next.js API routes / Vercel serverless]  <-->  [Notion — Markdown Content API]
```

- The backend is the only place holding the Notion integration token — never shipped to the client.
- No client-side Notion calls (Notion's API doesn't support direct browser CORS requests).
- No separate database of the app's own — Notion is the persistence layer for everything: notes, the Domains list, and the `Selected Topic` field.
- Cowork continues running independently, on its own schedule, reading/writing the same Notion structures the app uses.

## Data model (Notion)

- Parent page: `Learnings`
- Database columns: `Topic Name`, `Date`, `Area`
- Each row's page body: the 5-section note format — Topic / Brief / Concept Index / Detailed Notes / Resources
- `Selected Topic` field (on the parent page): holds either a picked "tomorrow" option or a queued custom-topic request — same field, same consumption logic, cleared by the next Cowork run
- `Domains` list (**new** — previously hardcoded inside the Cowork prompt text, now a real Notion list both the app and Cowork read): the pool of categories used for topic selection and the Add flow's dropdown

## Confirmed technical facts — don't re-derive these

- Notion's Markdown Content API (`GET /v1/pages/{id}/markdown`, `PATCH /v1/pages/{id}/markdown`) handles reading and writing note content directly as markdown. No block-level parsing library is needed.
- Inline highlighting is confirmed working via `<span color="yellow_bg">text</span>` — verified with a live write-then-read round trip, not just documented.
- Prefer `update_content` (targeted search-and-replace) over `replace_content` (whole-page overwrite) for normal edits — faster, less likely to hit async processing limits.

## Open items — resolve during build, not before

- Whether the Note View index uses Notion's native `<table_of_contents/>` block or is derived client-side from headings. Decide once a real note is in front of you.
- Exact contents of the Settings stats view — counts by domain is the v1 minimum, anything more is a later add.

## Explicitly out of scope

- Real-time/on-demand note generation (would require the app to call the Claude API directly — deliberately not building this; see the separate independent-agent roadmap if that's ever revisited)
- Multi-user support, auth, or publishing anywhere
- Changing the Cowork schedule/timing from inside the app
