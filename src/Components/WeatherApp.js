// src/components/WeatherApp.js
import React, { useEffect, useState } from "react";
import { fetchWeatherByCoords, fetchGeoFromCity, fetchAQI } from "../Utils/api";
import SearchBar from "./SearchBar";
import CurrentWeather from "./CurrentWeather";
import Forecast from "./Forecast";
import AQI from "./AQI";

export default function WeatherApp() {
  const [units, setUnits] = useState("metric"); // metric or imperial
  const [coords, setCoords] = useState(null);
  const [locationLabel, setLocationLabel] = useState("");
  const [data, setData] = useState(null); // Open-Meteo response
  const [aqi, setAqi] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // --- Debug: log component mount
  useEffect(() => {
    console.log("[WeatherApp] mounted");
  }, []);

  // Auto geolocation on load
  useEffect(() => {
    console.log("[WeatherApp] starting geolocation attempt...");
    setLoading(true);

    if (!("geolocation" in navigator)) {
      console.log("[WeatherApp] navigator.geolocation NOT available");
      setError("Geolocation not supported in this browser. Please search for a city manually.");
      setLoading(false);
      return;
    }

    console.log("[WeatherApp] navigator.geolocation available. Requesting position...");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        console.log("[WeatherApp] got position:", pos.coords);
        setCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude });
        setLocationLabel(`${pos.coords.latitude.toFixed(2)}, ${pos.coords.longitude.toFixed(2)}`); // temporary readable label
        setError("");
      },
      (err) => {
        console.warn("[WeatherApp] geolocation error:", err);
        if (err.code === 1) {
          setError("Permission denied. Please allow location access or search manually.");
        } else if (err.code === 2) {
          setError("Position unavailable. Try again or search manually.");
        } else if (err.code === 3) {
          setError("Location request timed out. Try again or search manually.");
        } else {
          setError("Could not get your location. Please search manually.");
        }
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  // When coords or units change, fetch weather + AQI
  useEffect(() => {
    async function load() {
      if (!coords) {
        console.log("[WeatherApp] coords is null — skipping load");
        return;
      }
      console.log("[WeatherApp] coords changed -> fetching weather for:", coords, "units:", units);
      setLoading(true);
      setError("");
      try {
        // Weather (Open-Meteo)
        const w = await fetchWeatherByCoords(coords.lat, coords.lon, units);
        console.log("[WeatherApp] fetchWeatherByCoords returned:", w);
        setData(w);

        // NOTE: removed reverse geocode call — Open-Meteo doesn't offer a supported reverse endpoint,
        // calling it caused 404 + CORS errors. We keep a coordinate label until user searches a city.

        // AQI / air quality (best-effort)
        try {
          const a = await fetchAQI(coords.lat, coords.lon);
          console.log("[WeatherApp] AQI result:", a);
          setAqi(a);
        } catch (e) {
          console.warn("[WeatherApp] AQI fetch failed:", e);
          setAqi(null);
        }
      } catch (e) {
        console.error("[WeatherApp] load error:", e);
        setError(e.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [coords, units]);

  // Handle manual city search (uses forward geocoding)
  const handleCitySearch = async (city) => {
    console.log("[WeatherApp] handleCitySearch:", city);
    setLoading(true);
    try {
      const res = await fetchGeoFromCity(city); // returns { lat, lon, name, country }
      console.log("[WeatherApp] fetchGeoFromCity result:", res);
      setCoords({ lat: res.lat, lon: res.lon });
      setLocationLabel(res.name + (res.country ? `, ${res.country}` : ""));
      setError("");
    } catch (e) {
      console.error("[WeatherApp] city search error:", e);
      setError(e.message || "City not found");
    } finally {
      setLoading(false);
    }
  };

  // Manual "Use My Location" button handler (keeps existing logic)
  async function handleUseMyLocation() {
    console.log("[WeatherApp] Manual 'use my location' clicked");
    if (!("geolocation" in navigator)) {
      setError("Geolocation not supported.");
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        console.log("[WeatherApp] manual position got:", pos.coords);
        setCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude });
        setLocationLabel(`${pos.coords.latitude.toFixed(2)}, ${pos.coords.longitude.toFixed(2)}`);
        setError("");
      },
      (err) => {
        console.warn("[WeatherApp] manual geolocation error:", err);
        setError("Unable to get location. Try searching for a city.");
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  return (
    <>
      <div className="header">
        <div className="title">My Weather Buddy</div>
        <div className="controls">
          <SearchBar onSearch={handleCitySearch} />
          <button
            className="toggle"
            onClick={() => setUnits((u) => (u === "metric" ? "imperial" : "metric"))}
            title="Toggle °C/°F"
          >
            {units === "metric" ? "C" : "F"}
          </button>

          <button className="btn" onClick={handleUseMyLocation}>
            Use My Location
          </button>
        </div>
      </div>

      <div className="main">
        {/* LEFT: Forecast/primary column */}
        <div className="card forecast-column">
          {loading && <div className="loading">Loading...</div>}
          {error && <div className="error">{error}</div>}

          {!loading && !error && data && (
            <Forecast daily={data.daily} units={units} />
          )}

          {!loading && !error && !data && (
            <div className="small">No weather data yet. Try searching a city or click "Use My Location".</div>
          )}
        </div>

        {/* RIGHT: Current weather + AQI stack */}
        <div className="right-stack">
          <div className="card">
            <CurrentWeather data={data?.current_weather} label={locationLabel} units={units} />
          </div>

          <div className="card">
            <AQI aqi={aqi} />
          </div>
        </div>
      </div>
    </>
  );
}
