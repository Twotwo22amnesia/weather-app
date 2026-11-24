import { mockFetchResponse } from "@test/fixtures";
import { GENERIC_ERROR_MESSAGE } from "./errors";
import {
  getCurrentWeather,
  toWeather,
  type OpenWeatherResponse,
} from "./openWeather";

const apiResponse: OpenWeatherResponse = {
  name: "Madrid",
  sys: { country: "ES" },
  main: { temp: 21.6, feels_like: 20.4, humidity: 48 },
  weather: [{ description: "cielo claro", icon: "01d" }],
  wind: { speed: 3.6 },
};

describe("toWeather", () => {
  it("convierte la respuesta de OpenWeatherMap al modelo de la app", () => {
    expect(toWeather(apiResponse)).toEqual({
      city: "Madrid",
      country: "ES",
      temperature: 21.6,
      feelsLike: 20.4,
      humidity: 48,
      description: "cielo claro",
      icon: "01d",
      windSpeed: 3.6,
    });
  });

  it("tolera que no venga ninguna condición climática", () => {
    const weather = toWeather({ ...apiResponse, weather: [] });

    expect(weather.description).toBe("");
    expect(weather.icon).toBe("");
  });
});

describe("getCurrentWeather", () => {
  const fetchMock = jest.fn();

  beforeEach(() => {
    global.fetch = fetchMock;
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    fetchMock.mockReset();
    jest.restoreAllMocks();
  });

  it("pide el clima en unidades métricas y en español", async () => {
    fetchMock.mockResolvedValue(mockFetchResponse(apiResponse));

    const weather = await getCurrentWeather("Madrid", "test-key");

    const url = new URL(fetchMock.mock.calls[0][0]);
    expect(url.searchParams.get("q")).toBe("Madrid");
    expect(url.searchParams.get("appid")).toBe("test-key");
    expect(url.searchParams.get("units")).toBe("metric");
    expect(url.searchParams.get("lang")).toBe("es");
    expect(weather.city).toBe("Madrid");
  });

  it("lanza CITY_NOT_FOUND cuando la API responde 404", async () => {
    fetchMock.mockResolvedValue(
      mockFetchResponse({ cod: "404", message: "city not found" }, 404),
    );

    await expect(
      getCurrentWeather("Xyzabc", "test-key"),
    ).rejects.toMatchObject({ code: "CITY_NOT_FOUND" });
  });

  it("lanza SERVICE_UNAVAILABLE ante otros errores de la API", async () => {
    fetchMock.mockResolvedValue(mockFetchResponse({ cod: 401 }, 401));

    await expect(getCurrentWeather("Madrid", "bad-key")).rejects.toMatchObject({
      code: "SERVICE_UNAVAILABLE",
      message: GENERIC_ERROR_MESSAGE,
    });
  });

  it("lanza SERVICE_UNAVAILABLE si no hay conexión", async () => {
    fetchMock.mockRejectedValue(new TypeError("fetch failed"));

    await expect(
      getCurrentWeather("Madrid", "test-key"),
    ).rejects.toMatchObject({ code: "SERVICE_UNAVAILABLE" });
  });
});
