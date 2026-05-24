import { YMaps, Map, Placemark } from "@pbe/react-yandex-maps";
import "./WeatherMap.css";

interface WeatherMapProps {
  lat: number | null;
  lng: number | null;
}

export function WeatherMap({ lat, lng }: WeatherMapProps) {
  if (lat === null || lng === null) {
    return null;
  }

  return (
    <div className="weather-map">
      <YMaps>
        <Map defaultState={{ center: [lat, lng], zoom: 10 }} className="weather-map-container">
          <Placemark geometry={[lat, lng]} />
        </Map>
      </YMaps>
    </div>
  );
}
