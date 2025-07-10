import axios, { AxiosInstance } from 'axios';
import qs from 'qs';

const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 50000,
  headers: { 'Content-Type': 'application/json' },
  paramsSerializer: {
    serialize(params) {
      return qs.stringify(params, { allowDots: true });
    },
  },
});

service.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    console.log('request error:', error);
    return Promise.reject(error);
  }
);

service.interceptors.response.use(
  (response) => {
    const res = response.data;
    if (res.code && res.code !== 0) {
      return Promise.reject(new Error(res.msg || 'Error'));
    } else {
      return res;
    }
  },
  (error) => {
    console.log('response error:', error.message);
    return Promise.reject(error);
  }
);

export default service;
