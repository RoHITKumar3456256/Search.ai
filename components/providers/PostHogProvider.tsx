"use client";

import React, { useEffect } from "react";

export default function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    if (posthogKey && typeof window !== "undefined") {
      console.log("PostHog Analytics initialized");
    }
  }, []);

  return <>{children}</>;
}
