import { Bin } from "@shared/schema";

export default function BinCard({ bin }: { bin: Bin }) {
  const { binId, utilizationPercent, category, maxVolume, storageHUType, binPalletCapacity, skuEligibility } = bin;

  const style = utilizationPercent > 75 
    ? { bg: "from-red-50 to-red-200", text: "text-red-800", progress: "bg-red-500" }
    : utilizationPercent > 50
    ? { bg: "from-amber-50 to-amber-200", text: "text-amber-800", progress: "bg-amber-500" }
    : utilizationPercent > 0
    ? { bg: "from-green-50 to-green-200", text: "text-green-800", progress: "bg-green-500" }
    : { bg: "from-gray-100 to-gray-300", text: "text-gray-700", progress: "bg-gray-400" };

  const eligibilityColor = skuEligibility === 'AllEligible' ? 'bg-blue-500' 
    : skuEligibility === 'MixedEligibility' ? 'bg-purple-500' 
    : 'bg-red-500';

  return (
    <div className={`bg-gradient-to-br ${style.bg} rounded-lg shadow-md overflow-hidden relative group hover:shadow-lg transition-all duration-300`}>
      <div className={`absolute top-0 right-0 w-2 h-2 ${eligibilityColor} rounded-full m-1`}></div>
      <div className="p-3">
        <div className="flex justify-between items-center">
          <div className={`font-bold text-sm ${style.text}`}>{binId}</div>
          <div className="text-xs">{storageHUType === "Pallet" ? "🔳" : "📦"}</div>
        </div>
        <div className="mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div className={`h-full ${style.progress} rounded-full`} style={{width: `${utilizationPercent}%`}}></div>
        </div>
        <div className={`text-xs font-medium mt-1 ${style.text}`}>{utilizationPercent}% full</div>
      </div>
      <div className="absolute inset-0 bg-white/95 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-center items-center p-1 text-[10px] gap-0.5">
        <div className="font-bold text-primary">{binId}</div>
        <div className="font-semibold">{utilizationPercent}%</div>
        <div className="flex gap-1 flex-wrap justify-center">
          <span className="bg-gray-100 rounded px-1">{storageHUType}</span>
          <span>V:{maxVolume}</span>
          {binPalletCapacity && <span>P:{binPalletCapacity}</span>}
        </div>
        <div className="bg-blue-100 text-blue-800 rounded px-1 truncate w-full text-center">{category?.split(' ')[0] || "Uncategorized"}</div>
        <div className={`rounded px-1 w-full flex items-center justify-center gap-1 ${
          skuEligibility === 'AllEligible' ? 'bg-blue-100 text-blue-800' : 
          skuEligibility === 'MixedEligibility' ? 'bg-purple-100 text-purple-800' : 
          'bg-red-100 text-red-800'}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${eligibilityColor}`}></span>
          {skuEligibility === 'AllEligible' ? 'All Eligible' : 
           skuEligibility === 'MixedEligibility' ? 'Mixed SKUs' : 
           'All Ineligible'}
        </div>
      </div>
    </div>
  );
}