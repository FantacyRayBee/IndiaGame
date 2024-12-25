"use strict";
cc._RF.push(module, 'b84b04JuktAyYWLlEv0YTm2', 'teenPattiHintCtrl');
// teenPatti/src/teenPattiHintCtrl.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    lab_content: cc.Label,
    btn_pack: cc.Button,
    btn_continue: cc.Button
  },
  onLoad: function onLoad() {
    this.btn_pack.node.on('click', CommonFun.getInstance().debounce(this.btnClickCall, 1), this);
    this.btn_continue.node.on('click', CommonFun.getInstance().debounce(this.btnClickCall, 1), this);
  },
  btnClickCall: function btnClickCall(btn) {
    GlobalCfg.G_COMPONENTS.Audio.playButton();
    var btnName = btn.node.name;
    switch (btnName) {
      case this.btn_pack.node.name:
        this.dealBtnPackEvent();
        break;
      case this.btn_continue.node.name:
        this.node.destroy();
        break;
      default:
        break;
    }
  },
  dealBtnPackEvent: function dealBtnPackEvent() {
    var proroID = "gameservice.drop";
    var message = "DropReq";
    GameServerManager.send(proroID, message, {});
    this.node.destroy();
  },
  setTeenPattiWinRate: function setTeenPattiWinRate(winRate) {
    this.lab_content.string = "Your probability of winning this round is " + (winRate / 100).toFixed(2) + "%\nAre yor sure to pack?";
  }
});

cc._RF.pop();