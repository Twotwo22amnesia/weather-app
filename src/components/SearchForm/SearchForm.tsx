"use client";

import { useState, type FormEvent } from "react";
import styles from "./SearchForm.module.css";

interface SearchFormProps {
  onSearch: (city: string) => void;
  isLoading?: boolean;
}

export function SearchForm({ onSearch, isLoading = false }: SearchFormProps) {
  const [city, setCity] = useState("");
  const trimmedCity = city.trim();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSearch(trimmedCity);
  }

  return (
    <form role="search" className={styles.form} onSubmit={handleSubmit}>
      <label htmlFor="city" className={styles.label}>
        Ciudad
      </label>
      <input
        id="city"
        name="city"
        type="text"
        className={styles.input}
        placeholder="Ej. Bogotá, Madrid, Tokio"
        autoComplete="off"
        maxLength={100}
        value={city}
        onChange={(event) => setCity(event.target.value)}
      />
      <button
        type="submit"
        className={styles.button}
        disabled={!trimmedCity || isLoading}
      >
        {isLoading ? "Buscando…" : "Buscar"}
      </button>
    </form>
  );
}
