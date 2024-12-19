"use strict";
cc._RF.push(module, 'e3555utlDREbbGN9Q4TNQLD', 'GameStartMaskCtrl');
// ResourcesBundle/NewPlan/GameStartMask/GameStartMaskCtrl.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {},
  onLoad: function onLoad() {
    var _this = this;
    cc.tween(this.node).to(2, {
      opacity: 0
    }).call(function () {
      _this.node.destroy();
    }).start();
  },
  onDestroy: function onDestroy() {
    CommonFun.getInstance().releasePrefab(GlobalCfg.PREFAB_PATH.GAMESTARTMASK);
  }
});

cc._RF.pop();