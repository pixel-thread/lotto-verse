import { cachedb } from "@/src/lib/db/cache/prisma";
import { CacheValue } from "@/src/types/cache";
import { nowMs } from "@/src/utils/helper/nowMs";

export async function getCache<T = CacheValue>({
  key,
}: {
  key: string;
}): Promise<T | null> {
  const entry = await cachedb.cacheEntry.findUnique({
    where: { key },
  });

  if (!entry) return null;

  const now = BigInt(nowMs());

  if (entry.expiresAt !== null && entry.expiresAt <= now) {
    // Soft-delete expired entries and return null
    await cachedb.cacheEntry.delete({ where: { key } });
    return null;
  }

  try {
    console.log("CACHE HIT");
    return JSON.parse(entry.value) as T;
  } catch {
    return null;
  }
}
