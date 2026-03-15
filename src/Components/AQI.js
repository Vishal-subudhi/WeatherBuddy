// src/components/AQI.js
import React from "react";

export default function AQI({ aqi }) {
  if (!aqi || !aqi.hourly) return <div className="card small">AQI data not available</div>;

  // show the first hour's values (index 0)
  const idx = 0;
  const h = aqi.hourly;

  // fallback values guard
  const pm25 = (h.pm2_5 && h.pm2_5[idx] !== undefined) ? h.pm2_5[idx] : "—";
  const pm10 = (h.pm10 && h.pm10[idx] !== undefined) ? h.pm10[idx] : "—";
  const co = (h.carbon_monoxide && h.carbon_monoxide[idx] !== undefined) ? h.carbon_monoxide[idx] : "—";
  const o3 = (h.ozone && h.ozone[idx] !== undefined) ? h.ozone[idx] : "—";

  return (
    <div className="card">
      <div className="heading" style={{ marginBottom: 8 }}>Air Quality</div>
      <div className="aqi-grid">
        <div className="aqi-row"><div className="aqi-label">PM2.5</div><div className="aqi-val">{pm25} µg/m³</div></div>
        <div className="aqi-row"><div className="aqi-label">PM10</div><div className="aqi-val">{pm10} µg/m³</div></div>
        <div className="aqi-row"><div className="aqi-label">CO</div><div className="aqi-val">{co} µg/m³</div></div>
        <div className="aqi-row"><div className="aqi-label">O₃</div><div className="aqi-val">{o3} µg/m³</div></div>
      </div>
    </div>
  );
}
