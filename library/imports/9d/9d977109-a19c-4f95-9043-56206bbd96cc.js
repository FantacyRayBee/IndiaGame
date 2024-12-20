"use strict";
cc._RF.push(module, '9d977EJoZxPlZBDViBrvZbM', 'ClientNotify');
// Main/ClientNotify.js

"use strict";

var ClientNotify = {
  callbackList: new Map(),
  index: 0
};
ClientNotify.register = function (type, callback, target) {
  var isExist = ClientNotify.callbackList.has(type);
  var handle = "";
  if (isExist) {
    var isJoin = false;
    var arr = ClientNotify.callbackList.get(type);
    for (var index = 0, len = arr.length; index < len; index++) {
      var item = arr[index];
      if (callback === item[0] && target === item[1]) {
        isJoin = true;
        handle = target;
        break;
      }
      ;
    }
    ;
    if (!isJoin) {
      arr.push([callback, target]);
      handle = target;
      ClientNotify.callbackList.set(type, arr);
    }
    ;
  } else {
    var _arr = [];
    _arr.push([callback, target]);
    handle = target;
    ClientNotify.callbackList.set(type, _arr);
  }
  ;
  return handle;
};
ClientNotify.removeByHandle = function (type, handle) {
  var isExist = ClientNotify.callbackList.has(type);
  if (isExist) {
    var arr = ClientNotify.callbackList.get(type);
    if (!Array.isArray(arr)) {
      return;
    }
    ;
    for (var i = 0; i < arr.length; i++) {
      var keyHandle = arr[i][1];
      if (keyHandle === handle) {
        arr.splice(i, 1);
        i -= 1;
      }
      ;
    }
    ;
  }
  ;
};
ClientNotify.send = function (type, dataDict) {
  var isExist = ClientNotify.callbackList.has(type);
  if (isExist) {
    var arr = ClientNotify.callbackList.get(type);
    for (var i = 0, len = arr.length; i < len; i++) {
      var temp = arr[i];
      if (temp != undefined && temp != null && temp[1] != null && temp[0] != undefined) {
        temp[0] && temp[0].call(temp[1], dataDict, temp[1]);
      }
    }
  }
};
window.ClientNotify = ClientNotify;

cc._RF.pop();