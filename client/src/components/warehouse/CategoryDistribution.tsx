import { Card, CardContent } from "@/components/ui/card";
import { CategoryDistribution } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

interface CategoryDistributionChartProps {
  distribution?: CategoryDistribution[];
  isLoading: boolean;
}

export default function CategoryDistributionChart({ distribution, isLoading }: CategoryDistributionChartProps) {
  // Define colors for the categories
  const colors = [
    "bg-primary",
    "bg-[#4CAF50]", 
    "bg-[#FFC107]", 
    "bg-[#F44336]",
    "bg-[#9C27B0]",
    "bg-gray-400"
  ];
  
  return (
    <Card className="shadow-sm border border-gray-100">
      <CardContent className="p-4">
        <h3 className="text-sm font-medium mb-3 text-secondary">Distribution by Category</h3>
        
        {isLoading ? (
          <div className="space-y-3">
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className="flex items-center">
                <Skeleton className="w-3 h-3 rounded-full mr-2" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ))}
          </div>
        ) : distribution && distribution.length > 0 ? (
          <div className="space-y-3">
            {distribution.map((item, index) => (
              <div key={index} className="flex items-center">
                <div 
                  className={`w-3 h-3 rounded-full ${colors[index % colors.length]} mr-2`}
                ></div>
                <span className="text-xs">
                  {item.category} ({item.percentage}%)
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-sm text-gray-500 text-center">
            No category data available
          </div>
        )}
      </CardContent>
    </Card>
  );
}
