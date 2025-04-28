"use strict";
cc._RF.push(module, '23a2ch6oYVKtrooa3etIcjT', 'ShopTogItemCtrl');
// ResourcesBundle/NewPlan/Shop/ShopTogItemCtrl.js

"use strict";

// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
  "extends": cc.Component,
  properties: {
    lab_1: cc.Label,
    lab_2: cc.Label,
    checkmark: cc.Node
  },
  start: function start() {},
  onLoad: function onLoad() {
    this.node.on('toggle', this.toggleCallback, this);
  },
  toggleCallback: function toggleCallback(toggle) {
    GlobalCfg.G_COMPONENTS.Audio.playButton();
    if (toggle.isChecked) {
      GlobalCfg.PAY_CHANNEL = this.PAY_CHANNEL;
      ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, {
        msgCode: "REFRESH_SHOP_ITEM",
        msgData: {
          isShow: this.PAY_CONFIG
        }
      });
    }
    ;
  },
  setLabel: function setLabel(data, pay_channel) {
    this.lab_1.string = data.name;
    this.lab_2.string = data.name;
    this.PAY_CHANNEL = pay_channel;
    this.PAY_CONFIG = data.is_multichannel;
  },
  setNewShopItemChecked: function setNewShopItemChecked(isChecked) {
    this.node.getComponent(cc.Toggle).isChecked = isChecked;
  }
});

cc._RF.pop();