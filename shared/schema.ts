import { sql } from "drizzle-orm";
import { pgTable, text, varchar, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const dresses = pgTable("dresses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  modelNumber: text("model_number").notNull().unique(),
  specifications: text("specifications").notNull(),
  companyName: text("company_name").notNull(),
  pieceType: text("piece_type").notNull(),
  imageUrl: text("image_url"),
  onlinePrice: text("online_price"),
  storePrice: text("store_price"),
  colorsAndSizes: jsonb("colors_and_sizes").$type<ColorAndSize[]>().default([]),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const colorAndSizeSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "اسم اللون مطلوب"),
  sizes: z.array(z.object({
    id: z.string(),
    value: z.string().min(1, "المقاس مطلوب")
  })).min(1, "يجب إضافة مقاس واحد على الأقل")
});

export type ColorAndSize = z.infer<typeof colorAndSizeSchema>;

export const insertDressSchema = createInsertSchema(dresses).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  modelNumber: z.string().min(1, "رقم الموديل مطلوب"),
  specifications: z.string().min(1, "مواصفات الموديل مطلوبة"),
  companyName: z.string().min(1, "اسم الشركة مطلوب"),
  pieceType: z.string().min(1, "نوع القطعة مطلوب"),
  imageUrl: z.string().url("رابط الصورة غير صحيح").optional().or(z.literal("")),
  onlinePrice: z.string().optional(),
  storePrice: z.string().optional(),
  colorsAndSizes: z.array(colorAndSizeSchema).min(1, "يجب إضافة لون واحد على الأقل")
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertDress = z.infer<typeof insertDressSchema>;
export type Dress = typeof dresses.$inferSelect;
