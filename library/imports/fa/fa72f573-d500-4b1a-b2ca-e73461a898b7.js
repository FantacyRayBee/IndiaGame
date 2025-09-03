"use strict";
cc._RF.push(module, 'fa72fVz1QBLGrLK5zRhqJi3', 'ContactUsCtrl');
// ResourcesBundle/NewPlan/ContactUs/ContactUsCtrl.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    btn_close: {
      "default": null,
      type: cc.Button
    },
    btn_copy: {
      "default": null,
      type: cc.Button
    },
    lab_content: cc.Label
  },
  onLoad: function onLoad() {
    this.email = GlobalCfg.USER_DATAS.customerService.email.length > 0 ? GlobalCfg.USER_DATAS.customerService.email : "teenpattikayu01@gmail.com";
    this.lab_content.string = this.email;
    this.btn_close.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
    this.btn_copy.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
  },
  onDestroy: function onDestroy() {
    CommonFun.getInstance().releasePrefab(GlobalCfg.PREFAB_PATH.CONTACTUS);
  },
  btnClick: function btnClick(sender) {
    var btnName = sender.node.name;
    if (btnName == "btn_close") {
      GlobalCfg.G_COMPONENTS.Audio.playBack();
      this.node.destroy();
    } else if (btnName == "btn_copy") {
      GlobalCfg.G_COMPONENTS.Audio.playButton();
      if (cc.sys.isBrowser) {
        this.webCopyString(this.email, "Email Copied Successfully");
      } else {
        APPManager.copyToPasteBoard(this.email);
        CommonFun.getInstance().showTips("Email Copied Successfully");
      }
      this.node.destroy();
    }
    ;
  },
  webCopyString: function webCopyString(str, subsc) {
    var input = str;
    var el = document.createElement('textarea');
    el.value = input;
    el.setAttribute('readonly', '');
    el.style.contain = 'strict';
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    el.style.fontSize = '12pt'; // Prevent zooming on iOS

    var selection = getSelection();
    var originalRange = false;
    if (selection.rangeCount > 0) {
      originalRange = selection.getRangeAt(0);
    }
    document.body.appendChild(el);
    el.select();
    el.selectionStart = 0;
    el.selectionEnd = input.length;
    var success = false;
    try {
      success = document.execCommand('copy');
      CommonFun.getInstance().showTips(subsc);
    } catch (err) {}
    document.body.removeChild(el);
    if (originalRange) {
      selection.removeAllRanges();
      selection.addRange(originalRange);
    }
    return success;
  }
});

cc._RF.pop();