import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import App from "./App";

describe("App", () => {
  it("renders the heading", () => {
    render(<App />);
    const heading = screen.getByRole("heading", { name: /прогноз погоды/i });
    expect(heading).toBeInTheDocument();
  });
});
