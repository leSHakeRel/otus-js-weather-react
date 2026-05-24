import { useEffect, useRef } from "react";
import { useWeather } from "@/hooks/useWeather";
import { useSearchHistory } from "@/hooks/useSearchHistory";
import { WeatherSearch } from "@/components/WeatherSearch";
import { WeatherResult } from "@/components/WeatherResult";
import { WeatherSearchHistory } from "@/components/WeatherSearchHistory";
import { Navigation } from "@/components/Navigation";
import type { SearchData } from "@/types";
import "./App.css";

function App() {
  const { weather, loading, error, fetchWeather } = useWeather();
  const searchHistory = useSearchHistory();
  const pendingCityRef = useRef<string | null>(null);

  // Добавление города в историю после успешной загрузки погоды
  useEffect(() => {
    if (weather && pendingCityRef.current) {
      searchHistory.addCity(pendingCityRef.current);
      pendingCityRef.current = null;
    }
  }, [weather, searchHistory]);

  const handleSearch = (searchData: SearchData) => {
    if (searchData.type === "city" && searchData.cityName.trim()) {
      const city = searchData.cityName.trim();
      pendingCityRef.current = city;
    } else {
      pendingCityRef.current = null;
    }
    void fetchWeather(searchData);
  };

  const handleCityClick = (city: string) => {
    pendingCityRef.current = city;
    void fetchWeather({ type: "city", cityName: city });
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
