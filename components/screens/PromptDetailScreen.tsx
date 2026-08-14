"use client";

import { useRouter } from "next/navigation";
import { ChevronLeftIcon } from "@/components/icons";
import { PROMPT_INFO } from "@/lib/mock-data";

export default function PromptDetailScreen() {
  const router = useRouter();

  const rows: [string, string][] = [
    ["Schedule", PROMPT_INFO.schedule],
    ["Length", PROMPT_INFO.length],
    ["Destination", PROMPT_INFO.destination],
    ["Rotation", PROMPT_INFO.rotation],
  ];

  return (
    <div>
      <div className="status-bar" />
      <div className="screen-scroll" style={{ paddingTop: 4, paddingBottom: 32 }}>
        <button
          type="button"
          onClick={() => router.back()}
          className="press"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            background: "none",
            border: "none",
            color: "var(--text)",
            marginBottom: 16,
          }}
          aria-label="Back"
        >
          <ChevronLeftIcon size={20} />
        </button>

        <h1 style={{ fontSize: 16, fontWeight: 800, margin: "0 0 16px" }}>Prompt</h1>

        <div
          style={{
            background: "var(--well)",
            borderRadius: "var(--r-card)",
            padding: 16,
            marginBottom: 16,
          }}
        >
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
            Active prompt
          </div>
          <p style={{ fontSize: 12, lineHeight: 1.7, color: "var(--text-body)", margin: 0 }}>
            {PROMPT_INFO.activePrompt}
          </p>
        </div>

        <div
          style={{
            background: "var(--well)",
            borderRadius: "var(--r-card)",
            padding: "4px 16px",
            marginBottom: 16,
          }}
        >
          {rows.map(([key, value], i) => (
            <div
              key={key}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px 0",
                borderBottom: i < rows.length - 1 ? "1px solid var(--line)" : "none",
              }}
            >
              <span style={{ fontSize: 11, color: "var(--text-2)" }}>{key}</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: "var(--text)" }}>{value}</span>
            </div>
          ))}
        </div>

        <p style={{ fontSize: 10, color: "var(--text-3)", textAlign: "center" }}>
          Read only — edit this prompt in Cowork
        </p>
      </div>
    </div>
  );
}
