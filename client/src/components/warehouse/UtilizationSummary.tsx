import { Card, CardContent } from "@/components/ui/card";
import { AreaWithZonesAndBins } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

interface UtilizationSummaryProps {
  area?: AreaWithZonesAndBins;
  isLoading: boolean;
}

export default function UtilizationSummary({ area, isLoading }: UtilizationSummaryProps) {
  // Function to get utilization color & gradient
  const getUtilizationStyle = (percent: number) => {
    if (percent === 0) return {
      gradient: "bg-gradient-to-r from-gray-400 to-gray-500",
      bgLight: "bg-gray-100",
      text: "text-gray-600",
      icon: "⚪"
    };
    
    if (percent <= 50) return {
      gradient: "bg-gradient-to-r from-green-400 to-green-500",
      bgLight: "bg-green-50",
      text: "text-green-600",
      icon: "🟢"
    };
    
    if (percent <= 75) return {
      gradient: "bg-gradient-to-r from-amber-400 to-amber-500",
      bgLight: "bg-amber-50",
      text: "text-amber-600",
      icon: "🟡"
    };
    
    return {
      gradient: "bg-gradient-to-r from-red-400 to-red-500",
      bgLight: "bg-red-50",
      text: "text-red-600",
      icon: "🔴"
    };
  };
  
  // Calculate some stats
  const getStats = (area?: AreaWithZonesAndBins) => {
    if (!area) return { totalBins: 0, avgUtilization: 0 };
    
    const totalBins = area.zones.reduce((sum, zone) => sum + zone.bins.length, 0);
    const zoneUtilSum = area.zones.reduce((sum, zone) => sum + zone.utilization, 0);
    const avgZoneUtilization = zoneUtilSum / area.zones.length;
    
    return { totalBins, avgUtilization: avgZoneUtilization };
  };
  
  const { totalBins, avgUtilization } = getStats(area);
  const overallStyle = area ? getUtilizationStyle(area.overallUtilization) : getUtilizationStyle(0);
  
  return (
    <Card className="shadow-lg border-0 h-full">
      <div className="bg-gradient-to-r from-blue-600 to-primary text-white p-4">
        <h3 className="font-bold flex items-center gap-2">
          <span>📊</span> Utilization Summary
        </h3>
      </div>
      
      <CardContent className="p-5 mt-1">
        {isLoading ? (
          <div className="space-y-5">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="flex-1 ml-4">
                <Skeleton className="h-5 w-40 mb-2" />
                <Skeleton className="h-3 w-full" />
              </div>
            </div>
            
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="flex items-center">
                <Skeleton className="w-10 h-10 rounded-md mr-3" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-2 w-full rounded-full" />
                </div>
              </div>
            ))}
          </div>
        ) : area ? (
          <div className="space-y-5">
            {/* Overall utilization card */}
            <div className={`p-4 ${overallStyle.bgLight} rounded-lg border border-l-4 border-l-primary shadow-sm`}>
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 bg-white rounded-full shadow-md flex items-center justify-center">
                  <div className="text-2xl">{overallStyle.icon}</div>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-gray-800">Overall Utilization</h4>
                    <div className={`text-lg font-bold ${overallStyle.text}`}>{area.overallUtilization}%</div>
                  </div>
                  
                  <div className="text-xs text-gray-500 mb-2">
                    {area.zones.length} zones • {totalBins} bins • {avgUtilization.toFixed(1)}% avg zone utilization
                  </div>
                  
                  <div className="w-full bg-white/50 rounded-full h-2.5 overflow-hidden shadow-inner">
                    <div 
                      className={`h-full ${overallStyle.gradient}`} 
                      style={{ width: `${area.overallUtilization}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Zone utilization list */}
            <div className="space-y-3 mt-4">
              {area.zones.map(zone => {
                const zoneStyle = getUtilizationStyle(zone.utilization);
                return (
                  <div key={zone.id} className="p-3 rounded-lg bg-white border border-gray-100 hover:shadow-sm transition-shadow">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 ${zoneStyle.gradient} rounded-md shadow-sm text-white flex items-center justify-center`}>
                        <span>{zone.faceType === "Pick" ? "🔍" : "🔋"}</span>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <div className="font-medium text-gray-800 flex items-center gap-1">
                            {zone.name}
                            <span className="text-xs bg-gray-100 py-0.5 px-1.5 rounded text-gray-500 ml-1">{zone.faceType}</span>
                          </div>
                          <div className={`font-bold ${zoneStyle.text}`}>{zone.utilization}%</div>
                        </div>
                        
                        <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                          <div 
                            className={`h-full ${zoneStyle.gradient}`} 
                            style={{ width: `${zone.utilization}%` }}
                          ></div>
                        </div>
                        
                        <div className="text-xs text-gray-500 mt-1 text-right">{zone.bins.length} bins</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="text-center py-12 rounded-lg border border-dashed border-gray-200">
            <div className="bg-gray-50 rounded-full w-16 h-16 mx-auto flex items-center justify-center mb-3">
              <span className="text-3xl">📈</span>
            </div>
            <p className="font-medium text-gray-700">No utilization data available</p>
            <p className="text-sm text-gray-500 mt-1">Summary will appear when data is loaded</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
