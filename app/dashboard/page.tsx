"use client";

import React from "react";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { isMockMode } from "@/lib/env";

export default function DashboardPage() {
  return <DashboardShell isMock={isMockMode} />;
}
