// src/components/Forecast.js
import React from "react";

function formatDate(dstr) {
  const d = new Date(dstr);
  return d.toLocaleDateString(undefined, { day: "2-digit", month: "2-digit", year: "numeric" });
}

export default function Forecast({ daily, units }) {
  if (!daily || !daily.time) return null;
  const unit = units === "metric" ? "°C" : "°F";

  return (
    <div className="forecast-column">
      <div className="heading">7-Day Forecast</div>
      <div className="forecast-grid">
        {daily.time.slice(0, 7).map((date, i) => (
          <div className="tile" key={date}>
            <div className="date">{formatDate(date)}</div>

            <div className="temps">
              {Math.round(daily.temperature_2m_max[i])}
              {unit} / {Math.round(daily.temperature_2m_min[i])}
              {unit}
            </div>

            <div className="meta">Precip: {daily.precipitation_sum ? `${daily.precipitation_sum[i]} mm` : "—"}</div>

            {/* simple weathercode -> text mapping (if available) */}
            {daily.weathercode && (
              <div className="small" style={{ marginTop: 6 }}>
                {weatherCodeLabel(daily.weathercode[i])}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// small helper to map Open-Meteo weathercode to readable text
function weatherCodeLabel(code) {
  // trimmed mapping for common codes
  const map = {
    0: "Clear",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Depositing rime fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",
    61: "Light rain",
    63: "Rain",
    65: "Heavy rain",
    71: "Light snow",
    73: "Snow",
    80: "Rain showers",
    95: "Thunderstorm",
  };
  return map[code] || `Code ${code}`;
}
