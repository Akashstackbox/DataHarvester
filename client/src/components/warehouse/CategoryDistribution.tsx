import { Card, CardContent } from "@/components/ui/card";
import { CategoryDistribution } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

interface CategoryDistributionChartProps {
  distribution?: CategoryDistribution[];
  isLoading: boolean;
}

export default function CategoryDistributionChart({ distribution, isLoading }: CategoryDistributionChartProps) {
  // Define colors and icons for the categories
  const categoryInfo = {
    "Electronics": { color: "from-blue-400 to-blue-600", icon: "🔌" },
    "Packaging": { color: "from-amber-400 to-amber-600", icon: "📦" },
    "Appliances": { color: "from-teal-400 to-teal-600", icon: "🧰" },
    "Office Supplies": { color: "from-indigo-400 to-indigo-600", icon: "📝" },
    "Tools": { color: "from-slate-400 to-slate-600", icon: "🔧" },
    "Clothing": { color: "from-pink-400 to-pink-600", icon: "👕" },
    "Books": { color: "from-orange-400 to-orange-600", icon: "📚" },
    "Toys": { color: "from-purple-400 to-purple-600", icon: "🧸" },
    "Sporting Goods": { color: "from-green-400 to-green-600", icon: "🏀" },
    "Hardware": { color: "from-red-400 to-red-600", icon: "🔨" },
    "Kitchen": { color: "from-cyan-400 to-cyan-600", icon: "🍽️" },
    "Garden": { color: "from-lime-400 to-lime-600", icon: "🌱" },
    "Automotive": { color: "from-gray-400 to-gray-600", icon: "🚗" },
    "Pet Supplies": { color: "from-rose-400 to-rose-600", icon: "🐾" },
    "Empty": { color: "from-gray-300 to-gray-400", icon: "⬜" },
    "Other": { color: "from-gray-400 to-gray-600", icon: "📋" }
  };
  
  // Fallback colors for categories not in our predefined list
  const fallbackColors = [
    "from-blue-400 to-blue-600",
    "from-green-400 to-green-600", 
    "from-amber-400 to-amber-600", 
    "from-red-400 to-red-600",
    "from-purple-400 to-purple-600",
    "from-gray-400 to-gray-600"
  ];
  
  // Get color gradient and icon for a category
  const getCategoryStyle = (category: string, index: number) => {
    const info = categoryInfo[category as keyof typeof categoryInfo];
    if (info) {
      return {
        color: `bg-gradient-to-r ${info.color}`,
        icon: info.icon
      };
    }
    
    return {
      color: `bg-gradient-to-r ${fallbackColors[index % fallbackColors.length]}`,
      icon: '📋'
    };
  };
  
  return (
    <Card className="shadow-lg border-0 h-full">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4">
        <h3 className="font-bold flex items-center gap-2">
          <span>📊</span> Distribution by Category
        </h3>
      </div>
      
      <CardContent className="p-5 mt-1">
        {isLoading ? (
          <div className="space-y-4">
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className="flex items-center">
                <Skeleton className="w-8 h-8 rounded-md mr-3" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-2 w-full rounded-full" />
                </div>
              </div>
            ))}
          </div>
        ) : distribution && distribution.length > 0 ? (
          <div className="space-y-4">
            {distribution.map((item, index) => {
              const { color, icon } = getCategoryStyle(item.category, index);
              return (
                <div key={index} className="flex items-center">
                  <div className={`w-10 h-10 ${color} rounded-lg text-white flex items-center justify-center shadow-md mr-3`}>
                    <span className="text-lg">{icon}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium">{item.category}</span>
                      <span className="font-bold">{item.percentage}%</span>
                    </div>
                    <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${color}`}
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <div className="bg-gray-100 rounded-full w-14 h-14 mx-auto flex items-center justify-center mb-3">
              <span className="text-2xl">📊</span>
            </div>
            <p className="font-medium">No category data available</p>
            <p className="text-sm text-gray-400 mt-1">Distribution data will appear here</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
