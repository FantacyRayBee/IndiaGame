"use strict";
cc._RF.push(module, '1ebcfGlwXJMTb1P1eH5+sLF', 'tishi_finishCtrl');
// Rummy/rummyScript/tishi_finishCtrl.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    lab_tishi: cc.Label,
    btn_declare: cc.Button
  },
  // LIFE-CYCLE CALLBACKS:
  onLoad: function onLoad() {
    this.btn_declare.node.on("click", this.btnClick, this);
  },
  btnClick: function btnClick(button) {
    ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, {
      msgCode: "agreeDeclare",
      msgData: {}
    });
  },
  setDeClareContent: function setDeClareContent(content) {
    this.lab_tishi.string = content;
  },
  start: function start() {} // update (dt) {},
});

cc._RF.pop();