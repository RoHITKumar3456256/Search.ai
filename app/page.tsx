import { redirect } from "next/navigation";

// Redirect root / to the original hand-crafted landing page
export default function HomePage() {
  redirect("/landing.html");
}
