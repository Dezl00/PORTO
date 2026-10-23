// Per-instance backstop; use an edge/WAF rate limit as well in production.
const attempts = new Map<string, { count: number; until: number }>();
export function allowAuthAttempt(key: string) {
  const now = Date.now();
  for (const [item, value] of attempts) if (value.until <= now) attempts.delete(item);
  const current = attempts.get(key);
  if (current && current.count >= 8) return false;
  if (current) current.count++;
  else if (attempts.size < 10000) attempts.set(key, { count: 1, until: now + 15 * 60 * 1000 });
  else return false;
  return true;
}
