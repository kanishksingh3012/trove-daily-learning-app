import { CATEGORY_META } from "@/lib/category";
import type { CategoryKey } from "@/lib/types";

// design.md: every category tag renders with the single fixed --tag-bg/
// --tag-fg pair ("default blue tag") — category identity colour is used
// elsewhere (domain cards, folder icons), not on this pill.
export default function Tag({ category }: { category: CategoryKey }) {
  const meta = CATEGORY_META[category];
  return (
    <span
      style={{
        display: "inline-flex",
        background: "var(--tag-bg)",
        color: "var(--tag-fg)",
        borderRadius: "var(--r-tag)",
        padding: "4px 10px",
        fontSize: 9,
        fontWeight: 700,
        lineHeight: 1,
        whiteSpace: "nowrap",
      }}
    >
      {meta.label}
    </span>
  );
}
