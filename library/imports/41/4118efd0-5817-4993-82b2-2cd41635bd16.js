"use strict";
cc._RF.push(module, '4118e/QWBdJk4KyLNQWNb0W', 'WithDrawItemCtrl');
// ResourcesBundle/NewPlan/WithDraw/WithDrawItemCtrl.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    lab_amoount1: cc.Label,
    lab_amoount2: cc.Label,
    lab_handlingFee: cc.Label,
    node_handlingFee: cc.Node
  },
  onLoad: function onLoad() {
    this.node.on('toggle', this.toggleCallback, this);
  },
  toggleCallback: function toggleCallback(toggle) {
    GlobalCfg.G_COMPONENTS.Audio.playButton();
    var toggleName = toggle.node.name;
    if (this.node.getComponent(cc.Toggle).isChecked) {
      ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, {
        msgCode: GlobalCfg.CLIENT_MSG_ID.WITHDRAW_SELECTED_ITEM,
        msgData: {
          itemData: this.itemData
        }
      });
    }
    ;
  },
  setWithDrawItemData: function setWithDrawItemData(data) {
    if (!data) {
      return;
    }
    ;
    this.itemData = data;
    var price = data.price;
    this.lab_amoount1.string = "\u20B9" + price;
    this.lab_amoount2.string = "\u20B9" + price;
    var service_rate = data.service_rate;
    if (service_rate > 0) {
      this.node_handlingFee.active = true;
      this.lab_handlingFee.string = (Number(service_rate) * 100).toFixed(1) + "%";
    }
    ;
  },
  setWithDrawItemChecked: function setWithDrawItemChecked(isChecked) {
    this.node.getComponent(cc.Toggle).isChecked = isChecked;
    if (isChecked) {
      ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, {
        msgCode: GlobalCfg.CLIENT_MSG_ID.WITHDRAW_SELECTED_ITEM,
        msgData: {
          itemData: this.itemData
        }
      });
    }
    ;
  }
});

cc._RF.pop();