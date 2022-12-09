"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.reduceEmptyAttrs = exports.isObject = exports.isEmpty = exports.isBrowser = exports.iFrameDetected = void 0;
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0) { ; } } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
// eslint-disable-next-line import/prefer-default-export

var isObject = function isObject(obj) {
  return Object.prototype.toString.call(obj).indexOf('Object') !== -1;
};
exports.isObject = isObject;
var isEmpty = function isEmpty(v) {
  return v === '' || v === null || v === undefined || isObject(v) && Object.keys(v).length === 0 || Array.isArray(v) && v.length === 0;
};
exports.isEmpty = isEmpty;
var reduceEmptyAttrs = function reduceEmptyAttrs(obj) {
  var replaceWithNull = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var newObj = {};
  Object.entries(obj).forEach(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
      k = _ref2[0],
      pV = _ref2[1];
    var nV = pV;
    if (isObject(pV)) {
      nV = reduceEmptyAttrs(pV, false);
      if (replaceWithNull && !isEmpty(nV)) nV = reduceEmptyAttrs(pV, true);
    }
    if (!isEmpty(nV)) {
      newObj[k] = nV;
    } else if (nV !== undefined && replaceWithNull) {
      newObj[k] = null;
    }
  });
  return newObj;
};
exports.reduceEmptyAttrs = reduceEmptyAttrs;
var isBrowser = function isBrowser() {
  return typeof window !== 'undefined';
};
exports.isBrowser = isBrowser;
var iFrameDetected = function () {
  if (!isBrowser()) return false;
  var urlParams = new URLSearchParams(window.location.search);
  return urlParams.has('embedded') || window !== window.parent;
}();
exports.iFrameDetected = iFrameDetected;