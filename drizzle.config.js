import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./drizzle/schema.js",
  out: "./drizzle/migrations",
  dialect: "postgresql",
  dbCredentials: {
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "135710",
    database: process.env.DB_NAME || "mtn",
    port: Number(process.env.DB_PORT) || 5432,
    ssl: false,
  },
  verbose: true,
  strict: true,
});
