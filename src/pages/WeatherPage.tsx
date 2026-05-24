import { useEffect } from "react";
import { useParams, Link } from "react-router";
import { useWeather } from "@/hooks/useWeather";
import { WeatherResult } from "@/components/WeatherResult";
import { Navigation } from "@/components/Navigation";
import "@/App.css";

export function WeatherPage() {
  const { cityName } = useParams<{ cityName: string }>();
  const { weather, loading, error, fetchWeather } = useWeather();

  useEffect(() => {
    if (cityName) {
      void fetchWeather({ type: "city", cityName });
    }
  }, [cityName, fetchWeather]);

  return (
    <>
      <Navigation />
      <div className="app">
        <div className="main-container">
          <h1>Прогноз погоды: {cityName}</h1>

          <WeatherResult weather={weather} loading={loading} error={error} />

          <Link
            to="/main"
            className="back-to-home"
            style={{ display: "inline-block", marginTop: "20px" }}
          >
            Вернуться на главную
          </Link>
        </div>
      </div>
    </>
  );
}
