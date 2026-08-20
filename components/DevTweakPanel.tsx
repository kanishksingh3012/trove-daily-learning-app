"use client";

import { useEffect, useState } from "react";

// Temporary, user-requested on-device tuning tool — NOT part of the design.
// Lets values that were hard to get right by guessing through screenshots
// (top spacer height, title text size, section spacing) be adjusted live
// on the real device, so the final numbers can be reported back and
// hardcoded properly. Safe to delete once tuning is done — nothing else
// depends on this file. Deliberately avoids the CSS `zoom` property for a
// blanket "scale everything" control — testing showed it doesn't reliably
// compensate its own width, risking real horizontal overflow. Font-size
// and spacing multipliers are plain, standard CSS with no such risk.

const STORAGE_KEY = "trove-dev-tweak";

interface TweakValues {
  statusbar: number;
  titleScale: number;
  gapScale: number;
}

const DEFAULTS: TweakValues = { statusbar: 60, titleScale: 1, gapScale: 1 };

function apply(values: TweakValues) {
  const root = document.documentElement;
  root.style.setProperty("--tweak-statusbar", `${values.statusbar}px`);
  root.style.setProperty("--tweak-title-scale", String(values.titleScale));
  root.style.setProperty("--tweak-gap-scale", String(values.gapScale));
}

function readSaved(): TweakValues {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? { ...DEFAULTS, ...JSON.parse(saved) } : DEFAULTS;
  } catch {
    return DEFAULTS;
  }
}

export default function DevTweakPanel() {
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState<TweakValues>(readSaved);

  // Syncs the DOM custom properties from the already-initialised state —
  // a legitimate effect (React -> external system), not a setState call.
  useEffect(() => {
    apply(values);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only on mount, update() below keeps the DOM in sync after that
  }, []);

  function update(patch: Partial<TweakValues>) {
    const next = { ...values, ...patch };
    setValues(next);
    apply(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
  }

  function reset() {
    setValues(DEFAULTS);
    apply(DEFAULTS);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }

  async function copySummary() {
    const text = `statusbar: ${values.statusbar}px\ntitleScale: ${values.titleScale}\ngapScale: ${values.gapScale}`;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // clipboard API may be unavailable — the values are visible on-screen either way
    }
  }

  return (
    <div style={{ position: "fixed", right: 12, bottom: 12, zIndex: 999 }}>
      {open && (
        <div
          style={{
            position: "absolute",
            bottom: 52,
            right: 0,
            width: 260,
            background: "#1c1d21",
            color: "#f2f0ec",
            borderRadius: 16,
            padding: 16,
            boxShadow: "0 12px 32px rgba(0,0,0,.4)",
            fontFamily: "-apple-system, sans-serif",
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}
        >
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".04em", textTransform: "uppercase", opacity: 0.6 }}>
            Tuning panel
          </div>

          <label style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 12 }}>
            <span>Top space — {values.statusbar}px</span>
            <input
              type="range"
              min={0}
              max={100}
              step={1}
              value={values.statusbar}
              onChange={(e) => update({ statusbar: Number(e.target.value) })}
            />
          </label>

          <label style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 12 }}>
            <span>Title size — {values.titleScale.toFixed(2)}x</span>
            <input
              type="range"
              min={0.85}
              max={1.4}
              step={0.01}
              value={values.titleScale}
              onChange={(e) => update({ titleScale: Number(e.target.value) })}
            />
          </label>

          <label style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 12 }}>
            <span>Section spacing — {values.gapScale.toFixed(2)}x</span>
            <input
              type="range"
              min={0.5}
              max={1.6}
              step={0.01}
              value={values.gapScale}
              onChange={(e) => update({ gapScale: Number(e.target.value) })}
            />
          </label>

          <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
            <button
              type="button"
              onClick={reset}
              style={{ flex: 1, background: "#2c2d33", color: "#f2f0ec", border: "none", borderRadius: 10, padding: "10px 0", fontSize: 12, fontWeight: 600 }}
            >
              Reset
            </button>
            <button
              type="button"
              onClick={copySummary}
              style={{ flex: 1, background: "#f2f0ec", color: "#16171a", border: "none", borderRadius: 10, padding: "10px 0", fontSize: 12, fontWeight: 700 }}
            >
              Copy values
            </button>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Tuning panel"
        style={{
          width: 44,
          height: 44,
          borderRadius: "50%",
          background: open ? "#f2f0ec" : "#1c1d21",
          color: open ? "#16171a" : "#f2f0ec",
          border: "2px solid rgba(255,255,255,.2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 18,
          boxShadow: "0 6px 16px rgba(0,0,0,.35)",
        }}
      >
        ⚙
      </button>
    </div>
  );
}
