import {
  getAllUsers,
  findUserById
} from "../services/users.service.js";

import { AppError } from "../errors/AppError.js";
import { sendSuccess } from "../utils/http-response.js";

import {
  toPublicUser,
  toPublicUsers
} from "../serializers/user.serializer.js";

export async function getUsers(req, res) {
  const users = await getAllUsers();

  return sendSuccess(res, {
    data: toPublicUsers(users)
  });
}

export async function getUserById(req, res, next) {
  const { id } = req.params;

  const user = await findUserById(id);

  if (!user) {
    return next(
      new AppError(
        "User not found",
        404,
        "USER_NOT_FOUND"
      )
    );
  }

  return sendSuccess(res, {
    data: toPublicUser(user)
  });
}