import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? "file:./prisma/dev.db",
});
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.cabin.upsert({
    where: { name: "001" },
    update: {},
    create: {
      description: "first cabin",
      name: "001",
      maxCapacity: 4,
      regularPrice: 300,
      discount: 200,
      // image is Bytes? in the schema; a string path is invalid and the app
      // treats an absent image as "no image", so it's omitted here.
    },
  });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
