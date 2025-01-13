"use strict";
cc._RF.push(module, '1ed2d5e+lRJXYGnbEhd+EZB', 'ProtobufManager');
// Main/Script/Common/Net/ProtobufManager.js

"use strict";

var ProtobufManager = {
  Root: {},
  protoMap: new Map()
};

/**
 * 预加载proto文件
 * @param {[String]} filePathArr 相对于resources目录下的文件路径
 * @returns 
 */
ProtobufManager.proloadProtoFiles = function (filePathArr) {
  return new Promise(function (resolve, reject) {
    if (!Array.isArray(filePathArr)) {
      LoggerUtil.getInstance().log('The parameter type of the proto file to be loaded is incorrect');
      reject();
      return;
    }
    ;
    var loadedAcount = 0;
    var filePathArrLen = filePathArr.length;
    var _loop = function _loop() {
      var filePath = filePathArr[i];
      protobuf.load(filePath, function (err, root) {
        if (err) {
          LoggerUtil.getInstance().log("Error loading proto file: " + err);
          reject();
          return;
        }
        ;
        if (root) {
          if (ProtobufManager.protoMap.has(filePath) == false) {
            ProtobufManager.protoMap.set(filePath, root);
          }
          ;
          loadedAcount += 1;
          if (filePathArrLen == loadedAcount) {
            LoggerUtil.getInstance().log('The specified protobuf file has been loaded and the Protobuf file cache pool is complete: ', cc.sys.isNative ? JSON.stringify(ProtobufManager.protoMap) : ProtobufManager.protoMap);
            resolve();
          }
          ;
        }
        ;
      });
    };
    for (var i = 0; i < filePathArrLen; i++) {
      _loop();
    }
    ;
  });
};

/**
 * 加载proto文件
 * @param {[String]} filePathArr 相对于resources目录下的文件路径
 * @returns 
 */
ProtobufManager.loadProtoFiles = function (filePathArr) {
  if (!Array.isArray(filePathArr)) {
    LoggerUtil.getInstance().log('The parameter type of the proto file to be loaded is incorrect');
    return false;
  }
  ;
  var loadedAcount = 0;
  var filePathArrLen = filePathArr.length;
  for (var i = 0; i < filePathArrLen; i++) {
    var filePath = filePathArr[i];
    if (ProtobufManager.protoMap.has(filePath) == true) {
      loadedAcount += 1;
      var filePathArr1 = filePath.split("/");
      var len = filePathArr1.length;
      var root = ProtobufManager.protoMap.get(filePath);
      ProtobufManager.Root[filePathArr1[len - 1]] = root;
      if (filePathArrLen == loadedAcount) {
        LoggerUtil.getInstance().log('The specified protobuf file loading is complete, Protobuf file pool: ', cc.sys.isNative ? JSON.stringify(ProtobufManager.Root) : ProtobufManager.Root);
        return true;
      }
      ;
    }
    ;
  }
  ;
  return false;
};
ProtobufManager.packProtobuf = function (command, messageKey, jsonData, heartType) {
  //首先定义内包数据
  var commandArry = command.split(".");
  var messageStr = commandArry[0] + "." + messageKey;
  var protobufObj = null;
  var message = null;
  var buffer = null;
  try {
    protobufObj = ProtobufManager.Root[commandArry[0]].lookupType(messageStr);
    message = ProtobufManager.checkMessage(protobufObj, jsonData);
    if (protobufObj && message) {
      buffer = ProtobufManager.serializeMessage(protobufObj, message);
      //这里心跳区别下
      if (command === "baseproto.pingpang" && heartType) {
        if (heartType === "LOBBY_HEART") {
          command = "lobbyservice.pingpang";
        } else if (heartType === "GAME_HEART") {
          command = "gameservice.pingpang";
        } else {
          LoggerUtil.getInstance().error("无法区分心跳类型");
          return;
        }
      }
      ;
      var data = {
        id: command,
        data: buffer
      };
      //其次定义外包数据
      protobufObj = this.Root["baseproto"].lookupType("baseproto.TransPack");
      message = this.checkMessage(protobufObj, data);
      buffer = this.serializeMessage(protobufObj, message);
    }
  } catch (error) {
    LoggerUtil.getInstance().error("协议问题：" + JSON.stringify(jsonData));
    LoggerUtil.getInstance().error("协议问题：" + messageStr);
  }
  ;
  return buffer;
};
ProtobufManager.checkMessage = function (protobufObj, object) {
  var errMsg = protobufObj.verify(object);
  if (errMsg) {
    throw Error(errMsg);
  }
  var message = protobufObj.create(object);
  return message;
};
ProtobufManager.serializeMessage = function (protobufObj, message) {
  var buffer = protobufObj.encode(message).finish();
  return buffer;
};
ProtobufManager.decode = function (rootName, protoName, buffer) {
  var protobufObj = this.Root[rootName].lookupType(protoName);
  if (protobufObj) {
    return protobufObj.decode(buffer);
  } else {
    LoggerUtil.getInstance().error(rootName + "proto\u6587\u4EF6\u6CA1\u6709" + protoName + "\u5BF9\u5E94\u7684\u6570\u636E\u7ED3\u6784\u4F53");
  }
};
window.ProtobufManager = ProtobufManager;

cc._RF.pop();