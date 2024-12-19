import express from "express";
const router = express.Router();

import {
  placeOrder,
  viewOrderDetails,
  deleteOrder,
  getAllOrders,
} from "../services/orderService.js";
import {
  placeOrderValidator,
  viewOrderValidator,
  deleteOrderValidator,
} from "../utils/validators/orderValidation.js";
import { protect, allowTo } from "../services/authService.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateOrderRequest:
 *       type: object
 *       required:
 *         - products
 *       properties:
 *         products:
 *           type: array
 *           description: List of products to order
 *           items:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *                 format: uuid
 *                 description: Unique ID of the product
 *                 example: 7c7ef23c-7296-4c29-b77d-d00c57a14121
 *               quantity:
 *                 type: integer
 *                 description: Quantity of the product
 *                 example: 2
 *     CreateOrderResponse:
 *       type: object
 *       properties:
 *         orderId:
 *           type: string
 *           format: uuid
 *           description: Unique ID of the created order
 *           example: 4254ec02-96ef-4d02-ac35-7c77a7bb40ce
 *         userId:
 *           type: string
 *           format: uuid
 *           description: Unique ID of the user who created the order
 *           example: 3d433266-af1a-4346-8f78-9743d6c93f47
 *         products:
 *           type: array
 *           description: List of ordered products
 *           items:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *                 format: uuid
 *                 description: Unique ID of the product
 *                 example: 7c7ef23c-7296-4c29-b77d-d00c57a14121
 *               quantity:
 *                 type: integer
 *                 description: Ordered quantity
 *                 example: 2
 *         totalPrice:
 *           type: number
 *           description: Total price of the order
 *           example: 100309
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp of when the order was created
 *           example: 2024-12-18T15:55:54.238Z
 *
 * /mtn/order:
 *   post:
 *     summary: Create a new order
 *     tags: [Order]
 *     security:
 *       - bearerAuth: [] # JWT Bearer Token for Authorization
 *     description: Create a new order for authenticated customers.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateOrderRequest'
 *     responses:
 *       201:
 *         description: Successfully created the order
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CreateOrderResponse'
 *       400:
 *         description: Bad Request - Validation error or incorrect input
 *       401:
 *         description: Unauthorized - Token is missing or invalid
 *       403:
 *         description: Forbidden - User role not authorized
 *       500:
 *         description: Internal Server Error
 *       429:
 *         description: to many requests
 */
router
  .route("/")
  .post(protect, allowTo("Customer"), placeOrderValidator, placeOrder);

/**
 * @swagger
 * components:
 *   schemas:
 *     GetOrderResponse:
 *       type: object
 *       properties:
 *         orderId:
 *           type: string
 *           format: uuid
 *           description: Unique ID of the order
 *           example: ca86a131-8bda-44e7-99e5-64a704d0e8a6
 *         userId:
 *           type: string
 *           format: uuid
 *           description: Unique ID of the user who created the order
 *           example: 3d433266-af1a-4346-8f78-9743d6c93f47
 *         products:
 *           type: array
 *           description: List of products in the order
 *           items:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *                 format: uuid
 *                 description: Unique ID of the product
 *                 example: 7c7ef23c-7296-4c29-b77d-d00c57a14121
 *               quantity:
 *                 type: integer
 *                 description: Quantity of the product
 *                 example: 2
 *         totalPrice:
 *           type: number
 *           description: Total price of the order
 *           example: 309.50
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the order was created
 *           example: 2024-12-18T15:55:54.238Z
 *
 * /mtn/order/{orderId}:
 *   get:
 *     summary: Get order details
 *     tags: [Order]
 *     security:
 *       - bearerAuth: [] # JWT Bearer Token for Authorization
 *     description: Retrieve the details of an order by its ID. Accessible to Admin(any order) and Customer roles(their orders only).
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The unique ID of the order to retrieve
 *     responses:
 *       200:
 *         description: Successfully retrieved the order details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GetOrderResponse'
 *       401:
 *         description: Unauthorized - Token is missing or invalid
 *       403:
 *         description: Forbidden - User role not authorized
 *       404:
 *         description: Not Found - Order does not exist
 *       500:
 *         description: Internal Server Error
 *       429:
 *         description: to many requests
 */

router
  .route("/:orderId")
  .get(
    protect,
    allowTo("Admin", "Customer"),
    viewOrderValidator,
    viewOrderDetails
  );
/**
 * @swagger
 * components:
 *   schemas:
 *     DeleteOrderResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Success message confirming the order deletion
 *           example: Order deleted successfully
 *
 * /mtn/order/{orderId}:
 *   delete:
 *     summary: Delete an order
 *     tags: [Order]
 *     security:
 *       - bearerAuth: [] # JWT Bearer Token for Authorization
 *     description: Delete an existing order by its ID. Only accessible to Admin users.
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The unique ID of the order to delete
 *     responses:
 *       200:
 *         description: Successfully deleted the order
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DeleteOrderResponse'
 *       401:
 *         description: Unauthorized - Token is missing or invalid
 *       403:
 *         description: Forbidden - User role not authorized
 *       404:
 *         description: Not Found - Order does not exist
 *       500:
 *         description: Internal Server Error
 *       429:
 *         description: to many requests
 */

router
  .route("/:orderId")
  .delete(protect, allowTo("Admin"), deleteOrderValidator, deleteOrder);

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         productId:
 *           type: string
 *           format: uuid
 *           description: The unique ID of the product
 *         name:
 *           type: string
 *           description: Name of the product
 *         price:
 *           type: number
 *           format: double
 *           description: Price of the product
 *         quantity:
 *           type: integer
 *           description: Quantity of the product in the order
 *         total:
 *           type: number
 *           format: double
 *           description: Total cost of the product (price * quantity)
 *     Order:
 *       type: object
 *       properties:
 *         orderId:
 *           type: string
 *           format: uuid
 *           description: The unique ID of the order
 *         userId:
 *           type: string
 *           format: uuid
 *           description: The ID of the user who placed the order
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the order was created
 *         products:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Product'
 *         totalPrice:
 *           type: number
 *           format: double
 *           description: The total price of the order
 *
 * /mtn/order:
 *   get:
 *     summary: Get all orders
 *     tags: [Order]
 *     security:
 *       - bearerAuth: [] # JWT Bearer Token for Authorization
 *     description: Fetch all orders sorted by creation time (oldest to newest). Accessible to Admin users.
 *     responses:
 *       200:
 *         description: A list of all orders
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *       401:
 *         description: Unauthorized - Token is missing or invalid
 *       403:
 *         description: Forbidden - User role not authorized
 *       404:
 *         description: Not Found - No orders found
 *       500:
 *         description: Internal Server Error
 *       429:
 *         description: to many requests
 */

router.route("/").get(protect, allowTo("Admin"), getAllOrders);

export default router;
