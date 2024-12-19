import { db } from "../drizzle/db.js";
import { Users } from "../drizzle/schema.js";
import { eq } from "drizzle-orm";
import asycHandler from "express-async-handler";
import ApiError from "../utils/apiError.js";
import { UserRoles } from "../drizzle/schema.js";
import { OrderProducts } from "../drizzle/schema.js";
import { Orders } from "../drizzle/schema.js";
import { Products } from "../drizzle/schema.js";
import { desc, asc } from "drizzle-orm";


export const placeOrder = asycHandler(async (req, res, next) => {
  const { products } = req.body;
  const [newOrder] = await db
    .insert(Orders)
    .values({ user_id: req.user.id })
    .returning();

  let totalPrice = 0;
  for (const product of products) {
    const { productId, quantity } = product;

    // Check if the product exists in the Products table (optional validation)
    const existingProduct = await db
      .select({ price: Products.price })
      .from(Products)
      .where(eq(Products.id, productId));
    // .first();

    if (!existingProduct) {
      return next(
        new ApiError(`Product with ID ${productId} does not exist`, 404)
      );
    }

    // Insert the product and order association
    await db.insert(OrderProducts).values({
      order_id: newOrder.id,
      product_id: productId,
      quantity,
    });

    totalPrice += existingProduct[0].price * quantity;
  }

  res
    .json({
      orderId: newOrder.id,
      userId: req.user.id,
      products,
      totalPrice,
      createdAt: newOrder.createdAt,
    })
    .status(201);
});

export const viewOrderDetails = asycHandler(async (req, res, next) => {
  const { orderId } = req.params;

  // Fetch the order details
  const order = await db
    .select({
      id: Orders.id,
      user_id: Orders.user_id,
      createdAt: Orders.createdAt,
    })
    .from(Orders)
    .where(eq(Orders.id, orderId));

  if (!order) {
    return next(new ApiError(`Order with ID ${orderId} does not exist`, 404));
  }

  // Fetch the associated products and their quantities
  const orderProducts = await db
    .select({
      product_id: OrderProducts.product_id,
      quantity: OrderProducts.quantity,
      productName: Products.name,
      productPrice: Products.price,
    })
    .from(OrderProducts)
    .innerJoin(Products, eq(OrderProducts.product_id, Products.id))
    .where(eq(OrderProducts.order_id, orderId));

  if (!orderProducts.length) {
    return next(new ApiError(`No products found for order ID ${orderId}`, 404));
  }

  // Calculate total price
  const totalPrice = orderProducts.reduce(
    (acc, item) => acc + item.productPrice * item.quantity,
    0
  );

  // Return the order details
  res.json({
    orderId: order.id,
    userId: order.user_id,
    createdAt: order.createdAt,
    products: orderProducts.map((item) => ({
      productId: item.product_id,
      name: item.productName,
      price: item.productPrice,
      quantity: item.quantity,
      total: item.productPrice * item.quantity,
    })),
    totalPrice,
  });
});

export const deleteOrder = asycHandler(async (req, res, next) => {
  const { orderId } = req.params;

  // Fetch the order to check if it exists
  const order = await db
    .select({
      id: Orders.id,
    })
    .from(Orders)
    .where(eq(Orders.id, orderId));

  // If the order doesn't exist, throw an error
  if (!order.length) {
    return next(new ApiError(`Order with ID ${orderId} does not exist`, 404));
  }

  console.log(order);

  // Delete associated records from the OrderProducts table
  await db.delete(OrderProducts).where(eq(OrderProducts.order_id, orderId));

  // Delete the order from the Orders table
  await db.delete(Orders).where(eq(Orders.id, orderId));

  // Return a success response
  res.status(200).json({
    message: `Order with ID ${orderId} has been deleted successfully`,
  });
});


export const getAllOrders = asycHandler(async (req, res, next) => {
  // Fetch all orders sorted by created_at (oldest to newest)
  const orders = await db
    .select({
      id: Orders.id,
      user_id: Orders.user_id,
      createdAt: Orders.createdAt,
    })
    .from(Orders)
    .orderBy(asc(Orders.createdAt)); // Sort by ascending order of created_at

  if (!orders.length) {
    return next(new ApiError("No orders found", 404));
  }

  // Enrich each order with its associated products
  const enrichedOrders = await Promise.all(
    orders.map(async (order) => {
      const orderProducts = await db
        .select({
          product_id: OrderProducts.product_id,
          quantity: OrderProducts.quantity,
          productName: Products.name,
          productPrice: Products.price,
        })
        .from(OrderProducts)
        .innerJoin(Products, eq(OrderProducts.product_id, Products.id))
        .where(eq(OrderProducts.order_id, order.id));

      const totalPrice = orderProducts.reduce(
        (acc, item) => acc + item.productPrice * item.quantity,
        0
      );

      return {
        orderId: order.id,
        userId: order.user_id,
        createdAt: order.createdAt,
        products: orderProducts.map((item) => ({
          productId: item.product_id,
          name: item.productName,
          price: item.productPrice,
          quantity: item.quantity,
          total: item.productPrice * item.quantity,
        })),
        totalPrice,
      };
    })
  );

  // Respond with the enriched orders
  res.json(enrichedOrders);
});