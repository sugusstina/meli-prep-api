import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  const adminPasswordHash = await bcrypt.hash(
    "Admin123!",
    10
  );

  const customerPasswordHash = await bcrypt.hash(
    "Customer123!",
    10
  );

  const admin = await prisma.user.upsert({
    where: {
      email: "admin@meli-prep.com",
    },

    update: {},

    create: {
      id: "user-admin",
      name: "Admin",
      email: "admin@meli-prep.com",
      passwordHash: adminPasswordHash,
      role: "admin",
      internalNotes: "Seed admin user",
    },
  });

  console.log("👤 Admin ready:", admin.email);

  await prisma.user.upsert({
    where: {
      email: "agus@example.com",
    },

    update: {},

    create: {
      id: "user-customer-1",
      name: "Agustina",
      email: "agus@example.com",
      passwordHash: customerPasswordHash,
      role: "customer",
    },
  });

  const products = [
    {
      id: "product-1",
      name: "Mechanical Keyboard",
      price: 120,
      stock: 10,
    },
    {
      id: "product-2",
      name: "Wireless Mouse",
      price: 60,
      stock: 25,
    },
    {
      id: "product-3",
      name: "USB-C Hub",
      price: 80,
      stock: 15,
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: {
        id: product.id,
      },

      update: product,
      create: product,
    });
  }

  console.log(`📦 ${products.length} products ready`);
  console.log("✅ Database seeded successfully");
}

main()
  .catch((error) => {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });