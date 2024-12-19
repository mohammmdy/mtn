import { validatorMiddleware } from "../../middlewares/validatorMiddleware.js";
import { check, body } from "express-validator";

export const createProductValidator = [
  check("name").notEmpty().withMessage("name required!"),
  check("price")
    .notEmpty()
    .withMessage("price required")
    .isNumeric()
    .withMessage("price should be a number!"),
  validatorMiddleware,
];
export const updateProductValidator = [
  check("id").isUUID().withMessage("invalid id"),
  check("name").optional(),
  check("price")
    .optional()
    .isNumeric()
    .withMessage("price should be a number!"),
  validatorMiddleware,
];
export const getProductValidator = [
  check("id").isUUID().withMessage("invalid id"),
  validatorMiddleware,
];
export const deleteProductValidator = [
  check("id").isUUID().withMessage("invalid id"),
  validatorMiddleware,
];
