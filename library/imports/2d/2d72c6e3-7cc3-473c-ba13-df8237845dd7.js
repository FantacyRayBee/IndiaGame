"use strict";
cc._RF.push(module, '2d72cbjfMNHPLoT34I3hF3X', 'EVENT_HIDE_UP');
// 7up7downGame/7upScript/EVENT_HIDE_UP.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {},
  ctor: function ctor() {
    this.netReconnection = 0;
  },
  onLoad: function onLoad() {
    this.houtai = false;
    this.eventShow();
    this.eventHide();
    this.msgHandle = ClientNotify.register(GlobalCfg.MSG_TYPE.serverMsg, this.onEventMsg, this);
    this.msgHandle1 = ClientNotify.register(GlobalCfg.MSG_TYPE.clientMsg, this.onEventMsg, this);
  },
  onDestroy: function onDestroy() {
    ClientNotify.removeByHandle(GlobalCfg.MSG_TYPE.serverMsg, this.msgHandle);
    ClientNotify.removeByHandle(GlobalCfg.EVENT_NET_OPEN, this.msgHandle1);
  },
  onEventMsg: function onEventMsg(webData, target) {
    var self = target;
    var msgId = webData.msgCode;
    var notify = webData.msgData;
    if (msgId == "gameservice.login" && self.netReconnection == 1) {
      LoggerUtil.getInstance().log("重连后台登录了");
      var mainScript = self.node.getComponent('7upCtrl');
      var scene = cc.director.getScene();
    } else if (msgId == GlobalCfg.CLIENT_MSG_ID.NET_OPEN && notify === "GAME_SERVER" && self.netReconnection == 1) {
      // GlobalCfg.SMALL_GAME_DATAS.upDownData.upThisCtrl.Up7LoginReq();
    }
  },
  // 游戏切回到前台
  eventShow: function eventShow() {
    var _this = this;
    cc.game.on(cc.game.EVENT_SHOW, function () {
      if (_this.houtai) {
        _this.netReconnection = 1;
        GameServerManager.hideFilterMag(2, function () {
          GameServerManager.send("gameservice.gamestartnotify", "GameStartNotifyReq", {});
        });
      } else {
        _this.netReconnection = 2;
      }
    }, this);
  },
  //游戏切入到后台
  eventHide: function eventHide() {
    cc.game.on(cc.game.EVENT_HIDE, function () {
      GameServerManager.hideFilterMag(1);
      this.houtai = true;
    }, this);
  },
  start: function start() {},
  update: function update(dt) {}
});

cc._RF.pop();