"use client";

import { PlusIcon } from "@/components/icons";

export default function Fab({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      aria-label="Add a custom topic"
      onClick={onClick}
      className="press"
      style={{
        width: 54,
        height: 54,
        borderRadius: "50%",
        flexShrink: 0,
        border: "none",
        background: "var(--accent)",
        color: "var(--on-accent)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: `var(--shadow-nav), 0 0 0 8px var(--accent-glow)`,
        transition: "transform .15s cubic-bezier(0.34,1.56,0.64,1), box-shadow .2s ease",
      }}
    >
      <PlusIcon size={22} strokeWidth={2.2} />
    </button>
  );
}
