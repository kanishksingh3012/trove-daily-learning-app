"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HomeIcon, BookIcon, GearIcon } from "@/components/icons";
import type { ComponentType } from "react";
import type { IconProps } from "@/components/icons";

const ITEMS: { href: string; label: string; icon: ComponentType<IconProps> }[] = [
  { href: "/", label: "Home", icon: HomeIcon },
  { href: "/topics", label: "Topics", icon: BookIcon },
  { href: "/settings", label: "Settings", icon: GearIcon },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Primary"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 4,
        flex: 1,
        height: 54,
        background: "var(--surface)",
        borderRadius: "var(--r-nav)",
        boxShadow: "var(--shadow-nav)",
        padding: "0 8px",
        transition: "box-shadow .2s ease",
      }}
    >
      {ITEMS.map(({ href, label, icon: Icon }) => {
        const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className="press"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              flexGrow: active ? 3 : 1,
              flexShrink: 0,
              flexBasis: 0,
              minWidth: 0,
              height: 38,
              padding: "8px 12px",
              borderRadius: "var(--r-active-nav)",
              background: active ? "var(--accent)" : "transparent",
              color: active ? "var(--on-accent)" : "var(--text-2)",
              transition:
                "flex-grow .25s cubic-bezier(0.32,0.72,0,1), background-color .2s ease, color .2s ease, transform .15s cubic-bezier(0.34,1.56,0.64,1)",
              overflow: "hidden",
              whiteSpace: "nowrap",
            }}
          >
            <Icon size={18} style={{ flexShrink: 0, transition: "transform .2s ease" }} />
            <span
              style={{
                fontSize: 8,
                fontWeight: 700,
                letterSpacing: ".02em",
                textTransform: "uppercase",
                maxWidth: active ? 80 : 0,
                opacity: active ? 1 : 0,
                transition: "max-width .2s ease, opacity .15s ease",
                overflow: "hidden",
              }}
            >
              {label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
