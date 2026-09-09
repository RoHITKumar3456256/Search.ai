import type { Metadata } from "next";
import { Inter } from "next/font/google";
import PostHogProvider from "@/components/providers/PostHogProvider";
import "@/css/globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Search.ai — Decision Intelligence Platform",
  description:
    "Turn uncertainty into your next best move. Evidence-grounded AI decision briefs for founders, students, and freelancers.",
  keywords: ["AI", "decision making", "research", "decision intelligence", "search AI"],
  authors: [{ name: "Search.ai" }],
  openGraph: {
    title: "Search.ai — Decision Intelligence Platform",
    description: "Evidence-grounded AI decision briefs.",
    type: "website",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://search-ai.vercel.app",
  },
  twitter: {
    card: "summary_large_image",
    title: "Search.ai — Decision Intelligence Platform",
    description: "Evidence-grounded AI decision briefs.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <PostHogProvider>{children}</PostHogProvider>
      </body>
    </html>
  );
}
