"use strict";
cc._RF.push(module, '367252OL19LT4ZVJoRrin7y', 'trendCtrl');
// munda/mundaScript/trendCtrl.js

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
    grey: cc.SpriteFrame,
    red: cc.SpriteFrame
  },
  // LIFE-CYCLE CALLBACKS:
  onLoad: function onLoad() {
    this.btn_close = this.node.getChildByName("btn_close").getComponent(cc.Button);
    this.btn_close.node.on("click", this.btnClick, this);
  },
  start: function start() {},
  btnClick: function btnClick(button) {
    GlobalCfg.G_COMPONENTS.Audio.playBack();
    this.node.destroy();
  },
  initTrendNode: function initTrendNode() {
    for (var i = 0; i < 6; i++) {
      for (var j = 0; j < 14; j++) {
        var node = this.node.getChildByName("bg_zs").getChildByName("node_" + i).getChildByName("child_" + j);
        node.active = false;
      }
    }
  },
  setTrendData: function setTrendData(data) {
    this.initTrendNode();

    for (var i = 0; i < data.length; i++) {
      var arr = data[i];

      for (var j = 0; j < arr.length; j++) {
        var dice = arr[j];
        var node = this.node.getChildByName("bg_zs").getChildByName("node_" + i).getChildByName("child_" + j);

        if (dice < 2) {
          node.getComponent(cc.Sprite).spriteFrame = this.grey;
          node.getChildByName("lab").getComponent(cc.Label).string = "";
        } else {
          node.getComponent(cc.Sprite).spriteFrame = this.red;
          node.getChildByName("lab").getComponent(cc.Label).string = dice;
        }

        node.active = true;
      }
    }
  } // update (dt) {},

});

cc._RF.pop();