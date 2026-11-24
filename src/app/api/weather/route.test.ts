/**
 * @jest-environment node
 */
import { WeatherError } from "@/lib/weather/errors";
import { getCurrentWeather } from "@/lib/weather/openWeather";
import { madridWeather } from "@test/fixtures";
import { GET } from "./route";

jest.mock("@/lib/weather/openWeather");

const getCurrentWeatherMock = jest.mocked(getCurrentWeather);

function request(query: string) {
  return new Request(`http://localhost/api/weather${query}`);
}

describe("GET /api/weather", () => {
  const originalApiKey = process.env.OPENWEATHER_API_KEY;

  beforeEach(() => {
    process.env.OPENWEATHER_API_KEY = "test-key";
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    process.env.OPENWEATHER_API_KEY = originalApiKey;
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  it("devuelve el clima de la ciudad", async () => {
    getCurrentWeatherMock.mockResolvedValue(madridWeather);

    const response = await GET(request("?city=%20Madrid%20"));

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual(madridWeather);
    expect(getCurrentWeatherMock).toHaveBeenCalledWith("Madrid", "test-key");
  });

  it.each([
    ["sin parámetro", ""],
    ["vacío", "?city=%20%20"],
    ["demasiado largo", `?city=${"a".repeat(101)}`],
  ])("responde 400 si la ciudad es inválida (%s)", async (_case, query) => {
    const response = await GET(request(query));

    expect(response.status).toBe(400);
    expect(await response.json()).toMatchObject({
      error: { code: "INVALID_CITY" },
    });
    expect(getCurrentWeatherMock).not.toHaveBeenCalled();
  });

  it("responde 404 si la ciudad no existe", async () => {
    getCurrentWeatherMock.mockRejectedValue(
      new WeatherError("CITY_NOT_FOUND", "No encontramos la ciudad"),
    );

    const response = await GET(request("?city=Xyzabc"));

    expect(response.status).toBe(404);
    expect(await response.json()).toEqual({
      error: { code: "CITY_NOT_FOUND", message: "No encontramos la ciudad" },
    });
  });

  it("responde 502 si falta la API key", async () => {
    delete process.env.OPENWEATHER_API_KEY;

    const response = await GET(request("?city=Madrid"));

    expect(response.status).toBe(502);
    expect(getCurrentWeatherMock).not.toHaveBeenCalled();
  });

  it("responde 502 ante un error inesperado", async () => {
    getCurrentWeatherMock.mockRejectedValue(new Error("boom"));

    const response = await GET(request("?city=Madrid"));

    expect(response.status).toBe(502);
    expect(await response.json()).toMatchObject({
      error: { code: "SERVICE_UNAVAILABLE" },
    });
  });
});
