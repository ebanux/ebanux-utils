import { getCookie, setCookie, deleteCookie, hasCookie, CookieValueTypes } from 'cookies-next';

const encode = (value: string) => Buffer.from(value, 'utf8').toString('base64');
const decode = (value: string) => Buffer.from(value, 'base64').toString('utf8');

export default {
  get: (key: string, options = {}): any => {
    const item: CookieValueTypes = getCookie(key, options);
    return item ? JSON.parse(decode(item as string)) : null;
  },

  set: (key: string, value: any, options = {}) => setCookie(key, encode(JSON.stringify(value)), options),

  del: (key: string, options = {}) => deleteCookie(key, options),

  has: (key: string, options = {}) => hasCookie(key, options),
};
