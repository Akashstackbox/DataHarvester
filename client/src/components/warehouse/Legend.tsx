import { Card, CardContent } from "@/components/ui/card";

export default function Legend() {
  return (
    <Card className="mb-6 shadow-sm border border-gray-100">
      <CardContent className="p-4">
        <h3 className="text-sm font-medium mb-3 text-secondary">Bin Utilization Legend</h3>
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
            <span className="text-sm">High (76-90%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-sm bg-[#9C27B0]"></div>
            <span className="text-sm">Very High (91-100%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-sm bg-gray-200"></div>
            <span className="text-sm">Empty</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
