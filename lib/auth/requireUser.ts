import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "../supabase/server";

export async function requireUser() {
  const supabase = createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login");
  }

  return user;
}
