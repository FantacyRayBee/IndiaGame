"use strict";
cc._RF.push(module, '1920c/aot1Do5BKYtkQ9sKF', 'ShopInstructionsAnswerItemCtrl');
// ResourcesBundle/NewPlan/Shop/ShopInstructionsAnswerItemCtrl.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    lab_title: cc.Label
  },
  onLoad: function onLoad() {
    this.node.on('click', CommonFun.getInstance().debounce(this.btnClickCall, 0.5), this);
  },
  btnClickCall: function btnClickCall(btn) {
    GlobalCfg.G_COMPONENTS.Audio.playButton();
    this.zhuKeFuCtrl && this.zhuKeFuCtrl.clickAnswerItemCall(this.enumType, this.itemIndex);
  },
  setZhuKeFuCtrl: function setZhuKeFuCtrl(zhuKeFuCtrl) {
    this.zhuKeFuCtrl = zhuKeFuCtrl;
  },
  setAnswerItemEnumType: function setAnswerItemEnumType(enumType) {
    this.enumType = enumType;
  },
  setAnswerItemIndex: function setAnswerItemIndex(index) {
    this.itemIndex = index;
  },
  setAnswerLanguageType: function setAnswerLanguageType(languageType) {
    this.languageType = languageType;
  },
  showAnswerTitle: function showAnswerTitle() {
    this.lab_title.string = this.zhuKeFuCtrl[this.languageType]["answer_" + this.enumType][this.itemIndex];
  }
});

cc._RF.pop();