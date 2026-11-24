export interface Weather {
  city: string;
  country: string;
  temperature: number;
  feelsLike: number;
  humidity: number;
  description: string;
  icon: string;
  windSpeed: number;
}

export type WeatherErrorCode =
  | "INVALID_CITY"
  | "CITY_NOT_FOUND"
  | "SERVICE_UNAVAILABLE";

export interface WeatherErrorBody {
  error: {
    code: WeatherErrorCode;
    message: string;
  };
}
