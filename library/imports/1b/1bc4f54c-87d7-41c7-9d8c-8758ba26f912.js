"use strict";
cc._RF.push(module, '1bc4fVMh9dBx52Mh1i6JvkS', 'horseRaceSendReq');
// horseRaceGame/horseScr/horseRaceSendReq.js

"use strict";

cc.Class({
  "extends": cc.Component,
  // 游戏登录
  loginReq: function loginReq() {
    GameServerManager.send("gameservice.login", "LoginReq", {
      userid: GlobalCfg.USER_DATAS.userId,
      //用户ID
      token: GlobalCfg.USER_DATAS.token,
      //登录服拿到的token
      fromid: GlobalCfg.PRODUCT_ID,
      isFree: GlobalCfg.GAME_ENTER_ISFREE //是否进入免费场
    });
  },

  //   获取普通玩家列表
  playerlistReq: function playerlistReq(page, rows) {
    GameServerManager.send("gameservice.playerlist", "PlayerListReq", {
      page: page,
      rows: 12
    });
  },
  // 加入房间
  JoinRoomReq: function JoinRoomReq() {
    GameServerManager.send("gameservice.joinroom", "JoinRoomReq", {});
  },
  // 加入vip座位
  JoinVipPosReq: function JoinVipPosReq(pos) {
    GameServerManager.send("gameservice.joinvippos", "JoinVipPosReq", {
      pos: pos
    });
  },
  //   下注类型
  callReq: function callReq(amount, types) {
    if (amount > 0) {
      GameServerManager.send("gameservice.call", "CallReq", {
        amount: amount,
        types: types
      });
    }
  },
  // 获取获取战绩信息
  GameRecordListReq: function GameRecordListReq(pos) {
    GameServerManager.send("gameservice.gamerecordlist", "GameRecordListReq", {});
  },
  // 退出游戏
  OutGameReq: function OutGameReq() {
    GameServerManager.send("gameservice.outgame", "OutGameReq", {});
  }
});

cc._RF.pop();