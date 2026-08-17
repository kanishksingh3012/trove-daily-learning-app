"use client";

import { PlusIcon } from "@/components/icons";

export default function Fab({ open, onClick }: { open: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-label={open ? "Close" : "Add a custom topic"}
      onClick={onClick}
      className="press-icon"
      style={{
        width: 56,
        height: 56,
        borderRadius: "50%",
        flexShrink: 0,
        background:
          "radial-gradient(circle at 32% 28%, color-mix(in srgb, var(--on-accent) 20%, transparent) 0%, transparent 58%), var(--accent)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "var(--on-accent)",
        boxShadow: "0 8px 18px color-mix(in srgb, var(--accent) 34%, transparent)",
        transition: "transform var(--d-screen) var(--e-spring)",
        transform: open ? "rotate(135deg)" : "rotate(0deg)",
      }}
    >
      <PlusIcon size={24} strokeWidth={2.2} />
    </button>
  );
}
