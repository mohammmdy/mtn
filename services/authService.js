import asyncHandler from "express-async-handler";
import ApiError from "../utils/apiError.js";
import jwt from "jsonwebtoken";
import { db } from "../drizzle/db.js";
import { Users } from "../drizzle/schema.js";
import { Roles } from "../drizzle/schema.js";
import { UserRoles } from "../drizzle/schema.js";
import { RefreshTokens } from "../drizzle/schema.js";
import { eq } from "drizzle-orm";
import { inArray } from "drizzle-orm";
import { jwtMaker, jwtRefreshMaker } from "../utils/jwt.js";
import bcrypt from "bcryptjs";

export const protect = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) return next(new ApiError("please login first", 401));

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const currentUser = await db
      .select()
      .from(Users)
      .where(eq(Users.id, decoded.userId));
    if (!currentUser) {
      return next(new ApiError("there is no user", 401));
    }

    req.user = currentUser[0];
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return next(new ApiError("Token expired, please refresh", 401));
    }
    return next(new ApiError("Invalid token", 401));
  }
});

export const allowTo = (...roles) => {
  return asyncHandler(async (req, res, next) => {
    const userId = req.user.id;

    // Fetch the user's role IDs from the user_roles table
    const userRoles = await db
      .select({ role_id: UserRoles.role_id })
      .from(UserRoles)
      .where(eq(UserRoles.user_id, userId));

    if (!userRoles.length) {
      return next(new ApiError("User roles not found!", 403));
    }

    // Fetch the role names for these IDs from the roles table
    const roleIds = userRoles.map((ur) => ur.role_id);
    const roleNames = await db
      .select({ name: Roles.name })
      .from(Roles)
      .where(inArray(Roles.id, roleIds));

    const userRoleNames = roleNames.map((r) => r.name);

    req.user.role = userRoleNames;

    // Check if any of the user's roles match the allowed roles
    const isAllowed = roles.some((role) => userRoleNames.includes(role));

    if (!isAllowed) {
      return next(new ApiError("You are not allowed!", 403));
    }

    next();
  });
};

export const login = asyncHandler(async (req, res, next) => {
  const { password, email } = req.body;
  const user = await db.select().from(Users).where(eq(Users.email, email));

  if (!user.length) {
    return next(new ApiError(`User with email: ${email} not found`, 401));
  }
  if (!(await bcrypt.compare(password, user[0].password))) {
    return next(new ApiError(`password incorrect`, 404));
  }

  const accessToken = jwtMaker(user[0].id);
  const refreshToken = jwtRefreshMaker(user[0].id);

  // Store refresh token in the database
  await db.insert(RefreshTokens).values({
    user_id: user[0].id,
    token: refreshToken,
  });

  res.status(200).json({ msg: user[0], accessToken, refreshToken });
});

export const refreshAccessToken = asyncHandler(async (req, res, next) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return next(new ApiError("Refresh token is required", 400));
  }

  const storedToken = await db
    .select()
    .from(RefreshTokens)
    .where(eq(RefreshTokens.token, refreshToken));


  if (!storedToken.length) {
    return next(new ApiError("Invalid refresh token", 403));
  }

  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET_KEY
    );

    // Generate a new access token
    const newAccessToken = jwtMaker(decoded.userId);

    res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    return next(new ApiError("Invalid or expired refresh token", 403));
  }
});
