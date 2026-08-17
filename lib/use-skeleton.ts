"use client";

import { useEffect, useState } from "react";

// Module-level: survives client-side navigation, resets on a full reload —
// which is what "once per tab per session" means for a client-only app.
const seen = new Set<string>();

/**
 * Shows a loading skeleton for `minMs` the first time `key` is used this
 * session, then returns `false` immediately on every later mount. See
 * MOTION-SPEC.md's "Timings not tied to a curve" table for the per-screen
 * minimums (bootSkeleton/tabSkeleton/noteSkeleton in lib/motion.ts).
 */
export function useSkeleton(key: string, minMs: number): boolean {
  const [loading, setLoading] = useState(() => !seen.has(key));

  useEffect(() => {
    if (!loading) return;
    seen.add(key);
    const t = setTimeout(() => setLoading(false), minMs);
    return () => clearTimeout(t);
  }, [key, minMs, loading]);

  return loading;
}
