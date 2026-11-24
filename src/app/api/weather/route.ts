import { NextResponse } from "next/server";
import { GENERIC_ERROR_MESSAGE, WeatherError } from "@/lib/weather/errors";
import { getCurrentWeather } from "@/lib/weather/openWeather";
import type { WeatherErrorBody, WeatherErrorCode } from "@/lib/weather/types";

const MAX_CITY_LENGTH = 100;

const STATUS_BY_CODE: Record<WeatherErrorCode, number> = {
  INVALID_CITY: 400,
  CITY_NOT_FOUND: 404,
  SERVICE_UNAVAILABLE: 502,
};

function errorResponse(error: WeatherError) {
  const body: WeatherErrorBody = {
    error: { code: error.code, message: error.message },
  };
  return NextResponse.json(body, { status: STATUS_BY_CODE[error.code] });
}

export async function GET(request: Request) {
  const city = new URL(request.url).searchParams.get("city")?.trim() ?? "";

  if (!city || city.length > MAX_CITY_LENGTH) {
    return errorResponse(
      new WeatherError("INVALID_CITY", "Ingresa un nombre de ciudad válido."),
    );
  }

  const apiKey = process.env.OPENWEATHER_API_KEY;
  if (!apiKey) {
    console.error("Falta la variable de entorno OPENWEATHER_API_KEY");
    return errorResponse(
      new WeatherError("SERVICE_UNAVAILABLE", GENERIC_ERROR_MESSAGE),
    );
  }

  try {
    const weather = await getCurrentWeather(city, apiKey);
    return NextResponse.json(weather);
  } catch (error) {
    if (error instanceof WeatherError) {
      return errorResponse(error);
    }
    console.error(error);
    return errorResponse(
      new WeatherError("SERVICE_UNAVAILABLE", GENERIC_ERROR_MESSAGE),
    );
  }
}
