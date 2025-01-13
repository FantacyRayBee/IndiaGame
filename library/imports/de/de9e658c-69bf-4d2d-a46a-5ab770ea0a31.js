"use strict";
cc._RF.push(module, 'de9e6WMab9NLaRqWrdw6gox', 'RocketMessageManager');
// rocket/Scripts/RocketMessageManager.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {},
  // LIFE-CYCLE CALLBACKS:
  // onLoad () {},
  start: function start() {},
  // update (dt) {},
  /**
   * 登录
   */
  sendLoginMessage: function sendLoginMessage() {
    GameServerManager.send("gameservice.login", "LoginReq", {
      userid: GlobalCfg.USER_DATAS.userId,
      token: GlobalCfg.USER_DATAS.token
    });
  },
  /**
   * 刷新游戏场景
   */
  sendRefreshMessage: function sendRefreshMessage() {
    GameServerManager.send("gameservice.loadwhole", "LoadWholeReq", {});
  },
  /**
   * 退出
   */
  sendExitMessage: function sendExitMessage() {
    GameServerManager.send("gameservice.exit", "ExitReq", {});
  },
  /**
   * 获取玩家列表
   * @param {Number} _page 页数 , 0 代表第一页
   * @param {Number} _rows 
   */
  sendGetPlayerListMessage: function sendGetPlayerListMessage(_page, _rows) {
    GameServerManager.send("gameservice.playerlist", "PlayerListReq", {
      page: _page,
      rows: _rows
    });
  },
  /**
   * 玩家下注
   * @param {Number} amount 下注金额
   */
  sendBetMessage: function sendBetMessage(amount) {
    GameServerManager.send("gameservice.bet", "BetReq", {
      amount: amount
    });
  },
  /**
   * 领取奖励
   * @param {Number} _time 时间坐标
   * @param {Number} _mul 倍数
   */
  sendGetCashMessage: function sendGetCashMessage(_time, _mul) {
    GameServerManager.send("gameservice.cash", "CashReq", {
      x: Math.round(_time * 1000),
      mul: Math.round(Number(_mul) * 1000)
    });
  }
});

cc._RF.pop();