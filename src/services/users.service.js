import { users } from "../data/users.js";

export function getAllUsers() {
  return users;
}

export function findUserById(id) {
  return users.find((user) => user.id === id);
}

export function findUserByEmail(email) {
  return users.find((user) => user.email === email);
}

export function createUser({
  name,
  email,
  passwordHash,
  role = "customer"
}) {
  const newUser = {
    id: `user_${Date.now()}`,
    name,
    email,
    passwordHash,
    role,
    internalNotes: "",
    createdAt: new Date().toISOString()
  };

  users.push(newUser);

  return newUser;
}