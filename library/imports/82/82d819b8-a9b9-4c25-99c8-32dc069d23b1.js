"use strict";
cc._RF.push(module, '82d81m4qblMJZnIMtwGnSOx', 'ReliefCtrl');
// ResourcesBundle/NewPlan/Relief/ReliefCtrl.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    lab_amount: cc.Label,
    btn_get: cc.Button
  },
  onLoad: function onLoad() {
    this.lab_amount.string = "\u20B9" + GlobalCfg.USER_DATAS.reliefGiftDiamond / 100;
    this.btn_get.node.on("click", CommonFun.getInstance().debounce(this.btnClick, 1), this);
  },
  btnClick: function btnClick(btn) {
    GlobalCfg.G_COMPONENTS.Audio.playButton();
    CommonFun.getInstance().showRewardsTips([{
      id: 10,
      amount: GlobalCfg.USER_DATAS.reliefGiftDiamond / 100
    }]);
    GlobalCfg.USER_DATAS.userDiamond += GlobalCfg.USER_DATAS.reliefGiftDiamond;
    GlobalCfg.USER_DATAS.reliefGiftDiamond = 0;
    ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, {
      msgCode: GlobalCfg.CLIENT_MSG_ID.GET_RELIEF_REWARD,
      msgData: {}
    });
    this.node.destroy();
  },
  onDestroy: function onDestroy() {
    CommonFun.getInstance().releasePrefab(GlobalCfg.PREFAB_PATH.RELIEF);
  }
});

cc._RF.pop();