"use strict";
cc._RF.push(module, '9297ftBPCxANZDpUtiHKYLN', 'ScatterCoinCtrl');
// ResourcesBundle/NewPlan/ScatterCoin/ScatterCoinCtrl.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    ske_saJinBi: sp.Skeleton
  },
  onLoad: function onLoad() {
    var _this = this;

    this.ske_saJinBi.node.active = true;
    GlobalCfg.G_COMPONENTS.Audio.playSoundByNameInResources("sajinbi", false);
    this.ske_saJinBi.setAnimation(0, 'sajinbi', false);
    this.ske_saJinBi.setCompleteListener(function (trackEntry, loopCount) {
      var name = trackEntry.animation.name;

      if (name == "sajinbi") {
        _this.node.destroy();
      }

      ;
    });
  },
  onDestroy: function onDestroy() {
    CommonFun.getInstance().releasePrefab(GlobalCfg.PREFAB_PATH.SCATTERCOIN);
  }
});

cc._RF.pop();