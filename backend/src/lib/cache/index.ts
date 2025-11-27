// src/lib/cache/cache.ts

export type CacheMap = {
  id: string; // unique identifier
  key: string; // cache key
  value: any; // cached value
  expiresAt?: number; // timestamp in ms when entry expires
};

// In-memory Map to store cache entries
export const cacheMap: Map<string, CacheMap> = new Map();

/**
 * Get a cache entry by key.
 * Returns undefined if not found or expired.
 */
export function getMapCache({ key }: { key: string }): any | undefined {
  const entry = cacheMap.get(key);
  if (!entry) return undefined;

  // Check expiration
  if (entry.expiresAt && entry.expiresAt < Date.now()) {
    cacheMap.delete(key); // auto-clean expired entry
    return undefined;
  }

  return entry.value;
}

/**
 * Create or update a cache entry.
 * @param key Cache key
 * @param value Value to store
 * @param ttl Optional time-to-live in milliseconds
 */
export function createMapCache({
  key,
  value,
  ttl,
}: {
  key: string;
  value: any;
  ttl?: number;
}) {
  const expiresAt = ttl ? Date.now() + ttl : undefined;

  const entry: CacheMap = {
    id: crypto.randomUUID(),
    key,
    value,
    expiresAt,
  };

  cacheMap.set(key, entry);
}

/**
 * Delete a cache entry by key.
 */
export function deleteMapCache({ key }: { key: string }) {
  cacheMap.delete(key);
}

/**
 * Clear all cache entries
 */
export function clearCache() {
  cacheMap.clear();
}

/**
 * Cleanup expired entries from the cache.
 * @param interval Cleanup interval in milliseconds (default 1 minute)
 */
export function startCacheCleanup(interval: number = 60_000) {
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of cacheMap.entries()) {
      if (entry.expiresAt && entry.expiresAt < now) {
        cacheMap.delete(key);
      }
    }
  }, interval);
}

// Optionally start cleanup automatically
startCacheCleanup();
