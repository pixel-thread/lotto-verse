import { GLOBAL_CACHE_TTL } from "@/src/lib/constant/cache";
import { cachedb } from "@/src/lib/db/cache/prisma";

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

  return cachedb.cacheEntry.upsert({
    where: { key },
    create: {
      key,
      value: JSON.stringify(data),
      expiresAt, // number
      createdAt: now, // number
    },
    update: {
      value: JSON.stringify(data),
      expiresAt,
    },
  });
}
