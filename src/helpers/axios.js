import axios from "axios";
import { api_url_admin, api_url } from "../configs/app-global";

const createAxiosInstance = (baseURL) => {
  const instance = axios.create({
    baseURL,
    timeout: 10000,
    withCredentials: true, 
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }
  });

  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

export const AxiosObject = async (type = "token") => {
  return createAxiosInstance(type === 'token' ? api_url_admin : api_url);
};