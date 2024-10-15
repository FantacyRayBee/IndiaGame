"use strict";
cc._RF.push(module, 'ae942Ifn65B5q1Iv3IGsfx0', 'ShopInstructionsEnumItemCtrl');
// ResourcesBundle/NewPlan/Shop/ShopInstructionsEnumItemCtrl.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    lab_btnTips: cc.Label
  },
  onLoad: function onLoad() {
    this.node.on('click', CommonFun.getInstance().debounce(this.btnClickCall, 1), this);
  },
  btnClickCall: function btnClickCall(btn) {
    GlobalCfg.G_COMPONENTS.Audio.playButton();
    this.zhuKeFuCtrl && this.zhuKeFuCtrl.clickEnumItemCall(this.enumType);
  },
  setZhuKeFuCtrl: function setZhuKeFuCtrl(zhuKeFuCtrl) {
    this.zhuKeFuCtrl = zhuKeFuCtrl;
  },
  setBtnTipsEumeType: function setBtnTipsEumeType(enumType) {
    this.enumType = enumType;
  },
  setBtnTipsLanguageType: function setBtnTipsLanguageType(languageType) {
    this.languageType = languageType;
  },
  showBtnTipsStr: function showBtnTipsStr() {
    this.lab_btnTips.string = this.zhuKeFuCtrl[this.languageType]["enum_" + this.enumType];
  }
});

cc._RF.pop();