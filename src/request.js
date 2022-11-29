import axios from 'axios';
import tokenProvider from 'axios-token-interceptor';
import session from './sessionStorage';

import { isObject } from './utils';
import { getOrRefreshToken } from './auth';

axios.defaults.baseURL = session.apiBaseUrl;
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.headers.put['Content-Type'] = 'application/json';

let axiosInstance = null;

const getAxiosInstance = () => {
  if (axiosInstance) return axiosInstance;

  axiosInstance = axios.create({ withCredentials: true });
  axiosInstance.interceptors.request.use(
    tokenProvider({
      getToken: tokenProvider.tokenCache(getOrRefreshToken, {
        getMaxAge: (response) => response.expires_in * 1000,
      }),
      headerFormatter: (response) => `Bearer ${response.id_token}`,
    }),
  );

  return axiosInstance;
};

export function toQueryParams(requestData) {
  const qs = [];
  const add = (key, value) => {
    let v = typeof value === 'function' ? value() : value;
    v = v === null || v === undefined ? '' : v;
    qs[qs.length] = `${encodeURIComponent(key)}=${encodeURIComponent(v)}`;
  };

  const buildParams = (prefix, data) => {
    if (prefix) {
      if (Array.isArray(data)) {
        data.forEach((item, idx) => {
          buildParams(`${prefix}[${isObject(item[idx]) && item[idx] ? idx : ''}]`, item[idx]);
        });
      } else if (isObject(data)) {
        Object.keys(data).forEach((key) => buildParams(`${prefix}[${key}]`, data[key]));
      } else {
        add(prefix, data);
      }
    } else if (Array.isArray(data)) {
      data.forEach((item) => add(item.name, item.value));
    } else {
      Object.keys(data).forEach((key) => buildParams(key, data[key]));
    }
    return qs;
  };

  return buildParams('', requestData).join('&');
}

/* eslint no-param-reassign: ["error", { "props": false }] */
export function request(options = {}) {
  axiosInstance = getAxiosInstance();

  options.headers = { 'Content-Type': 'application/json', ...options.headers };

  return axiosInstance(options)
    .then((response) => response.data)
    .catch((err) => {
      const message = err.response ? err.response.data.message : err.message;
      throw Error(message);
    });
}

