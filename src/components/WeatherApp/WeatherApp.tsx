"use client";

import { SearchForm } from "@/components/SearchForm/SearchForm";
import { WeatherCard } from "@/components/WeatherCard/WeatherCard";
import { useWeather } from "@/hooks/useWeather";
import styles from "./WeatherApp.module.css";

export function WeatherApp() {
  const { state, search } = useWeather();

  return (
    <>
      <SearchForm onSearch={search} isLoading={state.status === "loading"} />

      <section className={styles.result} aria-live="polite">
        {state.status === "idle" && (
          <p className={styles.message}>
            Escribe el nombre de una ciudad para ver su clima actual.
          </p>
        )}
        {state.status === "loading" && (
          <p className={styles.message}>Consultando el clima…</p>
        )}
        {state.status === "error" && (
          <p role="alert" className={styles.error}>
            {state.message}
          </p>
        )}
        {state.status === "success" && <WeatherCard weather={state.data} />}
      </section>
    </>
  );
}
