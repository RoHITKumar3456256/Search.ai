// In-memory fallback rate limiter for local development
const memoryStore = new Map<string, { count: number; expiresAt: number }>();

export async function rateLimit(identifier: string, limit: number = 15, windowMs: number = 60000): Promise<{ success: boolean; remaining: number }> {
  const upstashUrl = process.env.UPSTASH_REDIS_REST_URL;
  const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (upstashUrl && upstashToken) {
    try {
      // Upstash REST API call
      const res = await fetch(`${upstashUrl}/pipeline`, {
        method: "POST",
        headers: { Authorization: `Bearer ${upstashToken}` },
        body: JSON.stringify([["INCR", identifier], ["EXPIRE", identifier, Math.ceil(windowMs / 1000)]])
      });
      if (res.ok) {
        const data = await res.json();
        const currentCount = data[0]?.result || 1;
        return { success: currentCount <= limit, remaining: Math.max(0, limit - currentCount) };
      }
    } catch (e) {
      console.warn("Upstash Redis rate limiter error, using memory fallback", e);
    }
  }

  // Memory Fallback
  const now = Date.now();
  const entry = memoryStore.get(identifier);

  if (!entry || entry.expiresAt < now) {
    memoryStore.set(identifier, { count: 1, expiresAt: now + windowMs });
    return { success: true, remaining: limit - 1 };
  }

  entry.count += 1;
  memoryStore.set(identifier, entry);

  return {
    success: entry.count <= limit,
    remaining: Math.max(0, limit - entry.count),
  };
}
