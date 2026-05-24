import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import App from "@/App";

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

  it("should call fetchWeather when search is submitted", () => {
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

  it("should add city to history when weather is loaded after city search", () => {
    const addCity = jest.fn();
    const fetchWeather = jest.fn();

    mockUseWeather.mockReturnValue({
      weather: null,
      loading: false,
      error: null,
      fetchWeather,
    });

    mockUseSearchHistory.mockReturnValue({
      history: [],
      addCity,
      removeCity: jest.fn(),
      clearHistory: jest.fn(),
      lastCity: null,
    });

    const { rerender } = renderWithRouter(<App />);

    const cityRadio = screen.getByLabelText("Поиск названия города");
    fireEvent.click(cityRadio);

    const cityInput = screen.getByPlaceholderText("Поиск погоды по городу");
    fireEvent.change(cityInput, { target: { value: "Moscow" } });

    const submitButton = screen.getByDisplayValue("Поиск");
    fireEvent.click(submitButton);

    const weather = {
      status: true,
      message: "",
      location: {
        name: "Moscow",
        geo: { lat: 55.7, lng: 37.6 },
      },
      temperature: 20,
      getPressureInMM: () => 760,
    };

    mockUseWeather.mockReturnValue({
      weather,
      loading: false,
      error: null,
      fetchWeather,
    });

    rerender(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );

    expect(fetchWeather).toHaveBeenCalledWith({
      type: "city",
      cityName: "Moscow",
    });
  });

  it("should call fetchWeather when history city is clicked", () => {
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

    expect(fetchWeather).toHaveBeenCalledWith({
      type: "city",
      cityName: "Moscow",
    });
  });
});
