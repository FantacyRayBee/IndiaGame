"use strict";
cc._RF.push(module, 'a1214IA0PdP85LfD4XsXE0w', 'betCoinCtrl');
// lhdGame/lhdScr/betCoinCtrl.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {},
  onLoad: function onLoad() {},
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
    if (name == "node_dragonChip") {
      // 龙
      var Y = Math.ceil(Math.random() * 130) * -1;
      var Y1 = Math.ceil(Math.random() * 45);
      node_y = Math.random() < 0.5 ? Y : Y1;
      node_x = Math.ceil(Math.random() * 205 + 195) * -1;
    } else if (name == "node_tigerChip") {
      // 老虎
      var _Y = Math.ceil(Math.random() * 130) * -1;
      var _Y2 = Math.ceil(Math.random() * 45);
      node_y = Math.random() < 0.5 ? _Y : _Y2;
      node_x = Math.ceil(Math.random() * 205 + 195);
    } else if (name == "node_tieChip") {
      // 和
      var _Y3 = Math.ceil(Math.random() * 130) * -1;
      var _Y4 = Math.ceil(Math.random() * 45);
      var X = Math.ceil(Math.random() * 100) * -1;
      var X1 = Math.ceil(Math.random() * 100);
      node_y = Math.random() < 0.5 ? _Y3 : _Y4;
      node_x = Math.random() < 0.5 ? X : X1;
    }
    return cc.v2(node_x, node_y);
  },
  start: function start() {} // update (dt) {},
});

cc._RF.pop();