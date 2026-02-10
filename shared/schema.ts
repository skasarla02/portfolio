
import { pgTable, text, serial, integer, jsonb, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// === TABLE DEFINITIONS ===

// Projects / Case Studies
export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(), // e.g., 'blackskies-education'
  title: text("title").notNull(),
  shortDescription: text("short_description").notNull(),
  fullDescription: text("full_description").notNull(), // Rich text / Markdown
  role: text("role").notNull(),
  timeline: text("timeline").notNull(),
  technologies: text("technologies").array(),
  heroImage: text("hero_image"),
  
  // PM Specific Fields
  problemStatement: text("problem_statement"),
  solution: text("solution"),
  keyFeatures: jsonb("key_features").$type<{title: string, description: string}[]>(),
  
  // Dashboard / Metrics Data
  // Stores structured data for charts: { label: string, value: number, ... }[]
  dashboardData: jsonb("dashboard_data").$type<{
    engagement: { week: string, attendance: number, assignments: number }[],
    nps: { score: number, total: number },
    success: { applied: number, offers: number }
  }>(),
  
  isFeatured: boolean("is_featured").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Resume: Experience
export const experiences = pgTable("experiences", {
  id: serial("id").primaryKey(),
  company: text("company").notNull(),
  role: text("role").notNull(),
  location: text("location"),
  startDate: text("start_date").notNull(),
  endDate: text("end_date"), // Null for "Present"
  description: text("description").array(), // Bullet points
  order: integer("order").notNull(), // For display ordering
});

// Resume: Education
export const education = pgTable("education", {
  id: serial("id").primaryKey(),
  school: text("school").notNull(),
  degree: text("degree").notNull(),
  year: text("year").notNull(),
  details: text("details").array(), // Coursework, GPA, etc.
});

// Resume: Skills
export const skills = pgTable("skills", {
  id: serial("id").primaryKey(),
  category: text("category").notNull(), // 'Tech', 'Product/Business'
  items: text("items").array().notNull(),
});

// === SCHEMAS ===
export const insertProjectSchema = createInsertSchema(projects).omit({ id: true, createdAt: true });
export const insertExperienceSchema = createInsertSchema(experiences).omit({ id: true });
export const insertEducationSchema = createInsertSchema(education).omit({ id: true });
export const insertSkillSchema = createInsertSchema(skills).omit({ id: true });

// === TYPES ===
export type Project = typeof projects.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;

export type Experience = typeof experiences.$inferSelect;
export type InsertExperience = z.infer<typeof insertExperienceSchema>;

export type Education = typeof education.$inferSelect;
export type InsertEducation = z.infer<typeof insertEducationSchema>;

export type Skill = typeof skills.$inferSelect;
export type InsertSkill = z.infer<typeof insertSkillSchema>;
