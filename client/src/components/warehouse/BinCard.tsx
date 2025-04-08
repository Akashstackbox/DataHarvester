import { Bin } from "@shared/schema";

interface BinCardProps {
  bin: Bin;
}

export default function BinCard({ bin }: BinCardProps) {
  const { binId, utilizationPercent, category, maxVolume, storageHUType, binPalletCapacity } = bin;
  
  // Determine background color based on utilization percentage
  let bgColor = "bg-gray-200";
  
  if (utilizationPercent > 0) {
    if (utilizationPercent <= 50) {
      bgColor = "bg-[#4CAF50]"; // Low utilization (green)
    } else if (utilizationPercent <= 75) {
      bgColor = "bg-[#FFC107]"; // Medium utilization (yellow)
    } else {
      bgColor = "bg-[#F44336]"; // High utilization (red)
    }
  }
  
  return (
    <div className={`${bgColor} rounded-md shadow-sm overflow-hidden relative group`}>
      <div className="p-3">
        <div className="font-medium text-sm">{binId}</div>
        <div className="text-xs font-medium mt-1">{utilizationPercent}%</div>
      </div>
      
      {/* Enhanced tooltip that appears on hover with all bin details */}
      <div className="absolute inset-0 bg-white/90 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-center items-center p-2 text-center">
        <div className="text-xs font-medium">Bin {binId}</div>
        <div className="text-xs mt-1">{utilizationPercent}% utilized</div>
        <div className="text-xs mt-0.5">{storageHUType} Type</div>
        <div className="text-xs mt-0.5">Vol: {maxVolume} units</div>
        {binPalletCapacity && (
          <div className="text-xs mt-0.5">Pallet Cap: {binPalletCapacity}</div>
        )}
        <div className="text-xs text-gray-500 mt-0.5">{category || "Uncategorized"}</div>
      </div>
    </div>
  );
}
