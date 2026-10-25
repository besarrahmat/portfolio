import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

// Words in the proportional face; IDs, dates and figures in the fixed-pitch one (docs/DESIGN.md §4).
// shortcut: latin slices only (76 KB, OFL, ./fonts/OFL.txt); Japanese falls back to the system Gothic in
// --font-text. next/font/google would fetch all ~500 JP slices on every build. Add JP slices when JA ships.
const text = localFont({
  src: [
    { path: "./fonts/biz-udpgothic-400.woff2", weight: "400" },
    { path: "./fonts/biz-udpgothic-700.woff2", weight: "700" },
  ],
  variable: "--font-biz-p",
});
const figure = localFont({
  src: [
    { path: "./fonts/biz-udgothic-400.woff2", weight: "400" },
    { path: "./fonts/biz-udgothic-700.woff2", weight: "700" },
  ],
  variable: "--font-biz-m",
});

export const metadata: Metadata = {
  title: "Besar Rachmat Ikhsan Pambudi",
  description: "Portfolio of Besar Rachmat Ikhsan Pambudi.",
};

// Runs while <head> parses, before first paint: the stored theme (src/components/shell/theme.tsx) without a
// flash, and the same HTML from the server for everyone. Fase 10's CSP must allow it (hash or nonce).
const themeScript = `try{var t=localStorage.getItem("theme");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // suppressHydrationWarning: the script above sets data-theme before React hydrates.
    <html
      lang="en"
      className={`${text.variable} ${figure.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* biome-ignore lint/security/noDangerouslySetInnerHtml: a fixed string, no user input. */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <div className="root">{children}</div>
      </body>
    </html>
  );
}
