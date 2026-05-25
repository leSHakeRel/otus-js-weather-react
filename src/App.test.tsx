import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import App from "@/App";

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

function renderWithRouter(ui: React.ReactElement) {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
}

describe("App", () => {
  beforeEach(() => {
    jest.clearAllMocks();

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
