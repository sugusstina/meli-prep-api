import { prisma } from "../db/prisma.js";

export async function getAllUsers() {
  return prisma.user.findMany();
}

export async function findUserById(id) {
  return prisma.user.findUnique({
    where: {
      id
    }
  });
}

export async function findUserByEmail(email) {
  return prisma.user.findUnique({
    where: {
      email
    }
  });
}

export async function createUser({
  name,
  email,
  passwordHash,
  role = "customer"
}) {
  return prisma.user.create({
    data: {
      id: `user_${Date.now()}`,
      name,
      email,
      passwordHash,
      role
    }
  });
}