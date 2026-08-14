"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";

const ANIM_MS = 220;

export default function Sheet({
  open,
  onClose,
  children,
  maxHeight,
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  maxHeight?: number | string;
}) {
  const [mounted, setMounted] = useState(open);
  const [closing, setClosing] = useState(false);
  const [prevOpen, setPrevOpen] = useState(open);

  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) {
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

  useEffect(() => {
    if (!mounted) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mounted]);

  if (!mounted) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 60,
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
      }}
    >
      <button
        aria-label="Dismiss"
        onClick={onClose}
        style={{
          position: "absolute",
          inset: 0,
          background: "var(--scrim)",
          border: "none",
          animation: `${closing ? "fade-out" : "fade-in"} ${ANIM_MS}ms ease`,
          animationFillMode: "forwards",
        }}
      />
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 480,
          maxHeight: maxHeight ?? "85vh",
          background: "var(--surface)",
          borderTopLeftRadius: "var(--r-card)",
          borderTopRightRadius: "var(--r-card)",
          boxShadow: "var(--shadow-sheet)",
          padding: "12px 16px 24px",
          animation: `${closing ? "sheet-down" : "sheet-up"} ${ANIM_MS}ms cubic-bezier(0.32, 0.72, 0, 1)`,
          animationFillMode: "forwards",
          overflowY: "auto",
        }}
      >
        <div
          style={{
            width: 36,
            height: 4,
            borderRadius: 2,
            background: "var(--handle)",
            margin: "0 auto 12px",
          }}
        />
        {children}
      </div>
    </div>
  );
}
