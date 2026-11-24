# Clima

Aplicación hecha con Next.js para consultar el clima actual de una ciudad: temperatura, humedad, descripción, sensación térmica y viento. Los datos vienen de [OpenWeatherMap](https://openweathermap.org/current).

## Requisitos

- Node.js 20.9 o superior
- Una API key gratuita de OpenWeatherMap ([crear cuenta](https://home.openweathermap.org/users/sign_up)). Las keys nuevas pueden tardar unos minutos en activarse.

## Cómo ejecutarla

```bash
npm install
cp .env.example .env.local   # en Windows: copy .env.example .env.local
```

Edita `.env.local` y pon tu key:

```
OPENWEATHER_API_KEY=tu_api_key
```

Luego:

```bash
npm run dev
```

y abre http://localhost:3000.

Para la versión de producción: `npm run build` y `npm start`.

## Pruebas

```bash
npm test                # corre todas las pruebas
npm run test:coverage   # con reporte de cobertura
npm run test:watch      # modo watch
```

La cobertura mínima está configurada en 80% (statements, branches, functions y lines) en `jest.config.mjs`; si baja de ese valor, `npm run test:coverage` falla. El reporte HTML queda en `coverage/lcov-report/index.html`.

Las pruebas no llaman a la API real: `fetch` y el servicio se mockean, así que no hace falta la API key para correrlas.

Qué cubren los casos pedidos:

| Caso | Archivo |
| --- | --- |
| Se muestra el clima tras una búsqueda exitosa | `src/components/WeatherApp/WeatherApp.test.tsx` |
| Se maneja el error de ciudad inválida | `WeatherApp.test.tsx`, `src/app/api/weather/route.test.ts` |
| El campo y el botón de búsqueda funcionan | `src/components/SearchForm/SearchForm.test.tsx` |

Además hay pruebas del hook, del cliente HTTP, del adaptador de OpenWeatherMap y del route handler.

## Estructura

```
src/
├── app/
│   ├── api/weather/route.ts     # GET /api/weather?city=... (proxy a OpenWeatherMap)
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── SearchForm/              # input + botón
│   ├── WeatherCard/             # muestra los datos del clima
│   └── WeatherApp/              # une el formulario con el resultado
├── hooks/useWeather.ts          # estado de la búsqueda (idle / loading / success / error)
├── services/weatherApi.ts       # cliente que usa el navegador para llamar a /api/weather
└── lib/weather/
    ├── openWeather.ts           # llamada a OpenWeatherMap y mapeo al modelo propio
    ├── errors.ts
    └── types.ts
test/fixtures.ts                 # datos compartidos por las pruebas
```

## Decisiones

- **La API key no llega al navegador.** El cliente llama a `/api/weather` y es el route handler quien habla con OpenWeatherMap usando la variable de entorno del servidor.
- **Modelo propio de datos.** La respuesta de OpenWeatherMap se transforma a un tipo `Weather` en `lib/weather/openWeather.ts`. Si mañana se cambia de proveedor, solo se toca ese archivo.
- **Errores con código.** El backend responde `{ error: { code, message } }` con `400` (ciudad vacía o inválida), `404` (no existe) o `502` (falla del proveedor o falta la key). Los detalles técnicos (401, 429, etc.) se registran en el servidor y al usuario se le muestra un mensaje entendible.
- **Búsquedas que se pisan.** Si se busca otra ciudad antes de que responda la anterior, la petición vieja se cancela con `AbortController` para que no sobrescriba el resultado.
- **Caché de 10 minutos** en la llamada a OpenWeatherMap (`next.revalidate`), que es más o menos lo que tarda el proveedor en actualizar los datos y ayuda con el límite del plan gratuito.
- Se usa `fetch` nativo; para una sola petición no se justificaba agregar axios.
- Accesibilidad básica: label para el input (oculto visualmente), `role="search"`, `aria-live` en el resultado y `role="alert"` en los errores. Las pruebas buscan elementos por rol y texto, como lo haría un usuario.
