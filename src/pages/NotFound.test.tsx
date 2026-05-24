import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { NotFound } from "@/pages/NotFound";

function renderWithRouter(ui: React.ReactElement) {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
}

describe("NotFound", () => {
  it("should render 404 message", () => {
    renderWithRouter(<NotFound />);

    expect(screen.getByText("404 — Страница не найдена")).toBeInTheDocument();
    expect(screen.getByText("Запрашиваемая страница не существует.")).toBeInTheDocument();
  });

  it("should render back-to-home link pointing to /main", () => {
    renderWithRouter(<NotFound />);

    const backLink = screen.getByText("Вернуться на главную");
    expect(backLink).toBeInTheDocument();
    expect(backLink).toHaveAttribute("href", "/main");
  });

  it("should render navigation component", () => {
    renderWithRouter(<NotFound />);

    const mainLink = screen.getByText("Главная");
    const aboutLink = screen.getByText("О приложении");
    expect(mainLink).toBeInTheDocument();
    expect(aboutLink).toBeInTheDocument();
  });
});
