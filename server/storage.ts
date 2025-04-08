import { 
  Area, Bin, InsertArea, InsertBin, InsertZone, User, InsertUser, 
  Zone, AreaWithZonesAndBins, ZoneWithBins, CategoryDistribution,
  AreaType, FaceType, StorageHUType, SkuEligibilityType
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
  getWarehouseDataByAreaId(areaId: number): Promise<AreaWithZonesAndBins>;
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
    return this.getWarehouseDataByAreaId(1); // Default to first area (Inventory)
  }
  
  async getWarehouseDataByAreaId(areaId: number): Promise<AreaWithZonesAndBins> {
    const area = this.areas.get(areaId);
    if (!area) {
      throw new Error(`Area with ID ${areaId} not found`);
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
    const inventoryArea: Area = {
      id: this.currentAreaId++,
      name: "Inventory",
      areaType: "Inventory" as AreaType,
      overallUtilization: 55
    };
    this.areas.set(inventoryArea.id, inventoryArea);
    
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
    
    // Create Zones for Inventory Area
    const zoneA1: Zone = {
      id: this.currentZoneId++,
      name: "Zone A1",
      areaId: inventoryArea.id,
      faceType: "Pick" as FaceType,
      utilization: 68
    };
    this.zones.set(zoneA1.id, zoneA1);
    
    const zoneA2: Zone = {
      id: this.currentZoneId++,
      name: "Zone A2",
      areaId: inventoryArea.id,
      faceType: "Reserve" as FaceType,
      utilization: 78
    };
    this.zones.set(zoneA2.id, zoneA2);
    
    const zoneA3: Zone = {
      id: this.currentZoneId++,
      name: "Zone A3",
      areaId: inventoryArea.id,
      faceType: "Pick" as FaceType,
      utilization: 65
    };
    this.zones.set(zoneA3.id, zoneA3);
    
    const zoneA4: Zone = {
      id: this.currentZoneId++,
      name: "Zone A4",
      areaId: inventoryArea.id,
      faceType: "Reserve" as FaceType,
      utilization: 42
    };
    this.zones.set(zoneA4.id, zoneA4);
    
    // Create Zones for Returns Area
    const zoneB1: Zone = {
      id: this.currentZoneId++,
      name: "Zone B1",
      areaId: returnArea.id,
      faceType: "Pick" as FaceType,
      utilization: 75
    };
    this.zones.set(zoneB1.id, zoneB1);
    
    const zoneB2: Zone = {
      id: this.currentZoneId++,
      name: "Zone B2",
      areaId: returnArea.id,
      faceType: "Reserve" as FaceType,
      utilization: 82
    };
    this.zones.set(zoneB2.id, zoneB2);
    
    const zoneB3: Zone = {
      id: this.currentZoneId++,
      name: "Zone B3",
      areaId: returnArea.id,
      faceType: "Pick" as FaceType,
      utilization: 85
    };
    this.zones.set(zoneB3.id, zoneB3);
    
    const zoneB4: Zone = {
      id: this.currentZoneId++,
      name: "Zone B4",
      areaId: returnArea.id,
      faceType: "Reserve" as FaceType,
      utilization: 80
    };
    this.zones.set(zoneB4.id, zoneB4);
    
    // Create Zones for Overflow Area
    const zoneC1: Zone = {
      id: this.currentZoneId++,
      name: "Zone C1",
      areaId: overflowArea.id,
      faceType: "Pick" as FaceType,
      utilization: 30
    };
    this.zones.set(zoneC1.id, zoneC1);
    
    const zoneC2: Zone = {
      id: this.currentZoneId++,
      name: "Zone C2",
      areaId: overflowArea.id,
      faceType: "Reserve" as FaceType,
      utilization: 25
    };
    this.zones.set(zoneC2.id, zoneC2);
    
    const zoneC3: Zone = {
      id: this.currentZoneId++,
      name: "Zone C3",
      areaId: overflowArea.id,
      faceType: "Pick" as FaceType,
      utilization: 40
    };
    this.zones.set(zoneC3.id, zoneC3);
    
    const zoneC4: Zone = {
      id: this.currentZoneId++,
      name: "Zone C4",
      areaId: overflowArea.id,
      faceType: "Reserve" as FaceType,
      utilization: 38
    };
    this.zones.set(zoneC4.id, zoneC4);
    
    // Create Zones for Staging Area
    const zoneD1: Zone = {
      id: this.currentZoneId++,
      name: "Zone D1",
      areaId: stagingArea.id,
      faceType: "Pick" as FaceType,
      utilization: 60
    };
    this.zones.set(zoneD1.id, zoneD1);
    
    const zoneD2: Zone = {
      id: this.currentZoneId++,
      name: "Zone D2",
      areaId: stagingArea.id,
      faceType: "Reserve" as FaceType,
      utilization: 55
    };
    this.zones.set(zoneD2.id, zoneD2);
    
    const zoneD3: Zone = {
      id: this.currentZoneId++,
      name: "Zone D3",
      areaId: stagingArea.id,
      faceType: "Pick" as FaceType,
      utilization: 62
    };
    this.zones.set(zoneD3.id, zoneD3);
    
    const zoneD4: Zone = {
      id: this.currentZoneId++,
      name: "Zone D4",
      areaId: stagingArea.id,
      faceType: "Reserve" as FaceType,
      utilization: 65
    };
    this.zones.set(zoneD4.id, zoneD4);
    
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
        
        // Determine SKU eligibility 
        const eligibilityRandom = Math.random();
        let skuEligibility: SkuEligibilityType = 'AllEligible';
        
        if (eligibilityRandom < 0.7) {
          skuEligibility = 'AllEligible';
        } else if (eligibilityRandom < 0.9) {
          skuEligibility = 'MixedEligibility';
        } else {
          skuEligibility = 'AllIneligible';
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
          binPalletCapacity,
          skuEligibility
        };
        
        // Add to storage
        this.bins.set(bin.id, bin);
      }
    };
    
    // Generate bins for Inventory Area zones
    generateBins(zoneA1.id, "A1");
    generateBins(zoneA2.id, "A2");
    generateBins(zoneA3.id, "A3");
    generateBins(zoneA4.id, "A4");
    
    // Generate bins for Returns Area zones
    generateBins(zoneB1.id, "B1");
    generateBins(zoneB2.id, "B2");
    generateBins(zoneB3.id, "B3");
    generateBins(zoneB4.id, "B4");
    
    // Generate bins for Overflow Area zones
    generateBins(zoneC1.id, "C1");
    generateBins(zoneC2.id, "C2");
    generateBins(zoneC3.id, "C3");
    generateBins(zoneC4.id, "C4");
    
    // Generate bins for Staging Area zones
    generateBins(zoneD1.id, "D1");
    generateBins(zoneD2.id, "D2");
    generateBins(zoneD3.id, "D3");
    generateBins(zoneD4.id, "D4");
  }
}

export const storage = new MemStorage();
