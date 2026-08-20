import type { Metadata, Viewport } from "next";
import { Manrope, Lora } from "next/font/google";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import "./globals.css";
import "./motion.css";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-manrope",
  display: "swap",
});

const lora = Lora({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-lora",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Trove",
  description: "Personal daily learning companion",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Trove",
  },
};

export const viewport: Viewport = {
  themeColor: "#FDFCFA",
  width: "device-width",
  initialScale: 1,
  // Native iOS apps don't support pinch-zooming their whole UI — matches
  // that, and prevents an accidental pinch-out from getting stuck zoomed
  // out in the installed standalone app (no page chrome to reset it via).
  maximumScale: 1,
  viewportFit: "cover",
};

// Applies the persisted theme/accent before first paint, so there's no
// flash of the wrong palette. Kept tiny and dependency-free on purpose.
// Light is the bare-:root default (design.md) — only "dark" needs an
// attribute; same for accent, where "neutral" needs none.
const THEME_BOOTSTRAP = `
(function () {
  try {
    var theme = localStorage.getItem("trove-mode") || "light";
    var accent = localStorage.getItem("trove-accent") || "neutral";
    var root = document.documentElement;
    if (theme === "dark") root.setAttribute("data-theme", "dark");
    else root.removeAttribute("data-theme");
    if (accent && accent !== "neutral") root.setAttribute("data-accent", accent);
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${manrope.variable} ${lora.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOTSTRAP }} />
      </head>
      <body>
        <div className="app-shell">{children}</div>
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
