import { config } from "dotenv";
import { defineConfig } from "prisma/config";

// Next.js uses .env.local in development; load the same values for Prisma CLI.
config({ path: ".env.local", quiet: true });
config({ path: ".env", quiet: true });

/**
 * Prisma CLI uses the direct Neon URL when it is available. The app itself
 * uses DATABASE_URL (the pooled Neon URL) through the Neon driver adapter.
 */
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url:
      process.env.DIRECT_URL ??
      process.env.DATABASE_URL ??
      "postgresql://postgres:postgres@localhost:5432/shobaky_studio?schema=public",
  },
});
