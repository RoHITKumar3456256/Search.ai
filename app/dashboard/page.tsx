import React from "react";
import DashboardShell from "@/components/dashboard/DashboardShell";

// Server Component — reads env vars server-side, passes down as props
export default function DashboardPage() {
  const isMock = !process.env.GOOGLE_GENERATIVE_AI_API_KEY &&
                 !process.env.GROQ_API_KEY &&
                 !process.env.OPENROUTER_API_KEY;

  return <DashboardShell isMock={isMock} />;
}
