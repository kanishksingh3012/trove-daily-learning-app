"use client";

import { useState } from "react";
import Link from "next/link";
import Switch from "@/components/ui/Switch";
import { ChevronRightIcon } from "@/components/icons";
import { ACCENT_OPTIONS, useTheme } from "@/lib/theme";
import { STATS, PROMPT_INFO } from "@/lib/mock-data";

export default function SettingsScreen() {
  const { mode, accent, ready, setMode, setAccent } = useTheme();
  const [notifyDaily, setNotifyDaily] = useState(true);
  const [notifyCustom, setNotifyCustom] = useState(true);

  return (
    <div style={{ paddingTop: 4 }}>
      <h1 style={{ fontSize: 16, fontWeight: 800, margin: "0 0 16px" }}>Settings</h1>

      <Card>
        <Link
          href="/settings/prompt"
          className="press"
          style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", padding: "12px 4px" }}
        >
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text)", marginBottom: 4 }}>Prompt</div>
            <div
              style={{
                fontSize: 9,
                color: "var(--text-2)",
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: 1,
                WebkitBoxOrient: "vertical",
              }}
            >
              {PROMPT_INFO.activePrompt}
            </div>
          </div>
          <ChevronRightIcon size={16} color="var(--text-3)" />
        </Link>
        <Divider />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 4px" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text)" }}>Timing</div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 11, color: "var(--text-2)" }}>{PROMPT_INFO.schedule}</div>
          </div>
        </div>
        <p style={{ fontSize: 9, color: "var(--text-3)", margin: "0 0 4px 4px" }}>
          Change schedule in Cowork — view only here
        </p>
      </Card>

      <Card style={{ marginTop: 16 }}>
        <Row label="Today's note ready">
          <Switch checked={notifyDaily} onChange={setNotifyDaily} label="Today's note ready" />
        </Row>
        <Divider />
        <Row label="Custom topic ready">
          <Switch checked={notifyCustom} onChange={setNotifyCustom} label="Custom topic ready" />
        </Row>
      </Card>

      <SectionEyebrow>Appearance</SectionEyebrow>
      <Card>
        <Row label="Dark mode">
          <Switch
            checked={ready ? mode === "dark" : true}
            onChange={(next) => setMode(next ? "dark" : "light")}
            label="Dark mode"
          />
        </Row>
        <Divider />
        <div style={{ padding: "12px 4px" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text)", marginBottom: 12 }}>Theme colour</div>
          <div style={{ display: "flex", gap: 12 }}>
            {ACCENT_OPTIONS.map((opt) => {
              const selected = ready && accent === opt.key;
              return (
                <button
                  key={opt.key}
                  type="button"
                  aria-label={opt.label}
                  onClick={() => setAccent(opt.key)}
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    border: "none",
                    background: opt.swatch,
                    boxShadow: selected
                      ? "0 0 0 2px var(--well), 0 0 0 4px var(--accent)"
                      : "0 0 0 2px var(--well), 0 0 0 4px transparent",
                    transform: selected ? "scale(1.08)" : "scale(1)",
                    transition: "box-shadow .2s ease, transform .2s cubic-bezier(0.34,1.56,0.64,1)",
                  }}
                />
              );
            })}
          </div>
        </div>
      </Card>

      <SectionEyebrow>Stats</SectionEyebrow>
      <Card>
        <div style={{ display: "flex", padding: "16px 4px 12px" }}>
          <Stat value={STATS.totalNotes} label="Total notes" />
          <Stat value={STATS.domainCount} label="Domains" />
        </div>
        <Divider />
        <div style={{ padding: "12px 4px", fontSize: 10, color: "var(--text-2)" }}>
          Most active: <span style={{ color: "var(--text)", fontWeight: 700 }}>{STATS.mostActiveDomain}</span>
        </div>
      </Card>
    </div>
  );
}

function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div
      style={{
        background: "var(--well)",
        borderRadius: "var(--r-card)",
        padding: "4px 12px",
        marginBottom: 8,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 4px" }}>
      <span style={{ fontSize: 11, fontWeight: 500, color: "var(--text)" }}>{label}</span>
      {children}
    </div>
  );
}

function Divider() {
  return <div style={{ height: 1, background: "var(--line)" }} />;
}

function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontSize: 9,
        fontWeight: 700,
        letterSpacing: ".04em",
        textTransform: "uppercase",
        color: "var(--text-2)",
        margin: "20px 4px 8px",
      }}
    >
      {children}
    </div>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div style={{ flex: 1, textAlign: "center" }}>
      <div style={{ fontSize: 16, fontWeight: 800, color: "var(--text)" }}>{value}</div>
      <div style={{ fontSize: 9, color: "var(--text-2)" }}>{label}</div>
    </div>
  );
}
