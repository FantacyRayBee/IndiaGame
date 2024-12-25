"use strict";
cc._RF.push(module, '5fe12HOW6RAp5D1wMDnSXU0', '7upPlayerItemCtrl');
// 7up7downGame/7upScript/7upPlayerItemCtrl.js

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
    this.setName(data.Nickname);
    this.setCoin(data.Diamond);
    this.loadHeadSp(data.ImgUrl, 80, this.user_head);
  },
  setName: function setName(nickname) {
    this.nickname = nickname;
    if (this.lab_name) {
      this.lab_name.string = CommonFun.getInstance().getStrByLength(nickname, 8);
    }
  },
  setCoin: function setCoin(coin) {
    this.coin = FloatCalculation.accDiv(coin, 100);
    if (this.lab_coin && coin != null) {
      this.lab_coin.string = CommonFun.getInstance().numberToShow(this.coin);
    }
  }
});

cc._RF.pop();