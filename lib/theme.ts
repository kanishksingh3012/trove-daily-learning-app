"use client";

import { useCallback, useSyncExternalStore } from "react";

export type ThemeMode = "light" | "dark";
export type AccentKey = "neutral" | "terracotta" | "green" | "blue";

const THEME_KEY = "trove-mode";
const ACCENT_KEY = "trove-accent";
// Fired whenever this tab changes the theme, so same-tab subscribers update
// too (the native "storage" event only fires in *other* tabs).
const CHANGE_EVENT = "trove-theme-store-changed";

// Swatch colours are fixed accent identities, not theme-derived — "neutral"
// is the only one that flips with mode, so it alone points at --text.
export const ACCENT_OPTIONS: { key: AccentKey; label: string; swatch: string }[] = [
  { key: "neutral", label: "Neutral", swatch: "var(--text)" },
  { key: "terracotta", label: "Terracotta", swatch: "#D97635" },
  { key: "green", label: "Green", swatch: "#5C6B2C" },
  { key: "blue", label: "Blue", swatch: "#3B5FC4" },
];

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(CHANGE_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(CHANGE_EVENT, callback);
  };
}

// design.md: "Mode — light (default) / dark (reference build)" — light is
// the bare :root palette in app/globals.css; [data-theme="dark"] overrides.
function getModeSnapshot(): ThemeMode {
  return (localStorage.getItem(THEME_KEY) as ThemeMode | null) ?? "light";
}
function getModeServerSnapshot(): ThemeMode {
  return "light";
}

function getAccentSnapshot(): AccentKey {
  return (localStorage.getItem(ACCENT_KEY) as AccentKey | null) ?? "neutral";
}
function getAccentServerSnapshot(): AccentKey {
  return "neutral";
}

function applyTheme(mode: ThemeMode) {
  const root = document.documentElement;
  if (mode === "dark") root.setAttribute("data-theme", "dark");
  else root.removeAttribute("data-theme");
}

function applyAccent(accent: AccentKey) {
  const root = document.documentElement;
  if (accent === "neutral") root.removeAttribute("data-accent");
  else root.setAttribute("data-accent", accent);
}

/**
 * Reads/writes the persisted theme mode + accent, and keeps <html> in sync.
 * Backed by useSyncExternalStore (localStorage is the external store) so
 * the very first client render already matches the inline bootstrap script
 * in app/layout.tsx — no flash, no hydration mismatch, no effect needed.
 */
export function useTheme() {
  const mode = useSyncExternalStore(subscribe, getModeSnapshot, getModeServerSnapshot);
  const accent = useSyncExternalStore(subscribe, getAccentSnapshot, getAccentServerSnapshot);

  const setMode = useCallback((next: ThemeMode) => {
    localStorage.setItem(THEME_KEY, next);
    applyTheme(next);
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }, []);

  const setAccent = useCallback((next: AccentKey) => {
    localStorage.setItem(ACCENT_KEY, next);
    applyAccent(next);
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }, []);

  return { mode, accent, ready: true, setMode, setAccent };
}
