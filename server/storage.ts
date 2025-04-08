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
    // Create Areas
    const areas = [
      { name: "Inventory", type: "Inventory" as AreaType, utilization: 65 },
      { name: "Returns", type: "Returns" as AreaType, utilization: 80 },
      { name: "Overflow", type: "Overflow" as AreaType, utilization: 35 },
      { name: "Staging", type: "Staging" as AreaType, utilization: 60 },
      { name: "Receiving", type: "Inventory" as AreaType, utilization: 75 },
      { name: "Processing", type: "Returns" as AreaType, utilization: 45 },
      { name: "Distribution", type: "Staging" as AreaType, utilization: 85 }
    ];

    // Create Areas and store their IDs
    const areaIds = areas.map(area => {
      const newArea: Area = {
        id: this.currentAreaId++,
        name: area.name,
        areaType: area.type,
        overallUtilization: area.utilization
      };
      this.areas.set(newArea.id, newArea);
      return { id: newArea.id, name: area.name };
    });

    // Create Zones for each area
    areaIds.forEach(({ id, name }) => {
      for (let i = 1; i <= 4; i++) {
        const zone: Zone = {
          id: this.currentZoneId++,
          name: `Z${i}`,
          areaId: id,
          faceType: i % 2 === 0 ? "Reserve" as FaceType : "Pick" as FaceType, // Alternate Pick/Reserve
          utilization: Math.floor(Math.random() * 101) // Random utilization
        };
        this.zones.set(zone.id, zone);
      }
    });

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

    // Generate bins for all zones
    Array.from(this.zones.values()).forEach(zone => {
      generateBins(zone.id, zone.name.replace("Zone ", ""));
    });
  }
}

export const storage = new MemStorage();