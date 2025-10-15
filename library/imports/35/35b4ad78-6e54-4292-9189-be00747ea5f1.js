"use strict";
cc._RF.push(module, '35b4a14blRCkpGJvgB0fqXx', 'WithDrawCtrl');
// ResourcesBundle/NewPlan/WithDraw/WithDrawCtrl.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    btn_back: cc.Button,
    btn_instructions: cc.Button,
    btn_record: cc.Button,
    btn_addCash: cc.Button,
    btn_depositCashTips: cc.Button,
    btn_winningsCashTips: cc.Button,
    btn_withdraw: cc.Button,
    lab_cashBalance: cc.Label,
    lab_depositCash: cc.Label,
    lab_winningsCash: cc.Label,
    lab_dailyWithdrawalCountLeft: cc.Label,
    lab_withdrawAmount: cc.Label,
    lab_btnWithDrawTips: cc.Label,
    lab_withDrawWarnTips: cc.Label,
    node_withDrawItemContent: cc.Node
  },
  ctor: function ctor() {
    this.selectedItemData = null;
  },
  onLoad: function onLoad() {
    this.btn_back.node.on("click", CommonFun.getInstance().debounce(this.btnClick, 1), this);
    this.btn_instructions.node.on("click", CommonFun.getInstance().debounce(this.btnClick, 1), this);
    this.btn_record.node.on("click", CommonFun.getInstance().debounce(this.btnClick, 1), this);
    this.btn_addCash.node.on("click", CommonFun.getInstance().debounce(this.btnClick, 1), this);
    this.btn_depositCashTips.node.on("click", CommonFun.getInstance().debounce(this.btnClick, 0), this);
    this.btn_winningsCashTips.node.on("click", CommonFun.getInstance().debounce(this.btnClick, 0), this);
    this.btn_withdraw.node.on("click", CommonFun.getInstance().debounce(this.btnClick, 1), this);
    this.setLabsData();
    var languagesType = I18NUtil.getInstance().getLanguageType();
    switch (languagesType) {
      case I18NLanguagesEnum.English:
        this.lab_withDrawWarnTips.string = "1. Money will be remitted to you within 1-7 days\n2. If the withdrawal application is wrong, please fill in you bank information again\n3. Withdrawal requires an additional service charge";
        break;
      case I18NLanguagesEnum.Hindi:
        this.lab_withDrawWarnTips.string = "1. \u0906\u092A\u0915\u094B 1-7 \u0926\u093F\u0928\u094B\u0902 \u0915\u0947 \u092D\u0940\u0924\u0930 \u092A\u0948\u0938\u093E \u092D\u0947\u091C \u0926\u093F\u092F\u093E \u091C\u093E\u090F\u0917\u093E\n2. \u092F\u0926\u093F \u0928\u093F\u0915\u093E\u0938\u0940 \u0906\u0935\u0947\u0926\u0928 \u0917\u0932\u0924 \u0939\u0948, \u0924\u094B \u0915\u0943\u092A\u092F\u093E \u0905\u092A\u0928\u0940 \u092C\u0948\u0902\u0915 \u091C\u093E\u0928\u0915\u093E\u0930\u0940 \u0926\u094B\u092C\u093E\u0930\u093E \u092D\u0930\u0947\u0902\n3. \u0928\u093F\u0915\u093E\u0938\u0940 \u0915\u0947 \u0932\u093F\u090F \u0905\u0924\u093F\u0930\u093F\u0915\u094D\u0924 \u0938\u0947\u0935\u093E \u0936\u0941\u0932\u094D\u0915 \u0915\u0940 \u0906\u0935\u0936\u094D\u092F\u0915\u0924\u093E \u0939\u094B\u0924\u0940 \u0939\u0948";
        break;
      case I18NLanguagesEnum.Urdu:
        this.lab_withDrawWarnTips.string = "1. \u0631\u0642\u0645 \u0622\u067E \u06A9\u0648 1-7 \u062F\u0646\u0648\u06BA \u06A9\u06D2 \u0627\u0646\u062F\u0631 \u0628\u06BE\u06CC\u062C \u062F\u06CC \u062C\u0627\u0626\u06D2 \u06AF\u06CC\n2\u06D4 \u0627\u06AF\u0631 \u0648\u0627\u067E\u0633\u06CC \u06A9\u06CC \u062F\u0631\u062E\u0648\u0627\u0633\u062A \u063A\u0644\u0637 \u06C1\u06D2 \u062A\u0648\u060C \u0628\u0631\u0627\u06C1 \u06A9\u0631\u0645 \u0627\u067E\u0646\u06CC \u0628\u06CC\u0646\u06A9 \u06A9\u06CC \u0645\u0639\u0644\u0648\u0645\u0627\u062A \u062F\u0648\u0628\u0627\u0631\u06C1 \u0628\u06BE\u0631\u06CC\u06BA\n3\u06D4 \u0648\u0627\u067E\u0633\u06CC \u06A9\u06D2 \u0644\u06CC\u06D2 \u0627\u0636\u0627\u0641\u06CC \u0633\u0631\u0648\u0633 \u0686\u0627\u0631\u062C \u06A9\u06CC \u0636\u0631\u0648\u0631\u062A \u06C1\u0648\u062A\u06CC \u06C1\u06D2\u06D4";
        break;
      case I18NLanguagesEnum.Bengali:
        this.lab_withDrawWarnTips.string = "1. 1-7 \u09A6\u09BF\u09A8\u09C7\u09B0 \u09AE\u09A7\u09CD\u09AF\u09C7 \u0986\u09AA\u09A8\u09BE\u0995\u09C7 \u099F\u09BE\u0995\u09BE \u09AA\u09BE\u09A0\u09BE\u09A8\u09CB \u09B9\u09AC\u09C7\n2. \u09AA\u09CD\u09B0\u09A4\u09CD\u09AF\u09BE\u09B9\u09BE\u09B0\u09C7\u09B0 \u0986\u09AC\u09C7\u09A6\u09A8 \u09AD\u09C1\u09B2 \u09B9\u09B2\u09C7, \u0985\u09A8\u09C1\u0997\u09CD\u09B0\u09B9 \u0995\u09B0\u09C7 \u0986\u09AA\u09A8\u09BE\u09B0 \u09AC\u09CD\u09AF\u09BE\u0999\u09CD\u0995\u09C7\u09B0 \u09A4\u09A5\u09CD\u09AF \u0986\u09AC\u09BE\u09B0 \u09AA\u09C2\u09B0\u09A3 \u0995\u09B0\u09C1\u09A8\n3. \u09AA\u09CD\u09B0\u09A4\u09CD\u09AF\u09BE\u09B9\u09BE\u09B0 \u098F\u0995\u099F\u09BF \u0985\u09A4\u09BF\u09B0\u09BF\u0995\u09CD\u09A4 \u09AA\u09B0\u09BF\u09B7\u09C7\u09AC\u09BE \u099A\u09BE\u09B0\u09CD\u099C \u09AA\u09CD\u09B0\u09AF\u09BC\u09CB\u099C\u09A8";
        break;
      default:
        this.lab_withDrawWarnTips.string = "1. Money will be remitted to you within 1-7 days\n2. If the withdrawal application is wrong, please fill in you bank information again\n3. Withdrawal requires an additional service charge";
        break;
    }
    ;
    this.msgHandle = ClientNotify.register(GlobalCfg.MSG_TYPE.serverMsg, this.onEventMsg, this);
    this.customMsgEventHandle = ClientNotify.register(GlobalCfg.MSG_TYPE.clientMsg, this.onEventMsg, this);
  },
  start: function start() {
    this.setWithDrawItems();
  },
  onEventMsg: function onEventMsg(webData, target) {
    var self = target;
    var msgId = webData.msgCode;
    var notify = webData.msgData;
    if (msgId == GlobalCfg.CLIENT_MSG_ID.CURRENCY_CHANGED_USER_INFO) {
      var reason = notify.reason; // 原因
      var changed = notify.changed; // 变化值
      var winnings = notify.winnings; // winnings(后)
      var deposit = notify.deposit; // deposit(后)
      var voucher = notify.voucher; // 代金券(后)
      self.setLabsData();
    } else if (msgId == GlobalCfg.CLIENT_MSG_ID.WITHDRAW_SELECTED_ITEM) {
      var itemData = notify.itemData;
      self.selectedItemData = itemData;
      self.lab_withdrawAmount.string = "$" + FloatCalculation.accDiv(itemData.price * (1 - itemData.service_rate), 1);
      var languagesType = I18NUtil.getInstance().getLanguageType();
      var descriptionStr = I18NUtil.getInstance().getLanguageStr(languagesType, I18NLabelTransIdEnum['Withdraw_Withdraw']);
      self.lab_btnWithDrawTips.string = descriptionStr + " $" + FloatCalculation.accDiv(itemData.price, 1);
    }
  },
  onDestroy: function onDestroy() {
    ClientNotify.removeByHandle(GlobalCfg.MSG_TYPE.serverMsg, this.msgHandle);
    ClientNotify.removeByHandle(GlobalCfg.MSG_TYPE.clientMsg, this.customMsgEventHandle);
    CommonFun.getInstance().releasePrefab(GlobalCfg.PREFAB_PATH.WITHDRAWITEM);
    CommonFun.getInstance().releasePrefab(GlobalCfg.PREFAB_PATH.WITHDRAW);
  },
  setLabsData: function setLabsData() {
    this.lab_cashBalance.string = "$" + FloatCalculation.accDiv(GlobalCfg.USER_DATAS.userDiamond, 100);
    this.lab_depositCash.string = "$" + FloatCalculation.accDiv(GlobalCfg.USER_DATAS.deposit, 100);
    this.lab_winningsCash.string = "$" + FloatCalculation.accDiv(GlobalCfg.USER_DATAS.winnings, 100);
    if (CommonFun.getInstance().isOpenVipModule()) {
      var remainingTimes = GlobalCfg.USER_DATAS.userVip.day_withdraw_count_limit - GlobalCfg.USER_DATAS.userVip.day_withdraw_count;
      remainingTimes = remainingTimes <= 0 ? 0 : remainingTimes;
      this.lab_dailyWithdrawalCountLeft.string = remainingTimes;
    } else {
      var _remainingTimes = GlobalCfg.USER_DATAS.remainWithdrawCount <= 0 ? 0 : GlobalCfg.USER_DATAS.remainWithdrawCount;
      this.lab_dailyWithdrawalCountLeft.string = _remainingTimes;
    }
    ;
  },
  setWithDrawItems: function setWithDrawItems() {
    var _this = this;
    Promise.all([this.getWithDrawListInfo(), CommonFun.getInstance().loadPrefabByPromise(GlobalCfg.PREFAB_PATH.WITHDRAWITEM)]).then(function (arr) {
      var withdrawList = arr[0];
      var itemPrefab = arr[1];
      if (CommonFun.getInstance().isValidForScr(_this)) {
        _this.addWithDrawItems(withdrawList, itemPrefab);
      }
      ;
    })["catch"](function (err) {});
  },
  getWithDrawListInfo: function getWithDrawListInfo() {
    return new Promise(function (resolve, reject) {
      if (Reflect.has(GlobalCfg.USER_DATAS.transferConfig, 'option') == true) {
        resolve(GlobalCfg.USER_DATAS.transferConfig.option);
        return;
      } else {
        var url = GlobalCfg.HTTP_SERVER + "/v1/payment/transferoption/list";
        CommonFun.getInstance().httpGet(url, function (json) {
          if (json && json.result == 0) {
            var data = json.data;
            var list = data.list;
            GlobalCfg.USER_DATAS.transferConfig.option = list;
            resolve(GlobalCfg.USER_DATAS.transferConfig.option);
          } else {
            CommonFun.getInstance().showTips(strInfo.msg);
          }
          ;
        }, null, GlobalCfg.USER_DATAS.BearerToken);
      }
      ;
    });
  },
  btnClick: function btnClick(btn) {
    var btnName = btn.node.name;
    switch (btnName) {
      case this.btn_back.node.name:
        GlobalCfg.G_COMPONENTS.Audio.playBack();
        this.dealBtnBackEvent();
        return;
      case this.btn_instructions.node.name:
        this.dealBtnInstructionsEvent();
        break;
      case this.btn_record.node.name:
        this.dealBtnRecordEvent();
        break;
      case this.btn_addCash.node.name:
        this.dealBtnAddCashEvent();
        break;
      case this.btn_depositCashTips.node.name:
        this.dealBtnDepositCashTipsEvent();
        break;
      case this.btn_winningsCashTips.node.name:
        this.dealBtnWinningsCashTipsEvent();
        break;
      case this.btn_withdraw.node.name:
        this.dealBtnWithdrawEvent();
        break;
      default:
        break;
    }
    GlobalCfg.G_COMPONENTS.Audio.playButton();
  },
  dealBtnBackEvent: function dealBtnBackEvent() {
    CommonFun.getInstance().decVerticalAcc();
    this.node.destroy();
  },
  dealBtnInstructionsEvent: function dealBtnInstructionsEvent() {
    CommonFun.getInstance().showShopInstructions();
  },
  dealBtnRecordEvent: function dealBtnRecordEvent() {
    CommonFun.getInstance().showTransactionRecord();
  },
  dealBtnAddCashEvent: function dealBtnAddCashEvent() {
    CommonFun.getInstance().showNewShop();
  },
  dealBtnDepositCashTipsEvent: function dealBtnDepositCashTipsEvent() {
    var content = "Deposit Cash is the Cash that you've added to your Wallet.\n\nYou can use Deposit Cash with Winnings Cash to pay for cash games.\n\nNote : You cannot withdraw your Deposit Cash.";
    CommonFun.getInstance().showWithDrawTips("Okay", content, function () {});
  },
  dealBtnWinningsCashTipsEvent: function dealBtnWinningsCashTipsEvent() {
    var content = "Winnings Cash is the Cash that you have won in cash games.\n\nYou can use Winnings Cash and Deposit Cash to play for cash games.\n\nNote: You can withdraw your Winnings Cash.";
    CommonFun.getInstance().showWithDrawTips("Okay", content, function () {});
  },
  dealBtnWithdrawEvent: function dealBtnWithdrawEvent() {
    var _this2 = this;
    if (this.selectedItemData === null) {
      return;
    }
    ;
    var withDrawAmount = this.selectedItemData.price;
    if (GlobalCfg.USER_DATAS.winnings < withDrawAmount * 100) {
      CommonFun.getInstance().showTips('Winning cash be not enough!');
    } else {
      if (CommonFun.getInstance().isOpenVipModule()) {
        if (GlobalCfg.USER_DATAS.userVip.day_withdraw_count >= GlobalCfg.USER_DATAS.userVip.day_withdraw_count_limit || GlobalCfg.USER_DATAS.userVip.withdraw_total + withDrawAmount * 100 > GlobalCfg.USER_DATAS.userVip.withdraw_total_limit) {
          var content = "";
          var languagesType = I18NUtil.getInstance().getLanguageType();
          switch (languagesType) {
            case I18NLanguagesEnum.English:
              content = "Your VIP level needs to be improved, please go to upgrade your VIP level!";
              break;
            case I18NLanguagesEnum.Hindi:
              content = "आपके वीआईपी स्तर में सुधार की आवश्यकता है, कृपया अपने वीआईपी स्तर को अपग्रेड करने के लिए जाएं!";
              break;
            case I18NLanguagesEnum.Urdu:
              content = "آپ کے VIP لیول کو بہتر کرنے کی ضرورت ہے، براہ کرم اپنے VIP لیول کو اپ گریڈ کرنے کے لیے جائیں!";
              break;
            case I18NLanguagesEnum.Bengali:
              content = "আপনার ভিআইপি স্তর উন্নত করা প্রয়োজন, অনুগ্রহ করে আপনার ভিআইপি স্তর আপগ্রেড করতে যান!";
              break;
            default:
              content = "Your VIP level needs to be improved, please go to upgrade your VIP level!";
              break;
          }
          ;
          CommonFun.getInstance().showWithDrawTips("Go upgrade", content, function () {
            CommonFun.getInstance().decVerticalAcc();
            _this2.node.destroy();
            CommonFun.getInstance().showMyVip();
          });
        } else {
          this.sendWithDrawReq();
        }
        ;
      } else {
        if (GlobalCfg.USER_DATAS.remainWithdrawCount > 0) {
          this.sendWithDrawReq();
        } else {
          CommonFun.getInstance().showTips('Withdrawal count be not enough!');
        }
        ;
      }
    }
  },
  sendWithDrawReq: function sendWithDrawReq() {
    var _this3 = this;
    CommonFun.getInstance().showProgress();
    var amount = this.selectedItemData.price;
    var httpUrl = GlobalCfg.HTTP_SERVER + "/v1/payment/apply_take_profit";
    var httpParam = {
      "amount": amount * 100,
      "way": 1
    };
    CommonFun.getInstance().httpPost(httpUrl, httpParam, function (msg) {
      CommonFun.getInstance().hidProgress();
      var strTip = '';
      if (msg.result == 0) {
        _this3.isWithdrawSuccess = true;
        if (CommonFun.getInstance().isOpenVipModule()) {
          GlobalCfg.USER_DATAS.userVip.day_withdraw_count += 1;
          GlobalCfg.USER_DATAS.userVip.withdraw_total += amount;
        } else {
          GlobalCfg.USER_DATAS.remainWithdrawCount -= 1;
        }
        ;
        GlobalCfg.HAVE_WITHDRAW = true;
        GlobalCfg.USER_DATAS.userDiamond = msg.data.wallet.amount;
        GlobalCfg.USER_DATAS.deposit = msg.data.wallet.deposit;
        GlobalCfg.USER_DATAS.winnings = msg.data.wallet.winnings;
        GlobalCfg.USER_DATAS.undraw = msg.data.wallet.undraw;
        GlobalCfg.USER_DATAS.bonus = msg.data.wallet.voucher;
        if (CommonFun.getInstance().isValidForScr(_this3)) {
          _this3.setLabsData();
        }
        ;
        var languagesType = I18NUtil.getInstance().getLanguageType();
        switch (languagesType) {
          case I18NLanguagesEnum.English:
            strTip = "Cash withdrawal application succeeded, please wait!";
            break;
          case I18NLanguagesEnum.Hindi:
            strTip = "नकद निकासी आवेदन सफल हुआ, कृपया प्रतीक्षा करें!";
            break;
          case I18NLanguagesEnum.Urdu:
            strTip = "نقد رقم نکالنے کی درخواست کامیاب، براہ کرم انتظار کریں!";
            break;
          case I18NLanguagesEnum.Bengali:
            strTip = "নগদ উত্তোলনের আবেদন সফল হয়েছে, অনুগ্রহ করে অপেক্ষা করুন!";
            break;
          default:
            strTip = "Cash withdrawal application succeeded, please wait!";
            break;
        }
        ;
      } else {
        _this3.isWithdrawSuccess = false;
        strTip = msg.msg;
      }
      ;
      if (CommonFun.getInstance().isValidForScr(_this3)) {
        CommonFun.getInstance().showWithDrawTips("Okay", strTip, function () {
          if (_this3.isWithdrawSuccess == true) {
            // CommonFun.getInstance().showWithDrawShare();
            _this3.isWithdrawSuccess = false;
          }
          ;
        });
      }
      ;
    }, null, GlobalCfg.USER_DATAS.BearerToken);
  },
  addWithDrawItems: function addWithDrawItems(arr, itemPrefab) {
    var _this4 = this;
    var children = this.node_withDrawItemContent.children;
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
      var value1 = a["price"];
      var value2 = b["price"];
      return value1 - value2;
    });
    var index = 0;
    var addItem = function addItem() {
      var withDrawItemData = arr[index];
      var withDrawItemNode = cc.instantiate(itemPrefab);
      _this4.node_withDrawItemContent.addChild(withDrawItemNode);
      var withDrawItemCtrl = withDrawItemNode.getComponent("WithDrawItemCtrl");
      withDrawItemCtrl.setWithDrawItemData(withDrawItemData);
      withDrawItemCtrl.setWithDrawItemChecked(index == 0);
      index += 1;
      if (index == len) {
        _this4.unschedule(addItem);
        return;
      }
      ;
    };
    this.schedule(addItem, 1 / cc.game.getFrameRate(), len - 1, 0);
  }
});

cc._RF.pop();