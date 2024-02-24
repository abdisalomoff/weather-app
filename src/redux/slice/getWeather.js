import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const API_KEY = 'efa323ff7e14f1eaf2b0d98849fc80dc';

export const getCityData = createAsyncThunk("city", async (obj) => {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${obj.city}&units=${obj.unit}&APPID=${API_KEY}`
    );
    const data = await response.json();
    // console.log(data);
    return {
      data: data,
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: console.error(error),
    };
  }
});


export const get5DaysForecast = createAsyncThunk("5days", async (obj) => {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${obj.lat}&lon=${obj.lon}&units=${obj.unit}&APPID=${API_KEY}`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
});

const weatherSlice = createSlice({
  name: "weather",
  initialState: {
    cityLoading: false,
    cityData: null,
    forecastLoading: false,
    forecastData: null,
    forecastError: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCityData.pending, (state) => {
        state.cityLoading = true;
        state.cityData = null;
      })
      .addCase(getCityData.fulfilled, (state, action) => {
        state.cityLoading = false;
        state.cityData = action.payload;
      })
      .addCase(get5DaysForecast.pending, (state) => {
        state.forecastLoading = true;
        state.forecastData = null;
        state.forecastError = null;
      })
      .addCase(get5DaysForecast.fulfilled, (state, action) => {
        state.forecastLoading = false;
        state.forecastData = action.payload;
        state.forecastError = null;
      })
      .addCase(get5DaysForecast.rejected, (state, action) => {
        state.forecastLoading = false;
        state.forecastData = null;
        state.forecastError = action.error.message;
      });
  },
});

export default weatherSlice.reducer;
