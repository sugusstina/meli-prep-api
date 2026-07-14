import { getAllUsers } from "../services/users.service.js";
import { sendSuccess } from "../utils/http-response.js";

export function getUsers(req, res) {
  const users = getAllUsers();

  return sendSuccess(res, {
    data: users
  });
}