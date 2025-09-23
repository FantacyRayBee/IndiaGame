"use strict";
cc._RF.push(module, '29f3do7BkFC4pM5egI4bpJm', 'MyVipCtrl');
// ResourcesBundle/NewPlan/MyVip/MyVipCtrl.js

"use strict";

function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
cc.Class({
  "extends": cc.Component,
  properties: {
    btn_close: cc.Button,
    btn_vipService: cc.Button,
    btn_vipRight: cc.Button,
    btn_vipLeft: cc.Button,
    btn_luckyDraw: cc.Button,
    btn_forOnce: cc.Button,
    btn_addCash: cc.Button,
    btn_toBet: cc.Button,
    btn_rules: cc.Button,
    btn_benefitsTips: cc.Button,
    btn_icon: cc.Button,
    progressBar_nextLevel: cc.ProgressBar,
    lab_vipLevel: cc.Label,
    lab_nextLevelTips: cc.Label,
    lab_nextLevelProgress: cc.Label,
    lab_upgradeBagAmount: cc.Label,
    lab_upgradeBagGift: cc.Label,
    lab_upgradeBagBtnAmount: cc.Label,
    node_benifits: cc.Node,
    spine_upgrade: sp.Skeleton,
    sprite_icon: cc.Sprite,
    atlas_icon: cc.SpriteAtlas,
    prefab_benifitsItem: cc.Prefab
  },
  ctor: function ctor() {
    this.selectVipLevel = 0;
    this.vipDataList = [];
    this.customMsgEventHandle = null;
    this.expiresTimer = null;
  },
  onLoad: function onLoad() {
    this.btn_close.node.on("click", CommonFun.getInstance().debounce(this.btnClick, 1), this);
    this.btn_vipService.node.on("click", CommonFun.getInstance().debounce(this.btnClick, 1), this);
    this.btn_vipRight.node.on("click", CommonFun.getInstance().debounce(this.btnClick, 0), this);
    this.btn_vipLeft.node.on("click", CommonFun.getInstance().debounce(this.btnClick, 0), this);
    this.btn_luckyDraw.node.on("click", CommonFun.getInstance().debounce(this.btnClick, 1), this);
    this.btn_forOnce.node.on("click", CommonFun.getInstance().debounce(this.btnClick, 1), this);
    this.btn_benefitsTips.node.on("click", CommonFun.getInstance().debounce(this.btnClick, 1), this);
    this.btn_addCash.node.on("click", CommonFun.getInstance().debounce(this.btnClick, 1), this);
    this.btn_toBet.node.on("click", CommonFun.getInstance().debounce(this.btnClick, 1), this);
    this.btn_rules.node.on("click", CommonFun.getInstance().debounce(this.btnClick, 1), this);
    this.spine_upgrade.setSkin("default");
    this.spine_upgrade.animation = null;
    this.customMsgEventHandle = ClientNotify.register(GlobalCfg.MSG_TYPE.clientMsg, this.onEventMsg, this);
  },
  onDestroy: function onDestroy() {
    if (this.expiresTimer) {
      clearInterval(this.expiresTimer);
      this.expiresTimer = null;
    }
    ;
    ClientNotify.removeByHandle(GlobalCfg.MSG_TYPE.clientMsg, this.customMsgEventHandle);
    CommonFun.getInstance().releasePrefab(GlobalCfg.PREFAB_PATH.MYVIP);
  },
  start: function start() {
    this.setVipInfo();
    this.setUpgradeVipAnim();
  },
  setVipInfo: function setVipInfo() {
    this.lab_vipLevel.string = "VIP " + GlobalCfg.USER_DATAS.userVip.level;
    this.selectVipLevel = GlobalCfg.USER_DATAS.userVip.level;
    for (var i = 0, len = GlobalCfg.USER_DATAS.vipLevels.length; i < len; i++) {
      var element = GlobalCfg.USER_DATAS.vipLevels[i];
      if (element.level >= GlobalCfg.USER_DATAS.userVip.level) {
        this.vipDataList.push(element);
      }
      ;
    }
    ;
    this.vipDataList.sort(function (a, b) {
      return a.level - b.level;
    });
    this.showBenifitsByLevel(this.selectVipLevel, false);
    this.lab_upgradeBagAmount.string = "$" + GlobalCfg.USER_DATAS.userVip.upgrade_bag_amount / 100;
    this.lab_upgradeBagGift.string = "$" + (GlobalCfg.USER_DATAS.userVip.upgrade_bag_dgift + GlobalCfg.USER_DATAS.userVip.upgrade_bag_amount) / 100;
    this.lab_upgradeBagBtnAmount.string = "Pay $" + GlobalCfg.USER_DATAS.userVip.upgrade_bag_amount / 100;
  },
  setUpgradeVipAnim: function setUpgradeVipAnim() {
    var _this = this;
    var localStorage = cc.sys.localStorage.getItem(GlobalCfg.USER_DATAS.userId + "_VipUpgrade_LocalStorage");
    if (!localStorage) {
      this.sprite_icon.spriteFrame = this.atlas_icon.getSpriteFrame('1');
      this.spine_upgrade.setCompleteListener(function () {
        if (CommonFun.getInstance().isValidForScr(_this)) {
          _this.spine_upgrade.setSkin("default");
          _this.spine_upgrade.animation = null;
          _this.sprite_icon.spriteFrame = _this.atlas_icon.getSpriteFrame("" + GlobalCfg.USER_DATAS.userVip.level);
        }
        ;
      });
      GlobalCfg.G_COMPONENTS.Audio.playSoundByNameInResources("vipSound/vipUpgrade", false);
      this.spine_upgrade.setAnimation(0, "animation", false);
      cc.sys.localStorage.setItem(GlobalCfg.USER_DATAS.userId + "_VipUpgrade_LocalStorage", "" + GlobalCfg.USER_DATAS.userVip.level);
    } else {
      var level = Number(localStorage);
      if (GlobalCfg.USER_DATAS.userVip.level > level) {
        this.sprite_icon.spriteFrame = this.atlas_icon.getSpriteFrame("" + level);
        this.spine_upgrade.setCompleteListener(function () {
          if (CommonFun.getInstance().isValidForScr(_this)) {
            _this.spine_upgrade.setSkin("default");
            _this.spine_upgrade.animation = null;
            _this.sprite_icon.spriteFrame = _this.atlas_icon.getSpriteFrame("" + GlobalCfg.USER_DATAS.userVip.level);
          }
          ;
        });
        GlobalCfg.G_COMPONENTS.Audio.playSoundByNameInResources("vipSound/vipUpgrade", false);
        this.spine_upgrade.setAnimation(0, "animation", false);
        cc.sys.localStorage.setItem(GlobalCfg.USER_DATAS.userId + "_VipUpgrade_LocalStorage", "" + GlobalCfg.USER_DATAS.userVip.level);
      } else {
        this.sprite_icon.spriteFrame = this.atlas_icon.getSpriteFrame("" + GlobalCfg.USER_DATAS.userVip.level);
      }
    }
    ;
  },
  onEventMsg: function onEventMsg(webData, target) {
    var self = target;
    var msgId = webData.msgCode;
    var notify = webData.msgData;
    if (GlobalCfg.CLIENT_MSG_ID.VIP_TAKE_WELFARE === msgId) {
      self.dealVipTakeWelfare(notify);
    } else if (GlobalCfg.CLIENT_MSG_ID.VIP_INFO_UPDATE === msgId) {
      self.setVipInfo();
      self.setUpgradeVipAnim();
    }
    ;
  },
  btnClick: function btnClick(btn) {
    var btnName = btn.node.name;
    switch (btnName) {
      case "btn_close":
        GlobalCfg.G_COMPONENTS.Audio.playBack();
        this.dealBtnCloseEvent();
        return;
      case "btn_vipService":
        this.dealBtnVipServiceEvent();
        break;
      case "btn_vipRight":
        this.dealBtnVipRightEvent();
        break;
      case "btn_vipLeft":
        this.dealBtnVipLeftEvent();
        break;
      case "btn_luckyDraw":
        this.dealBtnLuckyDrawEvent();
        break;
      case "btn_forOnce":
        this.dealBtnForOnceEvent();
        break;
      case "btn_addCash":
        this.dealBtnAddCashEvent();
        break;
      case "btn_toBet":
        this.dealBtnToBetEvent();
        break;
      case "btn_rules":
        this.dealBtnRulesEvent();
        break;
      case "btn_benefitsTips":
        this.dealBtnBenefitsEvent();
        break;
      default:
        break;
    }
    GlobalCfg.G_COMPONENTS.Audio.playButton();
  },
  dealBtnCloseEvent: function dealBtnCloseEvent() {
    this.node.destroy();
  },
  dealBtnVipServiceEvent: function dealBtnVipServiceEvent() {
    var channel_info = _extends({}, GlobalCfg.USER_DATAS.customerService);
    var whatsAppInfos = channel_info.whatsApp.split(',');
    var mobileNum = whatsAppInfos[0].match(/\d+/g);
    APPManager.skipToOtherApp("com.whatsapp", "https://api.whatsapp.com/send?phone=" + mobileNum);
  },
  dealBtnVipRightEvent: function dealBtnVipRightEvent() {
    this.showBenifitsByLevel(this.selectVipLevel + 1, true);
  },
  dealBtnVipLeftEvent: function dealBtnVipLeftEvent() {
    this.showBenifitsByLevel(this.selectVipLevel - 1, true);
  },
  dealBtnLuckyDrawEvent: function dealBtnLuckyDrawEvent() {
    CommonFun.getInstance().showVipLuckyDraw();
  },
  dealBtnForOnceEvent: function dealBtnForOnceEvent() {
    CommonFun.getInstance().showVipForOnceToast();
  },
  dealBtnAddCashEvent: function dealBtnAddCashEvent() {
    if (!GlobalCfg.USER_DATAS.openModules.includes(4)) {
      CommonFun.getInstance().showMsgBox("Not yet open", "YES_ON", function () {}, false);
      return;
    }
    ;
    CommonFun.getInstance().showNewShop(true, GlobalCfg.SHOP_RECHARGE_FROM.MyVipAddCash);
  },
  dealBtnToBetEvent: function dealBtnToBetEvent() {
    this.node.destroy();
  },
  dealBtnRulesEvent: function dealBtnRulesEvent() {
    CommonFun.getInstance().showVipRules("vipRules");
  },
  dealBtnBenefitsEvent: function dealBtnBenefitsEvent() {
    CommonFun.getInstance().showVipRules("benefits");
  },
  showBenifitsByLevel: function showBenifitsByLevel(level, isShowLevelIcon) {
    var _this2 = this;
    this.node_benifits.destroyAllChildren();
    var lastBenifits = null;
    var curBenifits = null;
    var nextBenifits = null;
    for (var i = 0, len = this.vipDataList.length; i < len; i++) {
      var element = this.vipDataList[i];
      if (element.level === level - 1) {
        lastBenifits = element;
      }
      ;
      if (element.level === level) {
        curBenifits = element;
      }
      ;
      if (element.level === level + 1) {
        nextBenifits = element;
      }
      ;
    }
    ;
    if (!curBenifits) {
      return;
    }
    ;
    this.selectVipLevel = curBenifits.level;
    var timestamp = GlobalCfg.USER_DATAS.userVip.system_time;
    if (GlobalCfg.USER_DATAS.userVip.level == curBenifits.level && timestamp < GlobalCfg.USER_DATAS.userVip.expires_time) {
      this.btn_icon.interactable = true;
      this.btn_icon.enableAutoGrayEffect = false;
      if (this.expiresTimer) {
        clearInterval(this.expiresTimer);
        this.expiresTimer = null;
      }
      ;
      this.expiresTimer = setInterval(function () {
        timestamp += 1;
        if (timestamp >= GlobalCfg.USER_DATAS.userVip.expires_time) {
          if (CommonFun.getInstance().isValidForScr(_this2)) {
            _this2.btn_icon.interactable = false;
            _this2.btn_icon.enableAutoGrayEffect = true;
            clearInterval(_this2.expiresTimer);
            _this2.expiresTimer = null;
            CommonFun.getInstance().showTips("Your VIP has expired, you can activate it after recharging!");
          }
          ;
          return;
        }
        ;
      }, 1000);
    } else {
      this.btn_icon.interactable = false;
      this.btn_icon.enableAutoGrayEffect = true;
      if (this.expiresTimer) {
        clearInterval(this.expiresTimer);
        this.expiresTimer = null;
      }
      ;
    }
    ;

    /**
     *  日领取
     */
    if (curBenifits.dayTake > 0) {
      var node = cc.instantiate(this.prefab_benifitsItem);
      var scr = node.getComponent("BenefitsItemCtrl");
      scr.setBenifitsItemData(5, curBenifits);
      this.node_benifits.addChild(node);
    }
    ;
    /**
     *  周领取
     */
    if (curBenifits.weekTake > 0) {
      var _node = cc.instantiate(this.prefab_benifitsItem);
      var _scr = _node.getComponent("BenefitsItemCtrl");
      _scr.setBenifitsItemData(4, curBenifits);
      this.node_benifits.addChild(_node);
    }
    ;
    /**
     *  月领取
     */
    if (curBenifits.monthTake > 0) {
      var _node2 = cc.instantiate(this.prefab_benifitsItem);
      var _scr2 = _node2.getComponent("BenefitsItemCtrl");
      _scr2.setBenifitsItemData(3, curBenifits);
      this.node_benifits.addChild(_node2);
    }
    ;
    /**
     *  提现总额
     */
    if (curBenifits.withdrawTotalLimit > 0) {
      var _node3 = cc.instantiate(this.prefab_benifitsItem);
      var _scr3 = _node3.getComponent("BenefitsItemCtrl");
      _scr3.setBenifitsItemData(2, curBenifits);
      this.node_benifits.addChild(_node3);
    }
    ;
    /**
     * 提现次数
     */
    if (curBenifits.dayWithdrawCountLimit > 0) {
      var _node4 = cc.instantiate(this.prefab_benifitsItem);
      var _scr4 = _node4.getComponent("BenefitsItemCtrl");
      _scr4.setBenifitsItemData(1, curBenifits);
      this.node_benifits.addChild(_node4);
    }
    ;
    /** 
     * 扭蛋机次数
     */
    if (curBenifits.gachaCount > 0) {
      var _node5 = cc.instantiate(this.prefab_benifitsItem);
      var _scr5 = _node5.getComponent("BenefitsItemCtrl");
      _scr5.setBenifitsItemData(11, curBenifits);
      this.node_benifits.addChild(_node5);
    }
    ;
    /**
     *  快速升级礼包
     */
    if (curBenifits.upgradeBagId > 0) {
      var _node6 = cc.instantiate(this.prefab_benifitsItem);
      var _scr6 = _node6.getComponent("BenefitsItemCtrl");
      _scr6.setBenifitsItemData(10, curBenifits);
      this.node_benifits.addChild(_node6);
    }
    ;
    /**
     * 专属客服
     */
    if (curBenifits.exService) {
      var _node7 = cc.instantiate(this.prefab_benifitsItem);
      var _scr7 = _node7.getComponent("BenefitsItemCtrl");
      _scr7.setBenifitsItemData(7, curBenifits);
      this.node_benifits.addChild(_node7);
      this.btn_vipService.node.active = Object.values(GlobalCfg.USER_DATAS.customerService).length > 0 && Object.values(GlobalCfg.USER_DATAS.customerService).join("").length > 0 ? true : false;
    } else {
      this.btn_vipService.node.active = false;
    }
    ;
    /**
     * 贵宾席
     */
    if (curBenifits.vipSeats) {
      var _node8 = cc.instantiate(this.prefab_benifitsItem);
      var _scr8 = _node8.getComponent("BenefitsItemCtrl");
      _scr8.setBenifitsItemData(6, curBenifits);
      this.node_benifits.addChild(_node8);
    }
    ;
    this.sprite_icon.spriteFrame = isShowLevelIcon == true ? this.atlas_icon.getSpriteFrame("" + curBenifits.level) : null;
    this.lab_vipLevel.string = "VIP " + curBenifits.level;
    if (nextBenifits) {
      this.btn_vipRight.interactable = true;
      this.btn_vipRight.enableAutoGrayEffect = false;
      this.lab_nextLevelTips.string = "Recharge " + nextBenifits.recharge / 100 + " to become VIP" + (level + 1);
      this.lab_nextLevelProgress.string = GlobalCfg.USER_DATAS.userVip.recharged / 100 + "/" + nextBenifits.recharge / 100;
      this.progressBar_nextLevel.progress = GlobalCfg.USER_DATAS.userVip.recharged / nextBenifits.recharge;
    } else {
      this.btn_vipRight.interactable = false;
      this.btn_vipRight.enableAutoGrayEffect = true;
      this.lab_nextLevelTips.string = "Unlock more level";
      this.lab_nextLevelProgress.string = GlobalCfg.USER_DATAS.userVip.recharged / 100 + "/-";
      this.progressBar_nextLevel.progress = 0;
    }
    ;
    this.lab_nextLevelProgress.node.active = false;
    if (lastBenifits) {
      this.btn_vipLeft.interactable = true;
      this.btn_vipLeft.enableAutoGrayEffect = false;
    } else {
      this.btn_vipLeft.interactable = false;
      this.btn_vipLeft.enableAutoGrayEffect = true;
    }
    ;
  },
  dealVipTakeWelfare: function dealVipTakeWelfare(notify) {
    var timestamp = GlobalCfg.USER_DATAS.userVip.system_time;
    if (timestamp >= GlobalCfg.USER_DATAS.userVip.expires_time) {
      CommonFun.getInstance().showMsgBox('Your VIP has expired , you can activate it after recharging !', 'ADDCASH', function () {
        CommonFun.getInstance().showNewShop(false, GlobalCfg.SHOP_RECHARGE_FROM.VipExpired);
      }, false);
      return;
    }
    ;
    if (notify.type == "day" || notify.type == "week" || notify.type == "month") {
      var httpUrl = GlobalCfg.HTTP_SERVER + "/v1/vip/takewelfare/" + notify.type;
      var httpParam = {};
      CommonFun.getInstance().httpPost(httpUrl, httpParam, function (strInfo) {
        if (strInfo && strInfo.data) {
          var take = strInfo.data.take;
          for (var i = 0, len = take.length; i < len; i++) {
            var element = take[i];
            var id = element.id;
            var amount = element.amount;
            if (id == 10) {
              GlobalCfg.USER_DATAS.deposit += amount;
              GlobalCfg.USER_DATAS.userDiamond += amount;
              CommonFun.getInstance().showVipRewardToast(amount / 100, false);
            } else if (id == 11) {
              GlobalCfg.USER_DATAS.winnings += amount;
              GlobalCfg.USER_DATAS.userDiamond += amount;
              CommonFun.getInstance().showVipRewardToast(amount / 100, false);
            } else if (id == 12) {
              GlobalCfg.USER_DATAS.bonus += amount;
              CommonFun.getInstance().showVipRewardToast(amount / 100, true);
            }
            ;
          }
          ;
          ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, {
            msgCode: GlobalCfg.CLIENT_MSG_ID.VIP_REWARD,
            msgData: {}
          });
        } else {
          CommonFun.getInstance().showTips(strInfo.msg);
        }
        ;
        httpUrl = GlobalCfg.HTTP_SERVER + "/v1/vip/info";
        CommonFun.getInstance().httpGet(httpUrl, function (strInfo) {
          if (strInfo && strInfo.data) {
            GlobalCfg.USER_DATAS.userVip = strInfo.data.user_vip;
            ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, {
              msgCode: GlobalCfg.CLIENT_MSG_ID.VIP_INFO_UPDATE,
              msgData: {}
            });
          }
          ;
        }, null, GlobalCfg.USER_DATAS.BearerToken);
      }, null, GlobalCfg.USER_DATAS.BearerToken);
    }
    ;
  }
});

cc._RF.pop();