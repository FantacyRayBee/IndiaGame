"use strict";
cc._RF.push(module, 'ab8edC6gotBHoTlFeIrQva8', 'HallTipCtrl');
// ResourcesBundle/NewPlan/HallTip/HallTipCtrl.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    btn_go: cc.Button,
    txt_content: cc.Label
  },
  onLoad: function onLoad() {
    this.btn_go.node.on('click', this.bntclick, this);
  },
  onDestroy: function onDestroy() {
    CommonFun.getInstance().releasePrefab(GlobalCfg.PREFAB_PATH.HALLTIP);
  },
  setHallTipData: function setHallTipData(data) {
    this.data = data;
    var txtstring = "New adress：'" + data.url + "' \n Due to server upgrade, a new installation package needs to be downloaded. Please go to 'tmaxter. in' to download the new installation package.";
    this.txt_content.string = txtstring;
  },
  bntclick: function bntclick(button) {
    GlobalCfg.G_COMPONENTS.Audio.playBack();
    //跳转URL
    cc.sys.openURL(this.data.url);
  }
});

cc._RF.pop();