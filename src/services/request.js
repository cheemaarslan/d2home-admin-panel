import axios from 'axios';
import { notification } from 'antd';
import { api_url } from '../configs/app-global';
import { store } from '../redux/store';
import { clearUser } from '../redux/slices/auth';
import i18n from '../configs/i18next';
import { toast } from 'react-toastify';

const service = axios.create({
  baseURL: api_url,
  timeout: 16000,
});

// Config
const TOKEN_PAYLOAD_KEY = 'authorization';
const AUTH_TOKEN = 'token';
const AUTH_TOKEN_TYPE = 'Bearer';

// API Request interceptor
service.interceptors.request.use(
  (config) => {
    const access_token = localStorage.getItem(AUTH_TOKEN);

    if (access_token) {
      config.headers[TOKEN_PAYLOAD_KEY] = AUTH_TOKEN_TYPE + ' ' + access_token;
    }
    if (config.method === 'get') {
      config.params = { lang: i18n.language, ...config.params };
    }

    return config;
  },
  (error) => {
    // Do something with request error here
    notification.error({
      message: 'Error',
    });
    Promise.reject(error);
  }
);

// API respone interceptor
// request.js
service.interceptors.response.use(
  (response) => response.data,
  (error) => {
    let notificationParam = { message: i18n.t('Unknown error') };
    if (error.response) {
      if (error.response.status === 401 || error.response.status === 403) {
        localStorage.removeItem(AUTH_TOKEN);
        store.dispatch(clearUser());
        notificationParam.message = i18n.t(error.response.data?.message || 'Unauthorized');
      } else if (error.response.status === 404) {
        notificationParam.message = i18n.t(error.response.data?.message || 'Endpoint not found');
      } else if (error.response.status === 508 || error.response.status === 500) {
        notificationParam.message = error.response.data?.message || 'Server error';
      } else if (error.response.data?.params) {
        const paramError = Object.values(error.response.data.params)[0];
        if (paramError) {
          notificationParam.message = paramError[0] || 'Validation error';
        }
      }
    } else {
      notificationParam.message = i18n.t('Network error or no response');
    }
    toast.error(notificationParam.message, {
      toastId: error.response?.status || 'network-error',
    });
    return Promise.reject(error);
  }
);

export default service;
