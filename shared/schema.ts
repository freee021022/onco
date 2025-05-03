import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table (patients and doctors)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  fullName: text("full_name").notNull(),
  isDoctor: boolean("is_doctor").notNull().default(false),
  specialization: text("specialization"),
  hospital: text("hospital"),
  city: text("city"),
  bio: text("bio"),
  profileImage: text("profile_image"),
  isVerified: boolean("is_verified").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Forum categories
export const forumCategories = pgTable("forum_categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  postCount: integer("post_count").notNull().default(0),
});

// Forum posts
export const forumPosts = pgTable("forum_posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  userId: integer("user_id").notNull().references(() => users.id),
  categoryId: integer("category_id").notNull().references(() => forumCategories.id),
  commentCount: integer("comment_count").notNull().default(0),
  viewCount: integer("view_count").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Forum comments
export const forumComments = pgTable("forum_comments", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  userId: integer("user_id").notNull().references(() => users.id),
  postId: integer("post_id").notNull().references(() => forumPosts.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Second Opinion Requests
export const secondOpinionRequests = pgTable("second_opinion_requests", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").notNull().references(() => users.id),
  doctorId: integer("doctor_id").notNull().references(() => users.id),
  diagnosis: text("diagnosis").notNull(),
  description: text("description").notNull(),
  documentLinks: text("document_links").array(),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Messages
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  senderId: integer("sender_id").notNull().references(() => users.id),
  receiverId: integer("receiver_id").notNull().references(() => users.id),
  content: text("content").notNull(),
  isRead: boolean("is_read").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Pharmacies
export const pharmacies = pgTable("pharmacies", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  region: text("region").notNull(),
  phone: text("phone"),
  specializations: text("specializations").array(),
  rating: integer("rating"),
  reviewCount: integer("review_count").default(0),
  imageUrl: text("image_url"),
  latitude: text("latitude"),
  longitude: text("longitude"),
});

// Testimonials
export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  location: text("location").notNull(),
  content: text("content").notNull(),
  rating: integer("rating").notNull(),
  imageUrl: text("image_url"),
});

// Relazioni
export const usersRelations = relations(users, ({ many }) => ({
  posts: many(forumPosts),
  comments: many(forumComments),
  sentMessages: many(messages, { relationName: "sender" }),
  receivedMessages: many(messages, { relationName: "receiver" }),
  patientRequests: many(secondOpinionRequests, { relationName: "patient" }),
  doctorRequests: many(secondOpinionRequests, { relationName: "doctor" }),
}));

export const forumCategoriesRelations = relations(forumCategories, ({ many }) => ({
  posts: many(forumPosts),
}));

export const forumPostsRelations = relations(forumPosts, ({ one, many }) => ({
  category: one(forumCategories, {
    fields: [forumPosts.categoryId],
    references: [forumCategories.id],
  }),
  author: one(users, {
    fields: [forumPosts.userId],
    references: [users.id],
  }),
  comments: many(forumComments),
}));

export const forumCommentsRelations = relations(forumComments, ({ one }) => ({
  post: one(forumPosts, {
    fields: [forumComments.postId],
    references: [forumPosts.id],
  }),
  author: one(users, {
    fields: [forumComments.userId],
    references: [users.id],
  }),
}));

export const secondOpinionRequestsRelations = relations(secondOpinionRequests, ({ one }) => ({
  patient: one(users, {
    fields: [secondOpinionRequests.patientId],
    references: [users.id],
    relationName: "patient",
  }),
  doctor: one(users, {
    fields: [secondOpinionRequests.doctorId],
    references: [users.id],
    relationName: "doctor",
  }),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  sender: one(users, {
    fields: [messages.senderId],
    references: [users.id],
    relationName: "sender",
  }),
  receiver: one(users, {
    fields: [messages.receiverId],
    references: [users.id],
    relationName: "receiver",
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users)
  .omit({ id: true, createdAt: true, isVerified: true });
export const insertForumCategorySchema = createInsertSchema(forumCategories)
  .omit({ id: true, postCount: true });
export const insertForumPostSchema = createInsertSchema(forumPosts)
  .omit({ id: true, commentCount: true, viewCount: true, createdAt: true });
export const insertForumCommentSchema = createInsertSchema(forumComments)
  .omit({ id: true, createdAt: true });
export const insertSecondOpinionRequestSchema = createInsertSchema(secondOpinionRequests)
  .omit({ id: true, status: true, createdAt: true });
export const insertMessageSchema = createInsertSchema(messages)
  .omit({ id: true, isRead: true, createdAt: true });
export const insertPharmacySchema = createInsertSchema(pharmacies)
  .omit({ id: true, reviewCount: true });
export const insertTestimonialSchema = createInsertSchema(testimonials)
  .omit({ id: true });

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type ForumCategory = typeof forumCategories.$inferSelect;
export type InsertForumCategory = z.infer<typeof insertForumCategorySchema>;

export type ForumPost = typeof forumPosts.$inferSelect;
export type InsertForumPost = z.infer<typeof insertForumPostSchema>;

export type ForumComment = typeof forumComments.$inferSelect;
export type InsertForumComment = z.infer<typeof insertForumCommentSchema>;

export type SecondOpinionRequest = typeof secondOpinionRequests.$inferSelect;
export type InsertSecondOpinionRequest = z.infer<typeof insertSecondOpinionRequestSchema>;

export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;

export type Pharmacy = typeof pharmacies.$inferSelect;
export type InsertPharmacy = z.infer<typeof insertPharmacySchema>;

export type Testimonial = typeof testimonials.$inferSelect;
export type InsertTestimonial = z.infer<typeof insertTestimonialSchema>;
