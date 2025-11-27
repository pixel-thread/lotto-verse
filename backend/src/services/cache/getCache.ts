import { deleteMapCache, getMapCache } from "@/src/lib/cache";
import { CacheValue } from "@/src/types/cache";
import { nowMs } from "@/src/utils/helper/nowMs";
import { logger } from "@/src/utils/logger";

export async function getCache<T = CacheValue>({
  key,
}: {
  key: string;
}): Promise<T | null> {
  const entry = getMapCache({ key });

  if (!entry) return null;

  const now = BigInt(nowMs());

  if (entry.expiresAt !== null && entry.expiresAt <= now) {
    // Soft-delete expired entries and return null
    deleteMapCache({ key });
    return null;
  }

  try {
    logger.log("Cache hit", { key });
    return JSON.parse(entry.value) as T;
  } catch {
    return null;
  }
}
