import { GENERIC_ERROR_MESSAGE, WeatherError } from "./errors";
import type { Weather } from "./types";

const API_URL = "https://api.openweathermap.org/data/2.5/weather";
const CACHE_SECONDS = 600;

export interface OpenWeatherResponse {
  name: string;
  sys: { country: string };
  main: { temp: number; feels_like: number; humidity: number };
  weather: { description: string; icon: string }[];
  wind: { speed: number };
}

export function toWeather(data: OpenWeatherResponse): Weather {
  const [condition] = data.weather;

  return {
    city: data.name,
    country: data.sys.country,
    temperature: data.main.temp,
    feelsLike: data.main.feels_like,
    humidity: data.main.humidity,
    description: condition?.description ?? "",
    icon: condition?.icon ?? "",
    windSpeed: data.wind.speed,
  };
}

export async function getCurrentWeather(
  city: string,
  apiKey: string,
): Promise<Weather> {
  const params = new URLSearchParams({
    q: city,
    appid: apiKey,
    units: "metric",
    lang: "es",
  });

  let response: Response;
  try {
    response = await fetch(`${API_URL}?${params}`, {
      next: { revalidate: CACHE_SECONDS },
    });
  } catch {
    throw new WeatherError("SERVICE_UNAVAILABLE", GENERIC_ERROR_MESSAGE);
  }

  if (response.status === 404) {
    throw new WeatherError(
      "CITY_NOT_FOUND",
      `No encontramos la ciudad "${city}". Revisa que esté bien escrita.`,
    );
  }

  if (!response.ok) {
    // 401 (API key inválida) o 429 (límite de peticiones) no le sirven al usuario,
    // así que se registran aquí y se responde con un mensaje genérico.
    console.error(`OpenWeatherMap respondió ${response.status}`);
    throw new WeatherError("SERVICE_UNAVAILABLE", GENERIC_ERROR_MESSAGE);
  }

  return toWeather((await response.json()) as OpenWeatherResponse);
}
