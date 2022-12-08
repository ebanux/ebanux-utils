"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createAxiosInstance = createAxiosInstance;
exports.request = request;
exports.toQueryParams = toQueryParams;
var _axios = _interopRequireDefault(require("axios"));
var _axiosTokenInterceptor = _interopRequireDefault(require("axios-token-interceptor"));
var _sessionStorage = _interopRequireDefault(require("./sessionStorage"));
var _utils = require("./utils");
var _auth = require("./auth");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
_axios["default"].defaults.headers.post['Content-Type'] = 'application/json';
_axios["default"].defaults.headers.put['Content-Type'] = 'application/json';
function createAxiosInstance() {
  var apiBaseUrl = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  var axiosInstance;
  axiosInstance = _axios["default"].create({
    withCredentials: true,
    baseURL: apiBaseUrl || _sessionStorage["default"].apiBaseUrl
  });
  axiosInstance.interceptors.request.use((0, _axiosTokenInterceptor["default"])({
    getToken: _axiosTokenInterceptor["default"].tokenCache(_auth.getOrRefreshToken, {
      getMaxAge: function getMaxAge(response) {
        return response.expires_in * 1000;
      }
    }),
    headerFormatter: function headerFormatter(response) {
      return "Bearer ".concat(response.id_token);
    }
  }));
  return axiosInstance;
}
;
function toQueryParams(requestData) {
  var qs = [];
  var add = function add(key, value) {
    var v = typeof value === 'function' ? value() : value;
    if (v !== null && v !== undefined) qs[qs.length] = "".concat(encodeURIComponent(key), "=").concat(encodeURIComponent(v));
  };
  var buildParams = function buildParams(prefix, data) {
    if (prefix) {
      if (Array.isArray(data)) {
        data.forEach(function (item, idx) {
          buildParams("".concat(prefix, "[").concat((0, _utils.isObject)(item[idx]) && item[idx] ? idx : '', "]"), item[idx]);
        });
      } else if ((0, _utils.isObject)(data)) {
        Object.keys(data).forEach(function (key) {
          return buildParams("".concat(prefix, "[").concat(key, "]"), data[key]);
        });
      } else {
        add(prefix, data);
      }
    } else if (Array.isArray(data)) {
      data.forEach(function (item) {
        return add(item.name, item.value);
      });
    } else {
      Object.keys(data).forEach(function (key) {
        return buildParams(key, data[key]);
      });
    }
    return qs;
  };
  return buildParams('', requestData).join('&');
}

/* eslint no-param-reassign: ["error", { "props": false }] */
function request() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  _sessionStorage["default"].axiosInstance || (_sessionStorage["default"].axiosInstance = createAxiosInstance());
  options.headers = _objectSpread({
    'Content-Type': 'application/json'
  }, options.headers);
  return _sessionStorage["default"].axiosInstance(options).then(function (response) {
    return response.data;
  })["catch"](function (err) {
    var message = err.response ? err.response.data.message : err.message;
    throw Error(message);
  });
}