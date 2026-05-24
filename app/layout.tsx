import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ascend — The smartest way to study for the GMAT",
  description:
    "AI-powered GMAT drills that adapt to your weak spots. Start fresh or log your mistakes — Ascend builds the perfect practice session either way.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-page-gradient antialiased">{children}</body>
    </html>
  );
}
