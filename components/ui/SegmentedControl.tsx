"use client";

export default function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (next: T) => void;
}) {
  const index = options.findIndex((o) => o.value === value);

  return (
    <div
      role="tablist"
      style={{
        position: "relative",
        display: "flex",
        background: "var(--well)",
        borderRadius: 22,
        height: 38,
        padding: 4,
        boxSizing: "border-box",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: 4,
          bottom: 4,
          left: 4,
          width: `calc(50% - 4px)`,
          background: "var(--frame)",
          borderRadius: 18,
          boxShadow: "0 2px 6px rgba(0, 0, 0, 0.08)",
          transition: "transform var(--d-screen) var(--e-screen)",
          transform: `translateX(${index * 100}%)`,
        }}
      />
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(opt.value)}
            style={{
              position: "relative",
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: active ? "var(--text)" : "var(--text-3)",
              fontSize: 11,
              fontWeight: 700,
              transition: "color var(--d-fade) ease",
            }}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
