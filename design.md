# design.md — UI/UX Specification

## Context

This covers the interface for the daily learning companion app (full technical/product spec in the paired CLAUDE.md). It defines **screens, layout, components, and interaction behaviour**. As of this revision the visual language is no longer open: it is fixed by `Design System.dc.html` and built out in `UI Designs v2 Dark White.dc.html` (reference) and `UI Designs v2 Light.dc.html`.

## Platform

- Mobile-first, installed as a PWA (Add to Home Screen); designed at a 393 × 852 frame
- Portrait orientation, primary use case
- Bottom navigation: a three-item pill (Home / Topics / Settings) with a separate (+) FAB beside it, inset 28 px from the edges and the bottom

## Visual language (fixed)

- Manrope; Material Symbols Rounded icons
- Neutral surfaces, no gradients behind copy
- Monochrome accent by default — off-white on dark, ink on light — switchable to terracotta, olive, or blue in Settings
- One filled accent element per screen region: the primary action or the selected item. Everything else outline or text
- Category colour is identity only: folder icons, tags, domain colour picker
- Full token list, type scale, radii, spacing, and elevation values live in `Design System.dc.html`

## Screen 1 — Home

Layout, top to bottom:
- Header: greeting + a quick-note icon in the top-right corner
- **Today's topic**: the dominant card — image, category tag, topic name, "Read now" as the filled primary action
- **For tomorrow, select**: 2-4 selectable option cards in a two-column grid, compact, selected one filled with the accent
- **Yesterday's topic**: smaller, lower-visual-weight row with a translucent-accent "Read" badge
- Persistent bottom nav + FAB

Interaction notes:
- Tapping a "for tomorrow" option needs an immediate, clear confirmation state, since the actual write to Notion happens in the background. This is an explicit transient state — a toast above the nav — not just a selected style.
- The quick-note icon opens a lightweight capture screen: title, saved timestamp, one body field, Cancel / Done. It reads lower-stakes than the main Add flow.

States: core · quick-note capture · loading skeleton · first-ever-launch empty · confirmation toast

## Screen 2 — Add custom topic (bottom sheet)

- Triggered by (+) in the bottom nav
- Fields: topic name (text input), domain/category — a wheel picker over the Domains list, with Cancel / Done in its own header
- Submit transitions the sheet into a confirmation state — a filled accent check, "We'll let you know", one-line explanation, "Got it" — rather than just closing
- **This is a queued action, not instant.** The copy and the transition must set that expectation explicitly.

States: form with picker open · confirmation

## Screen 3 — Topics / Directory

- Top-level segmented control: **Categorical** / **All**
  - **Categorical** → two-column grid of domain cards; each card carries a folder icon in the domain colour, the domain name, and its note count, with an overflow (⋮) affordance
  - **All** → flat, scrollable list of every note regardless of domain, each row ending in its category tag
- Tapping a domain opens a filtered note list for that domain (back header, domain name, note count, date-stamped rows), with its own empty state
- "+ Domain" sits in the screen header and opens a bottom sheet: name field, six-swatch colour picker with the selected swatch ringed in the accent, Cancel / Create domain. Categorical and All share the header, so the affordance is always reachable

States: categorical · all · new-domain sheet · filtered domain · empty domain · loading

## Screen 4 — Note View

- Header: back, topic heading, category tag, and the index (toc) icon
- Index icon opens a table-of-contents sheet listing the note's sections; the current section is the only one in full-strength text, the rest are muted
- Body: read state by default; tapping anywhere enters edit mode
- Edit-mode toolbar floats above the bottom edge with four tools — text, highlight, image, link. The active tool is a filled accent circle; inactive tools are muted icons. This is the standalone entry point for inserting an image or a link at the cursor
- A text-selection callout (Highlight / Copy / Link) handles actions on an existing selection
- Highlighting applies the fixed yellow `#FDE68A` with dark text — it is note data, so it does not change with the theme
- Detailed notes render tables (header cells on the well surface, the key cell tinted with the accent at 10-15%) and diagram blocks (dashed placeholder until real imagery exists); resources close the note as a list of links
- Edits need a visible saving/saved state and a visible error state — writes go to the real Notion page, so failures must surface as a tappable retry banner

States: reading/editing with selection callout · scrolled detail with table + diagram + resources · TOC sheet · loading · save failed

## Screen 5 — Settings

Sectioned list:
- **Prompt** — read-only summary row, opening a detail screen with the active prompt, a schedule/length/destination/rotation table, and a lock note ("Read only — edit this prompt in Cowork")
- **Timing** — read-only, with the note "Change schedule in Cowork — view only here" displayed in-UI
- **Notifications** — toggles: today's note ready, custom topic ready
- **Appearance** — dark mode switch, and **Theme colour**: four swatches (neutral, terracotta, olive, blue), the active one ringed. Changing it re-tints every accent surface in the app
- **Stats** — total notes, domain count, most active domain

States: core · prompt detail · loading

## States to design for (all covered in the v2 files)

- Loading (initial fetch from Notion) — skeleton bars on the well surface
- Empty (a domain with no notes yet, or first-ever launch) — dashed container, muted copy
- Queued/pending (a custom topic submitted, not yet generated) — confirmation sheet copy
- Error (a Notion write fails) — red banner with retry, plus the affected block outlined

## Explicit non-goals for this pass

- No onboarding flow — single user, no first-time-user explanation needed
- No auth screens
- No search or multi-note comparison beyond the Topics filter — later scope, not v1

## Pairing

This document defines what exists and how it behaves. `Design System.dc.html` defines what it looks like. The two v2 design files are the built result of both.
