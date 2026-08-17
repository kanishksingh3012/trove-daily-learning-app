"use client";

import { useRouter } from "next/navigation";
import { ChevronLeftIcon, LockIcon } from "@/components/icons";
import { PROMPT_INFO } from "@/lib/mock-data";

export default function PromptDetailScreen() {
  const router = useRouter();

  return (
    <div style={{ position: "fixed", inset: 0, background: "var(--frame)", zIndex: 25, animation: "scr 340ms var(--e-screen) both" }}>
      <div style={{ position: "absolute", inset: "60px 0 0", overflowY: "auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 20px 0" }}>
          <button
            type="button"
            aria-label="Back"
            onClick={() => router.back()}
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
            The prompt
          </h1>
        </div>

        <div
          style={{
            margin: "18px 20px",
            display: "flex",
            gap: 10,
            alignItems: "flex-start",
            background: "var(--well)",
            borderRadius: 16,
            padding: "12px 14px",
          }}
        >
          <LockIcon size={17} style={{ color: "var(--text-3)", flexShrink: 0, marginTop: 1 }} />
          <div style={{ fontSize: 11, color: "var(--text-2)", lineHeight: 1.5 }}>
            Read only here. The schedule and the prompt itself are edited in Cowork.
          </div>
        </div>

        <div
          style={{
            margin: "0 20px 40px",
            background: "var(--surface)",
            borderRadius: 20,
            padding: 18,
            fontSize: 11,
            lineHeight: 1.85,
            color: "var(--text-2)",
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
          }}
        >
          {PROMPT_INFO.activePrompt}
        </div>
      </div>
    </div>
  );
}
