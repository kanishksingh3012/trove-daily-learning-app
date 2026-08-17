"use client";

import { useState } from "react";
import Link from "next/link";
import Switch from "@/components/ui/Switch";
import { LockIcon } from "@/components/icons";
import { ACCENT_OPTIONS, useTheme } from "@/lib/theme";
import { STATS, PROMPT_INFO } from "@/lib/mock-data";

export default function SettingsScreen() {
  const { mode, accent, ready, setMode, setAccent } = useTheme();
  const [notifyDaily, setNotifyDaily] = useState(true);
  const [notifyCustom, setNotifyCustom] = useState(true);

  return (
    <div style={{ paddingTop: 14, paddingBottom: 12, animation: "scr 380ms var(--e-screen) both" }}>
      <div style={{ padding: "0 20px" }}>
        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: 26, color: "var(--text)", margin: 0 }}>Settings</h1>
      </div>

      <div
        style={{
          margin: "16px 20px 0",
          borderRadius: 26,
          padding: 18,
          background: "var(--grad)",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Stat value={STATS.totalNotes} label="Notes" />
        <Stat value={STATS.domainCount} label="Domains" />
        <Stat value={STATS.mostActiveDomain.split(" ")[0]} label="Most active" />
      </div>

      <div style={{ padding: "20px 20px 0", display: "flex", flexDirection: "column", gap: 12 }}>
        <SectionEyebrow>Appearance</SectionEyebrow>
        <Card>
          <Row label="Dark mode">
            <Switch
              checked={ready ? mode === "dark" : false}
              onChange={(next) => setMode(next ? "dark" : "light")}
              label="Dark mode"
            />
          </Row>
          <Divider />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text)" }}>Theme colour</div>
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
                      width: 24,
                      height: 24,
                      flex: "0 0 24px",
                      borderRadius: "50%",
                      background: opt.swatch,
                      boxShadow: selected ? "0 0 0 2px var(--surface), 0 0 0 4px var(--text)" : "none",
                      transform: selected ? "scale(1.14)" : "scale(1)",
                      // No press-dip here — the prototype's accent swatches
                      // (unlike domain swatches) have no style-active.
                      transition: "transform 0.28s var(--e-spring), box-shadow 0.28s ease",
                    }}
                  />
                );
              })}
            </div>
          </div>
        </Card>

        <SectionEyebrow style={{ marginTop: 4 }}>Notifications</SectionEyebrow>
        <Card>
          <Row label="Today's note is ready">
            <Switch checked={notifyDaily} onChange={setNotifyDaily} label="Today's note is ready" />
          </Row>
          <Divider />
          <Row label="Custom topic ready">
            <Switch checked={notifyCustom} onChange={setNotifyCustom} label="Custom topic ready" />
          </Row>
        </Card>

        <SectionEyebrow style={{ marginTop: 4 }}>Automation</SectionEyebrow>
        <Card>
          <Link
            href="/settings/prompt"
            style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
          >
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text)" }}>The prompt</div>
              <div style={{ fontSize: 10, color: "var(--text-3)", marginTop: 2 }}>Edit this prompt in Cowork</div>
            </div>
            <LockIcon size={18} style={{ color: "var(--text-3)" }} />
          </Link>
          <Divider />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text)" }}>Timing</div>
              <div style={{ fontSize: 10, color: "var(--text-3)", marginTop: 2 }}>{PROMPT_INFO.schedule}</div>
            </div>
            <LockIcon size={18} style={{ color: "var(--text-3)" }} />
          </div>
        </Card>
      </div>
    </div>
  );
}

function Stat({ value, label }: { value: string | number; label: string }) {
  return (
    <div>
      <div style={{ fontFamily: "var(--font-serif)", fontSize: 26, color: "var(--text)" }}>{value}</div>
      <div style={{ fontSize: 10, color: "var(--text-2)", marginTop: 2 }}>{label}</div>
    </div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        background: "var(--surface)",
        borderRadius: 20,
        padding: 16,
        display: "flex",
        flexDirection: "column",
        gap: 16,
        transition: "background-color 0.4s ease",
      }}
    >
      {children}
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text)" }}>{label}</div>
      {children}
    </div>
  );
}

function Divider() {
  return <div style={{ height: 1, background: "var(--line)" }} />;
}

function SectionEyebrow({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div
      style={{
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: ".1em",
        textTransform: "uppercase",
        color: "var(--text-3)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
