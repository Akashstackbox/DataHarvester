import { useQuery } from "@tanstack/react-query";
import { AreaWithZonesAndBins, Bin, CategoryDistribution } from "@shared/schema";
import WarehouseDashboard from "@/components/warehouse/WarehouseDashboard";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export default function Home() {
  const { toast } = useToast();
  const [selectedArea, setSelectedArea] = useState<number>(1); // Default to first area (Inventory)
  
  const { data: warehouseData, isLoading: isLoadingWarehouse, refetch: refetchWarehouse } = useQuery<AreaWithZonesAndBins[]>({
    queryKey: ['/api/warehouse'],
    queryFn: async () => {
      // Temporarily use the default warehouse data endpoint while debugging
      const response = await fetch('/api/warehouse');
      if (!response.ok) {
        throw new Error('Failed to fetch warehouse data');
      }
      const data = await response.json();
      console.log("Fetched warehouse data:", data);
      return data;
    }
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
  
  const handleAreaChange = (areaId: number) => {
    setSelectedArea(areaId);
  };
  
  const isLoading = isLoadingWarehouse || isLoadingCritical || isLoadingCategories;
  
  return (
    <WarehouseDashboard
      warehouseData={warehouseData}
      criticalBins={criticalBins}
      categoryDistribution={categoryDistribution}
      isLoading={isLoading}
      onRefresh={handleRefresh}
      onAreaChange={handleAreaChange}
    />
  );
}
