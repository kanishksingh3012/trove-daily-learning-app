"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";

const ANIM_IN_MS = 380;
const ANIM_OUT_MS = 220;

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
    const t = setTimeout(() => setMounted(false), ANIM_OUT_MS);
    return () => clearTimeout(t);
  }, [closing]);

  useEffect(() => {
    if (!mounted) return;
    // .app-shell is height-capped to the viewport, so .screen-scroll (not
    // body) is the element that actually scrolls on tab screens — lock
    // both so the background can't scroll behind an open sheet regardless
    // of which one applies for the current screen.
    const scrollEl = document.querySelector<HTMLElement>(".screen-scroll");
    const prevBody = document.body.style.overflow;
    const prevScroll = scrollEl?.style.overflow;
    document.body.style.overflow = "hidden";
    if (scrollEl) scrollEl.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevBody;
      if (scrollEl) scrollEl.style.overflow = prevScroll ?? "";
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
          background: "rgba(10, 10, 12, 0.46)",
          transition: "opacity 0.3s ease",
          opacity: closing ? 0 : 1,
        }}
      />
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 480,
          maxHeight: maxHeight ?? "85vh",
          background: "var(--frame)",
          borderRadius: "32px 32px 0 0",
          boxShadow: "0 -10px 34px rgba(0, 0, 0, 0.2)",
          padding: "14px 20px 30px",
          display: "flex",
          flexDirection: "column",
          gap: 16,
          animation: closing
            ? `sheetOut ${ANIM_OUT_MS}ms var(--e-exit)`
            : `sheetIn ${ANIM_IN_MS}ms var(--e-screen)`,
          animationFillMode: "forwards",
          overflowY: "auto",
        }}
      >
        <div
          style={{
            width: 38,
            height: 4,
            background: "var(--line)",
            borderRadius: 2,
            alignSelf: "center",
            flexShrink: 0,
          }}
        />
        {children}
      </div>
    </div>
  );
}
