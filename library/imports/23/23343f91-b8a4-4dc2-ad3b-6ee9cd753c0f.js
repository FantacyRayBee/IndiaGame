"use strict";
cc._RF.push(module, '23343+RuKRNwq07bunNdTwP', 'VipRewardToastCtrl');
// ResourcesBundle/NewPlan/MyVip/VipRewardToastCtrl.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    btn_close: cc.Button,
    lab_tips: cc.Label,
    spine_reward: sp.Skeleton
  },
  onLoad: function onLoad() {
    var _this = this;
    this.btn_close.node.on("click", function () {
      GlobalCfg.G_COMPONENTS.Audio.playButton();
      _this.node.destroy();
    }, this);
  },
  setVipRewardToastAmount: function setVipRewardToastAmount(amount, isBonus) {
    GlobalCfg.G_COMPONENTS.Audio.playSoundByNameInResources("sajinbi", false);
    this.lab_tips.string = "$" + amount;
    this.spine_reward.setAnimation(0, isBonus ? "animation2" : "animation", true);
  }
});

cc._RF.pop();