import "dotenv/config";

import { prisma } from "../src/db/prisma.js";

async function main() {
  const usersCount = await prisma.user.count();
  const productsCount = await prisma.product.count();
  const ordersCount = await prisma.order.count();

  console.log("Database connection OK");
  console.log({
    usersCount,
    productsCount,
    ordersCount
  });
}

main()
  .catch((error) => {
    console.error("Database connection failed");
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });