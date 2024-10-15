"use strict";
cc._RF.push(module, '4c8cbZcVU9OfrGPngxqKxvw', 'chatCtrl');
// ResourcesBundle/NewPlan/GameGifInteraction/chatCtrl.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    togg_btnArr: [cc.Toggle]
  },
  onLoad: function onLoad() {
    this.initLocalBtn();
    this.showWords();
  },
  toggleClick: function toggleClick(toggle) {
    var togName = toggle.node.name;
    GlobalCfg.G_COMPONENTS.Audio.playButton();

    if (togName == "toggle_qiaoPiHua") {
      this.nodeQPH.active = true;
      this.nodeTP.active = false;
    } else if (togName == "toggle_tuPian") {
      this.nodeQPH.active = false;
      this.nodeTP.active = true;
    } else if (togName == "btn_mask") {
      this.node.destroy();
    }
  },
  // 俏皮话
  btnClickQPH: function btnClickQPH(button) {
    var data = {};
    this.wz = button.target.getChildByName("Label").getComponent(cc.Label).string;
    data.qph = this.wz;
    data.msgid = 1;
    this.ShortMessageReq(0, this.wz);
    this.node.destroy();
  },
  // 图片
  btnClickTP: function btnClickTP(button) {
    var data = {};
    this.sp = button.target.getComponent(cc.Sprite).spriteFrame.name;
    data.qph = this.sp;
    data.msgid = 0;
    this.ShortMessageReq(1, this.sp);
    this.node.destroy();
  },
  // 发送表情或消息
  ShortMessageReq: function ShortMessageReq(msgType, name) {
    GameServerManager.send("gameservice.shortmessage", "ShortMessageReq", {
      msgType: msgType,
      name: name,
      target: this.msgid
    });
  },
  initLocalBtn: function initLocalBtn() {
    this.nodeQPH = this.node.getChildByName("ScrollView_qph");
    this.nodeTP = this.node.getChildByName("ScrollView_tp");
    this.btnChildrenQPH = this.nodeQPH.getChildByName("view").getChildByName("content").children;
    this.btnChildrenTP = this.nodeTP.getChildByName("view").getChildByName("content").children;
    this.btn_mask = this.node.getChildByName("btn_mask").getComponent(cc.Button);
    this.btn_mask.node.on('click', this.toggleClick, this);

    for (var i = 0; i < this.togg_btnArr.length; i++) {
      var tog = this.togg_btnArr[i];
      tog.node.on('click', this.toggleClick, this);
    }

    for (var k = 0; k < this.btnChildrenQPH.length; k++) {
      var btnQPH = this.btnChildrenQPH[k].getComponent(cc.Button);
      btnQPH.node.on('click', this.btnClickQPH, this);
    }

    for (var j = 0; j < this.btnChildrenTP.length; j++) {
      var btnTP = this.btnChildrenTP[j].getComponent(cc.Button);
      btnTP.node.on('click', this.btnClickTP, this);
    }
  },
  showWords: function showWords() {
    for (var k = 0; k < this.btnChildrenQPH.length; k++) {
      var lab = this.btnChildrenQPH[k].getComponent(cc.Button).target.getChildByName("Label");
      var str = lab.getComponent(cc.Label);
      str.string = zjhQiaoPiHau[k][language];
    }
  },
  setPlayerSeat: function setPlayerSeat(msgid) {
    this.msgid = msgid;
  }
});

cc._RF.pop();