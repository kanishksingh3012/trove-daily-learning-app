"use client";

import { useRef, useState } from "react";
import Sheet from "@/components/ui/Sheet";
import { DOMAINS } from "@/lib/mock-data";
import { submitCustomTopic } from "@/lib/mock-api";

const ROW_HEIGHT = 44;
const VISIBLE_ROWS = 3; // wheel well is 132px tall = 3 rows

export default function AddTopicSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [topicName, setTopicName] = useState("");
  const [wheelIndex, setWheelIndex] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [queuedName, setQueuedName] = useState("");

  function reset() {
    setTopicName("");
    setWheelIndex(0);
    setSubmitting(false);
    setDone(false);
    setQueuedName("");
  }

  function handleClose() {
    onClose();
    setTimeout(reset, 220);
  }

  async function handleSubmit() {
    if (!topicName.trim() || submitting) return;
    setSubmitting(true);
    setQueuedName(topicName.trim());
    try {
      await submitCustomTopic({ topicName: topicName.trim(), domainId: DOMAINS[wheelIndex].id });
      setSubmitting(false);
      setDone(true);
    } catch {
      setSubmitting(false);
    }
  }

  const filled = topicName.trim().length > 0;

  return (
    <Sheet open={open} onClose={handleClose}>
      {!done ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 22, color: "var(--text)", textAlign: "center", margin: 0 }}>
            Request a topic
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".08em", color: "var(--text-3)" }}>TOPIC</div>
            <input
              value={topicName}
              onChange={(e) => setTopicName(e.target.value)}
              placeholder="e.g. The Fermi Paradox"
              disabled={submitting}
              className="field-focus"
              style={{
                background: "var(--well)",
                border: "1px solid transparent",
                borderRadius: 18,
                padding: 14,
                // 16px, not the 13px note-body size — iOS Safari auto-zooms
                // the viewport on focus for any input under 16px.
                fontSize: 16,
                color: "var(--text)",
                outline: "none",
              }}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".08em", color: "var(--text-3)" }}>DOMAIN</div>
            <DomainWheel index={wheelIndex} onChange={setWheelIndex} disabled={submitting} />
          </div>

          <div style={{ display: "flex", gap: 10, alignItems: "flex-start", background: "var(--well)", borderRadius: 16, padding: "12px 14px" }}>
            <span style={{ fontSize: 11, color: "var(--text-2)", lineHeight: 1.5 }}>
              Queued, not instant. Your note arrives with tomorrow morning&rsquo;s run.
            </span>
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            <button
              type="button"
              onClick={handleClose}
              className="press"
              style={{ flex: 1, border: "1px solid var(--line)", borderRadius: 26, padding: 14, textAlign: "center", fontSize: 12, fontWeight: 600, color: "var(--text)" }}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!filled || submitting}
              className="press"
              style={{
                flex: 1.4,
                background: "var(--accent)",
                borderRadius: 26,
                padding: 14,
                textAlign: "center",
                fontSize: 12,
                fontWeight: 700,
                color: "var(--on-accent)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                opacity: filled ? 1 : 0.45,
                transition: "opacity 250ms ease",
              }}
            >
              {submitting && (
                <span
                  style={{
                    width: 14,
                    height: 14,
                    borderRadius: "50%",
                    border: "2px solid rgba(255,255,255,.35)",
                    borderTopColor: "currentColor",
                    animation: "spin 0.7s linear infinite",
                  }}
                />
              )}
              {submitting ? "Queueing" : "Queue topic"}
            </button>
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "14px 10px 8px", animation: "scr 340ms var(--e-screen) both" }}>
          <div
            style={{
              width: 58,
              height: 58,
              borderRadius: "50%",
              background: "var(--grad)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--accent)",
              animation: "pop 420ms var(--e-spring) both",
            }}
          >
            <ScheduleSendIcon />
          </div>
          <div style={{ fontFamily: "var(--font-serif)", fontSize: 22, color: "var(--text)", marginTop: 14 }}>Queued</div>
          <div style={{ fontSize: 11, color: "var(--text-2)", marginTop: 8, lineHeight: 1.6 }}>
            &ldquo;{queuedName || "Your topic"}&rdquo; · {DOMAINS[wheelIndex].name}
            <br />
            We&rsquo;ll notify you when the note is ready.
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="press"
            style={{
              alignSelf: "stretch",
              background: "var(--accent)",
              color: "var(--on-accent)",
              borderRadius: 26,
              padding: 14,
              textAlign: "center",
              fontSize: 12,
              fontWeight: 700,
              marginTop: 20,
            }}
          >
            Done
          </button>
        </div>
      )}
    </Sheet>
  );
}

function ScheduleSendIcon() {
  return (
    <svg width={30} height={30} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </svg>
  );
}

function DomainWheel({
  index,
  onChange,
  disabled,
}: {
  index: number;
  onChange: (i: number) => void;
  disabled?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const settled = useRef(false);

  function onScroll(e: React.UIEvent<HTMLDivElement>) {
    const i = Math.max(0, Math.min(DOMAINS.length - 1, Math.round(e.currentTarget.scrollTop / ROW_HEIGHT)));
    if (i !== index) onChange(i);
  }

  return (
    <div style={{ position: "relative", background: "var(--well)", borderRadius: 18, height: VISIBLE_ROWS * ROW_HEIGHT, overflow: "hidden" }}>
      <div
        aria-hidden
        style={{
          position: "absolute",
          left: 12,
          right: 12,
          top: ROW_HEIGHT,
          height: ROW_HEIGHT,
          background: "var(--frame)",
          borderRadius: 14,
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
          pointerEvents: "none",
        }}
      />
      <div
        ref={(el) => {
          ref.current = el;
          if (el && !settled.current) {
            settled.current = true;
            setTimeout(() => el.scrollTo({ top: index * ROW_HEIGHT }), 60);
          }
        }}
        onScroll={disabled ? undefined : onScroll}
        style={{
          position: "relative",
          height: "100%",
          overflowY: disabled ? "hidden" : "auto",
          scrollSnapType: "y mandatory",
          padding: `${ROW_HEIGHT}px 0`,
        }}
      >
        {DOMAINS.map((domain, i) => {
          const active = i === index;
          return (
            <div
              key={domain.id}
              style={{
                height: ROW_HEIGHT,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                scrollSnapAlign: "center",
                fontSize: 13,
                color: active ? "var(--text)" : "var(--text-3)",
                fontWeight: active ? 800 : 500,
                transform: active ? "scale(1.04)" : "scale(0.94)",
                transition: "color 200ms ease, font-weight 200ms ease, transform 250ms ease",
              }}
            >
              {domain.name}
            </div>
          );
        })}
      </div>
    </div>
  );
}
