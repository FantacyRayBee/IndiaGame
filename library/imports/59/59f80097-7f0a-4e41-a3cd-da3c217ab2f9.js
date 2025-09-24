"use strict";
cc._RF.push(module, '59f80CXfwpOQaPN2jwherL5', 'VipRechargeToastCtrl');
// ResourcesBundle/NewPlan/MyVip/VipRechargeToastCtrl.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    btn_close: cc.Button,
    btn_addCash: cc.Button,
    btn_otherAmount: cc.Button,
    lab_addCashTips: cc.Label
  },
  onLoad: function onLoad() {
    this.btn_close.node.on("click", CommonFun.getInstance().debounce(this.btnClick, 1), this);
    this.btn_addCash.node.on("click", CommonFun.getInstance().debounce(this.btnClick, 1), this);
    this.btn_otherAmount.node.on("click", CommonFun.getInstance().debounce(this.btnClick, 1), this);
    this.lab_addCashTips.string = "Add cash any amount now to become a VlP player.";
  },
  btnClick: function btnClick(btn) {
    var btnName = btn.node.name;

    switch (btnName) {
      case "btn_close":
        GlobalCfg.G_COMPONENTS.Audio.playBack();
        this.dealBtnCloseEvent();
        break;

      case "btn_addCash":
        GlobalCfg.G_COMPONENTS.Audio.playButton();
        this.dealBtnAddCashEvent();
        break;

      case "btn_otherAmount":
        GlobalCfg.G_COMPONENTS.Audio.playButton();
        this.dealBtnOtherAmountEvent();
        break;

      default:
        break;
    }
  },
  dealBtnCloseEvent: function dealBtnCloseEvent() {
    this.node.destroy();
  },
  dealBtnAddCashEvent: function dealBtnAddCashEvent() {
    var _this = this;

    var _cb = function _cb() {
      _this.node.destroy();
    };

    var commoditys = [].concat(GlobalCfg.USER_DATAS.store);
    var commodityId = commoditys[0].id;
    var rechargeNeedInfo = CommonFun.getInstance().getAppConfigValueByKey('Recharge_Need_Info', false);

    if (rechargeNeedInfo) {
      if (GlobalCfg.USER_DATAS.phone.length > 0 && GlobalCfg.USER_DATAS.mail.length > 0) {
        // CommonFun.getInstance().rechargeByCommodityId(commodityId, GlobalCfg.SHOP_RECHARGE_FROM.VipRechargeToast, _cb);
        CommonFun.getInstance().showNewShop(true, GlobalCfg.SHOP_RECHARGE_FROM.VipRechargeToast);
      } else {
        CommonFun.getInstance().showFirstRecharge();
        this.node.destroy();
      }

      ;
    } else {
      CommonFun.getInstance().rechargeByCommodityId(commodityId, GlobalCfg.SHOP_RECHARGE_FROM.VipRechargeToast, _cb);
    }

    ;
  },
  dealBtnOtherAmountEvent: function dealBtnOtherAmountEvent() {
    var rechargeNeedInfo = CommonFun.getInstance().getAppConfigValueByKey('Recharge_Need_Info', false);

    if (rechargeNeedInfo) {
      if (GlobalCfg.USER_DATAS.phone.length > 0 && GlobalCfg.USER_DATAS.mail.length > 0) {
        CommonFun.getInstance().showNewShop(true, GlobalCfg.SHOP_RECHARGE_FROM.VipRechargeToast);
      } else {
        CommonFun.getInstance().showBindPhone('AddCash');
        this.node.destroy();
      }

      ;
    } else {
      CommonFun.getInstance().showNewShop(true, GlobalCfg.SHOP_RECHARGE_FROM.VipRechargeToast);
    }

    ;
  },
  onDestroy: function onDestroy() {
    CommonFun.getInstance().releasePrefab(GlobalCfg.PREFAB_PATH.VIPRECHARGETOAST);
  }
});

cc._RF.pop();