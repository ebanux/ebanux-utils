"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _cookiesNext = require("cookies-next");
var encode = function encode(value) {
  return Buffer.from(value, 'utf8').toString('base64');
};
var decode = function decode(value) {
  return Buffer.from(value, 'base64').toString('utf8');
};
var _default = {
  get: function get(key) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var item = (0, _cookiesNext.getCookie)(key, options);
    return item ? JSON.parse(decode(item)) : null;
  },
  set: function set(key, value) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    return (0, _cookiesNext.setCookie)(key, encode(JSON.stringify(value)), options);
  },
  del: function del(key) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return (0, _cookiesNext.deleteCookie)(key, options);
  },
  has: function has(key) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return hasCookie(key, options);
  }
};
exports["default"] = _default;