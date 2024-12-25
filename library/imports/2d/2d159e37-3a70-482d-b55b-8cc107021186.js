"use strict";
cc._RF.push(module, '2d15943OnBILbVbjMEHAhGG', 'ActivitySignItemCtrl');
// ResourcesBundle/NewPlan/Activity/ActivitySignItemCtrl.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    lab_reward: cc.Label,
    lab_day: cc.Label,
    node_signed: cc.Node,
    node_unsigned: cc.Node
  },
  setSignItemData: function setSignItemData(gift, today, done, day) {
    this.lab_reward.string = "\u20B9" + gift / 100;
    this.lab_day.string = "Day" + day;
    if (today > day) {
      this.node_signed.active = true;
      this.node_unsigned.active = false;
    } else if (today == day && done == true) {
      this.node_signed.active = true;
      this.node_unsigned.active = false;
    } else if (today == day && done == false) {
      this.node_signed.active = false;
      this.node_unsigned.active = true;
    } else {
      this.node_signed.active = false;
      this.node_unsigned.active = false;
    }
    ;
  },
  setSignItemSigned: function setSignItemSigned() {
    this.node_signed.active = true;
    this.node_unsigned.active = false;
  }
});

cc._RF.pop();