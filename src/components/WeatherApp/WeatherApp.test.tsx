import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { WeatherError } from "@/lib/weather/errors";
import { fetchWeather } from "@/services/weatherApi";
import { madridWeather } from "@test/fixtures";
import { WeatherApp } from "./WeatherApp";

jest.mock("@/services/weatherApi");

const fetchWeatherMock = jest.mocked(fetchWeather);

async function searchCity(city: string) {
  const user = userEvent.setup();
  await user.type(screen.getByRole("textbox", { name: /ciudad/i }), city);
  await user.click(screen.getByRole("button", { name: /buscar/i }));
}

describe("WeatherApp", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it("muestra un mensaje inicial antes de buscar", () => {
    render(<WeatherApp />);

    expect(
      screen.getByText(/escribe el nombre de una ciudad/i),
    ).toBeInTheDocument();
  });

  it("muestra el clima después de una búsqueda exitosa", async () => {
    fetchWeatherMock.mockResolvedValue(madridWeather);
    render(<WeatherApp />);

    await searchCity("Madrid");

    expect(
      await screen.findByRole("heading", { name: "Madrid, ES" }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Temperatura actual")).toHaveTextContent(
      "22°C",
    );
    expect(screen.getByText("48%")).toBeInTheDocument();
    expect(screen.getByText("cielo claro")).toBeInTheDocument();
    expect(fetchWeatherMock).toHaveBeenCalledWith(
      "Madrid",
      expect.any(AbortSignal),
    );
  });

  it("muestra un error cuando la ciudad no existe", async () => {
    fetchWeatherMock.mockRejectedValue(
      new WeatherError("CITY_NOT_FOUND", 'No encontramos la ciudad "Xyzabc".'),
    );
    render(<WeatherApp />);

    await searchCity("Xyzabc");

    expect(await screen.findByRole("alert")).toHaveTextContent(
      'No encontramos la ciudad "Xyzabc".',
    );
    expect(screen.queryByRole("article")).not.toBeInTheDocument();
  });

  it("indica que está cargando mientras espera la respuesta", async () => {
    fetchWeatherMock.mockReturnValue(new Promise(() => {}));
    render(<WeatherApp />);

    await searchCity("Lima");

    expect(screen.getByText(/consultando el clima/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /buscando/i })).toBeDisabled();
  });
});
