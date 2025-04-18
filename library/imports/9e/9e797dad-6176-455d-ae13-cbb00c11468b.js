"use strict";
cc._RF.push(module, '9e7972tYXZFXa4Ty7AMEUaL', 'MsgBoxCtrl');
// ResourcesBundle/NewPlan/MsgBox/MsgBoxCtrl.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    lab_content: {
      "default": null,
      type: cc.Label
    },
    btn_close: {
      "default": null,
      type: cc.Button
    },
    btn_yes: {
      "default": null,
      type: cc.Button
    },
    btn_no: {
      "default": null,
      type: cc.Button
    }
  },
  ctor: function ctor() {
    this.yesCallFun = null;
    this.noCallFun = null;
  },
  onLoad: function onLoad() {
    this.btn_close.node.on('click', this.btnClick, this);
    this.btn_yes.node.on('click', this.btnClick, this);
    this.btn_no.node.on('click', this.btnClick, this);
  },
  btnClick: function btnClick(button) {
    var btnName = button.node.name;
    if (btnName === "btn_close") {
      GlobalCfg.G_COMPONENTS.Audio.playBack();
    } else {
      GlobalCfg.G_COMPONENTS.Audio.playButton();
      if (btnName === "btn_yes") {
        this.yesCallFun && this.yesCallFun();
      } else if (btnName === "btn_no") {
        this.noCallFun && this.noCallFun();
      }
      ;
    }
    ;
    this.node.destroy();
  },
  setContent: function setContent(content, msgBoxType, callFun, isShowCloseBtn, title, callFun2, horizontal) {
    this.yesCallFun = callFun;
    this.noCallFun = callFun2;
    this.btn_close.node.active = isShowCloseBtn;
    var btnStr_YES = this.btn_yes.target.getChildByName("lab_MsgBox_YES").getComponent(cc.Label);
    var btnStr_ON = this.btn_no.target.getChildByName("lab_MsgBox_ON").getComponent(cc.Label);
    this.lab_content.string = content;
    this.lab_content.horizontalAlign = horizontal;
    var typeUpperCase = msgBoxType.toUpperCase();
    if (typeUpperCase === "YES") {
      this.btn_no.node.active = false;
      this.btn_yes.node.active = true;
      this.btn_yes.node.x = 0;
      btnStr_YES.string = "Agree";
    } else if (typeUpperCase === "NO") {
      this.btn_no.node.active = true;
      this.btn_yes.node.active = false;
      this.btn_no.node.x = 0;
      btnStr_ON.string = "Cancel";
    } else if (typeUpperCase === "YES_NO" || typeUpperCase === "NO_YES") {
      this.btn_no.node.active = true;
      this.btn_yes.node.active = true;
      btnStr_YES.string = "Agree";
      btnStr_ON.string = "Cancel";
    } else if (typeUpperCase === "SHOP") {
      this.btn_no.node.active = true;
      this.btn_yes.node.active = true;
      btnStr_YES.string = "Add Cash";
      btnStr_ON.string = "Cancel";
    } else if (typeUpperCase === "ADDCASH") {
      this.btn_no.node.active = false;
      this.btn_yes.node.active = true;
      this.btn_yes.node.x = 0;
      btnStr_YES.string = "Add Cash";
    }
  },
  onDestroy: function onDestroy() {
    CommonFun.getInstance().releasePrefab(GlobalCfg.PREFAB_PATH.MSGBOX);
  }
});

cc._RF.pop();