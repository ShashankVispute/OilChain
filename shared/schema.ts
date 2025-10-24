import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, decimal, boolean, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("farmer"), // farmer, processor, buyer, exporter, admin
  fullName: text("full_name").notNull(),
  location: text("location"),
  phone: text("phone"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Products table
export const products = pgTable("products", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sellerId: varchar("seller_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  byproductType: text("byproduct_type").notNull(), // soymeal, sunflower_cake, cottonseed_cake, husk, etc
  quantity: integer("quantity").notNull(), // in kg
  pricePerKg: decimal("price_per_kg", { precision: 10, scale: 2 }).notNull(),
  qualityGrade: text("quality_grade").notNull(), // A+, A, B, C
  qualityMetrics: jsonb("quality_metrics").notNull(), // {moisture: 12, protein: 45, purity: 98}
  location: text("location").notNull(),
  description: text("description"),
  certifications: text("certifications").array(),
  availableForExport: boolean("available_for_export").default(false),
  status: text("status").notNull().default("active"), // active, sold, reserved
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Transactions table
export const transactions = pgTable("transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  productId: varchar("product_id").notNull().references(() => products.id),
  buyerId: varchar("buyer_id").notNull().references(() => users.id),
  sellerId: varchar("seller_id").notNull().references(() => users.id),
  quantity: integer("quantity").notNull(),
  totalPrice: decimal("total_price", { precision: 12, scale: 2 }).notNull(),
  status: text("status").notNull().default("pending"), // pending, verified, completed, disputed
  smartContractHash: text("smart_contract_hash"),
  deliveryTerms: text("delivery_terms"),
  paymentTerms: text("payment_terms"),
  carbonCredits: decimal("carbon_credits", { precision: 8, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
});

// IoT Devices table
export const iotDevices = pgTable("iot_devices", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  deviceName: text("device_name").notNull(),
  deviceType: text("device_type").notNull(), // moisture_sensor, weight_scale, temperature_sensor
  location: text("location").notNull(),
  status: text("status").notNull().default("active"), // active, inactive, maintenance
  lastReading: jsonb("last_reading"), // {value: 12.5, unit: '%', timestamp: '...'}
  batteryLevel: integer("battery_level"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Price predictions table
export const pricePredictions = pgTable("price_predictions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  byproductType: text("byproduct_type").notNull(),
  currentPrice: decimal("current_price", { precision: 10, scale: 2 }).notNull(),
  predictedPrice: decimal("predicted_price", { precision: 10, scale: 2 }).notNull(),
  predictionDate: timestamp("prediction_date").notNull(),
  confidence: decimal("confidence", { precision: 5, scale: 2 }).notNull(),
  factors: jsonb("factors"), // {demand: 'high', supply: 'low', seasonality: 'peak'}
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Export opportunities table
export const exportOpportunities = pgTable("export_opportunities", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  byproductType: text("byproduct_type").notNull(),
  targetCountry: text("target_country").notNull(),
  demandLevel: text("demand_level").notNull(), // high, medium, low
  matchScore: integer("match_score").notNull(), // 0-100
  priceRange: text("price_range"),
  minimumQuantity: integer("minimum_quantity"),
  requirements: jsonb("requirements"),
  contactInfo: text("contact_info"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  products: many(products),
  iotDevices: many(iotDevices),
  purchasedTransactions: many(transactions, { relationName: "buyer" }),
  soldTransactions: many(transactions, { relationName: "seller" }),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  seller: one(users, {
    fields: [products.sellerId],
    references: [users.id],
  }),
  transactions: many(transactions),
}));

export const transactionsRelations = relations(transactions, ({ one }) => ({
  product: one(products, {
    fields: [transactions.productId],
    references: [products.id],
  }),
  buyer: one(users, {
    fields: [transactions.buyerId],
    references: [users.id],
    relationName: "buyer",
  }),
  seller: one(users, {
    fields: [transactions.sellerId],
    references: [users.id],
    relationName: "seller",
  }),
}));

export const iotDevicesRelations = relations(iotDevices, ({ one }) => ({
  user: one(users, {
    fields: [iotDevices.userId],
    references: [users.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
}).extend({
  email: z.string().email(),
  password: z.string().min(6),
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  quantity: z.number().min(1),
  pricePerKg: z.string().regex(/^\d+(\.\d{1,2})?$/),
});

export const insertTransactionSchema = createInsertSchema(transactions).omit({
  id: true,
  createdAt: true,
  completedAt: true,
});

export const insertIotDeviceSchema = createInsertSchema(iotDevices).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPricePredictionSchema = createInsertSchema(pricePredictions).omit({
  id: true,
  createdAt: true,
});

export const insertExportOpportunitySchema = createInsertSchema(exportOpportunities).omit({
  id: true,
  createdAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;

export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;

export type IotDevice = typeof iotDevices.$inferSelect;
export type InsertIotDevice = z.infer<typeof insertIotDeviceSchema>;

export type PricePrediction = typeof pricePredictions.$inferSelect;
export type InsertPricePrediction = z.infer<typeof insertPricePredictionSchema>;

export type ExportOpportunity = typeof exportOpportunities.$inferSelect;
export type InsertExportOpportunity = z.infer<typeof insertExportOpportunitySchema>;
