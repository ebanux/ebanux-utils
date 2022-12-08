"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.authWithAuthCode = authWithAuthCode;
exports.getOrRefreshToken = getOrRefreshToken;
exports.injectAuthenticationFlow = injectAuthenticationFlow;
exports.startAuthorizationFlow = startAuthorizationFlow;
var _react = _interopRequireDefault(require("react"));
var _axios = _interopRequireDefault(require("axios"));
var _sessionStorage = _interopRequireDefault(require("./sessionStorage"));
var _request = require("./request");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var classes = {
  loading_spinner: "spinner__loading_spinner___28B1U",
  spinner_container: "spinner__spinner_container___3yrZe"
};
require('load-styles')("/*  imported from spinner.css  */\n\n@keyframes spinner {\n    0% {\n        transform: rotate(0deg);\n    }\n    100% {\n        transform: rotate(360deg);\n    }\n}\n.spinner__loading_spinner___28B1U {\n    width: 80px;\n    height: 80px;\n    border: 5px solid #f3f3f3; /* Light grey */\n    border-top: 5px solid #383636; /* Blue */\n    border-radius: 50%;\n    animation: spinner 1.5s linear infinite;\n}\n\n.spinner__spinner_container___3yrZe {\n    display: grid;\n    justify-content: center;\n    align-items: center;\n    height: calc(100% - 80px);\n}");
function getOrRefreshToken() {
  var credentials = _sessionStorage["default"].get('credentials');
  var authRequest = _axios["default"].create({
    baseURL: _sessionStorage["default"].serverBaseUrl
  });
  var options = {
    url: _sessionStorage["default"].oauthTokenUrl,
    method: 'POST'
  };
  if (_sessionStorage["default"].oauthTokenUrl.match(/oauth2\/token/)) {
    options.data = (0, _request.toQueryParams)(credentials);
    options.headers = {
      'Content-Type': 'application/x-www-form-urlencoded'
    };
  } else {
    options.data = credentials;
    options.headers = {
      'Content-Type': 'application/json'
    };
  }
  return authRequest(options).then(function (response) {
    _sessionStorage["default"].set('credentials', {
      grant_type: 'refresh_token',
      refresh_token: response.data.refresh_token,
      client_id: _sessionStorage["default"].appClientId
    });
    return response.data;
  })["catch"](function (err) {
    _sessionStorage["default"].del('credentials');
    _sessionStorage["default"].del('account');
    var message = err.response ? err.response.data.message : err.message;
    throw Error(message);
  });
}
function authWithAuthCode(authCode) {
  _sessionStorage["default"].set('credentials', {
    grant_type: 'authorization_code',
    redirect_uri: _sessionStorage["default"].appBaseUrl,
    client_id: _sessionStorage["default"].appClientId,
    code: authCode
  });

  //  Get Current user
  var options = {
    url: _sessionStorage["default"].currentUserServicePath,
    method: 'GET'
  };
  return (0, _request.request)(options).then(function (response) {
    var user = response.result || response;
    _sessionStorage["default"].set('account', user);
    return user;
  })["catch"](function (err) {
    _sessionStorage["default"].del('credentials');
    _sessionStorage["default"].del('account');
    var message = err.response ? err.response.data.message : err.message;
    throw Error(message);
  });
}
function startAuthorizationFlow() {
  var data = {
    redirect_uri: _sessionStorage["default"].appBaseUrl,
    client_id: _sessionStorage["default"].appClientId,
    scope: _sessionStorage["default"].oauthScope,
    response_type: 'code'
  };
  window.location.href = "".concat(_sessionStorage["default"].oauthUrl, "?").concat((0, _request.toQueryParams)(data));
}
function injectAuthenticationFlow(WrappedComponent) {
  return function (props) {
    var urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('code')) {
      var authCode = urlParams.get('code');
      authWithAuthCode(authCode).then(function () {
        return window.location.replace(_sessionStorage["default"].appBaseUrl);
      });
    } else if (!_sessionStorage["default"].isAuthenticate) {
      startAuthorizationFlow();
    } else {
      return /*#__PURE__*/_react["default"].createElement(WrappedComponent, _objectSpread({
        user: _sessionStorage["default"].currentAccount
      }, props));
    }
    return /*#__PURE__*/_react["default"].createElement("div", {
      className: classes.spinner_container
    }, /*#__PURE__*/_react["default"].createElement("div", {
      className: classes.loading_spinner
    }));
  };
}