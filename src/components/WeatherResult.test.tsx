import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { WeatherResult } from "@/components/WeatherResult";
import type { WeatherData } from "@/types";

const mockWeather: WeatherData = {
  status: true,
  message: "",
  temperature: 22,
  weatherText: "Sunny",
  weatherIcon: 1,
  windSpeed: 15,
  windDirection: "N",
  windDirectionDegrees: 0,
  pressure: 1013,
  visibility: 10,
  uvIndex: 5,
  realFeel: 21,
  location: {
    key: "51.5,-0.1",
    name: "London",
    country: "UK",
    localizedName: "London",
    geo: { lat: 51.5, lng: -0.1 },
    timeZone: "Europe/London",
  },
  getPressureInMM: () => 760,
};

describe("WeatherResult", () => {
  describe("loading state", () => {
    it("should show loading message", () => {
      render(<WeatherResult weather={null} loading={true} error={null} />);

      expect(screen.getByText("Загрузка данных...")).toBeInTheDocument();
    });
  });

  describe("error state", () => {
    it("should show error message", () => {
      render(<WeatherResult weather={null} loading={false} error="City not found" />);

      expect(screen.getByText("City not found")).toBeInTheDocument();
    });
  });

  describe("empty state (no data, no error)", () => {
    it("should show initial message", () => {
      render(<WeatherResult weather={null} loading={false} error={null} />);

      expect(screen.getByText("Введите город или используйте поиск по IP")).toBeInTheDocument();
    });
  });

  describe("weather data state", () => {
    it("should display city name", () => {
      render(<WeatherResult weather={mockWeather} loading={false} error={null} />);

      expect(screen.getByText("London")).toBeInTheDocument();
    });

    it("should display temperature", () => {
      render(<WeatherResult weather={mockWeather} loading={false} error={null} />);

      expect(screen.getByText("22° C")).toBeInTheDocument();
    });

    it("should display weather description", () => {
      render(<WeatherResult weather={mockWeather} loading={false} error={null} />);

      expect(screen.getByText("Sunny")).toBeInTheDocument();
    });

    it("should display feels like temperature", () => {
      render(<WeatherResult weather={mockWeather} loading={false} error={null} />);

      expect(screen.getByText("21° C")).toBeInTheDocument();
    });

    it("should display pressure in mmHg", () => {
      render(<WeatherResult weather={mockWeather} loading={false} error={null} />);

      expect(screen.getByText("760 мм рт. ст.")).toBeInTheDocument();
    });

    it("should display wind speed", () => {
      render(<WeatherResult weather={mockWeather} loading={false} error={null} />);

      expect(screen.getByText("15 км/ч")).toBeInTheDocument();
    });

    it("should display UV index", () => {
      render(<WeatherResult weather={mockWeather} loading={false} error={null} />);

      expect(screen.getByText("5")).toBeInTheDocument();
    });
  });
});
