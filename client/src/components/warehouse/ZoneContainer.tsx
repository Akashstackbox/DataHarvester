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
  
  return (
    <div className="border-b border-gray-100" style={zoomStyle}>
      <div className="bg-neutral-100 px-4 py-3 flex justify-between items-center">
        <h3 className="font-medium">{zone.name}</h3>
        <div className="text-sm text-gray-600">{zone.bins.length} bins • {zone.utilization}% utilized</div>
      </div>
      
      <div className="p-4">
        {viewType === "grid" ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {zone.bins.map(bin => (
              <BinCard key={bin.id} bin={bin} />
            ))}
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {zone.bins.map(bin => (
              <div key={bin.id} className="py-2 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <BinUtilizationIndicator utilizationPercent={bin.utilizationPercent} />
                  <span className="font-medium">{bin.binId}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm">{bin.category}</span>
                  <span className="text-sm font-medium">{bin.utilizationPercent}%</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function BinUtilizationIndicator({ utilizationPercent }: { utilizationPercent: number }) {
  let bgColor = "bg-gray-200";
  
  if (utilizationPercent > 0) {
    if (utilizationPercent <= 50) {
      bgColor = "bg-[#4CAF50]";
    } else if (utilizationPercent <= 75) {
      bgColor = "bg-[#FFC107]";
    } else {
      bgColor = "bg-[#F44336]";
    }
  }
  
  return <div className={`w-3 h-3 rounded-full ${bgColor}`}></div>;
}
