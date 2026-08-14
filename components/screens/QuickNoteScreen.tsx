"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { saveQuickNote } from "@/lib/mock-api";

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

export default function QuickNoteScreen() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleDone() {
    setSaving(true);
    try {
      const result = await saveQuickNote({ title, body });
      setSavedAt(result.savedAt);
      router.back();
    } catch {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="status-bar" />
      <div className="screen-scroll" style={{ paddingTop: 4, paddingBottom: 24 }}>
        <header
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 16,
          }}
        >
          <button
            type="button"
            onClick={() => router.back()}
            className="press"
            style={{ background: "none", border: "none", color: "var(--text-2)", fontSize: 12, fontWeight: 600 }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDone}
            disabled={saving || !title.trim()}
            className="press"
            style={{
              background: "none",
              border: "none",
              color: "var(--accent)",
              fontSize: 12,
              fontWeight: 800,
              opacity: !title.trim() ? 0.5 : 1,
              transition: "opacity .2s ease",
            }}
          >
            {saving ? "Saving…" : "Done"}
          </button>
        </header>

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Topic to remember"
          style={{
            width: "100%",
            border: "none",
            background: "none",
            fontSize: 16,
            fontWeight: 800,
            color: "var(--text)",
            padding: 0,
            marginBottom: 8,
          }}
        />

        <div
          style={{
            fontSize: 10,
            fontWeight: 500,
            color: "var(--text-3)",
            textTransform: "uppercase",
            letterSpacing: ".04em",
            marginBottom: 16,
          }}
        >
          {savedAt ? `Saved ${formatTime(savedAt)}` : "Not yet saved"}
        </div>

        <div style={{ height: 1, background: "var(--line)", marginBottom: 16 }} />

        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Jot down a topic, a link, or a thought to come back to later — separate from the daily flow."
          rows={12}
          style={{
            width: "100%",
            border: "none",
            background: "none",
            resize: "none",
            fontSize: 11,
            lineHeight: 1.7,
            fontWeight: 500,
            color: "var(--text-body)",
            padding: 0,
          }}
        />
      </div>
    </div>
  );
}
