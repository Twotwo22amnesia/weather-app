import { WeatherApp } from "@/components/WeatherApp/WeatherApp";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Clima</h1>
      <WeatherApp />
      <footer className={styles.footer}>
        Datos de{" "}
        <a href="https://openweathermap.org/" target="_blank" rel="noreferrer">
          OpenWeatherMap
        </a>
      </footer>
    </main>
  );
}
