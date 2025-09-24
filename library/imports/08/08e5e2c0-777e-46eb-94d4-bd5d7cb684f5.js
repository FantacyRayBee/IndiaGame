"use strict";
cc._RF.push(module, '08e5eLAd35G65TUvV18toT1', 'mundaPlayerItemCtrl');
// munda/mundaScript/mundaPlayerItemCtrl.js

"use strict";

cc.Class({
  "extends": require('UINode'),
  properties: {
    user_head: cc.Sprite,
    lab_coin: cc.Label,
    lab_name: cc.Label
  },
  onLoad: function onLoad() {},
  start: function start() {},
  setPlayerItemInfo: function setPlayerItemInfo(data) {
    this.setName(data.nickname);
    this.setCoin(data.diamond);
    this.loadHeadSp(data.imgUrl, 80, this.user_head);
  },
  setName: function setName(nickname) {
    this.nickname = nickname;

    if (this.lab_name) {
      this.lab_name.string = CommonFun.getInstance().getStrByLength(nickname, 12);
    }
  },
  setCoin: function setCoin(coin) {
    this.coin = FloatCalculation.accDiv(coin, 100);

    if (this.lab_coin && coin != null) {
      this.lab_coin.string = CommonFun.getInstance().numberToShow(this.coin);
    }
  } // update (dt) {},

});

cc._RF.pop();