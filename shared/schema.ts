import { pgTable, text, serial, integer, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users schema is kept for compatibility
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Warehouse schema
export const areas = pgTable("areas", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  overallUtilization: integer("overall_utilization").notNull(),
});

export const insertAreaSchema = createInsertSchema(areas).pick({
  name: true,
  overallUtilization: true,
});

export type InsertArea = z.infer<typeof insertAreaSchema>;
export type Area = typeof areas.$inferSelect;

export const zones = pgTable("zones", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  areaId: integer("area_id").notNull(),
  utilization: integer("utilization").notNull(),
});

export const insertZoneSchema = createInsertSchema(zones).pick({
  name: true,
  areaId: true,
  utilization: true,
});

export type InsertZone = z.infer<typeof insertZoneSchema>;
export type Zone = typeof zones.$inferSelect;

export const bins = pgTable("bins", {
  id: serial("id").primaryKey(),
  binId: text("bin_id").notNull().unique(),
  zoneId: integer("zone_id").notNull(),
  utilizationPercent: integer("utilization_percent").notNull(),
  category: text("category"),
});

export const insertBinSchema = createInsertSchema(bins).pick({
  binId: true,
  zoneId: true,
  utilizationPercent: true,
  category: true,
});

export type InsertBin = z.infer<typeof insertBinSchema>;
export type Bin = typeof bins.$inferSelect;

// API response types for frontend consumption
export type AreaWithZonesAndBins = {
  id: number;
  name: string;
  overallUtilization: number;
  zones: ZoneWithBins[];
};

export type ZoneWithBins = {
  id: number;
  name: string;
  utilization: number;
  bins: Bin[];
};

export type CategoryDistribution = {
  category: string;
  percentage: number;
};
