# design.md — UI/UX Specification

## Context

This defines **screens, layout, components, tokens, and interaction behaviour** for the daily learning companion app. The visual language is fixed and fully built: `Trove Prototype.dc.html` in this bundle is the exact, live, clickable reference — every screen, state, and micro-interaction it shows is what to build. This document explains what it does and why; the prototype is ground truth for pixels and motion.

Open `Trove Prototype.dc.html` directly in a browser (`support.js` must sit next to it — both are in this bundle).

## Platform

- Mobile-first, installed as a PWA (Add to Home Screen); designed at a 393 × 852 frame
- Portrait orientation, primary use case
- Bottom navigation: a three-item pill (Home / Topics / Settings), with a separate (+) FAB beside it — both inset 24 px from the side edges, 26 px from the bottom

## Design tokens

Implement as CSS custom properties on the root, swapped by `[data-theme]` (mode) and `[data-accent]` (theme). No component hardcodes a colour.

### Mode — light (default) / dark (reference build)

| Token | Light | Dark |
| --- | --- | --- |
| `--frame` (screen bg) | `#FDFCFA` | `#131316` |
| `--surface` (cards) | `#F7F6F2` | `#1C1D21` |
| `--well` (inputs, nav, chips) | `#F4F2EC` | `#232428` |
| `--line` (dividers) | `#EFEDE7` | `#2C2D33` |
| `--skeleton` | `#EDEAE3` | `#1E1F24` |
| `--text` | `#16171A` | `#F2F0EC` |
| `--text-2` | `#7D7A70` | `#A9A69E` |
| `--text-3` | `#9A968A` | `#7C7A74` |
| `--hl` (highlight) | `#FFE8B8` | `rgba(255,201,139,.28)` |
| `--tag-bg` / `--tag-fg` (default blue tag) | `#E4EBFA` / `#2F4D8F` | `rgba(59,95,196,.22)` / `#9DB4F0` |

### Theme (Settings → Appearance → Theme colour) — 4 options

**There is no separate "pop" colour.** Every accent-driven affordance (FAB, progress bar, active nav pill, index numerals, focus ring, toggle "on" state, "I have read this" done state, activity-graph fill) reads `--accent` directly, so it re-tints with whichever theme is active.

| Theme | `--accent` (light) | `--accent` (dark) | `--on-accent` |
| --- | --- | --- | --- |
| **Neutral** (default) | `#16171A` | `#F2F0EC` | `#FFFFFF` light / `#16171A` dark |
| **Terracotta** | `#D97635` | `#D97635` | `#FFFFFF` (both modes) |
| **Green** | `#5C6B2C` | `#5C6B2C` | `#FFFFFF` (both modes) |
| **Blue** | `#3B5FC4` | `#3B5FC4` | `#FFFFFF` (both modes) |

`--pop-tint` is the one derived helper: a *light* wash of the theme hue (`#F8F7F5` neutral, `#EEB490` terracotta, `#A5AE8B` green, `#93A7DF` blue), used only where a fixed-dark surface (toast icon, note-toolbar active-tool fill) needs a legible accent-flavoured glyph regardless of mode — it is never used for large fills.

`--grad`: three soft radial gradients over an off-white/near-black base, retinted per theme (see `Trove Prototype.dc.html`'s `gradient()` method for the exact stops). Used in exactly one place per screen — the Today's-topic hero and the note header.

### Category palette (identity only — never follows the theme accent)

| Category | Colour | Tint |
| --- | --- | --- |
| Science & Nature | `#2e9e5b` | `#F4F6F1` |
| History & Civilization | `#d97635` | `#FBF3EC` |
| Math & Logic | `#3b5fc4` | `#F2F4F9` |
| Technology | `#7a5fc4` | `#F5F2FA` |
| Mind & Psychology | `#c45f8a` | `#FAF1F5` |
| Health & Medicine | `#2f9e93` | `#F0F7F6` |

Six-swatch picker for new domains uses these same six colours. Dark mode: tint = colour at ~15% alpha over `--well`.

## Typography

Lora (serif, regular weight only) for dates, topic titles, and big numerals — line-height 1.15. Manrope for everything else, 9–13px, weights 500–800. Material Symbols Rounded for icons, 16–24px, `FILL 0` until active (bookmark, nav, tools) when it becomes `FILL 1`.

| Role | Font / size / weight |
| --- | --- |
| Screen title | Lora 26px |
| Note title | Lora 28–30px |
| Hero stat | Lora 26px |
| Note body | Manrope 13px / line-height 1.78 |
| Section eyebrow | Manrope 10px / 700 / uppercase / .1em tracking / `--text-3` |
| Card title | Manrope 11–12px / 600–700 |
| Meta / date | Manrope 9–10px / `--text-3` |
| Tag | Manrope 9px / 700 |

## Geometry

Radius: 55 device frame · 32 sheet top · 26 hero well / primary pill · 20 grouped card / domain card · 16 list row / option card / active segment thumb · 10 tag / resource icon · 3 highlight span · 999 pill (nav, buttons).

Spacing: 4px base scale (4·6·8·10·12·14·16·18·20·22·26·32). 20px screen gutter. 12px default vertical rhythm. 10px grid gap. 44px minimum tap target.

## Motion

Presses scale to 0.96 (0.9 for round icon buttons) over 180ms. Cross-fades/toggles 280ms. Screen transitions, sheet-in, segment slide 380ms on `cubic-bezier(.16,1,.3,1)`. Nav pill travel 440ms. Highlight sweep 500ms via `background-size` (never opacity). Toggle thumbs and selection rings use the spring `cubic-bezier(.34,1.56,.64,1)`. Sheet exit is faster than entry: 220ms on `cubic-bezier(.55,0,1,.45)`. Only `transform` and `opacity`/`background-size` animate. All durations collapse under `prefers-reduced-motion`.

## Screen 1 — Home

Layout, top to bottom:
1. **Header row**: "Welcome back {name}!" (Manrope 11px, `--text-3`) + date (Lora 22px) on the left; two 40px circular `--well` icon buttons on the right — quick-note (`edit_note`) and **Bookmarks** (`bookmark`, opens the Bookmarks sheet — see below).
2. **Your activity** — a compact, un-carded GitHub-style contribution graph (see "Activity tracker" below). No card background; sits directly on the frame to avoid wasting vertical space.
3. **Today's topic** — the hero: gradient well, eyebrow, category tag, Lora title, one-line blurb, filled "Read now" pill → opens Note View.
4. **For tomorrow, select** — 2×2 grid of option chips (the same options the Cowork run already generated). Tapping one cross-fades it to the accent fill and raises a toast ("Saved as tomorrow's pick"); this writes to the `Selected Topic` Notion field.
5. **Yesterday** — a smaller `--surface` row: eyebrow, topic name, outline "Read" button.

### Activity tracker (new)
A GitHub-contribution-graph-style calendar: one column per week, one 8×8px cell per day, all-time range (horizontally scrollable — the graph never truncates history). Month labels in a row above the grid. Cell fill is count-based, using `color-mix(in srgb, var(--accent) {28|55|80|100}%, var(--well))` at thresholds 1 / 2–3 / 4–5 / 6+ reads that day — so the graph always matches the active theme colour, never a fixed green. A header row shows "YOUR ACTIVITY" (eyebrow) and "{n} reads all-time" (right-aligned, `--text-3`). Each cell has a native tooltip (`title`) with the count and date.

Data source: a count of notes marked "read" per calendar day (see the Note View button below) — this is the only thing that increments the graph.

### Bookmarks (new)
A separate concept from "read" — bookmarks are "save for later," not "I finished this." The header's bookmark icon opens a bottom sheet titled "Bookmarks" listing every note the user has starred (via the bookmark icon in Note View's header), each row tappable to reopen that note. Empty state: "No bookmarks yet. Tap the bookmark icon in a note to save it here."

States designed: loading skeleton, core, quick-note capture sheet, Bookmarks sheet (populated + empty), tap-confirmation toast.

## Screen 2 — Add custom topic (bottom sheet, from the FAB)

- Fields: topic name (text input), domain (a snap-scroll wheel picker sourced from the live Domains list)
- Submit shows a brief spinner state, then transitions the sheet into a confirmation: gradient icon circle, "Queued", one line naming the topic + domain, "We'll notify you when the note is ready", "Done" to dismiss
- **Queued, not instant** — copy states this explicitly; the note appears after the next scheduled Cowork run
- Submits into the same `Selected Topic` field the Home "for tomorrow" picks use — one system, not two

## Screen 3 — Topics / Directory

- Header: "Topics" (Lora 26px) + "+ Domain" ghost button, opening the new-domain sheet
- Segmented control: **Categorical** / **All**, sliding `--frame`-coloured thumb over a `--well` track
  - **Categorical** → two-column grid of domain cards (tinted to the domain's own colour, folder icon on a `--frame` chip, name, note count), staggered 45ms entrance
  - **All** → flat list of every note, each row ending in its category tag, staggered 40ms entrance
- Tapping a domain opens a filtered note list (back header, domain name, dated rows) with its own empty state ("Nothing here yet" + "Request a topic" CTA straight into the Add sheet)
- New-domain sheet: name field, six-swatch colour picker (ring on selection), "Create domain" (disabled look until a name is entered)

States designed: categorical, all, new-domain sheet, filtered domain, empty domain, loading.

## Screen 4 — Note View

- Header (over the gradient, becomes an opaque compact bar with the title centred after ~110px of scroll): back, then a jump-to-section icon (`toc`) and bookmark icon (fills solid + accent colour when saved, with a spring pulse on toggle) on the right
- A 3px accent-coloured progress bar tracks scroll position across the full top edge
- Body sections in order: **Brief** (highlightable paragraphs), **Concept Index** (numbered list, Lora accent-coloured numerals), **Detailed Notes** (body copy, a payoff table, a simple two-node diagram block), **Resources** (icon + title + meta rows)
- Tapping a highlightable paragraph with the "highlight" tool active sweeps a warm highlight fill in from the left over 500ms (writes `<span color="yellow_bg">` to Notion); the "text" tool instead raises a selection callout (Highlight / Copy / Link) on an ink pill
- Floating toolbar (always ink, both modes): text, highlight, image, link — the active tool gets a `--pop-tint` filled circle springing in from scale 0.4
- **"I have read this" button (new)** — sits at the very end of the note, after Resources, full-width, outline `--well` pill with a `task_alt` icon. Tapping it: locks to a done state (`check_circle` icon, `--accent`-tinted background and text, "Marked as read", no longer tappable), raises a toast ("Marked as read for today"), and adds one count to today's cell on the Home activity graph. This is the sole action that feeds the activity tracker — distinct from bookmarking.
- TOC sheet: tappable rows that smooth-scroll to each section and close the sheet

States designed: reading/editing with selection callout, scrolled detail with table + diagram + resources + the read button, TOC sheet, loading, save-failed (see Explicitly-out-of-scope note below — visual state exists in earlier iterations; carry the same pattern: a `--danger`/`--danger-bg` banner with retry).

## Screen 5 — Settings

- Header "Settings" + a gradient stat strip: total notes, domain count, most-active domain (Lora numerals)
- **Appearance** card: Dark-mode toggle; Theme-colour row with four swatches (Neutral/Terracotta/Green/Blue), selection ringed
- **Notifications** card: two toggles — today's note ready, custom topic ready
- **Automation** card: "The prompt" and "Timing" rows, both locked (lock glyph) with a note pointing to Cowork — this app never edits the schedule or prompt
- All toggles: 46×27 track, thumb takes `--on-accent` when on / `--text-3` when off (never hardcoded white — this keeps contrast correct in the monochrome-dark-Neutral case where the track itself is off-white)

States designed: core, prompt detail (own screen, back header + read-only prompt text in monospace), loading.

## Explicit non-goals for this pass

- No onboarding flow, no auth, no search or multi-note comparison
- No real-time/on-demand generation — everything content-related is queued through Cowork
- Changing the Cowork schedule/prompt from inside the app

## Pairing

`Trove Prototype.dc.html` is the literal spec — open it, click through every state listed above, and match it pixel-for-pixel and interaction-for-interaction. This document exists to explain intent and data flow where the prototype's sample data (hardcoded note content, a fixed "today" of 17 Aug 2026, synthetic activity history) stands in for the real Notion-backed values.
