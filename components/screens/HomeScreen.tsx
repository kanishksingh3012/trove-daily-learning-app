"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Skeleton from "@/components/ui/Skeleton";
import Toast from "@/components/ui/Toast";
import ActivityGraph from "@/components/ui/ActivityGraph";
import BookmarksSheet from "@/components/BookmarksSheet";
import QuickNoteSheet from "@/components/QuickNoteSheet";
import { EditNoteIcon, BookmarkIcon, ChevronRightIcon } from "@/components/icons";
import {
  USER_NAME,
  TODAY_NOTE_ID,
  YESTERDAY_NOTE_ID,
  TOMORROW_OPTIONS,
  getDomain,
  getNoteDetail,
} from "@/lib/mock-data";
import { pickTomorrowTopic } from "@/lib/mock-api";
import { useSkeleton } from "@/lib/use-skeleton";

const FIRST_LAUNCH = false; // flip to true to preview the first-ever-launch empty state
const DEMO_DATE = new Date(2026, 7, 17);

export default function HomeScreen() {
  const router = useRouter();
  const loading = useSkeleton("home", 900);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [pendingOption, setPendingOption] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [bookmarksOpen, setBookmarksOpen] = useState(false);
  const [quickNoteOpen, setQuickNoteOpen] = useState(false);

  function showToast(message: string) {
    setToast(message);
    setTimeout(() => setToast(null), 2400);
  }

  const today = getNoteDetail(TODAY_NOTE_ID);
  const yesterday = getNoteDetail(YESTERDAY_NOTE_ID);
  const todayDomain = today ? getDomain(today.domainId) : undefined;
  const yesterdayDomain = yesterday ? getDomain(yesterday.domainId) : undefined;

  async function handlePick(optionId: string) {
    const wasSelected = selectedOption === optionId;
    const previous = selectedOption;
    setSelectedOption(optionId);
    setPendingOption(optionId);
    try {
      await pickTomorrowTopic(optionId);
      showToast(wasSelected ? "Still tomorrow’s pick" : "Saved as tomorrow’s pick");
    } catch {
      setSelectedOption(previous);
    } finally {
      setPendingOption(null);
    }
  }

  return (
    <div style={{ paddingBottom: 12 }}>
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          padding: "12px 20px 0",
        }}
      >
        <div>
          <div style={{ fontSize: 11, color: "var(--text-3)" }}>Welcome back {USER_NAME}!</div>
          <div style={{ fontFamily: "var(--font-serif)", fontSize: 22, color: "var(--text)", marginTop: 2 }}>
            {DEMO_DATE.toLocaleDateString("en-GB", { day: "numeric", month: "long" })}, {DEMO_DATE.getFullYear()}
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            type="button"
            aria-label="Quick note"
            onClick={() => setQuickNoteOpen(true)}
            className="hover-row press-icon"
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--text)",
              transition: "transform var(--d-press) var(--e-spring), background-color var(--d-fade) ease",
            }}
          >
            <EditNoteIcon size={19} />
          </button>
          <button
            type="button"
            aria-label="Bookmarks"
            onClick={() => setBookmarksOpen(true)}
            className="hover-row press-icon"
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--text)",
              transition: "transform var(--d-press) var(--e-spring), background-color var(--d-fade) ease",
            }}
          >
            <BookmarkIcon size={19} />
          </button>
        </div>
      </header>

      {loading ? (
        <LoadingState />
      ) : FIRST_LAUNCH ? (
        <EmptyState />
      ) : (
        <>
          <ActivityGraph />

          {today && todayDomain && (
            <button
              type="button"
              onClick={() => router.push(`/notes/${today.id}`)}
              className="hero-card"
              style={{
                display: "block",
                width: "calc(100% - 40px)",
                textAlign: "center",
                margin: "16px 20px 0",
                borderRadius: "var(--r-hero)",
                padding: "22px 18px 20px",
                background: "var(--grad)",
              }}
            >
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".1em", color: "var(--text-2)", textTransform: "uppercase" }}>
                Today&rsquo;s topic
              </div>
              <span
                style={{
                  display: "inline-flex",
                  background: "var(--tag-bg)",
                  color: "var(--tag-fg)",
                  fontSize: 9,
                  fontWeight: 700,
                  borderRadius: 10,
                  padding: "4px 10px",
                  marginTop: 10,
                }}
              >
                {getDomain(today.domainId)?.name}
              </span>
              <div style={{ fontFamily: "var(--font-serif)", fontSize: 28, color: "var(--text)", marginTop: 8, lineHeight: 1.15 }}>
                {today.topicName}
              </div>
              <div style={{ fontSize: 11, color: "var(--text-2)", marginTop: 8, lineHeight: 1.55 }}>{today.blurb}</div>
              <span
                className="read-now-pill"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  background: "var(--accent)",
                  color: "var(--on-accent)",
                  padding: "13px 24px",
                  borderRadius: 26,
                  fontSize: 12,
                  fontWeight: 700,
                  marginTop: 16,
                }}
              >
                Read now <ChevronRightIcon size={16} />
              </span>
            </button>
          )}

          <div style={{ padding: "20px 20px 0" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text)" }}>For tomorrow, select</div>
              <div style={{ fontSize: 10, color: "var(--text-3)" }}>
                {selectedOption === null ? "Tap one" : "Change any time"}
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 12 }}>
              {TOMORROW_OPTIONS.map((opt) => {
                const active = selectedOption === opt.id;
                const isPending = pendingOption === opt.id;
                const domain = getDomain(opt.domainId);
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handlePick(opt.id)}
                    disabled={isPending}
                    className="tomorrow-chip"
                    style={{
                      position: "relative",
                      overflow: "hidden",
                      background: "var(--well)",
                      borderRadius: 16,
                      padding: 12,
                      textAlign: "left",
                      opacity: isPending ? 0.6 : 1,
                    }}
                  >
                    <div
                      aria-hidden
                      style={{
                        position: "absolute",
                        inset: 0,
                        background: "var(--accent)",
                        transition: "opacity 320ms var(--e-screen)",
                        opacity: active ? 1 : 0,
                      }}
                    />
                    <div
                      style={{
                        position: "relative",
                        fontSize: 11,
                        fontWeight: 600,
                        color: active ? "var(--on-accent)" : "var(--text)",
                        transition: "color 320ms ease",
                      }}
                    >
                      {opt.topicName}
                      <div style={{ fontSize: 9, marginTop: 4, fontWeight: 500, opacity: 0.62 }}>
                        {domain?.name.split(" ")[0]}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {yesterday && yesterdayDomain && (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                margin: "18px 20px 0",
                background: "var(--surface)",
                borderRadius: 18,
                padding: "12px 14px",
                transition: "background-color 0.4s ease",
              }}
            >
              <div>
                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: ".08em", color: "var(--text-3)" }}>
                  YESTERDAY
                </div>
                <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text)", marginTop: 3 }}>
                  {yesterday.topicName}
                </div>
              </div>
              <button
                type="button"
                onClick={() => router.push(`/notes/${yesterday.id}`)}
                className="hover-row press"
                style={{
                  border: "1px solid var(--line)",
                  borderRadius: 16,
                  padding: "8px 16px",
                  fontSize: 11,
                  fontWeight: 700,
                  color: "var(--text)",
                }}
              >
                Read
              </button>
            </div>
          )}
        </>
      )}

      <Toast message={toast ?? ""} visible={!!toast} />
      <BookmarksSheet open={bookmarksOpen} onClose={() => setBookmarksOpen(false)} />
      <QuickNoteSheet
        open={quickNoteOpen}
        onClose={() => setQuickNoteOpen(false)}
        onSaved={() => showToast("Note kept for later")}
      />
    </div>
  );
}

function LoadingState() {
  return (
    <div style={{ padding: "20px 20px 0", animation: "fade-in 200ms ease" }}>
      <Skeleton height={16} width="55%" style={{ marginBottom: 12 }} />
      <Skeleton height={26} width="70%" radius={10} style={{ marginBottom: 20 }} />
      <Skeleton height={150} radius={26} style={{ marginBottom: 16 }} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} height={62} radius={16} />
        ))}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div style={{ padding: "20px 20px 0" }}>
      <div
        style={{
          background: "var(--well)",
          borderRadius: "var(--r-card)",
          padding: 24,
          textAlign: "center",
          marginBottom: 16,
        }}
      >
        <p style={{ fontSize: 12, fontWeight: 600, color: "var(--text-2)", margin: 0 }}>
          No topic yet — your first note lands after tomorrow&rsquo;s run.
        </p>
      </div>
    </div>
  );
}
