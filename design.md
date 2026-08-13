# design.md — UI/UX Specification for Claude Design

## Context

This covers the interface for the daily learning companion app (full technical/product spec in the paired CLAUDE.md). This document defines **screens, layout, components, and interaction behavior only**. Visual style — color, type, illustration, diagram treatment — is intentionally left to the accompanying moodboard, not prescribed here. Apply the moodboard's language on top of this structure.

## Platform

- Mobile-first, installed as a PWA (Add to Home Screen)
- Portrait orientation, primary use case
- Bottom tab navigation, 4 items: Home / Topics / Settings / Add (+)

## Screen 1 — Home

Layout, top to bottom:
- Header: greeting + a quick-note icon in the top-right corner
- **Today's topic**: the dominant card on the screen — topic name, category tag, "Read now" as the primary action
- **For tomorrow, select**: 2-4 selectable option cards, compact, with a clear selected/unselected state
- **Yesterday's topic**: smaller, lower-visual-weight preview below the fold of the primary content
- Persistent bottom tab bar

Interaction notes:
- Tapping a "for tomorrow" option needs an immediate, clear confirmation state in the UI, since the actual write to Notion happens in the background and shouldn't leave the user wondering if it registered.
- The quick-note icon opens a lightweight, minimal capture modal — one text field. It should read as clearly lower-stakes than the main Add flow, not the same visual weight.

## Screen 2 — Add custom topic (bottom sheet)

- Triggered by (+) in the bottom nav
- Fields: topic name (text input), domain/category (dropdown, populated from the Topics/Directory data)
- Submit transitions the sheet into a confirmation state — "we'll let you know when it's ready" — rather than just closing
- **This is a queued action, not instant.** The copy and the transition should set that expectation explicitly; nothing in the flow should imply the note appears right away.

## Screen 3 — Topics / Directory

- Top-level toggle: **All** / **Categorical**
  - **All** → flat, scrollable list of every note, regardless of domain
  - **Categorical** → grid of domain cells (existing spec below) → tap one → filtered note list for that domain only
- Grid of domain/category cells (2-column shown in early sketches — treat as a flexible placeholder, finalize the grid against the moodboard)
- Each cell is tappable, filters to notes within that domain
- A persistent "add new domain" affordance, consistent with the (+) pattern used elsewhere in the app

## Screen 4 — Note View

- Header: topic heading + category tag
- Index icon: reveals a jump-to-section outline for longer notes
- Body: default is a read state; tapping anywhere transitions into edit mode
- Edit-mode tools: text add/remove, highlighter (applies a background-color treatment to the selected text range), add image, add link
- Edits need a visible saved/saving state — writes go to the real Notion page, so failures must surface clearly rather than fail silently

## Screen 5 — Settings

Sectioned list:
- **Prompt** — read-only view of the current automation instructions
- **Timing** — read-only, with a note that schedule changes happen in Cowork itself, not here
- **Notifications** — toggles for which events notify (today's note ready, custom topic ready)
- **Stats** — topic counts by domain

## States to design for

- Loading (initial fetch from Notion)
- Empty (a domain with no notes yet, or first-ever launch)
- Queued/pending (a custom topic submitted, not yet generated)
- Error (a Notion write fails — needs a clear, visible failure state; a silent failure here means real data loss, not just a UI hiccup)

## Explicit non-goals for this pass

- No onboarding flow — single user, no first-time-user explanation needed
- No auth screens
- No search or multi-note comparison beyond the Topics grid filter — later scope, not v1

## Pairing with the moodboard

This document defines what exists and how it behaves. The moodboard defines what it looks like. Bring both into Claude Design together — neither is complete on its own.
