import type { CategoryKey } from "./types";

// Category identity — folder-icon colours (fixed, never follows the accent)
// and the matching tag-pill colour pair, keyed off the CSS custom
// properties defined in globals.css.
export const CATEGORY_META: Record<
  CategoryKey,
  { label: string; bodyVar: string; tabVar: string; tagBgVar: string; tagTextVar: string }
> = {
  science: {
    label: "Science & Nature",
    bodyVar: "--cat-science-body",
    tabVar: "--cat-science-tab",
    tagBgVar: "--tag-science-bg",
    tagTextVar: "--tag-science-text",
  },
  history: {
    label: "History & Civilization",
    bodyVar: "--cat-history-body",
    tabVar: "--cat-history-tab",
    tagBgVar: "--tag-history-bg",
    tagTextVar: "--tag-history-text",
  },
  math: {
    label: "Math & Logic",
    bodyVar: "--cat-math-body",
    tabVar: "--cat-math-tab",
    tagBgVar: "--tag-math-bg",
    tagTextVar: "--tag-math-text",
  },
  tech: {
    label: "Technology",
    bodyVar: "--cat-tech-body",
    tabVar: "--cat-tech-tab",
    tagBgVar: "--tag-tech-bg",
    tagTextVar: "--tag-tech-text",
  },
  mind: {
    label: "Mind & Psychology",
    bodyVar: "--cat-mind-body",
    tabVar: "--cat-mind-tab",
    tagBgVar: "--tag-mind-bg",
    tagTextVar: "--tag-mind-text",
  },
  health: {
    label: "Health & Medicine",
    bodyVar: "--cat-health-body",
    tabVar: "--cat-health-tab",
    tagBgVar: "--tag-health-bg",
    tagTextVar: "--tag-health-text",
  },
};

export const CATEGORY_KEYS = Object.keys(CATEGORY_META) as CategoryKey[];

// Six swatches offered in the "new domain" colour picker — one per
// category identity, referenced by CSS var so light/dark stay correct.
export const DOMAIN_SWATCHES: { key: CategoryKey; var: string }[] = CATEGORY_KEYS.map((key) => ({
  key,
  var: CATEGORY_META[key].bodyVar,
}));
