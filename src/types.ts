export type SearchType = "auto" | "city";

export interface SearchData {
  type: SearchType;
  cityName: string;
}

export interface WeatherData {
  status: boolean;
  message: string;
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
  location: {
    key: string;
    name: string;
    country: string;
    localizedName: string;
    geo: {
      lat: number;
      lng: number;
    };
    timeZone: string;
  };
  getPressureInMM(): number | null;
}

export interface LocationData {
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

export interface IpifyResponse {
  ip: string;
}

export interface IpApiResponse {
  status: string;
  lat: number;
  lon: number;
  city: string;
  country: string;
  timezone: string;
}

export interface CitySearchResult {
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  timezone: string;
}

export interface OpenMeteoCurrentWeather {
  current_weather: {
    temperature: number;
    windspeed: number;
    winddirection: number;
    weathercode: number;
  };
  hourly: {
    pressure_msl?: number[];
    visibility?: number[];
  };
}
