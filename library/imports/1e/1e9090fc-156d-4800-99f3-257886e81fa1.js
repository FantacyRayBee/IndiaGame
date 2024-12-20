"use strict";
cc._RF.push(module, '1e909D8FW1IAJnzJXiG6B+h', 'VipRulesCtrl');
// ResourcesBundle/NewPlan/MyVip/VipRulesCtrl.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    btn_close: cc.Button,
    toggle_vipRules: cc.Toggle,
    toggle_benefits: cc.Toggle,
    toggle_levelUpGift: cc.Toggle,
    node_content: cc.Node
  },
  ctor: function ctor() {
    this.curChildViewType = "vipRules";
  },
  onLoad: function onLoad() {
    this.btn_close.node.on("click", CommonFun.getInstance().debounce(this.btnClick, 1), this);
    this.toggle_vipRules.node.on("toggle", this.toggleCallBack, this);
    this.toggle_benefits.node.on("toggle", this.toggleCallBack, this);
    this.toggle_levelUpGift.node.on("toggle", this.toggleCallBack, this);
  },
  start: function start() {
    switch (this.curChildViewType) {
      case "vipRules":
        this.dealToggleVipRulesEvent();
        this.toggle_vipRules.check();
        break;
      case "benefits":
        this.dealToggleBenefitsEvent();
        this.toggle_benefits.check();
        break;
      case "levelUpGift":
        this.dealToggleLevelUpGiftEvent();
        this.toggle_levelUpGift.check();
        break;
      default:
        break;
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
      default:
        break;
    }
  },
  toggleCallBack: function toggleCallBack(toggle) {
    var toggleName = toggle.node.name;
    GlobalCfg.G_COMPONENTS.Audio.playButton();
    switch (toggleName) {
      case "toggle_vipRules":
        this.dealToggleVipRulesEvent();
        break;
      case "toggle_benefits":
        this.dealToggleBenefitsEvent();
        break;
      case "toggle_levelUpGift":
        this.dealToggleLevelUpGiftEvent();
        break;
      default:
        break;
    }
  },
  dealBtnCloseEvent: function dealBtnCloseEvent() {
    this.node.destroy();
  },
  dealToggleVipRulesEvent: function dealToggleVipRulesEvent() {
    var _this = this;
    this.unscheduleAllCallbacks();
    this.node_content.destroyAllChildren();
    var prefabPromise = CommonFun.getInstance().loadPrefabByPromise(GlobalCfg.PREFAB_PATH.VIPRULESRULE);
    prefabPromise.then(function (prefab) {
      var node = cc.instantiate(prefab);
      _this.node_content.addChild(node);
    });
  },
  dealToggleBenefitsEvent: function dealToggleBenefitsEvent() {
    var _this2 = this;
    this.unscheduleAllCallbacks();
    this.node_content.destroyAllChildren();
    var prefabPromise = CommonFun.getInstance().loadPrefabByPromise(GlobalCfg.PREFAB_PATH.VIPRULESBENEFITS);
    prefabPromise.then(function (prefab) {
      var node = cc.instantiate(prefab);
      _this2.node_content.addChild(node);
    });
  },
  dealToggleLevelUpGiftEvent: function dealToggleLevelUpGiftEvent() {
    var _this3 = this;
    this.unscheduleAllCallbacks();
    this.node_content.destroyAllChildren();
    var prefabPromise = CommonFun.getInstance().loadPrefabByPromise(GlobalCfg.PREFAB_PATH.VIPRULESUPGIFT);
    prefabPromise.then(function (prefab) {
      var node = cc.instantiate(prefab);
      _this3.node_content.addChild(node);
    });
  },
  setVipRulesChildViewType: function setVipRulesChildViewType(childViewType) {
    this.curChildViewType = childViewType;
  },
  onDestroy: function onDestroy() {
    CommonFun.getInstance().releasePrefab(GlobalCfg.PREFAB_PATH.VIPRULES);
    CommonFun.getInstance().releasePrefab(GlobalCfg.PREFAB_PATH.VIPRULESRULE);
    CommonFun.getInstance().releasePrefab(GlobalCfg.PREFAB_PATH.VIPRULESBENEFITS);
    CommonFun.getInstance().releasePrefab(GlobalCfg.PREFAB_PATH.VIPRULESUPGIFT);
  }
});

cc._RF.pop();