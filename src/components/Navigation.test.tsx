import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { Navigation } from "@/components/Navigation";

function renderWithRouter(ui: React.ReactElement) {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
}

describe("Navigation", () => {
  it("should render links to /main and /about", () => {
    renderWithRouter(<Navigation />);

    const mainLink = screen.getByText("Главная");
    const aboutLink = screen.getByText("О приложении");

    expect(mainLink).toBeInTheDocument();
    expect(aboutLink).toBeInTheDocument();
    expect(mainLink).toHaveAttribute("href", "/main");
    expect(aboutLink).toHaveAttribute("href", "/about");
  });

  it("should have nav element with class nav", () => {
    renderWithRouter(<Navigation />);

    const nav = document.querySelector("nav.nav");
    expect(nav).toBeInTheDocument();
  });
});
