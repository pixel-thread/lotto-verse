import { defineConfig, env } from "prisma/config";
import "dotenv/config";

export default defineConfig({
  schema: "./src/lib/db/prisma/schema.prisma",
  migrations: {
    path: "./src/lib/db/prisma/migrations",
  },

  engine: "classic",
  datasource: {
    url: env("DATABASE_URL"),
  },
});
