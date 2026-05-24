import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { WeatherMap } from "@/components/WeatherMap";

jest.mock("@pbe/react-yandex-maps", () => ({
  YMaps: ({ children }: { children: React.ReactNode }) => <div data-testid="ymaps">{children}</div>,
  Map: ({ children }: { children: React.ReactNode }) => <div data-testid="map">{children}</div>,
  Placemark: () => <div data-testid="placemark" />,
}));

describe("WeatherMap", () => {
  it("should not render when lat and lng are null", () => {
    const { container } = render(<WeatherMap lat={null} lng={null} />);

    expect(container.innerHTML).toBe("");
  });

  it("should not render when lat is null", () => {
    const { container } = render(<WeatherMap lat={null} lng={30} />);

    expect(container.innerHTML).toBe("");
  });

  it("should not render when lng is null", () => {
    const { container } = render(<WeatherMap lat={55} lng={null} />);

    expect(container.innerHTML).toBe("");
  });

  it("should render YMaps, Map and Placemark when coordinates are provided", () => {
    render(<WeatherMap lat={55.7558} lng={37.6173} cityName="Moscow" />);

    expect(screen.getByTestId("ymaps")).toBeInTheDocument();
    expect(screen.getByTestId("map")).toBeInTheDocument();
    expect(screen.getByTestId("placemark")).toBeInTheDocument();
  });
});
