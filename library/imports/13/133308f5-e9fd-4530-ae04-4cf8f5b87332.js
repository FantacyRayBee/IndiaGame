"use strict";
cc._RF.push(module, '13330j16f1FMK4ETPj1uHMy', 'pddShareCtrl');
// ResourcesBundle/NewPlan/Pdd/Scripts/pddShareCtrl.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {},
  // onLoad () {},
  start: function start() {},
  init: function init() {
    this.btnShare = this.node.getChildByName("btn_share").getComponent(cc.Button);
    this.btn_bg = this.node.getChildByName("btn_bg").getComponent(cc.Button);
    this.btnShare.node.on('click', this.btnClick, this);
    this.btn_bg.node.on('click', this.btnClick, this);
  },
  btnClick: function btnClick(Button) {
    var btnName = Button.node.name;
    GlobalCfg.G_COMPONENTS.Audio.playButton();
    if (btnName == "btn_share") {
      this.share();
    } else if (btnName == "btn_bg") {
      this.node.destroy();
    }
  },
  share: function share() {
    var shareUrl = GlobalCfg.APP_SHARE_URL + "?inviteCode=" + GlobalCfg.CHANNEL_INFO + "_" + GlobalCfg.USER_DATAS.inviteCode;
    APPManager.Share(shareUrl);
  } // update (dt) {},
});

cc._RF.pop();