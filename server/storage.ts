import { 
  Area, Bin, InsertArea, InsertBin, InsertZone, User, InsertUser, 
  Zone, AreaWithZonesAndBins, ZoneWithBins, CategoryDistribution 
} from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  // User methods kept for compatibility
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Warehouse data methods
  getWarehouseData(): Promise<AreaWithZonesAndBins>;
  getAreaById(id: number): Promise<Area | undefined>;
  getZoneById(id: number): Promise<Zone | undefined>;
  getZonesByAreaId(areaId: number): Promise<Zone[]>;
  getBinsByZoneId(zoneId: number): Promise<Bin[]>;
  getCriticalBins(threshold: number): Promise<Bin[]>;
  getCategoryDistribution(): Promise<CategoryDistribution[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private areas: Map<number, Area>;
  private zones: Map<number, Zone>;
  private bins: Map<number, Bin>;
  currentUserId: number;
  currentAreaId: number;
  currentZoneId: number;
  currentBinId: number;

  constructor() {
    this.users = new Map();
    this.areas = new Map();
    this.zones = new Map();
    this.bins = new Map();
    this.currentUserId = 1;
    this.currentAreaId = 1;
    this.currentZoneId = 1;
    this.currentBinId = 1;
    
    // Initialize with mock warehouse data
    this.seedWarehouseData();
  }

  // User methods kept for compatibility
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Warehouse data methods
  async getWarehouseData(): Promise<AreaWithZonesAndBins> {
    const area = this.areas.get(1);
    if (!area) {
      throw new Error("Area not found");
    }
    
    const zonesWithBins: ZoneWithBins[] = [];
    const zonesList = await this.getZonesByAreaId(area.id);
    
    for (const zone of zonesList) {
      const bins = await this.getBinsByZoneId(zone.id);
      zonesWithBins.push({
        ...zone,
        bins
      });
    }
    
    return {
      ...area,
      zones: zonesWithBins
    };
  }
  
  async getAreaById(id: number): Promise<Area | undefined> {
    return this.areas.get(id);
  }
  
  async getZoneById(id: number): Promise<Zone | undefined> {
    return this.zones.get(id);
  }
  
  async getZonesByAreaId(areaId: number): Promise<Zone[]> {
    return Array.from(this.zones.values()).filter(zone => zone.areaId === areaId);
  }
  
  async getBinsByZoneId(zoneId: number): Promise<Bin[]> {
    return Array.from(this.bins.values()).filter(bin => bin.zoneId === zoneId);
  }
  
  async getCriticalBins(threshold: number): Promise<Bin[]> {
    return Array.from(this.bins.values())
      .filter(bin => bin.utilizationPercent >= threshold)
      .sort((a, b) => b.utilizationPercent - a.utilizationPercent)
      .slice(0, 5);
  }
  
  async getCategoryDistribution(): Promise<CategoryDistribution[]> {
    const bins = Array.from(this.bins.values());
    const categories = new Map<string, number>();
    
    bins.forEach(bin => {
      const category = bin.category || 'Other';
      categories.set(category, (categories.get(category) || 0) + 1);
    });
    
    const total = bins.length;
    const distribution: CategoryDistribution[] = [];
    
    categories.forEach((count, category) => {
      distribution.push({
        category,
        percentage: Math.round((count / total) * 100)
      });
    });
    
    return distribution.sort((a, b) => b.percentage - a.percentage);
  }
  
  private seedWarehouseData() {
    // Create North Campus area
    const northCampus: Area = {
      id: this.currentAreaId++,
      name: "North Campus",
      overallUtilization: 72
    };
    this.areas.set(northCampus.id, northCampus);
    
    // Create Zones
    const zoneA: Zone = {
      id: this.currentZoneId++,
      name: "Zone A",
      areaId: northCampus.id,
      utilization: 68
    };
    this.zones.set(zoneA.id, zoneA);
    
    const zoneB: Zone = {
      id: this.currentZoneId++,
      name: "Zone B",
      areaId: northCampus.id,
      utilization: 78
    };
    this.zones.set(zoneB.id, zoneB);
    
    const zoneC: Zone = {
      id: this.currentZoneId++,
      name: "Zone C",
      areaId: northCampus.id,
      utilization: 65
    };
    this.zones.set(zoneC.id, zoneC);
    
    // Create Bins for Zone A
    const binsZoneA = [
      { binId: "A-01", utilizationPercent: 23, category: "Electronics" },
      { binId: "A-02", utilizationPercent: 65, category: "Packaging" },
      { binId: "A-03", utilizationPercent: 87, category: "Appliances" },
      { binId: "A-04", utilizationPercent: 45, category: "Office Supplies" },
      { binId: "A-05", utilizationPercent: 95, category: "Tools" }
    ];
    
    binsZoneA.forEach(binData => {
      const bin: Bin = {
        id: this.currentBinId++,
        binId: binData.binId,
        zoneId: zoneA.id,
        utilizationPercent: binData.utilizationPercent,
        category: binData.category
      };
      this.bins.set(bin.id, bin);
    });
    
    // Create Bins for Zone B
    const binsZoneB = [
      { binId: "B-01", utilizationPercent: 72, category: "Clothing" },
      { binId: "B-02", utilizationPercent: 89, category: "Books" },
      { binId: "B-03", utilizationPercent: 58, category: "Toys" },
      { binId: "B-04", utilizationPercent: 93, category: "Sporting Goods" },
      { binId: "B-05", utilizationPercent: 68, category: "Hardware" }
    ];
    
    binsZoneB.forEach(binData => {
      const bin: Bin = {
        id: this.currentBinId++,
        binId: binData.binId,
        zoneId: zoneB.id,
        utilizationPercent: binData.utilizationPercent,
        category: binData.category
      };
      this.bins.set(bin.id, bin);
    });
    
    // Create Bins for Zone C
    const binsZoneC = [
      { binId: "C-01", utilizationPercent: 85, category: "Kitchen" },
      { binId: "C-02", utilizationPercent: 32, category: "Garden" },
      { binId: "C-03", utilizationPercent: 61, category: "Automotive" },
      { binId: "C-04", utilizationPercent: 54, category: "Pet Supplies" },
      { binId: "C-05", utilizationPercent: 0, category: "Empty" }
    ];
    
    binsZoneC.forEach(binData => {
      const bin: Bin = {
        id: this.currentBinId++,
        binId: binData.binId,
        zoneId: zoneC.id,
        utilizationPercent: binData.utilizationPercent,
        category: binData.category
      };
      this.bins.set(bin.id, bin);
    });
  }
}

export const storage = new MemStorage();
