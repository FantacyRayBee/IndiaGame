"use strict";
cc._RF.push(module, 'e9180k1gxFIcJxbogG9M5EW', 'FirstRechargeCtrl');
// ResourcesBundle/NewPlan/FirstRecharge/FirstRechargeCtrl.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    lab_item0Percent: cc.Label,
    lab_item0Cash: cc.Label,
    lab_item0Bonus: cc.Label,
    lab_item0TotalGet: cc.Label,
    lab_item0Btn: cc.Label,
    lab_item1Percent: cc.Label,
    lab_item1Cash: cc.Label,
    lab_item1Bonus: cc.Label,
    lab_item1TotalGet: cc.Label,
    lab_item1Btn: cc.Label,
    btn_item0: cc.Button,
    btn_item1: cc.Button,
    btn_close: cc.Button,
    btn_otherAmount: cc.Button
  },
  onLoad: function onLoad() {
    /**
     * 
        type PaymentProduct struct {
            Id     int32 json:"id"     // 商品ID(支付接口用)
            Amount int64 json:"amount" // 金额
            Gift   int64 json:"gift"   // 额外赠送-dep/bonus
        }
     */
    var commodity = GlobalCfg.USER_DATAS.first_pay_product.sort(function (a, b) {
      return a.amount - b.amount;
    });

    for (var i = 0; i < 2; i++) {
      var data = commodity[i];

      if (data) {
        var price = Math.floor(Number(data.amount) / 100);
        var bonus = Math.floor(Number(data.gift) / 100);

        if (i == 0) {
          this.firstCommodityId = data.id;
          this.lab_item0Cash.string = price;
          this.lab_item0Bonus.string = bonus;
          var total = price + bonus;
          this.lab_item0TotalGet.string = "₹" + total;
          var point = bonus / price;
          var percent = (point * 100).toFixed(0);
          this.lab_item0Percent.string = percent;
          this.lab_item0Btn.string = "₹" + price;
        } else if (i == 1) {
          this.secondCommodityId = data.id;
          this.lab_item1Cash.string = price;
          this.lab_item1Bonus.string = bonus;

          var _total = price + bonus;

          this.lab_item1TotalGet.string = "₹" + _total;

          var _point = bonus / price;

          var _percent = (_point * 100).toFixed(0);

          this.lab_item1Percent.string = _percent;
          this.lab_item1Btn.string = "₹" + price;
        }

        ;
      }

      ;
    }

    ;
    this.btn_item0.node.on("click", CommonFun.getInstance().debounce(this.btnClick, 1), this);
    this.btn_item1.node.on("click", CommonFun.getInstance().debounce(this.btnClick, 1), this);
    this.btn_close.node.on("click", CommonFun.getInstance().debounce(this.btnClick, 1), this);
    this.btn_otherAmount.node.on("click", CommonFun.getInstance().debounce(this.btnClick, 1), this);
  },
  btnClick: function btnClick(btn) {
    var _this = this;

    var btnName = btn.node.name;
    var rechargeNeedInfo = CommonFun.getInstance().getAppConfigValueByKey('Recharge_Need_Info', false);

    switch (btnName) {
      case "btn_close":
        GlobalCfg.G_COMPONENTS.Audio.playBack();
        this.node.destroy();
        return;

      case "btn_item0":
        if (rechargeNeedInfo) {
          if (GlobalCfg.USER_DATAS.phone.length > 0 && GlobalCfg.USER_DATAS.mail.length > 0) {
            // CommonFun.getInstance().showNewShop(true, GlobalCfg.SHOP_RECHARGE_FROM.firstRechargeOtherAmount);
            CommonFun.getInstance().rechargeByCommodityId(this.firstCommodityId, GlobalCfg.SHOP_RECHARGE_FROM.firstRecharge, function () {
              _this.node.destroy();
            });
          } else {
            CommonFun.getInstance().showBindPhone('AddCash');
            SHOPPING.cashID = this.firstCommodityId;
            this.node.destroy();
          }

          ;
        } else {
          CommonFun.getInstance().rechargeByCommodityId(this.firstCommodityId, GlobalCfg.SHOP_RECHARGE_FROM.firstRecharge, function () {
            _this.node.destroy();
          });
        }

        ;
        break;

      case "btn_item1":
        if (rechargeNeedInfo) {
          if (GlobalCfg.USER_DATAS.phone.length > 0 && GlobalCfg.USER_DATAS.mail.length > 0) {
            // CommonFun.getInstance().showNewShop(true, GlobalCfg.SHOP_RECHARGE_FROM.firstRechargeOtherAmount);
            CommonFun.getInstance().rechargeByCommodityId(this.secondCommodityId, GlobalCfg.SHOP_RECHARGE_FROM.firstRecharge, function () {
              _this.node.destroy();
            });
          } else {
            CommonFun.getInstance().showBindPhone('AddCash');
            SHOPPING.cashID = this.secondCommodityId;
            this.node.destroy();
          }

          ;
        } else {
          CommonFun.getInstance().rechargeByCommodityId(this.secondCommodityId, GlobalCfg.SHOP_RECHARGE_FROM.firstRecharge, function () {
            _this.node.destroy();
          });
        }

        ;
        break;

      case "btn_otherAmount":
        if (rechargeNeedInfo) {
          if (GlobalCfg.USER_DATAS.phone.length > 0 && GlobalCfg.USER_DATAS.mail.length > 0) {
            CommonFun.getInstance().showNewShop(true, GlobalCfg.SHOP_RECHARGE_FROM.firstRechargeOtherAmount);
            this.node.destroy();
          } else {
            CommonFun.getInstance().showBindPhone('AddCash');
            this.node.destroy();
          }

          ;
        } else {
          CommonFun.getInstance().showNewShop(true, GlobalCfg.SHOP_RECHARGE_FROM.firstRechargeOtherAmount);
          this.node.destroy();
        }

        ;
        break;

      default:
        break;
    }

    GlobalCfg.G_COMPONENTS.Audio.playButton();
  },
  onDestroy: function onDestroy() {
    CommonFun.getInstance().releasePrefab(GlobalCfg.PREFAB_PATH.FIRSTRECHARGE);
    CommonFun.getInstance().releasePrefab(GlobalCfg.PREFAB_PATH.FIRSTRECHARGE_V);
  }
});

cc._RF.pop();