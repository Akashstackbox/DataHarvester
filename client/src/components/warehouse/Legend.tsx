import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react";
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";

export default function Legend() {
  const [isOpen, setIsOpen] = useState(false);
  
  // Area types with icons and colors
  const areaTypes = [
    { name: "Inventory", icon: "📦", color: "bg-gradient-to-r from-blue-500 to-indigo-600" },
    { name: "Returns", icon: "↩️", color: "bg-gradient-to-r from-amber-500 to-orange-600" },
    { name: "Overflow", icon: "🔄", color: "bg-gradient-to-r from-violet-500 to-purple-600" },
    { name: "Staging", icon: "🚧", color: "bg-gradient-to-r from-emerald-500 to-teal-600" },
    { name: "Damage", icon: "⚠️", color: "bg-gradient-to-r from-rose-500 to-red-600" }
  ];
  
  // Zone face types with icons
  const faceTypes = [
    { name: "Pick", icon: "🔍", color: "bg-blue-100 text-blue-800" },
    { name: "Reserve", icon: "🔋", color: "bg-emerald-100 text-emerald-800" }
  ];
  
  // Storage HU types with icons
  const storageTypes = [
    { name: "Pallet", icon: "🔳", color: "bg-gray-100 text-gray-800" },
    { name: "Carton", icon: "📦", color: "bg-gray-100 text-gray-800" },
    { name: "Crate", icon: "🗄️", color: "bg-gray-100 text-gray-800" }
  ];
  
  // Utilization levels
  const utilizationLevels = [
    { name: "Low (0-50%)", color: "bg-gradient-to-r from-green-400 to-green-500" },
    { name: "Medium (51-75%)", color: "bg-gradient-to-r from-amber-400 to-amber-500" },
    { name: "High (76-100%)", color: "bg-gradient-to-r from-red-400 to-red-500" },
    { name: "Empty", color: "bg-gradient-to-r from-gray-200 to-gray-300" }
  ];
  
  // SKU eligibility types
  const skuEligibilityTypes = [
    { name: "All Eligible", color: "bg-blue-500" },
    { name: "Mixed Eligibility", color: "bg-purple-500" },
    { name: "All Ineligible", color: "bg-red-500" }
  ];
  
  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="mb-6 w-full"
    >
      <Card className="shadow-lg border-0 overflow-hidden">
        <CollapsibleTrigger asChild>
          <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white p-4 cursor-pointer hover:from-slate-700 hover:to-slate-800 transition-colors flex justify-between items-center">
            <h3 className="text-base font-bold flex items-center gap-2">
              <HelpCircle className="h-5 w-5" />
              Warehouse Legend
            </h3>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 text-white">
              {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent className="p-5 bg-white/95">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Bin Utilization */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-bold mb-3 text-gray-800 flex items-center gap-2">
                  <div className="w-1 h-5 bg-primary rounded-full"></div>
                  Bin Utilization
                </h4>
                <div className="flex flex-wrap gap-3">
                  {utilizationLevels.map(level => (
                    <div key={level.name} className="flex items-center gap-2 bg-white px-2 py-1 rounded-md shadow-sm">
                      <div className={`w-4 h-4 rounded-full ${level.color}`}></div>
                      <span className="text-sm font-medium">{level.name}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* SKU Eligibility */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-bold mb-3 text-gray-800 flex items-center gap-2">
                  <div className="w-1 h-5 bg-primary rounded-full"></div>
                  SKU Eligibility
                </h4>
                <div className="flex flex-wrap gap-3">
                  {skuEligibilityTypes.map(type => (
                    <div key={type.name} className="flex items-center gap-2 bg-white px-2 py-1 rounded-md shadow-sm">
                      <div className={`w-4 h-4 rounded-full ${type.color}`}></div>
                      <span className="text-sm font-medium">{type.name}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-2 text-xs text-gray-600 bg-blue-50 p-2 rounded border border-blue-100">
                  <strong>Note:</strong> SKU eligibility is indicated by a dot in the top-right corner of each bin.
                </div>
              </div>
              
              {/* Area Types */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-bold mb-3 text-gray-800 flex items-center gap-2">
                  <div className="w-1 h-5 bg-primary rounded-full"></div>
                  Area Types
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {areaTypes.map(type => (
                    <div key={type.name} className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg shadow-sm">
                      <div className={`w-8 flex items-center justify-center h-8 ${type.color} text-white rounded-md`}>
                        <span>{type.icon}</span>
                      </div>
                      <span className="text-sm font-medium">{type.name}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Zone Face Types */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-bold mb-3 text-gray-800 flex items-center gap-2">
                  <div className="w-1 h-5 bg-primary rounded-full"></div>
                  Zone Face Types
                </h4>
                <div className="flex gap-3">
                  {faceTypes.map(type => (
                    <div key={type.name} className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-md shadow-sm flex-1">
                      <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-sm">
                        <span>{type.icon}</span>
                      </div>
                      <div>
                        <span className="text-sm font-medium">{type.name}</span>
                        <div className={`text-xs px-2 py-0.5 ${type.color} rounded-full mt-1 inline-block`}>{type.name}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Storage HU Types */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-bold mb-3 text-gray-800 flex items-center gap-2">
                  <div className="w-1 h-5 bg-primary rounded-full"></div>
                  Storage HU Types
                </h4>
                <div className="grid grid-cols-3 gap-3">
                  {storageTypes.map(type => (
                    <div key={type.name} className="flex flex-col items-center bg-white p-3 rounded-lg shadow-sm">
                      <div className="text-2xl mb-1">{type.icon}</div>
                      <span className={`text-xs px-2 py-0.5 ${type.color} rounded-full`}>{type.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
