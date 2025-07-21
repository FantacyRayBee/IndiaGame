"use strict";
cc._RF.push(module, 'f09a8vW9GZILoHFRPa1070W', 'PrivacyPolicyCtrl');
// ResourcesBundle/NewPlan/PrivacyPolicy/PrivacyPolicyCtrl.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    btn_close: cc.Button,
    webView: cc.WebView
  },
  ctor: function ctor() {
    this.url = "";
  },
  onLoad: function onLoad() {
    var _this = this;
    this.webView.url = this.url;
    this.btn_close.node.on("click", function () {
      if (GlobalCfg.G_COMPONENTS.Audio) {
        GlobalCfg.G_COMPONENTS.Audio.playBack();
      }
      ;
      CommonFun.getInstance().decVerticalAcc();
      _this.node.destroy();
    }, this);
  },
  setUrlType: function setUrlType(urlType) {
    // this.url = urlType === 1 ? "https://download.tpgame.in/whwh/useragreement.html" : "https://download.tpgame.in/whwh/privacy.html";
    this.url = urlType === 1 ? "https://ledgister.in/gameweb/term-condition.html" : "https://ledgister.in/gameweb/private-policy.html";
  },
  onDestroy: function onDestroy() {
    CommonFun.getInstance().releasePrefab(GlobalCfg.PREFAB_PATH.PRIVACYPOLICY);
  }
});

cc._RF.pop();