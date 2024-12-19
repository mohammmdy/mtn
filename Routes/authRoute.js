import express from "express";
const router = express.Router();

import { login, refreshAccessToken } from "../services/authService.js";
import { loginValidator } from "../utils/validators/authValidation.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     LoginRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           description: User's email address
 *           example: admin@example.com
 *         password:
 *           type: string
 *           description: User's password
 *           example: admin123
 *     LoginResponse:
 *       type: object
 *       properties:
 *         msg:
 *           type: object
 *           description: User details
 *           properties:
 *             id:
 *               type: string
 *               description: Unique identifier for the user
 *               example: 12345abcde
 *             name:
 *               type: string
 *               description: Full name of the user
 *               example: John Doe
 *             email:
 *               type: string
 *               description: Email address of the user
 *               example: admin@example.com
 *             password:
 *               type: string
 *               description: Encrypted password of the user
 *               example: $2a$12$NLwvKNHhvyFwX5qCllqni.3NvauadRV1N4nv2GCf.xme6z1lRFbva
 *         accessToken:
 *           type: string
 *           description: JWT access token for authentication
 *           example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *         refreshToken:
 *           type: string
 *           description: Refresh token for renewing access
 *           example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *
 * /mtn/auth/login:
 *   post:
 *     summary: User login
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Successful login
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       400:
 *         description: Validation error (e.g., invalid email or password format)
 *       401:
 *         description: Unauthorized, invalid email or password
 *       429:
 *         description: Too many requests
 */

router.route("/login").post(loginValidator, login);

/**
 * @swagger
 * components:
 *   schemas:
 *     RefreshTokenRequest:
 *       type: object
 *       required:
 *         - refreshToken
 *       properties:
 *         refreshToken:
 *           type: string
 *           description: Valid refresh token for renewing access
 *           example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *     RefreshTokenResponse:
 *       type: object
 *       properties:
 *         accessToken:
 *           type: string
 *           description: New JWT access token for authentication
 *           example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *
 * /mtn/auth/refreshAccessToken:
 *   post:
 *     summary: Refresh access token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RefreshTokenRequest'
 *     responses:
 *       200:
 *         description: Successfully refreshed access token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RefreshTokenResponse'
 *       400:
 *         description: Invalid or missing refresh token
 *       401:
 *         description: Unauthorized, refresh token expired or invalid
 */

router.route("/refreshAccessToken").post(refreshAccessToken);

export default router;
