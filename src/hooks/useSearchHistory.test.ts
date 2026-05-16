import { renderHook, act } from "@testing-library/react";
import { useSearchHistory } from "@/hooks/useSearchHistory";
import * as weatherStorage from "@/utils/weatherStorageService";

jest.mock("@/utils/weatherStorageService");

const mockWeatherStorage = jest.mocked(weatherStorage);

describe("useSearchHistory", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockWeatherStorage.getSearchHistory.mockReturnValue([]);
  });

  it("should initialize with empty history", () => {
    const { result } = renderHook(() => useSearchHistory());

    expect(result.current.history).toEqual([]);
    expect(result.current.lastCity).toBeNull();
  });

  it("should initialize with existing history from storage", () => {
    mockWeatherStorage.getSearchHistory.mockReturnValue(["Moscow", "London"]);

    const { result } = renderHook(() => useSearchHistory());

    expect(result.current.history).toEqual(["Moscow", "London"]);
    expect(result.current.lastCity).toBe("Moscow");
  });

  it("should add city via addCity", () => {
    mockWeatherStorage.addToHistory.mockReturnValue(["Paris", "Moscow"]);

    const { result } = renderHook(() => useSearchHistory());

    act(() => {
      result.current.addCity("Paris");
    });

    expect(mockWeatherStorage.addToHistory).toHaveBeenCalledWith("Paris");
    expect(result.current.history).toEqual(["Paris", "Moscow"]);
  });

  it("should trim city name before adding", () => {
    mockWeatherStorage.addToHistory.mockReturnValue(["Berlin"]);

    const { result } = renderHook(() => useSearchHistory());

    act(() => {
      result.current.addCity("  Berlin  ");
    });

    expect(mockWeatherStorage.addToHistory).toHaveBeenCalledWith("Berlin");
  });

  it("should not add empty city name", () => {
    const { result } = renderHook(() => useSearchHistory());

    act(() => {
      result.current.addCity("");
    });

    expect(mockWeatherStorage.addToHistory).not.toHaveBeenCalled();
  });

  it("should remove city via removeCity", () => {
    mockWeatherStorage.getSearchHistory
      .mockReturnValueOnce(["Moscow", "London", "Paris"])
      .mockReturnValueOnce(["Moscow", "Paris"]);

    const { result } = renderHook(() => useSearchHistory());

    act(() => {
      result.current.removeCity("London");
    });

    expect(mockWeatherStorage.removeFromHistory).toHaveBeenCalledWith("London");
    expect(result.current.history).toEqual(["Moscow", "Paris"]);
  });

  it("should clear history via clearHistory", () => {
    const { result } = renderHook(() => useSearchHistory());

    act(() => {
      result.current.clearHistory();
    });

    expect(mockWeatherStorage.clearHistory).toHaveBeenCalled();
    expect(result.current.history).toEqual([]);
    expect(result.current.lastCity).toBeNull();
  });
});
