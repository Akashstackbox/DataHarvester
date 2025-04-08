import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function Legend() {
  return (
    <Card className="mb-6 shadow-sm border border-gray-100">
      <CardContent className="p-4">
        <h3 className="text-sm font-medium mb-3 text-secondary">Warehouse Legend</h3>
        
        <div className="space-y-4">
          {/* Bin Utilization */}
          <div>
            <h4 className="text-xs font-medium mb-2">Bin Utilization</h4>
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-sm bg-[#4CAF50]"></div>
                <span className="text-sm">Low (0-50%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-sm bg-[#FFC107]"></div>
                <span className="text-sm">Medium (51-75%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-sm bg-[#F44336]"></div>
                <span className="text-sm">High (76-100%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-sm bg-gray-200"></div>
                <span className="text-sm">Empty</span>
              </div>
            </div>
          </div>
          
          <Separator />
          
          {/* Area Types */}
          <div>
            <h4 className="text-xs font-medium mb-2">Area Types</h4>
            <div className="flex flex-wrap gap-3 mb-2">
              {["Inventory", "Returns", "Overflow", "Staging", "Damage"].map(areaType => (
                <div key={areaType} className="flex items-center gap-2">
                  <span className="text-xs px-2 py-0.5 bg-purple-100 text-purple-800 rounded">{areaType}</span>
                </div>
              ))}
            </div>
          </div>
          
          <Separator />
          
          {/* Zone Face Types */}
          <div>
            <h4 className="text-xs font-medium mb-2">Zone Face Types</h4>
            <div className="flex gap-3 mb-2">
              {["Pick", "Reserve"].map(faceType => (
                <div key={faceType} className="flex items-center gap-2">
                  <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-800 rounded">{faceType}</span>
                </div>
              ))}
            </div>
          </div>
          
          <Separator />
          
          {/* Storage HU Types */}
          <div>
            <h4 className="text-xs font-medium mb-2">Storage HU Types</h4>
            <div className="flex gap-3 mb-2">
              {["Pallet", "Carton", "Crate"].map(huType => (
                <div key={huType} className="flex items-center gap-2">
                  <span className="text-xs px-1.5 py-0.5 bg-gray-100 text-gray-700 rounded">{huType}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
