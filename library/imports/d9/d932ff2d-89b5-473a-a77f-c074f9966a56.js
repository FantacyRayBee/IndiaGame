"use strict";
cc._RF.push(module, 'd932f8tibVHOqd/wHT5lmpW', 'RocketPlayerItem');
// rocket/Scripts/RocketPlayerItem.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    lab_name: cc.Label,
    lab_coin: cc.Label,
    sprite_head: cc.Sprite
  },
  setPlayData: function setPlayData(data) {
    this.lab_name.string = CommonFun.getInstance().getStrByLength(data.nickname, 12);
    this.lab_coin.string = CommonFun.getInstance().numberToShow(data.diamond / 100);
    GlobalCfg.ACT_SCENE_CTRL.loadHeadSp(data.imgUrl, 80, this.sprite_head);
  },
  // onLoad () {},
  start: function start() {} // update (dt) {},
});

cc._RF.pop();