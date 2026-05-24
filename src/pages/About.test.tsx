import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { About } from "@/pages/About";

function renderWithRouter(ui: React.ReactElement) {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
}

describe("About", () => {
  it("should render the heading", () => {
    renderWithRouter(<About />);

    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
      "О приложении «Прогноз погоды»",
    );
  });

  it("should render technologies list", () => {
    renderWithRouter(<About />);

    expect(screen.getByText("Vanilla JavaScript (ES6+)")).toBeInTheDocument();
    expect(screen.getByText("Клиентский роутинг с поддержкой истории")).toBeInTheDocument();
    expect(screen.getByText("Event-driven архитектура (EventBus)")).toBeInTheDocument();
    expect(screen.getByText("Open-Meteo API для данных о погоде")).toBeInTheDocument();
    expect(screen.getByText("IP-API для геолокации")).toBeInTheDocument();
  });

  it("should render external links", () => {
    renderWithRouter(<About />);

    const openMeteoLink = screen.getByText("Open-Meteo API");
    const ipApiLink = screen.getByText("IP-API");

    expect(openMeteoLink).toBeInTheDocument();
    expect(ipApiLink).toBeInTheDocument();
    expect(openMeteoLink.closest("a")).toHaveAttribute("href", "https://open-meteo.com/");
    expect(ipApiLink.closest("a")).toHaveAttribute("href", "https://ip-api.com/");
  });

  it("should render back-to-home link pointing to /main", () => {
    renderWithRouter(<About />);

    const backLink = screen.getByText("Вернуться на главную");
    expect(backLink).toBeInTheDocument();
    expect(backLink).toHaveAttribute("href", "/main");
  });

  it("should render description paragraph", () => {
    renderWithRouter(<About />);

    expect(screen.getByText("Приложение для просмотра прогноза погоды")).toBeInTheDocument();
  });
});
