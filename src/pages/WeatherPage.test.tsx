import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import { WeatherPage } from "@/pages/WeatherPage";

const mockFetchWeather = jest.fn();
const mockAddCity = jest.fn();
const mockNavigate = jest.fn();

jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useNavigate: () => mockNavigate,
}));

jest.mock("@/hooks/useWeather", () => ({
  useWeather: jest.fn(),
}));

jest.mock("@/hooks/useSearchHistory", () => ({
  useSearchHistory: jest.fn(),
}));

const mockUseWeather = jest.requireMock("@/hooks/useWeather").useWeather;
const mockUseSearchHistory = jest.requireMock("@/hooks/useSearchHistory").useSearchHistory;

jest.mock("@/components/WeatherMap", () => ({
  WeatherMap: () => <div data-testid="weather-map" />,
}));

function renderAtRoute(route: string) {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <Routes>
        <Route path="/weather/:cityName" element={<WeatherPage />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("WeatherPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockUseSearchHistory.mockReturnValue({
      history: [],
      addCity: mockAddCity,
      removeCity: jest.fn(),
      clearHistory: jest.fn(),
      lastCity: null,
    });
  });

  it("should fetch weather for city from URL params", () => {
    mockUseWeather.mockReturnValue({
      weather: null,
      loading: false,
      error: null,
      fetchWeather: mockFetchWeather,
    });

    renderAtRoute("/weather/Moscow");

    expect(mockFetchWeather).toHaveBeenCalledWith({
      type: "city",
      cityName: "Moscow",
    });
  });

  it("should show loading state", () => {
    mockUseWeather.mockReturnValue({
      weather: null,
      loading: true,
      error: null,
      fetchWeather: mockFetchWeather,
    });

    renderAtRoute("/weather/Moscow");

    expect(screen.getByText("Загрузка данных...")).toBeInTheDocument();
  });

  it("should show error state", () => {
    mockUseWeather.mockReturnValue({
      weather: null,
      loading: false,
      error: "City not found",
      fetchWeather: mockFetchWeather,
    });

    renderAtRoute("/weather/Moscow");

    expect(screen.getByText("City not found")).toBeInTheDocument();
  });

  it("should show weather data and map when loaded", () => {
    mockUseWeather.mockReturnValue({
      weather: {
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
          key: "55.7,37.6",
          name: "Moscow",
          country: "Russia",
          localizedName: "Moscow",
          geo: { lat: 55.7, lng: 37.6 },
          timeZone: "Europe/Moscow",
        },
        getPressureInMM: () => 760,
      },
      loading: false,
      error: null,
      fetchWeather: mockFetchWeather,
    });

    renderAtRoute("/weather/Moscow");

    expect(screen.getByText("Moscow")).toBeInTheDocument();
    expect(screen.getByText("22° C")).toBeInTheDocument();
    expect(screen.getByTestId("weather-map")).toBeInTheDocument();
  });

  it("should render navigation", () => {
    mockUseWeather.mockReturnValue({
      weather: null,
      loading: false,
      error: null,
      fetchWeather: mockFetchWeather,
    });

    renderAtRoute("/weather/Moscow");

    expect(screen.getByText("Главная")).toBeInTheDocument();
    expect(screen.getByText("О приложении")).toBeInTheDocument();
  });

  it("should add city to search history after successful weather fetch", () => {
    mockUseWeather.mockReturnValue({
      weather: {
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
          key: "55.7,37.6",
          name: "Moscow",
          country: "Russia",
          localizedName: "Moscow",
          geo: { lat: 55.7, lng: 37.6 },
          timeZone: "Europe/Moscow",
        },
        getPressureInMM: () => 760,
      },
      loading: false,
      error: null,
      fetchWeather: mockFetchWeather,
    });

    renderAtRoute("/weather/Moscow");

    expect(mockAddCity).toHaveBeenCalledWith("Moscow");
  });

  it("should render back-to-home link", () => {
    mockUseWeather.mockReturnValue({
      weather: null,
      loading: false,
      error: null,
      fetchWeather: mockFetchWeather,
    });

    renderAtRoute("/weather/Moscow");

    const backLink = screen.getByText("Вернуться на главную");
    expect(backLink).toBeInTheDocument();
    expect(backLink).toHaveAttribute("href", "/main");
  });

  it("should display city name in heading", () => {
    mockUseWeather.mockReturnValue({
      weather: null,
      loading: false,
      error: null,
      fetchWeather: mockFetchWeather,
    });

    renderAtRoute("/weather/London");

    expect(screen.getByText("Прогноз погоды: London")).toBeInTheDocument();
  });

  it("should render search history section", () => {
    mockUseWeather.mockReturnValue({
      weather: null,
      loading: false,
      error: null,
      fetchWeather: mockFetchWeather,
    });

    renderAtRoute("/weather/Moscow");

    expect(screen.getByText("История поиска")).toBeInTheDocument();
  });

  it("should navigate when history city is clicked", () => {
    mockUseSearchHistory.mockReturnValue({
      history: ["Moscow", "London"],
      addCity: mockAddCity,
      removeCity: jest.fn(),
      clearHistory: jest.fn(),
      lastCity: "Moscow",
    });

    mockUseWeather.mockReturnValue({
      weather: {
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
          key: "55.7,37.6",
          name: "Moscow",
          country: "Russia",
          localizedName: "Moscow",
          geo: { lat: 55.7, lng: 37.6 },
          timeZone: "Europe/Moscow",
        },
        getPressureInMM: () => 760,
      },
      loading: false,
      error: null,
      fetchWeather: mockFetchWeather,
    });

    renderAtRoute("/weather/Moscow");

    const historyCityElements = screen.getAllByText("Moscow");
    // Берём второй элемент (первый — в результате погоды, второй — в истории)
    fireEvent.click(historyCityElements[1]);

    expect(mockNavigate).toHaveBeenCalledWith("/weather/Moscow");
  });
});
