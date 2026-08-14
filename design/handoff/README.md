# Handoff: Daily Learning Companion — mobile PWA (v2, dark + light)

## Overview

A single-user PWA that sits on top of an existing Claude Cowork automation. Every morning the automation picks a learning topic, curates resources, and writes a structured note into Notion. This app is the interface for that data: read today's note, pick tomorrow's topic, queue a custom topic, edit and highlight notes, and manage the pool of domains. Notion is the only persistence layer — the app has no database of its own.

Product/technical context: `PRODUCT-SPEC.md` (the project's CLAUDE.md). Behavioural spec: `design.md`. Both are in this bundle.

## About the design files

The `.dc.html` files here are **design references created in HTML** — prototypes that show the intended look, layout, and behaviour. They are not production code to copy.

The task is to **recreate these designs in the target codebase's environment**, using its established patterns and component library. If no environment exists yet, Next.js + React (the stack named in `PRODUCT-SPEC.md`) with CSS custom properties for theming is the intended target.

Open any file directly in a browser; `support.js` must sit next to them (it is included).

## Fidelity

**High-fidelity.** Colours, typography, spacing, radii, elevation, and all loading/empty/error states are final and specified below. Recreate the UI to match. The only intentionally unresolved item is topic imagery (see Assets).

## Design tokens

Implement as CSS custom properties on the root, swapped by mode. No component hardcodes a colour.

| Token | Dark (reference) | Light |
| --- | --- | --- |
| `--bg` (board/page behind the app) | `#0A0A0B` | `#E8E5DD` |
| `--frame` (app background) | `#16171A` | `#FAF8F4` |
| `--surface` (cards, nav pill, sheets) | `#212227` | `#FFFFFF` |
| `--well` (insets, inputs, table headers) | `#101113` | `#F1EEE7` |
| `--line` (borders, dividers) | `#2A2B30` | `#E4E0D6` |
| `--skeleton` | `#26272C` | `#EAE7E0` |
| `--text` | `#F2F0EC` | `#16171A` |
| `--text-body` (note/reading copy) | `#C9C7C1` | `#3D3C39` |
| `--text-2` (labels, meta) | `#9C9A92` | `#6F6D65` |
| `--text-3` (disabled, timestamps) | `#5C5D61` | `#A5A29A` |
| `--overlay` (toast, tooltip — stays dark) | `#2C2D31` | `#2C2D31` |
| `--danger` / `--danger-bg` | `#FF6B60` / `#3A1F1E` | `#B4342A` / `#FBE8E6` |
| `--dashed` (empty-state border) | `#3A3B40` | `#D5D1C7` |
| `--handle` (sheet grabber) | `#4A4B4F` | `#D0CCC2` |
| `--track-off` (switch off) | `#2A2B30` | `#DCD8CE` |

### Accent themes (Settings → Appearance → Theme colour)

| Theme | `--accent` | `--on-accent` |
| --- | --- | --- |
| Neutral (default) | dark `#F2F0EC` · light `#16171A` | dark `#16171A` · light `#FFFFFF` |
| Terracotta | `#D97635` | `#FFFFFF` |
| Olive | `#5C6B2C` (tints `#26301C` dark / `#E7EAD8` light) | `#FFFFFF` |
| Blue | `#3B5FC4` | `#FFFFFF` |

Derived accent values used in the mocks: translucent accent border `rgba(accent, .35)` dark / `.28` light; translucent accent fill `rgba(accent, .12)` dark / `.08` light; table key-cell tint `rgba(accent, .15)` dark / `.10` light; FAB glow `rgba(accent, .35)` dark / `.22` light.

### Category palette (identity only — never follows the accent)

Folder icon body / lighter tab: `#2E9E5B`/`#8FD1AC` Science & Nature · `#D97635`/`#F3BE8B` History & Civilization · `#3B5FC4`/`#A9BBEF` Math & Logic · `#7A5FC4`/`#C9BCEF` Technology · `#C45F8A`/`#EFB9CE` Mind & Psychology · `#2F9E93`/`#93D9D1` Health & Medicine.

Tag pill = tint background + matching text, `border-radius: 10px`, `padding: 4px 8px`, `9px/700`:

| Category | Dark bg / text | Light bg / text |
| --- | --- | --- |
| Math & Logic | `#202B47` / `#93B4F0` | `#E4EBFA` / `#2F4D8F` |
| Health & Medicine | `#173430` / `#7FE0D0` | `#DFF3EF` / `#1E6B60` |
| History | `#3A2617` / `#F0A877` | `#FBEADE` / `#8A4A1C` |
| Technology | `#2B2140` / `#C3A8F0` | `#EEE7FB` / `#5B3D99` |
| Mind & Psych | `#3A1F2A` / `#F0A0C4` | `#FBE6EF` / `#8F3A63` |
| Geopolitics | `#332E17` / `#E0D17F` | `#F6F1DA` / `#7A6A1E` |
| Espionage | `#25272B` / `#B7C0CC` | `#ECEEF1` / `#4C5560` |
| Physical Cond. | `#3A201D` / `#F0A89C` | `#FBE7E4` / `#8F3B30` |
| Science | `#173A26` / `#7FE0A3` | `#E2F4E9` / `#1F6B3F` |

Note highlight is a fixed `#FDE68A` background with `#2B2408` text in both modes — it is note content, not theming.

Resource links: `#8FB0F2` dark, `#2F5CB8` light.

## Typography

Manrope (400–800; weights actually used: 500, 600, 700, 800). Icons: Material Symbols Rounded — 16 px inline, 18 px nav/toolbar, 20–22 px header and confirmation.

Sizes are the values at the 393 px design frame:

| Role | Size / weight | Notes |
| --- | --- | --- |
| Screen title | 16 / 800 | Home greeting, Topics, Settings |
| Sheet title | 15 / 800 | centred in bottom sheets |
| Sheet subhead | 13 / 800 | "Sections" |
| Section label | 12 / 600 | "Today's topic", "For tomorrow, select" |
| List row / body UI | 12 / 500 | settings rows, sheet fields |
| Note & list body | 11 / 500, line-height 1.5 | reading text, list rows in cards |
| Meta, counts | 10 / 500 | "14 notes", dates |
| Eyebrow caps | 9 / 700, letter-spacing .04em | "BRIEF", "NAME", "APPEARANCE" |
| Tag | 9 / 700 | category pills |
| Nav label | 8 / 700 | hidden unless the item is active |

## Geometry

Radius: 55 device frame · 27 nav pill (height 54) · 20 card / sheet top / hero · 16 active nav item and segmented thumb · 14 button, chip, field · 12 inner tile · 10 tag, tooltip · 6 skeleton · 50% avatar, FAB, swatch, confirmation icon.

Spacing: 4 px base (4 · 8 · 12 · 16 · 20 · 24 · 28 · 32). Screen gutter 16. Card padding 12–20. Row padding 8–12. Nav inset 28 from left, right, and bottom. Status bar 60 tall. Section gap 16; inside a card 8–12.

Elevation: card `0 4px 16px -4px rgba(0,0,0,.30)` dark / `.09` light · nav pill `0 4px 14px .30/.10` · sheet `0 -8px 24px .40/.13` · note toolbar `0 12px 30px -8px .40/.13` · toast `0 8px 20px .40/.18` · selection tooltip `0 8px 20px .50/.22` · segmented thumb `0 1px 2px .30/.12` · modal scrim `rgba(0,0,0,.40–.50)` in both modes.

Minimum hit target 44 px.

## Screens

Every screen sits on `--frame`, opens with a 60 px status bar, and (except detail/sheet screens) ends with the nav pill + FAB pinned 28 px from the bottom.

### 1 · Home
Purpose: read today's note, choose tomorrow's topic, glance at yesterday.
Layout: header row (greeting `16/800` left, 30 px circular quick-note button with a 1.5 px `--line` border right) → "Today's topic" label → hero card (`--well`, radius 20, height 180, image fill, `linear-gradient(180deg, transparent 40%, rgba(0,0,0,.7))` overlay, bottom-anchored stack: category tag, title `16/800` in `#F2F0EC`, filled accent "Read now →" button radius 14, padding 12) → "For tomorrow, select" label → two-column grid, gap 8, of option chips (radius 14, padding 8, `10px`; selected = accent fill + `--on-accent` text `700`; unselected = `--surface` + 1 px `--line`) → yesterday row (eyebrow "YESTERDAY" `9/700`, topic `11/500`, translucent-accent "Read" badge radius 14).
States: **loading** (skeleton bars 18 px title, 150 px hero, four 38 px chips) · **first launch** (well-surface "No topic yet" panel, dashed container for options, "— no history yet —") · **confirmation toast** (`--overlay`, radius 57, padding 12/16, check icon + "Saved as tomorrow's pick", sitting 24 px inset just above the nav, `0 8px 20px` shadow).

### 2 · Quick note
Cancel (`--text-2`) / Done (accent-coloured text `12/800`) header → title `16/800` → "SAVED 9:41 AM" eyebrow in `--text-3` → 1 px divider → body `11/1.7` in `--text-body` with a 2×12 px accent caret.

### 3 · Topics
Header: "Topics" `16/800` + "＋ Domain" (accent-coloured icon + label `12/700`). Segmented control: `--well` track radius 32, height 32, padding 4; active thumb `--surface` radius 16 with `0 1px 2px` shadow and `--text` label `11/700`; inactive label `--text-2`.
Categorical: two-column grid gap 12 of domain cards (`--surface`, radius 20, padding 12, card shadow) — folder mark 40×34 (28 px body radius 9 in the domain colour + 24×10 tab radius 6/6/0/0 in its light tint + a 15×3 white strip), ⋮ in `--text-3`, name `12/700`, count `9px` `--text-2`.
All: single `--surface` card radius 20 with rows (padding 8/12, 1 px `--line` bottom divider, name `11px`, category tag right).
New-domain sheet: scrim, sheet radius 20 top, 36×4 handle, "New domain" `15/800`, "NAME" eyebrow, `--well` field radius 14 with caret, "COLOUR" eyebrow, six 32 px swatches (selected ringed `0 0 0 2px --surface, 0 0 0 4px --accent`), Cancel outline + "Create domain" filled accent.
Filtered domain: back header (`--accent`, chevron + "Topics"), domain name + count, list card with dated rows. Empty domain: well panel, muted copy. Loading: 20 px title bar, 32 px segmented bar, two 88 px card blocks.

### 4 · Note View
Header: back chevron + toc icon, both `20px` `--text`. Title `16/800`, category tag beneath. Body: "BRIEF" eyebrow then `11/1.5` `--text-body`. Selected passage: `#FDE68A` highlight with `box-decoration-break: clone`, and a dark callout (`--overlay`, radius 10, `9/600`, 8 px arrow) reading "Highlight · Copy · Link". Edit toolbar: `--surface`, radius 20, padding 12, inset 28, four icons spread evenly — active tool = 18 px icon in `--on-accent` on a circular accent fill (6 px padding), inactive = `--text-2`.
Detail (scrolled): "DETAILED NOTES" eyebrow, body copy, 3×3 payoff table (`9px`, header cells on `--well`, body cells 1 px `--line`, key cell tinted with the accent at 10–15% and `700`), dashed diagram placeholder, "RESOURCES" eyebrow, three link rows.
TOC sheet: 226 px sheet, handle, "Sections" `13/800`, rows — active in `--text` `700`, the rest `--text-2`.
Loading: 16 px title, 10 px tag, three body bars. Save failed: `--danger-bg` banner radius 14 with error icon and "Save failed — edits not synced. Tap to retry.", plus the affected block outlined 1.5 px in `--danger`.

### 5 · Settings
"Settings" `16/800`. Group 1 (`--well` card radius 20): Prompt row — name `11/700`, chevron, truncated prompt beneath in `9px` `--text-2`; Timing row — value right-aligned, note "Change schedule in Cowork — view only here". Group 2: two notification switches. "APPEARANCE" eyebrow + card: Dark mode switch, then "Theme colour" row with four 20 px swatches (neutral, `#D97635`, `#5C6B2C`, `#3B5FC4`), the active one ringed `0 0 0 2px --well, 0 0 0 4px --accent`. "STATS" eyebrow + card: two centred stats (`16/800` value, `9px` label), then a "Most active" line.
Switch geometry: track 28×16 radius 9, knob 12 px inset 2. On = accent track + `--on-accent` knob at right. Off = `--track-off` track + knob at left (light mode adds `0 1px 2px rgba(0,0,0,.2)` on the knob).
Prompt detail: back header, "Prompt" title, `--well` card with "ACTIVE PROMPT" eyebrow and the prompt at `12/1.7`, a four-row key/value card, and a lock line "Read only — edit this prompt in Cowork".

### 6 · Add custom topic (from the FAB)
Sheet with topic-name field and a domain row; tapping the domain opens a wheel picker sheet — Cancel / "Domain" / Done header, 5 visible rows, the centred selection on a `--well` rounded band at `12/800` with neighbours fading through `--text-3` to `--dashed`.
Confirmation: 44 px circular accent fill with a check in `--on-accent`, "We'll let you know" `15/800`, one muted line "You'll get a notification once your note is ready", outlined "Got it".

## Interactions & behaviour

- Nav: three-item pill; the active item is an accent-filled capsule (radius 16, padding 8/16) with its label shown; inactive items are `--text-2` icons with labels hidden. FAB (+) opens the custom-topic sheet.
- Picking a "for tomorrow" option: optimistic selected style **plus** a toast for ~2 s. The Notion write is background; a failure must revert the selection and surface the error.
- Sheets: slide up from the bottom over a `rgba(0,0,0,.4–.5)` scrim; drag handle present; tapping the scrim dismisses. Wheel picker commits on Done.
- Note View: read → tap → edit. Selection shows the callout; the toolbar covers cursor-position inserts. Saving needs a visible saving/saved indication, failure a tappable retry.
- Theme change applies immediately across all surfaces; mode and accent persist locally.
- Transitions in the mocks: `transform .15s ease` on nav items, `box-shadow/transform .2s ease` on the nav pill and FAB. Keep motion at 150–200 ms, ease-out.
- Responsive: single portrait column, 393 px reference. Content scrolls under the fixed nav; the nav never scrolls away.

## State management

- Server data (from Notion, via the app's own API routes): today's note, tomorrow's options, yesterday's note, the note list, the Domains list, note bodies, stats, prompt/schedule metadata.
- Client state: active tab, selected tomorrow-option (optimistic), sheet open/step (form → picker → confirmation), note read/edit mode, current selection range, TOC sheet open, save status (idle/saving/saved/error), toast queue.
- Persisted locally: theme mode (dark/light) and accent choice only.
- Every mutation is a queued write to Notion: pick tomorrow, queue custom topic, create domain, save note edits. All four need pending/success/failure UI.

## Assets

- Fonts: Manrope and Material Symbols Rounded (Google Fonts) — self-host for the PWA.
- `image-slot.js` is a design-time placeholder for the Home hero image. Replace it with the real image source, or fall back to a `--well` surface with the tag and title if no imagery exists.
- Folder icons, tags, switches, and the wheel picker are all CSS/DOM in the mocks — no image assets to export.
- No third-party brand assets are used.

## Files in this bundle

| File | Role |
| --- | --- |
| `UI Designs v2 Dark White.dc.html` | Reference build — all screens and states, dark mode |
| `UI Designs v2 Light.dc.html` | Light mode, derived from the same tokens |
| `Design System.dc.html` | Token, type, geometry, component, and rules reference |
| `Interactive Prototype.dc.html` | Clickable core flow |
| `PRODUCT-SPEC.md` (the project's CLAUDE.md) | Product and technical spec (Notion model, architecture, scope) |
| `design.md` | Screen-by-screen behavioural spec |
| `support.js`, `image-slot.js` | Runtime needed to open the HTML files locally |
