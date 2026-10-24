import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Besar Rachmat Ikhsan Pambudi",
  description: "Portfolio of Besar Rachmat Ikhsan Pambudi.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
