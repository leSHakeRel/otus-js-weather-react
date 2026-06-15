import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { WeatherSearch } from "@/components/WeatherSearch";

describe("WeatherSearch", () => {
  it("should render search form", () => {
    render(<WeatherSearch onSearch={jest.fn()} />);

    expect(screen.getByText("Прогноз погоды")).toBeInTheDocument();
    expect(screen.getByLabelText("Поиск по IP")).toBeInTheDocument();
    expect(screen.getByLabelText("Поиск названия города")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Поиск")).toBeInTheDocument();
  });

  it("should have IP search selected by default", () => {
    render(<WeatherSearch onSearch={jest.fn()} />);

    const ipRadio = screen.getByLabelText("Поиск по IP") as HTMLInputElement;
    expect(ipRadio.checked).toBe(true);
  });

  it("should hide city input by default", () => {
    render(<WeatherSearch onSearch={jest.fn()} />);

    const cityInput = screen.getByPlaceholderText("Поиск погоды по городу") as HTMLInputElement;
    expect(cityInput.style.display).toBe("none");
  });

  it("should show city input when city search is selected", () => {
    render(<WeatherSearch onSearch={jest.fn()} />);

    const cityRadio = screen.getByLabelText("Поиск названия города") as HTMLInputElement;
    fireEvent.click(cityRadio);

    const cityInput = screen.getByPlaceholderText("Поиск погоды по городу") as HTMLInputElement;
    expect(cityInput.style.display).toBe("block");
  });

  it("should call onSearch with auto type when IP is selected", () => {
    const onSearch = jest.fn();
    render(<WeatherSearch onSearch={onSearch} />);

    const submitButton = screen.getByDisplayValue("Поиск");
    fireEvent.click(submitButton);

    expect(onSearch).toHaveBeenCalledWith({
      type: "auto",
      cityName: "",
    });
  });

  it("should call onSearch with city type and city name", () => {
    const onSearch = jest.fn();
    render(<WeatherSearch onSearch={onSearch} />);

    const cityRadio = screen.getByLabelText("Поиск названия города") as HTMLInputElement;
    fireEvent.click(cityRadio);

    const cityInput = screen.getByPlaceholderText("Поиск погоды по городу") as HTMLInputElement;
    fireEvent.change(cityInput, { target: { value: "Moscow" } });

    const submitButton = screen.getByDisplayValue("Поиск");
    fireEvent.click(submitButton);

    expect(onSearch).toHaveBeenCalledWith({
      type: "city",
      cityName: "Moscow",
    });
  });
});
