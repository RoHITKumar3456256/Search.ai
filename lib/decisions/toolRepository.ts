import "server-only";
import { createAdminClient } from "../supabase/admin";

export interface ToolRecord {
  id: string;
  slug: string;
  name: string;
  category: string;
  description: string;
  official_url: string;
}

export async function getCandidateTools(category?: string): Promise<ToolRecord[]> {
  try {
    const supabase = createAdminClient();
    let query = supabase.from("tools").select("id, slug, name, category, description, official_url").eq("is_active", true);

    if (category) {
      query = query.eq("category", category);
    }

    const { data, error } = await query.limit(10);
    if (error || !data) return fallbackCandidateTools();
    return data as ToolRecord[];
  } catch (e) {
    return fallbackCandidateTools();
  }
}

function fallbackCandidateTools(): ToolRecord[] {
  return [
    { id: "1", slug: "dukaan", name: "Dukaan", category: "E-Commerce", description: "Zero-code Indian store builder.", official_url: "https://mydukaan.io" },
    { id: "2", slug: "woocommerce", name: "WooCommerce", category: "E-Commerce", description: "Open-source WordPress commerce plugin.", official_url: "https://woocommerce.com" },
    { id: "3", slug: "shopify", name: "Shopify", category: "E-Commerce", description: "Global commerce engine.", official_url: "https://shopify.com" }
  ];
}
