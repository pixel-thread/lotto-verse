import { createMapCache } from "@/src/lib/cache";
import { GLOBAL_CACHE_TTL } from "@/src/lib/constant/cache";
import { logger } from "@/src/utils/logger";

type CacheData = any;

export async function createCache({
  key,
  data,
  ttl = GLOBAL_CACHE_TTL,
}: {
  key: string;
  data: CacheData;
  ttl?: number; // in milliseconds
}) {
  const now = Date.now(); // number
  const expiresAt = now + ttl; // number

  const value = {
    ...data,
    expiresAt,
  };
  return createMapCache({
    key,
    value: JSON.stringify(value),
    ttl,
  });
}
