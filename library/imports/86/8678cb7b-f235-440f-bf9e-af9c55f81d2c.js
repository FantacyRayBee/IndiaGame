"use strict";
cc._RF.push(module, '8678ct78jVED7+er5xV+B0s', 'WithDrawShareCtrl');
// ResourcesBundle/NewPlan/WithDrawShare/WithDrawShareCtrl.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    btnClose: cc.Button,
    btnShare: cc.Button
  },
  start: function start() {
    var _this = this;

    this.btnClose.node.on('click', function () {
      _this.node.destroy();
    });
    this.btnShare.node.on('click', function () {
      var shareUrl = "Your cash will expire in three hours, download the No.1 card game in India to receive your cash, do not let it go\uFF01 " + GlobalCfg.APP_SHARE_URL + "?inviteCode=" + GlobalCfg.CHANNEL_INFO + "_" + GlobalCfg.USER_DATAS.inviteCode;
      APPManager.Share(shareUrl);

      _this.node.destroy();
    });
  }
});

cc._RF.pop();