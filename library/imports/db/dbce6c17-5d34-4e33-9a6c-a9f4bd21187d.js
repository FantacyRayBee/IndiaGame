"use strict";
cc._RF.push(module, 'dbce6wXXTROM5psqfS9IRh9', 'WithDrawErrorTipsCtrl');
// ResourcesBundle/NewPlan/WithDrawErrorTips/WithDrawErrorTipsCtrl.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    labMsg: cc.Label,
    btnOk: cc.Button
  },
  ctor: function ctor() {
    this.orderId = '';
  },
  onLoad: function onLoad() {
    var _this = this;

    this.btnOk.node.on('click', function () {
      _this.node.destroy();
    }, this);
  },
  start: function start() {},

  /**
   * 
   * @param {String} orderId 订单ID
   * @param {Int} orderAmount 金额
   * @param {Int} time 时间戳
   * @param {String} msg 错误消息
   */
  setErrData: function setErrData(orderId, orderAmount, time, msg) {
    if (orderId == this.orderId) {
      LoggerUtil.getInstance().warn("\u8BA2\u5355" + orderId + "\u91CD\u590D\u63A8\u9001\uFF01");
    } else {
      this.orderId = orderId;
      this.labMsg.string = "\n" + "Order Amount: " + Number(orderAmount / 100) + "\n\n" + "Withdrawal Time: " + time + "\n\n" + "Error Message: " + msg + "\n\n" + "Your withdrawal order has failed." + "\n" + "Please check if your withdrawal information is correct.";
    }
  } // update (dt) {},

});

cc._RF.pop();