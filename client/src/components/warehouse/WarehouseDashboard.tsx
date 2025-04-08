import { useState } from "react";
import { AreaWithZonesAndBins, Bin, CategoryDistribution } from "@shared/schema";
import { RefreshCcw, Filter, ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Legend from "./Legend";
import AreaContainer from "./AreaContainer";
import UtilizationSummary from "./UtilizationSummary";
import CategoryDistributionChart from "./CategoryDistribution";
import CriticalBins from "./CriticalBins";

interface WarehouseDashboardProps {
  warehouseData?: AreaWithZonesAndBins;
  criticalBins?: Bin[];
  categoryDistribution?: CategoryDistribution[];
  isLoading: boolean;
  onRefresh: () => void;
}

export default function WarehouseDashboard({ 
  warehouseData, 
  criticalBins,
  categoryDistribution,
  isLoading, 
  onRefresh 
}: WarehouseDashboardProps) {
  const [viewType, setViewType] = useState<"grid" | "list">("grid");
  const [selectedZone, setSelectedZone] = useState<string>("all");
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  
  const handleZoomIn = () => {
    if (zoomLevel < 150) {
      setZoomLevel(prevZoom => prevZoom + 10);
    }
  };
  
  const handleZoomOut = () => {
    if (zoomLevel > 70) {
      setZoomLevel(prevZoom => prevZoom - 10);
    }
  };
  
  const lastUpdated = new Date().toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true
  });
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800">
      {/* Header */}
      <header className="bg-white shadow-sm px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-semibold text-primary">Warehouse Space Utilization</h1>
            {warehouseData && (
              <div className="bg-neutral-100 text-sm py-1 px-3 rounded-full text-secondary">
                Area: {warehouseData.name}
              </div>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              className="flex items-center gap-1.5"
              onClick={onRefresh}
              disabled={isLoading}
            >
              <RefreshCcw className="h-4 w-4" />
              Refresh Data
            </Button>
            <Button variant="default" className="flex items-center gap-1.5">
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="flex-grow p-6">
        <div className="max-w-7xl mx-auto">
          {/* Controls */}
          <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex rounded-md shadow-sm" role="group">
                <Button
                  variant={viewType === "grid" ? "default" : "outline"} 
                  className="rounded-r-none"
                  onClick={() => setViewType("grid")}
                >
                  Grid View
                </Button>
                <Button 
                  variant={viewType === "list" ? "default" : "outline"} 
                  className="rounded-l-none"
                  onClick={() => setViewType("list")}
                >
                  List View
                </Button>
              </div>
              
              <select 
                className="px-3 py-2 text-sm rounded-md border border-gray-200 bg-white"
                value={selectedZone}
                onChange={(e) => setSelectedZone(e.target.value)}
              >
                <option value="all">All Zones</option>
                {warehouseData?.zones.map(zone => (
                  <option key={zone.id} value={zone.name}>
                    {zone.name}
                  </option>
                ))}
              </select>
              
              <select className="px-3 py-2 text-sm rounded-md border border-gray-200 bg-white">
                <option>Sort by Utilization</option>
                <option>Sort by Zone</option>
                <option>Sort by Bin ID</option>
              </select>
            </div>
            
            <div className="inline-flex items-center space-x-2 bg-neutral-100 p-1.5 rounded-md">
              <Button 
                variant="ghost" 
                size="icon" 
                className="p-1.5 rounded text-gray-500 hover:bg-white hover:text-primary"
                onClick={handleZoomOut}
              >
                <ZoomOut className="h-5 w-5" />
              </Button>
              <div className="text-sm text-gray-600">{zoomLevel}%</div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="p-1.5 rounded text-gray-500 hover:bg-white hover:text-primary"
                onClick={handleZoomIn}
              >
                <ZoomIn className="h-5 w-5" />
              </Button>
            </div>
          </div>
          
          {/* Legend */}
          <Legend />
          
          {/* Warehouse Visualization */}
          <div className="grid grid-cols-1 gap-6">
            {isLoading ? (
              <Card className="p-6">
                <Skeleton className="h-8 w-1/3 mb-2" />
                <Skeleton className="h-4 w-1/4 mb-6" />
                
                {[1, 2, 3].map(zone => (
                  <div key={zone} className="mb-6">
                    <Skeleton className="h-6 w-1/6 mb-4" />
                    <div className="grid grid-cols-5 gap-3">
                      {Array(5).fill(0).map((_, i) => (
                        <Skeleton key={i} className="h-20" />
                      ))}
                    </div>
                  </div>
                ))}
              </Card>
            ) : warehouseData ? (
              <AreaContainer 
                area={warehouseData} 
                selectedZone={selectedZone}
                viewType={viewType}
                zoomLevel={zoomLevel}
              />
            ) : (
              <Card className="p-6 text-center">
                <p className="text-gray-500">No warehouse data available</p>
              </Card>
            )}
          </div>
          
          {/* Analytics */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <UtilizationSummary 
              area={warehouseData}
              isLoading={isLoading}
            />
            
            <CategoryDistributionChart 
              distribution={categoryDistribution} 
              isLoading={isLoading}
            />
            
            <CriticalBins 
              bins={criticalBins} 
              isLoading={isLoading}
            />
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-4 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center">
          <div className="text-sm text-gray-500">
            Last updated: Today at {lastUpdated}
          </div>
          <div className="text-sm text-gray-500 mt-2 sm:mt-0">
            Warehouse Management System v1.0
          </div>
        </div>
      </footer>
    </div>
  );
}
