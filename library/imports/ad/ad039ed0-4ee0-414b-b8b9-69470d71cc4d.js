"use strict";
cc._RF.push(module, 'ad0397QTuBBS7i5aUcNccxN', 'ShopCtrl');
// ResourcesBundle/NewPlan/Shop/ShopCtrl.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    btn_back: cc.Button,
    btn_instructions: cc.Button,
    btn_record: cc.Button,
    btn_addCash: cc.Button,
    btn_bonusTips: cc.Button,
    lab_totalGet: cc.Label,
    lab_cash: cc.Label,
    lab_bonus: cc.Label,
    lab_userDiamond: cc.Label,
    lab_addCash: cc.Label,
    lab_details: cc.Label,
    lab_addMarkTips: cc.Label,
    node_bonusTips: cc.Node,
    node_shopItemContent: cc.Node,
    node_shopTogItemContent: cc.Node,
    node_tog: cc.Node,
    togList: [cc.Toggle]
  },
  ctor: function ctor() {
    this.haveFromData = false; // 是否有跳转来源数据
    this.upiChannel = 1; // upi渠道
    this.entryStrList = ['paytm', 'upi', 'phonepe'];
    this.storeData = [{
      add: 0,
      amount: 20000,
      bonus: 0,
      gift: 5000,
      id: 3,
      loop_status: 0,
      show: false
    }, {
      add: 0,
      amount: 30000,
      bonus: 0,
      gift: 9000,
      id: 5,
      loop_status: 0,
      show: false
    }, {
      add: 0,
      amount: 50000,
      bonus: 0,
      gift: 15000,
      id: 6,
      loop_status: 0,
      show: false
    }, {
      add: 0,
      amount: 100000,
      bonus: 0,
      gift: 35000,
      id: 7,
      loop_status: 0,
      show: false
    }, {
      add: 0,
      amount: 200000,
      bonus: 0,
      gift: 60000,
      id: 10,
      loop_status: 0,
      show: false
    }, {
      add: 0,
      amount: 300000,
      bonus: 0,
      gift: 105000,
      id: 11,
      loop_status: 0,
      show: false
    }, {
      add: 0,
      amount: 500000,
      bonus: 0,
      gift: 200000,
      id: 8,
      loop_status: 0,
      show: false
    }, {
      add: 0,
      amount: 1000000,
      bonus: 0,
      gift: 400000,
      id: 9,
      loop_status: 0,
      show: false
    }, {
      add: 0,
      amount: 2000000,
      bonus: 0,
      gift: 1000000,
      id: 4,
      loop_status: 0,
      show: false
    }];
  },
  onLoad: function onLoad() {
    SHOPPING.cashID = -1;
    this.node_bonusTips.active = false;
    this.btn_back.node.on("click", CommonFun.getInstance().debounce(this.btnClick, 1), this);
    this.btn_instructions.node.on("click", CommonFun.getInstance().debounce(this.btnClick, 1), this);
    this.btn_record.node.on("click", CommonFun.getInstance().debounce(this.btnClick, 1), this);
    this.btn_addCash.node.on("click", CommonFun.getInstance().debounce(this.btnClick, 1), this);
    this.btn_bonusTips.node.on("click", CommonFun.getInstance().debounce(this.btnClick, 0), this);
    for (var i = 0; i < 3; i++) {
      this.togList[i].node.on("toggle", CommonFun.getInstance().debounce(this.togClick, 1), this);
    }
    this.lab_userDiamond.string = "\u20B90";
    this.msgHandle = ClientNotify.register(GlobalCfg.MSG_TYPE.serverMsg, this.onEventMsg, this);
    this.customMsgEventHandle = ClientNotify.register(GlobalCfg.MSG_TYPE.clientMsg, this.onEventMsg, this);
  },
  /**
   * 设置跳转来源
   * @param {string} from 
   */
  setJumpFrom: function setJumpFrom(from) {
    if (from && from.length > 0) {
      this.haveFromData = true;
      SHOPPING.from = from;
    } else {
      this.haveFromData = false;
    }
    ;
  },
  start: function start() {
    this.togList[0].isChecked = true;
    GlobalCfg.PAY_CHANNEL2 = this.entryStrList[0];
    this.setShopItems();
  },
  onEventMsg: function onEventMsg(webData, target) {
    var self = target;
    var msgId = webData.msgCode;
    var notify = webData.msgData;
    LoggerUtil.getInstance().log("onEventMsg msgId ===> ", msgId);
    LoggerUtil.getInstance().log("onEventMsg notify ===> ", JSON.stringify(notify));
    if (msgId == GlobalCfg.CLIENT_MSG_ID.CURRENCY_CHANGED_USER_INFO) {
      var reason = notify.reason; // 原因
      var changed = notify.changed; // 变化值
      var winnings = notify.winnings; // winnings(后)
      var deposit = notify.deposit; // deposit(后)
      var voucher = notify.voucher; // 代金券(后)

      GlobalCfg.USER_DATAS.userDiamond = deposit + winnings;
      var tempCoin = FloatCalculation.accAdd(GlobalCfg.USER_DATAS.userDiamond, 0);
      var coin = FloatCalculation.accDiv(tempCoin, 100);
      self.lab_userDiamond.string = "\u20B9" + coin;
    } else if (msgId == GlobalCfg.CLIENT_MSG_ID.SHOP_SELECTED_ITEM) {
      var shopItemData = notify.shopItemData;
      SHOPPING.cashID = shopItemData.id;
      SHOPPING.cashAmount = shopItemData.amount;
      var amount = Math.floor(shopItemData.amount / 100);
      var gift = Math.floor(shopItemData.gift / 100);
      if (shopItemData.loop_status == 0) {
        self.lab_cash.string = "\u20B9" + amount;
        self.lab_bonus.string = "\u20B9" + gift;
        self.lab_totalGet.string = "\u20B9" + (amount + gift);
        var _languagesType = I18NUtil.getInstance().getLanguageType();
        switch (_languagesType) {
          case I18NLanguagesEnum.English:
            self.lab_details.string = "Get " + Number(gift / amount * 100).toFixed(0) + "% Cash Back on your losing amount";
            break;
          case I18NLanguagesEnum.Hindi:
            self.lab_details.string = "\u0905\u092A\u0928\u0940 \u0916\u094B\u0908 \u0939\u0941\u0908 \u0930\u093E\u0936\u093F \u092A\u0930 " + Number(gift / amount * 100).toFixed(0) + "% \u0915\u0948\u0936 \u092C\u0948\u0915 \u092A\u094D\u0930\u093E\u092A\u094D\u0924 \u0915\u0930\u0947\u0902";
            break;
          case I18NLanguagesEnum.Urdu:
            self.lab_details.string = "\u0627\u067E\u0646\u06CC \u06A9\u06BE\u0648\u0626\u06CC \u06C1\u0648\u0626\u06CC \u0631\u0642\u0645 \u067E\u0631 " + Number(gift / amount * 100).toFixed(0) + "% \u06A9\u06CC\u0634 \u0628\u06CC\u06A9 \u062D\u0627\u0635\u0644 \u06A9\u0631\u06CC\u06BA\u06D4";
            break;
          case I18NLanguagesEnum.Bengali:
            self.lab_details.string = "\u0986\u09AA\u09A8\u09BE\u09B0 \u09B9\u09BE\u09B0\u09BE\u09A8\u09CB \u09AA\u09B0\u09BF\u09AE\u09BE\u09A3\u09C7 " + Number(gift / amount * 100).toFixed(0) + "% \u09A8\u0997\u09A6 \u09AB\u09C7\u09B0\u09A4 \u09AA\u09BE\u09A8";
            break;
          default:
            self.lab_details.string = "Get " + Number(gift / amount * 100).toFixed(0) + "% Cash Back on your losing amount";
            break;
        }
        ;
      } else if (shopItemData.loop_status == 1) {
        self.lab_cash.string = "\u20B9" + amount;
        self.lab_bonus.string = "\u20B90";
        self.lab_totalGet.string = "\u20B9" + amount;
        self.lab_details.string = "Get 0% Cash Back on \nyour losing amount";
        var _languagesType2 = I18NUtil.getInstance().getLanguageType();
        switch (_languagesType2) {
          case I18NLanguagesEnum.English:
            self.lab_details.string = "Get 0% Cash Back on your losing amount";
            break;
          case I18NLanguagesEnum.Hindi:
            self.lab_details.string = "\u0905\u092A\u0928\u0940 \u0916\u094B\u0908 \u0939\u0941\u0908 \u0930\u093E\u0936\u093F \u092A\u0930 0% \u0915\u0948\u0936 \u092C\u0948\u0915 \u092A\u094D\u0930\u093E\u092A\u094D\u0924 \u0915\u0930\u0947\u0902";
            break;
          case I18NLanguagesEnum.Urdu:
            self.lab_details.string = "\u0627\u067E\u0646\u06CC \u06A9\u06BE\u0648\u0626\u06CC \u06C1\u0648\u0626\u06CC \u0631\u0642\u0645 \u067E\u0631 0% \u06A9\u06CC\u0634 \u0628\u06CC\u06A9 \u062D\u0627\u0635\u0644 \u06A9\u0631\u06CC\u06BA\u06D4";
            break;
          case I18NLanguagesEnum.Bengali:
            self.lab_details.string = "\u0986\u09AA\u09A8\u09BE\u09B0 \u09B9\u09BE\u09B0\u09BE\u09A8\u09CB \u09AA\u09B0\u09BF\u09AE\u09BE\u09A3\u09C7 0% \u09A8\u0997\u09A6 \u09AB\u09C7\u09B0\u09A4 \u09AA\u09BE\u09A8";
            break;
          default:
            self.lab_details.string = "Get 0% Cash Back on your losing amount";
            break;
        }
        ;
      }
      ;
      self.lab_addMarkTips.string = "+";
      var languagesType = I18NUtil.getInstance().getLanguageType();
      var descriptionStr = I18NUtil.getInstance().getLanguageStr(languagesType, I18NLabelTransIdEnum['Shop_Add Cash']);
      self.lab_addCash.string = descriptionStr + " \u20B9" + amount;
    } else if (msgId == GlobalCfg.CLIENT_MSG_ID.REFRESH_SHOP_COMMODITY) {
      self.setShopItems();
    } else if (msgId == "REFRESH_SHOP_ITEM") {
      self.node_tog.active = notify.isShow; //显示/隐藏
      if (!notify.isShow) {
        GlobalCfg.PAY_CHANNEL2 = '';
      }
    }
  },
  onDestroy: function onDestroy() {
    ClientNotify.removeByHandle(GlobalCfg.MSG_TYPE.serverMsg, this.msgHandle);
    ClientNotify.removeByHandle(GlobalCfg.MSG_TYPE.clientMsg, this.customMsgEventHandle);
    CommonFun.getInstance().releasePrefab(GlobalCfg.PREFAB_PATH.SHOPITEM);
    CommonFun.getInstance().releasePrefab(GlobalCfg.PREFAB_PATH.SHOP);
    // CommonFun.getInstance().releasePrefab(GlobalCfg.PREFAB_PATH.SHOPTOGITEM);
  },

  setShopItems: function setShopItems() {
    var _this = this;
    Promise.all([CommonFun.getInstance().loadPrefabByPromise(GlobalCfg.PREFAB_PATH.SHOPITEM)]).then(function (arr) {
      var storeList = _this.storeData;
      var itemPrefab = arr[0];
      if (CommonFun.getInstance().isValidForScr(_this)) {
        var couldWithdraw = GlobalCfg.USER_DATAS.userDiamond;
        var _arr = CommonFun.getInstance().dealShopList(couldWithdraw, storeList);
        _this.addShopItems(_arr, itemPrefab);
      }
      ;
    })["catch"](function (err) {});
  },
  setPayChannel: function setPayChannel(payChannels) {
    var _this2 = this;
    Promise.all([CommonFun.getInstance().loadPrefabByPromise(GlobalCfg.PREFAB_PATH.SHOPTOGITEM)]).then(function (arr) {
      var itemPrefab = arr[0];
      if (CommonFun.getInstance().isValidForScr(_this2)) {
        _this2.addShopTogItems(payChannels, itemPrefab);
      }
      ;
    })["catch"](function (err) {});
  },
  addShopItems: function addShopItems(arr, itemPrefab) {
    var _this3 = this;
    var children = this.node_shopItemContent.children;
    for (var i = 0, _len = children.length; i < _len; i++) {
      var node = children[i];
      node.destroy();
    }
    ;
    var len = arr.length;
    if (len == 0) {
      return;
    }
    ;
    arr = arr.sort(function (a, b) {
      var value1 = a["amount"];
      var value2 = b["amount"];
      return value1 - value2;
    });
    var firstShopItemCtrl = null;
    var isHaveSelectRechargeAcount = false;
    var index = 0;
    var addItem = function addItem() {
      var shopItemData = arr[index];
      var shopItemNode = cc.instantiate(itemPrefab);
      var shopItemCtrl = shopItemNode.getComponent("ShopItemCtrl");
      if (index == 0) {
        firstShopItemCtrl = shopItemCtrl;
      }
      ;
      shopItemCtrl.setNewShopItemData(shopItemData);
      if (shopItemData.amount == GlobalCfg.SELECT_RECHARGE_ACOUNT) {
        isHaveSelectRechargeAcount = true;
        shopItemCtrl.setNewShopItemChecked(true);
      } else {
        shopItemCtrl.setNewShopItemChecked(false);
      }
      ;
      _this3.node_shopItemContent.addChild(shopItemNode);
      index += 1;
      if (index == len) {
        if (!isHaveSelectRechargeAcount) {
          firstShopItemCtrl && firstShopItemCtrl.setNewShopItemChecked(true);
        }
        ;
        _this3.unschedule(addItem);
        return;
      }
      ;
    };
    this.schedule(addItem, 1 / cc.game.getFrameRate(), len - 1, 0);
  },
  addShopTogItems: function addShopTogItems(data, itemPrefab) {
    var children = this.node_shopTogItemContent.children;
    for (var i = 0, len = children.length; i < len; i++) {
      var node = children[i];
      node.destroy();
    }
    ;
    var lens = data.pay_channels.length;
    if (lens == 0) {
      return;
    }
    ;
    for (var _i = 0; _i < lens; _i++) {
      var shopItemNode = cc.instantiate(itemPrefab);
      var shopItemCtrl = shopItemNode.getComponent("ShopTogItemCtrl");
      if (_i == 0) {
        shopItemCtrl.setNewShopItemChecked(true);
        GlobalCfg.PAY_CHANNEL = data.pay_channels[0]; //角标默认选择第一个
        this.node_tog.active = data.pay_channels_name[0].is_multichannel; //是否显示多渠道
        GlobalCfg.PAY_CHANNEL2 = this.entryStrList[0];
        if (!data.pay_channels_name[0].is_multichannel) {
          GlobalCfg.PAY_CHANNEL2 = '';
        }
      }
      ;
      shopItemCtrl.setLabel(data.pay_channels_name[_i], data.pay_channels[_i]);
      this.node_shopTogItemContent.addChild(shopItemNode);
    }
  },
  getStoreListInfo: function getStoreListInfo() {
    return new Promise(function (resolve, reject) {
      if (GlobalCfg.USER_DATAS.store) {
        resolve(GlobalCfg.USER_DATAS.store);
        return;
      }
      ;
      var url = GlobalCfg.HTTP_SERVER + "/v1/payment/commodity/storelist";
      CommonFun.getInstance().httpGet(url, function (json) {
        if (json && json.result == 0 && json.data) {
          var data = json.data;
          var list = data.list;
          GlobalCfg.USER_DATAS.store = list;
          resolve(list);
        } else {
          CommonFun.getInstance().showTips(json.msg);
          reject();
        }
        ;
      }, null, GlobalCfg.USER_DATAS.BearerToken);
    });
  },
  btnClick: function btnClick(btn) {
    var btnName = btn.node.name;
    switch (btnName) {
      case this.btn_back.node.name:
        GlobalCfg.G_COMPONENTS.Audio.playBack();
        this.dealBtnBackEvent();
        break;
      case this.btn_instructions.node.name:
        GlobalCfg.G_COMPONENTS.Audio.playButton();
        this.dealBtnInstructionsEvent();
        break;
      case this.btn_record.node.name:
        GlobalCfg.G_COMPONENTS.Audio.playButton();
        this.dealBtnRecordEvent();
        break;
      case this.btn_addCash.node.name:
        GlobalCfg.G_COMPONENTS.Audio.playButton();
        this.dealBtnAddCashEvent();
        break;
      case this.btn_bonusTips.node.name:
        GlobalCfg.G_COMPONENTS.Audio.playButton();
        this.dealBtnBonusTipsEvent();
        break;
      default:
        break;
    }
  },
  togClick: function togClick(tog) {
    if (tog.isChecked) {
      var index = parseInt(tog.node.name);
      GlobalCfg.PAY_CHANNEL2 = this.entryStrList[index];
    }
  },
  dealBtnBackEvent: function dealBtnBackEvent() {
    // CommonFun.getInstance().decVerticalAcc();
    this.node.destroy();
  },
  dealBtnInstructionsEvent: function dealBtnInstructionsEvent() {
    CommonFun.getInstance().showShopInstructions();
  },
  dealBtnRecordEvent: function dealBtnRecordEvent() {
    CommonFun.getInstance().showTransactionRecord();
  },
  dealBtnAddCashEvent: function dealBtnAddCashEvent() {
    var url = "https://zrpay.buddha9.com/pay?amount=" + SHOPPING.cashAmount;
    // url += "&server_id=" + GlobalCfg.server_id;
    CommonFun.getInstance().showProgress();
    CommonFun.getInstance().httpGet(url, function (strInfo) {
      LoggerUtil.getinstance().log("dealBtnAddCashEvent", strInfo);
      CommonFun.getInstance().hidProgress();
      cc.sys.openURL(strInfo);
    }, null, GlobalCfg.USER_DATAS.BearerToken);
  },
  dealBtnBonusTipsEvent: function dealBtnBonusTipsEvent() {
    this.node_bonusTips.active = !this.node_bonusTips.active;
  }
});

cc._RF.pop();