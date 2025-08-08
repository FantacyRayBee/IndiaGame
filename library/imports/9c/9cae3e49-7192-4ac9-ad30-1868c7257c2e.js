"use strict";
cc._RF.push(module, '9cae35JcZJKya0wGGjHJXwu', 'AdvancedModeCtrl');
// ResourcesBundle/NewPlan/AdvancedMode/AdvancedModeCtrl.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    btnOK: cc.Button,
    node_ResetWallet: cc.Node,
    node_ToBonus: cc.Node
  },
  // LIFE-CYCLE CALLBACKS:
  onLoad: function onLoad() {
    var _this = this;
    // this.node_ResetWallet.active = GlobalCfg.FIRST_RECHARGE_RETAIN_BONUS > 0 ? false : true;
    // this.node_ToBonus.active = GlobalCfg.FIRST_RECHARGE_RETAIN_BONUS > 0 ? true : false;
    this.btnOK.node.on('click', function () {
      GlobalCfg.G_COMPONENTS.Audio.playButton();
      _this.node.destroy();
    }, this);
  },
  start: function start() {},
  onDestroy: function onDestroy() {
    this.unschedule(this.scheduleCallback);
    CommonFun.getInstance().releasePrefab(GlobalCfg.PREFAB_PATH.ADVANCEDMODE);
    CommonFun.getInstance().releasePrefab(GlobalCfg.PREFAB_PATH.ADVANCEDMODE_V);
    if (GlobalCfg.FIRST_RECHARGE_TIPS_SHOW_10) {
      var changed = GlobalCfg.USER_DATAS.changed % 100000000 / 100; // 变化值
      var coin = GlobalCfg.USER_DATAS.deposit / 100; //本次充值获得的金币
      var remind = GlobalCfg.USER_DATAS.beforeRecharge / 100 - changed;
      var getBouns = GlobalCfg.USER_DATAS.firstGetBonus / 100; //本次充值获得的代金券
      CommonFun.getInstance()._showShopNewTip(GlobalCfg.USER_DATAS.beforeRecharge / 100, coin, getBouns, true, remind); //显示首充转换界面
    } else {
      var _changed = GlobalCfg.USER_DATAS.changed / 100; // 变化值
      var _coin = GlobalCfg.USER_DATAS.deposit / 100; //本次充值获得的金币
      var _getBouns = GlobalCfg.USER_DATAS.firstGetBonus / 100 + _changed; //本次充值获得的代金券
      CommonFun.getInstance()._showShopNewTip(_changed, _coin, _getBouns, false, 0); //显示首充转换界面
    }
  },
  show: function show(bool) {
    var _this2 = this;
    GlobalCfg.FIRST_RECHARGE_TIPS_SHOW = false;
    if (bool == true) {
      this.btnOK.target.getChildByName('Label').getComponent(cc.Label).string = "Okay";
      this.btnOK.interactable = true;
      return;
    }
    this.btnOK.interactable = false;
    var count = 5,
      time = 5;
    var lab = this.btnOK.target.getChildByName('Label').getComponent(cc.Label);
    this.scheduleCallback = function () {
      time--;
      lab.string = "Okay(" + time + ")";
      if (time == 0) {
        _this2.btnOK.interactable = true;
      }
    };
    this.schedule(this.scheduleCallback, 1, count - 1);
  } // update (dt) {},
});

cc._RF.pop();