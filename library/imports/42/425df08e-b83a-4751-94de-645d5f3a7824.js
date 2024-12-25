"use strict";
cc._RF.push(module, '425dfCOuDpHUZTeZF1fOngk', 'cricketRecordItemCtrl');
// cricketGame/scripts/cricketRecordItemCtrl.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    newAnimation: cc.Animation,
    timeInterval: {
      "default": 2,
      type: cc.Integer,
      tooltip: "动画播放时间间隔"
    },
    time: {
      "default": 0,
      type: cc.Integer,
      visible: false
    }
  },
  // LIFE-CYCLE CALLBACKS:
  // onLoad () {},
  start: function start() {},
  update: function update(dt) {
    if (this.newAnimation.node.active == true) {
      this.time += dt;
      if (this.time >= this.timeInterval) {
        this.newAnimation.play();
        this.time = 0;
      }
    }
  }
});

cc._RF.pop();