import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface WeatherRequest {
  latitude: number;
  longitude: number;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { latitude, longitude }: WeatherRequest = await req.json();

    console.log('Fetching weather for coordinates:', { latitude, longitude });

    const apiKey = Deno.env.get('OPENWEATHER_API_KEY');
    if (!apiKey) {
      throw new Error('OpenWeather API key not configured');
    }

    // Call OpenWeatherMap API
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}&lang=es`;
    
    console.log('Calling OpenWeatherMap API...');
    const weatherResponse = await fetch(weatherUrl);

    if (!weatherResponse.ok) {
      console.error('OpenWeatherMap API error:', weatherResponse.status, weatherResponse.statusText);
      throw new Error(`Weather API returned ${weatherResponse.status}`);
    }

    const weatherData = await weatherResponse.json();
    console.log('Weather data received:', weatherData.name);

    const result = {
      city: weatherData.name,
      temperature: Math.round(weatherData.main.temp),
      description: weatherData.weather[0].description,
      icon: weatherData.weather[0].icon,
      latitude,
      longitude,
    };

    return new Response(
      JSON.stringify(result),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('Error in get-weather function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch weather data';
    return new Response(
      JSON.stringify({ 
        error: errorMessage
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});