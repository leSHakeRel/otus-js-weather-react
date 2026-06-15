import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { WeatherSearchHistory } from "@/components/WeatherSearchHistory";

describe("WeatherSearchHistory", () => {
  const defaultProps = {
    history: ["Moscow", "London", "Paris"],
    onCityClick: jest.fn(),
    onRemoveCity: jest.fn(),
    onClearHistory: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render history list with cities", () => {
    render(<WeatherSearchHistory {...defaultProps} />);

    expect(screen.getByText("История поиска")).toBeInTheDocument();
    expect(screen.getByText("Moscow")).toBeInTheDocument();
    expect(screen.getByText("London")).toBeInTheDocument();
    expect(screen.getByText("Paris")).toBeInTheDocument();
  });

  it("should render clear history button when history is not empty", () => {
    render(<WeatherSearchHistory {...defaultProps} />);

    expect(screen.getByText("Очистить всю историю")).toBeInTheDocument();
    expect(screen.getByText("Очистить всю историю")).not.toBeDisabled();
  });

  it("should call onCityClick when city is clicked", () => {
    const onCityClick = jest.fn();
    render(<WeatherSearchHistory {...defaultProps} onCityClick={onCityClick} />);

    const moscowItem = screen.getByText("Moscow");
    fireEvent.click(moscowItem);

    expect(onCityClick).toHaveBeenCalledWith("Moscow");
  });

  it("should call onRemoveCity when remove button is clicked", () => {
    const onRemoveCity = jest.fn();
    render(<WeatherSearchHistory {...defaultProps} onRemoveCity={onRemoveCity} />);

    const removeButtons = screen.getAllByTitle("Удалить Moscow из истории");
    fireEvent.click(removeButtons[0]);

    expect(onRemoveCity).toHaveBeenCalledWith("Moscow");
  });

  it("should call onClearHistory when clear button is clicked", () => {
    const onClearHistory = jest.fn();
    render(<WeatherSearchHistory {...defaultProps} onClearHistory={onClearHistory} />);

    const clearButton = screen.getByText("Очистить всю историю");
    fireEvent.click(clearButton);

    expect(onClearHistory).toHaveBeenCalled();
  });

  describe("empty history", () => {
    it("should render empty state", () => {
      render(
        <WeatherSearchHistory
          history={[]}
          onCityClick={jest.fn()}
          onRemoveCity={jest.fn()}
          onClearHistory={jest.fn()}
        />,
      );

      expect(screen.getByText("История поиска пуста")).toBeInTheDocument();
      expect(
        screen.getByText("Найдите погоду в городе, чтобы добавить её в историю"),
      ).toBeInTheDocument();
    });

    it("should disable clear button when history is empty", () => {
      render(
        <WeatherSearchHistory
          history={[]}
          onCityClick={jest.fn()}
          onRemoveCity={jest.fn()}
          onClearHistory={jest.fn()}
        />,
      );

      const clearButton = screen.getByText("Очистить всю историю");
      expect(clearButton).toBeDisabled();
    });
  });
});
