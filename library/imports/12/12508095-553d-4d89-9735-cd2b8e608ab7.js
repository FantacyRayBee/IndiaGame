"use strict";
cc._RF.push(module, '12508CVVT1NiZc1zSuOYIq3', 'GameServerManager');
// Main/Script/Common/Net/GameServerManager.js

"use strict";

var customizeCloseEvent = {};
var GameServerManager = {
  socket: null,
  hearbeatTimer: null,
  hearbeatOutTimer: null,
  hearbeatTimeInterval: 10000,
  needReconnect: true,
  reconnectAcount: 0,
  discardMsg: false,
  isHaveGameEventShowListener: false,
  isTriggerGameEventHide: false,
  readyState: {
    Connecting: 0,
    // 正在链接中
    Connected: 1,
    // 已经链接并且可以通讯
    DisConnecting: 2,
    // 连接正在关闭
    DisConnected: 3 // 连接已关闭或者没有链接成功

  }
};

GameServerManager.setProtoCfgAndUrl = function (protoCfg, websocketUrl) {
  GameServerManager.ProtoCfg = protoCfg;
  GameServerManager.WEB_SOCKET = websocketUrl;
  GameServerManager.clientCloseWSState = false;
};
/**
 * Connect to the game server.
 *
 * @param {boolean} isFirstConnect - whether it is the first connection
 * @return {Promise} a promise that resolves when the connection is established, and rejects if there's an error
 */


GameServerManager.connectServer = function (isFirstConnect) {
  if (isFirstConnect === void 0) {
    isFirstConnect = true;
  }

  return new Promise(function (resolve, reject) {
    LoggerUtil.getInstance().log("Is GameServer a first-time connect ?", isFirstConnect);

    if (GameServerManager.WEB_SOCKET === null) {
      reject('GameService WebSocket Url is null');
      return;
    }

    ;
    LoggerUtil.getInstance().log("GameService WebSocket Url is\uFF1A" + GameServerManager.WEB_SOCKET);

    if (GameServerManager.socket) {
      reject('Do not repeat the creation GameService WebSocket');
      return;
    }

    ;
    GameServerManager.needReconnect = true;

    try {
      if (cc.sys.os == cc.sys.OS_ANDROID && cc.sys.isNative) {
        var cacert = cc.url.raw('resources/pem/cacert.pem');

        if (cc.loader && cc.loader.md5Pipe) {
          cacert = cc.loader.md5Pipe.transformURL(cacert);
        }

        ;
        LoggerUtil.getInstance().log("创建小游戏的websocket, 证书信息为：", cacert);
        GameServerManager.socket = new WebSocket(GameServerManager.WEB_SOCKET, null, cacert);
      } else {
        GameServerManager.socket = new WebSocket(GameServerManager.WEB_SOCKET);
      }
    } catch (error) {
      reject(error);
      return;
    }

    ;
    GameServerManager.socket.binaryType = 'arraybuffer';

    GameServerManager.socket.onopen = function (evt) {
      if (GameServerManager.onOpen) {
        GameServerManager.onOpen(evt, isFirstConnect);

        if (!GameServerManager.isHaveGameEventShowListener) {
          GameServerManager.isHaveGameEventShowListener = true;
          cc.game.on(cc.game.EVENT_SHOW, GameServerManager.onGameEventShow);
          cc.game.on(cc.game.EVENT_HIDE, GameServerManager.onGameEventHide);
        }

        ;
      }

      ;
      isFirstConnect = false;
      resolve();
    };

    GameServerManager.socket.onmessage = function (evt) {
      if (GameServerManager.onReceive) {
        GameServerManager.onReceive(evt);
      }

      ;
    };

    GameServerManager.socket.onerror = function (evt) {
      if (GameServerManager.onError) {
        GameServerManager.onError(evt);
      }

      ;
    };

    GameServerManager.socket.onclose = function (evt) {
      if (GameServerManager.onClose) {
        GameServerManager.onClose(evt, isFirstConnect);
      }

      ;
      reject("Game network connection failed, please enter later");
    };
  });
};

GameServerManager.onGameEventShow = function () {
  LoggerUtil.getInstance().log("Switch back to the front desk, GameServerManager.isTriggerGameEventHide: " + GameServerManager.isTriggerGameEventHide);

  if (!GameServerManager.isTriggerGameEventHide) {
    return;
  }

  ;
  GameServerManager.isTriggerGameEventHide = false;

  if (GameServerManager.socket && GameServerManager.socket.readyState == 1) {
    LoggerUtil.getInstance().log("Switch back to the front-end, Game Server network is normal, and start heartbeat detection！");
    GameServerManager.send("gameservice.pingpang", "PingPang", {
      timestamp: new Date().getTime()
    }, "GAME_HEART");
  } else {
    LoggerUtil.getInstance().log("Switch back to the front-end, GameServer network is abnormal, and start shutting down the network for reconnection！");

    if (GameServerManager.socket) {
      GameServerManager.socket.close();
    } else {
      GameServerManager.onClose(customizeCloseEvent, false);
    }

    ;
  }

  ;
};

GameServerManager.onGameEventHide = function () {
  LoggerUtil.getInstance().log("Switch back to the background, GameServer stops heartbeat detection！");
  GameServerManager.isTriggerGameEventHide = true;
  GameServerManager.stopHeartBeat();
};

GameServerManager.startHeartBeat = function () {
  /**
   * 设定时间之后发心跳消息
   */
  GameServerManager.hearbeatTimer = setTimeout(function () {
    GameServerManager.send("gameservice.pingpang", "PingPang", {
      timestamp: new Date().getTime()
    }, "GAME_HEART");
  }, GameServerManager.hearbeatTimeInterval);
  GameServerManager.hearbeatOutTimer = setTimeout(function () {
    if (GameServerManager.socket) {
      GameServerManager.socket.close();
    } else {
      GameServerManager.onClose(customizeCloseEvent, false);
    }

    ;
    LoggerUtil.getInstance().log('GameService WebSocket status when the heartbeat detection timeout is: ', GameServerManager.socket && GameServerManager.socket.readyState);
  }, GameServerManager.hearbeatTimeInterval * 2);
};

GameServerManager.stopHeartBeat = function () {
  if (GameServerManager.hearbeatTimer !== null) {
    clearTimeout(GameServerManager.hearbeatTimer);
    GameServerManager.hearbeatTimer = null;
  }

  ;

  if (GameServerManager.hearbeatOutTimer !== null) {
    clearTimeout(GameServerManager.hearbeatOutTimer);
    GameServerManager.hearbeatOutTimer = null;
  }

  ;
};

GameServerManager.send = function (command, messageKey, jsonData, heartType) {
  LoggerUtil.getInstance().log("GameService WebSocket status when send message is", GameServerManager.socket && GameServerManager.socket.readyState);

  if (GameServerManager.socket && GameServerManager.socket.readyState == 1) {
    var buff = ProtobufManager.packProtobuf(command, messageKey, jsonData, heartType);

    if (command !== "baseproto.pingpang") {
      if (cc.sys.isBrowser) {
        LoggerUtil.getInstance().log("GameService send ***********>", command, jsonData);
      } else {
        LoggerUtil.getInstance().log("GameService send ***********>", command, JSON.stringify(jsonData));
      }
    }

    ;
    GameServerManager.socket.send(buff);
  } else if (GameServerManager.socket && GameServerManager.socket.readyState == 0) {
    setTimeout(function () {
      GameServerManager.send(command, messageKey, jsonData, heartType);
    }, 1000);
  } else {
    GameServerManager.stopHeartBeat();

    if (GameServerManager.socket) {
      GameServerManager.socket.close();
    } else {
      GameServerManager.onClose(customizeCloseEvent, false);
    }

    ;
  }
}, GameServerManager.onOpen = function (evt, isFirstConnect) {
  LoggerUtil.getInstance().log("GameService WebSocket onOpen***********>", JSON.stringify(evt), isFirstConnect);
  GameServerManager.reconnectAcount = 0;
  GameServerManager.startHeartBeat();
  CommonFun.getInstance().hidProgress();

  if (isFirstConnect == false) {
    GameServerManager.send('gameservice.login', 'LoginReq', {
      userid: GlobalCfg.USER_DATAS.userId,
      token: GlobalCfg.USER_DATAS.token,
      fromid: GlobalCfg.PRODUCT_ID
    });
  }

  ;
};

GameServerManager.onError = function (evt) {
  LoggerUtil.getInstance().warn("GameService WebSocket onerror***********>", JSON.stringify(evt));
};

GameServerManager.onClose = function (evt, isFirstConnect) {
  if (evt) {
    LoggerUtil.getInstance().warn("GameService WebSocket onClose With Event", JSON.stringify(evt));
  } else {
    LoggerUtil.getInstance().warn("GameService WebSocket onClose ***********>");
  }

  ; // 关闭心跳检测

  GameServerManager.stopHeartBeat(); // 清除ws实例对象

  GameServerManager.socket = null; // 是否需要重新连接

  if (GameServerManager.needReconnect && isFirstConnect == false) {
    LoggerUtil.getInstance().warn('GameService WebSocket tryReconnect...');
    GameServerManager.tryReconnect();
  }

  ;
};

GameServerManager.tryReconnect = function () {
  GameServerManager.reconnectAcount += 1;
  LoggerUtil.getInstance().log('The number of times GameService reconnects ===> ', GameServerManager.reconnectAcount);
  var networkType = APPManager.getNetWorkType();
  LoggerUtil.getInstance().log("The current network type is ===> " + networkType + ".  0-\u65E0\u7F51\u7EDC; 1-\u79FB\u52A8\u7F51\u7EDC; 2-\u65E0\u7EBF\u7F51\u7EDC");

  if (networkType == 0 && GameServerManager.reconnectAcount > 30) {
    CommonFun.getInstance().showProgress("Please open the device's network !");
    var connectPromise = GameServerManager.connectServer(false);
    connectPromise["catch"](function (err) {
      LoggerUtil.getInstance().log(err);
    });
  } else if (networkType != 0 && GameServerManager.reconnectAcount > 60) {
    CommonFun.getInstance().showProgress('The network reconnected fails, the server network is busy!');

    if (GameServerManager.reconnectAcount < 66) {
      var _connectPromise = GameServerManager.connectServer(false);

      _connectPromise["catch"](function (err) {
        LoggerUtil.getInstance().log(err);
      });
    } else {
      GameServerManager.reconnectAcount = 0;
      CommonFun.getInstance().hidProgress();

      var _connectPromise2 = GameServerManager.connectServer(false);

      _connectPromise2["catch"](function (err) {
        LoggerUtil.getInstance().log(err);
      });
    }

    ;
  } else {
    CommonFun.getInstance().showProgress('The network is reconnected ...');

    var _connectPromise3 = GameServerManager.connectServer(false);

    _connectPromise3["catch"](function (err) {
      LoggerUtil.getInstance().log(err);
    });
  }

  ;
};

GameServerManager.clientCloseServer = function () {
  LoggerUtil.getInstance().log("GameService WebSocket Close By Client");
  cc.game.off(cc.game.EVENT_SHOW, GameServerManager.onGameEventShow);
  cc.game.off(cc.game.EVENT_HIDE, GameServerManager.onGameEventHide);
  GameServerManager.isHaveGameEventShowListener = false;
  GameServerManager.needReconnect = false;
  GameServerManager.stopHeartBeat();

  if (GameServerManager.socket) {
    GameServerManager.socket.close();
    GameServerManager.socket = null;
  }

  ;
};

GameServerManager.onReceive = function (evt) {
  GameServerManager.stopHeartBeat();
  var bufferStr = evt.data;
  var buffer = new Uint8Array(bufferStr);
  var msgTransPack = ProtobufManager.decode("baseproto", "baseproto.TransPack", buffer);
  LoggerUtil.getInstance().log("GameService WebSocket onReceive: ", msgTransPack.id);
  GameServerManager.startHeartBeat();

  if (GameServerManager.discardMsg) {
    return;
  }

  ;

  if (msgTransPack.id != "gameservice.pingpang") {
    if (!GameServerManager.ProtoCfg[msgTransPack.id]) {
      LoggerUtil.getInstance().error("定义proto协议号对应message中没有: ", msgTransPack.id);
      return;
    }

    ;
    var messageNameArry = msgTransPack.id.split(".");
    var protoRootName = messageNameArry[0];
    var protoMsgName = protoRootName + "." + GameServerManager.ProtoCfg[msgTransPack.id];
    var msgData = ProtobufManager.decode(protoRootName, protoMsgName, msgTransPack.data);

    if (cc.sys.isBrowser) {
      // 获取当前时间
      var now = new Date(); // 获取年份

      var year = now.getFullYear(); // 获取月份（需要+1因为月份是从0开始计算的）

      var month = now.getMonth() + 1; // 获取日期

      var date = now.getDate(); // 获取小时

      var hours = now.getHours(); // 获取分钟

      var minutes = now.getMinutes(); // 获取秒

      var seconds = now.getSeconds();
      LoggerUtil.getInstance().log("GameService\u6536\u5230\u5E76\u5206\u53D1\u5185\u90E8\u5305\u6570\u636E(" + year + "-" + month + "-" + date + " " + hours + ":" + (minutes >= 10 ? minutes : "0" + minutes) + ":" + (seconds >= 10 ? seconds : "0" + seconds) + ") ===>", msgTransPack.id, msgData);
    } else {
      LoggerUtil.getInstance().log("GameService收到并分发内部包数据 ", msgTransPack.id, JSON.stringify(msgData));
    }

    ;
    var data = {
      msgCode: msgTransPack.id,
      msgData: msgData
    };

    if (GameServerManager.checkDistributed(data)) {
      ClientNotify.send(GlobalCfg.MSG_TYPE.serverMsg, data);
    }
  }
};

GameServerManager.checkDistributed = function (webData) {
  var msgId = webData.msgCode;
  var notify = webData.msgData;

  if (notify && (notify.result && notify.result.result !== 0 || notify.Result && notify.Result.result !== 0)) {
    //这个方便错误消息下发至游戏层
    if (GlobalCfg.ACT_SCENE_CTRL && GlobalCfg.ACT_SCENE_CTRL.checkWebMsgError && msgId != "gameservice.login") {
      GlobalCfg.ACT_SCENE_CTRL.checkWebMsgError(webData, GlobalCfg.ACT_SCENE_CTRL);
    }

    ;
    return false;
  } else if (msgId === "gameservice.kickout") {
    LobbyServerManager.clientCloseServer();
    GameServerManager.clientCloseServer();
    CommonFun.getInstance().showMsgBox('Account has been logged in on other devices, please login again!', 'YES', function () {
      SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.LOBBY, SceneManager.getInstance().sceneType.UPDATE);
    });
    return false;
  } else {
    return true;
  }
};

GameServerManager.hideFilterMag = function (isGameHide, callFun) {
  // 1切到后台  2切回前台 
  if (GameServerManager.socket && GameServerManager.socket.readyState === 1) {
    if (isGameHide == 1) {
      GameServerManager.discardMsg = true;
    } else if (isGameHide == 2) {
      GameServerManager.discardMsg = false;
      callFun && callFun();
    }
  } else {
    GameServerManager.discardMsg = false;
  }
};

window.GameServerManager = GameServerManager;

cc._RF.pop();