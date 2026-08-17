# Handoff: Trove — daily learning companion (mobile PWA)

## Overview

A single-user PWA sitting on top of an existing Claude Cowork automation. Every morning the automation picks a topic, curates resources, and writes a structured note into Notion. This app is the interface for that data: read today's note, pick tomorrow's topic, queue a custom topic, edit/highlight notes, track reading activity, bookmark notes, and manage the domain pool. Notion is the only persistence layer.

Product/technical spec: the project's `CLAUDE.md` (copy included here as reference — check the source project for the latest). Behavioural + visual spec: `design.md`.

## About the design files

`Trove Prototype.dc.html` is a **fully interactive, clickable reference** — not static mockups. It is the exact UI to recreate: open it directly in a browser (`support.js` must sit alongside it, included in this bundle) and click through every screen and state. Where this doc and the prototype ever disagree, **the prototype wins** — it is live and current as of this handoff.

The task is to recreate this in the target codebase (Next.js + React per `CLAUDE.md`), using CSS custom properties for theming exactly as specified in `design.md`'s tokens section. Do not copy the prototype's markup verbatim — it uses a templating runtime (`support.js`) specific to this design tool; rebuild the same visual/interaction result with normal React components.

## Fidelity

High. Every colour, type size, radius, spacing value, motion curve, and state is final and documented in `design.md`. The three intentionally open items are listed in `CLAUDE.md`'s "Open items" section (TOC data source, topic imagery source, exact Settings stats scope).

## What's new since the last handoff

- **Four themes, not three fixed accents**: Neutral (default, monochrome), Terracotta, Green, Blue. There is no separate "pop" colour anymore — every accent-driven element (FAB, progress bar, activity graph, focus rings, "read" state) reads the theme accent directly, so it re-tints correctly. See `design.md`'s token table.
- **Activity tracker** on Home: an all-time, count-shaded, GitHub-style contribution graph, tinted to the active theme colour, laid out compact and without its own card (directly under the header).
- **Bookmarks**: a save-for-later mechanism, fully separate from "read" — a bookmark icon next to quick-note on Home opens a sheet of starred notes; the existing bookmark icon in Note View's header feeds it.
- **"I have read this"** button at the end of every note — the sole action that increments the activity graph. Distinct from bookmarking (save) and from just viewing a note (open ≠ read).
- Home section order: header → activity graph → Today's topic → For tomorrow → Yesterday.

## Files in this bundle

| File | Role |
| --- | --- |
| `Trove Prototype.dc.html` | **The reference.** Fully interactive: all 5 screens, every sheet, both modes, all four themes, the activity tracker, bookmarks, and the read-tracking flow |
| `support.js` | Runtime required to open the prototype locally — keep it alongside the `.dc.html` file |
| `design.md` | Screens, tokens, geometry, motion, and behaviour — the written spec paired with the prototype |
| `CLAUDE.md` | Product/technical spec: data model, architecture, Notion integration, scope (copy of the project root file) |

## State management guidance

- Server data (via the app's own API routes, never client-side Notion calls): today's note, tomorrow's options, yesterday's note, the note list, Domains list, note bodies, stats, prompt/schedule metadata, bookmark flags, per-day read counts.
- Client state: active tab, selected tomorrow-option (optimistic), sheet open/step, note read/edit mode, current text selection, TOC sheet open, save status (idle/saving/saved/error), toast queue, activity-graph range.
- Persisted locally only: theme mode (dark/light) and theme colour choice. Everything else lives in Notion.
- Every mutation is a queued write to Notion: pick tomorrow, queue custom topic, create domain, save note edits, mark-as-read, toggle bookmark. All need pending/success/failure UI matching the prototype's toast and inline-state patterns.

## Assets

- Fonts: Manrope, Lora, Material Symbols Rounded (Google Fonts) — self-host for the PWA if offline support matters.
- No topic imagery source is connected yet; fall back to the gradient well with tag + title (as built) until one exists.
- No other image or icon assets — everything is CSS/DOM in the prototype.
