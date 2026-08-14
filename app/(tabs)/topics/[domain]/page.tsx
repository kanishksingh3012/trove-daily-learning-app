import Link from "next/link";
import { notFound } from "next/navigation";
import Tag from "@/components/ui/Tag";
import { ChevronLeftIcon } from "@/components/icons";
import { getDomain, getNoteSummariesForDomain } from "@/lib/mock-data";

export default async function Page({ params }: { params: Promise<{ domain: string }> }) {
  const { domain: domainId } = await params;
  const domain = getDomain(domainId);
  if (!domain) notFound();

  const notes = getNoteSummariesForDomain(domainId);

  return (
    <div style={{ paddingTop: 4 }}>
      <Link
        href="/topics"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 4,
          color: "var(--accent)",
          fontSize: 12,
          fontWeight: 700,
          marginBottom: 16,
        }}
      >
        <ChevronLeftIcon size={16} />
        Topics
      </Link>

      <h1 style={{ fontSize: 16, fontWeight: 800, margin: "0 0 4px" }}>{domain.name}</h1>
      <p style={{ fontSize: 10, color: "var(--text-2)", margin: "0 0 16px" }}>
        {notes.length} {notes.length === 1 ? "note" : "notes"}
      </p>

      {notes.length === 0 ? (
        <div
          style={{
            background: "var(--well)",
            borderRadius: "var(--r-card)",
            padding: 24,
            textAlign: "center",
          }}
        >
          <p style={{ fontSize: 11, color: "var(--text-2)", margin: 0 }}>
            No notes in this domain yet.
          </p>
        </div>
      ) : (
        <div
          style={{
            background: "var(--surface)",
            borderRadius: "var(--r-card)",
            boxShadow: "var(--shadow-card)",
          }}
        >
          {notes.map((note, i) => (
            <Link
              key={note.id}
              href={`/notes/${note.id}`}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "10px 12px",
                borderBottom: i < notes.length - 1 ? "1px solid var(--line)" : "none",
              }}
            >
              <span style={{ fontSize: 11, color: "var(--text)" }}>{note.topicName}</span>
              <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 10, color: "var(--text-3)" }}>
                  {new Date(note.date).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                </span>
                <Tag category={domain.category} />
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
