import { storage, StorageKeys } from "@/utils/storageService";
import * as weatherStorage from "@/utils/weatherStorageService";

describe("weatherStorageService", () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  describe("getSearchHistory", () => {
    it("should return empty array when no history exists", () => {
      const result = weatherStorage.getSearchHistory();

      expect(result).toEqual([]);
    });

    it("should return history array when data exists", () => {
      const history = ["Moscow", "London", "Paris"];
      storage.set(StorageKeys.SEARCH_HISTORY, history);

      const result = weatherStorage.getSearchHistory();

      expect(result).toEqual(history);
    });
  });

  describe("saveSearchHistory", () => {
    it("should save history to storage", () => {
      weatherStorage.saveSearchHistory(["Moscow", "London"]);

      const storedValue = localStorage.getItem("weather_app_searchHistory");
      expect(storedValue).toBeTruthy();
      expect(JSON.parse(storedValue!)).toEqual(["Moscow", "London"]);
    });
  });

  describe("addToHistory", () => {
    it("should add city to beginning of history", () => {
      storage.set(StorageKeys.SEARCH_HISTORY, ["London", "Paris"]);

      const result = weatherStorage.addToHistory("Moscow");

      expect(result[0]).toBe("Moscow");
      expect(result[1]).toBe("London");
    });

    it("should not add duplicate city", () => {
      storage.set(StorageKeys.SEARCH_HISTORY, ["Moscow", "London"]);

      const result = weatherStorage.addToHistory("Moscow");

      expect(result.filter((city) => city === "Moscow").length).toBe(1);
      expect(result[0]).toBe("Moscow");
    });

    it("should limit history to maxItems", () => {
      const existingHistory = Array.from({ length: 15 }, (_, i) => `City ${i}`);
      storage.set(StorageKeys.SEARCH_HISTORY, existingHistory);

      const result = weatherStorage.addToHistory("New City", 10);

      expect(result.length).toBe(10);
    });

    it("should use default maxItems of 10", () => {
      const existingHistory = Array.from({ length: 15 }, (_, i) => `City ${i}`);
      storage.set(StorageKeys.SEARCH_HISTORY, existingHistory);

      const result = weatherStorage.addToHistory("New City");

      expect(result.length).toBe(10);
    });
  });

  describe("clearHistory", () => {
    it("should remove history from storage", () => {
      storage.set(StorageKeys.SEARCH_HISTORY, ["Moscow", "London"]);

      weatherStorage.clearHistory();

      expect(localStorage.getItem("weather_app_searchHistory")).toBeNull();
    });
  });

  describe("hasHistory", () => {
    it("should return false when history is empty", () => {
      const result = weatherStorage.hasHistory();

      expect(result).toBe(false);
    });

    it("should return true when history has items", () => {
      storage.set(StorageKeys.SEARCH_HISTORY, ["Moscow"]);

      const result = weatherStorage.hasHistory();

      expect(result).toBe(true);
    });
  });

  describe("getLastCity", () => {
    it("should return null when history is empty", () => {
      const result = weatherStorage.getLastCity();

      expect(result).toBeNull();
    });

    it("should return first city from history", () => {
      storage.set(StorageKeys.SEARCH_HISTORY, ["Moscow", "London"]);

      const result = weatherStorage.getLastCity();

      expect(result).toBe("Moscow");
    });
  });

  describe("removeFromHistory", () => {
    it("should remove city from history", () => {
      storage.set(StorageKeys.SEARCH_HISTORY, ["Moscow", "London", "Paris"]);

      weatherStorage.removeFromHistory("London");

      const result = weatherStorage.getSearchHistory();
      expect(result).not.toContain("London");
      expect(result).toContain("Moscow");
      expect(result).toContain("Paris");
    });

    it("should not affect other cities", () => {
      storage.set(StorageKeys.SEARCH_HISTORY, ["Moscow", "London", "Paris"]);

      weatherStorage.removeFromHistory("London");

      const result = weatherStorage.getSearchHistory();
      expect(result.length).toBe(2);
    });
  });
});
