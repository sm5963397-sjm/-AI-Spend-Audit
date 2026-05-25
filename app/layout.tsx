import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Credex AI Spend Audit",
  description: "Audit AI seat, plan, and API spend before another month renews."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
