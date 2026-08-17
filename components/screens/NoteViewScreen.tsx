"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Skeleton from "@/components/ui/Skeleton";
import Sheet from "@/components/ui/Sheet";
import Toast from "@/components/ui/Toast";
import {
  ChevronLeftIcon,
  ListIndexIcon,
  BookmarkIcon,
  TextIcon,
  HighlighterIcon,
  ImageIcon,
  LinkIcon,
  TaskAltIcon,
  CheckCircleIcon,
  AlertIcon,
} from "@/components/icons";
import { getDomain, getNoteDetail, getNoteSections } from "@/lib/mock-data";
import { CATEGORY_META } from "@/lib/category";
import { isNoteRead, markNoteRead, toggleBookmark, useIsBookmarked, useIsNoteRead } from "@/lib/activity";
import { markNoteReadRemote, mockMutation } from "@/lib/mock-api";
import { useSkeleton } from "@/lib/use-skeleton";

type Tool = "text" | "highlight" | "image" | "link";
const TOOLS: { key: Tool; Icon: typeof TextIcon }[] = [
  { key: "text", Icon: TextIcon },
  { key: "highlight", Icon: HighlighterIcon },
  { key: "image", Icon: ImageIcon },
  { key: "link", Icon: LinkIcon },
];

type SyncStatus = "idle" | "saving" | "saved" | "error";

export default function NoteViewScreen({ noteId }: { noteId: string }) {
  const router = useRouter();
  const loading = useSkeleton(`note:${noteId}`, 600);
  const note = getNoteDetail(noteId);
  const domain = note ? getDomain(note.domainId) : undefined;
  const sections = note ? getNoteSections(note) : [];

  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [progress, setProgress] = useState(0.02);
  const [tocOpen, setTocOpen] = useState(false);
  const [tool, setTool] = useState<Tool>("highlight");
  const [highlighted, setHighlighted] = useState<Record<number, boolean>>(() => {
    const initial: Record<number, boolean> = {};
    note?.briefParagraphs.forEach((p, i) => {
      if (p.highlightedByDefault) initial[i] = true;
    });
    return initial;
  });
  const [calloutIndex, setCalloutIndex] = useState<number | null>(null);
  const [sync, setSync] = useState<SyncStatus>("idle");
  const [toast, setToast] = useState<string | null>(null);

  const isRead = useIsNoteRead(noteId);
  const isBookmarked = useIsBookmarked(noteId);
  const [bookmarkPulse, setBookmarkPulse] = useState(false);
  const [reading, setReading] = useState(false);

  function showToast(message: string) {
    setToast(message);
    setTimeout(() => setToast(null), 2400);
  }

  function onScroll() {
    const el = scrollRef.current;
    if (!el) return;
    const max = Math.max(1, el.scrollHeight - el.clientHeight);
    setScrollTop(el.scrollTop);
    setProgress(Math.max(0.02, el.scrollTop / max));
  }

  async function handleParagraphTap(index: number) {
    if (tool === "highlight") {
      const nextOn = !highlighted[index];
      setHighlighted((prev) => ({ ...prev, [index]: nextOn }));
      setCalloutIndex(null);
      showToast(nextOn ? "Highlight saved to Notion" : "Highlight removed");
      setSync("saving");
      try {
        await mockMutation(null, 900);
        setSync("saved");
        setTimeout(() => setSync("idle"), 1600);
      } catch {
        setSync("error");
      }
    } else {
      setCalloutIndex((prev) => (prev === index ? null : index));
    }
  }

  async function retrySync() {
    setSync("saving");
    try {
      await mockMutation(null, 900);
      setSync("saved");
      setTimeout(() => setSync("idle"), 1600);
    } catch {
      setSync("error");
    }
  }

  async function handleToggleBookmark() {
    const nowOn = toggleBookmark(noteId);
    setBookmarkPulse(true);
    setTimeout(() => setBookmarkPulse(false), 200);
    showToast(nowOn ? "Saved to your shelf" : "Removed from shelf");
  }

  async function handleMarkRead() {
    if (isNoteRead(noteId) || reading) return;
    setReading(true);
    try {
      await markNoteReadRemote(noteId);
      markNoteRead(noteId);
      showToast("Marked as read for today");
    } finally {
      setReading(false);
    }
  }

  if (!note || !domain) return null;

  const compact = scrollTop > 110;
  const meta = CATEGORY_META[domain.category];

  return (
    <div style={{ position: "fixed", inset: 0, background: "var(--frame)", zIndex: 20, animation: "scr 360ms var(--e-screen) both" }}>
      {loading ? (
        <NoteLoading />
      ) : (
        <>
          {/* Scroll-progress bar */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 3,
              background: "var(--accent)",
              transformOrigin: "0 50%",
              transition: "transform 120ms linear",
              transform: `scaleX(${progress})`,
              zIndex: 35,
            }}
          />

          {/* Compact header overlay */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 104,
              zIndex: 22,
              background: "var(--frame)",
              backdropFilter: "blur(12px)",
              pointerEvents: "none",
              transition: "opacity 300ms ease",
              opacity: compact ? 1 : 0,
            }}
          />
          <div
            aria-hidden
            style={{
              position: "absolute",
              top: 64,
              left: 64,
              right: 64,
              zIndex: 24,
              textAlign: "center",
              fontSize: 12,
              fontWeight: 700,
              color: "var(--text)",
              pointerEvents: "none",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              transition: "opacity 300ms ease, transform 300ms ease",
              opacity: compact ? 1 : 0,
              transform: compact ? "translateY(0)" : "translateY(6px)",
            }}
          >
            {note.topicName}
          </div>

          {/* Header buttons */}
          <div
            style={{
              position: "absolute",
              top: 56,
              left: 0,
              right: 0,
              zIndex: 26,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "8px 20px 0",
              color: "var(--text)",
            }}
          >
            <button
              type="button"
              aria-label="Back"
              onClick={() => router.back()}
              className="hover-row press-icon"
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "transform var(--d-press) var(--e-spring), background-color var(--d-fade) ease",
              }}
            >
              <ChevronLeftIcon size={22} />
            </button>
            <div style={{ display: "flex", gap: 4 }}>
              <button
                type="button"
                aria-label="Sections"
                onClick={() => setTocOpen(true)}
                className="hover-row press-icon"
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "transform var(--d-press) var(--e-spring), background-color var(--d-fade) ease",
                }}
              >
                <ListIndexIcon size={22} />
              </button>
              <button
                type="button"
                aria-label={isBookmarked ? "Remove bookmark" : "Bookmark"}
                onClick={handleToggleBookmark}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: isBookmarked ? "var(--accent)" : "var(--text)",
                  transform: bookmarkPulse ? "scale(1.18)" : "scale(1)",
                  transition: "transform 220ms var(--e-spring), color 220ms ease",
                }}
              >
                <BookmarkIcon size={22} filled={isBookmarked} />
              </button>
            </div>
          </div>

          {/* Scrollable content */}
          <div
            ref={scrollRef}
            onScroll={onScroll}
            style={{ position: "absolute", inset: "60px 0 0", overflowY: "auto" }}
          >
            <div style={{ background: "var(--grad)", padding: "48px 20px 22px" }}>
              <span
                style={{
                  display: "inline-flex",
                  background: "var(--tag-bg)",
                  color: "var(--tag-fg)",
                  fontSize: 9,
                  fontWeight: 700,
                  borderRadius: 10,
                  padding: "4px 10px",
                }}
              >
                {domain.name}
              </span>
              <div style={{ fontFamily: "var(--font-serif)", fontSize: 30, color: "var(--text)", marginTop: 10, lineHeight: 1.12 }}>
                {note.topicName}
              </div>
              <div style={{ fontSize: 11, color: "var(--text-2)", marginTop: 8 }}>
                {new Date(note.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })} ·{" "}
                {note.readMinutes} min read
              </div>
            </div>

            <div style={{ padding: "20px 20px 140px", display: "flex", flexDirection: "column", gap: 14 }}>
              <Eyebrow data-sec="brief">BRIEF</Eyebrow>
              {note.briefParagraphs.map((p, i) => (
                <div key={i} style={{ position: "relative" }}>
                  <div
                    onClick={() => handleParagraphTap(i)}
                    style={{ fontSize: 13, lineHeight: 1.78, color: "var(--text-2)", cursor: "text" }}
                  >
                    {p.pre}
                    <span className={`hl-sweep${highlighted[i] ? " hl-sweep-active" : ""}`} style={{ color: highlighted[i] ? "var(--text)" : "var(--text-2)" }}>
                      {p.mid}
                    </span>
                    {p.post}
                  </div>
                  {calloutIndex === i && (
                    <SelectionCallout
                      onHighlight={() => {
                        setTool("highlight");
                        handleParagraphTap(i);
                      }}
                      onCopy={() => setCalloutIndex(null)}
                      onLink={() => setCalloutIndex(null)}
                    />
                  )}
                </div>
              ))}

              <Divider />
              <Eyebrow data-sec="index">CONCEPT INDEX</Eyebrow>
              <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                {note.conceptIndex.map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, fontSize: 12, color: "var(--text-2)" }}>
                    <span style={{ fontFamily: "var(--font-serif)", color: "var(--accent)" }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {item}
                  </div>
                ))}
              </div>

              <Divider />
              <Eyebrow data-sec="detail">DETAILED NOTES</Eyebrow>
              <div style={{ fontSize: 13, lineHeight: 1.78, color: "var(--text-2)" }}>{note.detailedNotes}</div>

              <div style={{ border: "1px solid var(--line)", borderRadius: 16, overflow: "hidden", fontSize: 11 }}>
                <div style={{ display: "grid", gridTemplateColumns: `1.1fr repeat(${note.table.headers.length - 1}, 1fr)`, background: "var(--well)", fontWeight: 700, color: "var(--text)" }}>
                  {note.table.headers.map((h, i) => (
                    <div key={i} style={{ padding: 10 }}>
                      {h}
                    </div>
                  ))}
                </div>
                {note.table.rows.map((row, ri) => (
                  <div
                    key={ri}
                    style={{
                      display: "grid",
                      gridTemplateColumns: `1.1fr repeat(${row.length - 1}, 1fr)`,
                      borderTop: "1px solid var(--line)",
                      color: "var(--text-2)",
                    }}
                  >
                    {row.map((cell, ci) => (
                      <div
                        key={ci}
                        style={{
                          padding: 10,
                          fontWeight: ci === 0 ? 700 : 400,
                          color: ci === 0 ? "var(--text)" : "var(--text-2)",
                        }}
                      >
                        {cell}
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              {note.hasDiagram && (
                <div style={{ background: "var(--surface)", borderRadius: 20, padding: 18, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ border: "1px dashed var(--line)", borderRadius: 12, padding: "10px 14px", fontSize: 11, fontWeight: 600, color: "var(--text)" }}>
                      Node A
                    </div>
                    <div style={{ width: 34, height: 1, background: "var(--line)", position: "relative" }}>
                      <div style={{ position: "absolute", left: "50%", top: -4, transform: "translateX(-50%)", width: 7, height: 7, borderRadius: "50%", background: "var(--accent)" }} />
                    </div>
                    <div style={{ border: "1px dashed var(--line)", borderRadius: 12, padding: "10px 14px", fontSize: 11, fontWeight: 600, color: "var(--text)" }}>
                      Node B
                    </div>
                  </div>
                  <div style={{ fontSize: 10, color: "var(--text-3)" }}>How the two connect.</div>
                </div>
              )}

              {note.resources.length > 0 && (
                <div data-sec="res" style={{ background: "var(--surface)", borderRadius: 20, padding: 16, display: "flex", flexDirection: "column", gap: 12, marginTop: 4 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text)" }}>Resources</div>
                  {note.resources.map((r, i) => (
                    <a key={i} href={r.url} target="_blank" rel="noreferrer" style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 32, height: 32, borderRadius: 10, background: "var(--frame)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent)", flexShrink: 0 }}>
                        <LinkIcon size={17} />
                      </div>
                      <div>
                        <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text)" }}>{r.label}</div>
                        <div style={{ fontSize: 9, color: "var(--text-3)" }}>{new URL(r.url).hostname}</div>
                      </div>
                    </a>
                  ))}
                </div>
              )}

              {sync !== "idle" && <SyncPill status={sync} onRetry={retrySync} />}

              <button
                type="button"
                onClick={handleMarkRead}
                disabled={isRead}
                className={isRead ? undefined : "press"}
                style={{
                  marginTop: 4,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  borderRadius: 26,
                  padding: 14,
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: isRead ? "default" : "pointer",
                  background: isRead ? "color-mix(in srgb, var(--accent) 16%, var(--well))" : "var(--well)",
                  color: isRead ? "var(--accent)" : "var(--text)",
                  transition: "background-color 300ms ease, color 300ms ease",
                }}
              >
                {isRead ? <CheckCircleIcon size={16} /> : <TaskAltIcon size={16} />}
                {isRead ? "Marked as read" : "I have read this"}
              </button>
            </div>
          </div>

          {/* Floating toolbar */}
          <div
            style={{
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
              bottom: 28,
              zIndex: 28,
              display: "flex",
              gap: 6,
              alignItems: "center",
              background: "#16171A",
              borderRadius: 30,
              padding: "8px 10px",
              boxShadow: "0 12px 28px rgba(0, 0, 0, 0.26)",
            }}
          >
            {TOOLS.map(({ key, Icon }) => {
              const active = tool === key;
              return (
                <button
                  key={key}
                  type="button"
                  aria-label={key}
                  onClick={() => setTool(key)}
                  className="press-icon"
                  style={{ position: "relative", width: 42, height: 42, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}
                >
                  <div
                    aria-hidden
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "var(--pop-tint)",
                      borderRadius: "50%",
                      transition: "opacity 280ms ease, transform 280ms var(--e-spring)",
                      opacity: active ? 1 : 0,
                      transform: active ? "scale(1)" : "scale(0.4)",
                    }}
                  />
                  <Icon size={19} style={{ position: "relative", color: active ? "#16171A" : "#8B8880", transition: "color 280ms ease" }} />
                </button>
              );
            })}
          </div>
        </>
      )}

      <Sheet open={tocOpen} onClose={() => setTocOpen(false)} maxHeight={280}>
        <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 20, color: "var(--text)", margin: 0 }}>Jump to</h2>
        {sections.map((s, i) => (
          <button
            key={s.sec}
            type="button"
            onClick={() => {
              setTocOpen(false);
              const el = scrollRef.current?.querySelector(`[data-sec="${s.sec}"]`);
              if (el instanceof HTMLElement && scrollRef.current) {
                scrollRef.current.scrollTo({ top: el.offsetTop - 84, behavior: "smooth" });
              }
            }}
            className="press"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "12px 14px",
              background: "var(--surface)",
              borderRadius: 16,
              animation: `listIn 320ms var(--e-screen) ${i * 40}ms both`,
            }}
          >
            <span style={{ fontFamily: "var(--font-serif)", fontSize: 14, color: "var(--accent)" }}>{s.n}</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text)" }}>{s.label}</span>
          </button>
        ))}
      </Sheet>

      <Toast message={toast ?? ""} visible={!!toast} />
    </div>
  );
}

function Eyebrow({ children, "data-sec": dataSec }: { children: React.ReactNode; "data-sec"?: string }) {
  return (
    <div data-sec={dataSec} style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".1em", color: "var(--text-3)" }}>
      {children}
    </div>
  );
}

function Divider() {
  return <div style={{ height: 1, background: "var(--line)" }} />;
}

function SelectionCallout({ onHighlight, onCopy, onLink }: { onHighlight: () => void; onCopy: () => void; onLink: () => void }) {
  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: -14,
        transform: "translateX(-50%)",
        display: "flex",
        gap: 2,
        background: "#16171A",
        borderRadius: 14,
        padding: 5,
        zIndex: 12,
        boxShadow: "0 10px 22px rgba(0, 0, 0, 0.28)",
        animation: "pop 260ms var(--e-spring) both",
      }}
    >
      <CalloutButton onClick={onHighlight} icon={<HighlighterIcon size={15} style={{ color: "var(--pop-tint)" }} />} label="Highlight" />
      <CalloutButton onClick={onCopy} label="Copy" />
      <CalloutButton onClick={onLink} label="Link" />
    </div>
  );
}

function CalloutButton({ onClick, icon, label }: { onClick: () => void; icon?: React.ReactNode; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="hover-row"
      style={{ display: "flex", alignItems: "center", gap: 5, color: "#fff", fontSize: 11, fontWeight: 600, padding: "7px 11px", borderRadius: 10 }}
    >
      {icon}
      {label}
    </button>
  );
}

function SyncPill({ status, onRetry }: { status: SyncStatus; onRetry: () => void }) {
  const isError = status === "error";
  return (
    <button
      type="button"
      onClick={isError ? onRetry : undefined}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "10px 14px",
        borderRadius: 14,
        fontSize: 11,
        fontWeight: 600,
        alignSelf: "flex-start",
        cursor: isError ? "pointer" : "default",
        background: isError ? "var(--danger-bg, #FBE8E6)" : "var(--well)",
        color: isError ? "var(--danger, #B4342A)" : "var(--text-2)",
        animation: isError ? "shake 450ms ease" : "listIn 250ms var(--e-screen) both",
      }}
    >
      {status === "saving" && <span style={{ width: 12, height: 12, borderRadius: "50%", border: "2px solid rgba(0,0,0,.2)", borderTopColor: "currentColor", animation: "spin 1s linear infinite" }} />}
      {status === "saved" && <TaskAltIcon size={14} />}
      {isError && <AlertIcon size={14} />}
      {status === "saving" ? "Saving…" : status === "saved" ? "Saved to Notion" : "Save failed — tap to retry"}
    </button>
  );
}

function NoteLoading() {
  return (
    <div style={{ position: "absolute", inset: 0, padding: "70px 20px 0", display: "flex", flexDirection: "column", gap: 14 }}>
      <Skeleton height={10} width={80} radius={6} />
      <Skeleton height={30} width="70%" radius={10} />
      <Skeleton height={13} width="90%" />
      <Skeleton height={13} width="85%" />
      <Skeleton height={13} width="60%" />
    </div>
  );
}
