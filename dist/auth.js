"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Authenticator = void 0;
exports.authWithAuthCode = authWithAuthCode;
exports.getOrRefreshToken = getOrRefreshToken;
exports.injectAuthenticationFlow = injectAuthenticationFlow;
exports.startAuthorizationFlow = startAuthorizationFlow;
var _react = _interopRequireDefault(require("react"));
var _axios = _interopRequireDefault(require("axios"));
var _sessionStorage = _interopRequireDefault(require("./sessionStorage"));
var _request = require("./request");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
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
      return /*#__PURE__*/_react["default"].createElement(WrappedComponent, _extends({
        user: _sessionStorage["default"].currentAccount
      }, props));
    }
    return /*#__PURE__*/_react["default"].createElement("div", {
      className: "spinner_container"
    }, /*#__PURE__*/_react["default"].createElement("div", {
      className: "loading_spinner"
    }));
  };
}
var AuthenticatorInternal = function AuthenticatorInternal(_ref) {
  var children = _ref.children,
    user = _ref.user;
  return /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, typeof children === 'function' ? children({
    user: user
  }) : children);
};
var Authenticator = injectAuthenticationFlow(AuthenticatorInternal);
exports.Authenticator = Authenticator;