import { useState } from "react";
import { AreaWithZonesAndBins, Bin, CategoryDistribution } from "@shared/schema";
import { 
  RefreshCcw, Filter, ZoomIn, ZoomOut, 
  ListFilter, LayoutGrid, BarChart4, Box, 
  MapPin, Settings
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Legend from "./Legend";
import AreaContainer from "./AreaContainer";
import UtilizationSummary from "./UtilizationSummary";
import CategoryDistributionChart from "./CategoryDistribution";
import CriticalBins from "./CriticalBins";
import TimeBasedHeatmap from "./TimeBasedHeatmap";

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
  
  // Get area-specific icon and style
  const getAreaIcon = (areaType?: string) => {
    if (!areaType) return { icon: Box, color: "text-blue-600" };
    
    switch(areaType) {
      case "Inventory": return { icon: Box, color: "text-blue-600" };
      case "Returns": return { icon: RefreshCcw, color: "text-amber-600" };
      case "Overflow": return { icon: BarChart4, color: "text-purple-600" };
      case "Staging": return { icon: MapPin, color: "text-emerald-600" };
      case "Damage": return { icon: Settings, color: "text-rose-600" };
      default: return { icon: Box, color: "text-blue-600" };
    }
  };
  
  const { icon: AreaIcon, color: areaIconColor } = getAreaIcon(warehouseData?.areaType);
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800">
      {/* Header */}
      <header className="bg-white shadow-md px-6 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-tr from-blue-500 to-indigo-600 text-white p-2 rounded-lg shadow-md">
                <Box className="h-6 w-6" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-indigo-600 bg-clip-text text-transparent">
                Visual Warehouse
              </h1>
            </div>
            
            {warehouseData && (
              <div className="bg-gray-50 py-1.5 px-4 rounded-full border border-gray-200 flex items-center gap-2 shadow-sm">
                <AreaIcon className={`h-4 w-4 ${areaIconColor}`} />
                <span className="font-medium">{warehouseData.name}</span>
                <span className="text-xs px-2 py-0.5 bg-white rounded-full shadow-inner text-gray-600">
                  {warehouseData.areaType}
                </span>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-3">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="border-gray-200"
                    disabled={isLoading}
                  >
                    <Settings className="h-4 w-4 text-gray-500" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Settings</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <Button
              variant="outline"
              className="flex items-center gap-1.5 bg-white shadow-sm border-gray-200"
              onClick={onRefresh}
              disabled={isLoading}
            >
              <RefreshCcw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span className="hidden md:inline">Refresh Data</span>
            </Button>
            
            <Button variant="default" className="flex items-center gap-1.5 shadow-sm">
              <Filter className="h-4 w-4" />
              <span className="hidden md:inline">Filters</span>
            </Button>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="flex-grow p-4 md:p-6 pb-8">
        <div className="max-w-7xl mx-auto">
          {/* Controls - Sticky */}
          <div className="sticky top-[73px] z-30 mb-6 p-4 bg-white rounded-lg shadow-md border border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex bg-gray-100 p-1 rounded-lg shadow-inner">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewType("grid")}
                  className={`rounded-md gap-1.5 ${viewType === "grid" ? 'bg-white shadow-sm text-primary' : 'text-gray-600'}`}
                >
                  <LayoutGrid className="h-4 w-4" />
                  <span>Grid</span>
                </Button>
                <Button 
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewType("list")}
                  className={`rounded-md gap-1.5 ${viewType === "list" ? 'bg-white shadow-sm text-primary' : 'text-gray-600'}`}
                >
                  <ListFilter className="h-4 w-4" />
                  <span>List</span>
                </Button>
              </div>
              
              <div className="flex items-center gap-2 border-l border-gray-200 pl-3">
                <label className="text-sm text-gray-500">Zone:</label>
                <select 
                  className="px-3 py-1.5 text-sm rounded-md border border-gray-200 bg-white shadow-sm"
                  value={selectedZone}
                  onChange={(e) => setSelectedZone(e.target.value)}
                >
                  <option value="all">All Zones</option>
                  {warehouseData?.zones.map(zone => (
                    <option key={zone.id} value={zone.name}>
                      {zone.name} ({zone.bins.length} bins)
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex bg-gray-100 p-1 rounded-full shadow-inner">
                <Button 
                  variant="ghost"
                  size="icon"
                  className={`rounded-full h-8 w-8 p-1.5 ${zoomLevel <= 70 ? 'text-gray-400' : 'text-gray-600 hover:bg-white hover:text-primary hover:shadow-sm'}`}
                  onClick={handleZoomOut}
                  disabled={zoomLevel <= 70}
                >
                  <ZoomOut className="h-full w-full" />
                </Button>
                <div className="text-sm px-2 font-medium text-gray-700 flex items-center">{zoomLevel}%</div>
                <Button 
                  variant="ghost"
                  size="icon"
                  className={`rounded-full h-8 w-8 p-1.5 ${zoomLevel >= 150 ? 'text-gray-400' : 'text-gray-600 hover:bg-white hover:text-primary hover:shadow-sm'}`}
                  onClick={handleZoomIn}
                  disabled={zoomLevel >= 150}
                >
                  <ZoomIn className="h-full w-full" />
                </Button>
              </div>
              
              <div className="hidden md:block text-xs bg-gray-100 text-gray-500 px-3 py-1.5 rounded-md">
                Last updated: {lastUpdated}
              </div>
            </div>
          </div>
          
          {/* Legend */}
          <Legend />
          
          {/* Warehouse Visualization */}
          <div className="grid grid-cols-1 gap-6 mb-6">
            {isLoading ? (
              <Card className="p-6 border-0 shadow-lg overflow-hidden relative">
                <div className="bg-gradient-to-br from-gray-100 to-white absolute inset-0"></div>
                <div className="relative">
                  <Skeleton className="h-8 w-1/3 mb-2" />
                  <Skeleton className="h-4 w-1/4 mb-6" />
                  
                  <div className="grid grid-cols-1 gap-8">
                    {[1, 2, 3].map(zone => (
                      <div key={zone} className="mb-6">
                        <Skeleton className="h-6 w-1/6 mb-4" />
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                          {Array(10).fill(0).map((_, i) => (
                            <Skeleton key={i} className="h-28 rounded-lg" />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            ) : warehouseData ? (
              <AreaContainer 
                area={warehouseData} 
                selectedZone={selectedZone}
                viewType={viewType}
                zoomLevel={zoomLevel}
              />
            ) : (
              <Card className="p-12 text-center border-0 shadow-lg">
                <div className="bg-gray-50 w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4">
                  <Box className="h-10 w-10 text-gray-300" />
                </div>
                <p className="text-gray-500 text-lg">No warehouse data available</p>
                <p className="text-gray-400 mt-2 max-w-md mx-auto">
                  The warehouse data could not be loaded. Please check your connection or try refreshing the page.
                </p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={onRefresh}
                >
                  Refresh Data
                </Button>
              </Card>
            )}
          </div>
          
          {/* Time-based Heatmap */}
          <div className="mb-6">
            <TimeBasedHeatmap isLoading={isLoading} />
          </div>
          
          {/* Analytics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
      <footer className="bg-white border-t border-gray-200 py-4 px-6 shadow-inner">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center">
          <div className="text-sm text-gray-400 flex items-center gap-2">
            <div className="flex items-center gap-1.5 text-gray-500">
              <RefreshCcw className="h-3.5 w-3.5" />
              Last updated: {lastUpdated}
            </div>
          </div>
          <div className="text-sm text-gray-400 mt-2 sm:mt-0 font-medium">
            Visual Warehouse Management System v1.0
          </div>
        </div>
      </footer>
    </div>
  );
}
