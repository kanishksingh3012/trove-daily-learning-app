"use client";

import { usePathname, useRouter } from "next/navigation";
import { HomeIcon, BookIcon, GearIcon } from "@/components/icons";

const ITEMS = [
  { href: "/", label: "Home", icon: HomeIcon },
  { href: "/topics", label: "Topics", icon: BookIcon },
  { href: "/settings", label: "Settings", icon: GearIcon },
];

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const activeIndex = Math.max(
    0,
    ITEMS.findIndex((item) => (item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)))
  );

  return (
    <nav
      aria-label="Primary"
      style={{
        position: "relative",
        flex: 1,
        height: 56,
        borderRadius: 28,
        background: "var(--well)",
        display: "flex",
        padding: 6,
        boxSizing: "border-box",
        transition: "background-color 0.4s ease",
      }}
    >
      {/* Motion spec: a single sliding accent indicator, not per-item fills. */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: 6,
          bottom: 6,
          left: 6,
          width: "calc((100% - 12px) / 3)",
          borderRadius: 22,
          background: "var(--accent)",
          transition: "transform var(--d-nav) var(--e-screen), background-color 0.4s ease",
          transform: `translateX(${activeIndex * 100}%)`,
        }}
      />
      {ITEMS.map(({ href, label, icon: Icon }, i) => {
        const active = i === activeIndex;
        return (
          <button
            key={href}
            type="button"
            aria-label={label}
            aria-current={active ? "page" : undefined}
            onClick={() => router.push(href)}
            style={{
              position: "relative",
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: active ? "var(--on-accent)" : "var(--text-3)",
              transition: "color var(--d-fade) ease",
            }}
          >
            <Icon
              size={20}
              style={{
                transition: `transform var(--d-press) var(--e-spring)`,
                transform: active ? "scale(1.06)" : "scale(1)",
              }}
            />
          </button>
        );
      })}
    </nav>
  );
}
