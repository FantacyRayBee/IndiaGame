"use strict";
cc._RF.push(module, '6abf4h63EBGaY5YxrjR+HiY', 'lhdSendReq');
// lhdGame/lhdScr/lhdSendReq.js

"use strict";

cc.Class({
  "extends": cc.Component,

  /*  =================================================龙虎斗数据请求======================================*/
  // 游戏登录
  loginReq: function loginReq() {
    GameServerManager.send("gameservice.login", "LoginReq", {
      userid: GlobalCfg.USER_DATAS.userId,
      //用户ID
      token: GlobalCfg.USER_DATAS.token,
      //登录服拿到的token
      fromid: GlobalCfg.PRODUCT_ID //平台

    });
  },
  //   获取普通玩家列表
  playerlistReq: function playerlistReq(page, rows) {
    GameServerManager.send("gameservice.playerlist", "PlayerListReq", {
      page: page,
      rows: 12
    });
  },
  // 加入vip座位
  JoinVipPosReq: function JoinVipPosReq(pos) {
    GameServerManager.send("gameservice.joinvip", "JoinVipReq", {
      pos: pos
    });
  },
  // 下注类型(0是龙 1是虎 2是平局)
  callReq: function callReq(amount, types) {
    if (amount > 0) {
      GameServerManager.send("gameservice.call", "CallReq", {
        amount: amount,
        side: types
      });
    }
  },
  // 刷新游戏场景
  GameSceneReq: function GameSceneReq() {
    GameServerManager.send("gameservice.gamescene", "GameSceneReq", {});
  },
  // 退出游戏
  OutGameReq: function OutGameReq() {
    GameServerManager.send("gameservice.exitroom", "ExitRoomReq", {});
  }
});

cc._RF.pop();