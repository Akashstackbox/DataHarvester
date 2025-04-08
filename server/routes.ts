import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // prefix all routes with /api
  
  // Get all warehouse data (area, zones, bins)
  app.get("/api/warehouse", async (req, res) => {
    try {
      const warehouseData = await storage.getWarehouseData();
      res.json(warehouseData);
    } catch (error) {
      console.error("Error fetching warehouse data:", error);
      res.status(500).json({ message: "Failed to fetch warehouse data" });
    }
  });
  
  // Get bins that are above a certain threshold (critical bins)
  app.get("/api/warehouse/critical-bins", async (req, res) => {
    try {
      const threshold = parseInt(req.query.threshold as string) || 75;
      const criticalBins = await storage.getCriticalBins(threshold);
      res.json(criticalBins);
    } catch (error) {
      console.error("Error fetching critical bins:", error);
      res.status(500).json({ message: "Failed to fetch critical bins" });
    }
  });
  
  // Get category distribution
  app.get("/api/warehouse/category-distribution", async (req, res) => {
    try {
      const distribution = await storage.getCategoryDistribution();
      res.json(distribution);
    } catch (error) {
      console.error("Error fetching category distribution:", error);
      res.status(500).json({ message: "Failed to fetch category distribution" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
