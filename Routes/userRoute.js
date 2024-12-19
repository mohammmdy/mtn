import express from "express";
const router = express.Router();

import {
  createUser,
  getUserById,
  getAllUsers,
  updateUser,
  deleteUser,
} from "../services/userService.js";
import {
  createUserValidator,
  updateUserValidator,
  getUserValidator,
  deleteUserValidator,
} from "../utils/validators/userValidation.js";
import { protect, allowTo } from "../services/authService.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     UserCreateRequest:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *         - passwordConfirm
 *       properties:
 *         name:
 *           type: string
 *           description: Full name of the user
 *           example: gana
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address
 *           example: gana@gmail.com
 *         password:
 *           type: string
 *           format: password
 *           description: User's password
 *           example: 1234578
 *         passwordConfirm:
 *           type: string
 *           format: password
 *           description: Confirm the user's password
 *           example: 1234578
 *
 *     UserCreateResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Unique ID of the created user
 *           example: f47ac10b-58cc-4372-a567-0e02b2c3d479
 *         name:
 *           type: string
 *           description: Full name of the created user
 *           example: gana
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address
 *           example: gana@gmail.com
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp of when the user was created
 *           example: 2024-05-18T15:45:00.000Z
 */

/**
 * @swagger
 * /mtn/user:
 *   post:
 *     summary: Create a new user (Admin only)
 *     tags: [User]
 *     security:
 *       - bearerAuth: [] # JWT Bearer Token for Authorization
 *     description: Create a new user. Only Admin users are allowed to access this endpoint.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserCreateRequest'
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserCreateResponse'
 *       400:
 *         description: Bad Request - Validation error or missing fields
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
  .post(protect, allowTo("Admin"), createUserValidator, createUser);

/**
 * @swagger
 * components:
 *   schemas:
 *     UserByIdResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Unique ID of the user
 *           example: 57ba21a6-33de-4eb1-9f21-0dd46bdd4d60
 *         name:
 *           type: string
 *           description: Full name of the user
 *           example: John Doe
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address
 *           example: johndoe@example.com
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp of when the user was created
 *           example: 2024-05-18T15:45:00.000Z
 *
 * /mtn/user/{id}:
 *   get:
 *     summary: Get user by ID (Admin only)
 *     tags: [User]
 *     security:
 *       - bearerAuth: [] # JWT Bearer Token for Authorization
 *     description: Retrieve a user by their unique ID. Only Admin users are allowed to access this endpoint.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Unique ID of the user to retrieve
 *         schema:
 *           type: string
 *           example: 57ba21a6-33de-4eb1-9f21-0dd46bdd4d60
 *     responses:
 *       200:
 *         description: Successfully retrieved the user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserByIdResponse'
 *       400:
 *         description: Bad Request - Validation error or incorrect ID format
 *       401:
 *         description: Unauthorized - Token is missing or invalid
 *       403:
 *         description: Forbidden - User role not authorized
 *       404:
 *         description: Not Found - User does not exist
 *       500:
 *         description: Internal Server Error
 *       429:
 *         description: to many requests
 */
router
  .route("/:id")
  .get(protect, allowTo("Admin"), getUserValidator, getUserById);

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Unique ID of the user
 *           example: 57ba21a6-33de-4eb1-9f21-0dd46bdd4d60
 *         name:
 *           type: string
 *           description: Full name of the user
 *           example: John Doe
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address
 *           example: johndoe@example.com
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the user was created
 *           example: 2024-05-18T15:45:00.000Z
 *
 * /mtn/user:
 *   get:
 *     summary: Get all users (Admin only)
 *     tags: [User]
 *     security:
 *       - bearerAuth: [] # JWT Bearer Token for Authorization
 *     description: Retrieve a list of all users. Only Admin users are allowed to access this endpoint.
 *     responses:
 *       200:
 *         description: Successfully retrieved all users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized - Token is missing or invalid
 *       403:
 *         description: Forbidden - User role not authorized
 *       500:
 *         description: Internal Server Error
 *       429:
 *         description: to many requests
 */
router.route("/").get(protect, allowTo("Admin"), getAllUsers);

/**
 * @swagger
 * components:
 *   schemas:
 *     UpdateUserRequest:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: Updated full name of the user
 *           example: John Doe
 *         password:
 *           type: string
 *           format: password
 *           description: New password for the user
 *           example: "12345678"
 *         passwordConfirm:
 *           type: string
 *           format: password
 *           description: Confirm the new password
 *           example: "12345678"
 *     UpdateUserResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Unique ID of the updated user
 *           example: 57ba21a6-33de-4eb1-9f21-0dd46bdd4d60
 *         name:
 *           type: string
 *           description: Updated name of the user
 *           example: John Doe
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp of when the user was last updated
 *           example: 2024-12-18T10:15:30.000Z
 *
 * /mtn/user/{id}:
 *   put:
 *     summary: Update user by ID (Admin only)(can update name or password (verify passwordConfirm) or both)
 *     tags: [User]
 *     security:
 *       - bearerAuth: [] # JWT Bearer Token for Authorization
 *     description: Update the details of a user by their unique ID. Only Admin users are allowed to perform this operation.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Unique ID of the user to update
 *         schema:
 *           type: string
 *           example: 57ba21a6-33de-4eb1-9f21-0dd46bdd4d60
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUserRequest'
 *     responses:
 *       200:
 *         description: Successfully updated the user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UpdateUserResponse'
 *       400:
 *         description: Bad Request - Validation error or incorrect input
 *       401:
 *         description: Unauthorized - Token is missing or invalid
 *       403:
 *         description: Forbidden - User role not authorized
 *       404:
 *         description: Not Found - User does not exist
 *       500:
 *         description: Internal Server Error
 *       429:
 *         description: to many requests
 */
router
  .route("/:id")
  .put(protect, allowTo("Admin"), updateUserValidator, updateUser);

/**
 * @swagger
 * /mtn/user/{id}:
 *   delete:
 *     summary: Delete a user by ID (Admin only)
 *     tags: [User]
 *     security:
 *       - bearerAuth: [] # JWT Bearer Token for Authorization
 *     description: Delete a user by their unique ID. Only Admin users are authorized to perform this operation.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique ID of the user to delete
 *         schema:
 *           type: string
 *           example: "57ba21a6-33de-4eb1-9f21-0dd46bdd4d60"
 *     responses:
 *       200:
 *         description: Successfully deleted the user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User deleted successfully"
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "57ba21a6-33de-4eb1-9f21-0dd46bdd4d60"
 *                     name:
 *                       type: string
 *                       example: momo
 *       401:
 *         description: Unauthorized - Token is missing or invalid
 *       403:
 *         description: Forbidden - User role not authorized
 *       404:
 *         description: Not Found - User does not exist
 *       500:
 *         description: Internal Server Error
 *       429:
 *         description: to many requests
 */
router
  .route("/:id")
  .delete(protect, allowTo("Admin"), deleteUserValidator, deleteUser);

export default router;
