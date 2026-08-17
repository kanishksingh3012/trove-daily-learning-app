"use client";

import { useEffect, useState } from "react";
import { CheckIcon } from "@/components/icons";

const ANIM_IN_MS = 420;
const ANIM_OUT_MS = 240;

export default function Toast({ message, visible }: { message: string; visible: boolean }) {
  const [mounted, setMounted] = useState(visible);
  const [closing, setClosing] = useState(false);
  const [prevVisible, setPrevVisible] = useState(visible);

  if (visible !== prevVisible) {
    setPrevVisible(visible);
    if (visible) {
      setMounted(true);
      setClosing(false);
    } else {
      setClosing(true);
    }
  }

  useEffect(() => {
    if (!closing) return;
    const t = setTimeout(() => setMounted(false), ANIM_OUT_MS);
    return () => clearTimeout(t);
  }, [closing]);

  if (!mounted) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: "fixed",
        left: 24,
        right: 24,
        bottom: 98,
        maxWidth: 432,
        margin: "0 auto",
        background: "#16171A",
        color: "#F7F6F2",
        borderRadius: 24,
        padding: "14px 18px",
        display: "flex",
        alignItems: "center",
        gap: 10,
        fontSize: 12,
        fontWeight: 600,
        boxShadow: "0 12px 28px rgba(0, 0, 0, 0.28)",
        zIndex: 70,
        animation: closing
          ? `toastOut ${ANIM_OUT_MS}ms var(--e-exit)`
          : `toastIn ${ANIM_IN_MS}ms var(--e-screen)`,
        animationFillMode: "forwards",
      }}
    >
      <CheckIcon size={18} style={{ color: "var(--pop-tint)", flexShrink: 0 }} />
      <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{message}</span>
    </div>
  );
}
