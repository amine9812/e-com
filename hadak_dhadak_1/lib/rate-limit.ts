type RateRecord = { count: number; windowStart: number };

const WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS = 10;
const buckets = new Map<string, RateRecord>();

export function rateLimit(key: string) {
  const now = Date.now();
  const current = buckets.get(key);
  if (!current) {
    buckets.set(key, { count: 1, windowStart: now });
    return { success: true };
  }
  if (now - current.windowStart > WINDOW_MS) {
    buckets.set(key, { count: 1, windowStart: now });
    return { success: true };
  }
  if (current.count >= MAX_REQUESTS) {
    return { success: false };
  }
  current.count += 1;
  buckets.set(key, current);
  return { success: true };
}
