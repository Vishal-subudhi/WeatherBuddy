// src/utils/api.js  (Open-Meteo version)

const WEATHER_BASE = "https://api.open-meteo.com/v1/forecast";
const AIR_BASE = "https://air-quality-api.open-meteo.com/v1/air-quality";

// -------- Fetch weather by coordinates --------
export async function fetchWeatherByCoords(lat, lon, units = "metric") {
  const tempUnit = units === "metric" ? "celsius" : "fahrenheit";
  const speedUnit = units === "metric" ? "kmh" : "mph";

  const url = `${WEATHER_BASE}?latitude=${lat}&longitude=${lon}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto&temperature_unit=${tempUnit}&windspeed_unit=${speedUnit}`;
  console.log("[api] fetching weather:", url);

  const res = await fetch(url);
  if (!res.ok) throw new Error("Weather API failed");
  const data = await res.json();
  return data;
}

// -------- Fetch air quality (AQI) --------
export async function fetchAQI(lat, lon) {
  const url = `${AIR_BASE}?latitude=${lat}&longitude=${lon}&hourly=pm10,pm2_5,carbon_monoxide,ozone,nitrogen_dioxide,sulphur_dioxide`;
  console.log("[api] fetching AQI:", url);

  const res = await fetch(url);
  if (!res.ok) throw new Error("AQI API failed");
  const data = await res.json();
  return data;
}

// -------- Convert city name to lat/lon using Open-Meteo geocoding --------
export async function fetchGeoFromCity(city) {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`;
  console.log("[api] geocoding city:", url);

  const res = await fetch(url);
  if (!res.ok) throw new Error("Geocoding API failed");
  const data = await res.json();

  if (!data.results || data.results.length === 0)
    throw new Error("City not found");

  const loc = data.results[0];
  return {
    lat: loc.latitude,
    lon: loc.longitude,
    name: loc.name,
    country: loc.country,
  };
}
