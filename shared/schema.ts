import { pgTable, text, serial, integer, boolean, numeric, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  imageUrl: text("image_url"),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  categoryId: integer("category_id").references(() => categories.id),
  imageUrl: text("image_url").notNull(),
  isCustomizable: boolean("is_customizable").default(false),
  rating: numeric("rating", { precision: 3, scale: 2 }).default("0"),
  reviewCount: integer("review_count").default(0),
  inStock: boolean("in_stock").default(true),
  tags: text("tags").array(),
});

export const customizationOptions = pgTable("customization_options", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").references(() => products.id),
  type: text("type").notNull(), // 'color', 'size', 'text', 'font'
  name: text("name").notNull(),
  values: text("values").array(), // JSON array of possible values
  priceModifier: numeric("price_modifier", { precision: 10, scale: 2 }).default("0"),
});

export const newsletters = pgTable("newsletters", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  subscribedAt: timestamp("subscribed_at").defaultNow(),
  isActive: boolean("is_active").default(true),
});

export const cartItems = pgTable("cart_items", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull(),
  productId: integer("product_id").references(() => products.id),
  quantity: integer("quantity").notNull().default(1),
  customization: text("customization"), // JSON string of customization options
  addedAt: timestamp("added_at").defaultNow(),
});

export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  content: text("content").notNull(),
  rating: integer("rating").notNull(),
  productId: integer("product_id").references(() => products.id),
  isVerified: boolean("is_verified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertCategorySchema = createInsertSchema(categories).omit({
  id: true,
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
});

export const insertCustomizationOptionSchema = createInsertSchema(customizationOptions).omit({
  id: true,
});

export const insertNewsletterSchema = createInsertSchema(newsletters).omit({
  id: true,
  subscribedAt: true,
  isActive: true,
}).extend({
  email: z.string().email("Please enter a valid email address"),
});

export const insertCartItemSchema = createInsertSchema(cartItems).omit({
  id: true,
  addedAt: true,
});

export const insertTestimonialSchema = createInsertSchema(testimonials).omit({
  id: true,
  createdAt: true,
  isVerified: true,
});

// Types
export type Category = typeof categories.$inferSelect;
export type Product = typeof products.$inferSelect;
export type CustomizationOption = typeof customizationOptions.$inferSelect;
export type Newsletter = typeof newsletters.$inferSelect;
export type CartItem = typeof cartItems.$inferSelect;
export type Testimonial = typeof testimonials.$inferSelect;

export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type InsertCustomizationOption = z.infer<typeof insertCustomizationOptionSchema>;
export type InsertNewsletter = z.infer<typeof insertNewsletterSchema>;
export type InsertCartItem = z.infer<typeof insertCartItemSchema>;
export type InsertTestimonial = z.infer<typeof insertTestimonialSchema>;

// Extended types for frontend
export type ProductWithCategory = Product & { category?: Category };
export type ProductWithCustomization = Product & { 
  category?: Category;
  customizationOptions?: CustomizationOption[];
};
