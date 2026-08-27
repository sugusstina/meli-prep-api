import { beforeEach } from "vitest";

import { prisma } from "../../src/db/prisma.js";

beforeEach(async () => {
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  await prisma.product.create({
    data: {
      id: "prod_1",
      name: "Wireless Mouse",
      price: 25,
      stock: 15
    }
  });

  await prisma.product.create({
    data: {
      id: "prod_2",
      name: "Mechanical Keyboard",
      price: 80,
      stock: 10
    }
  });

  await prisma.product.create({
    data: {
      id: "prod_3",
      name: "USB-C Hub",
      price: 45,
      stock: 8
    }
  });
});