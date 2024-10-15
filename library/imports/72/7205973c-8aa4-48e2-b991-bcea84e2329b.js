"use strict";
cc._RF.push(module, '72059c8iqRI4rmRvOqE4jKb', 'sendReq');
// munda/mundaScript/sendReq.js

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
      fromid: GlobalCfg.PRODUCT_ID //平台

    });
  },
  // 加入vip座位
  JoinVipReq: function JoinVipReq(seat, act) {
    GameServerManager.send("gameservice.joinvip", "JoinVipReq", {
      seat: seat,
      act: act
    });
  },
  //   获取普通玩家列表
  playerlistReq: function playerlistReq(page, size) {
    GameServerManager.send("gameservice.playerlist", "PlayerListReq", {
      page: page,
      size: size
    });
  },
  //获取VIP玩家列表
  VipListReq: function VipListReq() {
    GameServerManager.send("gameservice.viplist", "VipListReq", {});
  },
  //   下注类型()
  callReq: function callReq(amount, types) {
    GameServerManager.send("gameservice.call", "CallReq", {
      amount: amount * 100,
      boss: types
    });
  },
  // 退出游戏
  ExitGameReq: function ExitGameReq() {
    GameServerManager.send("gameservice.exitgame", "ExitGameReq", {});
  },
  QueryGameEndInfoReq: function QueryGameEndInfoReq() {
    GameServerManager.send("gameservice.querygameendinfo", "QueryGameEndInfoReq", {});
  }
});

cc._RF.pop();