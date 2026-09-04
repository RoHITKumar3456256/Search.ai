import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { env } from "../env";

export function createAdminClient() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY environment variable is required to execute service role operations.");
  }

  return createSupabaseClient(
    env.client.NEXT_PUBLIC_SUPABASE_URL,
    serviceKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
