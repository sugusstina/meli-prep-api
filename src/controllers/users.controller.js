import { getAllUsers } from "../services/users.service.js";

export function getUsers(req, res) {
  const users = getAllUsers();

  res.status(200).json({
    data: users,
    error: null
  });
}