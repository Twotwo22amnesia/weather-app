"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { GENERIC_ERROR_MESSAGE, WeatherError } from "@/lib/weather/errors";
import type { Weather } from "@/lib/weather/types";
import { fetchWeather } from "@/services/weatherApi";

export type WeatherState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: Weather }
  | { status: "error"; message: string };

export function useWeather() {
  const [state, setState] = useState<WeatherState>({ status: "idle" });
  const controllerRef = useRef<AbortController | null>(null);

  useEffect(() => () => controllerRef.current?.abort(), []);

  const search = useCallback(async (city: string) => {
    // Si el usuario busca otra ciudad antes de que termine la petición anterior,
    // se cancela para que una respuesta lenta no pise a la más reciente.
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    setState({ status: "loading" });

    try {
      const data = await fetchWeather(city, controller.signal);
      setState({ status: "success", data });
    } catch (error) {
      if (controller.signal.aborted) return;
      setState({
        status: "error",
        message:
          error instanceof WeatherError ? error.message : GENERIC_ERROR_MESSAGE,
      });
    }
  }, []);

  return { state, search };
}
