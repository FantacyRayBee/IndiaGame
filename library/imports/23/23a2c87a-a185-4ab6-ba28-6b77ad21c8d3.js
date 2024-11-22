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
  // onLoad () {},
  start: function start() {// var graphics = this.checkmark.getComponent(cc.Graphics);
    // // 清除之前的绘图指令
    // graphics.clear();
    // graphics.lineWidth = 3;
    // graphics.strokeColor = cc.Color.BLACK;
    // graphics.rect(0, 0, 140, 56);
    // graphics.moveTo(0, 0);
    // // 立即渲染
    // graphics.stroke();
  },
  onLoad: function onLoad() {
    this.node.on('toggle', this.toggleCallback, this);
  },
  toggleCallback: function toggleCallback(toggle) {
    GlobalCfg.G_COMPONENTS.Audio.playButton();

    if (this.node.getComponent(cc.Toggle).isChecked) {
      GlobalCfg.PAY_CHANNEL = this.PAY_CHANNEL;
    }

    ;
  },
  // update (dt) {},
  setLabel: function setLabel(txt, pay_channel) {
    this.lab_1.string = "UPI " + txt;
    this.lab_2.string = "UPI " + txt;
    this.PAY_CHANNEL = pay_channel;
  },
  setNewShopItemChecked: function setNewShopItemChecked(isChecked) {
    this.node.getComponent(cc.Toggle).isChecked = isChecked;

    if (isChecked) {// GlobalCfg.PAY_CHANNEL = this.PAY_CHANNEL;   
    }

    ;
  }
});

cc._RF.pop();