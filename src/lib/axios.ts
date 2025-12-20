import axios from "axios";
import secureLocalStorage from "react-secure-storage";

export const axiosClient = axios.create({
  baseURL: "/",
  withCredentials: true,
});

axiosClient.interceptors.request.use((config) => {
  const token = secureLocalStorage.getItem("t");

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Check if the error is a 503 Service Unavailable
    if (error.response?.status === 503) {
      // Redirect to maintenance page
      window.location.href = "/admin/maintenance";
    }
    return Promise.reject(error);
  }
);
