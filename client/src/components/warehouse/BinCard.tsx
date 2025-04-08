import { Bin } from "@shared/schema";

interface BinCardProps {
  bin: Bin;
}

export default function BinCard({ bin }: BinCardProps) {
  const { binId, utilizationPercent, category, maxVolume, storageHUType, binPalletCapacity } = bin;
  
  // Determine color scheme based on utilization percentage
  let bgGradient = "bg-gradient-to-br from-gray-100 to-gray-300";
  let textColor = "text-gray-700";
  let iconColor = "text-gray-400";
  let progressColor = "bg-gray-400";
  
  if (utilizationPercent > 0) {
    if (utilizationPercent <= 50) {
      bgGradient = "bg-gradient-to-br from-green-50 to-green-200"; // Low utilization
      textColor = "text-green-800";
      iconColor = "text-green-600";
      progressColor = "bg-green-500";
    } else if (utilizationPercent <= 75) {
      bgGradient = "bg-gradient-to-br from-amber-50 to-amber-200"; // Medium utilization
      textColor = "text-amber-800";
      iconColor = "text-amber-600";
      progressColor = "bg-amber-500";
    } else {
      bgGradient = "bg-gradient-to-br from-red-50 to-red-200"; // High utilization
      textColor = "text-red-800";
      iconColor = "text-red-600";
      progressColor = "bg-red-500";
    }
  }
  
  // Choose icon based on storage type
  let storageIcon = "📦"; // default
  if (storageHUType === "Pallet") storageIcon = "🔳";
  if (storageHUType === "Carton") storageIcon = "📦";
  if (storageHUType === "Crate") storageIcon = "🗄️";
  
  // For compact tooltips, shorten the category name if needed
  const shortenedCategory = category && category.length > 10 
    ? category.substring(0, 9) + "..." 
    : category || "Uncategorized";
  
  return (
    <div className={`${bgGradient} rounded-lg shadow-md overflow-hidden relative group hover:shadow-lg transition-all duration-300`}>
      <div className="p-3">
        <div className="flex justify-between items-center">
          <div className={`font-bold text-sm ${textColor}`}>{binId}</div>
          <div className={`text-xs ${iconColor}`}>{storageIcon}</div>
        </div>
        
        {/* Progress bar */}
        <div className="mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className={`h-full ${progressColor} rounded-full`} 
            style={{ width: `${utilizationPercent}%` }}
          ></div>
        </div>
        
        <div className={`text-xs font-medium mt-1 ${textColor}`}>{utilizationPercent}% full</div>
      </div>
      
      {/* Ultra compact tooltip for small bins */}
      <div className="absolute inset-0 bg-white/95 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-center items-center p-0.5 text-center shadow-inner z-10">
        <div className="text-xs font-bold text-primary leading-tight">{binId}</div>
        <div className="text-[10px] font-semibold leading-tight mt-0.5">{utilizationPercent}%</div>
        
        <div className="flex flex-wrap justify-center gap-x-1 mt-0.5">
          <div className="text-[10px] font-medium leading-tight px-1 bg-gray-100 rounded text-gray-700">{storageHUType}</div>
          <div className="text-[10px] font-medium leading-tight">V:{maxVolume}</div>
          {binPalletCapacity && (
            <div className="text-[10px] font-medium leading-tight">P:{binPalletCapacity}</div>
          )}
        </div>
        
        <div className="mt-0.5 text-[10px] font-medium bg-blue-100 text-blue-800 rounded px-1 py-px leading-tight w-full max-w-full overflow-hidden text-ellipsis whitespace-nowrap">
          {shortenedCategory}
        </div>
      </div>
    </div>
  );
}
