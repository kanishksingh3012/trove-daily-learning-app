"use client";

import { buildActivity, useReadLog } from "@/lib/activity";

// Fixed "today" for the demo, matching the rest of the mock data (which is
// seeded around 17 Aug 2026) rather than the visitor's real device clock —
// otherwise the graph would show a growing gap of "future" empty cells.
const DEMO_TODAY = new Date(2026, 7, 17);

export default function ActivityGraph() {
  const log = useReadLog();
  const { weeks, total } = buildActivity(log, DEMO_TODAY);

  return (
    <div style={{ padding: "20px 20px 0" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".1em", color: "var(--text-3)" }}>
          YOUR ACTIVITY
        </div>
        <div style={{ fontSize: 10, color: "var(--text-3)" }}>{total} reads all-time</div>
      </div>
      <div style={{ overflowX: "auto", marginTop: 8, paddingBottom: 2 }}>
        <div style={{ display: "inline-flex", flexDirection: "column", gap: 3 }}>
          <div style={{ display: "flex", gap: 2 }}>
            {weeks.map((w, i) => (
              <div
                key={i}
                style={{
                  width: 8,
                  flex: "0 0 8px",
                  fontSize: 7,
                  color: "var(--text-3)",
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                }}
              >
                {w.monthLabel}
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 2 }}>
            {weeks.map((w, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {w.days.map((d, j) => (
                  <div
                    key={j}
                    title={d.title}
                    style={{ width: 8, height: 8, borderRadius: 2, background: d.bg }}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
