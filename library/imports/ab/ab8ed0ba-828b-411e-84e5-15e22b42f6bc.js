"use strict";
cc._RF.push(module, 'ab8edC6gotBHoTlFeIrQva8', 'HallTipCtrl');
// ResourcesBundle/NewPlan/HallTip/HallTipCtrl.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    btn_go: cc.Button
  },
  onLoad: function onLoad() {
    this.btn_go.node.on('click', this.bntclick, this);
  },
  onDestroy: function onDestroy() {
    CommonFun.getInstance().releasePrefab(GlobalCfg.PREFAB_PATH.HALLTIP);
  },
  bntclick: function bntclick(button) {
    GlobalCfg.G_COMPONENTS.Audio.playBack();
    //跳转URL
    cc.sys.openURL(GlobalCfg.Forced_Migration);
  }
});

cc._RF.pop();