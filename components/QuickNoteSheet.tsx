"use client";

import { useState } from "react";
import Sheet from "@/components/ui/Sheet";
import { saveQuickNote } from "@/lib/mock-api";

export default function QuickNoteSheet({
  open,
  onClose,
  onSaved,
}: {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [text, setText] = useState("");
  const [saving, setSaving] = useState(false);

  function handleClose() {
    onClose();
    setTimeout(() => setText(""), 220);
  }

  async function handleSave() {
    if (!text.trim() || saving) return;
    setSaving(true);
    try {
      await saveQuickNote({ title: text.trim().slice(0, 60), body: text.trim() });
      handleClose();
      onSaved();
    } finally {
      setSaving(false);
    }
  }

  return (
    <Sheet open={open} onClose={handleClose}>
      <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 22, color: "var(--text)", textAlign: "center", margin: 0 }}>
        Quick note
      </h2>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Something to look into later…"
        disabled={saving}
        className="field-focus"
        style={{
          background: "var(--well)",
          border: "1px solid transparent",
          borderRadius: 18,
          padding: 14,
          fontSize: 13,
          lineHeight: 1.6,
          color: "var(--text)",
          fontFamily: "var(--font-sans)",
          outline: "none",
          height: 104,
          resize: "none",
        }}
      />
      <button
        type="button"
        onClick={handleSave}
        disabled={!text.trim() || saving}
        className="press"
        style={{
          background: "var(--accent)",
          color: "var(--on-accent)",
          borderRadius: 26,
          padding: 14,
          textAlign: "center",
          fontSize: 12,
          fontWeight: 700,
          opacity: text.trim() ? 1 : 0.6,
          transition: "opacity 200ms ease",
        }}
      >
        {saving ? "Saving…" : "Save to Trove"}
      </button>
    </Sheet>
  );
}
