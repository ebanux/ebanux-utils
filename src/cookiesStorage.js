import { getCookie, setCookie, deleteCookie } from 'cookies-next';

const encode = (value) => Buffer.from(value, 'utf8').toString('base64');
const decode = (value) => Buffer.from(value, 'base64').toString('utf8');

export default {
  get: (key, options = {}) => {
    const item = getCookie(key, options);
    return item ? JSON.parse(decode(item)) : null;
  },

  set: (key, value, options = {}) => setCookie(key, encode(JSON.stringify(value)), options),

  del: (key, options = {}) => deleteCookie(key, options),

  has: (key, options = {}) => hasCookie(key, options),
};
