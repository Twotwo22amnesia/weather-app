import { act, renderHook } from "@testing-library/react";
import { GENERIC_ERROR_MESSAGE, WeatherError } from "@/lib/weather/errors";
import { fetchWeather } from "@/services/weatherApi";
import { madridWeather } from "@test/fixtures";
import { useWeather } from "./useWeather";

jest.mock("@/services/weatherApi");

const fetchWeatherMock = jest.mocked(fetchWeather);

describe("useWeather", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it("empieza en estado idle", () => {
    const { result } = renderHook(() => useWeather());

    expect(result.current.state).toEqual({ status: "idle" });
  });

  it("guarda los datos cuando la búsqueda sale bien", async () => {
    fetchWeatherMock.mockResolvedValue(madridWeather);
    const { result } = renderHook(() => useWeather());

    await act(() => result.current.search("Madrid"));

    expect(result.current.state).toEqual({
      status: "success",
      data: madridWeather,
    });
  });

  it("usa el mensaje del WeatherError cuando falla la búsqueda", async () => {
    fetchWeatherMock.mockRejectedValue(
      new WeatherError("CITY_NOT_FOUND", "Ciudad no encontrada"),
    );
    const { result } = renderHook(() => useWeather());

    await act(() => result.current.search("Nowhere"));

    expect(result.current.state).toEqual({
      status: "error",
      message: "Ciudad no encontrada",
    });
  });

  it("muestra un mensaje genérico ante errores inesperados", async () => {
    fetchWeatherMock.mockRejectedValue(new TypeError("Failed to fetch"));
    const { result } = renderHook(() => useWeather());

    await act(() => result.current.search("Madrid"));

    expect(result.current.state).toEqual({
      status: "error",
      message: GENERIC_ERROR_MESSAGE,
    });
  });

  it("descarta la respuesta de una búsqueda que fue reemplazada por otra", async () => {
    fetchWeatherMock
      .mockImplementationOnce(
        (_city, signal) =>
          new Promise((_resolve, reject) => {
            signal?.addEventListener("abort", () =>
              reject(new DOMException("Aborted", "AbortError")),
            );
          }),
      )
      .mockResolvedValueOnce(madridWeather);
    const { result } = renderHook(() => useWeather());

    await act(async () => {
      const first = result.current.search("Lima");
      const second = result.current.search("Madrid");
      await Promise.all([first, second]);
    });

    expect(result.current.state).toEqual({
      status: "success",
      data: madridWeather,
    });
  });
});
