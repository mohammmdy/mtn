import { db } from "../drizzle/db.js";
import bcrypt from "bcryptjs";
import { eq, and } from "drizzle-orm";
import { UserRoles } from "../drizzle/schema.js";
import { Users } from "../drizzle/schema.js";
import { Roles } from "../drizzle/schema.js";

// Initialization logic for roles and admin user
export const initializeData = async () => {
  try {
    // Check and Seed Roles
    const existingRoles = await db.select().from(Roles);

    if (existingRoles.length === 0) {
      await db.insert(Roles).values([
        { id: 1, name: "Admin" },
        { id: 2, name: "Customer" },
      ]);
    }
    // Hash passwords
    const adminPassword = await bcrypt.hash("admin123", 12);
    const customerPassword = await bcrypt.hash("customer123", 12);

    // Check and Seed Admin User
    const existingAdmin = await db
      .select()
      .from(Users)
      .where(eq(Users.email, "admin@example.com"));

    let admin;
    if (existingAdmin.length === 0) {
      [admin] = await db
        .insert(Users)
        .values({
          name: "Admin User",
          email: "admin@example.com",
          password: adminPassword,
        })
        .returning();
    } else {
      admin = existingAdmin[0];
    }

    // Check and Seed Customer User
    const existingCustomer = await db
      .select()
      .from(Users)
      .where(eq(Users.email, "customer@example.com"));

    let customer;
    if (existingCustomer.length === 0) {
      [customer] = await db
        .insert(Users)
        .values({
          name: "Customer User",
          email: "customer@example.com",
          password: customerPassword,
        })
        .returning();
    } else {
      customer = existingCustomer[0];
    }

    // Check and Seed UserRoles for Admin
    const adminRoleExists = await db
      .select()
      .from(UserRoles)
      .where(and(eq(UserRoles.user_id, admin.id), eq(UserRoles.role_id, 1)));

    if (adminRoleExists.length === 0) {
      await db.insert(UserRoles).values({
        user_id: admin.id,
        role_id: 1, // Admin role
      });
    }

    // Check and Seed UserRoles for Customer
    const customerRoleExists = await db
      .select()
      .from(UserRoles)
      .where(and(eq(UserRoles.user_id, customer.id), eq(UserRoles.role_id, 2)));

    if (customerRoleExists.length === 0) {
      await db.insert(UserRoles).values({
        user_id: customer.id,
        role_id: 2, // Customer role
      });
    }

    // console.log(`Initialization complete:
    //   Admin email: ${admin.email} password: admin123
    //   Customer email: ${customer.email} password: customer123`);
  } catch (error) {
    console.error("Error during initialization:", error.message);
  }
};

