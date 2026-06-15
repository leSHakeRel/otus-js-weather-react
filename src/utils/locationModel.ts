import type { LocationData } from "@/types";

interface GeoData {
  latitude: number;
  longitude: number;
  name: string;
  country: string;
  timezone: string;
}

interface IPData {
  lat: number;
  lon: number;
  city: string;
  country: string;
  timezone: string;
}

export function createLocationFromGeoData(geoData: GeoData): LocationData {
  return {
    key: `${geoData.latitude},${geoData.longitude}`,
    name: geoData.name,
    country: geoData.country,
    localizedName: geoData.name,
    geo: {
      lat: geoData.latitude,
      lng: geoData.longitude,
    },
    timeZone: geoData.timezone,
  };
}

export function createLocationFromIPData(ipData: IPData): LocationData {
  return {
    key: `${ipData.lat},${ipData.lon}`,
    name: ipData.city,
    country: ipData.country,
    localizedName: ipData.city,
    geo: {
      lat: ipData.lat,
      lng: ipData.lon,
    },
    timeZone: ipData.timezone,
  };
}
