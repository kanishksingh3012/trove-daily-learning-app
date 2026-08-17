# Motion spec — Daily Learning Companion

Every animation in `Interactive Prototype v2.dc.html`, as built. Durations and curves are the real values in that file; if this document and the prototype ever disagree, the prototype is the source of truth.

Token names below refer to `motion.ts` / `motion.css` (durations `d-*`, easings `e-*`). Nothing here should be eyeballed — use the tokens.

## Easing curves

| Token | Value | Use |
| --- | --- | --- |
| `e-out` | `cubic-bezier(.2, .8, .2, 1)` | Presses, hovers, screen pushes, card lifts. The default. |
| `e-slide` | `cubic-bezier(.2, .85, .2, 1)` | Things that travel a fixed track: segmented thumb, nav pill growth. |
| `e-spring` | `cubic-bezier(.2, .9, .2, 1)` | Sheets, toasts, toggle knobs, pop-ins. Slight settle at the end. |
| `e-wipe` | `cubic-bezier(.3, .9, .2, 1)` | The highlight wipe only — fast start, long tail. |
| `e-linear` | `linear` | Skeleton shimmer, spinner. |

## Durations

| Token | ms | Use |
| --- | --- | --- |
| `d-press` | 160 | Tap-down scale on buttons. |
| `d-quick` | 180 | Icon button press, hover background, tool swap. |
| `d-base` | 220 | Colour/state changes on a control (selection fill, ring). |
| `d-mode` | 250–350 | Mode and accent recolouring (see note below). |
| `d-move` | 280–300 | Segmented thumb, nav pill morph, screen push. |
| `d-sheet` | 340 | Bottom sheet rise. |
| `d-toast` | 360 | Toast entry. |
| `d-wipe` | 450 | Highlight fill. |
| `d-shimmer` | 1150 | Skeleton sweep, looping. |
| `d-spin` | 1000 | Sync spinner, looping. |

Mode/accent recolour is not one animation — it is every themed property transitioning at once. Surfaces use 350ms, text and control fills 220–250ms. Implement by putting `transition: background .35s var(--e-fade), color .25s var(--e-fade)` on the frame and on themed containers, then swapping the CSS custom properties at the root. Do not animate the variables themselves.

## Stagger

| List | Per-item delay |
| --- | --- |
| Domain grid cards (Topics → Categorical) | 45ms |
| Flat note list (Topics → All) | 30ms |
| Filtered domain note rows | 45ms |
| TOC sheet rows | 40ms |

Entry animation for all four: `translateY(10px) → 0` + `opacity 0 → 1`, 300–380ms, `e-out`, `forwards` fill so the item does not flash back to hidden.

## Timings not tied to a curve

| Behaviour | Value |
| --- | --- |
| First app load skeleton | 900ms |
| First visit to a tab, skeleton | 650ms |
| Note open skeleton | 600ms |
| Toast visible before auto-dismiss | 2400ms |
| Notion write, "Saving…" duration | 900ms (replace with the real request) |
| "Saved to Notion" pill auto-clears after | 1600ms |
| Wheel picker scroll-to-selected on open | 60ms after mount |

Skeletons are shown once per tab per session, not on every navigation. Reload is available from the prototype's simulate row; in production it is a pull-to-refresh or a stale-data check.

---

## 1 · Home

| # | Trigger | Element | Animates | Duration / easing |
| --- | --- | --- | --- | --- |
| 1.1 | Tap-down on any button | The button | `scale(1) → .94–.97` | `d-press` `e-out` |
| 1.2 | Hover on "Read now" | Button | `filter: brightness(1) → 1.06` | `d-press` `e-out` |
| 1.3 | Hover/press quick-note icon | 30px circle | `background: transparent → accent-soft`, `scale → .88` on press | `d-quick` `e-out` |
| 1.4 | Tap a "for tomorrow" card | The tapped card | `background surface → accent`, `color text → on-accent`, `border-color → transparent`, `font-weight 500 → 700`, `scale(1) → 1.03` | `d-base` for colour, `d-base` `e-out` for scale |
| 1.5 | Same tap | Previously selected card | Reverses 1.4 with the same values | `d-base` |
| 1.6 | Same tap | Toast | `translateY(24px) scale(.96) opacity 0` → overshoot to `translateY(-2px)` at 60% → settle `translateY(0) scale(1)` | `d-toast` `e-spring` |
| 1.7 | 2400ms later | Toast | Unmounts. No exit animation in the prototype — add a 200ms `opacity → 0, translateY(8px)` in production. | — |
| 1.8 | Tap quick-note icon | Quick-note screen | `opacity 0 → 1` | 200ms `ease` |
| 1.9 | Quick-note screen shown | Caret bar | `opacity 1 → 0` step blink | 1000ms `steps(1)` infinite |

State written on 1.4: `Selected Topic` on the Notion parent page. The toast is optimistic — it appears on tap, not on response. If the write fails, replace the toast with the error variant (3.10).

## 2 · Tab bar and FAB

| # | Trigger | Element | Animates | Duration / easing |
| --- | --- | --- | --- | --- |
| 2.1 | Tab tap | Newly active item | `background: transparent → accent`, `color → on-accent`, `padding: 8px 10px → 8px 14px` | `d-move` `e-slide` |
| 2.2 | Tab tap | Its label | `max-width: 0 → 48px`, clipped by `overflow:hidden` | `d-move` `e-slide` |
| 2.3 | Tab tap | Outgoing item | Reverses 2.1 and 2.2 | `d-move` `e-slide` |
| 2.4 | Tab tap | New screen | `opacity 0 → 1` | 250ms `ease` |
| 2.5 | FAB tap | FAB | `rotate(0) → rotate(135deg)` — the plus becomes a close mark | 300ms `e-spring` |
| 2.6 | FAB press | FAB | `scale → .9` | `d-press` `e-out` |

The label reveal is a `max-width` animation, not opacity — the pill's other items must physically make room. If you rebuild with Framer Motion, `layout` on the pill children gives the same result more cheaply.

## 3 · Note View

| # | Trigger | Element | Animates | Duration / easing |
| --- | --- | --- | --- | --- |
| 3.1 | Open a note | Whole screen | `translateX(28px) opacity 0 → translateX(0) opacity 1` | 300ms `e-out` |
| 3.2 | Scroll past 8px | Header | `box-shadow: none → 0 6px 18px -8px rgba(0,0,0,.5)` | 250ms `ease` |
| 3.3 | Scroll past 24px | Header title | `opacity 0 → 1` | 250ms `ease` |
| 3.4 | Any scroll > 6px delta | Open callout | Dismissed immediately | — |
| 3.5 | Tap body text | Toolbar | `translateY(24px) scale(.96) opacity 0` → settle (same keyframes as the toast) | `d-toast` `e-spring` |
| 3.6 | Tap a sentence | Callout above it | `scale(.7) opacity 0` → overshoot `scale(1.06)` at 70% → `scale(1)` | 220ms `e-spring` |
| 3.7 | Tap a toolbar tool | Tool button | `background → accent`, `color → on-accent`, `scale → 1.06`; previous tool reverses | `d-base` / `d-quick` `e-out` |
| 3.8 | Tap "Highlight" | The sentence | `background-size: 0% 100% → 100% 100%` on a `linear-gradient(--hl,--hl)` layer, plus `color → --hl-text` | `d-wipe` `e-wipe` for the size, 300ms for colour |
| 3.9 | Highlight applied | Sync pill | Mounts with the row entry (`translateY(10px)`, 250ms); icon spins at `d-spin` linear while saving; text swaps to "Saved to Notion" at 900ms; unmounts 1600ms later | see table above |
| 3.10 | Save fails | Sync pill | `translateX` shake: 0 → −5 → 5 → −3 → 3 → 0, plus `danger-bg` / `danger` colours | 450ms `ease` |
| 3.11 | Tap the failed pill | — | Retries; returns to 3.9's saving state | — |
| 3.12 | toc icon press | Icon | `scale → .9` | `d-press` |
| 3.13 | toc icon tap | Scrim | `opacity 0 → 1` | 220ms `ease` |
| 3.14 | toc icon tap | Sheet | `translateY(100%) → 0` | `d-sheet` `e-spring` |
| 3.15 | Sheet shown | Rows | Staggered entry, 40ms apart | 300ms `e-out` |
| 3.16 | Tap a TOC row | Scroll container | `scrollTo({ top: section.offsetTop − 8, behavior: 'smooth' })` — native smooth scroll, not a tween | native |

The highlight is a `background-size` wipe on a gradient layer, not a `background-color` fade. It reads as ink being drawn across the words. Keep the gradient trick; a colour fade loses the effect. When wired to Notion, the wipe is optimistic and the sync pill carries the truth — the highlight only reverts if the `PATCH` fails and the user declines to retry.

## 4 · Topics

| # | Trigger | Element | Animates | Duration / easing |
| --- | --- | --- | --- | --- |
| 4.1 | Segmented control tap | Thumb | `translateX(0) ↔ translateX(100%)` | 300ms `e-slide` |
| 4.2 | Segmented control tap | Both labels | `color` and `font-weight` swap | 200ms `ease` |
| 4.3 | Categorical shown | Domain cards | Staggered entry, 45ms apart | 380ms `e-out` |
| 4.4 | Hover a domain card | Card | `translateY(0) → -3px` | `d-quick` `e-out` |
| 4.5 | Press a domain card | Card | `scale → .97` | `d-quick` `e-out` |
| 4.6 | All shown | List rows | Staggered entry, 30ms apart | 300ms `e-out` |
| 4.7 | Hover a list row | Row | `background → accent-soft` | 160ms `ease` |
| 4.8 | Tap a domain | Filtered screen | Push-in, as 3.1 | 280ms `e-out` |
| 4.9 | Filtered screen | Note rows | Staggered entry, 45ms apart | 300ms `e-out` |
| 4.10 | Empty domain | Empty card | `opacity 0 → 1` | 300ms `ease` |

## 5 · Sheets — new domain, new topic

| # | Trigger | Element | Animates | Duration / easing |
| --- | --- | --- | --- | --- |
| 5.1 | Sheet opens | Scrim | `opacity 0 → 1` | 220ms `ease` |
| 5.2 | Sheet opens | Sheet | `translateY(100%) → 0` | `d-sheet` `e-spring` |
| 5.3 | Focus a text field | Field | `border-color: transparent → accent-line` | 200ms `ease` |
| 5.4 | Tap a colour swatch | Swatch | `box-shadow: none → 0 0 0 2px surface, 0 0 0 4px text` (double ring), `scale → 1.06`; press dips to `.88` | `d-base` for ring, 200ms `e-spring` for scale |
| 5.5 | Field empty → filled | Primary button | `background: line → accent`, `color → text-3 → on-accent`, `opacity .7 → 1` | 200ms `ease` |
| 5.6 | Create domain | New card | Appears first in the grid and runs the 45ms-stagger entry with the rest | 380ms `e-out` |
| 5.7 | Create domain | Toast | As 1.6, with the folder icon | `d-toast` `e-spring` |
| 5.8 | Tap the domain row | Wheel sheet | Rises above the topic sheet, `translateY(100%) → 0` | 300ms `e-spring` |
| 5.9 | Wheel scroll | Centred row | `font-size 10 → 12px`, `font-weight 500 → 800`, `color text-3 → text` | 200ms `ease` |
| 5.10 | Wheel scroll release | Wheel | `scroll-snap-type: y mandatory`, 40px row height, `scroll-snap-align: center` | native snap |
| 5.11 | Tap a wheel row | Wheel | `scrollTo({ top: index * 40, behavior: 'smooth' })` | native |
| 5.12 | Queue a topic | Confirm sheet | Sheet rise, then the check circle pops: `scale(.7) opacity 0` → `1.06` at 70% → `1` | `d-sheet` then 400ms `e-spring` |
| 5.13 | Scrim tap | Sheet | Dismissed instantly in the prototype. In production, exit with `translateY(100%)` over 260ms `e-out` and fade the scrim over 200ms. | — |

Both sheets write to the same `Selected Topic` field. The confirmation copy has to keep saying the note arrives on the next run — the animation makes it feel instant, the words must not.

## 6 · Settings

| # | Trigger | Element | Animates | Duration / easing |
| --- | --- | --- | --- | --- |
| 6.1 | Toggle tap | Track | `background: line → accent` | 250ms `ease` |
| 6.2 | Toggle tap | Knob | `left: 2px → 14px`, `background: text-2 → on-accent` | 250ms `e-spring` |
| 6.3 | Dark-mode toggle | Every themed surface | Root custom properties swap; `background` transitions at 350ms, `color` and control fills at 220–250ms | `e-fade` |
| 6.4 | Accent swatch tap | Swatch | Double ring in, `scale → 1.1`; previous swatch reverses | `d-base` ring, `d-quick` `e-out` scale |
| 6.5 | Accent swatch tap | Whole app | Accent-derived properties transition wherever a `transition` is declared on the property | 220–350ms |
| 6.6 | Prompt row tap | Prompt screen | Push-in, as 3.1 | 280ms `e-out` |
| 6.7 | Prompt row hover | Row | `background → accent-soft` | 160ms `ease` |

Accent swatches are 20px and domain swatches 32px, both with `flex: 0 0 <size>` — without the flex basis they collapse to zero width in their row.

## 7 · Loading and empty

| # | Element | Animates | Duration / easing |
| --- | --- | --- | --- |
| 7.1 | Skeleton bar / tile | `background-position: -160px → calc(160px + 100%)` on a `linear-gradient(90deg, skeleton, shine 45%, skeleton 90%)` with `background-size: 160px 100%` | `d-shimmer` `e-linear` infinite |
| 7.2 | Skeleton screen | `opacity 0 → 1` on mount | 200ms `ease` |
| 7.3 | Sync spinner | `rotate(0 → 360deg)` | `d-spin` `e-linear` infinite |
| 7.4 | Caret | `opacity 1 → 0` at 45%/55% | 1000ms `steps(1)` infinite |

Skeleton geometry per screen matches the real layout it replaces — Home is a 55% title bar, a 150px hero, a 35% label, then four 38px tiles. Do not use a generic three-bar skeleton.

## Accessibility

Wrap every non-essential animation in `@media (prefers-reduced-motion: reduce)` and drop to opacity-only or nothing:

- Keep: colour and opacity changes, the sync pill's text swaps.
- Drop: shimmer, spinner rotation, sheet rise (show immediately), push-in, stagger delays, the highlight wipe (apply the highlight instantly), the FAB rotation, the toast overshoot.
- The caret blink is a text cursor and can stay.

Every interactive element in the prototype is a real `<button>` or input. Keep it that way — several of these interactions currently read as taps on `<span>`s only for the highlightable sentences, which in production should be a text selection handler on a contenteditable region.
