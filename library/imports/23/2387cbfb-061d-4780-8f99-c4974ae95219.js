"use strict";
cc._RF.push(module, '2387cv7Bh1HgI+ZxJdK6VIZ', 'VipUpgradeToastCtrl');
// ResourcesBundle/NewPlan/MyVip/VipUpgradeToastCtrl.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    btn_close: cc.Button,
    btn_goUpgrade: cc.Button
  },
  onLoad: function onLoad() {
    this.btn_close.node.on("click", CommonFun.getInstance().debounce(this.btnClick, 1), this);
    this.btn_goUpgrade.node.on("click", CommonFun.getInstance().debounce(this.btnClick, 1), this);
  },
  btnClick: function btnClick(btn) {
    var btnName = btn.node.name;
    switch (btnName) {
      case "btn_close":
        GlobalCfg.G_COMPONENTS.Audio.playBack();
        this.dealBtnCloseEvent();
        break;
      case "btn_goUpgrade":
        GlobalCfg.G_COMPONENTS.Audio.playButton();
        this.dealBtnGoUpgradeEvent();
        break;
      default:
        break;
    }
  },
  dealBtnCloseEvent: function dealBtnCloseEvent() {
    this.node.destroy();
  },
  dealBtnGoUpgradeEvent: function dealBtnGoUpgradeEvent() {
    CommonFun.getInstance().showMyVip();
    this.node.destroy();
  },
  onDestroy: function onDestroy() {
    CommonFun.getInstance().releasePrefab(GlobalCfg.PREFAB_PATH.VIPUPGRADETOAST);
  }
});

cc._RF.pop();