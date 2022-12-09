"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var styles = {
  '@keyframes spinner': {
    '0%': {
      transform: 'rotate(0deg)'
    },
    '100%': {
      transform: 'rotate(360deg)'
    }
  },
  loading_spinner: {
    width: '80px',
    height: '80px',
    border: '5px solid #f3f3f3',
    /* Light grey */
    borderTop: '5px solid #383636',
    /* Blue */
    borderRadius: '50%',
    animation: 'spinner 1.5s linear infinite'
  },
  spinner_container: {
    display: 'grid',
    justifyContent: 'center',
    alignItems: 'center',
    height: 'calc(100% - 80px)'
  }
};
var _default = styles;
exports["default"] = _default;