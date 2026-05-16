import { createLocationFromGeoData, createLocationFromIPData } from "@/utils/locationModel";

describe("locationModel", () => {
  describe("createLocationFromGeoData", () => {
    it("should create location model from valid geo data", () => {
      const geoData = {
        latitude: 51.5074,
        longitude: -0.1278,
        name: "London",
        country: "United Kingdom",
        timezone: "Europe/London",
      };

      const result = createLocationFromGeoData(geoData);

      expect(result).toEqual({
        key: "51.5074,-0.1278",
        name: "London",
        country: "United Kingdom",
        localizedName: "London",
        geo: { lat: 51.5074, lng: -0.1278 },
        timeZone: "Europe/London",
      });
    });

    it("should handle negative coordinates", () => {
      const geoData = {
        latitude: -33.8688,
        longitude: -151.2093,
        name: "Sydney",
        country: "Australia",
        timezone: "Australia/Sydney",
      };

      const result = createLocationFromGeoData(geoData);

      expect(result.key).toEqual("-33.8688,-151.2093");
      expect(result.geo.lat).toEqual(-33.8688);
      expect(result.geo.lng).toEqual(-151.2093);
    });

    it("should preserve localizedName same as name", () => {
      const geoData = {
        latitude: 52.52,
        longitude: 13.405,
        name: "Berlin",
        country: "Germany",
        timezone: "Europe/Berlin",
      };

      const result = createLocationFromGeoData(geoData);

      expect(result.localizedName).toEqual(result.name);
    });
  });

  describe("createLocationFromIPData", () => {
    it("should create location model from valid IP data", () => {
      const ipData = {
        lat: 37.7749,
        lon: -122.4194,
        city: "San Francisco",
        country: "USA",
        timezone: "America/Los_Angeles",
      };

      const result = createLocationFromIPData(ipData);

      expect(result).toEqual({
        key: "37.7749,-122.4194",
        name: "San Francisco",
        country: "USA",
        localizedName: "San Francisco",
        geo: { lat: 37.7749, lng: -122.4194 },
        timeZone: "America/Los_Angeles",
      });
    });

    it("should handle southern hemisphere IP data", () => {
      const ipData = {
        lat: -33.8688,
        lon: 151.2093,
        city: "Sydney",
        country: "Australia",
        timezone: "Australia/Sydney",
      };

      const result = createLocationFromIPData(ipData);

      expect(result.key).toEqual("-33.8688,151.2093");
      expect(result.geo.lat).toEqual(-33.8688);
      expect(result.geo.lng).toEqual(151.2093);
    });

    it("should handle city names with spaces", () => {
      const ipData = {
        lat: 34.0522,
        lon: -118.2437,
        city: "Los Angeles",
        country: "USA",
        timezone: "America/Los_Angeles",
      };

      const result = createLocationFromIPData(ipData);

      expect(result.name).toEqual("Los Angeles");
      expect(result.localizedName).toEqual("Los Angeles");
    });
  });

  describe("comparison between both methods", () => {
    it("should produce same structure from both methods", () => {
      const geoData = {
        latitude: 41.9028,
        longitude: 12.4964,
        name: "Rome",
        country: "Italy",
        timezone: "Europe/Rome",
      };

      const ipData = {
        lat: 41.9028,
        lon: 12.4964,
        city: "Rome",
        country: "Italy",
        timezone: "Europe/Rome",
      };

      const geoResult = createLocationFromGeoData(geoData);
      const ipResult = createLocationFromIPData(ipData);

      expect(geoResult.key).toEqual(ipResult.key);
      expect(geoResult.name).toEqual(ipResult.name);
      expect(geoResult.geo.lat).toEqual(ipResult.geo.lat);
    });

    it("should handle zero coordinates correctly", () => {
      const geoData = {
        latitude: 0,
        longitude: 0,
        name: "Null Island",
        country: "International Waters",
        timezone: "UTC",
      };

      const ipData = {
        lat: 0,
        lon: 0,
        city: "Null Island",
        country: "International Waters",
        timezone: "UTC",
      };

      const geoResult = createLocationFromGeoData(geoData);
      const ipResult = createLocationFromIPData(ipData);

      expect(geoResult.key).toEqual("0,0");
      expect(ipResult.key).toEqual("0,0");
    });
  });
});
