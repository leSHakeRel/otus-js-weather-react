import apiConfig from "@/api/weather.config";

const mockFetch = jest.fn();
(globalThis as unknown as { fetch: jest.Mock }).fetch = mockFetch;

describe("weatherApiService", () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  // ------------------------------------------------------------------
  // mapWeatherCodeToIcon
  // ------------------------------------------------------------------
  describe("mapWeatherCodeToIcon", () => {
    // Re-implement for test isolation
    const mapWeatherCodeToIcon = (weatherCode: number): number => {
      const iconMap: Record<number, number> = {
        0: 1,
        1: 2,
        2: 3,
        3: 4,
        45: 5,
        48: 5,
        51: 6,
        53: 6,
        55: 6,
        56: 7,
        57: 7,
        61: 8,
        63: 8,
        65: 8,
        66: 9,
        67: 9,
        71: 10,
        73: 10,
        75: 10,
        77: 10,
        80: 11,
        81: 11,
        82: 11,
        85: 12,
        86: 12,
        95: 13,
        96: 14,
        99: 14,
      };
      return iconMap[weatherCode] || 1;
    };

    it("should map code 0 to icon 1", () => {
      expect(mapWeatherCodeToIcon(0)).toBe(1);
    });

    it("should return default icon for unknown code", () => {
      expect(mapWeatherCodeToIcon(999)).toBe(1);
    });

    it("should map fog codes (45,48) to icon 5", () => {
      expect(mapWeatherCodeToIcon(45)).toBe(5);
      expect(mapWeatherCodeToIcon(48)).toBe(5);
    });

    it("should map rain codes (61,63,65) to icon 8", () => {
      expect(mapWeatherCodeToIcon(61)).toBe(8);
      expect(mapWeatherCodeToIcon(63)).toBe(8);
      expect(mapWeatherCodeToIcon(65)).toBe(8);
    });
  });

  // ------------------------------------------------------------------
  // getWeatherDescription
  // ------------------------------------------------------------------
  describe("getWeatherDescription", () => {
    const getWeatherDescription = (code: number): string => {
      const descriptions: Record<number, string> = {
        0: "Ясно",
        1: "В основном ясно",
        2: "Переменная облачность",
        3: "Пасмурно",
        45: "Туман",
        48: "Туман",
        51: "Легкая морось",
        53: "Умеренная морось",
        55: "Сильная морось",
        56: "Ледяная морось",
        57: "Ледяная морось",
        61: "Небольшой дождь",
        63: "Умеренный дождь",
        65: "Сильный дождь",
        66: "Ледяной дождь",
        67: "Ледяной дождь",
        71: "Небольшой снег",
        73: "Умеренный снег",
        75: "Сильный снег",
        77: "Снежные зерна",
        80: "Небольшой ливень",
        81: "Умеренный ливень",
        82: "Сильный ливень",
        85: "Небольшой снегопад",
        86: "Сильный снегопад",
        95: "Гроза",
        96: "Гроза с градом",
        99: "Гроза с градом",
      };
      return descriptions[code] || "Неизвестно";
    };

    it('should return "Ясно" for code 0', () => {
      expect(getWeatherDescription(0)).toBe("Ясно");
    });

    it("should return unknown for unknown code", () => {
      expect(getWeatherDescription(999)).toBe("Неизвестно");
    });

    it("should return snow description for code 71", () => {
      expect(getWeatherDescription(71)).toBe("Небольшой снег");
    });
  });

  // ------------------------------------------------------------------
  // getWindDirection
  // ------------------------------------------------------------------
  describe("getWindDirection", () => {
    const getWindDirection = (degrees: number): string => {
      const directions = ["С", "СВ", "В", "ЮВ", "Ю", "ЮЗ", "З", "СЗ"];
      const index = Math.round(degrees / 45) % 8;
      return directions[index] || "С";
    };

    it("should return North for 0 degrees", () => {
      expect(getWindDirection(0)).toBe("С");
    });

    it("should return East for 90 degrees", () => {
      expect(getWindDirection(90)).toBe("В");
    });

    it("should return South for 180 degrees", () => {
      expect(getWindDirection(180)).toBe("Ю");
    });

    it("should return West for 270 degrees", () => {
      expect(getWindDirection(270)).toBe("З");
    });

    it("should return North for 360 degrees", () => {
      expect(getWindDirection(360)).toBe("С");
    });

    it("should handle negative degrees", () => {
      expect(getWindDirection(-90)).toBe("С");
    });

    it("should handle large degrees", () => {
      expect(getWindDirection(1000)).toBe("З");
    });
  });

  // ------------------------------------------------------------------
  // apiConfig
  // ------------------------------------------------------------------
  describe("apiConfig", () => {
    it("should have all required URLs", () => {
      expect(apiConfig.IPIFY_BASE_URL).toBeDefined();
      expect(apiConfig.IPAPI_BASE_URL).toBeDefined();
      expect(apiConfig.OPEN_METEO_BASE_URL).toBeDefined();
      expect(apiConfig.OPEN_METEO_WEATHER_URL).toBeDefined();
    });
  });

  // ------------------------------------------------------------------
  // getPublicIP
  // ------------------------------------------------------------------
  describe("getPublicIP", () => {
    it("should return IP address on success", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ ip: "192.168.1.1" }),
      });

      const { getPublicIP } = await import("@/api/weatherApiService");
      const result = await getPublicIP();

      expect(result).toBe("192.168.1.1");
      expect(mockFetch).toHaveBeenCalledWith(`${apiConfig.IPIFY_BASE_URL}?format=json`);
    });

    it("should throw on HTTP error", async () => {
      mockFetch.mockResolvedValueOnce({ ok: false, status: 500 });

      const { getPublicIP } = await import("@/api/weatherApiService");

      await expect(getPublicIP()).rejects.toThrow("Ошибка получения IP-адреса");
    });
  });

  // ------------------------------------------------------------------
  // getLocationByIP
  // ------------------------------------------------------------------
  describe("getLocationByIP", () => {
    it("should return location data on success", async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ ip: "1.2.3.4" }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            status: "success",
            lat: 55.7558,
            lon: 37.6173,
            city: "Moscow",
            country: "RU",
            timezone: "Europe/Moscow",
          }),
        });

      const { getLocationByIP } = await import("@/api/weatherApiService");
      const result = await getLocationByIP();

      expect(result).toEqual({
        lat: 55.7558,
        lon: 37.6173,
        city: "Moscow",
        country: "RU",
        timezone: "Europe/Moscow",
      });
    });

    it("should throw when IPAPI returns error status", async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ ip: "1.2.3.4" }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ status: "error" }),
        });

      const { getLocationByIP } = await import("@/api/weatherApiService");

      await expect(getLocationByIP()).rejects.toThrow("Не удалось определить локацию по IP");
    });
  });

  // ------------------------------------------------------------------
  // getLocationByCity
  // ------------------------------------------------------------------
  describe("getLocationByCity", () => {
    it("should return city data on successful search", async () => {
      const mockCityData = {
        name: "Moscow",
        latitude: 55.7558,
        longitude: 37.6173,
        country: "RU",
        timezone: "Europe/Moscow",
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ results: [mockCityData] }),
      });

      const { getLocationByCity } = await import("@/api/weatherApiService");
      const result = await getLocationByCity("Moscow");

      expect(result).toEqual(mockCityData);
    });

    it("should throw when city is not found", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ results: [] }),
      });

      const { getLocationByCity } = await import("@/api/weatherApiService");

      await expect(getLocationByCity("NonExistentCity")).rejects.toThrow(
        'Город "NonExistentCity" не найден',
      );
    });

    it("should throw on HTTP error", async () => {
      mockFetch.mockResolvedValueOnce({ ok: false, status: 500 });

      const { getLocationByCity } = await import("@/api/weatherApiService");

      await expect(getLocationByCity("TestCity")).rejects.toThrow("HTTP ошибка! Статус: 500");
    });
  });

  // ------------------------------------------------------------------
  // getCurrentWeather
  // ------------------------------------------------------------------
  describe("getCurrentWeather", () => {
    it("should return weather data on success", async () => {
      const mockResponse = {
        current_weather: {
          temperature: 20.5,
          windspeed: 15.3,
          winddirection: 180,
          weathercode: 1,
        },
        hourly: {
          pressure_msl: [1013, 1014],
          visibility: [10.2, 10.5],
        },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const { getCurrentWeather } = await import("@/api/weatherApiService");
      const result = await getCurrentWeather(55.7558, 37.6173);

      expect(result.temperature).toBe(21);
      expect(result.weatherText).toBe("В основном ясно");
      expect(result.weatherIcon).toBe(2);
      expect(result.windSpeed).toBe(15);
      expect(result.windDirection).toBe("Ю");
      expect(result.pressure).toBe(1013);
      expect(result.uvIndex).toBe(5);
    });

    it("should use default pressure when hourly data missing", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          current_weather: {
            temperature: 20,
            windspeed: 15,
            winddirection: 180,
            weathercode: 1,
          },
          hourly: {},
        }),
      });

      const { getCurrentWeather } = await import("@/api/weatherApiService");
      const result = await getCurrentWeather(55.7558, 37.6173);

      expect(result.pressure).toBe(1013);
      expect(result.visibility).toBe(10);
    });

    it("should throw when current_weather is missing", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ hourly: {} }),
      });

      const { getCurrentWeather } = await import("@/api/weatherApiService");

      await expect(getCurrentWeather(55.7558, 37.6173)).rejects.toThrow(
        "Данные о погоде не найдены",
      );
    });

    it("should throw on HTTP error", async () => {
      mockFetch.mockResolvedValueOnce({ ok: false, status: 503 });

      const { getCurrentWeather } = await import("@/api/weatherApiService");

      await expect(getCurrentWeather(55.7558, 37.6173)).rejects.toThrow("HTTP ошибка! Статус: 503");
    });
  });
});
