"use strict";
cc._RF.push(module, '207bdfem41Byph0Lq9WUeQF', 'horseRaceBetCoinCtrl');
// horseRaceGame/horseScr/horseRaceBetCoinCtrl.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {},
  onLoad: function onLoad() {
    this.betPosArr = [null, cc.v2(-252 - 70, -75 - 15), cc.v2(66 - 70, -75 - 15), cc.v2(384 - 70, -75 - 15), cc.v2(-253 - 70, -180 - 15), cc.v2(66 - 70, -180 - 15), cc.v2(384 - 70, -180 - 15)];
  },
  // 移动坐标
  setMovePos: function setMovePos(node) {
    var nodePos = this.betCoinAct(node);
    cc.tween(this.node).delay((Math.random() / 3).toFixed(2)).to(0.3, {
      position: cc.v2(nodePos.x, nodePos.y)
    }) //{easing: "quadOut"}
    .start();
  },
  // 静态坐标
  setStaticPos: function setStaticPos(node) {
    var nodePos = this.betCoinAct(node);
    this.node.setPosition(nodePos);
  },
  betCoinAct: function betCoinAct(node) {
    var name = node.name;
    var node_y = null;
    var node_x = null;
    if (name == "node_horse_1") {
      // 1
      node_x = this.betPosArr[1].x + Math.ceil(Math.random() * 140);
      node_y = this.betPosArr[1].y + Math.ceil(Math.random() * 30);
    } else if (name == "node_horse_2") {
      // 2
      node_x = this.betPosArr[2].x + Math.ceil(Math.random() * 140);
      node_y = this.betPosArr[2].y + Math.ceil(Math.random() * 30);
    } else if (name == "node_horse_3") {
      // 3
      node_x = this.betPosArr[3].x + Math.ceil(Math.random() * 140);
      node_y = this.betPosArr[3].y + Math.ceil(Math.random() * 30);
    } else if (name == "node_horse_4") {
      // 4
      node_x = this.betPosArr[4].x + Math.ceil(Math.random() * 140);
      node_y = this.betPosArr[4].y + Math.ceil(Math.random() * 30);
    } else if (name == "node_horse_5") {
      // 5
      node_x = this.betPosArr[5].x + Math.ceil(Math.random() * 140);
      node_y = this.betPosArr[5].y + Math.ceil(Math.random() * 30);
    } else if (name == "node_horse_6") {
      // 6
      node_x = this.betPosArr[6].x + Math.ceil(Math.random() * 140);
      node_y = this.betPosArr[6].y + Math.ceil(Math.random() * 30);
    }
    return cc.v2(node_x, node_y);
  },
  start: function start() {} // update (dt) {},
});

cc._RF.pop();