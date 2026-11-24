import Image from "next/image";
import type { Weather } from "@/lib/weather/types";
import styles from "./WeatherCard.module.css";

interface WeatherCardProps {
  weather: Weather;
}

export function WeatherCard({ weather }: WeatherCardProps) {
  return (
    <article className={styles.card} aria-labelledby="weather-city">
      <header>
        <h2 id="weather-city" className={styles.city}>
          {[weather.city, weather.country].filter(Boolean).join(", ")}
        </h2>
        <p className={styles.description}>{weather.description}</p>
      </header>

      <div className={styles.current}>
        {weather.icon && (
          <Image
            src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
            alt=""
            width={72}
            height={72}
          />
        )}
        <p className={styles.temperature} aria-label="Temperatura actual">
          {Math.round(weather.temperature)}°C
        </p>
      </div>

      <dl className={styles.details}>
        <div>
          <dt>Humedad</dt>
          <dd>{weather.humidity}%</dd>
        </div>
        <div>
          <dt>Sensación térmica</dt>
          <dd>{Math.round(weather.feelsLike)}°C</dd>
        </div>
        <div>
          <dt>Viento</dt>
          <dd>{weather.windSpeed} m/s</dd>
        </div>
      </dl>
    </article>
  );
}
