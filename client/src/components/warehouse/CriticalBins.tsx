import { Card, CardContent } from "@/components/ui/card";
import { Bin } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

interface CriticalBinsProps {
  bins?: Bin[];
  isLoading: boolean;
}

export default function CriticalBins({ bins, isLoading }: CriticalBinsProps) {
  // Function to get storage type icon
  const getStorageIcon = (storageType?: string) => {
    if (!storageType) return "📦";
    if (storageType === "Pallet") return "🔳";
    if (storageType === "Carton") return "📦";
    if (storageType === "Crate") return "🗄️";
    return "📦";
  };
  
  // Function to get gradient style based on utilization percentage
  const getUtilizationStyle = (percent: number) => {
    if (percent === 0) return {
      gradient: "bg-gradient-to-r from-gray-200 to-gray-300",
      text: "text-gray-500",
      border: "border-gray-300",
      progress: "bg-gray-400"
    };
    
    if (percent <= 50) return {
      gradient: "bg-gradient-to-r from-green-400 to-green-500",
      text: "text-green-700",
      border: "border-green-400",
      progress: "bg-green-500"
    };
    
    if (percent <= 75) return {
      gradient: "bg-gradient-to-r from-amber-400 to-amber-500",
      text: "text-amber-700",
      border: "border-amber-400",
      progress: "bg-amber-500"
    };
    
    return {
      gradient: "bg-gradient-to-r from-red-400 to-red-500",
      text: "text-red-700",
      border: "border-red-400",
      progress: "bg-red-500"
    };
  };
  
  return (
    <Card className="shadow-lg border-0 h-full">
      <div className="bg-gradient-to-r from-red-600 to-rose-600 text-white p-4">
        <h3 className="font-bold flex items-center gap-2">
          <span>⚠️</span> Critical Bins
        </h3>
      </div>
      
      <CardContent className="p-5 mt-1">
        {isLoading ? (
          <div className="space-y-4">
            {Array(5).fill(0).map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-3 border border-dashed border-gray-200 rounded-lg">
                <Skeleton className="w-12 h-12 rounded-lg" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-2 w-full rounded-full" />
                </div>
              </div>
            ))}
          </div>
        ) : bins && bins.length > 0 ? (
          <div className="space-y-3">
            {bins.map((bin) => {
              const style = getUtilizationStyle(bin.utilizationPercent);
              return (
                <div 
                  key={bin.id} 
                  className={`p-3 border ${style.border} rounded-lg flex items-center gap-4 transition-all hover:shadow-md`}
                >
                  <div className={`rounded-lg w-12 h-12 ${style.gradient} text-white flex items-center justify-center shadow-sm`}>
                    <div className="text-2xl">{getStorageIcon(bin.storageHUType)}</div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="font-bold">{bin.binId}</span>
                        <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full ml-2">{bin.category}</span>
                      </div>
                      <div className={`font-bold text-lg ${style.text}`}>{bin.utilizationPercent}%</div>
                    </div>
                    
                    <div className="mt-1 flex items-center gap-2">
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${style.gradient}`}
                          style={{ width: `${bin.utilizationPercent}%` }}
                        ></div>
                      </div>
                      
                      <div className="text-xs">
                        {bin.maxVolume && <span>Vol: {bin.maxVolume}</span>}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 rounded-lg border border-dashed border-gray-200">
            <div className="bg-gray-50 rounded-full w-16 h-16 mx-auto flex items-center justify-center mb-3">
              <span className="text-3xl">✅</span>
            </div>
            <p className="font-medium text-gray-700">No critical bins detected</p>
            <p className="text-sm text-gray-500 mt-1">All bins are operating within normal capacity levels</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
