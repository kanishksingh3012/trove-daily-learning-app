"use client";

import Link from "next/link";
import Sheet from "@/components/ui/Sheet";
import { BookmarkIcon } from "@/components/icons";
import { useBookmarkedIds } from "@/lib/activity";
import { getNoteDetail } from "@/lib/mock-data";

export default function BookmarksSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const ids = useBookmarkedIds();
  const notes = ids.map((id) => getNoteDetail(id)).filter((n): n is NonNullable<typeof n> => !!n);

  return (
    <Sheet open={open} onClose={onClose}>
      <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 22, color: "var(--text)", textAlign: "center", margin: 0 }}>
        Bookmarks
      </h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 340, overflowY: "auto" }}>
        {notes.map((note, i) => (
          <Link
            key={note.id}
            href={`/notes/${note.id}`}
            onClick={onClose}
            className="press"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              background: "var(--surface)",
              borderRadius: 16,
              padding: 14,
              animation: `listIn ${300 + i * 20}ms var(--e-screen) ${i * 40}ms both`,
            }}
          >
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text)" }}>{note.topicName}</div>
              <div style={{ fontSize: 10, color: "var(--text-3)", marginTop: 3 }}>
                {new Date(note.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
              </div>
            </div>
            <BookmarkIcon filled size={18} style={{ color: "var(--accent)", flexShrink: 0 }} />
          </Link>
        ))}
        {notes.length === 0 && (
          <div style={{ textAlign: "center", padding: "30px 10px", fontSize: 11, color: "var(--text-3)", lineHeight: 1.6 }}>
            No bookmarks yet. Tap the bookmark icon in a note to save it here.
          </div>
        )}
      </div>
    </Sheet>
  );
}
