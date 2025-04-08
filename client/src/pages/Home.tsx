import { useQuery } from "@tanstack/react-query";
import { AreaWithZonesAndBins, Bin, CategoryDistribution } from "@shared/schema";
import WarehouseDashboard from "@/components/warehouse/WarehouseDashboard";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const { toast } = useToast();
  
  const { data: warehouseData, isLoading: isLoadingWarehouse, refetch: refetchWarehouse } = useQuery<AreaWithZonesAndBins>({
    queryKey: ['/api/warehouse'],
  });
  
  const { data: criticalBins, isLoading: isLoadingCritical } = useQuery<Bin[]>({
    queryKey: ['/api/warehouse/critical-bins'],
  });
  
  const { data: categoryDistribution, isLoading: isLoadingCategories } = useQuery<CategoryDistribution[]>({
    queryKey: ['/api/warehouse/category-distribution'],
  });
  
  const handleRefresh = async () => {
    try {
      await refetchWarehouse();
      toast({
        title: "Data refreshed",
        description: "Warehouse data has been updated",
      });
    } catch (error) {
      toast({
        title: "Refresh failed",
        description: "Could not refresh warehouse data",
        variant: "destructive",
      });
    }
  };
  
  const isLoading = isLoadingWarehouse || isLoadingCritical || isLoadingCategories;
  
  return (
    <WarehouseDashboard
      warehouseData={warehouseData}
      criticalBins={criticalBins}
      categoryDistribution={categoryDistribution}
      isLoading={isLoading}
      onRefresh={handleRefresh}
    />
  );
}
