import { useEffect, useState } from "react";
import SearchBox from "./searchBox";
import "./styles.css";

const Weather = () => {
  const [query, setQuery] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [unit, setUnit] = useState("metric"); // Metric by default (Celsius)

  async function fetchWeather(param) {
    try {
      setError(null);
      setLoading(true);
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${param}&appid=5cef60fce260d152b32af68c22ff6bc6&units=${unit}`
      );
      const data = await response.json();
      if (data.cod !== 200) throw new Error(data.message);
      setData(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  function onSearch() {
    fetchWeather(query);
  }

  useEffect(() => {
    fetchWeather("Cairo");
  }, [unit]);

  function getCurrentDate() {
    return new Date().toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  function formatTime(timestamp, timezoneOffset) {
    const localTime = new Date((timestamp + timezoneOffset) * 1000);
    return localTime.toLocaleTimeString("en-us", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function getBackgroundClass(weatherMain) {
    switch (weatherMain) {
      case "Clear":
        return "clear-bg";
      case "Clouds":
        return "clouds-bg";
      case "Rain":
        return "rain-bg";
      case "Snow":
        return "snow-bg";
      case "Thunderstorm":
        return "storm-bg";
      case "Drizzle":
        return "drizzle-bg";
      default:
        return "default-bg";
    }
  }

  return (
    <div
      className={`weather-container ${
        data ? getBackgroundClass(data.weather[0].main) : ""
      }`}
    >
      <h1 className="weather-title">Weather App</h1>
      <SearchBox query={query} setQuery={setQuery} onSearch={onSearch} />
      <button
        className="unit-toggle"
        onClick={() => setUnit(unit === "metric" ? "imperial" : "metric")}
      >
        {unit === "metric" ? "Switch to Fahrenheit" : "Switch to Celsius"}
      </button>
      {loading && <p className="loading-text">Loading...</p>}
      {error && <p className="error-text">Error: {error}</p>}
      {data && (
        <div className="weather-card">
          <h2 className="city-name">
            {data.name}, <span>{data.sys.country}</span>
          </h2>
          <p className="date-text">{getCurrentDate()}</p>
          <img
            className="weather-icon"
            src={`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`}
            alt={data.weather[0].description}
          />
          <p className="weather-description">{data.weather[0].description}</p>
          <p className="temperature">
            {Math.round(data.main.temp)}°{unit === "metric" ? "C" : "F"}
          </p>
          <div className="sunrise-sunset">
            <p>🌅 Sunrise: {formatTime(data.sys.sunrise, data.timezone)}</p>
            <p>🌇 Sunset: {formatTime(data.sys.sunset, data.timezone)}</p>
          </div>
          <p className="humidity">💧 Humidity: {data.main.humidity}%</p>
          <p className="wind-speed">
            🌬 Wind Speed: {data.wind.speed} {unit === "metric" ? "m/s" : "mph"}
          </p>
        </div>
      )}
    </div>
  );
};

export default Weather;
