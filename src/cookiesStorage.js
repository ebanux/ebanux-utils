import LZString from 'lz-string';
import { getCookie, setCookie, deleteCookie } from 'cookies-next';

export default {
  get: (key, options) => {
    const item = getCookie(LZString.compress(key), options);
    return item ? JSON.parse(LZString.decompress(item)) : null;
  },

  set: (key, value, options) => setCookie(LZString.compress(key), LZString.compress(JSON.stringify(value)), options),

  del: (key, options) => deleteCookie(LZString.compress(key), options),

  has: (key, options) => hasCookie(LZString.compress(key), options),
};
