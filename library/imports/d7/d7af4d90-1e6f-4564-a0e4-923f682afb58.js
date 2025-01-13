"use strict";
cc._RF.push(module, 'd7af42QHm9FZKDkkj9oKvtY', 'zeusMyCoinCtrl');
// zeusGame/src/zeusMyCoinCtrl.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    lab_myCoin: cc.Label
  },
  ctor: function ctor() {
    this.myCoin = 0;
  },
  setMyCoin: function setMyCoin(coin) {
    if (typeof coin != "number") {
      LoggerUtil.getInstance().warn("setMyCoin: coin is not a number");
      this.myCoin = 0;
      this.lab_myCoin.string = "$0";
      return;
    }
    ;
    this.myCoin = coin;
    GlobalCfg.USER_DATAS.userDiamond = coin;
    this.lab_myCoin.string = "$" + this.changeNumToK(coin / 100);
  },
  getMyCoin: function getMyCoin() {
    return this.myCoin;
  },
  changeNumToK: function changeNumToK(num) {
    if (num < 1000) {
      return num;
    } else {
      var n = (num / 1000).toFixed(2);
      var res = n.toString() + 'K';
      return res;
    }
  }
});

cc._RF.pop();