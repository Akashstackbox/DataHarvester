import { Card, CardContent } from "@/components/ui/card";
import { Bin } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

interface CriticalBinsProps {
  bins?: Bin[];
  isLoading: boolean;
}

export default function CriticalBins({ bins, isLoading }: CriticalBinsProps) {
  return (
    <Card className="shadow-sm border border-gray-100">
      <CardContent className="p-4">
        <h3 className="text-sm font-medium mb-3 text-secondary">Critical Bins</h3>
        
        {isLoading ? (
          <div className="space-y-3">
            {Array(5).fill(0).map((_, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100">
                <div className="flex items-center">
                  <Skeleton className="w-3 h-3 rounded-full mr-2" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <Skeleton className="h-4 w-12" />
              </div>
            ))}
          </div>
        ) : bins && bins.length > 0 ? (
          <div className="space-y-3">
            {bins.map((bin, index) => {
              // Determine indicator color based on utilization percentage
              let indicatorColor = "bg-gray-200";
              
              if (bin.utilizationPercent > 0) {
                if (bin.utilizationPercent <= 50) {
                  indicatorColor = "bg-[#4CAF50]";
                } else if (bin.utilizationPercent <= 75) {
                  indicatorColor = "bg-[#FFC107]";
                } else if (bin.utilizationPercent <= 90) {
                  indicatorColor = "bg-[#F44336]";
                } else {
                  indicatorColor = "bg-[#9C27B0]";
                }
              }
              
              const isLast = index === bins.length - 1;
              
              return (
                <div 
                  key={bin.id} 
                  className={`flex items-center justify-between py-2 ${!isLast ? 'border-b border-gray-100' : ''}`}
                >
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full ${indicatorColor} mr-2`}></div>
                    <span className="text-xs font-medium">Bin {bin.binId}</span>
                  </div>
                  <span className="text-xs">{bin.utilizationPercent}% full</span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-sm text-gray-500 text-center">
            No critical bins to display
          </div>
        )}
      </CardContent>
    </Card>
  );
}
