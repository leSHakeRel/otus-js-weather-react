import { useState, useCallback } from "react";
import * as weatherApi from "@/api/weatherApiService";
import { createLocationFromGeoData } from "@/utils/locationModel";
import { createLocationFromIPData } from "@/utils/locationModel";
import { createWeatherModel } from "@/utils/weatherModel";
import type { SearchData, WeatherData } from "@/types";

interface UseWeatherReturn {
  weather: WeatherData | null;
  loading: boolean;
  error: string | null;
  fetchWeather: (searchData: SearchData) => Promise<void>;
}

export function useWeather(): UseWeatherReturn {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = useCallback(async (searchData: SearchData) => {
    setLoading(true);
    setError(null);
    setWeather(null);

    try {
      let location: ReturnType<typeof createLocationFromGeoData>;
      let rawWeather: {
        temperature: number;
        weatherText: string;
        weatherIcon: number;
        windSpeed: number;
        windDirection: string;
        windDirectionDegrees: number;
        pressure: number;
        visibility: number;
        uvIndex: number;
        realFeel: number;
      };

      if (searchData.type === "auto") {
        const ipLocation = await weatherApi.getLocationByIP();
        location = createLocationFromIPData(ipLocation);
        rawWeather = await weatherApi.getCurrentWeather(location.geo.lat, location.geo.lng);
      } else if (searchData.type === "city") {
        const cityGeoData = await weatherApi.getLocationByCity(searchData.cityName);
        location = createLocationFromGeoData(cityGeoData);
        rawWeather = await weatherApi.getCurrentWeather(location.geo.lat, location.geo.lng);
      } else {
        throw new Error("Неизвестный тип локации");
      }

      const weatherModel = createWeatherModel(rawWeather, location);
      setWeather(weatherModel);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Произошла неизвестная ошибка";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { weather, loading, error, fetchWeather };
}
