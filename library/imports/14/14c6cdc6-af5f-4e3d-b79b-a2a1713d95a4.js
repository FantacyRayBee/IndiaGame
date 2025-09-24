"use strict";
cc._RF.push(module, '14c6c3Gr19OPbeboqFxPZWk', 'ShopItemCtrl');
// ResourcesBundle/NewPlan/Shop/ShopItemCtrl.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    lab_shopCoin1: cc.Label,
    lab_shopCoin2: cc.Label,
    lab_bonus: cc.Label,
    node_bonus: cc.Node
  },
  onLoad: function onLoad() {
    this.node.on('toggle', this.toggleCallback, this);
  },
  toggleCallback: function toggleCallback(toggle) {
    GlobalCfg.G_COMPONENTS.Audio.playButton();
    var toggleName = toggle.node.name;

    if (this.node.getComponent(cc.Toggle).isChecked) {
      ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, {
        msgCode: GlobalCfg.CLIENT_MSG_ID.SHOP_SELECTED_ITEM,
        msgData: {
          shopItemData: this.shopItemData
        }
      });
    }

    ;
  },
  setNewShopItemData: function setNewShopItemData(data) {
    if (!data) {
      return;
    }

    ;
    this.shopItemData = data;
    var amount = Math.floor(data.amount / 100);
    var id = data.id;
    var loop_status = data.loop_status;
    var gift = Math.floor(data.gift / 100); // 赠送

    this.lab_shopCoin1.string = "\u20B9" + amount;
    this.lab_shopCoin2.string = "\u20B9" + amount;

    if (loop_status == 0 && gift != 0) {
      this.node_bonus.active = true;
      this.lab_bonus.string = '+₹' + Number(gift);
    } else if (loop_status == 1) {
      this.node_bonus.active = false;
    }

    ;
  },
  setNewShopItemChecked: function setNewShopItemChecked(isChecked) {
    this.node.getComponent(cc.Toggle).isChecked = isChecked;

    if (isChecked) {
      ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, {
        msgCode: GlobalCfg.CLIENT_MSG_ID.SHOP_SELECTED_ITEM,
        msgData: {
          shopItemData: this.shopItemData
        }
      });
    }

    ;
  }
});

cc._RF.pop();