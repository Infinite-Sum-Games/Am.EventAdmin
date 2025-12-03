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
