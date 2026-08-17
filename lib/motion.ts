/**
 * Trove motion tokens — mirrors the CSS custom properties in
 * app/globals.css (the d- and e- prefixed vars) for use in component logic
 * (stagger delays, JS-driven timing). See design_handoff_daily_learning_app/
 * design.md's "Motion" section and Trove Prototype.dc.html for source.
 */

export const duration = {
  /** Presses: .96 scale (.9 round icon buttons). */
  press: 180,
  /** Cross-fades, toggles. */
  fade: 280,
  /** Screen transitions, sheet-in, segment slide. */
  screen: 380,
  /** Nav pill travel. */
  nav: 440,
  /** Highlight sweep (background-size, never opacity). */
  sweep: 500,
  /** Sheet exit — faster than its 380ms entry. */
  exit: 220,
} as const;

export const easingCss = {
  /** Screen transitions, sheet-in, segment slide, nav pill travel. */
  screen: "cubic-bezier(0.16, 1, 0.3, 1)",
  /** Toggle thumbs, selection rings, pop-ins. */
  spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
  /** Sheet exit. */
  exit: "cubic-bezier(0.55, 0, 1, 0.45)",
} as const;

/** Per-item delay for staggered list/grid entries, in ms (listIn keyframe). */
export const stagger = {
  /** Topics -> Categorical domain grid. */
  domainCards: 45,
  /** Topics -> All flat note list. */
  noteList: 40,
  /** Notes inside a filtered domain. */
  domainNotes: 50,
} as const;

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
