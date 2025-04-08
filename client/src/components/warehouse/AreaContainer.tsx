import { AreaWithZonesAndBins } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import ZoneContainer from "./ZoneContainer";

interface AreaContainerProps {
  area: AreaWithZonesAndBins;
  selectedZone: string;
  viewType: "grid" | "list";
  zoomLevel: number;
}

export default function AreaContainer({ area, selectedZone, viewType, zoomLevel }: AreaContainerProps) {
  const totalBins = area.zones.reduce((sum, zone) => sum + zone.bins.length, 0);
  
  const filteredZones = selectedZone === "all" 
    ? area.zones 
    : area.zones.filter(zone => zone.name === selectedZone);
  
  return (
    <Card className="shadow-sm border border-gray-100 overflow-hidden">
      <div className="border-b border-gray-100 p-4">
        <h2 className="text-lg font-semibold">{area.name}</h2>
        <p className="text-sm text-gray-500">
          Overall utilization: {area.overallUtilization}% • {area.zones.length} zones • {totalBins} bins
        </p>
      </div>
      
      {filteredZones.map(zone => (
        <ZoneContainer 
          key={zone.id} 
          zone={zone} 
          viewType={viewType}
          zoomLevel={zoomLevel}
        />
      ))}
    </Card>
  );
}
