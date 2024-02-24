import { configureStore } from "@reduxjs/toolkit";
import weatherReducer from "./slice/getWeather";

const store = configureStore({
  reducer: {
    weather: weatherReducer,
  },
});

export default store;
