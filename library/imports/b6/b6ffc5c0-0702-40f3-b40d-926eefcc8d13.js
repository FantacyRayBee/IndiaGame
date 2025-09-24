"use strict";
cc._RF.push(module, 'b6ffcXABwJA87QNkm7vzI0T', 'teenPattiBattleCardCtrl');
// teenPatti/src/teenPattiBattleCardCtrl.js

"use strict";

/*
 * @Author: 李康
 * @Date: 2021-12-03 17:01:29
 * @LastEditTime: 2021-12-27 11:43:16
 * @LastEditors: Please set LastEditors
 * @FilePath: \rummy_zjh\assets\teenPatti\src\teenPattiBattleCardCtrl.js
 */
cc.Class({
  "extends": cc.Component,
  properties: {
    lab_batteleName: cc.Label,
    lab_refuseTime: cc.Label,
    lab_user1Name: cc.Label,
    lab_user2Name: cc.Label,
    sprite_user1TX: cc.Sprite,
    sprite_user2TX: cc.Sprite,
    btn_refuse: cc.Button,
    btn_agree: cc.Button,
    nodes: [cc.Node]
  },
  onLoad: function onLoad() {
    this.msgHandle = ClientNotify.register(GlobalCfg.MSG_TYPE.serverMsg, this.onEventMsg, this);
    this.btn_refuse.node.on('click', CommonFun.getInstance().debounce(this.btnClickCall, 1), this);
    this.btn_agree.node.on('click', CommonFun.getInstance().debounce(this.btnClickCall, 1), this);
    this.setTitleBG();
  },
  onEventMsg: function onEventMsg(webData, target) {
    var self = target;
    var msgId = webData.msgCode;
    var notify = webData.msgData;

    if (msgId == "gameservice.answercompare") {
      self.node.destroy();
    }

    ;
  },
  onDestroy: function onDestroy() {
    this.clearTeenPatiiBattleCardActTimer();
    ClientNotify.removeByHandle(GlobalCfg.MSG_TYPE.serverMsg, this.msgHandle);
  },
  btnClickCall: function btnClickCall(btn) {
    GlobalCfg.G_COMPONENTS.Audio.playButton();
    var btnName = btn.node.name;

    if (btnName == "btn_refuse") {
      this.sendBattleCardAnswer(false);
    } else if (btnName == "btn_agree") {
      this.sendBattleCardAnswer(true);
    }

    ;
  },
  sendBattleCardAnswer: function sendBattleCardAnswer(agree) {
    var proroID = "gameservice.answercompare";
    var message = "AnswerCompareReq";
    GameServerManager.send(proroID, message, {
      agree: agree
    });
  },
  setTeenPattiBattleCardRefuseTime: function setTeenPattiBattleCardRefuseTime(time) {
    if (time > 0) {
      this.clearTeenPatiiBattleCardActTimer();
      time--;
      this.lab_refuseTime.string = time;
      var self = this;

      var actTimerCall = function actTimerCall() {
        if (self && self.lab_refuseTime) {
          if (time < 0 && self) {
            self.sendBattleCardAnswer(false);
            self.clearTeenPatiiBattleCardActTimer();
            return;
          }

          ;
          self.lab_refuseTime.string = time;
          time--;
        }

        ;
      };

      this.actTimer = setInterval(actTimerCall, 1000);
    }

    ;
  },
  clearTeenPatiiBattleCardActTimer: function clearTeenPatiiBattleCardActTimer() {
    if (this.actTimer) {
      clearInterval(this.actTimer);
      this.actTimer = null;
    }

    ;
  },
  setTeenPattiBattleCardLaunchPlayerName: function setTeenPattiBattleCardLaunchPlayerName(name) {
    this.lab_user1Name.string = name;
  },
  setTeenPattiBattleCardTargetPlayerName: function setTeenPattiBattleCardTargetPlayerName(name) {
    this.lab_user2Name.string = name;
  },
  setTeenPattiBattleCardLaunchPlayerTX: function setTeenPattiBattleCardLaunchPlayerTX(imgUrl) {
    var self = this;
    cc.assetManager.loadRemote(imgUrl, {
      ext: '.png'
    }, function (err, texture) {
      if (!err && cc.isValid(self) && cc.isValid(self.sprite_user1TX)) {
        var spriteFrame = new cc.SpriteFrame(texture);
        self.sprite_user1TX.spriteFrame = spriteFrame;
        self.sprite_user1TX.node.setScale(120 / self.sprite_user1TX.node.width);
      }

      ;
    });
  },
  setTeenPattiBattleCardTargetPlayerTX: function setTeenPattiBattleCardTargetPlayerTX(imgUrl) {
    var self = this;
    cc.assetManager.loadRemote(imgUrl, {
      ext: '.png'
    }, function (err, texture) {
      if (!err && cc.isValid(self) && cc.isValid(self.sprite_user2TX)) {
        var spriteFrame = new cc.SpriteFrame(texture);
        self.sprite_user2TX.spriteFrame = spriteFrame;
        self.sprite_user2TX.node.setScale(120 / self.sprite_user2TX.node.width);
      }

      ;
    });
  },
  setTeenPattiBattleCardPKName: function setTeenPattiBattleCardPKName(name) {
    this.lab_batteleName.string = name;
  },
  setTitleBG: function setTitleBG() {
    if (this.nodes) {
      for (var i = 0; i < 4; i++) {
        this.nodes[i].active = language == i + 1;
      }

      this.nodes[4].getComponent(cc.Label).string = language == 2 ? "अस्वीकार" : "Refuse";
      this.nodes[5].getComponent(cc.Label).string = playerCenterLanguage.lab_ok[language];
    }
  }
});

cc._RF.pop();