"use strict";
cc._RF.push(module, '903adHM6vFCV7P6isVh0E1M', 'zooResultNodeCtrl');
// zooGame/Scripts/zooResultNodeCtrl.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    sprites: [cc.SpriteFrame]
  },
  // LIFE-CYCLE CALLBACKS:
  // onLoad () {},
  start: function start() {},
  // update (dt) {},
  setSpriteFrame: function setSpriteFrame(index) {
    if (index == 12) {
      // 全输
      index = 9;
    }

    if (index == 13) {
      // 全赢
      index = 10;
    }

    if (index == 11) {
      index = 11;
    }

    this.node.getComponent(cc.Sprite).spriteFrame = this.sprites[index];
  }
});

cc._RF.pop();