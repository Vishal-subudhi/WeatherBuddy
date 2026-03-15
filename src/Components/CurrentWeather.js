// src/components/CurrentWeather.js
import React from "react";

export default function CurrentWeather({ data, label, units }) {
  if (!data) return null;
  const unit = units === "metric" ? "°C" : "°F";

  return (
    <div className="card current">
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, color: "#0b1220", fontWeight: 700 }}>{label || "Current Location"}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 8 }}>
          <div className="temp">{Math.round(data.temperature)}{unit}</div>
          <div style={{ minWidth: 0 }}>
            <div className="meta">Feels like: {Math.round(data.temperature)}{unit}</div>
            <div className="meta">Wind: {data.windspeed} {units === "metric" ? "km/h" : "mph"}</div>
            <div className="meta">Time: {new Date(data.time).toLocaleString()}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
