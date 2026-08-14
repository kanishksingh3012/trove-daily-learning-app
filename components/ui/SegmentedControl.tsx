"use client";

import { useEffect, useRef, useState } from "react";

export default function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (next: T) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const btnRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [thumb, setThumb] = useState<{ left: number; width: number } | null>(null);

  useEffect(() => {
    const index = options.findIndex((o) => o.value === value);
    const btn = btnRefs.current[index];
    const container = containerRef.current;
    if (!btn || !container) return;
    const update = () => {
      setThumb({ left: btn.offsetLeft, width: btn.offsetWidth });
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(container);
    return () => ro.disconnect();
  }, [value, options]);

  return (
    <div
      ref={containerRef}
      role="tablist"
      style={{
        position: "relative",
        display: "flex",
        background: "var(--well)",
        borderRadius: 32,
        height: 32,
        padding: 4,
        gap: 4,
      }}
    >
      {thumb && (
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: 4,
            bottom: 4,
            left: thumb.left,
            width: thumb.width,
            background: "var(--surface)",
            borderRadius: 16,
            boxShadow: "var(--shadow-thumb)",
            transition: "left .25s cubic-bezier(0.32,0.72,0,1), width .25s cubic-bezier(0.32,0.72,0,1)",
          }}
        />
      )}
      {options.map((opt, i) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            ref={(el) => {
              btnRefs.current[i] = el;
            }}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(opt.value)}
            className="press"
            style={{
              position: "relative",
              zIndex: 1,
              flex: 1,
              border: "none",
              background: "transparent",
              borderRadius: 16,
              color: active ? "var(--text)" : "var(--text-2)",
              fontSize: 11,
              fontWeight: 700,
              transition: "color .2s ease, transform .15s cubic-bezier(0.34,1.56,0.64,1)",
            }}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
