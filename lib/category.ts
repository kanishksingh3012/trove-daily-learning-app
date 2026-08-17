import type { CategoryKey } from "./types";

// Category identity — a single fixed colour + light-mode tint per category,
// keyed off the CSS custom properties in globals.css (--cat-*/--cat-*-tint).
// Never follows the theme accent. Tag pills, by contrast, are NOT
// category-coloured in this design — design.md's token table specs a single
// fixed "default blue tag" (--tag-bg/--tag-fg) used for every category tag,
// confirmed in Trove Prototype.dc.html (every tag renders with the same
// var(--tag-bg)/var(--tag-fg) regardless of which category it names).
export const CATEGORY_META: Record<CategoryKey, { label: string; colorVar: string; tintVar: string }> = {
  science: { label: "Science & Nature", colorVar: "--cat-science", tintVar: "--cat-science-tint" },
  history: { label: "History & Civilization", colorVar: "--cat-history", tintVar: "--cat-history-tint" },
  math: { label: "Math & Logic", colorVar: "--cat-math", tintVar: "--cat-math-tint" },
  tech: { label: "Technology", colorVar: "--cat-tech", tintVar: "--cat-tech-tint" },
  mind: { label: "Mind & Psychology", colorVar: "--cat-mind", tintVar: "--cat-mind-tint" },
  health: { label: "Health & Medicine", colorVar: "--cat-health", tintVar: "--cat-health-tint" },
  // Legacy/uncategorised domains outside the six-swatch picker (e.g. an
  // existing "Espionage & Craft" domain) fall back to a muted identity.
  other: { label: "Other", colorVar: "--cat-other", tintVar: "--cat-other-tint" },
};

// The six swatches offered in the "new domain" colour picker — "other" is
// deliberately excluded, it's a fallback identity, not a pickable one.
export const CATEGORY_KEYS = (Object.keys(CATEGORY_META) as CategoryKey[]).filter((k) => k !== "other");

export const DOMAIN_SWATCHES: { key: CategoryKey; var: string }[] = CATEGORY_KEYS.map((key) => ({
  key,
  var: CATEGORY_META[key].colorVar,
}));
