import { validatorMiddleware } from "../../middlewares/validatorMiddleware.js";
import { check, body } from "express-validator";
import { Users } from "../../drizzle/schema.js";
import { db } from "../../drizzle/db.js";
import { eq } from "drizzle-orm";

export const loginValidator = [
  check("password").notEmpty().withMessage("password required!"),
  check("email").notEmpty().withMessage("email required"),
  validatorMiddleware,
];
