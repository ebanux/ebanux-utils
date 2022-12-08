"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _fbemitter = require("fbemitter");
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var emitter = new _fbemitter.EventEmitter();

/* eslint no-param-reassign: ["off"] */
var Messaging = /*#__PURE__*/function () {
  function Messaging() {
    _classCallCheck(this, Messaging);
  }
  _createClass(Messaging, [{
    key: "getEventType",
    value: function getEventType(messageId, senderId) {
      return "".concat(senderId || 'Global', "/").concat(messageId);
    }
  }, {
    key: "addMessagingListener",
    value: function addMessagingListener(messageId, callBack, senderId) {
      var eventType = this.getEventType(messageId, senderId);
      return emitter.addListener(eventType, callBack);
    }
  }, {
    key: "emitMessage",
    value: function emitMessage(messageId, data, senderId, timeout) {
      var eventType = this.getEventType(messageId, senderId);
      data = data instanceof Array ? data : [data];
      if (timeout === false) {
        emitter.emit.apply(emitter, [eventType].concat(_toConsumableArray(data)));
      } else {
        setTimeout(function () {
          return emitter.emit.apply(emitter, [eventType].concat(_toConsumableArray(data)));
        }, timeout || 0);
      }
    }
  }, {
    key: "delMessagingListener",
    value: function delMessagingListener(subscription) {
      subscription.remove();
    }
  }]);
  return Messaging;
}();
var messaging = new Messaging();
var _default = messaging;
exports["default"] = _default;