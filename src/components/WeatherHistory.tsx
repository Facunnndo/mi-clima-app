import { Card } from "@/components/ui/card";
import { Clock, MapPin } from "lucide-react";

interface WeatherHistoryItem {
  id: string;
  city: string;
  temperature: number;
  description: string;
  created_at: string;
}

interface WeatherHistoryProps {
  history: WeatherHistoryItem[];
}

export const WeatherHistory = ({ history }: WeatherHistoryProps) => {
  if (history.length === 0) {
    return null;
  }

  return (
    <Card className="mt-8 border-none bg-white/10 backdrop-blur-md shadow-lg">
      <div className="p-6">
        <h3 className="mb-4 flex items-center space-x-2 text-lg font-semibold text-white">
          <Clock className="h-5 w-5" />
          <span>Historial Reciente</span>
        </h3>
        
        <div className="space-y-3">
          {history.map((item) => (
            <div 
              key={item.id}
              className="flex items-center justify-between rounded-lg bg-white/10 p-3 transition-all hover:bg-white/20"
            >
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-accent" />
                <div>
                  <p className="font-medium text-white">{item.city}</p>
                  <p className="text-sm text-white/70 capitalize">{item.description}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-white">{item.temperature}°</p>
                <p className="text-xs text-white/60">
                  {new Date(item.created_at).toLocaleTimeString('es-ES', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};