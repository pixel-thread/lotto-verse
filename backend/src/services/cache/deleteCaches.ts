import { deleteMapCache, startCacheCleanup } from "@/src/lib/cache";
import { EXPIRED_CACHE_TTL } from "@/src/lib/constant/cache";
import { nowMs } from "@/src/utils/helper/nowMs";

export async function deleteCache(key: string) {
  deleteMapCache({ key });
}

// Optional periodic cleanup with EXPIRED_CACHE_TTL buffer
export async function cleanupExpiredCache() {
  const cutoffMs = nowMs() - EXPIRED_CACHE_TTL; // Keep as number
  startCacheCleanup(cutoffMs);
}
