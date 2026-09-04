import "server-only";
import { createAdminClient } from "../supabase/admin";

export async function logAuditEvent(action: string, userId?: string, resourceType?: string, resourceId?: string, metadata: Record<string, any> = {}) {
  try {
    const supabase = createAdminClient();
    await supabase.from("audit_logs").insert({
      user_id: userId || null,
      action,
      resource_type: resourceType || null,
      resource_id: resourceId || null,
      metadata,
    });
  } catch (e) {
    console.warn(`[AuditLog Fallback] Action: ${action}`, { userId, metadata });
  }
}
