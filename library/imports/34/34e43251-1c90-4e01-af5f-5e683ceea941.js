"use strict";
cc._RF.push(module, '34e43JRHJBOAa9fXmg87qlB', 'DailyBonusCardCtrl');
// ResourcesBundle/NewPlan/DailyBonusCard/DailyBonusCardCtrl.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    scrollView: cc.ScrollView,
    btn_close: cc.Button,
    btn_rule: cc.Button,
    prefabRule: cc.Prefab
  },
  ctor: function ctor() {
    this.needScrolling = true;
    this.scrollPercentage = 0;
    this.isPositiveDirection = true;
  },
  update: function update(dt) {
    if (this.needScrolling) {
      if (this.isPositiveDirection) {
        this.scrollPercentage += 0.002;
        if (this.scrollPercentage > 1) {
          this.isPositiveDirection = false;
        }
        ;
      } else {
        this.scrollPercentage -= 0.002;
        if (this.scrollPercentage < 0) {
          this.isPositiveDirection = true;
        }
        ;
      }
      ;
      this.scrollView.scrollToPercentHorizontal(this.scrollPercentage, dt, false);
    }
    ;
  },
  onLoad: function onLoad() {
    var _this = this;
    this.btn_close.node.on("click", CommonFun.getInstance().debounce(function () {
      GlobalCfg.G_COMPONENTS.Audio.playBack();
      _this.node.destroy();
    }, 1), this);
    this.btn_rule.node.on("click", CommonFun.getInstance().debounce(function () {
      GlobalCfg.G_COMPONENTS.Audio.playButton();
      var ruleNode = cc.instantiate(_this.prefabRule);
      ruleNode.parent = _this.node;
    }, 1), this);
    this.scrollView.node.on('scroll-began', function () {
      _this.needScrolling = false;
    }, this);
    this.initCard();
    this.msgHandle = ClientNotify.register(GlobalCfg.MSG_TYPE.serverMsg, this.onEventMsg, this);
  },
  initCard: function initCard() {
    var _this2 = this;
    var seriesCard = GlobalCfg.USER_DATAS.seriesCard;
    var content = this.scrollView.content;
    var _loop = function _loop() {
      var cardInfo = seriesCard[i];
      var id = cardInfo.id;
      var price = cardInfo.price;
      var days = cardInfo.days;
      var daySend = cardInfo.day_send;
      var bonus = cardInfo.bonus;
      var cardNode = content.getChildByName("card" + id);
      if (cardNode) {
        var lab_rate = cardNode.getChildByName("bonus_card_ico_sale").getChildByName("lab_sprjb").getComponent(cc.Label);
        var lab_amount = cardNode.getChildByName("layout").getChildByName("lab_sprjb").getComponent(cc.Label);
        var lab_reward = cardNode.getChildByName("layout").getChildByName("lab_spryb").getComponent(cc.Label);
        var lab_tips1 = cardNode.getChildByName("lab_getbonus_1").getComponent(cc.Label);
        var lab_tips2 = cardNode.getChildByName("lab_daybonusday_1").getComponent(cc.Label);
        var lab_tips3 = cardNode.getChildByName("lab_daycashday_1").getComponent(cc.Label);
        var lab_btnTips = cardNode.getChildByName("btn").getChildByName("Background").getChildByName("Label").getComponent(cc.Label);
        var node_btn = cardNode.getChildByName("btn");
        if (GlobalCfg.USER_DATAS.voucherCard == 0) {
          node_btn.on("click", CommonFun.getInstance().debounce(function () {
            _this2.bonusRecharge(id);
          }, 1), _this2);
        } else {
          node_btn.getComponent(cc.Button).interactable = false;
          node_btn.getComponent(cc.Button).enableAutoGrayEffect = true;
        }
        ;
        lab_rate.string = parseInt((days * daySend + bonus) / price * 100) + "%";
        lab_amount.string = "" + price / 100;
        lab_reward.string = "" + (days * daySend + bonus) / 100;
        lab_tips1.string = "Get \u20B9" + price / 100 + " right now";
        // lab_tips2.string = `Bonus ₹${bonus / 100} right now`;
        // lab_tips3.string = `₹${daySend / 100} Cash x${days} days`;

        lab_tips2.string = "\u20B9" + daySend / 100 + " Bonus x" + days + " days";
        lab_btnTips.string = "\u20B9" + price / 100;
      }
      ;
    };
    for (var i = 0, len = seriesCard.length; i < len; i++) {
      _loop();
    }
    ;
  },
  bonusRecharge: function bonusRecharge(id) {
    SHOPPING.from = GlobalCfg.SHOP_RECHARGE_FROM.DailyBonusCard;
    var rechargeNeedInfo = CommonFun.getInstance().getAppConfigValueByKey('Recharge_Need_Info', false);
    if (rechargeNeedInfo) {
      if (GlobalCfg.USER_DATAS.phone.length > 0 && GlobalCfg.USER_DATAS.mail.length > 0) {
        CommonFun.getInstance().rechargeByCommodityId(id, SHOPPING.from);
      } else {
        CommonFun.getInstance().showBindPhone('AddCash');
        this.node.destroy();
      }
      ;
    } else {
      CommonFun.getInstance().rechargeByCommodityId(id, SHOPPING.from);
    }
    ;
  },
  onEventMsg: function onEventMsg(webData, target) {
    var self = target;
    var msgId = webData.msgCode;
    var notify = webData.msgData;
    if (msgId == GlobalCfg.CLIENT_MSG_ID.RECHARGED_DAILYBONUS_CARD) {
      self.initCard();
    }
  },
  onDestroy: function onDestroy() {
    ClientNotify.removeByHandle(GlobalCfg.MSG_TYPE.serverMsg, this.msgHandle);
    CommonFun.getInstance().releasePrefab(GlobalCfg.PREFAB_PATH.DAILYBONUSCARD);
  }
});

cc._RF.pop();