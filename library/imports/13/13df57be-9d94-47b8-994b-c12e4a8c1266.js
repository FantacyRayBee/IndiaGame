"use strict";
cc._RF.push(module, '13df5e+nZRHuJlLwS5KjBJm', 'historyCtrl');
// munda/mundaScript/historyCtrl.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    spriteList: {
      "default": Array,
      type: cc.SpriteFrame
    }
  },
  setSprite: function setSprite(data) {
    if (data == 0 || data == 1) {
      this.node.getComponent(cc.Sprite).spriteFrame = this.spriteList[0];
    } else {
      this.node.getComponent(cc.Sprite).spriteFrame = this.spriteList[data - 1];
    }
  }
});

cc._RF.pop();