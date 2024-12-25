"use strict";
cc._RF.push(module, '310a01itB1I/JNkR3v5PjW4', 'LoggerUtil');
// Main/Script/Common/UtilTools/LoggerUtil.js

"use strict";

var LoggerUtil = cc.Class({
  statics: {
    _instance: null
  },
  ctor: function ctor() {
    this.isOpenStatus = false;
  },
  log: function log() {
    if (!this.isOpenStatus) {
      return;
    }
    ;
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    console.log.apply(console, args);
  },
  warn: function warn() {
    if (!this.isOpenStatus) {
      return;
    }
    ;
    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }
    console.warn.apply(console, args);
  },
  error: function error() {
    if (!this.isOpenStatus) {
      return;
    }
    ;
    for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      args[_key3] = arguments[_key3];
    }
    console.error.apply(console, args);
  },
  time: function time() {
    if (!this.isOpenStatus) {
      return;
    }
    ;
    for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
      args[_key4] = arguments[_key4];
    }
    console.time.apply(console, args);
  },
  timeEnd: function timeEnd() {
    if (!this.isOpenStatus) {
      return;
    }
    ;
    for (var _len5 = arguments.length, args = new Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
      args[_key5] = arguments[_key5];
    }
    console.timeEnd.apply(console, args);
  },
  assert: function assert() {
    if (!this.isOpenStatus) {
      return;
    }
    ;
    for (var _len6 = arguments.length, args = new Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
      args[_key6] = arguments[_key6];
    }
    console.assert.apply(console, args);
  },
  info: function info() {
    if (!this.isOpenStatus) {
      return;
    }
    ;
    for (var _len7 = arguments.length, args = new Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
      args[_key7] = arguments[_key7];
    }
    console.info.apply(console, args);
  },
  clear: function clear() {
    if (!this.isOpenStatus) {
      return;
    }
    ;
    for (var _len8 = arguments.length, args = new Array(_len8), _key8 = 0; _key8 < _len8; _key8++) {
      args[_key8] = arguments[_key8];
    }
    console.clear.apply(console, args);
  },
  count: function count() {
    if (!this.isOpenStatus) {
      return;
    }
    ;
    for (var _len9 = arguments.length, args = new Array(_len9), _key9 = 0; _key9 < _len9; _key9++) {
      args[_key9] = arguments[_key9];
    }
    console.count.apply(console, args);
  },
  group: function group() {
    if (!this.isOpenStatus) {
      return;
    }
    ;
    for (var _len10 = arguments.length, args = new Array(_len10), _key10 = 0; _key10 < _len10; _key10++) {
      args[_key10] = arguments[_key10];
    }
    console.group.apply(console, args);
  },
  setLoggerStatus: function setLoggerStatus(status) {
    this.isOpenStatus = status;
  },
  getLoggerStatus: function getLoggerStatus() {
    return this.isOpenStatus;
  }
});
LoggerUtil.getInstance = function () {
  if (!LoggerUtil._instance) {
    LoggerUtil._instance = new LoggerUtil();
  }
  ;
  return LoggerUtil._instance;
};
window.LoggerUtil = LoggerUtil;

cc._RF.pop();