import { validatorMiddleware } from "../../middlewares/validatorMiddleware.js";
import { check, body } from "express-validator";
import { Users } from "../../drizzle/schema.js";
import { Orders } from "../../drizzle/schema.js";

import { Products } from "../../drizzle/schema.js";
import { db } from "../../drizzle/db.js";
import { eq, and } from "drizzle-orm";
const uuidRegex =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const placeOrderValidator = [
  check("products")
    .notEmpty()
    .withMessage("products required")
    .isArray()
    .withMessage("products must be an array")
    .custom(async (val) => {
      for (const product of val) {
        const { productId } = product;
        // Validate if productId is a UUID
        if (!uuidRegex.test(productId)) {
          throw new Error(`Product ID ${productId} is not a valid UUID`);
        }
        const productExists = await db
          .select()
          .from(Products)
          .where(eq(Products.id, productId));

        if (!productExists.length) {
          throw new Error(`Product with ID ${productId} not found`);
        }
      }
      return true; // All products exist
    }),

  validatorMiddleware,
];

export const viewOrderValidator = [
  check("orderId")
    .isUUID()
    .withMessage("Invalid order ID format")
    .bail() // Stop further validation if this check fails
    .custom(async (val, { req }) => {
      // Check if the user is a Customer
      if (req.user.role.includes("Customer")) {
        // Query orders for the customer
        const order = await db
          .select({ id: Orders.id })
          .from(Orders)
          .where(
            and(
              eq(Orders.id, val), // Check for the requested order
              eq(Orders.user_id, req.user.id) // Ensure the order belongs to the customer
            )
          );

        // If the order is not found or does not belong to the customer, throw an error
        if (!order.length) {
          throw new Error(
            "You are a Customer and are not allowed to view orders that are not yours"
          );
        }
      }
      return true;
    }),
  validatorMiddleware,
];

export const deleteOrderValidator = [
  check("orderId").isUUID().withMessage("invalid id"),
  validatorMiddleware,
];
