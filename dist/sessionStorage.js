"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _lzString = _interopRequireDefault(require("lz-string"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var Session = /*#__PURE__*/function () {
  function Session() {
    _classCallCheck(this, Session);
    _defineProperty(this, "_axiosInstance", null);
  }
  _createClass(Session, [{
    key: "currentAccount",
    get: function get() {
      return this.get('account');
    }
  }, {
    key: "isAuthenticate",
    get: function get() {
      return !!this.get('credentials');
    }
  }, {
    key: "serverBaseUrl",
    get: function get() {
      return process.env.SERVER_BASE_URL || process.env.REACT_APP_SERVER_BASE_URL || 'http://127.0.0.1:3000';
    }
  }, {
    key: "apiBaseUrl",
    get: function get() {
      return "".concat(this.serverBaseUrl, "/").concat(this.apiBasePath || '');
    }
  }, {
    key: "appBaseUrl",
    get: function get() {
      return window.location.href.replace(/\?.*$/, '').replace(/\/$/, '');
    }
  }, {
    key: "appClientId",
    get: function get() {
      return this.get('APP_CLIENT_ID', process.env.AWS_COGNITO_CLIENT_ID || process.env.REACT_APP_AWS_COGNITO_CLIENT_ID);
    },
    set: function set(value) {
      this.set('APP_CLIENT_ID', value);
    }
  }, {
    key: "apiBasePath",
    get: function get() {
      return this.get('API_BASE_PATH', process.env.API_BASE_PATH || process.env.REACT_APP_API_BASE_PATH);
    },
    set: function set(value) {
      this.axiosInstance = undefined;
      this.set('API_BASE_PATH', value);
    }
  }, {
    key: "oauthTokenUrl",
    get: function get() {
      return this.get('OAUTH_TOKEN_URL', process.env.OAUTH_TOKEN_URL || process.env.REACT_APP_OAUTH_TOKEN_URL || "".concat(this.apiBaseUrl, "/oauth/token"));
    },
    set: function set(value) {
      this.set('OAUTH_TOKEN_URL', value);
    }
  }, {
    key: "oauthUrl",
    get: function get() {
      return this.get('OAUTH_URL', process.env.OAUTH_URL || process.env.REACT_APP_OAUTH_URL || "".concat(this.apiBaseUrl, "/oauth/authorize"));
    },
    set: function set(value) {
      this.set('OAUTH_URL', value);
    }
  }, {
    key: "oauthScope",
    get: function get() {
      return this.get('OAUTH_SCOPE', process.env.OAUTH_SCOPE || process.env.REACT_APP_OAUTH_SCOPE || 'aws.cognito.signin.user.admin email openid');
    },
    set: function set(value) {
      this.set('OAUTH_SCOPE', value);
    }
  }, {
    key: "currentUserServicePath",
    get: function get() {
      return this.get('CURRENT_USER_SERVICE_PATH', process.env.CURRENT_USER_SERVICE_PATH || process.env.REACT_APP_CURRENT_USER_SERVICE_PATH || 'users/me');
    },
    set: function set(value) {
      this.set('CURRENT_USER_SERVICE_PATH', value);
    }
  }, {
    key: "axiosInstance",
    get: function get() {
      return this._axiosInstance;
    },
    set: function set(value) {
      this._axiosInstance = value;
    }
  }, {
    key: "get",
    value: function get(key, defaultValue) {
      var item = window.sessionStorage.getItem(_lzString["default"].compress(key));
      return item === null ? defaultValue : JSON.parse(_lzString["default"].decompress(item));
    }
  }, {
    key: "set",
    value: function set(key, value) {
      window.sessionStorage.setItem(_lzString["default"].compress(key), _lzString["default"].compress(JSON.stringify(value)));
    }
  }, {
    key: "del",
    value: function del(key) {
      window.sessionStorage.removeItem(_lzString["default"].compress(key));
    }
  }, {
    key: "clear",
    value: function clear() {
      window.sessionStorage.clear();
    }
  }]);
  return Session;
}();
var session = new Session();
var _default = session;
exports["default"] = _default;