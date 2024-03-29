import React, { useEffect, useState } from "react";
import Header from "./components/Header/Header";
import Input from "./components/Input/Input";
import WeatherCard from "./components/WeatherCard/WeatherCard";
import axios from "axios";

function App() {
  const [weatherData, setWeatherData] = useState([]);
  const [error, setError] = useState({});
  const [cachedData, setCachedData] = useState({});
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState("");

  const handleChange = (e) => {
    setValue(e.target.value);
    if (weatherData) {
      setWeatherData([]);
    }
  };

  const clearData = () => {
    setLoading(false);
    setValue("");
    setWeatherData([]);
  };

  const fetchData = async () => {
    setLoading(true);

    // Caching data to prevent repeated Network Requests
    if (cachedData[value]) {
      setWeatherData(cachedData[value]);
      setLoading(false);
      return;
    }

    try {
      const searchName = await axios.get(`https://geocoding-api.open-meteo.com/v1/search?name=${value}&count=1&language=en&format=json`);

      if (!searchName?.data?.results) {
        setError({ location: "There was an error finding your Location!" });
        console.log(error);
        setLoading(false);
        return;
      }

      const { latitude, longitude } = searchName.data.results[0];

      const response = await axios.get(`https://api.open-meteo.com/v1/gem?latitude=${latitude}&longitude=${longitude}&&daily=wind_speed_10m_max,temperature_2m_max,weather_code&forecast_days=6`);

      if (!response?.data?.daily) {
        console.log("There was an error finding the data");
        setLoading(false);
        return;
      }

      const dailyData = response.data.daily;
      setError({ location: "" });

      let data = [];
      for (let index = 1; index < 6; index++) {
        data.push({
          date: dailyData.time[index],
          windspeed: dailyData.wind_speed_10m_max[index],
          temperature: dailyData.temperature_2m_max[index],
          weather_code: dailyData.weather_code[index],
        });
      }

      setWeatherData(data);
      setCachedData({ ...cachedData, [value]: data });
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  const keyPress = (e) => {
    if (e.key === "Enter" && value !== "" && value.length > 1) {
      fetchData();
    }
  };

  return (
    <>
      <Header />
      <main>
        <Input type="text" placeholder="Enter a Location" value={value} setValue={setValue} keyPress={keyPress} handleChange={handleChange} />
        <div className="container">
          {error.location && <h2>{error.location}</h2>}
          {loading && <div>Loading...</div>}
          {weatherData &&
            weatherData.map((item) => {
              return <WeatherCard key={item.date} date={item.date} temprature={item.temperature} weatherCode={item.weather_code} windspeed={item.windspeed} />;
            })}
        </div>
      </main>
    </>
  );
}

export default App;
