import { db } from "../drizzle/db.js";
import { Users } from "../drizzle/schema.js";
import { Products } from "../drizzle/schema.js";
import { eq } from "drizzle-orm";
import asycHandler from "express-async-handler";
import ApiError from "../utils/apiError.js";
import { UserRoles } from "../drizzle/schema.js";

export const createProduct = asycHandler(async (req, res, next) => {
  const { name, price } = req.body;
  const product = await db.insert(Products).values({ name, price }).returning();

  if (!product.length) {
    return next(new ApiError("failed to create product", 400));
  }

  res.json(product[0]).status(201);
});

export const getProductById = asycHandler(async (req, res, next) => {
  const { id } = req.params;

  const product = await db.select().from(Products).where(eq(Products.id, id));

  if (!product.length) {
    return next(new ApiError(`product with ID ${id} not found`, 404));
  }

  res.status(200).json(product[0]);
});

export const getAllProducts = asycHandler(async (req, res, next) => {
  const products = await db.select().from(Products);

  res.status(200).json(products);
});

export const updateProduct = asycHandler(async (req, res, next) => {
  const { id } = req.params;

  const updatedProduct = await db
    .update(Products)
    .set(req.body)
    .where(eq(Products.id, id))
    .returning();

  if (!updatedProduct.length) {
    return next(new ApiError("failed to update user or user not found", 404));
  }

  res.json(updatedProduct[0]).status(200);
});

export const deleteProduct = asycHandler(async (req, res, next) => {
  const { id } = req.params;

  const deletedProduct = await db
    .delete(Products)
    .where(eq(Products.id, id))
    .returning();

  if (!deletedProduct.length) {
    return next(new ApiError("failed to delete user or user not found", 404));
  }

  res
    .json({ message: "User deleted successfully", user: deletedProduct[0] })
    .status(200);
});

export const updateProducts = asycHandler(async (req, res, next) => {
  const updates = req.body;

  // Validate input: Ensure it's an array of updates
  if (!Array.isArray(updates) || updates.length === 0) {
    return next(new ApiError("Invalid request: updates must be a non-empty array", 400));
  }

  // Validate that each update has an `id`
  const invalidUpdates = updates.filter((update) => !update.id);
  if (invalidUpdates.length > 0) {
    return next(new ApiError("Invalid request: each update must include a product ID", 400));
  }

  // Perform the updates
  const updatedProducts = [];
  for (const update of updates) {
    const { id, ...data } = update;

    // Update the product
    const result = await db
      .update(Products)
      .set(data)
      .where(eq(Products.id, id))
      .returning();

    if (result.length) {
      updatedProducts.push(result[0]);
    }
  }

  if (updatedProducts.length === 0) {
    return next(new ApiError("Failed to update products: no products were updated", 404));
  }

  res.json(updatedProducts).status(200);
});
