import { useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { useWeather } from "@/hooks/useWeather";
import { useSearchHistory } from "@/hooks/useSearchHistory";
import { WeatherSearch } from "@/components/WeatherSearch";
import { WeatherResult } from "@/components/WeatherResult";
import { WeatherSearchHistory } from "@/components/WeatherSearchHistory";
import { Navigation } from "@/components/Navigation";
import type { SearchData } from "@/types";
import "./App.css";

function App() {
  const navigate = useNavigate();
  const { weather, loading, error, fetchWeather } = useWeather();
  const searchHistory = useSearchHistory();
  const { addCity } = searchHistory;
  const pendingCityRef = useRef<string | null>(null);

  // Добавление города в историю после успешной загрузки погоды
  useEffect(() => {
    if (weather && pendingCityRef.current) {
      addCity(pendingCityRef.current);
      pendingCityRef.current = null;
    }
  }, [weather, addCity]);

  const handleSearch = (searchData: SearchData) => {
    if (searchData.type === "city" && searchData.cityName.trim()) {
      const city = searchData.cityName.trim();
      navigate(`/weather/${encodeURIComponent(city)}`);
      return;
    }
    pendingCityRef.current = null;
    void fetchWeather(searchData);
  };

  const handleCityClick = (city: string) => {
    navigate(`/weather/${encodeURIComponent(city)}`);
  };

  return (
    <>
      <Navigation />
      <div className="app">
        <div className="main-container">
          <WeatherSearch onSearch={handleSearch} />

          <div className="row">
            <WeatherResult weather={weather} loading={loading} error={error} />
            <WeatherSearchHistory
              history={searchHistory.history}
              onCityClick={handleCityClick}
              onRemoveCity={searchHistory.removeCity}
              onClearHistory={searchHistory.clearHistory}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
