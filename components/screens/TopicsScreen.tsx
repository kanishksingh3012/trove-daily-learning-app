"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import SegmentedControl from "@/components/ui/SegmentedControl";
import Skeleton from "@/components/ui/Skeleton";
import Tag from "@/components/ui/Tag";
import Sheet from "@/components/ui/Sheet";
import { FolderMark, PlusIcon, DotsIcon } from "@/components/icons";
import { CATEGORY_META, DOMAIN_SWATCHES } from "@/lib/category";
import { DOMAINS, getAllNoteSummaries, getDomain } from "@/lib/mock-data";
import { createDomain } from "@/lib/mock-api";
import type { CategoryKey, Domain } from "@/lib/types";

type View = "categorical" | "all";

export default function TopicsScreen() {
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<View>("categorical");
  const [domains, setDomains] = useState<Domain[]>(DOMAINS);
  const [sheetOpen, setSheetOpen] = useState(false);
  const notes = getAllNoteSummaries();

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  function handleCreated(domain: Domain) {
    setDomains((prev) => [...prev, domain]);
  }

  return (
    <div style={{ paddingTop: 4 }}>
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <h1 style={{ fontSize: 16, fontWeight: 800, margin: 0 }}>Topics</h1>
        <button
          type="button"
          onClick={() => setSheetOpen(true)}
          className="press"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            background: "none",
            border: "none",
            color: "var(--accent)",
            fontSize: 12,
            fontWeight: 700,
          }}
        >
          <PlusIcon size={14} strokeWidth={2.4} />
          Domain
        </button>
      </header>

      {loading ? (
        <TopicsLoading />
      ) : (
        <>
          <div style={{ marginBottom: 16 }}>
            <SegmentedControl
              value={view}
              onChange={setView}
              options={[
                { value: "categorical", label: "Categorical" },
                { value: "all", label: "All" },
              ]}
            />
          </div>

          {view === "categorical" ? (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, paddingBottom: 24 }}>
              {domains.map((domain) => (
                <DomainCard key={domain.id} domain={domain} />
              ))}
            </div>
          ) : (
            <div
              style={{
                background: "var(--surface)",
                borderRadius: "var(--r-card)",
                boxShadow: "var(--shadow-card)",
                marginBottom: 24,
              }}
            >
              {notes.map((note, i) => {
                const domain = getDomain(note.domainId);
                return (
                  <Link
                    key={note.id}
                    href={`/notes/${note.id}`}
                    className="press"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "8px 12px",
                      borderBottom: i < notes.length - 1 ? "1px solid var(--line)" : "none",
                      transition: "background-color .2s ease",
                    }}
                  >
                    <span style={{ fontSize: 11, color: "var(--text)", paddingRight: 8 }}>{note.topicName}</span>
                    {domain && <Tag category={domain.category} />}
                  </Link>
                );
              })}
            </div>
          )}
        </>
      )}

      <NewDomainSheet open={sheetOpen} onClose={() => setSheetOpen(false)} onCreated={handleCreated} />
    </div>
  );
}

function DomainCard({ domain }: { domain: Domain }) {
  const meta = CATEGORY_META[domain.category];
  return (
    <Link
      href={`/topics/${domain.id}`}
      className="press"
      style={{
        display: "block",
        background: "var(--surface)",
        borderRadius: "var(--r-card)",
        boxShadow: "var(--shadow-card)",
        padding: 12,
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
        <FolderMark colorVar={meta.bodyVar} tabVar={meta.tabVar} />
        <span style={{ color: "var(--text-3)" }}>
          <DotsIcon size={14} />
        </span>
      </div>
      <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text)", marginBottom: 4 }}>{domain.name}</div>
      <div style={{ fontSize: 9, color: "var(--text-2)" }}>{domain.noteCount} notes</div>
    </Link>
  );
}

function TopicsLoading() {
  return (
    <div>
      <Skeleton width={160} height={32} radius={16} style={{ marginBottom: 16 }} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} height={88} radius={20} />
        ))}
      </div>
    </div>
  );
}

function NewDomainSheet({
  open,
  onClose,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  onCreated: (domain: Domain) => void;
}) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState<CategoryKey>(DOMAIN_SWATCHES[0].key);
  const [submitting, setSubmitting] = useState(false);

  function reset() {
    setName("");
    setCategory(DOMAIN_SWATCHES[0].key);
    setSubmitting(false);
  }

  function handleClose() {
    onClose();
    setTimeout(reset, 200);
  }

  async function handleCreate() {
    if (!name.trim()) return;
    setSubmitting(true);
    try {
      const result = await createDomain({ name: name.trim(), category });
      onCreated({ id: result.id, name: result.name, category, noteCount: 0 });
      handleClose();
    } catch {
      setSubmitting(false);
    }
  }

  return (
    <Sheet open={open} onClose={handleClose}>
      <h2 style={{ fontSize: 15, fontWeight: 800, textAlign: "center", margin: "0 0 16px" }}>New domain</h2>

      <label
        style={{
          display: "block",
          fontSize: 9,
          fontWeight: 700,
          letterSpacing: ".04em",
          textTransform: "uppercase",
          color: "var(--text-2)",
          marginBottom: 6,
        }}
      >
        Name
      </label>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="e.g. Linguistics"
        style={{
          width: "100%",
          background: "var(--well)",
          border: "none",
          borderRadius: "var(--r-field)",
          padding: "12px 14px",
          fontSize: 12,
          color: "var(--text)",
          marginBottom: 16,
        }}
      />

      <label
        style={{
          display: "block",
          fontSize: 9,
          fontWeight: 700,
          letterSpacing: ".04em",
          textTransform: "uppercase",
          color: "var(--text-2)",
          marginBottom: 8,
        }}
      >
        Colour
      </label>
      <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        {DOMAIN_SWATCHES.map((swatch) => {
          const selected = swatch.key === category;
          return (
            <button
              key={swatch.key}
              type="button"
              aria-label={CATEGORY_META[swatch.key].label}
              onClick={() => setCategory(swatch.key)}
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                border: "none",
                background: `var(${swatch.var})`,
                boxShadow: selected
                  ? "0 0 0 2px var(--surface), 0 0 0 4px var(--accent)"
                  : "0 0 0 2px var(--surface), 0 0 0 4px transparent",
                transform: selected ? "scale(1.08)" : "scale(1)",
                transition: "box-shadow .2s ease, transform .2s cubic-bezier(0.34,1.56,0.64,1)",
              }}
            />
          );
        })}
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <button
          type="button"
          onClick={handleClose}
          className="press"
          style={{
            flex: 1,
            border: "1px solid var(--line)",
            background: "transparent",
            color: "var(--text)",
            borderRadius: "var(--r-field)",
            padding: "12px",
            fontSize: 12,
            fontWeight: 700,
            transition: "background-color .2s ease, transform .15s cubic-bezier(0.34,1.56,0.64,1)",
          }}
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleCreate}
          disabled={!name.trim() || submitting}
          className="press"
          style={{
            flex: 1,
            border: "none",
            background: "var(--accent)",
            color: "var(--on-accent)",
            borderRadius: "var(--r-field)",
            padding: "12px",
            fontSize: 12,
            fontWeight: 700,
            opacity: !name.trim() ? 0.5 : 1,
            transition: "opacity .2s ease, transform .15s cubic-bezier(0.34,1.56,0.64,1)",
          }}
        >
          {submitting ? "Creating…" : "Create domain"}
        </button>
      </div>
    </Sheet>
  );
}
