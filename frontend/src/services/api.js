import axios from "axios";

import {
  API_BASE_URLS,
} from "../config/api";

const api = axios.create({
  baseURL: API_BASE_URLS.auth,

  headers: {
    "Content-Type":
      "application/json",
  },

  timeout: 10000,
});

api.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem(
        "token"
      );

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },

  (error) =>
    Promise.reject(error)
);

export default api;