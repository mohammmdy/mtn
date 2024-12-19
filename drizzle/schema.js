import {
  varchar,
  pgTable,
  uuid,
  integer,
  doublePrecision,
  timestamp,
  primaryKey,
} from "drizzle-orm/pg-core";

// Users Table
export const Users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).unique().notNull(),
  password: varchar("password", { length: 255 }).notNull(),
});

// Roles Table
export const Roles = pgTable("roles", {
  id: integer("id").primaryKey().notNull(),
  name: varchar("name", { length: 255 }).notNull(),
});

// UserRoles Table
export const UserRoles = pgTable(
  "user_roles",
  {
    user_id: uuid("user_id").references(() => Users.id),
    role_id: integer("role_id").references(() => Roles.id),
  },
  (table) => ({
    pk: primaryKey(table.user_id, table.role_id),
  })
);

export const Orders = pgTable("orders", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: uuid("user_id").references(() => Users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// Products Table
export const Products = pgTable("products", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }),
  price: doublePrecision("price"),
});

// OrderProducts Table
export const OrderProducts = pgTable(
  "order_products",
  {
    order_id: uuid("order_id").references(() => Orders.id),
    product_id: uuid("product_id").references(() => Products.id),
    quantity: integer("quantity").notNull(),
  },
  (table) => ({
    pk: primaryKey(table.order_id, table.product_id),
  })
);

// RefreshTokens Table
export const RefreshTokens = pgTable("refresh_tokens", {
  id: uuid("id").primaryKey().defaultRandom(), // Unique identifier for each refresh token
  user_id: uuid("user_id").references(() => Users.id).notNull(), // Foreign key to the Users table
  token: varchar("token", { length: 512 }).notNull().unique(), // Refresh token string
  created_at: timestamp("created_at").defaultNow(), // Timestamp of when the token was created
});