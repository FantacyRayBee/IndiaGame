"use strict";
cc._RF.push(module, 'b259cqRMEhDY5z7x2XJbRYF', 'benzSendMessage');
// Benz/BenzScript/benzSendMessage.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {},
  // LIFE-CYCLE CALLBACKS:
  // onLoad () {},
  start: function start() {},
  loginReq: function loginReq() {
    GameServerManager.send("gameservice.login", "LoginReq", {
      userid: GlobalCfg.USER_DATAS.userId,
      //用户ID
      token: GlobalCfg.USER_DATAS.token,
      //登录服拿到的token
      fromid: GlobalCfg.PRODUCT_ID //平台
    });
  },

  exitGameReq: function exitGameReq(call) {
    GameServerManager.send("gameservice.exit", "ExitGameCallReq", {
      Call: call
    });
  },
  gameSceneReq: function gameSceneReq() {
    GameServerManager.send("gameservice.gamescene", "GameSceneReq", {});
  },
  /**
   * 
   * @param {*} playerid 
   * @param {Array} call {Amount,type}
   */
  sendCallReq: function sendCallReq(call) {
    GameServerManager.send("gameservice.call", "CallReq", {
      Call: call
    });
  }

  // update (dt) {},
});

cc._RF.pop();