/**
 * Motion tokens — Daily Learning Companion
 *
 * The complete set of durations, easings and stagger values used by the app.
 * Extracted from `Interactive Prototype v2.dc.html`. Nothing in the UI should
 * declare a raw duration or cubic-bezier — import from here.
 *
 * Paired with `motion.css` for the same values as CSS custom properties.
 * See MOTION-SPEC.md for which interaction uses which token.
 */

export const easing = {
  /** Default. Presses, hovers, screen pushes, card lifts. */
  out: [0.2, 0.8, 0.2, 1],
  /** Fixed-track travel: segmented thumb, nav pill growth. */
  slide: [0.2, 0.85, 0.2, 1],
  /** Sheets, toasts, toggle knobs, pop-ins. Settles at the end. */
  spring: [0.2, 0.9, 0.2, 1],
  /** The highlight wipe only. Fast start, long tail. */
  wipe: [0.3, 0.9, 0.2, 1],
  /** Theme/mode recolouring, shadow and opacity fades. */
  fade: [0.25, 0.1, 0.25, 1],
  /** Shimmer and spinner loops. */
  linear: [0, 0, 1, 1],
} as const;

/** CSS-string form of the same curves, for stylesheets and inline styles. */
export const easingCss = {
  out: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
  slide: 'cubic-bezier(0.2, 0.85, 0.2, 1)',
  spring: 'cubic-bezier(0.2, 0.9, 0.2, 1)',
  wipe: 'cubic-bezier(0.3, 0.9, 0.2, 1)',
  fade: 'ease',
  linear: 'linear',
} as const;

/** Milliseconds. */
export const duration = {
  /** Tap-down scale on buttons. */
  press: 160,
  /** Icon button press, hover background, tool swap. */
  quick: 180,
  /** Colour and state changes on a control. */
  base: 220,
  /** Text and control fills during a theme swap. */
  modeText: 250,
  /** Surfaces during a theme swap. */
  modeSurface: 350,
  /** Segmented thumb, nav pill morph, screen push. */
  move: 280,
  /** Screen push-in. */
  push: 300,
  /** Bottom sheet rise. */
  sheet: 340,
  /** Sheet dismissal — faster than the rise. */
  sheetOut: 260,
  /** Toast and toolbar entry. */
  toast: 360,
  /** Toast dismissal. */
  toastOut: 200,
  /** List item entry. */
  row: 300,
  /** Domain card entry — slightly longer, they travel further. */
  card: 380,
  /** Pop-in for the confirmation check and the selection callout. */
  pop: 220,
  /** Confirmation check circle. */
  popLarge: 400,
  /** Highlight wipe. */
  wipe: 450,
  /** Error shake. */
  shake: 450,
  /** Skeleton shimmer sweep, looping. */
  shimmer: 1150,
  /** Sync spinner, looping. */
  spin: 1000,
  /** Text caret blink, looping. */
  caret: 1000,
} as const;

/** Per-item delay for staggered list entries, in ms. */
export const stagger = {
  /** Topics → Categorical domain grid. */
  domainCards: 45,
  /** Topics → All flat note list. */
  noteList: 30,
  /** Notes inside a filtered domain. */
  domainNotes: 45,
  /** TOC sheet section rows. */
  tocRows: 40,
} as const;

/**
 * Timings that are not animations — skeleton dwell, auto-dismiss, thresholds.
 * The three `*Skeleton` values are prototype stand-ins for real request latency:
 * show the skeleton until the fetch resolves, with these as the minimum so the
 * flash does not read as a glitch.
 */
export const timing = {
  /** Cold start skeleton, minimum. */
  bootSkeleton: 900,
  /** First visit to a tab, minimum. */
  tabSkeleton: 650,
  /** Note open, minimum. */
  noteSkeleton: 600,
  /** Toast visible before auto-dismiss. */
  toastDwell: 2400,
  /** "Saving…" minimum before the result shows. */
  saveMin: 900,
  /** "Saved to Notion" pill before it clears itself. */
  saveConfirmDwell: 1600,
  /** Delay before scrolling the wheel picker to the selected row on open. */
  wheelSettle: 60,
} as const;

/** Scroll thresholds in px, for the Note View header collapse. */
export const scrollThreshold = {
  /** Header gains its shadow. */
  headerShadow: 8,
  /** Header title fades in. */
  headerTitle: 24,
  /** Scroll delta that dismisses an open selection callout. */
  dismissCallout: 6,
} as const;

/** Wheel picker geometry — row height drives snap and index maths. */
export const wheel = { rowHeight: 40, visibleRows: 5 } as const;

/** Transform values used as motion, not as layout. */
export const transform = {
  /** Button tap-down. */
  pressScale: 0.97,
  /** Icon button tap-down. */
  pressScaleIcon: 0.88,
  /** Selected "for tomorrow" card. */
  selectedScale: 1.03,
  /** Active toolbar tool. */
  activeToolScale: 1.06,
  /** Selected accent swatch. */
  activeSwatchScale: 1.1,
  /** Domain card hover lift, px. */
  cardLift: -3,
  /** Screen push-in start offset, px. */
  pushOffset: 28,
  /** List row entry start offset, px. */
  rowOffset: 10,
  /** Toast/toolbar entry start offset, px. */
  toastOffset: 24,
  /** FAB open state. */
  fabRotate: 135,
} as const;

/** Composed transitions, ready to spread into a Framer Motion `transition`. */
export const transitions = {
  press: { duration: duration.press / 1000, ease: easing.out },
  hover: { duration: duration.quick / 1000, ease: easing.out },
  control: { duration: duration.base / 1000, ease: easing.fade },
  navMorph: { duration: duration.move / 1000, ease: easing.slide },
  screenPush: { duration: duration.push / 1000, ease: easing.out },
  sheetIn: { duration: duration.sheet / 1000, ease: easing.spring },
  sheetOut: { duration: duration.sheetOut / 1000, ease: easing.out },
  toastIn: { duration: duration.toast / 1000, ease: easing.spring },
  highlightWipe: { duration: duration.wipe / 1000, ease: easing.wipe },
  themeSwap: { duration: duration.modeSurface / 1000, ease: easing.fade },
} as const;

/**
 * Reduced motion. Check once and pass through every transition:
 *   const t = reduce ? instant : transitions.sheetIn
 * Colour and opacity changes may keep their duration; movement, rotation,
 * looping shimmer/spin and stagger delays all go to zero. See MOTION-SPEC.md
 * for the per-interaction list of what to drop.
 */
export const instant = { duration: 0 } as const;

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;
