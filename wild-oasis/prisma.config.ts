import { defineConfig } from "prisma/config";

// Prisma 7: the runtime client connects via a driver adapter (see src/lib/prisma.ts),
// but CLI commands (migrate / db push / introspect) need the datasource url here.
export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env.DATABASE_URL ?? "file:./prisma/dev.db",
  },
  migrations: {
    seed: "tsx prisma/seed.ts",
  },
});
