import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GMAT Prep — Learn from every question you miss",
  description:
    "Turn every wrong answer into targeted GMAT drills. AI-powered practice that adapts to your weaknesses.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-page-gradient antialiased">{children}</body>
    </html>
  );
}
