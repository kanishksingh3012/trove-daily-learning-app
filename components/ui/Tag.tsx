import { CATEGORY_META } from "@/lib/category";
import type { CategoryKey } from "@/lib/types";

export default function Tag({ category }: { category: CategoryKey }) {
  const meta = CATEGORY_META[category];
  return (
    <span
      style={{
        display: "inline-block",
        background: `var(${meta.tagBgVar})`,
        color: `var(${meta.tagTextVar})`,
        borderRadius: "var(--r-tag)",
        padding: "4px 8px",
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
