import { PrismaClient as CacheClient } from "./gen/cache";

const globalForCache = globalThis as unknown as {
  cachedb: CacheClient | undefined;
};

export const cachedb =
  globalForCache.cachedb ??
  new CacheClient({
    log:
      process.env.NODE_ENV === "production"
        ? ["error"]
        : ["error", "info", "warn"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForCache.cachedb = cachedb;
}
