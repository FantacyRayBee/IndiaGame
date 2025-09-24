"use strict";
cc._RF.push(module, '6b1763GN1tMzJbaffDE2hit', 'BonusTransferRule');
// ResourcesBundle/NewPlan/BonusTransfer/BonusTransferRule.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    btn_close: cc.Button,
    lab: cc.Label
  },
  // LIFE-CYCLE CALLBACKS:
  // onLoad () {},
  start: function start() {
    var _this = this;

    this.btn_close.node.on('click', function () {
      GlobalCfg.G_COMPONENTS.Audio.playBack();

      _this.node.destroy();
    });
  },
  setContent: function setContent(str) {
    this.lab.string = str;
  } // update (dt) {},

});

cc._RF.pop();