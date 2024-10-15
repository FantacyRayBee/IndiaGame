"use strict";
cc._RF.push(module, '243f8K6EeBDiaFsDWNIdhYN', 'BonusTransferCtrl');
// ResourcesBundle/NewPlan/BonusTransfer/BonusTransferCtrl.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    btn_close: cc.Button,
    btn_collect: cc.Button,
    btn_getMore: cc.Button,
    btn_notice: cc.Button,
    lab_bonus: cc.Label,
    lab_Rs: cc.Label,
    prefabRule: cc.Prefab
  },
  onLoad: function onLoad() {
    this.initNode();
  },
  onDestroy: function onDestroy() {
    CommonFun.getInstance().releasePrefab(GlobalCfg.PREFAB_PATH.BONUSTRANSFER);
  },
  btnClick: function btnClick(button) {
    var _this = this;

    var btnName = button.node.name;

    if (btnName === "btn_close") {
      GlobalCfg.G_COMPONENTS.Audio.playBack();
      this.node.destroy();
    } else {
      GlobalCfg.G_COMPONENTS.Audio.playButton();

      if (btnName === "btn_collect") {
        var url = GlobalCfg.HTTP_SERVER + "/v1/voucher/receivevoucherbet";
        CommonFun.getInstance().httpGet(url, function (strInfo) {
          if (strInfo.result == 0) {
            CommonFun.getInstance().showRewardsTips([{
              id: 10,
              amount: GlobalCfg.USER_DATAS.undraw / 100
            }]);
            GlobalCfg.USER_DATAS.deposit = strInfo.data.after_d;
            GlobalCfg.USER_DATAS.winnings = strInfo.data.after_w;
            GlobalCfg.USER_DATAS.userDiamond = FloatCalculation.accAdd(GlobalCfg.USER_DATAS.userDiamond, Number(strInfo.data.received));
            GlobalCfg.USER_DATAS.undraw = strInfo.data.after_bet;
            ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, {
              msgCode: GlobalCfg.CLIENT_MSG_ID.GET_BOUND_UNDRAW,
              msgData: {}
            });

            if (CommonFun.getInstance().isValidForScr(_this)) {
              _this.lab_Rs.string = strInfo.data.after_bet;
              _this.btn_collect.interactable = false;
              _this.btn_collect.enableAutoGrayEffect = true;
            }

            ;
          } else {
            CommonFun.getInstance().showTips(strInfo.msg);
          }

          ;
        }, null, GlobalCfg.USER_DATAS.BearerToken);
      } else if (btnName === "btn_collect") {
        CommonFun.getInstance().showTips("Less than 1 Rs");
      } else if (btnName === "btn_getmore") {
        if (GlobalCfg.USER_DATAS.recharged == 0) {
          CommonFun.getInstance().showFirstRecharge();
        } else if (GlobalCfg.USER_DATAS.voucherCard == 0) {
          CommonFun.getInstance().showDailyBonusCard();
        } else {
          CommonFun.getInstance().showPromoter();
        }

        ;
        this.node.destroy();
      } else if (btnName === "btn_notice") {
        var content = "";
        var languagesType = I18NUtil.getInstance().getLanguageType();

        switch (languagesType) {
          case I18NLanguagesEnum.English:
            content = "All the bonuses you get will be placedhere Whenever you lose money in thegame,\n the bonus will be converted intocash at 5% of the money you lose.\n At this time you can collect cash";
            break;

          case I18NLanguagesEnum.Hindi:
            content = "आपको मिलने वाले सभी बोनस यहां रखे जाएंगे। जब भी आप खेल में पैसा खोते हैं, तो बोनस आपके खोए हुए पैसे का 5% नकद में बदल दिया जाएगा।\n इस समय आप नकद एकत्र कर सकते हैं";
            break;

          case I18NLanguagesEnum.Urdu:
            content = "آپ کو ملنے والے تمام بونس یہاں رکھے جائیں گے جب بھی آپ گیم میں پیسے کھویں گے،\n بونس کو آپ کی کھوئی ہوئی رقم کے 5% پر نقد رقم میں تبدیل کر دیا جائے گا۔\n اس وقت آپ نقد رقم جمع کر سکتے ہیں۔";
            break;

          case I18NLanguagesEnum.Bengali:
            content = "আপনি যে সমস্ত বোনাস পাবেন তা এখানে রাখা হবে যখনই আপনি গেমে অর্থ হারাবেন,\n আপনি যে অর্থ হারাবেন তার 5% এ বোনাসটি নগদে রূপান্তরিত হবে।\n এই সময়ে আপনি নগদ সংগ্রহ করতে পারবেন";
            break;

          default:
            content = "All the bonuses you get will be placedhere Whenever you lose money in thegame,\n the bonus will be converted intocash at 5% of the money you lose.\n At this time you can collect cash";
        }

        ;
        var ruleNode = cc.instantiate(this.prefabRule);
        ruleNode.getComponent("BonusTransferRule").setContent(content);
        ruleNode.parent = this.node;
      }

      ;
    }

    ;
  },
  initNode: function initNode() {
    this.btn_close.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
    this.btn_collect.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
    this.btn_getMore.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
    this.btn_notice.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
    this.lab_bonus.string = GlobalCfg.USER_DATAS.bonus / 100;
    this.lab_Rs.string = GlobalCfg.USER_DATAS.undraw / 100;

    if (GlobalCfg.USER_DATAS.undraw / 100 < 1) {
      this.btn_collect.interactable = false;
      this.btn_collect.enableAutoGrayEffect = true;
    }

    ;
  }
});

cc._RF.pop();