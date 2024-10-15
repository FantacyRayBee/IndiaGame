"use strict";
cc._RF.push(module, '601cahekcVFRaeWgE5FR9q1', 'touziCtrl');
// munda/mundaScript/touziCtrl.js

"use strict";

// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
cc.Class({
  "extends": cc.Component,
  properties: {},
  ctor: function ctor() {
    this.touziDice = null;
  },
  setTouziDice: function setTouziDice(num) {
    LoggerUtil.getInstance().log("设置骰子值", num);
    this.touziDice = num;
  },
  getTouziDice: function getTouziDice() {
    return this.touziDice;
  },
  start: function start() {} // update (dt) {},

});

cc._RF.pop();