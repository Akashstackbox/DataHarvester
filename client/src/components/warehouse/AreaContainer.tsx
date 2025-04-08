import { AreaWithZonesAndBins } from "@shared/schema";
import { Card } from "@/components/ui/card";
import ZoneContainer from "./ZoneContainer";

interface AreaContainerProps {
  area: AreaWithZonesAndBins;
  selectedZone: string;
  viewType: "grid" | "list";
  zoomLevel: number;
}

export default function AreaContainer({ area, selectedZone, viewType, zoomLevel }: AreaContainerProps) {
  const totalBins = area.zones.reduce((sum, zone) => sum + zone.bins.length, 0);
  
  const filteredZones = selectedZone === "all" 
    ? area.zones 
    : area.zones.filter(zone => zone.name === selectedZone);
    
  // Get area icon based on type
  let areaIcon = "🏢"; // default 
  if (area.areaType === "Inventory") areaIcon = "📦"; 
  if (area.areaType === "Returns") areaIcon = "↩️"; 
  if (area.areaType === "Overflow") areaIcon = "🔄"; 
  if (area.areaType === "Staging") areaIcon = "🚧"; 
  if (area.areaType === "Damage") areaIcon = "⚠️";
  
  // Get color scheme based on area type
  let bgGradient = "";
  let accentColor = "";
  let borderColor = "";
  let borderStyle = "";
  
  switch (area.areaType) {
    case "Inventory":
      bgGradient = "bg-gradient-to-r from-blue-600 to-indigo-700";
      accentColor = "bg-blue-500";
      borderColor = "border-blue-400";
      borderStyle = "border-2 border-dashed";
      break;
    case "Returns":
      bgGradient = "bg-gradient-to-r from-amber-600 to-orange-700";
      accentColor = "bg-amber-500";
      borderColor = "border-amber-400";
      borderStyle = "border-2 border-dotted";
      break;
    case "Overflow":
      bgGradient = "bg-gradient-to-r from-violet-600 to-purple-700";
      accentColor = "bg-violet-500";
      borderColor = "border-violet-400";
      borderStyle = "border-2";
      break;
    case "Staging":
      bgGradient = "bg-gradient-to-r from-emerald-600 to-teal-700";
      accentColor = "bg-emerald-500";
      borderColor = "border-emerald-400";
      borderStyle = "border-2 border-double";
      break;
    case "Damage":
      bgGradient = "bg-gradient-to-r from-rose-600 to-red-700";
      accentColor = "bg-rose-500";
      borderColor = "border-rose-400";
      borderStyle = "border-2";
      break;
    default:
      bgGradient = "bg-gradient-to-r from-gray-600 to-gray-700";
      accentColor = "bg-gray-500";
      borderColor = "border-gray-400";
      borderStyle = "border-2";
  }
  
  // Calculate utilization color
  let utilizationColor = "bg-gray-400";
  if (area.overallUtilization > 0) {
    if (area.overallUtilization <= 50) {
      utilizationColor = "bg-green-500";
    } else if (area.overallUtilization <= 75) {
      utilizationColor = "bg-amber-500";
    } else {
      utilizationColor = "bg-red-500";
    }
  }
  
  return (
    <Card className={`shadow-md overflow-hidden mb-8 ${borderStyle} ${borderColor} rounded-lg`}>
      <div className={`${bgGradient} text-white p-6 relative overflow-hidden`}>
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-black/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="relative flex items-start gap-4">
          <div className="bg-white/20 rounded-lg p-3 backdrop-blur-sm shadow-lg">
            <span className="text-3xl">{areaIcon}</span>
          </div>
          
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-2xl font-bold">{area.name}</h2>
                  <span className="text-xs px-3 py-1 bg-white/20 text-white rounded-full font-medium backdrop-blur-sm">{area.areaType}</span>
                </div>
                <p className="text-white/70 font-medium">
                  {area.zones.length} zones • {totalBins} bins
                </p>
              </div>
              
              <div className="flex flex-col items-end">
                <div className="text-lg font-bold mb-1">{area.overallUtilization}% utilized</div>
                <div className="w-40 h-2.5 bg-black/20 rounded-full overflow-hidden backdrop-blur-sm">
                  <div 
                    className={`h-full ${utilizationColor}`} 
                    style={{ width: `${area.overallUtilization}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-50 p-6">
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 ${borderStyle} ${borderColor} rounded-lg p-3`}>
          {filteredZones.map(zone => (
            <ZoneContainer 
              key={zone.id} 
              zone={zone} 
              viewType={viewType}
              zoomLevel={zoomLevel}
            />
          ))}
          
          {filteredZones.length === 0 && (
            <div className="text-center py-8 text-gray-500 col-span-full">
              <p>No zones match the selected filter.</p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
