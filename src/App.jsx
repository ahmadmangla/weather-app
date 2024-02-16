import React, { useEffect, useState } from "react";
import Header from "./components/Header/Header";
import Input from "./components/Input/Input";
import WeatherCard from "./components/WeatherCard/WeatherCard";
import axios from "axios";

function App() {
  const [weatherData, setWeatherData] = useState([]);
  const [convertData, setConvertData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState("");

  const handleChange = (e) => {
    setValue(e.target.value);
    setConvertData([]);
  };

  const clearData = () => {
    setLoading(false);
    setValue("");
  };

  const keyPress = async (e) => {
    if (e.key === "Enter" && value !== "") {
      setLoading(true);
      const searchName = await axios.get(`https://geocoding-api.open-meteo.com/v1/search?name=${value}&count=1&language=en&format=json`);

      if (searchName.data.results) {
        const { latitude, longitude } = searchName.data.results[0];

        const response = await axios.get(`https://api.open-meteo.com/v1/gem?latitude=${latitude}&longitude=${longitude}&&daily=wind_speed_10m_max,temperature_2m_max,weather_code&forecast_days=5`);

        if (response.status === 200 && response.data.daily) {
          setWeatherData(response.data.daily);
          // setConvertData([]);
          for (let index = 0; index < 5; index++) {
            convertData.push({
              date: weatherData.time[index],
              windspeed: weatherData.wind_speed_10m_max[index],
              temperature: weatherData.temperature_2m_max[index],
              weather_code: weatherData.weather_code[index],
            });
          }

          setLoading(false);
        }
      } else {
        console.log("There was an error finding your Location!");

        return;
      }
    }
  };

  return (
    <>
      <Header />
      <main>
        <Input type="text" placeholder="Enter a Location" clearData={clearData} value={value} setValue={setValue} keyPress={keyPress} handleChange={handleChange} />
        <div className="container">
          {loading && <div>Loading...</div>}
          {convertData &&
            convertData.map((item) => {
              return <WeatherCard date={item.date} temprature={item.temperature} weatherCode={item.weather_code} windspeed={item.windspeed} />;
            })}
        </div>
      </main>
    </>
  );
}

export default App;
