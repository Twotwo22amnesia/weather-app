import { GENERIC_ERROR_MESSAGE, WeatherError } from "@/lib/weather/errors";
import type { Weather, WeatherErrorBody } from "@/lib/weather/types";

function isErrorBody(body: unknown): body is WeatherErrorBody {
  return (
    typeof body === "object" &&
    body !== null &&
    "error" in body &&
    typeof (body as WeatherErrorBody).error?.message === "string"
  );
}

export async function fetchWeather(
  city: string,
  signal?: AbortSignal,
): Promise<Weather> {
  const response = await fetch(
    `/api/weather?city=${encodeURIComponent(city)}`,
    { signal },
  );
  const body: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    if (isErrorBody(body)) {
      throw new WeatherError(body.error.code, body.error.message);
    }
    throw new WeatherError("SERVICE_UNAVAILABLE", GENERIC_ERROR_MESSAGE);
  }

  return body as Weather;
}
