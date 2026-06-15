import type { WeatherData } from "@/types";

interface RawWeatherData {
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
}

interface RawLocation {
  key: string;
  name: string;
  country: string;
  localizedName: string;
  geo: {
    lat: number;
    lng: number;
  };
  timeZone: string;
}

export function createWeatherModel(apiData: RawWeatherData, location: RawLocation): WeatherData {
  return {
    status: true,
    message: "",
    temperature: apiData.temperature,
    weatherText: apiData.weatherText,
    weatherIcon: apiData.weatherIcon,
    windSpeed: apiData.windSpeed,
    windDirection: apiData.windDirection,
    windDirectionDegrees: apiData.windDirectionDegrees,
    pressure: apiData.pressure,
    visibility: apiData.visibility,
    uvIndex: apiData.uvIndex,
    realFeel: apiData.realFeel,
    location,
    getPressureInMM(): number | null {
      return this.pressure ? Math.round(this.pressure * 0.7506) : null;
    },
  };
}
