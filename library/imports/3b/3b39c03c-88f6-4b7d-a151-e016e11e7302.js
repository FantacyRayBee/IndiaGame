"use strict";
cc._RF.push(module, '3b39cA8iPZLfaFR4BbhHnMC', '7s7xLanguageCtrl');
// 7up7downGame/7upScript/7s7xLanguageCtrl.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    // lab_name : cc.Label
  },
  onLoad: function onLoad() {
    this.AllLabelNode();
    this.msgHandle = ClientNotify.register(GlobalCfg.MSG_TYPE.clientMsg, this.onEventMsg, this);
  },
  onDestroy: function onDestroy() {
    ClientNotify.removeByHandle(GlobalCfg.MSG_TYPE.clientMsg, this.msgHandle);
  },
  onEventMsg: function onEventMsg(webData, target) {
    var self = target;
    var msgId = webData.msgCode;
    var notify = webData.msgData;
    if (msgId == GlobalCfg.CLIENT_MSG_ID.NET_OPEN) {
      if (notify == 1 || notify == 2) {
        self.AllLabelNode();
      }
    }
  },
  showLabel: function showLabel(lab) {
    var name = lab.node.name;
    for (var key in updownLanguage) {
      if (Object.hasOwnProperty.call(updownLanguage, key)) {
        var arr = updownLanguage[key];
        if (name == arr[0]) {
          lab.string = arr[language];
        }
      }
    }
  },
  AllLabelNode: function AllLabelNode() {
    var sprites = this.node.getComponentsInChildren(cc.Label);
    for (var i = 0; i < sprites.length; i++) {
      var lab = sprites[i];
      this.showLabel(lab);
      LoggerUtil.getInstance().log("当前的的节点名字", this.node.name, "LABEL的名字", lab.node.name);
    }
  }
});

cc._RF.pop();