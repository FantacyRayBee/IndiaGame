"use strict";
cc._RF.push(module, '3ecfbWvgPxKfr2wghRrsyxV', 'TransactionRecordItemCtrl');
// ResourcesBundle/NewPlan/TransactionRecord/TransactionRecordItemCtrl.js

"use strict";

var EnumRecord = cc.Enum({
  RECHARGE: 0,
  WITHDRAW: 1
});
cc.Class({
  "extends": cc.Component,
  properties: {
    lab_amount: cc.Label,
    lab_state: cc.Label,
    lab_changeAmount: cc.Label,
    lab_before: cc.Label,
    lab_after: cc.Label,
    lab_id: cc.Label,
    lab_time: cc.Label,
    lab_btnDetailTips: cc.Label,
    btn_detail: cc.Button
  },
  ctor: function ctor() {
    this.itemType = null;
    this.itemData = null;
  },
  onLoad: function onLoad() {
    this.btn_detail.node.on("click", CommonFun.getInstance().debounce(this.btnClick, 1), this);
  },
  btnClick: function btnClick(btn) {
    GlobalCfg.G_COMPONENTS.Audio.playButton();

    if (this.itemType == EnumRecord.RECHARGE) {
      this.dealRechargeStateBtnDetailEvent();
    } else if (this.itemType == EnumRecord.WITHDRAW) {
      this.dealWithDrawStateBtnDetailEvent();
    }

    ;
  },
  dealRechargeStateBtnDetailEvent: function dealRechargeStateBtnDetailEvent() {
    if (this.lab_btnDetailTips.string == "Help") {
      // 上传支付凭证
      CommonFun.getInstance().showTransactionRecordHelp(this.itemData);
    } else if (this.lab_btnDetailTips.string == "Detail") {
      CommonFun.getInstance().showAdvancedMode(true);
    }

    ;
  },
  dealWithDrawStateBtnDetailEvent: function dealWithDrawStateBtnDetailEvent() {
    var feedback = Reflect.has(this.itemData, 'feedback') == true ? this.itemData.feedback : "";
    var callback_detail = Reflect.has(this.itemData, 'callback_detail') == true ? this.itemData.callback_detail : "";
    var content = "";

    if (this.itemData.status == 0) {
      content = 'Waiting for review, please wait!';
    } else if (this.itemData.status == 1) {
      content = 'Bank review in progress, please wait!';
    } else if (this.itemData.status == 3) {
      content = 'Sorry, after review, your withdrawal is suspected of violating regulations';
    } else if (this.itemData.status == 4) {
      if (notify.data.callback_detail != '') {
        content = notify.data.callback_detail;
      } else {
        content = 'unknown error';
      }

      ;
    }
  },
  setTransactionRecordItemData: function setTransactionRecordItemData(data, type) {
    this.itemType = type;
    this.itemData = data;

    if (type == EnumRecord.RECHARGE) {
      this.setRechargeItemData(data);
    } else if (type == EnumRecord.WITHDRAW) {
      this.setWithdrawItemData(data);
    }

    ;
  },
  setRechargeItemData: function setRechargeItemData(data) {
    var createdAt = data.created_at;
    var amount = data.amount;
    var before = data.before;
    var id = data.id;
    var status = data.status;
    var previous_pay = data.previous_pay; // 充值之前的金额，为 0 代表 此条记录为首充订单

    this.lab_amount.string = "\u20B9" + (Number(amount) / 100).toFixed(2);
    this.lab_id.string = "" + id;
    this.lab_time.string = "" + this.getTimeStrByCreatedAt(createdAt);
    var languagesType = I18NUtil.getInstance().getLanguageType();

    if (status == 0) {
      // 支付处理中
      var descriptionStr = I18NUtil.getInstance().getLanguageStr(languagesType, I18NLabelTransIdEnum['TransactionRecord_Processing']);
      this.lab_state.string = descriptionStr;
      this.lab_state.node.color = new cc.color(247, 114, 21, 255);
      this.lab_changeAmount.string = "+\u20B9" + Number(amount / 100).toFixed(2);
      this.lab_before.string = "\u20B9" + Number(before / 100).toFixed(2);
      this.lab_after.string = "\u20B9" + ((Number(before) + Number(amount)) / 100).toFixed(2);
      this.btn_detail.node.active = true;
      this.lab_btnDetailTips.string = "Help";
    } else if (status == 1) {
      // 已支付
      var _descriptionStr = I18NUtil.getInstance().getLanguageStr(languagesType, I18NLabelTransIdEnum['TransactionRecord_Succeeded']);

      this.lab_state.string = _descriptionStr;
      this.lab_state.node.color = new cc.color(26, 182, 51, 255);
      this.lab_changeAmount.string = "+\u20B9" + Number(amount / 100).toFixed(2);

      if (previous_pay == 0 && GlobalCfg.uncleaned == false) {
        var descriptionStr1 = I18NUtil.getInstance().getLanguageStr(languagesType, I18NLabelTransIdEnum['TransactionRecord_Experience Coins']);
        this.lab_before.string = descriptionStr1;
        this.lab_after.string = "\u20B9" + Number(amount / 100).toFixed(2);
        this.btn_detail.node.active = true;
        this.lab_btnDetailTips.string = "Detail";
      } else {
        this.lab_before.string = "\u20B9" + Number(before / 100).toFixed(2);
        this.lab_after.string = "\u20B9" + ((Number(before) + Number(amount)) / 100).toFixed(2);
        this.lab_btnDetailTips.string = "";
        this.btn_detail.node.active = false;
      }

      ;
    } else if (status == 2) {
      // 支付失败
      var _descriptionStr2 = I18NUtil.getInstance().getLanguageStr(languagesType, I18NLabelTransIdEnum['TransactionRecord_Failed']);

      this.lab_state.string = _descriptionStr2;
      this.lab_state.node.color = new cc.color(255, 125, 0, 255);
      this.lab_changeAmount.string = "\u20B90";
      this.lab_before.string = "\u20B90";
      this.lab_after.string = "\u20B90";
      this.lab_btnDetailTips.string = "";
      this.btn_detail.node.active = false;
    }

    ;
  },
  setWithdrawItemData: function setWithdrawItemData(data) {
    var applytime = data.applytime;
    var amount = data.amount;
    var deduction = data.deduction;
    var before = data.before;
    var id = data.id;
    var orderno = data.orderno;
    var status = data.status;
    this.btn_detail.node.active = false;
    this.lab_btnDetailTips.string = "";
    this.lab_amount.string = "\u20B9" + (Number(amount) / 100).toFixed(2);
    this.lab_id.string = "" + orderno;
    this.lab_time.string = "" + this.getTimeStrByCreatedAt(applytime);
    this.lab_changeAmount.string = "-\u20B9" + (Number(deduction) / 100).toFixed(2);
    this.lab_before.string = "\u20B9" + (Number(before) / 100).toFixed(2);
    this.lab_after.string = "\u20B9" + ((Number(before) - Number(deduction)) / 100).toFixed(2);
    var languagesType = I18NUtil.getInstance().getLanguageType();

    if (status == 0) {
      // 等待审核 
      var descriptionStr = I18NUtil.getInstance().getLanguageStr(languagesType, I18NLabelTransIdEnum['TransactionRecord_Pending']);
      this.lab_state.string = descriptionStr;
      this.lab_state.node.color = new cc.color(247, 114, 21, 255);
    } else if (status == 1) {
      // 等待三方操作
      var _descriptionStr3 = I18NUtil.getInstance().getLanguageStr(languagesType, I18NLabelTransIdEnum['TransactionRecord_Processing']);

      this.lab_state.string = _descriptionStr3;
      this.lab_state.node.color = new cc.color(247, 114, 21, 255);
    } else if (status == 2) {
      // 提现成功
      var _descriptionStr4 = I18NUtil.getInstance().getLanguageStr(languagesType, I18NLabelTransIdEnum['TransactionRecord_Succeeded']);

      this.lab_state.string = _descriptionStr4;
      this.lab_state.node.color = new cc.color(26, 182, 51, 255);
    } else if (status == 3) {
      // 三方失败
      var _descriptionStr5 = I18NUtil.getInstance().getLanguageStr(languagesType, I18NLabelTransIdEnum['TransactionRecord_Failed']);

      this.lab_state.string = _descriptionStr5;
      this.lab_state.node.color = new cc.color(255, 125, 0, 255);
    } else if (status == 4) {
      // 审核拒绝
      var _descriptionStr6 = I18NUtil.getInstance().getLanguageStr(languagesType, I18NLabelTransIdEnum['TransactionRecord_Rejected']);

      this.lab_state.string = _descriptionStr6;
      this.lab_state.node.color = new cc.color(255, 125, 0, 255);
    }

    ;
  },
  getTimeStrByCreatedAt: function getTimeStrByCreatedAt(createdAt) {
    var timestamp = Date.parse(createdAt);
    var date = new Date(timestamp);
    var year = date.getFullYear(); // 获取年份

    var month = date.getMonth() + 1; // 获取月份（返回值为0~11，需要加1）

    var day = date.getDate(); // 获取日期

    var hours = date.getHours(); // 获取小时

    var minutes = date.getMinutes(); // 获取分钟

    var seconds = date.getSeconds(); // 获取秒数

    return year + "-" + (month >= 10 ? month : '0' + month) + "-" + (day >= 10 ? day : '0' + day) + " " + (hours >= 10 ? hours : "0" + hours) + ":" + (minutes >= 10 ? minutes : "0" + minutes) + ":" + (seconds >= 10 ? seconds : "0" + seconds);
  }
});

cc._RF.pop();