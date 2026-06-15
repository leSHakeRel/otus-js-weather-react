import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import App from "@/App";

const mockNavigate = jest.fn();

jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useNavigate: () => mockNavigate,
  useParams: jest.fn(() => ({})),
}));

jest.mock("@/hooks/useWeather", () => ({
  useWeather: jest.fn(),
}));

jest.mock("@/hooks/useSearchHistory", () => ({
  useSearchHistory: jest.fn(),
}));

const mockUseWeather = jest.requireMock("@/hooks/useWeather").useWeather;
const mockUseSearchHistory = jest.requireMock("@/hooks/useSearchHistory").useSearchHistory;
const mockUseParams = jest.requireMock("react-router").useParams;

function renderWithRouter(ui: React.ReactElement) {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
}

describe("App — /main (без cityName)", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockUseParams.mockReturnValue({});

    mockUseWeather.mockReturnValue({
      weather: null,
      loading: false,
      error: null,
      fetchWeather: jest.fn(),
    });

    mockUseSearchHistory.mockReturnValue({
      history: [],
      addCity: jest.fn(),
      removeCity: jest.fn(),
      clearHistory: jest.fn(),
      lastCity: null,
    });
  });

  it("should render the heading", () => {
    renderWithRouter(<App />);

    expect(screen.getByText("Прогноз погоды")).toBeInTheDocument();
  });

  it("should render WeatherSearch component", () => {
    renderWithRouter(<App />);

    expect(screen.getByLabelText("Поиск по IP")).toBeInTheDocument();
    expect(screen.getByLabelText("Поиск названия города")).toBeInTheDocument();
  });

  it("should render WeatherResult component (initial state)", () => {
    renderWithRouter(<App />);

    expect(screen.getByText("Введите город или используйте поиск по IP")).toBeInTheDocument();
  });

  it("should render WeatherSearchHistory component", () => {
    renderWithRouter(<App />);

    expect(screen.getByText("История поиска")).toBeInTheDocument();
    expect(screen.getByText("История поиска пуста")).toBeInTheDocument();
  });

  it("should call fetchWeather when auto search is submitted", () => {
    const fetchWeather = jest.fn();
    mockUseWeather.mockReturnValue({
      weather: null,
      loading: false,
      error: null,
      fetchWeather,
    });

    renderWithRouter(<App />);

    const submitButton = screen.getByDisplayValue("Поиск");
    fireEvent.click(submitButton);

    expect(fetchWeather).toHaveBeenCalledWith({
      type: "auto",
      cityName: "",
    });
  });

  it("should navigate to /weather/:cityName when city search is submitted", () => {
    const fetchWeather = jest.fn();
    mockUseWeather.mockReturnValue({
      weather: null,
      loading: false,
      error: null,
      fetchWeather,
    });

    renderWithRouter(<App />);

    const cityRadio = screen.getByLabelText("Поиск названия города");
    fireEvent.click(cityRadio);

    const cityInput = screen.getByPlaceholderText("Поиск погоды по городу");
    fireEvent.change(cityInput, { target: { value: "Moscow" } });

    const submitButton = screen.getByDisplayValue("Поиск");
    fireEvent.click(submitButton);

    expect(mockNavigate).toHaveBeenCalledWith("/weather/Moscow");
    expect(fetchWeather).not.toHaveBeenCalled();
  });

  it("should navigate to /weather/:cityName when history city is clicked", () => {
    const fetchWeather = jest.fn();

    mockUseWeather.mockReturnValue({
      weather: null,
      loading: false,
      error: null,
      fetchWeather,
    });

    mockUseSearchHistory.mockReturnValue({
      history: ["Moscow", "London"],
      addCity: jest.fn(),
      removeCity: jest.fn(),
      clearHistory: jest.fn(),
      lastCity: "Moscow",
    });

    renderWithRouter(<App />);

    const cityElement = screen.getByText("Moscow");
    fireEvent.click(cityElement);

    expect(mockNavigate).toHaveBeenCalledWith("/weather/Moscow");
  });
});

describe("App — /weather/:cityName (режим страницы города)", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockUseParams.mockReturnValue({ cityName: "Moscow" });

    mockUseSearchHistory.mockReturnValue({
      history: [],
      addCity: jest.fn(),
      removeCity: jest.fn(),
      clearHistory: jest.fn(),
      lastCity: null,
    });
  });

  it("should fetch weather for city from URL params", () => {
    const fetchWeather = jest.fn();
    mockUseWeather.mockReturnValue({
      weather: null,
      loading: false,
      error: null,
      fetchWeather,
    });

    renderWithRouter(<App />);

    expect(fetchWeather).toHaveBeenCalledWith({
      type: "city",
      cityName: "Moscow",
    });
  });

  it("should display city name in heading instead of WeatherSearch", () => {
    mockUseWeather.mockReturnValue({
      weather: null,
      loading: false,
      error: null,
      fetchWeather: jest.fn(),
    });

    renderWithRouter(<App />);

    expect(screen.getByText("Прогноз погоды: Moscow")).toBeInTheDocument();
    expect(screen.queryByLabelText("Поиск по IP")).not.toBeInTheDocument();
  });

  it("should show loading state", () => {
    mockUseWeather.mockReturnValue({
      weather: null,
      loading: true,
      error: null,
      fetchWeather: jest.fn(),
    });

    renderWithRouter(<App />);

    expect(screen.getByText("Загрузка данных...")).toBeInTheDocument();
  });

  it("should show error state", () => {
    mockUseWeather.mockReturnValue({
      weather: null,
      loading: false,
      error: "City not found",
      fetchWeather: jest.fn(),
    });

    renderWithRouter(<App />);

    expect(screen.getByText("City not found")).toBeInTheDocument();
  });

  it("should show weather data when loaded", () => {
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
      fetchWeather: jest.fn(),
    });

    renderWithRouter(<App />);

    expect(screen.getByText("Moscow")).toBeInTheDocument();
    expect(screen.getByText("22° C")).toBeInTheDocument();
  });

  it("should render navigation", () => {
    mockUseWeather.mockReturnValue({
      weather: null,
      loading: false,
      error: null,
      fetchWeather: jest.fn(),
    });

    renderWithRouter(<App />);

    expect(screen.getByText("Главная")).toBeInTheDocument();
    expect(screen.getByText("О приложении")).toBeInTheDocument();
  });

  it("should add city to search history after successful weather fetch", () => {
    const mockAddCity = jest.fn();
    mockUseSearchHistory.mockReturnValue({
      history: [],
      addCity: mockAddCity,
      removeCity: jest.fn(),
      clearHistory: jest.fn(),
      lastCity: null,
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
      fetchWeather: jest.fn(),
    });

    renderWithRouter(<App />);

    expect(mockAddCity).toHaveBeenCalledWith("Moscow");
  });

  it("should render back-to-home link", () => {
    mockUseWeather.mockReturnValue({
      weather: null,
      loading: false,
      error: null,
      fetchWeather: jest.fn(),
    });

    renderWithRouter(<App />);

    const backLink = screen.getByText("Вернуться на главную");
    expect(backLink).toBeInTheDocument();
    expect(backLink).toHaveAttribute("href", "/main");
  });

  it("should render search history section", () => {
    mockUseWeather.mockReturnValue({
      weather: null,
      loading: false,
      error: null,
      fetchWeather: jest.fn(),
    });

    renderWithRouter(<App />);

    expect(screen.getByText("История поиска")).toBeInTheDocument();
  });

  it("should navigate when history city is clicked", () => {
    const mockAddCity = jest.fn();
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
      fetchWeather: jest.fn(),
    });

    renderWithRouter(<App />);

    const historyCityElements = screen.getAllByText("Moscow");
    // Берём второй элемент (первый — в результате погоды, второй — в истории)
    fireEvent.click(historyCityElements[1]);

    expect(mockNavigate).toHaveBeenCalledWith("/weather/Moscow");
  });
});
