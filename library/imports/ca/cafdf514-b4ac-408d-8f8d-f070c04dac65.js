"use strict";
cc._RF.push(module, 'cafdfUUtKxAjY+N8HDATaxl', 'VipForOnceToastCtrl');
// ResourcesBundle/NewPlan/MyVip/VipForOnceToastCtrl.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    btn_close: cc.Button,
    btn_tips: cc.Button,
    btn_pay: cc.Button,
    lab_upgradeBagAmount: cc.Label,
    lab_upgradeBagGift: cc.Label,
    lab_upgradeBagBtnAmount: cc.Label
  },
  onLoad: function onLoad() {
    this.setLabs();
    this.btn_close.node.on("click", CommonFun.getInstance().debounce(this.btnClick, 1), this);
    this.btn_tips.node.on("click", CommonFun.getInstance().debounce(this.btnClick, 1), this);
    this.btn_pay.node.on("click", CommonFun.getInstance().debounce(this.btnClick, 1), this);
    this.btn_pay.node.runAction(cc.repeatForever(cc.sequence(cc.scaleTo(.5, .8), cc.scaleTo(.5, 1))));
  },
  setLabs: function setLabs() {
    this.lab_upgradeBagAmount.string = "\u20B9" + GlobalCfg.USER_DATAS.userVip.upgrade_bag_amount / 100;
    this.lab_upgradeBagGift.string = "\u20B9" + (GlobalCfg.USER_DATAS.userVip.upgrade_bag_dgift + GlobalCfg.USER_DATAS.userVip.upgrade_bag_amount) / 100;
    this.lab_upgradeBagBtnAmount.string = "" + GlobalCfg.USER_DATAS.userVip.upgrade_bag_amount / 100;
  },
  btnClick: function btnClick(btn) {
    var btnName = btn.node.name;

    switch (btnName) {
      case "btn_close":
        GlobalCfg.G_COMPONENTS.Audio.playBack();
        this.node.destroy();
        return;

      case "btn_tips":
        this.dealBtnTipsEvent();
        break;

      case "btn_pay":
        this.dealBtnPayEvent();
        break;

      default:
        break;
    }

    GlobalCfg.G_COMPONENTS.Audio.playButton();
  },
  dealBtnTipsEvent: function dealBtnTipsEvent() {
    CommonFun.getInstance().showVipRules("levelUpGift");
    this.node.destroy();
  },
  dealBtnPayEvent: function dealBtnPayEvent() {
    var _this = this;

    SHOPPING.from = GlobalCfg.SHOP_RECHARGE_FROM.VipOnceToast;
    ;

    var _cb = function _cb() {
      if (CommonFun.getInstance().isValidForScr(_this)) {
        _this.node.destroy();
      }

      ;
    };

    var rechargeNeedInfo = CommonFun.getInstance().getAppConfigValueByKey('Recharge_Need_Info', false);

    if (rechargeNeedInfo) {
      if (GlobalCfg.USER_DATAS.phone.length > 0 && GlobalCfg.USER_DATAS.mail.length > 0) {
        CommonFun.getInstance().rechargeByCommodityId(GlobalCfg.USER_DATAS.userVip.upgrade_bag_id, SHOPPING.from, _cb);
      } else {
        CommonFun.getInstance().showBindPhone('AddCash');
      }

      ;
    } else {
      CommonFun.getInstance().rechargeByCommodityId(GlobalCfg.USER_DATAS.userVip.upgrade_bag_id, SHOPPING.from, _cb);
    }

    ;
  },
  onDestroy: function onDestroy() {
    CommonFun.getInstance().releasePrefab(GlobalCfg.PREFAB_PATH.VIPFORONCETOAST);
  }
});

cc._RF.pop();