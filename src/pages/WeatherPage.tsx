import { useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { useWeather } from "@/hooks/useWeather";
import { useSearchHistory } from "@/hooks/useSearchHistory";
import { WeatherResult } from "@/components/WeatherResult";
import { WeatherSearchHistory } from "@/components/WeatherSearchHistory";
import { Navigation } from "@/components/Navigation";
import "@/App.css";

export function WeatherPage() {
  const { cityName } = useParams<{ cityName: string }>();
  const navigate = useNavigate();
  const { weather, loading, error, fetchWeather } = useWeather();
  const searchHistory = useSearchHistory();
  const { addCity } = searchHistory;

  const handleCityClick = (city: string) => {
    navigate(`/weather/${encodeURIComponent(city)}`);
  };

  useEffect(() => {
    if (cityName) {
      void fetchWeather({ type: "city", cityName });
    }
  }, [cityName, fetchWeather]);

  useEffect(() => {
    if (weather && cityName) {
      addCity(cityName);
    }
  }, [weather, cityName, addCity]);

  return (
    <>
      <Navigation />
      <div className="app">
        <div className="main-container">
          <h1>Прогноз погоды: {cityName}</h1>

          <div className="row">
            <WeatherResult weather={weather} loading={loading} error={error} />
            <WeatherSearchHistory
              history={searchHistory.history}
              onCityClick={handleCityClick}
              onRemoveCity={searchHistory.removeCity}
              onClearHistory={searchHistory.clearHistory}
            />
          </div>

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
