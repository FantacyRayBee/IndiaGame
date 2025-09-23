"use strict";
cc._RF.push(module, '6cfdbNpzyNBQIb8FYBP8EsO', 'teenPattiRechargeCtrl');
// teenPatti/src/teenPattiRechargeCtrl.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    lab_cash: cc.Label,
    lab_extraCash: cc.Label,
    lab_bonus: cc.Label,
    lab_total: cc.Label,
    lab_amount: cc.Label,
    lab_timeTip: cc.Label,
    btn_close: cc.Button,
    btn_addCash: cc.Button
  },
  ctor: function ctor() {
    this.rechargeData = {};
  },
  onLoad: function onLoad() {
    this.btn_close.node.on('click', CommonFun.getInstance().debounce(this.btnClickCall, 1), this);
    this.btn_addCash.node.on('click', CommonFun.getInstance().debounce(this.btnClickCall, 1), this);
  },
  onDestroy: function onDestroy() {
    this.clearChongZhiActTimer();
  },
  btnClickCall: function btnClickCall(btn) {
    GlobalCfg.G_COMPONENTS.Audio.playButton();
    var btnName = btn.node.name;
    switch (btnName) {
      case this.btn_close.node.name:
        this.node.destroy();
        break;
      case this.btn_addCash.node.name:
        this.dealBtnAddCashEvent();
        break;
      default:
        break;
    }
  },
  setTeenPattiRechargeData: function setTeenPattiRechargeData(data) {
    this.rechargeData = data;
    var id = data.id; // 商品ID(支付接口用)
    var amount = data.amount; // 金额
    var add = data.add; // 额外赠送-dep
    var bonus = data.bonus; // 额外赠送-bonus

    this.lab_cash.string = "$" + amount / 100;
    this.lab_extraCash.string = "$" + add / 100;
    this.lab_bonus.string = "$" + bonus / 100;
    this.lab_total.string = "$" + (amount + add + bonus) / 100;
    this.lab_amount.string = "$" + amount / 100;
  },
  setTeenPattiRechargeTime: function setTeenPattiRechargeTime(time) {
    var _this = this;
    var actTime = time - Math.floor(new Date().getTime() / 1000);
    this.lab_timeTip.string = "You Have " + actTime + "s to Recharge";
    actTime -= 1;
    var actTimerCall = function actTimerCall() {
      if (_this && _this.lab_timeTip) {
        if (actTime < 0) {
          _this.clearChongZhiActTimer();
          _this.lab_timeTip.string = "You Have 0s to Recharge";
          return;
        }
        ;
        _this.lab_timeTip.string = "You Have " + actTime + "s to Recharge";
        actTime -= 1;
      }
      ;
    };
    this.actTimer = setInterval(actTimerCall, 1000);
  },
  dealBtnAddCashEvent: function dealBtnAddCashEvent() {
    var _this2 = this;
    CommonFun.getInstance().rechargeByCommodityId(this.rechargeData.id, "TP\u5C40\u5185" + (this.rechargeData.plot ? "-剧情" : ""), function () {
      _this2.node.destroy();
    });
  },
  clearChongZhiActTimer: function clearChongZhiActTimer() {
    if (this.actTimer) {
      clearInterval(this.actTimer);
      this.actTimer = null;
    }
    ;
  }
});

cc._RF.pop();