import { renderHook, act } from "@testing-library/react";
import { useWeather } from "@/hooks/useWeather";
import * as weatherApi from "@/api/weatherApiService";
import * as locationModel from "@/utils/locationModel";
import * as weatherModel from "@/utils/weatherModel";
import type { WeatherData, SearchData } from "@/types";

jest.mock("@/api/weatherApiService");
jest.mock("@/utils/locationModel");
jest.mock("@/utils/weatherModel");

const mockWeatherApi = jest.mocked(weatherApi);
const mockLocationModel = jest.mocked(locationModel);
const mockWeatherModel = jest.mocked(weatherModel);

describe("useWeather", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return initial state", () => {
    const { result } = renderHook(() => useWeather());

    expect(result.current.weather).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("should fetch weather by IP (auto)", async () => {
    const ipLocation = {
      lat: 55.7558,
      lon: 37.6173,
      city: "Moscow",
      country: "RU",
      timezone: "Europe/Moscow",
    };
    const location = {
      key: "55.7558,37.6173",
      name: "Moscow",
      country: "RU",
      localizedName: "Moscow",
      geo: { lat: 55.7558, lng: 37.6173 },
      timeZone: "Europe/Moscow",
    };
    const rawWeather = {
      temperature: 20,
      weatherText: "Sunny",
      weatherIcon: 1,
      windSpeed: 10,
      windDirection: "N",
      windDirectionDegrees: 0,
      pressure: 1013,
      visibility: 10,
      uvIndex: 5,
      realFeel: 19,
    };
    const weatherData = {
      ...rawWeather,
      status: true,
      message: "",
      location,
      getPressureInMM: () => 760,
    };

    mockWeatherApi.getLocationByIP.mockResolvedValue(ipLocation);
    mockLocationModel.createLocationFromIPData.mockReturnValue(location);
    mockWeatherApi.getCurrentWeather.mockResolvedValue(rawWeather);
    mockWeatherModel.createWeatherModel.mockReturnValue(weatherData as WeatherData);

    const { result } = renderHook(() => useWeather());

    await act(async () => {
      await result.current.fetchWeather({ type: "auto", cityName: "" });
    });

    expect(mockWeatherApi.getLocationByIP).toHaveBeenCalledTimes(1);
    expect(mockWeatherApi.getCurrentWeather).toHaveBeenCalledWith(55.7558, 37.6173);
    expect(result.current.weather).toEqual(weatherData);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("should fetch weather by city", async () => {
    const cityGeoData = {
      name: "London",
      latitude: 51.5074,
      longitude: -0.1278,
      country: "UK",
      timezone: "Europe/London",
    };
    const location = {
      key: "51.5074,-0.1278",
      name: "London",
      country: "UK",
      localizedName: "London",
      geo: { lat: 51.5074, lng: -0.1278 },
      timeZone: "Europe/London",
    };
    const rawWeather = {
      temperature: 15,
      weatherText: "Cloudy",
      weatherIcon: 3,
      windSpeed: 5,
      windDirection: "SW",
      windDirectionDegrees: 225,
      pressure: 1015,
      visibility: 8,
      uvIndex: 3,
      realFeel: 14,
    };
    const weatherData = {
      ...rawWeather,
      status: true,
      message: "",
      location,
      getPressureInMM: () => 762,
    };

    mockWeatherApi.getLocationByCity.mockResolvedValue(cityGeoData);
    mockLocationModel.createLocationFromGeoData.mockReturnValue(location);
    mockWeatherApi.getCurrentWeather.mockResolvedValue(rawWeather);
    mockWeatherModel.createWeatherModel.mockReturnValue(weatherData as WeatherData);

    const { result } = renderHook(() => useWeather());

    await act(async () => {
      await result.current.fetchWeather({ type: "city", cityName: "London" });
    });

    expect(mockWeatherApi.getLocationByCity).toHaveBeenCalledWith("London");
    expect(mockWeatherApi.getCurrentWeather).toHaveBeenCalledWith(51.5074, -0.1278);
    expect(result.current.weather).toEqual(weatherData);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("should set error on API failure", async () => {
    mockWeatherApi.getLocationByIP.mockRejectedValue(new Error("Network error"));

    const { result } = renderHook(() => useWeather());

    await act(async () => {
      await result.current.fetchWeather({ type: "auto", cityName: "" });
    });

    expect(result.current.weather).toBeNull();
    expect(result.current.error).toBe("Network error");
    expect(result.current.loading).toBe(false);
  });

  it("should set loading to true during fetch", async () => {
    // Make the API call hang indefinitely so loading stays true
    mockWeatherApi.getLocationByIP.mockReturnValue(new Promise(() => {}));

    const { result } = renderHook(() => useWeather());

    act(() => {
      result.current.fetchWeather({ type: "auto", cityName: "" });
    });

    expect(result.current.loading).toBe(true);
  });

  it("should handle unknown location type", async () => {
    const { result } = renderHook(() => useWeather());

    await act(async () => {
      await result.current.fetchWeather({ type: "unknown", cityName: "" } as SearchData);
    });

    expect(result.current.error).toBe("Неизвестный тип локации");
    expect(result.current.weather).toBeNull();
  });
});
