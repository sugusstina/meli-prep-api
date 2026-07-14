import { users } from "../data/users.js";

export function getAllUsers() {
  return users;
}

export function findUserById(id) {
  return users.find((user) => user.id === id);
}