"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _lzString = _interopRequireDefault(require("lz-string"));
var _cookiesNext = require("cookies-next");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var _default = {
  get: function get(key, options) {
    var item = (0, _cookiesNext.getCookie)(_lzString["default"].compress(key), options);
    return item ? JSON.parse(_lzString["default"].decompress(item)) : null;
  },
  set: function set(key, value, options) {
    return (0, _cookiesNext.setCookie)(_lzString["default"].compress(key), _lzString["default"].compress(JSON.stringify(value)), options);
  },
  del: function del(key, options) {
    return (0, _cookiesNext.deleteCookie)(_lzString["default"].compress(key), options);
  },
  has: function has(key, options) {
    return hasCookie(_lzString["default"].compress(key), options);
  }
};
exports["default"] = _default;