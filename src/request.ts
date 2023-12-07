import axios, { AxiosRequestConfig } from 'axios';
// @ts-ignore
import tokenProvider from 'axios-token-interceptor';
import session from './sessionStorage';

import { isObject } from './utils';
import { getOrRefreshToken } from './auth';
import { StandardError } from './exceptions';

axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.headers.put['Content-Type'] = 'application/json';

export function createAxiosInstance(apiBaseUrl?: string, withOAuth = true) {
  const axiosInstance = axios.create({ withCredentials: true, baseURL: apiBaseUrl || session.apiBaseUrl });

  withOAuth && axiosInstance.interceptors.request.use(
    tokenProvider({
      getToken: tokenProvider.tokenCache(getOrRefreshToken, {
        getMaxAge: (response: any) => response.expires_in * 1000,
      }),
      headerFormatter: (response: any) => `Bearer ${response.id_token}`,
    }),
  );

  return axiosInstance;
}

export function toQueryParams(requestData: any): string {
  const qs: string[] = [];
  const add = (key: string, value: any) => {
    let v = typeof value === 'function' ? value() : value;
    if (v !== null && v !== undefined) qs[qs.length] = `${encodeURIComponent(key)}=${encodeURIComponent(v)}`;
  };

  const buildParams = (prefix: string, data: any): string[] => {
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

function abortSignal(timeout: number) {
  const abortController = new AbortController();
  setTimeout(() => abortController.abort(), timeout || 0);

  return abortController.signal;
}

/* eslint no-param-reassign: ["error", { "props": false }] */
export function request(options: AxiosRequestConfig, ): Promise<any> {
  let axiosInstance;

  options.timeout ??= session.apiRequestTimeout;
  options.signal ??= options.timeout !== undefined ? abortSignal(options.timeout) : undefined;

  if (options.withCredentials !== false) {
    axiosInstance = session.axiosInstance || createAxiosInstance();
    session.axiosInstance = axiosInstance;
  } else {
    axiosInstance = createAxiosInstance(undefined, false);
  }

  options.headers = { 'Content-Type': 'application/json', ...options.headers };

  return axiosInstance(options)
    .then((response) => response.data)
    .catch((err) => {
      let { response, message } = err;
      let code;

      if (response) {
        message = response.data.message;
        code = response.data.code || response.status;
      }

      if (Array.isArray(message)) message = message.join('\n');

      throw new StandardError(message, code || 500);
    });
}

