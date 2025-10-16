import { Cloud, Droplets, Wind } from "lucide-react";
import { Card } from "@/components/ui/card";

interface WeatherCardProps {
  city: string;
  temperature: number;
  description: string;
  icon: string;
}

export const WeatherCard = ({ city, temperature, description, icon }: WeatherCardProps) => {
  const iconUrl = `https://openweathermap.org/img/wn/${icon}@4x.png`;

  return (
    <Card className="relative overflow-hidden border-none bg-white/20 backdrop-blur-lg shadow-2xl">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20" />
      
      <div className="relative p-8 md:p-12">
        <div className="flex flex-col items-center space-y-6">
          {/* Location */}
          <div className="flex items-center space-x-2 text-white">
            <Cloud className="h-5 w-5" />
            <h2 className="text-2xl font-semibold">{city}</h2>
          </div>

          {/* Weather Icon */}
          <div className="relative">
            <img 
              src={iconUrl} 
              alt={description}
              className="h-32 w-32 drop-shadow-2xl"
            />
          </div>

          {/* Temperature */}
          <div className="text-center">
            <div className="text-7xl font-bold text-white">
              {temperature}°
            </div>
            <p className="mt-2 text-xl text-white/90 capitalize">
              {description}
            </p>
          </div>

          {/* Additional Info */}
          <div className="flex space-x-8 pt-4">
            <div className="flex items-center space-x-2 text-white/80">
              <Droplets className="h-5 w-5" />
              <span className="text-sm">Humedad</span>
            </div>
            <div className="flex items-center space-x-2 text-white/80">
              <Wind className="h-5 w-5" />
              <span className="text-sm">Viento</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};