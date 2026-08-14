import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Daily Learning",
  description: "Personal daily learning companion",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Daily Learning",
  },
};

export const viewport: Viewport = {
  themeColor: "#16171a",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

// Applies the persisted theme/accent before first paint, so there's no
// flash of the wrong palette. Kept tiny and dependency-free on purpose.
const THEME_BOOTSTRAP = `
(function () {
  try {
    var theme = localStorage.getItem("dlc-theme") || "dark";
    var accent = localStorage.getItem("dlc-accent") || "neutral";
    var root = document.documentElement;
    if (theme === "light") root.setAttribute("data-theme", "light");
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
    <html lang="en" className={manrope.variable}>
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
