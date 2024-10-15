"use strict";
cc._RF.push(module, '6b1b7nRlWBPO74ENLxBW6FW', 'zeusBuyFreeTipsCtrl');
// zeusGame/src/zeusBuyFreeTipsCtrl.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    lab_freePrice: cc.Label,
    btn_no: cc.Button,
    btn_yes: cc.Button
  },
  onLoad: function onLoad() {
    this.btn_no.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
    this.btn_yes.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
  },
  btnClick: function btnClick(btn) {
    var btnName = btn.node.name;

    switch (btnName) {
      case this.btn_no.node.name:
        this.dealBtnNoAndYesEvent(false);
        break;

      case this.btn_yes.node.name:
        this.dealBtnNoAndYesEvent(true);
        break;

      default:
        break;
    }
  },
  setBuyFreeTipsData: function setBuyFreeTipsData(bet) {
    this.bet = bet;
    this.lab_freePrice.string = "$" + this.bet * 100 / 100;
  },
  dealBtnNoAndYesEvent: function dealBtnNoAndYesEvent(isAgree) {
    ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, {
      msgCode: GlobalCfg.CLIENT_MSG_ID.ZEUS_SEND_BUY_FREE_REQ,
      msgData: {
        bet: this.bet,
        isAgree: isAgree
      }
    });
    this.node.destroy();
  }
});

cc._RF.pop();