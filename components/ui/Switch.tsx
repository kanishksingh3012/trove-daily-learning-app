"use client";

import { useState } from "react";

export default function Switch({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  label?: string;
}) {
  const [pressed, setPressed] = useState(false);

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)}
      style={{
        position: "relative",
        width: 28,
        height: 16,
        borderRadius: 9,
        border: "none",
        padding: 0,
        flexShrink: 0,
        background: checked ? "var(--accent)" : "var(--track-off)",
        transition: "background-color .2s ease",
      }}
    >
      <span
        style={{
          position: "absolute",
          top: 2,
          left: 2,
          width: pressed ? 14 : 12,
          height: 12,
          borderRadius: "50%",
          background: checked ? "var(--on-accent)" : "var(--surface)",
          boxShadow: "var(--shadow-thumb)",
          transform: `translateX(${checked ? 12 : 0}px)`,
          transition:
            "transform .2s cubic-bezier(.34,1.56,.64,1), background-color .2s ease, width .15s ease",
        }}
      />
    </button>
  );
}
