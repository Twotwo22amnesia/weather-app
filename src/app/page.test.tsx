import { render, screen } from "@testing-library/react";
import Home from "./page";

describe("Home", () => {
  it("muestra el título y el buscador", () => {
    render(<Home />);

    expect(screen.getByRole("heading", { level: 1, name: "Clima" })).toBeInTheDocument();
    expect(screen.getByRole("search")).toBeInTheDocument();
  });
});
