"use strict";
cc._RF.push(module, '92365Mb09JC8ZWNpx+PLwH3', 'VipLuckyDrawItemCtrl');
// ResourcesBundle/NewPlan/MyVip/VipLuckyDrawItemCtrl.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    node_iconBonus: cc.Node,
    node_iconCash: cc.Node,
    lab_tips: cc.Label
  },
  setVipLuckyDrawItemData: function setVipLuckyDrawItemData(itemData) {
    if (!itemData) {
      this.node.active = false;
      return;
    }

    ;
    var id = itemData[0] ? itemData[0] : 10;
    var mount = itemData[1] ? itemData[1] : 0;

    if (id == 12) {
      this.node_iconBonus.active = true;
      this.node_iconCash.active = false;
      this.lab_tips.string = mount / 100 + " Bonus";
    } else {
      this.node_iconBonus.active = false;
      this.node_iconCash.active = true;
      this.lab_tips.string = mount / 100 + " Cash";
    }

    ;
  }
});

cc._RF.pop();