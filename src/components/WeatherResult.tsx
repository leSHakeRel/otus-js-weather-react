import type { WeatherData } from "@/types";
import "./WeatherResult.css";

const WIND_ICON_SVG = `
  <svg fill="#006bc2" height="32px" width="32px" version="1.1" viewBox="0 0 512.003 512.003">
    <path d="M322.528,387.207l-57.984-74.551V101.617l46.276,33.057c1.486,1.067,3.228,1.588,4.961,1.588
      c1.981,0,3.954-0.692,5.542-2.049c2.989-2.545,3.851-6.798,2.092-10.316L263.639,4.342c-2.895-5.79-12.382-5.79-15.277,0
      l-59.777,119.554c-1.759,3.51-0.888,7.763,2.092,10.316c2.98,2.545,7.31,2.733,10.504,0.461l46.285-33.057v211.048l-57.984,74.542
      c-1.161,1.494-1.793,3.339-1.793,5.243v111.015c0,3.646,2.314,6.891,5.764,8.078c3.433,1.178,7.276,0.043,9.513-2.835
      l53.039-68.197l53.031,68.189c1.648,2.126,4.159,3.296,6.746,3.296c0.922,0,1.862-0.154,2.775-0.461
      c3.45-1.178,5.764-4.424,5.764-8.07V392.45C324.321,390.546,323.69,388.701,322.528,387.207z"/>
  </svg>
`;

interface WeatherResultProps {
  weather: WeatherData | null;
  loading: boolean;
  error: string | null;
}

function fillCell(value: string | number | null | undefined, unit = ""): string {
  return `${value === undefined || value === null ? "" : value}${unit}`;
}

export function WeatherResult({ weather, loading, error }: WeatherResultProps) {
  if (loading) {
    return (
      <section className="resultSection">
        <div className="loading-overlay">Загрузка данных...</div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="resultSection">
        <div className="resultSection-cityName">
          <div className="cityName-block-error" style={{ display: "flex" }}>
            <p className="cityName-error">{error}</p>
          </div>
          <div className="cityName-block-text" style={{ display: "none" }}>
            <p className="cityName-text" />
          </div>
        </div>
      </section>
    );
  }

  if (!weather) {
    return (
      <section className="resultSection">
        <div className="cityName-block-text" style={{ display: "flex" }}>
          <p className="cityName-text">Введите город или используйте поиск по IP</p>
        </div>
      </section>
    );
  }

  return (
    <section className="resultSection">
      <div className="resultSection-cityName">
        <div className="cityName-block-text" style={{ display: "flex" }}>
          <p className="cityName-text">{weather.location.name}</p>
        </div>
        <div className="cityName-block-error" style={{ display: "none" }}>
          <p className="cityName-error" />
        </div>
      </div>

      <div className="grid-container" style={{ visibility: "visible" }}>
        {/* Temperature cell (spans 2 cols, 2 rows) */}
        <div className="grid-item temperatureCell">
          <div className="cellItem">
            <p className="weatherIcon">
              <img
                src={`https://cdn.discover.swiss/icons/weather/ds-weather-${weather.weatherIcon}.svg`}
                width={64}
                height={64}
                alt={weather.weatherText}
              />
            </p>
            <p className="weatherText">{weather.weatherText}</p>
            <p>Температура</p>
            <p className="temperatureValue">{fillCell(weather.temperature, "° C")}</p>
          </div>
        </div>

        {/* Feels like */}
        <div className="grid-item">
          <div className="cellItem">
            <p>Ощущается</p>
            <p className="feelTemperatureValue">{fillCell(weather.realFeel, "° C")}</p>
          </div>
        </div>

        {/* Pressure */}
        <div className="grid-item">
          <div className="cellItem">
            <p>Давление</p>
            <p className="pressureValue">{fillCell(weather.getPressureInMM(), " мм рт. ст.")}</p>
          </div>
        </div>

        {/* Wind speed */}
        <div className="grid-item">
          <div className="cellItem">
            <p>Скорость ветра</p>
            <p className="windSpeedValue">{fillCell(weather.windSpeed, " км/ч")}</p>
          </div>
        </div>

        {/* Wind direction */}
        <div className="grid-item">
          <div className="cellItem">
            <p>Направл. ветра</p>
            <p
              className="windDirectionIcon"
              dangerouslySetInnerHTML={{
                __html: WIND_ICON_SVG.replace(
                  "</svg>",
                  ` style="transform: rotate(${weather.windDirectionDegrees}deg); transition: transform 0.3s ease"</svg>`,
                ),
              }}
            />
          </div>
        </div>

        {/* UV Index */}
        <div className="grid-item">
          <div className="cellItem">
            <p>UV-индекс</p>
            <p className="uvIndexValue">{fillCell(weather.uvIndex)}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
