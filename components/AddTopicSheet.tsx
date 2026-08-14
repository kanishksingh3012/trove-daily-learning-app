"use client";

import { useState } from "react";
import Sheet from "@/components/ui/Sheet";
import { DOMAINS } from "@/lib/mock-data";
import { submitCustomTopic } from "@/lib/mock-api";
import { ChevronDownIcon, CheckIcon, AlertIcon } from "@/components/icons";

type Step = "form" | "picker" | "submitting" | "confirmation" | "error";

export default function AddTopicSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [step, setStep] = useState<Step>("form");
  const [topicName, setTopicName] = useState("");
  const [domainId, setDomainId] = useState(DOMAINS[0].id);

  function reset() {
    setStep("form");
    setTopicName("");
    setDomainId(DOMAINS[0].id);
  }

  function handleClose() {
    onClose();
    // Let the close animation finish before resetting internal state.
    setTimeout(reset, 200);
  }

  async function handleSubmit() {
    if (!topicName.trim()) return;
    setStep("submitting");
    try {
      await submitCustomTopic({ topicName: topicName.trim(), domainId });
      setStep("confirmation");
    } catch {
      setStep("error");
    }
  }

  const selectedDomain = DOMAINS.find((d) => d.id === domainId) ?? DOMAINS[0];

  return (
    <Sheet open={open} onClose={handleClose}>
      {step === "picker" && (
        <DomainWheelPicker
          value={domainId}
          onChange={setDomainId}
          onCancel={() => setStep("form")}
          onDone={() => setStep("form")}
        />
      )}

      {(step === "form" || step === "submitting") && (
        <div>
          <h2 style={{ fontSize: 15, fontWeight: 800, textAlign: "center", margin: "0 0 16px" }}>
            Add a topic
          </h2>

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
            Topic name
          </label>
          <input
            value={topicName}
            onChange={(e) => setTopicName(e.target.value)}
            placeholder="e.g. The Fermi Paradox"
            disabled={step === "submitting"}
            style={{
              width: "100%",
              background: "var(--well)",
              border: "none",
              borderRadius: "var(--r-field)",
              padding: "12px 14px",
              fontSize: 12,
              fontWeight: 500,
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
              marginBottom: 6,
            }}
          >
            Domain
          </label>
          <button
            type="button"
            disabled={step === "submitting"}
            onClick={() => setStep("picker")}
            className="press"
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: "var(--well)",
              border: "none",
              borderRadius: "var(--r-field)",
              padding: "12px 14px",
              fontSize: 12,
              fontWeight: 500,
              color: "var(--text)",
              marginBottom: 20,
            }}
          >
            {selectedDomain.name}
            <ChevronDownIcon size={16} color="var(--text-2)" />
          </button>

          <p style={{ fontSize: 10, color: "var(--text-2)", margin: "0 0 16px", lineHeight: 1.5 }}>
            Queued, not immediate — this note appears after the next scheduled run, not instantly.
          </p>

          <div style={{ display: "flex", gap: 8 }}>
            <button
              type="button"
              onClick={handleClose}
              disabled={step === "submitting"}
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
              onClick={handleSubmit}
              disabled={!topicName.trim() || step === "submitting"}
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
                opacity: !topicName.trim() ? 0.5 : 1,
                transition: "opacity .2s ease, transform .15s cubic-bezier(0.34,1.56,0.64,1)",
              }}
            >
              {step === "submitting" ? "Submitting…" : "Submit"}
            </button>
          </div>
        </div>
      )}

      {step === "confirmation" && (
        <div style={{ textAlign: "center", padding: "8px 8px 4px" }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              background: "var(--accent)",
              color: "var(--on-accent)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
            }}
          >
            <CheckIcon size={22} />
          </div>
          <h2 style={{ fontSize: 15, fontWeight: 800, margin: "0 0 8px" }}>We&rsquo;ll let you know</h2>
          <p style={{ fontSize: 11, color: "var(--text-2)", lineHeight: 1.5, margin: "0 0 20px" }}>
            You&rsquo;ll get a notification once your note is ready.
          </p>
          <button
            type="button"
            onClick={handleClose}
            className="press"
            style={{
              width: "100%",
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
            Got it
          </button>
        </div>
      )}

      {step === "error" && (
        <div style={{ textAlign: "center", padding: "8px 8px 4px" }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              background: "var(--danger-bg)",
              color: "var(--danger)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
            }}
          >
            <AlertIcon size={22} />
          </div>
          <h2 style={{ fontSize: 15, fontWeight: 800, margin: "0 0 8px" }}>Couldn&rsquo;t submit</h2>
          <p style={{ fontSize: 11, color: "var(--text-2)", lineHeight: 1.5, margin: "0 0 20px" }}>
            That didn&rsquo;t save — check your connection and try again.
          </p>
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
              onClick={handleSubmit}
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
                transition: "transform .15s cubic-bezier(0.34,1.56,0.64,1)",
              }}
            >
              Retry
            </button>
          </div>
        </div>
      )}
    </Sheet>
  );
}

function DomainWheelPicker({
  value,
  onChange,
  onCancel,
  onDone,
}: {
  value: string;
  onChange: (id: string) => void;
  onCancel: () => void;
  onDone: () => void;
}) {
  const index = DOMAINS.findIndex((d) => d.id === value);

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <button
          type="button"
          onClick={onCancel}
          className="press"
          style={{ background: "none", border: "none", color: "var(--text-2)", fontSize: 12, fontWeight: 700 }}
        >
          Cancel
        </button>
        <span style={{ fontSize: 13, fontWeight: 800 }}>Domain</span>
        <button
          type="button"
          onClick={onDone}
          className="press"
          style={{ background: "none", border: "none", color: "var(--accent)", fontSize: 12, fontWeight: 800 }}
        >
          Done
        </button>
      </div>

      <div style={{ position: "relative", padding: "4px 0" }}>
        {DOMAINS.map((domain, i) => {
          const distance = Math.abs(i - index);
          const isSelected = i === index;
          const opacity = isSelected ? 1 : distance === 1 ? 0.55 : 0.28;
          const color = isSelected ? "var(--text)" : distance === 1 ? "var(--text-3)" : "var(--dashed)";
          return (
            <button
              key={domain.id}
              type="button"
              onClick={() => onChange(domain.id)}
              className="press"
              style={{
                display: "block",
                width: "100%",
                textAlign: "center",
                border: "none",
                background: isSelected ? "var(--well)" : "transparent",
                borderRadius: "var(--r-field)",
                padding: "10px 0",
                fontSize: isSelected ? 12 : 11,
                fontWeight: isSelected ? 800 : 500,
                color,
                opacity,
                transition: "background-color .18s ease, color .18s ease, opacity .18s ease, font-size .18s ease, font-weight .18s ease",
              }}
            >
              {domain.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
