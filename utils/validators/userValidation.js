import { validatorMiddleware } from "../../middlewares/validatorMiddleware.js";
import { check, body } from "express-validator";
import { Users } from "../../drizzle/schema.js";
import { db } from "../../drizzle/db.js";
import { eq } from "drizzle-orm";

export const createUserValidator = [
  check("name")
    .notEmpty()
    .withMessage("User name required")
    .isLength({ min: 3 })
    .withMessage("Too short User name"),
  check("email")
    .notEmpty()
    .withMessage("email required")
    .isEmail()
    .withMessage("enter valid email ")
    .custom(async (val) => {
      const user = await db.select().from(Users).where(eq(Users.email, val));
      if (user.length > 0) {
        throw new Error("there is user with this email !");
      }
      return true;
    }),
  check("passwordConfirm")
    .notEmpty()
    .withMessage("passwordConfirm required")
    .custom((val, { req }) => {
      if (val != req.body.password) {
        throw new Error("this passwordConfirm not match with password");
      }
      return true;
    }),
  check("password")
    .notEmpty()
    .withMessage("password required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  validatorMiddleware,
];
export const updateUserValidator = [
  check("id").isUUID().withMessage("invalid id"),
  check("name")
    .optional()
    .isLength({ min: 3 })
    .withMessage("Too short User name"),
  check("password")
    .optional()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters")
    .custom((val, { req }) => {
      if (val != req.body.passwordConfirm) {
        throw new Error("this passwordConfirm not match with password");
      }
      return true;
    }),
  validatorMiddleware,
];
export const deleteUserValidator = [
  check("id").isUUID().withMessage("invalid id"),
  validatorMiddleware,
];
export const getUserValidator = [
  check("id").isUUID().withMessage("invalid id"),
  validatorMiddleware,
];
