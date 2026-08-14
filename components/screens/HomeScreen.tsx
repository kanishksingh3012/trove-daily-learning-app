"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Skeleton from "@/components/ui/Skeleton";
import Toast from "@/components/ui/Toast";
import Tag from "@/components/ui/Tag";
import { CATEGORY_META } from "@/lib/category";
import {
  TODAY_NOTE_ID,
  YESTERDAY_NOTE_ID,
  TOMORROW_OPTIONS,
  getDomain,
  getNoteDetail,
} from "@/lib/mock-data";
import { pickTomorrowTopic } from "@/lib/mock-api";
import { ChevronRightIcon, TextIcon } from "@/components/icons";

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

const FIRST_LAUNCH = false; // flip to true to preview the first-ever-launch empty state

export default function HomeScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [pendingOption, setPendingOption] = useState<string | null>(null);
  const [toastVisible, setToastVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!toastVisible) return;
    const t = setTimeout(() => setToastVisible(false), 2000);
    return () => clearTimeout(t);
  }, [toastVisible]);

  const today = getNoteDetail(TODAY_NOTE_ID);
  const yesterday = getNoteDetail(YESTERDAY_NOTE_ID);
  const todayDomain = today ? getDomain(today.domainId) : undefined;
  const yesterdayDomain = yesterday ? getDomain(yesterday.domainId) : undefined;

  async function handlePick(optionId: string) {
    const previous = selectedOption;
    setSelectedOption(optionId);
    setPendingOption(optionId);
    try {
      await pickTomorrowTopic(optionId);
      setToastVisible(true);
    } catch {
      setSelectedOption(previous);
    } finally {
      setPendingOption(null);
    }
  }

  return (
    <div style={{ paddingTop: 4 }}>
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 20,
        }}
      >
        <h1 style={{ fontSize: 16, fontWeight: 800, margin: 0 }}>{greeting()}</h1>
        <Link
          href="/quick-note"
          aria-label="Quick note"
          style={{
            width: 30,
            height: 30,
            borderRadius: "50%",
            border: "1.5px solid var(--line)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--text)",
          }}
        >
          <TextIcon size={15} />
        </Link>
      </header>

      {loading ? (
        <LoadingState />
      ) : FIRST_LAUNCH ? (
        <EmptyState />
      ) : (
        <>
          <SectionLabel>Today&rsquo;s topic</SectionLabel>
          {today && todayDomain && (
            <button
              type="button"
              onClick={() => router.push(`/notes/${today.id}`)}
              className="press"
              style={{
                display: "block",
                width: "100%",
                textAlign: "left",
                border: "none",
                background: "none",
                padding: 0,
                marginBottom: 20,
              }}
            >
              <HeroCard title={today.topicName} category={todayDomain.category} />
            </button>
          )}

          <SectionLabel>For tomorrow, select</SectionLabel>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 8,
              marginBottom: 20,
            }}
          >
            {TOMORROW_OPTIONS.map((opt) => {
              const active = selectedOption === opt.id;
              const isPending = pendingOption === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handlePick(opt.id)}
                  disabled={isPending}
                  className="press"
                  style={{
                    textAlign: "left",
                    border: active ? "1px solid transparent" : "1px solid var(--line)",
                    background: active ? "var(--accent)" : "var(--surface)",
                    color: active ? "var(--on-accent)" : "var(--text)",
                    borderRadius: "var(--r-field)",
                    padding: 8,
                    fontSize: 10,
                    fontWeight: active ? 700 : 500,
                    lineHeight: 1.4,
                    opacity: isPending ? 0.6 : 1,
                    transition:
                      "background-color .2s ease, color .2s ease, border-color .2s ease, opacity .2s ease, transform .15s cubic-bezier(0.34,1.56,0.64,1)",
                  }}
                >
                  {opt.topicName}
                </button>
              );
            })}
          </div>

          <SectionLabel>Yesterday</SectionLabel>
          {yesterday && yesterdayDomain && (
            <Link
              href={`/notes/${yesterday.id}`}
              className="press"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: "var(--surface)",
                border: "1px solid var(--line)",
                borderRadius: "var(--r-field)",
                padding: "10px 12px",
                marginBottom: 24,
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 9,
                    fontWeight: 700,
                    letterSpacing: ".04em",
                    textTransform: "uppercase",
                    color: "var(--text-3)",
                    marginBottom: 4,
                  }}
                >
                  Yesterday
                </div>
                <div style={{ fontSize: 11, fontWeight: 500, color: "var(--text)" }}>{yesterday.topicName}</div>
              </div>
              <span
                style={{
                  background: "var(--accent-fill)",
                  color: "var(--accent)",
                  borderRadius: "var(--r-field)",
                  padding: "6px 12px",
                  fontSize: 10,
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                Read
              </span>
            </Link>
          )}
        </>
      )}
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text)", marginBottom: 8 }}>{children}</div>
  );
}

function HeroCard({ title, category }: { title: string; category: keyof typeof CATEGORY_META }) {
  const meta = CATEGORY_META[category];
  return (
    <div
      style={{
        position: "relative",
        height: 180,
        borderRadius: "var(--r-card)",
        overflow: "hidden",
        background: `linear-gradient(155deg, var(${meta.bodyVar}) 0%, var(--well) 70%)`,
        boxShadow: "var(--shadow-card)",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(180deg, transparent 40%, rgba(0,0,0,.7) 100%)",
        }}
      />
      <div style={{ position: "absolute", left: 16, right: 16, bottom: 16 }}>
        <div style={{ marginBottom: 8 }}>
          <Tag category={category} />
        </div>
        <div style={{ fontSize: 16, fontWeight: 800, color: "#F2F0EC", marginBottom: 12 }}>{title}</div>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            background: "var(--accent)",
            color: "var(--on-accent)",
            borderRadius: "var(--r-field)",
            padding: "12px 16px",
            fontSize: 11,
            fontWeight: 700,
          }}
        >
          Read now <ChevronRightIcon size={14} />
        </span>
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div>
      <Skeleton width={140} height={18} style={{ marginBottom: 20 }} />
      <Skeleton width={100} height={12} style={{ marginBottom: 8 }} />
      <Skeleton height={150} radius={20} style={{ marginBottom: 20 }} />
      <Skeleton width={140} height={12} style={{ marginBottom: 8 }} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 20 }}>
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} height={38} radius={14} />
        ))}
      </div>
      <Skeleton width={80} height={10} style={{ marginBottom: 8 }} />
      <Skeleton height={48} radius={14} />
    </div>
  );
}

function EmptyState() {
  return (
    <div>
      <div
        style={{
          background: "var(--well)",
          borderRadius: "var(--r-card)",
          padding: 20,
          textAlign: "center",
          marginBottom: 20,
        }}
      >
        <p style={{ fontSize: 12, fontWeight: 600, color: "var(--text-2)", margin: 0 }}>
          No topic yet — your first note lands after tomorrow&rsquo;s run.
        </p>
      </div>
      <SectionLabel>For tomorrow, select</SectionLabel>
      <div
        style={{
          border: "1.5px dashed var(--dashed)",
          borderRadius: "var(--r-card)",
          padding: 20,
          textAlign: "center",
          marginBottom: 20,
        }}
      >
        <p style={{ fontSize: 11, color: "var(--text-2)", margin: 0 }}>
          Options for tomorrow will show up here once Cowork runs.
        </p>
      </div>
      <SectionLabel>Yesterday</SectionLabel>
      <p style={{ fontSize: 10, color: "var(--text-3)" }}>— no history yet —</p>
    </div>
  );
}
