import axios, { AxiosInstance } from 'axios';
// Replace 'YOUR_API_KEY' with your actual OpenWeatherMap API key

const baseURL =
  process.env.BASE_URL || 'https://api.openweathermap.org/data/2.5';

// Create an Axios instance with a base URL for the OpenWeatherMap API
export const axiosInstance: AxiosInstance = axios.create({
  baseURL,
});
