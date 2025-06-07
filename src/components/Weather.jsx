import React, { useEffect, useState } from "react";
import axios from "axios";

const API_KEY = "275d1152164fb9024e10ea31319a4666"; // Replace with your OpenWeatherMap API key

const cities = [
  "Colombo",
  "Kandy",
  "Negombo",
  "Jaffna",
  "Galle",
  "Anuradhapura",
  "Batticaloa",
  "Trincomalee",
  "Ratnapura",
  "Kurunegala",
];

const WeatherForecast = () => {
  const [city, setCity] = useState(() => localStorage.getItem("selectedCity") || "Colombo");
  const [forecast, setForecast] = useState([]);
  const [currentWeather, setCurrentWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getWeather = async (selectedCity) => {
    setLoading(true);
    setError("");

    try {
      // Current weather
      const currentRes = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${selectedCity}&units=metric&appid=${API_KEY}`
      );
      setCurrentWeather(currentRes.data);

      // 5-day forecast
      const forecastRes = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${selectedCity}&units=metric&cnt=40&appid=${API_KEY}`
      );
      const dailyData = forecastRes.data.list.filter((reading) =>
        reading.dt_txt.includes("12:00:00")
      );
      setForecast(dailyData);

      localStorage.setItem("selectedCity", selectedCity);
    } catch (err) {
      console.error("Error fetching weather:", err);
      setError("Could not fetch weather for that city.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getWeather(city);
  }, [city]);

  const formatDate = (dateStr) => {
    const options = { weekday: "long", month: "short", day: "numeric" };
    return new Date(dateStr).toLocaleDateString("en-US", options);
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="p-4">
      {/* City Dropdown */}
      <div className="mb-4 flex items-center gap-4">
        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 shadow-sm"
        >
          {cities.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* Current Weather Summary */}
      {currentWeather && (
        <div className="bg-blue-100 border border-blue-300 rounded-xl p-6 shadow-md mb-6 text-center">
          <h3 className="text-2xl font-bold mb-2">Current Weather in {city}</h3>
          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <img
              src={`https://openweathermap.org/img/wn/${currentWeather.weather[0].icon}@2x.png`}
              alt={currentWeather.weather[0].description}
              className="w-20 h-20"
            />
            <div>
              <p className="text-xl font-semibold text-gray-800">
                {Math.round(currentWeather.main.temp)}°C - {currentWeather.weather[0].description}
              </p>
              <p className="text-sm text-gray-600">
                Feels like: {Math.round(currentWeather.main.feels_like)}°C | Humidity:{" "}
                {currentWeather.main.humidity}% | Wind: {currentWeather.wind.speed} m/s
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Forecast */}
      <h2 className="text-xl font-bold mb-4">5-Day Weather Forecast</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {forecast.map((day, index) => {
            const dateOnly = day.dt_txt.split(" ")[0];
            const isToday = dateOnly === today;

            return (
              <div
                key={index}
                className={`rounded-2xl p-4 shadow transition ${
                  isToday ? "bg-blue-100 border-blue-400 border" : "bg-white"
                }`}
              >
                <div className="text-center text-lg font-semibold">
                  {formatDate(day.dt_txt)}
                </div>
                <div className="flex justify-center my-2">
                  <img
                    src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                    alt={day.weather[0].description}
                    className="w-16 h-16"
                  />
                </div>
                <div className="text-center capitalize text-gray-700">
                  {day.weather[0].description}
                </div>
                <div className="text-center text-[rgb(128,153,11)] font-bold text-lg mt-2">
                  {Math.round(day.main.temp)}°C
                </div>

                {/* Extra Info */}
                <div className="text-sm mt-2 text-gray-600 text-center">
                  Feels like: {Math.round(day.main.feels_like)}°C
                  <br />
                  Humidity: {day.main.humidity}%
                  <br />
                  Wind: {day.wind.speed} m/s
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default WeatherForecast;
