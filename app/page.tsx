import { redirect } from "next/navigation";

/**
 * Root page — redirects to the main dashboard.
 * Unauthenticated users will be caught by middleware and sent to /login.
 */
export default function HomePage() {
  redirect("/dashboard");
}
