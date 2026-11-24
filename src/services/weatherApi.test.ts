import { GENERIC_ERROR_MESSAGE, WeatherError } from "@/lib/weather/errors";
import { madridWeather, mockFetchResponse } from "@test/fixtures";
import { fetchWeather } from "./weatherApi";

describe("fetchWeather", () => {
  const fetchMock = jest.fn();

  beforeEach(() => {
    global.fetch = fetchMock;
  });

  afterEach(() => {
    fetchMock.mockReset();
  });

  it("llama a la API interna con la ciudad codificada", async () => {
    fetchMock.mockResolvedValue(mockFetchResponse(madridWeather));

    const result = await fetchWeather("São Paulo");

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/weather?city=S%C3%A3o%20Paulo",
      { signal: undefined },
    );
    expect(result).toEqual(madridWeather);
  });

  it("lanza un WeatherError con el mensaje que devuelve la API", async () => {
    fetchMock.mockResolvedValue(
      mockFetchResponse(
        { error: { code: "CITY_NOT_FOUND", message: "No existe" } },
        404,
      ),
    );

    const error = await fetchWeather("Nowhere").catch((e: unknown) => e);

    expect(error).toBeInstanceOf(WeatherError);
    expect(error).toMatchObject({
      code: "CITY_NOT_FOUND",
      message: "No existe",
    });
  });

  it("usa un mensaje genérico si la respuesta de error no es la esperada", async () => {
    const response = mockFetchResponse(null, 500);
    (response.json as jest.Mock).mockRejectedValue(new SyntaxError("bad json"));
    fetchMock.mockResolvedValue(response);

    await expect(fetchWeather("Madrid")).rejects.toThrow(GENERIC_ERROR_MESSAGE);
  });
});
