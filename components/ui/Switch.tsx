"use client";

export default function Switch({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  label?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      style={{
        position: "relative",
        width: 46,
        height: 27,
        borderRadius: 14,
        flexShrink: 0,
        transition: "background-color 0.34s ease",
        // Track: accent when on, line when off.
        background: checked ? "var(--accent)" : "var(--line)",
      }}
    >
      <span
        style={{
          position: "absolute",
          top: 3,
          left: 3,
          width: 21,
          height: 21,
          borderRadius: "50%",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.25)",
          transition: "transform 0.34s var(--e-spring), background-color 0.34s ease",
          // Knob: on-accent when on, text-3 when off — never a hardcoded
          // white, so contrast holds in the monochrome-dark-Neutral case
          // where the track itself is off-white (design.md).
          background: checked ? "var(--on-accent)" : "var(--text-3)",
          transform: checked ? "translateX(19px)" : "translateX(0)",
        }}
      />
    </button>
  );
}
