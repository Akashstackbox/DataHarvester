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
export type AreaType = 'Inventory' | 'Returns' | 'Overflow' | 'Staging' | 'Damage';

export const areas = pgTable("areas", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  areaType: text("area_type").notNull().$type<AreaType>(),
  overallUtilization: integer("overall_utilization").notNull(),
});

export const insertAreaSchema = createInsertSchema(areas).pick({
  name: true,
  areaType: true,
  overallUtilization: true,
});

export type InsertArea = z.infer<typeof insertAreaSchema>;
export type Area = typeof areas.$inferSelect;

export type FaceType = 'Pick' | 'Reserve';

export const zones = pgTable("zones", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  areaId: integer("area_id").notNull(),
  faceType: text("face_type").notNull().$type<FaceType>(),
  utilization: integer("utilization").notNull(),
});

export const insertZoneSchema = createInsertSchema(zones).pick({
  name: true,
  areaId: true,
  faceType: true,
  utilization: true,
});

export type InsertZone = z.infer<typeof insertZoneSchema>;
export type Zone = typeof zones.$inferSelect;

export type StorageHUType = 'Pallet' | 'Carton' | 'Crate';
export type SkuEligibilityType = 'AllEligible' | 'MixedEligibility' | 'AllIneligible';

export const bins = pgTable("bins", {
  id: serial("id").primaryKey(),
  binId: text("bin_id").notNull().unique(),
  zoneId: integer("zone_id").notNull(),
  utilizationPercent: integer("utilization_percent").notNull(),
  category: text("category"),
  maxVolume: integer("max_volume").notNull(),
  storageHUType: text("storage_hu_type").notNull().$type<StorageHUType>(),
  binPalletCapacity: integer("bin_pallet_capacity"),
  skuEligibility: text("sku_eligibility").notNull().default('AllEligible').$type<SkuEligibilityType>(),
});

export const insertBinSchema = createInsertSchema(bins).pick({
  binId: true,
  zoneId: true,
  utilizationPercent: true,
  category: true,
  maxVolume: true,
  storageHUType: true,
  binPalletCapacity: true,
  skuEligibility: true,
});

export type InsertBin = z.infer<typeof insertBinSchema>;
export type Bin = typeof bins.$inferSelect;

// API response types for frontend consumption
export type AreaWithZonesAndBins = {
  id: number;
  name: string;
  areaType: AreaType;
  overallUtilization: number;
  zones: ZoneWithBins[];
};

export type ZoneWithBins = {
  id: number;
  name: string;
  faceType: FaceType;
  utilization: number;
  bins: Bin[];
};

export type CategoryDistribution = {
  category: string;
  percentage: number;
};
