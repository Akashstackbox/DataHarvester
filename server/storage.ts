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
    
    // Create Bins for Zone A
    const binsZoneA = [
      { 
        binId: "A-01", 
        utilizationPercent: 23, 
        category: "Electronics",
        maxVolume: 2000,
        storageHUType: "Pallet" as StorageHUType,
        binPalletCapacity: 4
      },
      { 
        binId: "A-02", 
        utilizationPercent: 65, 
        category: "Packaging",
        maxVolume: 500,
        storageHUType: "Carton" as StorageHUType
      },
      { 
        binId: "A-03", 
        utilizationPercent: 87, 
        category: "Appliances",
        maxVolume: 400,
        storageHUType: "Carton" as StorageHUType
      },
      { 
        binId: "A-04", 
        utilizationPercent: 45, 
        category: "Office Supplies",
        maxVolume: 750,
        storageHUType: "Carton" as StorageHUType
      },
      { 
        binId: "A-05", 
        utilizationPercent: 95, 
        category: "Tools",
        maxVolume: 600,
        storageHUType: "Carton" as StorageHUType
      }
    ];
    
    binsZoneA.forEach(binData => {
      const bin: Bin = {
        id: this.currentBinId++,
        binId: binData.binId,
        zoneId: zoneA.id,
        utilizationPercent: binData.utilizationPercent,
        category: binData.category,
        maxVolume: binData.maxVolume,
        storageHUType: binData.storageHUType,
        binPalletCapacity: binData.binPalletCapacity || null
      };
      this.bins.set(bin.id, bin);
    });
    
    // Create Bins for Zone B
    const binsZoneB = [
      { 
        binId: "B-01", 
        utilizationPercent: 72, 
        category: "Clothing",
        maxVolume: 3000,
        storageHUType: "Pallet" as StorageHUType,
        binPalletCapacity: 6
      },
      { 
        binId: "B-02", 
        utilizationPercent: 89, 
        category: "Books",
        maxVolume: 1500,
        storageHUType: "Crate" as StorageHUType
      },
      { 
        binId: "B-03", 
        utilizationPercent: 58, 
        category: "Toys",
        maxVolume: 800,
        storageHUType: "Carton" as StorageHUType
      },
      { 
        binId: "B-04", 
        utilizationPercent: 93, 
        category: "Sporting Goods",
        maxVolume: 1200,
        storageHUType: "Crate" as StorageHUType
      },
      { 
        binId: "B-05", 
        utilizationPercent: 68, 
        category: "Hardware",
        maxVolume: 2500,
        storageHUType: "Pallet" as StorageHUType,
        binPalletCapacity: 5
      }
    ];
    
    binsZoneB.forEach(binData => {
      const bin: Bin = {
        id: this.currentBinId++,
        binId: binData.binId,
        zoneId: zoneB.id,
        utilizationPercent: binData.utilizationPercent,
        category: binData.category,
        maxVolume: binData.maxVolume,
        storageHUType: binData.storageHUType,
        binPalletCapacity: binData.binPalletCapacity || null
      };
      this.bins.set(bin.id, bin);
    });
    
    // Create Bins for Zone C
    const binsZoneC = [
      { 
        binId: "C-01", 
        utilizationPercent: 85, 
        category: "Kitchen",
        maxVolume: 900,
        storageHUType: "Carton" as StorageHUType
      },
      { 
        binId: "C-02", 
        utilizationPercent: 32, 
        category: "Garden",
        maxVolume: 2200,
        storageHUType: "Pallet" as StorageHUType,
        binPalletCapacity: 4
      },
      { 
        binId: "C-03", 
        utilizationPercent: 61, 
        category: "Automotive",
        maxVolume: 1800,
        storageHUType: "Crate" as StorageHUType
      },
      { 
        binId: "C-04", 
        utilizationPercent: 54, 
        category: "Pet Supplies",
        maxVolume: 600,
        storageHUType: "Carton" as StorageHUType
      },
      { 
        binId: "C-05", 
        utilizationPercent: 0, 
        category: "Empty",
        maxVolume: 300,
        storageHUType: "Carton" as StorageHUType
      }
    ];
    
    binsZoneC.forEach(binData => {
      const bin: Bin = {
        id: this.currentBinId++,
        binId: binData.binId,
        zoneId: zoneC.id,
        utilizationPercent: binData.utilizationPercent,
        category: binData.category,
        maxVolume: binData.maxVolume,
        storageHUType: binData.storageHUType,
        binPalletCapacity: binData.binPalletCapacity || null
      };
      this.bins.set(bin.id, bin);
    });
  }
}

export const storage = new MemStorage();
