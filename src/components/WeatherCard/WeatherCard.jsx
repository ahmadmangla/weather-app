import React, { memo } from "react";
import styles from "./WeatherCard.module.css";
import ImageData from "../../utils/weatherCodes";

const WeatherCard = ({ date, weatherCode, windspeed, temprature }) => {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  const getDayName = (date) => {
    let d = new Date(date);
    let dayName = days[d.getDay()];
    return dayName;
  };

  return (
    <article className={`${styles.card}`}>
      <h2 className="date">{getDayName(date)}</h2>

      <div className="image_container">
        {console.log(weatherCode)}
        <img src={ImageData[weatherCode]?.day?.image} alt="" />
      </div>

      <p className="temprature">Temprature: {temprature} °C</p>

      <p className="description">Weather: {ImageData[weatherCode]?.day?.description}</p>

      <p className="wind_speed">Wind Speed: {windspeed} km/h</p>
    </article>
  );
};

export default memo(WeatherCard);
