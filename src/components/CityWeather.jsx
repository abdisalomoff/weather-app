import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  IoSearch,
  IoArrowUp,
  IoArrowDown,
  IoWater,
  IoThunderstormOutline,
} from "react-icons/io5";
import { FaWind } from "react-icons/fa";
import { get5DaysForecast, getCityData } from "../redux/slice/getWeather";
import { SphereSpinner } from "react-spinners-kit";
import "./CityWeather.css";

const CityWeather = () => {
  const {
    cityLoading,
    cityData,
    forecastLoading,
    forecastData,
    forecastError,
  } = useSelector((state) => state.weather);

  console.log(cityData);

  const [loadings, setLoadings] = useState(true);

  const allLoadings = [cityLoading, forecastLoading];
  useEffect(() => {
    const isAnyChildLoading = allLoadings.some((state) => state);
    setLoadings(isAnyChildLoading);
  }, [allLoadings]);

  const [city, setCity] = useState("Tashkent");

  const [unit, setUnit] = useState("metric");

  const toggleUnit = () => {
    setLoadings(true);
    setUnit(unit === "metric" ? "imperial" : "metric");
  };

  const dispatch = useDispatch();
  const fetchData = () => {
    dispatch(
      getCityData({
        city,
        unit,
      })
    ).then((res) => {
      if (!res.payload.error) {
        dispatch(
          get5DaysForecast({
            lat: res.payload.data.coord.lat,
            lon: res.payload.data.coord.lon,
            unit,
          })
        );
      }
    });
  };

  useEffect(() => {
    fetchData();
  }, [unit]);

  const handleCitySearch = (e) => {
    e.preventDefault();
    setLoadings(true);
    fetchData();
  };

  const filterForecastByFirstObjTime = (forecastData) => {
    if (!forecastData) {
      return [];
    }

    const firstObjTime = forecastData[0].dt_txt.split(" ")[1];
    return forecastData.filter((data) => data.dt_txt.endsWith(firstObjTime));
  };

  const filteredForecast = filterForecastByFirstObjTime(forecastData?.list);

  return (
    <div className="background">
      <div className="weather-box">
        <form autoComplete="off" onSubmit={handleCitySearch}>
          <label>
            <IoSearch size={20} />
          </label>
          <input
            type="text"
            className="city-input"
            placeholder="Enter a city"
            required
            value={city}
            onChange={(e) => setCity(e.target.value)}
            readOnly={loadings}
          />
          <button type="submit">Search</button>
        </form>

        <div className="weather-details-box">
          <div className="details-box-header">
            <div className="unit-switch" onClick={toggleUnit}>
              <div
                className={`unit-switch-toggle ${
                  unit === "metric" ? "c" : "f"
                }`}
              ></div>
              <span className="c">C</span>
              <span className="f">F</span>
            </div>
          </div>
          {loadings ? (
            <div className="loader">
              <SphereSpinner loadings={loadings} color="#2fa3ed" size={20} />
            </div>
          ) : (
            <>
              {cityData && cityData.error ? (
                <div className="error-msg">{cityData.error}</div>
              ) : (
                <>
                  {forecastError ? (
                    <div className="error-msg">{forecastError}</div>
                  ) : (
                    <>
                      {cityData && cityData.data ? (
                        <div className="weather-details-container">
                          <div className="weather-details">
                            <div>
                              <h4 className="city-name">
                                {cityData.data.name}
                              </h4>
                            </div>

                            <div className="icon-and-temp">
                              <img
                                src={`https://openweathermap.org/img/wn/${cityData.data.weather[0].icon}@2x.png`}
                                alt="icon"
                              />
                              <h1>{cityData.data.main.temp}&deg;</h1>
                            </div>

                            <h4 className="description">
                              {cityData.data.weather[0].description}
                            </h4>
                          </div>

                          <div className="metrics">
                            <h4>
                              Feels like {cityData.data.main.feels_like}
                              &deg;C
                            </h4>

                            <div className="key-value-box">
                              <div className="key">
                                <IoArrowUp size={20} className="icon" />
                                <span className="value">
                                  {cityData.data.main.temp_max}&deg;C
                                </span>
                              </div>
                              <div className="key">
                                <IoArrowDown size={20} className="icon" />
                                <span className="value">
                                  {cityData.data.main.temp_min}&deg;C
                                </span>
                              </div>
                            </div>

                            <div className="key-value-box">
                              <div className="key">
                                <IoWater size={20} className="icon" />
                                <span>Humidity</span>
                              </div>
                              <div className="value">
                                <span>
                                  {cityData.data.main.humidity}%
                                </span>
                              </div>
                            </div>

                            <div className="key-value-box">
                              <div className="key">
                                <FaWind size={20} className="icon" />
                                <span>Wind</span>
                              </div>
                              <div className="value">
                                <span>
                                  W {cityData.data.wind.speed} km/h
                                </span>
                              </div>
                            </div>

                            <div className="key-value-box">
                              <div className="key">
                                <IoThunderstormOutline
                                  size={20}
                                  className="icon"
                                />
                                <span>Pressure</span>
                              </div>
                              <div className="value">
                                <span>
                                  {cityData.data.main.pressure} mm Hg.
                                  Art.
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="error-msg">No Data Found</div>
                      )}
                      <h4 className="extended-forecast-heading">
                        Extended 5 day forecast
                      </h4>
                      {filteredForecast.length > 0 ? (
                        <div className="extended-forecasts-container">
                          {filteredForecast.map((data, index) => {
                            const date = new Date(data.dt_txt);
                            const day = date.toLocaleDateString("en-US", {
                              weekday: "short",
                            });
                            return (
                              <div className="forecast-box" key={index}>
                                <h5>{day}</h5>
                                <img
                                  src={`https://openweathermap.org/img/wn/${data.weather[0].icon}.png`}
                                  alt="icon"
                                />
                                <h5>{data.weather[0].description}</h5>
                                <h5 className="min-max-temp">
                                  {data.main.temp_max}&deg; /{" "}
                                  {data.main.temp_min}&deg;
                                </h5>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="error-msg">No Data Found</div>
                      )}
                    </>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CityWeather;
