"use client";

import { useState } from "react";
import Link from "next/link";
import SegmentedControl from "@/components/ui/SegmentedControl";
import Skeleton from "@/components/ui/Skeleton";
import Sheet from "@/components/ui/Sheet";
import Toast from "@/components/ui/Toast";
import { FolderChip, PlusIcon } from "@/components/icons";
import { CATEGORY_META, DOMAIN_SWATCHES } from "@/lib/category";
import { DOMAINS, getAllNoteSummaries, getDomain } from "@/lib/mock-data";
import { createDomain } from "@/lib/mock-api";
import { useSkeleton } from "@/lib/use-skeleton";
import type { CategoryKey, Domain } from "@/lib/types";

type View = "categorical" | "all";

export default function TopicsScreen() {
  const loading = useSkeleton("topics", 650);
  const [view, setView] = useState<View>("categorical");
  const [domains, setDomains] = useState<Domain[]>(DOMAINS);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const notes = getAllNoteSummaries();

  function handleCreated(domain: Domain) {
    setDomains((prev) => [domain, ...prev]);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2400);
  }

  return (
    <div style={{ paddingTop: 14, paddingBottom: 12, animation: "scr 380ms var(--e-screen) both" }}>
      <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px" }}>
        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: 26, color: "var(--text)", margin: 0 }}>Topics</h1>
        <button
          type="button"
          onClick={() => setSheetOpen(true)}
          className="press"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            background: "var(--well)",
            borderRadius: 20,
            padding: "9px 14px",
            fontSize: 11,
            fontWeight: 700,
            color: "var(--text)",
          }}
        >
          <PlusIcon size={16} strokeWidth={2.4} />
          Domain
        </button>
      </header>

      {loading ? (
        <TopicsLoading />
      ) : (
        <>
          <div style={{ padding: "16px 20px 0" }}>
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
            <div style={{ padding: "16px 20px 0", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {domains.map((domain, i) => (
                <DomainCard key={domain.id} domain={domain} index={i} />
              ))}
            </div>
          ) : (
            <div style={{ padding: "16px 20px 0", display: "flex", flexDirection: "column", gap: 8 }}>
              {notes.map((note, i) => {
                const domain = getDomain(note.domainId);
                const meta = domain ? CATEGORY_META[domain.category] : undefined;
                return (
                  <Link
                    key={note.id}
                    href={`/notes/${note.id}`}
                    className="press"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      background: "var(--surface)",
                      borderRadius: 16,
                      padding: 14,
                      animation: `listIn 420ms var(--e-screen) ${i * 40}ms both`,
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text)" }}>{note.topicName}</div>
                      <div style={{ fontSize: 10, color: "var(--text-3)", marginTop: 3 }}>
                        {new Date(note.date).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                      </div>
                    </div>
                    {meta && (
                      <span
                        style={{
                          fontSize: 9,
                          fontWeight: 700,
                          borderRadius: 10,
                          padding: "4px 9px",
                          background: `var(${meta.tintVar})`,
                          color: `var(${meta.colorVar})`,
                        }}
                      >
                        {domain!.name.split(" ")[0]}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          )}
        </>
      )}

      <NewDomainSheet open={sheetOpen} onClose={() => setSheetOpen(false)} onCreated={handleCreated} />
      <Toast message="Domain added to the pool" visible={toastVisible} />
    </div>
  );
}

function DomainCard({ domain, index }: { domain: Domain; index: number }) {
  const meta = CATEGORY_META[domain.category];
  return (
    <Link
      href={`/topics/${domain.id}`}
      className="domain-card"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 24,
        borderRadius: 20,
        padding: 14,
        background: `var(${meta.tintVar})`,
        animation: `listIn 420ms var(--e-screen) ${index * 45}ms both`,
      }}
    >
      <FolderChip colorVar={meta.colorVar} />
      <div>
        <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text)" }}>{domain.name}</div>
        <div style={{ fontSize: 10, color: "var(--text-3)", marginTop: 2 }}>{domain.noteCount} notes</div>
      </div>
    </Link>
  );
}

function TopicsLoading() {
  return (
    <div style={{ padding: "16px 20px 0" }}>
      <Skeleton width={160} height={38} radius={22} style={{ marginBottom: 16 }} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} height={110} radius={20} />
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
    setTimeout(reset, 220);
  }

  async function handleCreate() {
    if (!name.trim() || submitting) return;
    setSubmitting(true);
    try {
      const result = await createDomain({ name: name.trim(), category });
      onCreated({ id: result.id, name: result.name, category, noteCount: 0 });
      handleClose();
    } catch {
      setSubmitting(false);
    }
  }

  const filled = name.trim().length > 0;

  return (
    <Sheet open={open} onClose={handleClose}>
      <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 22, color: "var(--text)", textAlign: "center", margin: 0 }}>
        New domain
      </h2>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name it"
        className="field-focus"
        style={{
          background: "var(--well)",
          border: "1px solid transparent",
          borderRadius: 18,
          padding: 14,
          fontSize: 13,
          color: "var(--text)",
          outline: "none",
        }}
      />
      <div style={{ display: "flex", justifyContent: "space-between", padding: "0 6px" }}>
        {DOMAIN_SWATCHES.map((swatch) => {
          const selected = swatch.key === category;
          return (
            <button
              key={swatch.key}
              type="button"
              aria-label={CATEGORY_META[swatch.key].label}
              onClick={() => setCategory(swatch.key)}
              className="swatch-btn"
              style={{
                width: 34,
                height: 34,
                borderRadius: "50%",
                background: `var(${swatch.var})`,
                boxShadow: selected ? "0 0 0 2px var(--frame), 0 0 0 4px var(--text)" : "none",
                transform: selected ? "scale(1.12)" : "scale(1)",
              }}
            />
          );
        })}
      </div>
      <button
        type="button"
        onClick={handleCreate}
        disabled={!filled || submitting}
        className="press"
        style={{
          background: "var(--accent)",
          color: "var(--on-accent)",
          borderRadius: 26,
          padding: 14,
          fontSize: 12,
          fontWeight: 700,
          opacity: filled ? 1 : 0.45,
          transition: "opacity 250ms ease",
        }}
      >
        {submitting ? "Creating…" : "Create domain"}
      </button>
    </Sheet>
  );
}
