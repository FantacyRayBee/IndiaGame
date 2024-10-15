"use strict";
cc._RF.push(module, '698fe0ogclP+Kxc2a0qgRY/', 'ActivityGetBonusCtrl');
// ResourcesBundle/NewPlan/Activity/ActivityGetBonusCtrl.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    btn_addCash1: cc.Button,
    btn_addCash2: cc.Button,
    btn_otherAmount: cc.Button,
    lab_cash1: cc.Label,
    lab_cash2: cc.Label,
    lab_bonus1: cc.Label,
    lab_bonus2: cc.Label,
    lab_totalGet1: cc.Label,
    lab_totalGet2: cc.Label,
    lab_addCash1: cc.Label,
    lab_addCash2: cc.Label,
    lab_percent1: cc.Label,
    lab_percent2: cc.Label
  },
  onLoad: function onLoad() {
    this.btn_addCash1.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
    this.btn_addCash2.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
    this.btn_otherAmount.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
    this.lab_cash1.string = "";
    this.lab_cash2.string = "";
    this.lab_bonus1.string = "";
    this.lab_bonus2.string = "";
    this.lab_totalGet1.string = "";
    this.lab_totalGet2.string = "";
    this.lab_addCash1.string = "";
    this.lab_addCash2.string = "";
    this.lab_percent1.string = "";
    this.lab_percent2.string = "";
  },
  start: function start() {
    var commodity = GlobalCfg.USER_DATAS.first_pay_product.sort(function (a, b) {
      return a.amount - b.amount;
    });

    if (CommonFun.getInstance().isValidForScr(this)) {
      for (var i = 0; i < 2; i++) {
        var data = commodity[i];
        var price = Math.floor(Number(data.amount) / 100);
        var bonus = Math.floor(Number(data.gift) / 100);
        var total = price + bonus;
        var point = bonus / price;
        var percent = (point * 100).toFixed(0);

        if (i == 0) {
          this.firstCommodityId = data.id;
          this.lab_cash1.string = "\u20B9" + price;
          this.lab_addCash1.string = "\u20B9" + price;
          this.lab_bonus1.string = "\u20B9" + bonus;
          this.lab_totalGet1.string = "\u20B9" + total;
          this.lab_percent1.string = "" + percent;
        } else if (i == 1) {
          this.secondCommodityId = data.id;
          this.lab_cash2.string = "\u20B9" + price;
          this.lab_addCash2.string = "\u20B9" + price;
          this.lab_bonus2.string = "\u20B9" + bonus;
          this.lab_totalGet2.string = "\u20B9" + total;
          this.lab_percent2.string = "" + percent;
        }

        ;
      }

      ;
    }

    ;
  },
  btnClick: function btnClick(btn) {
    var btnName = btn.node.name;
    var rechargeNeedInfo = CommonFun.getInstance().getAppConfigValueByKey('Recharge_Need_Info', false);
    GlobalCfg.G_COMPONENTS.Audio.playButton();

    switch (btnName) {
      case "btn_addCash1":
        if (rechargeNeedInfo) {
          if (GlobalCfg.USER_DATAS.phone.length > 0 && GlobalCfg.USER_DATAS.mail.length > 0) {
            CommonFun.getInstance().rechargeByCommodityId(this.firstCommodityId, GlobalCfg.SHOP_RECHARGE_FROM.ActivityFirstRecharge);
          } else {
            CommonFun.getInstance().showBindPhone('AddCash');
            SHOPPING.cashID = this.firstCommodityId;
          }

          ;
        } else {
          CommonFun.getInstance().rechargeByCommodityId(this.firstCommodityId, GlobalCfg.SHOP_RECHARGE_FROM.ActivityFirstRecharge);
        }

        ;
        break;

      case "btn_addCash2":
        if (rechargeNeedInfo) {
          if (GlobalCfg.USER_DATAS.phone.length > 0 && GlobalCfg.USER_DATAS.mail.length > 0) {
            CommonFun.getInstance().rechargeByCommodityId(this.secondCommodityId, GlobalCfg.SHOP_RECHARGE_FROM.ActivityFirstRecharge, function () {});
          } else {
            CommonFun.getInstance().showBindPhone('AddCash');
            SHOPPING.cashID = this.secondCommodityId;
          }

          ;
        } else {
          CommonFun.getInstance().rechargeByCommodityId(this.secondCommodityId, GlobalCfg.SHOP_RECHARGE_FROM.ActivityFirstRecharge, function () {});
        }

        ;
        break;

      case "btn_otherAmount":
        if (rechargeNeedInfo) {
          if (GlobalCfg.USER_DATAS.phone.length > 0 && GlobalCfg.USER_DATAS.mail.length > 0) {
            CommonFun.getInstance().showNewShop(true, GlobalCfg.SHOP_RECHARGE_FROM.ActivityFirstRecharge);
          } else {
            CommonFun.getInstance().showBindPhone('AddCash');
          }

          ;
        } else {
          CommonFun.getInstance().showNewShop(true, GlobalCfg.SHOP_RECHARGE_FROM.ActivityFirstRecharge);
        }

        ;
        break;

      default:
        break;
    }

    ;
    ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, {
      msgCode: GlobalCfg.CLIENT_MSG_ID.ACTIVITY_CLOSE_VIEW,
      msgData: {}
    });
  },
  compare: function compare(property) {
    return function (a, b) {
      var value1 = a[property];
      var value2 = b[property];
      return value1 - value2;
    };
  }
});

cc._RF.pop();