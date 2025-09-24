"use strict";
cc._RF.push(module, '073f7sARJFIyq/O+g961Ip+', 'TransactionRecordHelpCtrl');
// ResourcesBundle/NewPlan/TransactionRecord/TransactionRecordHelpCtrl.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    btn_close: cc.Button,
    btn_how: cc.Button,
    btn_submit: cc.Button,
    lab_rechargeAmount: cc.Label,
    lab_date: cc.Label,
    lab_state: cc.Label,
    editBox_utr: cc.EditBox,
    btn_upload: cc.Button,
    sprite_upload: cc.Sprite,
    btn_tipClose: cc.Button,
    node_upload: cc.Node,
    node_tip: cc.Node
  },
  ctor: function ctor() {
    this.uploadPhotoBase64Data = null;
    this.uploadPhotoFormat = "jpg";
    this.orderId = '';
    this.stateArr = ["Processing", "Succeeded", "Failed"];
  },
  onLoad: function onLoad() {
    this.node_upload.active = true;
    this.node_tip.active = false;
    this.btn_close.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
    this.btn_how.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
    this.btn_submit.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 2), this);
    this.btn_upload.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 2), this);
    this.btn_tipClose.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
    this.customMsgEventHandle = ClientNotify.register(GlobalCfg.MSG_TYPE.clientMsg, this.onEventMsg, this);
  },
  onEventMsg: function onEventMsg(webData, target) {
    var _this = this;

    var msgId = webData.msgCode;
    var notify = webData.msgData;

    if (msgId == "SelectPhotoCallBack") {
      var photoPath = notify.photoPath;
      var width = notify.width;
      var height = notify.height;
      var byteData = jsb.fileUtils.getDataFromFile(photoPath);
      this.uploadPhotoBase64Data = CommonFun.getInstance().arrayBufferToBase64(byteData);
      this.uploadPhotoFormat = photoPath.endsWith("jpg") ? "jpg" : "png";
      cc.assetManager.loadRemote(photoPath, function (err, img) {
        if (!err && cc.isValid(_this) && cc.isValid(_this.sprite_upload)) {
          _this.sprite_upload.spriteFrame = new cc.SpriteFrame(img);
        }

        ;
      });
    }

    ;
  },
  btnClick: function btnClick(btn) {
    var btnName = btn.node.name;

    switch (btnName) {
      case this.btn_close.node.name:
        this.dealBtnCloseEvent();
        break;

      case this.btn_how.node.name:
        this.dealBtnHowEvent();
        break;

      case this.btn_submit.node.name:
        this.dealBtnSubmitEvent();
        break;

      case this.btn_upload.node.name:
        this.dealBtnUploadEvent();
        break;

      case this.btn_tipClose.node.name:
        this.dealBtnTipCloseEvent();
        break;

      default:
        break;
    }
  },
  dealBtnCloseEvent: function dealBtnCloseEvent() {
    this.node.destroy();
  },
  dealBtnHowEvent: function dealBtnHowEvent() {
    this.node_upload.active = true;
    this.node_tip.active = true;
  },
  dealBtnSubmitEvent: function dealBtnSubmitEvent() {
    var utrString = this.editBox_utr.string;

    if (utrString.length < 12) {
      CommonFun.getInstance().showTips('Input a 12 digit combination.\nClick "How to Find Your UTR for help."');
      return;
    }

    ;

    if (this.uploadPhotoBase64Data == null) {
      CommonFun.getInstance().showTips('Please upload a screenshot of your payment voucher');
      return;
    }

    ;
    this.uploadFeedback();
  },
  dealBtnUploadEvent: function dealBtnUploadEvent() {
    APPManager.selectPhoto();
  },
  dealBtnTipCloseEvent: function dealBtnTipCloseEvent() {
    this.node_upload.active = true;
    this.node_tip.active = false;
  },
  uploadFeedback: function uploadFeedback() {
    CommonFun.getInstance().showProgress();
    var url = GlobalCfg.HTTP_SERVER + '/v1/payment/uploadfeedback';
    var httpParam = {
      "order_id": this.orderId,
      // 订单ID
      "photo_data": this.uploadPhotoBase64Data,
      // 截图二进制base64数据
      "format": this.uploadPhotoFormat // 截图文件格式(png，jpg等)

    };
    CommonFun.getInstance().httpPost(url, httpParam, function (msg) {
      CommonFun.getInstance().hidProgress();

      if (msg && msg.result == 0) {
        CommonFun.getInstance().showTips("Submit successful!");
      } else {
        CommonFun.getInstance().showTips(msg.msg);
      }

      ;
    }, null, GlobalCfg.USER_DATAS.BearerToken);
    this.node.destroy();
  },
  setTransactionRecordHelpData: function setTransactionRecordHelpData(data) {
    var createdAt = data.created_at;
    var state = data.status;
    var amount = data.amount;
    this.orderId = data.id;
    this.lab_date.string = "" + this.getTimeStrByCreatedAt(createdAt);
    this.lab_state.string = "" + this.stateArr[state];
    this.lab_rechargeAmount.string = "\u20B9" + (Number(amount) / 100).toFixed(2);
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