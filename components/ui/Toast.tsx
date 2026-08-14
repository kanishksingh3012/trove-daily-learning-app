"use client";

import { useEffect, useState } from "react";
import { CheckIcon } from "@/components/icons";

const ANIM_MS = 200;

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
    const t = setTimeout(() => setMounted(false), ANIM_MS);
    return () => clearTimeout(t);
  }, [closing]);

  if (!mounted) return null;

  return (
    <div
      role="status"
      style={{
        position: "fixed",
        left: "50%",
        bottom: 106,
        transform: "translateX(-50%)",
        zIndex: 70,
        background: "var(--overlay)",
        color: "#F2F0EC",
        borderRadius: 57,
        padding: "12px 16px",
        display: "flex",
        alignItems: "center",
        gap: 8,
        fontSize: 11,
        fontWeight: 600,
        boxShadow: "var(--shadow-toast)",
        animation: `${closing ? "toast-out" : "toast-in"} ${ANIM_MS}ms ease-out`,
        animationFillMode: "forwards",
        whiteSpace: "nowrap",
        maxWidth: "calc(100% - 48px)",
      }}
    >
      <CheckIcon size={14} />
      <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{message}</span>
    </div>
  );
}
