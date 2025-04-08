import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TimeSlot {
  time: string;
  utilization: number;
}

interface ZoneTimeData {
  zoneName: string;
  timeSlots: TimeSlot[];
}

interface TimeBasedHeatmapProps {
  isLoading: boolean;
}

export default function TimeBasedHeatmap({ isLoading }: TimeBasedHeatmapProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Current hour for highlighting
  const currentHour = new Date().getHours();
  const currentTimeString = `${currentHour.toString().padStart(2, '0')}:00`;
  
  // Mock data for the time-based heatmap
  const generateMockTimeData = (): ZoneTimeData[] => {
    const zones = ["Zone A", "Zone B", "Zone C"];
    const times = Array.from({ length: 24 }, (_, i) => {
      const hour = i.toString().padStart(2, '0');
      return `${hour}:00`;
    });
    
    return zones.map(zoneName => {
      const timeSlots = times.map(time => {
        // Generate utilization values that change over time to create patterns
        let utilization: number;
        const hour = parseInt(time.split(':')[0]);
        
        if (zoneName === "Zone A") {
          // Zone A has peak utilization in the morning
          utilization = hour >= 8 && hour <= 12 
            ? Math.floor(70 + Math.random() * 30) 
            : Math.floor(30 + Math.random() * 40);
        } else if (zoneName === "Zone B") {
          // Zone B has peak utilization in the afternoon
          utilization = hour >= 13 && hour <= 17
            ? Math.floor(65 + Math.random() * 35)
            : Math.floor(25 + Math.random() * 45);
        } else {
          // Zone C has peak utilization in the evening
          utilization = hour >= 18 || hour <= 2
            ? Math.floor(75 + Math.random() * 25)
            : Math.floor(20 + Math.random() * 40);
        }
        
        return { time, utilization };
      });
      
      return { zoneName, timeSlots };
    });
  };
  
  const [timeData] = useState<ZoneTimeData[]>(generateMockTimeData());
  
  // Scroll to current time on initial render
  useEffect(() => {
    if (scrollRef.current) {
      const cellWidth = 80; // Width of each time cell in pixels
      
      // Scroll to position based on current hour (centered)
      scrollRef.current.scrollLeft = (currentHour * cellWidth) - (scrollRef.current.clientWidth / 2) + (cellWidth / 2);
    }
  }, [currentHour]);
  
  // Determine if a time slot is in the future (after current time)
  const isFutureTime = (timeStr: string): boolean => {
    const hour = parseInt(timeStr.split(':')[0]);
    return hour > currentHour;
  };
  
  // Function to get color based on utilization and time
  const getUtilizationColor = (percent: number, timeStr: string): string => {
    // If time is in the future, return gray
    if (isFutureTime(timeStr)) {
      return "bg-gray-300";
    }
    
    // Otherwise color based on utilization
    if (percent >= 90) return "bg-red-600";
    if (percent >= 75) return "bg-red-500";
    if (percent >= 60) return "bg-amber-500";
    if (percent >= 45) return "bg-amber-400";
    if (percent >= 30) return "bg-green-500";
    if (percent > 0) return "bg-green-400";
    return "bg-gray-200";
  };
  
  // Function to get text color based on utilization
  const getTextColor = (percent: number, timeStr: string): string => {
    if (isFutureTime(timeStr)) {
      return "text-gray-500";
    }
    
    if (percent >= 60) return "text-white";
    return "text-gray-800";
  };
  
  // Handle scroll actions
  const scrollLeft = () => {
    if (scrollRef.current) {
      const newScrollPosition = scrollRef.current.scrollLeft - 240;
      scrollRef.current.scrollTo({
        left: Math.max(0, newScrollPosition),
        behavior: 'smooth'
      });
    }
  };
  
  const scrollRight = () => {
    if (scrollRef.current) {
      const maxScroll = scrollRef.current.scrollWidth - scrollRef.current.clientWidth;
      const newScrollPosition = scrollRef.current.scrollLeft + 240;
      scrollRef.current.scrollTo({
        left: Math.min(maxScroll, newScrollPosition),
        behavior: 'smooth'
      });
    }
  };
  
  const scrollToCurrent = () => {
    if (scrollRef.current) {
      const cellWidth = 80;
      const containerWidth = scrollRef.current.clientWidth;
      const targetPosition = (currentHour * cellWidth) - (containerWidth / 2) + (cellWidth / 2);
      
      scrollRef.current.scrollTo({
        left: Math.max(0, targetPosition),
        behavior: 'smooth'
      });
    }
  };
  
  return (
    <Card className={`shadow-lg border-0 overflow-hidden transition-all duration-300 ${isExpanded ? 'col-span-3' : ''}`}>
      <div className="bg-gradient-to-r from-indigo-800 to-purple-800 text-white p-4 flex justify-between items-center">
        <h3 className="text-base font-bold flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Time-Based Utilization Heatmap
        </h3>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? 'Collapse' : 'Expand'}
          </Button>
        </div>
      </div>
      
      <CardContent className="p-4">
        {isLoading ? (
          <div className="h-36 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="animate-pulse flex space-x-4">
              <div className="rounded-full bg-gray-200 h-10 w-10"></div>
              <div className="flex-1 space-y-4 py-1">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-500">
                Showing hourly utilization trends
              </div>
              <div className="flex items-center gap-1">
                <Button 
                  variant="outline" 
                  size="icon"
                  className="h-8 w-8"
                  onClick={scrollLeft}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="h-8"
                  onClick={scrollToCurrent}
                >
                  Current Time
                </Button>
                <Button 
                  variant="outline" 
                  size="icon"
                  className="h-8 w-8"
                  onClick={scrollRight}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-2 border border-gray-100">
              <div 
                className="w-full overflow-auto"
                ref={scrollRef}
              >
                <div className="min-w-[1920px]">
                  {/* Header with time slots */}
                  <div className="flex border-b border-gray-200">
                    <div className="w-[120px] flex-shrink-0 p-2 font-medium text-gray-700">
                      Zone
                    </div>
                    {timeData[0].timeSlots.map((slot) => (
                      <div 
                        key={slot.time} 
                        className={`w-[80px] flex-shrink-0 p-2 text-xs font-semibold text-center ${
                          slot.time === currentTimeString 
                            ? 'bg-blue-100 border-x border-blue-300 text-blue-800' 
                            : 'text-gray-600'
                        }`}
                      >
                        {slot.time}
                      </div>
                    ))}
                  </div>
                  
                  {/* Rows for each zone */}
                  {timeData.map((zone) => (
                    <div key={zone.zoneName} className="flex border-b border-gray-200 last:border-b-0">
                      <div className="w-[120px] flex-shrink-0 p-2 font-medium text-gray-700 bg-gray-50 flex items-center">
                        {zone.zoneName}
                      </div>
                      {zone.timeSlots.map((slot) => {
                        const bgColor = getUtilizationColor(slot.utilization, slot.time);
                        const textColor = getTextColor(slot.utilization, slot.time);
                        return (
                          <div 
                            key={`${zone.zoneName}-${slot.time}`} 
                            className={`w-[80px] flex-shrink-0 p-2 flex items-center justify-center ${
                              slot.time === currentTimeString 
                                ? 'bg-blue-50 border-x border-blue-300' 
                                : ''
                            }`}
                          >
                            <div 
                              className={`w-14 h-10 ${bgColor} ${textColor} rounded-md flex items-center justify-center text-sm font-medium shadow-sm`}
                            >
                              {slot.utilization}%
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Time Indication Bar */}
            <div className="rounded-lg border border-gray-200 shadow-inner bg-gray-50 h-8 p-1 relative">
              <div className="flex justify-between text-[10px] text-gray-500 px-1 absolute inset-x-0 top-1">
                <span>12 AM</span>
                <span>6 AM</span>
                <span>12 PM</span>
                <span>6 PM</span>
                <span>12 AM</span>
              </div>
              
              <div className="h-3 bg-gradient-to-r from-indigo-200 via-blue-200 to-purple-200 rounded-full mt-3 relative">
                {/* Current time marker */}
                <div 
                  className="absolute top-1/2 -translate-y-1/2 w-2 h-6 bg-blue-600 rounded-full shadow-md"
                  style={{ 
                    left: `${(currentHour / 24) * 100}%`, 
                    transform: 'translate(-50%, -50%)'
                  }}
                >
                  <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 whitespace-nowrap text-[10px] bg-blue-600 text-white px-1 py-0.5 rounded-sm">
                    Now
                  </div>
                </div>
                
                {/* Past/Future divider */}
                <div className="absolute inset-y-0 bg-gray-200 opacity-30" style={{ 
                  left: `${(currentHour / 24) * 100}%`, 
                  right: 0
                }}>
                  <div className="absolute top-1/2 -translate-y-1/2 -left-3">
                    <ArrowRight className="h-3 w-3 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-xs text-gray-500 flex items-center justify-between">
              <div>
                Scroll horizontally to view more time periods
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-green-400 rounded-sm"></div>
                  <span>Low</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-amber-400 rounded-sm"></div>
                  <span>Medium</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-red-500 rounded-sm"></div>
                  <span>High</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-gray-300 rounded-sm"></div>
                  <span>Future (Empty)</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}