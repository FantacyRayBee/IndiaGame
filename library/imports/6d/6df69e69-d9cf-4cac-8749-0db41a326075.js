"use strict";
cc._RF.push(module, '6df695p2c9MrIdJDbQaMmB1', 'RocketPlayerGetOut');
// rocket/Scripts/RocketPlayerGetOut.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {},
  // onLoad () {},
  start: function start() {
    this.originY = this.node.y;
  },
  setNodeData: function setNodeData(data) {
    var name = data.nickname;
    var rate = data.mul ? Number(data.mul / 1000).toFixed(2) : 0;
    this.node.getComponent(cc.Label).string = name + "  x" + rate;
  },
  update: function update(dt) {
    if (this.node.y < -300) {
      this.node.destroy();
    }
    if (cc.game.getFrameRate() >= 60) {
      this.node.y -= 2 * 3;
      this.node.x -= 1 * 3;
    } else {
      this.node.y -= 1.5 * 4;
      this.node.x -= 1 * 4;
    }
  }
});

cc._RF.pop();