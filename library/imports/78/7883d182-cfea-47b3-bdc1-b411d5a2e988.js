"use strict";
cc._RF.push(module, '7883dGCz+pHs73BtBHVoumI', 'testline');
// ResourcesBundle/NewPlan/Shop/testline.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    lab_1: cc.Label,
    lab_2: cc.Label
  },
  // onLoad () {},
  start: function start() {},
  // update (dt) {},
  setLabel: function setLabel(txt) {
    this.lab_1.string = txt;
    this.lab_2.string = txt;
  },
  setNewShopItemChecked: function setNewShopItemChecked(isChecked) {
    this.node.getComponent(cc.Toggle).isChecked = isChecked;

    if (isChecked) {// ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, {msgCode: GlobalCfg.CLIENT_MSG_ID.SHOP_SELECTED_ITEM, msgData: {shopItemData: this.shopItemData}});
    }

    ;
  }
});

cc._RF.pop();