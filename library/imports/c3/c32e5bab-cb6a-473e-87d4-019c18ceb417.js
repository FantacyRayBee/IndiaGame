"use strict";
cc._RF.push(module, 'c32e5ury2pHPofUAZwYzrQX', 'setBankCtrl');
// ResourcesBundle/NewPlan/Pdd/Scripts/setBankCtrl.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    lab_bank: cc.Label,
    editBoxArr: [cc.EditBox],
    btn_changeBank: cc.Button,
    btn_proceed: cc.Button,
    btn_close: cc.Button,
    bankScrollView: cc.ScrollView
  },
  onLoad: function onLoad() {},
  start: function start() {},
  init: function init() {
    this.bankCradInfo = JSON.parse(cc.sys.localStorage.getItem("bankCradInfo"));

    if (this.bankCradInfo) {
      this.lab_bank.string = this.bankCradInfo.bankName;
      this.initEditBoxString(this.bankCradInfo);
    } else {
      this.lab_bank.string = "HDFC BANK";
      this.bankCradInfo = {
        bankName: "HDFC BANK",
        bankCard: "",
        IFSCode: "",
        bankHolder: "",
        bankCardPhone: "",
        bankEmail: ""
      };
    }

    this.btn_bg = this.node.getChildByName('bg').getComponent(cc.Button);
    this.btn_bg.node.on('click', this.btnClick, this);
    this.bankScrollView.node.active = false;
    this.btn_changeBank.node.on('click', this.btnClick, this);
    this.btn_proceed.node.on('click', this.btnClick, this);
    this.btn_close.node.on('click', this.btnClick, this);
    this.editBoxArr[0].node.on('editing-did-ended', this.editEventEndListen, this);
    this.editBoxArr[1].node.on('editing-did-ended', this.editEventEndListen, this);
    this.editBoxArr[2].node.on('editing-did-ended', this.editEventEndListen, this);
    this.editBoxArr[3].node.on('editing-did-ended', this.editEventEndListen, this);
    this.editBoxArr[4].node.on('editing-did-ended', this.editEventEndListen, this);
  },
  btnClick: function btnClick(button) {
    var btnName = button.node.name;

    if (btnName == 'btn_changeBank') {
      GlobalCfg.G_COMPONENTS.Audio.playButton();
      this.showBankList();
    } else if (btnName == 'btn_proceed') {
      GlobalCfg.G_COMPONENTS.Audio.playButton();
      this.setBankInfoToLocal();
    } else if (btnName == 'bg') {
      this.bankScrollView.node.active = false;
    } else if (btnName == 'btn_close') {
      GlobalCfg.G_COMPONENTS.Audio.playBack();
      this.node.destroy();
    }
  },
  editEventEndListen: function editEventEndListen(editbox) {
    var editBoxName = editbox.node.name;

    switch (editBoxName) {
      case "editBox_BankAccount":
        this.bankCradInfo.bankCard = editbox.string;
        break;

      case "editBox_IFS":
        this.bankCradInfo.IFSCode = editbox.string;
        break;

      case "editBox_holderName":
        this.bankCradInfo.bankHolder = editbox.string;
        break;

      case "editBox_phoneNumber":
        this.bankCradInfo.bankCardPhone = editbox.string;
        break;

      case "":
        this.bankCradInfo.bankEmail = editbox.string;
        break;

      default:
        break;
    }
  },
  checkBankInfo: function checkBankInfo() {},
  initEditBoxString: function initEditBoxString(bankCradInfo) {
    this.editBoxArr[0].string = bankCradInfo.bankCard ? bankCradInfo.bankCard : "";
    this.editBoxArr[1].string = bankCradInfo.IFSCode ? bankCradInfo.IFSCode : "";
    this.editBoxArr[2].string = bankCradInfo.bankHolder ? bankCradInfo.bankHolder : "";
    this.editBoxArr[3].string = bankCradInfo.bankCardPhone ? bankCradInfo.bankCardPhone : "";
    this.editBoxArr[4].string = bankCradInfo.bankEmail ? bankCradInfo.bankEmail : "";
  },
  setBankInfoToLocal: function setBankInfoToLocal() {
    cc.sys.localStorage.setItem("bankCradInfo", JSON.stringify(this.bankCradInfo));
    var turnTableCtrl = this.node.parent.getComponent('turnTableCtrl');

    if (turnTableCtrl.quota == turnTableCtrl.unclaimed) {
      this.modifyBankCard();
    } else {
      cc.sys.localStorage.setItem("bankCradInfo", JSON.stringify(this.bankCradInfo));
      this.node.destroy();
    }
  },
  //修改银行卡的信息
  modifyBankCard: function modifyBankCard() {
    var _this = this;

    var self = this;
    var httpUrl = GlobalCfg.HTTP_SERVER + "/v1/payment/india_address";
    var httpParam = {
      "address": {
        "uid": GlobalCfg.USER_DATAS.userId,
        "name": self.editBoxArr[2].string ? self.editBoxArr[2].string : "",
        "email": self.editBoxArr[4].string ? self.editBoxArr[4].string : "",
        "mobile": self.editBoxArr[3].string ? self.editBoxArr[3].string : "",
        "bank_card_id": self.editBoxArr[0].string ? self.editBoxArr[0].string : "",
        "ifsc": self.editBoxArr[1].string ? self.editBoxArr[1].string : "",
        "bank_code": self.lab_bank.string ? self.lab_bank.string : "",
        // "pay_type" : self.pay_type,
        "upi": "",
        "pan": ""
      }
    };
    CommonFun.getInstance().httpPost(httpUrl, httpParam, function (msg) {
      cc.log("修改银行卡的信息", msg);

      if (msg.result == 0) {
        _this.withDraw();
      } else {
        CommonFun.getInstance().showTips(msg.result);
      }

      _this.node.destroy();
    }, null, GlobalCfg.USER_DATAS.BearerToken);
  },
  withDraw: function withDraw() {
    var url = GlobalCfg.HTTP_SERVER + "/v1/pdd/withdraw";
    CommonFun.getInstance().httpGet(url, function (strInfo) {
      cc.log("提现", strInfo);

      if (strInfo.result == 0) {
        CommonFun.getInstance().showTips("Successfully withdraw");
      } else {
        CommonFun.getInstance().showTips(strInfo.msg);
      }
    }, null, GlobalCfg.USER_DATAS.BearerToken);
  },
  // 显示银行列表
  showBankList: function showBankList() {
    var bankList = ["AKHAND ANAND CO-OP BANK", "AU Small Finance Bank", "Aditya Birla payment bank", "Airtel Payment Bank", "Allahabad Bank", "Andhra Bank", "Andhra Pragathi Grameena Bank", "Axis Bank", "Bandhan Bank", "Bank of Baroda", "Bank of India", "Bank of Maharashtra", "Bhavana Bank", "CSB Bank", "Canara Bank", "Central Bank of India", "City Union Bank", "Corporation Bank", "DBS Bank", "DCB Bank", "Dena Bank", "Deutsche Bank", "Dhanlaxmi Bank", "Federal Bank", "HDFC Bank", "ICICI Bank", "IDBI Bank", "IDFC Bank", "Indian Bank", "Indian Overseas Bank", "IndusInd Bank", "Jammu & Kashmir Bank", "Karnataka Bank", "Karur Vysya Bank", "Kotak Bank", "Laxmi Vilas Bank", "Oriental Bank of Commerce", "Punjab National Bank", "Punjab & Sind Bank", "RUPEEO Online Bank", "Saraswat Bank", "Shamrao Vitthal Co-operative Bank", "South Indian Bank", "State Bank of Bikaner & Jaipur", "State Bank of Hyderabad", "State Bank of India", "State Bank of Mysore", "State Bank of Patiala", "State Bank of Travancore", "Syndicate Bank", "Tamilnadu Mercantile Bank", "Union Bank of India", "United Bank of India", "Bank of Maharashtra", "Bank of Baroda", "Bank of Maharashtra", "Bank of Rajasthan", "Canara Bank", "Catholic Syrian Bank", "Suco Bank", "Syndicate Bank", "TJSB Sahakari Bank Ltd", "Tamilnad Mercantile Bank", "Telangana Grameena Bank", "The Akola Urban Co-operative Bank LTD", "The Kalupur Commercial Co-operative Bank", "The Nasik Merchants Co-operative Bank", "UCO Bank", "Ujjivan Small Finance Bank", "United Commercial Bank", "Utkarsh Small Finance Bank", "Uttar Bihar Gramin Bank", "Vijaya Bank", "Vijaya Bank", "Yes Bank", "Zagros Bank"];
    var content = this.bankScrollView.content;
    var item = content.getChildByName('item');
    content.removeAllChildren();

    for (var i = 0; i < bankList.length; i++) {
      var element = bankList[i];
      var itemNode = cc.instantiate(item);
      itemNode.getChildByName("lab_bank").getComponent(cc.Label).string = element;
      content.addChild(itemNode);
      var btn_itemNode = itemNode.getComponent(cc.Button);
      btn_itemNode.node.on('click', this.itemButtonClick, this);
    }

    this.bankScrollView.node.active = true;
  },
  itemButtonClick: function itemButtonClick(button) {
    var bankName = button.node.getChildByName("lab_bank").getComponent(cc.Label).string;
    this.lab_bank.string = bankName;
    this.bankCradInfo.bankName = bankName;
    this.bankScrollView.node.active = false;
  } // update (dt) {},

});

cc._RF.pop();