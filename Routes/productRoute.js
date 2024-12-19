import express from "express";
const router = express.Router();

import {
  createProduct,
  getProductById,
  getAllProducts,
  updateProduct,
  deleteProduct,
  updateProducts,
} from "../services/productService.js";
import {
  createProductValidator,
  updateProductValidator,
  getProductValidator,
  deleteProductValidator,
} from "../utils/validators/productValidation.js";

import { protect, allowTo } from "../services/authService.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     ProductRequest:
 *       type: object
 *       required:
 *         - name
 *         - price
 *       properties:
 *         name:
 *           type: string
 *           description: Name of the product
 *           example: labtop
 *         price:
 *           type: number
 *           description: Price of the product
 *           example: 20000
 *     ProductResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Unique ID of the created product
 *           example: 846b824f-6191-4e30-a66a-44ee640639c2
 *         name:
 *           type: string
 *           description: Name of the product
 *           example: labtop
 *         price:
 *           type: number
 *           description: Price of the product
 *           example: 20000
 */

/**
 * @swagger
 * /mtn/product:
 *   post:
 *     summary: Create a new product
 *     tags: [Product]
 *     security:
 *       - bearerAuth: [] # Apply the Bearer Token here
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductRequest'
 *     responses:
 *       200:
 *         description: Product successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductResponse'
 *       403:
 *         description: Forbidden
 *       400:
 *         description: Bad request - Validation error
 *       401:
 *         description: Unauthorized
 *       429:
 *         description: to many requests
 */
router
  .route("/")
  .post(protect, allowTo("Admin"), createProductValidator, createProduct);

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Unique ID of the product
 *           example: 7c7ef23c-7296-4c29-b77d-d00c57a14121
 *         name:
 *           type: string
 *           description: Name of the product
 *           example: labtop
 *         price:
 *           type: number
 *           description: Price of the product
 *           example: 20000
 */

/**
 * @swagger
 * /mtn/product/{id}:
 *   get:
 *     summary: Get a specific product by its ID
 *     tags: [Product]
 *     security:
 *       - bearerAuth: [] # JWT Bearer Token for Authorization
 *     description: Retrieve a single product by its ID. Only users with roles "Admin" or "Customer" can access this endpoint.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Unique product ID
 *         schema:
 *           type: string
 *           example: 7c7ef23c-7296-4c29-b77d-d00c57a14121
 *     responses:
 *       200:
 *         description: Product retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Bad Request - Invalid product ID format
 *       401:
 *         description: Unauthorized - Token is missing or invalid
 *       403:
 *         description: Forbidden - User role not authorized
 *       404:
 *         description: Not Found - Product does not exist
 *       500:
 *         description: Internal Server Error
 *       429:
 *         description: to many requests
 */
router
  .route("/:id")
  .get(
    protect,
    allowTo("Admin", "Customer"),
    getProductValidator,
    getProductById
  );

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Unique ID of the product
 *           example: 846b824f-6191-4e30-a66a-44ee640639c2
 *         name:
 *           type: string
 *           description: Name of the product
 *           example: labtop
 *         price:
 *           type: number
 *           description: Price of the product
 *           example: 20000
 */

/**
 * @swagger
 * /mtn/product:
 *   get:
 *     summary: Retrieve all products (Admin and Customer access only)
 *     tags: [Product]
 *     security:
 *       - bearerAuth: [] # JWT Bearer Token for Authorization
 *     description: Retrieve all products. Only users with roles "Admin" or "Customer" are allowed to access this endpoint.
 *     responses:
 *       200:
 *         description: Successfully retrieved the list of products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       401:
 *         description: Unauthorized - Token is missing or invalid
 *       403:
 *         description: Forbidden - User role not authorized
 *       500:
 *         description: Internal Server Error
 *       429:
 *         description: to many requests
 */
router.route("/").get(protect, allowTo("Admin", "Customer"), getAllProducts);

/**
 * @swagger
 * /mtn/product/products:
 *   put:
 *     summary: Bulk update products
 *     tags: [Product]
 *     security:
 *       - bearerAuth: [] # JWT Bearer Token for Authorization
 *     description: Update multiple products in a single request. Each product must include its ID and fields to be updated.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   format: uuid
 *                   description: The ID of the product to update
 *                 name:
 *                   type: string
 *                   description: The updated name of the product
 *                 price:
 *                   type: number
 *                   format: double
 *                   description: The updated price of the product
 *     responses:
 *       200:
 *         description: Products updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       400:
 *         description: Invalid request - Missing or invalid fields
 *       404:
 *         description: No products were updated
 *       500:
 *         description: Internal Server Error
 *       429:
 *         description: to many requests
 */
router.route("/products").put(protect, allowTo("Admin"), updateProducts);

/**
 * @swagger
 * components:
 *   schemas:
 *     ProductUpdate:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: Updated name of the product
 *           example: i-phone 8
 *         price:
 *           type: number
 *           description: Updated price of the product
 *           example: 25000
 *     ProductResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Unique ID of the product
 *           example: 71acf78f-cb3f-47b6-9632-fc21812abeef
 *         name:
 *           type: string
 *           description: Name of the product
 *           example: i-phone 8
 *         price:
 *           type: number
 *           description: Price of the product
 *           example: 25000
 */

/**
 * @swagger
 * /mtn/product/{id}:
 *   put:
 *     summary: Update a specific product by its ID (name or price or both)
 *     tags: [Product]
 *     security:
 *       - bearerAuth: [] # JWT Bearer Token for Authorization
 *     description: Update a product's name or price by its ID. Only users with the "Admin" role can access this endpoint.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Unique product ID
 *         schema:
 *           type: string
 *           example: 71acf78f-cb3f-47b6-9632-fc21812abeef
 *     requestBody:
 *       required: true
 *       description: Updated product data
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductUpdate'
 *     responses:
 *       200:
 *         description: Product updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductResponse'
 *       400:
 *         description: Bad Request - Invalid input data
 *       401:
 *         description: Unauthorized - Token is missing or invalid
 *       403:
 *         description: Forbidden - User role not authorized
 *       404:
 *         description: Not Found - Product ID does not exist
 *       500:
 *         description: Internal Server Error
 *       429:
 *         description: to many requests
 */
router
  .route("/:id")
  .put(protect, allowTo("Admin"), updateProductValidator, updateProduct);

/**
 * @swagger
 * components:
 *   schemas:
 *     ProductDeleteResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Confirmation message for successful deletion
 *           example: Product deleted successfully
 *         product:
 *           type: object
 *           description: Details of the deleted product
 *           properties:
 *             id:
 *               type: string
 *               description: Unique ID of the deleted product
 *               example: 71acf78f-cb3f-47b6-9632-fc21812abeef
 *             name:
 *               type: string
 *               description: Name of the deleted product
 *               example: i-phone 8
 *             price:
 *               type: number
 *               description: Price of the deleted product
 *               example: 25000
 */

/**
 * @swagger
 * /mtn/product/{id}:
 *   delete:
 *     summary: Delete a specific product by its ID
 *     tags: [Product]
 *     security:
 *       - bearerAuth: [] # JWT Bearer Token for Authorization
 *     description: Delete a product by its ID. Only users with the "Admin" role can access this endpoint.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Unique product ID to delete
 *         schema:
 *           type: string
 *           example: 71acf78f-cb3f-47b6-9632-fc21812abeef
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductDeleteResponse'
 *       400:
 *         description: Bad Request - Invalid product ID
 *       401:
 *         description: Unauthorized - Token is missing or invalid
 *       403:
 *         description: Forbidden - User role not authorized
 *       404:
 *         description: Not Found - Product ID does not exist
 *       500:
 *         description: Internal Server Error
 *       429:
 *         description: to many requests
 */
router
  .route("/:id")
  .delete(protect, allowTo("Admin"), deleteProductValidator, deleteProduct);

export default router;
