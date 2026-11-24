import type { WeatherErrorCode } from "./types";

export class WeatherError extends Error {
  readonly code: WeatherErrorCode;

  constructor(code: WeatherErrorCode, message: string) {
    super(message);
    this.name = "WeatherError";
    this.code = code;
  }
}

export const GENERIC_ERROR_MESSAGE =
  "No pudimos obtener el clima. Intenta de nuevo en unos minutos.";
