import { defineConfig, env } from "prisma/config";
import "dotenv/config";

export default defineConfig({
  schema: "./src/lib/db/prisma/schema.prisma",
  engine: "classic",
  migrations: {
    path: "./src/lib/db/prisma/migrations/",
  },
  datasource: {
    url: env("DATABASE_URL"),
    directUrl: env("DIRECT_URL"),
  },
});
