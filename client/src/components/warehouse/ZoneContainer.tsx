import { ZoneWithBins } from "@shared/schema";
import BinCard from "./BinCard";
import { useState } from "react";

interface ZoneContainerProps {
  zone: ZoneWithBins;
  viewType: "grid" | "list";
  zoomLevel: number;
}

export default function ZoneContainer({ zone, viewType, zoomLevel }: ZoneContainerProps) {
  // Set a default collapsed state
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const toggleExpand = (e: React.MouseEvent) => {
    setIsExpanded((prev: boolean) => !prev);
    // Prevent the event from bubbling up
    e.stopPropagation();
  };

  const zoomStyle = {
    fontSize: `${zoomLevel / 100}rem`,
  };

  // Get styles based on areaId and face type
  let bgGradient = "bg-gradient-to-r from-blue-50 to-indigo-50";
  let borderColor = "border-blue-200";
  let textColor = "text-blue-800";
  let shadowColor = "shadow-blue-100";

  // For Pick zones
  if (zone.faceType === "Pick") {
    switch (zone.areaId) {
      case 1: // Inventory
        bgGradient = "bg-gradient-to-r from-blue-50 to-indigo-50";
        borderColor = "border-blue-200";
        textColor = "text-blue-800";
        shadowColor = "shadow-blue-100";
        break;
      case 2: // Returns
        bgGradient = "bg-gradient-to-r from-amber-50 to-orange-50";
        borderColor = "border-amber-200";
        textColor = "text-amber-800";
        shadowColor = "shadow-amber-100";
        break;
      case 3: // Overflow
        bgGradient = "bg-gradient-to-r from-violet-50 to-purple-50";
        borderColor = "border-violet-200";
        textColor = "text-violet-800";
        shadowColor = "shadow-violet-100";
        break;
      case 4: // Staging
        bgGradient = "bg-gradient-to-r from-emerald-50 to-teal-50";
        borderColor = "border-emerald-200";
        textColor = "text-emerald-800";
        shadowColor = "shadow-emerald-100";
        break;
    }
  } 
  // For Reserve zones
  else {
    switch (zone.areaId) {
      case 1: // Inventory
        bgGradient = "bg-gradient-to-r from-indigo-50 to-blue-50";
        borderColor = "border-indigo-200";
        textColor = "text-indigo-800";
        shadowColor = "shadow-indigo-100";
        break;
      case 2: // Returns
        bgGradient = "bg-gradient-to-r from-orange-50 to-amber-50";
        borderColor = "border-orange-200";
        textColor = "text-orange-800";
        shadowColor = "shadow-orange-100";
        break;
      case 3: // Overflow
        bgGradient = "bg-gradient-to-r from-purple-50 to-violet-50";
        borderColor = "border-purple-200";
        textColor = "text-purple-800";
        shadowColor = "shadow-purple-100";
        break;
      case 4: // Staging
        bgGradient = "bg-gradient-to-r from-teal-50 to-emerald-50";
        borderColor = "border-teal-200";
        textColor = "text-teal-800";
        shadowColor = "shadow-teal-100";
        break;
    }
  }

  // Icon based on face type
  const faceTypeIcon = zone.faceType === "Pick" ? "🔍" : "🔋";

  return (
    <div 
      className={`mb-2 ${isExpanded ? 'w-full col-span-full md:col-span-2' : 'cursor-pointer transform hover:scale-105 transition-all'}`}
      style={zoomStyle}
      onClick={toggleExpand}
    >
      {isExpanded ? (
        // Expanded View
        <div className={`border ${borderColor} rounded-lg ${shadowColor} shadow-sm overflow-hidden transition-all duration-300 ease-in-out`}>
          <div className={`${bgGradient} px-5 py-4 flex justify-between items-center cursor-pointer`}>
            <div className="flex items-center gap-3">
              <div className={`bg-white/80 rounded-full h-8 w-8 flex items-center justify-center ${shadowColor} shadow-sm`}>
                <span className="text-lg">{faceTypeIcon}</span>
              </div>
              <div>
                <h3 className={`font-bold ${textColor}`}>{zone.name}</h3>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className={`text-xs px-2 py-0.5 ${bgGradient.replace('-50', '-100')} ${textColor} rounded-full font-medium`}>{zone.faceType}</span>
                  <span className="text-xs text-gray-500">|</span>
                  <span className="text-xs text-gray-600">{zone.bins.length} bins</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end">
              <div className={`text-sm font-bold ${textColor}`}>{zone.utilization}% utilized</div>
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
      ) : (
        // Collapsed Cube View
        <div className={`${getUtilizationColor(zone.utilization).replace('bg-', 'border-')} border-2 rounded-xl`}>
          {viewType === "grid" ? (
            <div 
              className={`${bgGradient.replace('-50', '-200')} aspect-square w-full rounded-lg shadow-md flex flex-col justify-between p-2 relative overflow-hidden`}
            >
              <div className="flex flex-col h-full">
                <div className="flex justify-end">
                  <div className={`text-[10px] font-medium ${textColor} bg-white/70 rounded-full px-1.5 py-0.5`}>
                    {zone.bins.length} bins
                  </div>
                </div>
                <div className="flex-1 flex items-center justify-center">
                  <div className={`text-xl font-bold ${textColor}`}>{zone.name.replace('Zone ', '')}</div>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <div className={`text-[10px] font-bold ${textColor}`}>{zone.name}</div>
                    <div className={`text-[10px] font-semibold ${textColor}`}>
                      {zone.utilization}%
                    </div>
                  </div>
                  <div className="w-full h-1 bg-white/30 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${getUtilizationColor(zone.utilization)}`}
                      style={{ width: `${zone.utilization}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className={`${bgGradient.replace('-50', '-200')} w-full rounded-lg shadow-md p-3`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`${textColor} text-lg`}>{faceTypeIcon}</div>
                  <div>
                    <div className={`font-bold ${textColor}`}>{zone.name}</div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={`text-xs font-medium ${textColor}`}>{zone.bins.length} bins</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${getUtilizationColor(zone.utilization)}`}
                      style={{ width: `${zone.utilization}%` }}
                    ></div>
                  </div>
                  <div className={`font-bold ${textColor}`}>{zone.utilization}%</div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
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