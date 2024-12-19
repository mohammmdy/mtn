import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { swaggerOptions } from "./swaggerOptions.js";

import userRoute from "./Routes/userRoute.js";
import authRoute from "./Routes/authRoute.js";
import productRoute from "./Routes/productRoute.js";
import orderRoute from "./Routes/orderRoute.js";
import { initializeData } from "./utils/initializeData.js";
import { globalError } from "./middlewares/errorMiddleware.js";
import ApiError from "./utils/apiError.js";

dotenv.config({ path: "config.env" });
const app = express();

// Enable logging in development NODE_ENV
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

const port = process.env.PORT || 8000;

// Generate Swagger Docs
const swaggerDocs = swaggerJsdoc(swaggerOptions);
// Swagger UI setup
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
console.log(`Swagger Docs available at http://localhost:${port}/api-docs`);

app.use(express.json());

//rate limit
const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  message:
    "to many requests from this api , please try again after five minute",
});

// Apply the rate limiting middleware to all requests.
app.use("/mtn", limiter);

app.use("/mtn/user", userRoute);
app.use("/mtn/auth", authRoute);
app.use("/mtn/product", productRoute);
app.use("/mtn/order", orderRoute);

app.all("*", (req, res, next) => {
  next(new ApiError(`can't find this route ${req.originalUrl}`, 400));
});

app.use(globalError);

app.listen(port, async () => {
  console.log(`App running on port ${port}`);
  await initializeData();
});
