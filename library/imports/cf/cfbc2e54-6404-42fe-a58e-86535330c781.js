"use strict";
cc._RF.push(module, 'cfbc25UZARC/qWOhlNTMMeB', 'BonusCardRuleCtrl');
// ResourcesBundle/NewPlan/DailyBonusCard/BonusCardRuleCtrl.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    btn_close: cc.Button
  },
  // LIFE-CYCLE CALLBACKS:
  // onLoad () {},
  start: function start() {
    var _this = this;
    this.btn_close.node.on('click', function () {
      GlobalCfg.G_COMPONENTS.Audio.playBack();
      _this.node.destroy();
    });
  } // update (dt) {},
});

cc._RF.pop();