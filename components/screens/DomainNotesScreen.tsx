"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeftIcon, ChevronRightIcon, FolderOpenIcon, PlusIcon } from "@/components/icons";
import { getDomain, getNoteSummariesForDomain } from "@/lib/mock-data";
import { useAddTopicSheet } from "@/components/AddTopicSheetProvider";

export default function DomainNotesScreen({ domainId }: { domainId: string }) {
  const router = useRouter();
  const { openAddSheet } = useAddTopicSheet();
  const domain = getDomain(domainId);
  const notes = getNoteSummariesForDomain(domainId);
  if (!domain) return null;

  return (
    <div style={{ paddingTop: 14, paddingBottom: 12, animation: "scr 380ms var(--e-screen) both" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "0 20px" }}>
        <button
          type="button"
          aria-label="Back"
          onClick={() => router.push("/topics")}
          className="press"
          style={{
            width: 38,
            height: 38,
            borderRadius: "50%",
            background: "var(--well)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--text)",
          }}
        >
          <ChevronLeftIcon size={20} />
        </button>
        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: 22, color: "var(--text)", margin: 0 }}>
          {domain.name}
        </h1>
      </div>

      <div style={{ padding: "18px 20px 0", display: "flex", flexDirection: "column", gap: 8 }}>
        {notes.map((note, i) => (
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
              animation: `listIn 420ms var(--e-screen) ${i * 50}ms both`,
            }}
          >
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text)" }}>{note.topicName}</div>
              <div style={{ fontSize: 10, color: "var(--text-3)", marginTop: 3 }}>
                {new Date(note.date).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
              </div>
            </div>
            <ChevronRightIcon size={18} style={{ color: "var(--text-3)" }} />
          </Link>
        ))}

        {notes.length === 0 && (
          <div style={{ textAlign: "center", padding: "70px 20px", animation: "scr 400ms var(--e-screen) both" }}>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 20,
                background: "var(--well)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto",
                color: "var(--text-3)",
              }}
            >
              <FolderOpenIcon size={26} />
            </div>
            <div style={{ fontFamily: "var(--font-serif)", fontSize: 20, color: "var(--text)", marginTop: 14 }}>
              Nothing here yet
            </div>
            <div style={{ fontSize: 11, color: "var(--text-2)", marginTop: 6, lineHeight: 1.6 }}>
              Queue a topic in this domain and the note arrives with tomorrow morning&rsquo;s run.
            </div>
            <button
              type="button"
              onClick={openAddSheet}
              className="press"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 7,
                background: "var(--accent)",
                color: "var(--on-accent)",
                borderRadius: 24,
                padding: "12px 20px",
                fontSize: 12,
                fontWeight: 700,
                marginTop: 18,
              }}
            >
              <PlusIcon size={16} strokeWidth={2.4} />
              Request a topic
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
