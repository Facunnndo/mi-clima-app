import { useEffect, useState } from "react";
import { useGeolocation } from "@/hooks/useGeolocation";
import { supabase } from "@/integrations/supabase/client";
import { WeatherCard } from "@/components/WeatherCard";
import { WeatherHistory } from "@/components/WeatherHistory";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ErrorMessage } from "@/components/ErrorMessage";
import { useToast } from "@/hooks/use-toast";

interface WeatherData {
  city: string;
  temperature: number;
  description: string;
  icon: string;
  latitude: number;
  longitude: number;
}

interface HistoryItem {
  id: string;
  city: string;
  temperature: number;
  description: string;
  created_at: string;
}

const Index = () => {
  const { toast } = useToast();
  const { latitude, longitude, error: geoError, loading: geoLoading } = useGeolocation();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = async (lat: number, lon: number) => {
    try {
      setLoading(true);
      setError(null);

      console.log('Calling weather function with:', { lat, lon });

      const { data, error: functionError } = await supabase.functions.invoke('get-weather', {
        body: { latitude: lat, longitude: lon },
      });

      if (functionError) {
        console.error('Function error:', functionError);
        throw new Error(functionError.message);
      }

      if (data.error) {
        throw new Error(data.error);
      }

      console.log('Weather data received:', data);
      setWeather(data);

      // Save to database
      const { error: insertError } = await supabase
        .from('weather_history')
        .insert({
          city: data.city,
          temperature: data.temperature,
          description: data.description,
          icon: data.icon,
          latitude: data.latitude,
          longitude: data.longitude,
        });

      if (insertError) {
        console.error('Error saving to history:', insertError);
      } else {
        loadHistory();
      }

      toast({
        title: "Clima actualizado",
        description: `Mostrando el clima para ${data.city}`,
      });

    } catch (err) {
      console.error('Error fetching weather:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error al obtener el clima';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadHistory = async () => {
    try {
      const { data, error: historyError } = await supabase
        .from('weather_history')
        .select('id, city, temperature, description, created_at')
        .order('created_at', { ascending: false })
        .limit(5);

      if (historyError) {
        console.error('Error loading history:', historyError);
        return;
      }

      setHistory(data || []);
    } catch (err) {
      console.error('Error loading history:', err);
    }
  };

  useEffect(() => {
    if (latitude !== null && longitude !== null) {
      fetchWeather(latitude, longitude);
    }
  }, [latitude, longitude]);

  useEffect(() => {
    loadHistory();
  }, []);

  const handleRetry = () => {
    if (latitude !== null && longitude !== null) {
      fetchWeather(latitude, longitude);
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-light via-sky-medium to-sky-dark p-4 md:p-8">
      <div className="mx-auto max-w-2xl pt-8 md:pt-16">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-5xl font-bold text-white drop-shadow-lg">
            MiClima
          </h1>
          <p className="text-lg text-white/80">
            Tu pronóstico del tiempo en tiempo real
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {geoLoading || loading ? (
            <LoadingSpinner />
          ) : geoError || error ? (
            <ErrorMessage 
              message={geoError || error || 'Error desconocido'} 
              onRetry={handleRetry}
            />
          ) : weather ? (
            <>
              <WeatherCard
                city={weather.city}
                temperature={weather.temperature}
                description={weather.description}
                icon={weather.icon}
              />
              <WeatherHistory history={history} />
            </>
          ) : null}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-sm text-white/60">
            Datos proporcionados por OpenWeatherMap
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;