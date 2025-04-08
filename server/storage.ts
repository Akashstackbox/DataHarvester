import { 
  Area, Bin, InsertArea, InsertBin, InsertZone, User, InsertUser, 
  Zone, AreaWithZonesAndBins, ZoneWithBins, CategoryDistribution,
  AreaType, FaceType, StorageHUType
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
    // Create Areas (based on requirements)
    const northCampus: Area = {
      id: this.currentAreaId++,
      name: "North Campus",
      areaType: "Inventory" as AreaType,
      overallUtilization: 55
    };
    this.areas.set(northCampus.id, northCampus);
    
    const returnArea: Area = {
      id: this.currentAreaId++,
      name: "Returns",
      areaType: "Returns" as AreaType,
      overallUtilization: 80
    };
    this.areas.set(returnArea.id, returnArea);
    
    const overflowArea: Area = {
      id: this.currentAreaId++,
      name: "Overflow",
      areaType: "Overflow" as AreaType,
      overallUtilization: 33
    };
    this.areas.set(overflowArea.id, overflowArea);
    
    const stagingArea: Area = {
      id: this.currentAreaId++,
      name: "Staging",
      areaType: "Staging" as AreaType,
      overallUtilization: 60
    };
    this.areas.set(stagingArea.id, stagingArea);
    
    const damageArea: Area = {
      id: this.currentAreaId++,
      name: "Damage",
      areaType: "Damage" as AreaType,
      overallUtilization: 20
    };
    this.areas.set(damageArea.id, damageArea);
    
    // Create Zones
    const zoneA: Zone = {
      id: this.currentZoneId++,
      name: "Zone A",
      areaId: northCampus.id,
      faceType: "Pick" as FaceType,
      utilization: 68
    };
    this.zones.set(zoneA.id, zoneA);
    
    const zoneB: Zone = {
      id: this.currentZoneId++,
      name: "Zone B",
      areaId: northCampus.id,
      faceType: "Reserve" as FaceType,
      utilization: 78
    };
    this.zones.set(zoneB.id, zoneB);
    
    const zoneC: Zone = {
      id: this.currentZoneId++,
      name: "Zone C",
      areaId: northCampus.id,
      faceType: "Pick" as FaceType,
      utilization: 65
    };
    this.zones.set(zoneC.id, zoneC);
    
    // Helper function to generate multiple bins per zone
    const generateBins = (zoneId: number, zonePrefix: string, count: number = 50) => {
      // Define possible categories
      const categories = [
        "Electronics", "Packaging", "Appliances", "Office Supplies", "Tools",
        "Clothing", "Books", "Toys", "Sporting Goods", "Hardware",
        "Kitchen", "Garden", "Automotive", "Pet Supplies", "Furniture",
        "Health", "Beauty", "Food", "Beverages", "Art Supplies"
      ];
      
      // Define possible storage types with their parameters
      const storageTypes = [
        { type: "Pallet" as StorageHUType, volumes: [1500, 2000, 2500, 3000], hasPalletCapacity: true },
        { type: "Carton" as StorageHUType, volumes: [300, 400, 500, 600, 750], hasPalletCapacity: false },
        { type: "Crate" as StorageHUType, volumes: [800, 1000, 1200, 1500, 1800], hasPalletCapacity: false }
      ];
      
      // Generate bins
      for (let i = 1; i <= count; i++) {
        // Format bin ID with leading zeros
        const binIdNum = i.toString().padStart(2, '0');
        const binId = `${zonePrefix}-${binIdNum}`;
        
        // Randomize data for variety
        const utilizationPercent = Math.floor(Math.random() * 101); // 0-100
        const categoryIndex = Math.floor(Math.random() * categories.length);
        const category = categories[categoryIndex];
        
        // Select a storage type
        const storageTypeIndex = Math.floor(Math.random() * storageTypes.length);
        const storage = storageTypes[storageTypeIndex];
        
        // Select a volume from the available options for this storage type
        const volumeIndex = Math.floor(Math.random() * storage.volumes.length);
        const maxVolume = storage.volumes[volumeIndex];
        
        // Determine pallet capacity if applicable
        let binPalletCapacity = null;
        if (storage.hasPalletCapacity) {
          binPalletCapacity = Math.floor(Math.random() * 6) + 2; // 2-7 pallets
        }
        
        // Create the bin object
        const bin: Bin = {
          id: this.currentBinId++,
          binId,
          zoneId,
          utilizationPercent,
          category,
          maxVolume,
          storageHUType: storage.type,
          binPalletCapacity
        };
        
        // Add to storage
        this.bins.set(bin.id, bin);
      }
    };
    
    // Generate 50 bins for each zone
    generateBins(zoneA.id, "A");
    generateBins(zoneB.id, "B");
    generateBins(zoneC.id, "C");
  }
}

export const storage = new MemStorage();
