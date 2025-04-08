import { ZoneWithBins } from "@shared/schema";
import BinCard from "./BinCard";

interface ZoneContainerProps {
  zone: ZoneWithBins;
  viewType: "grid" | "list";
  zoomLevel: number;
}

export default function ZoneContainer({ zone, viewType, zoomLevel }: ZoneContainerProps) {
  const zoomStyle = {
    fontSize: `${zoomLevel / 100}rem`,
  };
  
  // Background gradient for zone header based on face type
  const bgGradient = zone.faceType === "Pick" 
    ? "bg-gradient-to-r from-blue-50 to-indigo-50" 
    : "bg-gradient-to-r from-emerald-50 to-teal-50";
    
  // Icon based on face type
  const faceTypeIcon = zone.faceType === "Pick" ? "🔍" : "🔋";
  
  return (
    <div className="border border-gray-200 rounded-lg mb-4 shadow-sm overflow-hidden" style={zoomStyle}>
      <div className={`${bgGradient} px-5 py-4 flex justify-between items-center`}>
        <div className="flex items-center gap-3">
          <div className="bg-white/80 rounded-full h-8 w-8 flex items-center justify-center shadow-sm">
            <span className="text-lg">{faceTypeIcon}</span>
          </div>
          <div>
            <h3 className="font-bold text-gray-800">{zone.name}</h3>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full font-medium">{zone.faceType}</span>
              <span className="text-xs text-gray-500">|</span>
              <span className="text-xs text-gray-600">{zone.bins.length} bins</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <div className="text-sm font-bold text-gray-800">{zone.utilization}% utilized</div>
          <div className="w-32 h-2 bg-gray-200 rounded-full mt-1 overflow-hidden">
            <div 
              className={`h-full rounded-full ${getUtilizationColor(zone.utilization)}`}
              style={{ width: `${zone.utilization}%` }}
            ></div>
          </div>
        </div>
      </div>
      
      <div className="p-5 bg-white">
        {viewType === "grid" ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {zone.bins.map(bin => (
              <BinCard key={bin.id} bin={bin} />
            ))}
          </div>
        ) : (
          <div className="divide-y divide-gray-100 rounded-lg border border-gray-100 overflow-hidden">
            {zone.bins.map(bin => (
              <div key={bin.id} className="py-3 px-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <BinUtilizationIndicator utilizationPercent={bin.utilizationPercent} />
                  <span className="font-medium text-gray-800">{bin.binId}</span>
                  <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full font-medium">{bin.storageHUType}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-gray-600">{bin.category}</span>
                  <div className="px-2 py-1 bg-gray-50 rounded text-xs">
                    <span className="text-gray-600">Vol: </span>
                    <span className="font-medium">{bin.maxVolume}</span>
                  </div>
                  {bin.binPalletCapacity && (
                    <div className="px-2 py-1 bg-gray-50 rounded text-xs">
                      <span className="text-gray-600">Pallets: </span>
                      <span className="font-medium">{bin.binPalletCapacity}</span>
                    </div>
                  )}
                  <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${getUtilizationColor(bin.utilizationPercent)}`}
                      style={{ width: `${bin.utilizationPercent}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-bold">{bin.utilizationPercent}%</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function getUtilizationColor(percent: number): string {
  if (percent === 0) return "bg-gray-400";
  if (percent <= 50) return "bg-green-500";
  if (percent <= 75) return "bg-amber-500";
  return "bg-red-500";
}

function BinUtilizationIndicator({ utilizationPercent }: { utilizationPercent: number }) {
  let bgGradient = "bg-gradient-to-r from-gray-200 to-gray-300";
  
  if (utilizationPercent > 0) {
    if (utilizationPercent <= 50) {
      bgGradient = "bg-gradient-to-r from-green-400 to-green-500";
    } else if (utilizationPercent <= 75) {
      bgGradient = "bg-gradient-to-r from-amber-400 to-amber-500";
    } else {
      bgGradient = "bg-gradient-to-r from-red-400 to-red-500";
    }
  }
  
  return (
    <div className="relative w-5 h-5 flex items-center justify-center">
      <div className={`w-3.5 h-3.5 rounded-full ${bgGradient} shadow-sm`}></div>
    </div>
  );
}
