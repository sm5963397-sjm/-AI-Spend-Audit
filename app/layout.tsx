import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ??
      "https://you-are-an-expert-full-stack-omega.vercel.app"
  ),
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
