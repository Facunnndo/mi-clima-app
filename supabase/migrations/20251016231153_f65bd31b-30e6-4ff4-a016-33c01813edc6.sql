-- Create weather_history table
CREATE TABLE public.weather_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  city TEXT NOT NULL,
  temperature NUMERIC NOT NULL,
  description TEXT NOT NULL,
  icon TEXT,
  latitude NUMERIC NOT NULL,
  longitude NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.weather_history ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to read weather history (public data)
CREATE POLICY "Anyone can view weather history"
ON public.weather_history
FOR SELECT
USING (true);

-- Create policy to allow anyone to insert weather history
CREATE POLICY "Anyone can insert weather history"
ON public.weather_history
FOR INSERT
WITH CHECK (true);

-- Create index for faster queries on created_at
CREATE INDEX idx_weather_history_created_at ON public.weather_history(created_at DESC);