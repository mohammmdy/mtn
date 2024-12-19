import { drizzle } from "drizzle-orm/node-postgres";
import pkg from "pg";
const { Pool } = pkg;
import * as schema from "./schema.js";

import dotenv from "dotenv";

dotenv.config({ path: "./config.env" });

const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "135710",
  database: process.env.DB_NAME || "mtn",
  port: Number(process.env.DB_PORT) || 5432,
});

export const db = drizzle(pool, { schema, logger: false });
