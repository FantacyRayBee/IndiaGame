"use strict";
cc._RF.push(module, '0b9f2PE1UdNG7Kdcw4TkyZm', 'lhdPlayerItemCtrl');
// lhdGame/lhdScr/lhdPlayerItemCtrl.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    lab_name: cc.Label,
    lab_coin: cc.Label,
    sprite_head: cc.Sprite
  },
  setPlayDate: function setPlayDate(date) {
    this.lab_name.string = CommonFun.getInstance().getStrByLength(date.nickname, 12);
    this.lab_coin.string = CommonFun.getInstance().numberToShow(date.diamond / 100);
    GlobalCfg.ACT_SCENE_CTRL.loadHeadSp(date.imgUrl, 80, this.sprite_head);
  }
});

cc._RF.pop();