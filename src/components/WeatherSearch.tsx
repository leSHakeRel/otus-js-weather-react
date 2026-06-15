import { useState, type FormEvent } from "react";
import type { SearchData } from "@/types";
import "./WeatherSearch.css";

interface WeatherSearchProps {
  onSearch: (searchData: SearchData) => void;
}

export function WeatherSearch({ onSearch }: WeatherSearchProps) {
  const [searchType, setSearchType] = useState<"auto" | "city">("auto");
  const [cityName, setCityName] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSearch({ type: searchType, cityName });
  };

  const handleTypeChange = (type: "auto" | "city") => {
    setSearchType(type);
  };

  return (
    <section className="search">
      <h1>Прогноз погоды</h1>
      <form className="searchForm" onSubmit={handleSubmit}>
        <div className="columnFlex options">
          <div className="rowFlex centeredFlex">
            <div className="rowFlex">
              <input
                type="radio"
                id="ipSearch"
                name="searchType"
                value="auto"
                checked={searchType === "auto"}
                onChange={() => handleTypeChange("auto")}
              />
              <label htmlFor="ipSearch">Поиск по IP</label>
            </div>
            <div className="rowFlex">
              <input
                type="radio"
                id="cityNameSearch"
                name="searchType"
                value="city"
                checked={searchType === "city"}
                onChange={() => handleTypeChange("city")}
              />
              <label htmlFor="cityNameSearch">Поиск названия города</label>
            </div>
          </div>
          <input
            type="text"
            name="cityName"
            placeholder="Поиск погоды по городу"
            className="cityNameInput"
            value={cityName}
            onChange={(e) => setCityName(e.target.value)}
            style={{ display: searchType === "city" ? "block" : "none" }}
          />
        </div>
        <input type="submit" value="Поиск" />
      </form>
    </section>
  );
}
