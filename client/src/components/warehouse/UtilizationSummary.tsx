import { Card, CardContent } from "@/components/ui/card";
import { AreaWithZonesAndBins } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

interface UtilizationSummaryProps {
  area?: AreaWithZonesAndBins;
  isLoading: boolean;
}

export default function UtilizationSummary({ area, isLoading }: UtilizationSummaryProps) {
  return (
    <Card className="shadow-sm border border-gray-100">
      <CardContent className="p-4">
        <h3 className="text-sm font-medium mb-3 text-secondary">Utilization Summary</h3>
        
        {isLoading ? (
          <div className="space-y-3">
            {Array(4).fill(0).map((_, i) => (
              <div key={i}>
                <div className="flex justify-between mb-1">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-8" />
                </div>
                <Skeleton className="h-2 w-full" />
              </div>
            ))}
          </div>
        ) : area ? (
          <div className="space-y-3">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-xs font-medium">Overall</span>
                <span className="text-xs font-medium">{area.overallUtilization}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full" 
                  style={{ width: `${area.overallUtilization}%` }}
                ></div>
              </div>
            </div>
            
            {area.zones.map(zone => (
              <div key={zone.id}>
                <div className="flex justify-between mb-1">
                  <span className="text-xs font-medium">{zone.name}</span>
                  <span className="text-xs font-medium">{zone.utilization}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full" 
                    style={{ width: `${zone.utilization}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-sm text-gray-500 text-center">
            No utilization data available
          </div>
        )}
      </CardContent>
    </Card>
  );
}
