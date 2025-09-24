"use strict";
cc._RF.push(module, '1c074OMR3FBfpzjA0o+paOY', 'TipsCtrl');
// ResourcesBundle/NewPlan/Tips/TipsCtrl.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    label: {
      "default": null,
      type: cc.Label
    },
    bgNode: {
      "default": null,
      type: cc.Node
    }
  },
  ctor: function ctor() {
    this._rotation = 0;
  },
  onLoad: function onLoad() {
    var size = this.label.node.getContentSize();
    this.bgNode.setContentSize(cc.size(700, size.height / 50 * 100));
  },
  onDestroy: function onDestroy() {
    clearTimeout(this.showContentTimeId);
    CommonFun.getInstance().releasePrefab(GlobalCfg.PREFAB_PATH.TIPS);
  },
  setContent: function setContent(str) {
    this.label.string = str;
    clearTimeout(this.showContentTimeId);
    this.showContentTimeId = setTimeout(this.showConten.bind(this), 1500);
  },
  showConten: function showConten() {
    clearTimeout(this.showContentTimeId);
    this.node.destroy();
  },
  sliceStr: function sliceStr(str) {
    var _this = this;

    var bgNodeHeight = 50;
    var newStr = '';
    var strArr = str.split("\n");

    if (strArr && strArr.length > 0) {
      for (var i = 0; i < strArr.length; i++) {
        newStr += strArr[i];
        newStr += "\n";
        bgNodeHeight += 40;
      }

      ;
    }

    ;
    this.scheduleOnce(function () {
      if (str && _this && _this.label && _this.bgNode) {
        _this.label.node.active = true;
        _this.bgNode.active = true;
        _this.label.string = str;
        _this.bgNode.height = bgNodeHeight;
      }
    }, 0);
  }
});

cc._RF.pop();