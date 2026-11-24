import { render, screen } from "@testing-library/react";
import { madridWeather } from "@test/fixtures";
import { WeatherCard } from "./WeatherCard";

describe("WeatherCard", () => {
  it("muestra ciudad, temperatura redondeada, humedad y descripción", () => {
    render(<WeatherCard weather={madridWeather} />);

    expect(
      screen.getByRole("heading", { name: "Madrid, ES" }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Temperatura actual")).toHaveTextContent(
      "22°C",
    );
    expect(screen.getByText("48%")).toBeInTheDocument();
    expect(screen.getByText("cielo claro")).toBeInTheDocument();
    expect(screen.getByText("20°C")).toBeInTheDocument();
    expect(screen.getByText("3.6 m/s")).toBeInTheDocument();
  });

  it("no renderiza el ícono ni el país si no vienen en los datos", () => {
    const { container } = render(
      <WeatherCard weather={{ ...madridWeather, icon: "", country: "" }} />,
    );

    expect(container.querySelector("img")).toBeNull();
    expect(screen.getByRole("heading", { name: "Madrid" })).toBeInTheDocument();
  });
});
