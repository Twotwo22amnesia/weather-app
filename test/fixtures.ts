import type { Weather } from "@/lib/weather/types";

export const madridWeather: Weather = {
  city: "Madrid",
  country: "ES",
  temperature: 21.6,
  feelsLike: 20.4,
  humidity: 48,
  description: "cielo claro",
  icon: "01d",
  windSpeed: 3.6,
};

export function mockFetchResponse(body: unknown, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: jest.fn().mockResolvedValue(body),
  } as unknown as Response;
}
