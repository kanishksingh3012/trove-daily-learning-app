"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Sheet from "@/components/ui/Sheet";
import Skeleton from "@/components/ui/Skeleton";
import Tag from "@/components/ui/Tag";
import {
  ChevronLeftIcon,
  ListIndexIcon,
  TextIcon,
  HighlighterIcon,
  ImageIcon,
  LinkIcon,
  CopyIcon,
  AlertIcon,
} from "@/components/icons";
import { getDomain, getNoteDetail } from "@/lib/mock-data";
import { saveNoteEdit } from "@/lib/mock-api";

type SaveStatus = "idle" | "saving" | "saved" | "error";
type Tool = "text" | "highlight" | "image" | "link";

export default function NoteViewScreen({ noteId }: { noteId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [tocOpen, setTocOpen] = useState(false);
  const [activeTool, setActiveTool] = useState<Tool>("text");
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [selectionCallout, setSelectionCallout] = useState<{ x: number; y: number } | null>(null);
  const [activeSection, setActiveSection] = useState<string>("brief");

  const briefRef = useRef<HTMLDivElement>(null);
  const detailRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const note = getNoteDetail(noteId);
  const domain = note ? getDomain(note.domainId) : undefined;

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (loading || !note) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((e) => e.isIntersecting);
        if (visible) setActiveSection(visible.target.id);
      },
      { rootMargin: "-20% 0px -70% 0px" }
    );
    Object.values(sectionRefs.current).forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [loading, note]);

  useEffect(() => {
    function handleSelectionChange() {
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed || !sel.toString().trim()) {
        setSelectionCallout(null);
        return;
      }
      const anchor = sel.anchorNode?.parentElement;
      const withinNote =
        anchor && (briefRef.current?.contains(anchor) || detailRef.current?.contains(anchor));
      if (!withinNote) {
        setSelectionCallout(null);
        return;
      }
      const range = sel.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      setSelectionCallout({ x: rect.left + rect.width / 2, y: rect.top });
    }
    document.addEventListener("selectionchange", handleSelectionChange);
    return () => document.removeEventListener("selectionchange", handleSelectionChange);
  }, []);

  if (!note || !domain) {
    return (
      <div style={{ padding: 16 }}>
        <p style={{ fontSize: 12, color: "var(--text-2)" }}>Note not found.</p>
        <Link href="/" style={{ fontSize: 12, color: "var(--accent)", fontWeight: 700 }}>
          Back to Home
        </Link>
      </div>
    );
  }

  function applyHighlight() {
    document.execCommand("hiliteColor", false, "#FDE68A");
    document.execCommand("foreColor", false, "#2B2408");
    setSelectionCallout(null);
  }

  function applyLink() {
    const url = window.prompt("Link URL");
    if (url) document.execCommand("createLink", false, url);
    setSelectionCallout(null);
  }

  function applyImage() {
    const url = window.prompt("Image URL");
    if (url) document.execCommand("insertImage", false, url);
  }

  function copySelection() {
    const sel = window.getSelection()?.toString() ?? "";
    if (sel) navigator.clipboard?.writeText(sel).catch(() => {});
    setSelectionCallout(null);
  }

  function handleToolClick(tool: Tool) {
    setActiveTool(tool);
    if (tool === "highlight") applyHighlight();
    if (tool === "link") applyLink();
    if (tool === "image") applyImage();
  }

  async function handleExitEdit() {
    setEditing(false);
    setSelectionCallout(null);
    setSaveStatus("saving");
    const content = `${briefRef.current?.innerHTML ?? ""}\n${detailRef.current?.innerHTML ?? ""}`;
    try {
      await saveNoteEdit({ noteId, content });
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus((s) => (s === "saved" ? "idle" : s)), 2000);
    } catch {
      setSaveStatus("error");
    }
  }

  async function retrySave() {
    setSaveStatus("saving");
    const content = `${briefRef.current?.innerHTML ?? ""}\n${detailRef.current?.innerHTML ?? ""}`;
    try {
      await saveNoteEdit({ noteId, content });
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus((s) => (s === "saved" ? "idle" : s)), 2000);
    } catch {
      setSaveStatus("error");
    }
  }

  return (
    <div>
      <div className="status-bar" />
      <div className="screen-scroll" style={{ paddingBottom: editing ? 110 : 32 }}>
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
            onClick={() => (editing ? handleExitEdit() : router.back())}
            aria-label="Back"
            className="press"
            style={{ background: "none", border: "none", color: "var(--text)" }}
          >
            <ChevronLeftIcon size={20} />
          </button>
          {editing ? (
            <button
              type="button"
              onClick={handleExitEdit}
              className="press"
              style={{ background: "none", border: "none", color: "var(--accent)", fontSize: 12, fontWeight: 800 }}
            >
              Done
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setTocOpen(true)}
              aria-label="Sections"
              className="press"
              style={{ background: "none", border: "none", color: "var(--text)" }}
            >
              <ListIndexIcon size={20} />
            </button>
          )}
        </header>

        {loading ? (
          <NoteLoading />
        ) : (
          <>
            <h1 style={{ fontSize: 16, fontWeight: 800, margin: "0 0 8px" }}>{note.topicName}</h1>
            <div style={{ marginBottom: 16 }}>
              <Tag category={domain.category} />
            </div>

            {saveStatus === "saving" && <StatusPill label="Saving…" />}
            {saveStatus === "saved" && <StatusPill label="Saved" tone="ok" />}
            {saveStatus === "error" && (
              <button
                type="button"
                onClick={retrySave}
                className="press"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  width: "100%",
                  textAlign: "left",
                  background: "var(--danger-bg)",
                  color: "var(--danger)",
                  border: "none",
                  borderRadius: "var(--r-field)",
                  padding: "10px 12px",
                  marginBottom: 16,
                  fontSize: 10,
                  fontWeight: 600,
                  animation: "fade-in .2s ease-out",
                }}
              >
                <AlertIcon size={16} />
                Save failed — edits not synced. Tap to retry.
              </button>
            )}

            <div
              onClick={() => !editing && setEditing(true)}
              style={{
                outline: saveStatus === "error" ? "1.5px solid var(--danger)" : "none",
                outlineOffset: 4,
                borderRadius: 8,
              }}
            >
              <Eyebrow>Brief</Eyebrow>
              <div
                id="brief"
                ref={(el) => {
                  briefRef.current = el;
                  sectionRefs.current.brief = el;
                }}
                contentEditable={editing}
                suppressContentEditableWarning
                style={{
                  fontSize: 11,
                  lineHeight: 1.5,
                  color: "var(--text-body)",
                  marginBottom: 20,
                  outline: "none",
                }}
                dangerouslySetInnerHTML={{ __html: withHighlightStyles(note.brief) }}
              />

              <Eyebrow>Detailed Notes</Eyebrow>
              <div
                id="detailed-notes"
                ref={(el) => {
                  detailRef.current = el;
                  sectionRefs.current["detailed-notes"] = el;
                }}
                contentEditable={editing}
                suppressContentEditableWarning
                style={{
                  fontSize: 11,
                  lineHeight: 1.5,
                  color: "var(--text-body)",
                  marginBottom: 16,
                  outline: "none",
                }}
                dangerouslySetInnerHTML={{ __html: withHighlightStyles(note.detailedNotes) }}
              />

              <NoteTable headers={note.table.headers} rows={note.table.rows} />

              {note.hasDiagram && (
                <div
                  style={{
                    border: "1.5px dashed var(--dashed)",
                    borderRadius: "var(--r-tile)",
                    height: 96,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 20,
                    color: "var(--text-3)",
                    fontSize: 10,
                    fontWeight: 600,
                  }}
                >
                  Diagram placeholder
                </div>
              )}

              <div id="resources" ref={(el) => { sectionRefs.current.resources = el; }}>
                <Eyebrow>Resources</Eyebrow>
                {note.resources.map((r) => (
                  <a
                    key={r.url}
                    href={r.url}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: "block",
                      fontSize: 11,
                      fontWeight: 500,
                      color: "var(--resource-link)",
                      padding: "8px 0",
                      borderBottom: "1px solid var(--line)",
                    }}
                  >
                    {r.label}
                  </a>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {selectionCallout && (
        <div
          style={{
            position: "fixed",
            left: selectionCallout.x,
            top: Math.max(selectionCallout.y - 44, 8),
            transform: "translateX(-50%)",
            background: "var(--overlay)",
            color: "#F2F0EC",
            borderRadius: 10,
            padding: "6px 4px",
            display: "flex",
            boxShadow: "var(--shadow-tooltip)",
            zIndex: 80,
            animation: "fade-in .15s ease-out",
            transformOrigin: "center bottom",
          }}
        >
          <CalloutButton label="Highlight" onClick={applyHighlight} />
          <CalloutButton label="Copy" onClick={copySelection} />
          <CalloutButton label="Link" onClick={applyLink} />
        </div>
      )}

      {editing && (
        <div
          style={{
            position: "fixed",
            left: "50%",
            transform: "translateX(-50%)",
            bottom: 28,
            width: "calc(100% - 56px)",
            maxWidth: 424,
            background: "var(--surface)",
            borderRadius: "var(--r-card)",
            boxShadow: "var(--shadow-toolbar)",
            padding: 12,
            display: "flex",
            justifyContent: "space-around",
            zIndex: 55,
          }}
        >
          <ToolButton icon={TextIcon} active={activeTool === "text"} onClick={() => handleToolClick("text")} />
          <ToolButton
            icon={HighlighterIcon}
            active={activeTool === "highlight"}
            onClick={() => handleToolClick("highlight")}
          />
          <ToolButton icon={ImageIcon} active={activeTool === "image"} onClick={() => handleToolClick("image")} />
          <ToolButton icon={LinkIcon} active={activeTool === "link"} onClick={() => handleToolClick("link")} />
        </div>
      )}

      <Sheet open={tocOpen} onClose={() => setTocOpen(false)} maxHeight={226}>
        <h2 style={{ fontSize: 13, fontWeight: 800, margin: "0 0 12px" }}>Sections</h2>
        {note.conceptIndex.map((section) => {
          const id = section.toLowerCase().replace(/\s+/g, "-");
          const isActive = id === activeSection || (id === "concept-index" && activeSection === "brief");
          return (
            <button
              key={section}
              type="button"
              onClick={() => {
                setTocOpen(false);
                sectionRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              className="press"
              style={{
                display: "block",
                width: "100%",
                textAlign: "left",
                background: "none",
                border: "none",
                padding: "8px 0",
                fontSize: 12,
                fontWeight: isActive ? 700 : 500,
                color: isActive ? "var(--text)" : "var(--text-2)",
                transition: "color .2s ease",
              }}
            >
              {section}
            </button>
          );
        })}
      </Sheet>
    </div>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontSize: 9,
        fontWeight: 700,
        letterSpacing: ".04em",
        textTransform: "uppercase",
        color: "var(--text-2)",
        marginBottom: 8,
      }}
    >
      {children}
    </div>
  );
}

function StatusPill({ label, tone }: { label: string; tone?: "ok" }) {
  return (
    <div
      style={{
        display: "inline-block",
        fontSize: 9,
        fontWeight: 700,
        color: tone === "ok" ? "var(--accent)" : "var(--text-2)",
        marginBottom: 12,
      }}
    >
      {label}
    </div>
  );
}

function CalloutButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className="press"
      style={{
        background: "none",
        border: "none",
        color: "#F2F0EC",
        fontSize: 9,
        fontWeight: 600,
        padding: "4px 10px",
      }}
    >
      {label}
    </button>
  );
}

function ToolButton({
  icon: Icon,
  active,
  onClick,
}: {
  icon: typeof TextIcon;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="press"
      style={{
        width: 36,
        height: 36,
        borderRadius: "50%",
        border: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: active ? "var(--accent)" : "transparent",
        color: active ? "var(--on-accent)" : "var(--text-2)",
        transition: "background-color .2s ease, color .2s ease",
      }}
    >
      <Icon size={18} />
    </button>
  );
}

function NoteTable({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div
      style={{
        border: "1px solid var(--line)",
        borderRadius: "var(--r-tile)",
        overflow: "hidden",
        marginBottom: 20,
      }}
    >
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 9 }}>
        <thead>
          <tr>
            {headers.map((h) => (
              <th
                key={h}
                style={{
                  background: "var(--well)",
                  color: "var(--text-2)",
                  textAlign: "left",
                  padding: "8px 10px",
                  fontWeight: 700,
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri}>
              {row.map((cell, ci) => (
                <td
                  key={ci}
                  style={{
                    padding: "8px 10px",
                    borderTop: "1px solid var(--line)",
                    color: "var(--text-body)",
                    fontWeight: ci === 0 ? 700 : 500,
                    background: ci === 0 ? "var(--accent-key-tint)" : "transparent",
                  }}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function NoteLoading() {
  return (
    <div>
      <Skeleton width={180} height={16} style={{ marginBottom: 8 }} />
      <Skeleton width={80} height={10} radius={10} style={{ marginBottom: 20 }} />
      <Skeleton height={10} style={{ marginBottom: 8 }} />
      <Skeleton height={10} style={{ marginBottom: 8 }} />
      <Skeleton height={10} width="70%" />
    </div>
  );
}

// Rewrites the mock <span color="yellow_bg"> markup (per CLAUDE.md's
// confirmed Notion highlight syntax) into the fixed highlight token.
function withHighlightStyles(html: string): string {
  return html.replace(
    /<span color="yellow_bg">/g,
    '<span style="background:var(--highlight-bg);color:var(--highlight-text);box-decoration-break:clone;-webkit-box-decoration-break:clone;">'
  );
}
