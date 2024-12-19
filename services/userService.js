import { db } from "../drizzle/db.js";
import { Users } from "../drizzle/schema.js";
import { eq } from "drizzle-orm";
import asycHandler from "express-async-handler";
import ApiError from "../utils/apiError.js";
import { UserRoles } from "../drizzle/schema.js";
import bcrypt from "bcryptjs";

export const createUser = asycHandler(async (req, res, next) => {
  let { name, email, password } = req.body;
  password = await bcrypt.hash(password, 12);
  const user = await db
    .insert(Users)
    .values({ name, email, password })
    .returning();

  if (!user.length) {
    return next(new ApiError("failed to create user", 400));
  }

  const userRole = await db
    .insert(UserRoles)
    .values({ user_id: user[0].id, role_id: 2 })
    .returning();

  res.json(user[0]).status(201);
});

export const getUserById = asycHandler(async (req, res, next) => {
  const { id } = req.params;

  const user = await db.select().from(Users).where(eq(Users.id, id));

  if (!user.length) {
    return next(new ApiError(`User with ID ${id} not found`, 404));
  }

  res.status(200).json(user[0]);
});

export const getAllUsers = asycHandler(async (req, res, next) => {
  const users = await db.select().from(Users);

  res.status(200).json(users);
});

export const updateUser = asycHandler(async (req, res, next) => {
  const { id } = req.params;
  if (req.body.password) {
    req.body.password = await bcrypt.hash(req.body.password, 12);
  }

  const updatedUser = await db
    .update(Users)
    .set(req.body)
    .where(eq(Users.id, id))
    .returning();

  if (!updatedUser.length) {
    return next(new ApiError("failed to update user or user not found", 404));
  }

  res.json(updatedUser[0]).status(201);
});

export const deleteUser = asycHandler(async (req, res, next) => {
  const { id } = req.params;

  const userRole = await db
    .delete(UserRoles)
    .where(eq(UserRoles.user_id, id))
    .returning();

  const deletedUser = await db
    .delete(Users)
    .where(eq(Users.id, id))
    .returning();

  if (!deletedUser.length) {
    return next(new ApiError("failed to delete user or user not found", 404));
  }

  res
    .json({ message: "User deleted successfully", user: deletedUser[0] })
    .status(200);
});
