"use strict";
cc._RF.push(module, 'be04cVX9u5HYqPcal/cz6kD', 'ProgressCtrl');
// ResourcesBundle/NewPlan/Progress/ProgressCtrl.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    lab_content: {
      "default": null,
      type: cc.Label
    }
  },
  setContent: function setContent(str) {
    if (str === void 0) {
      str = "";
    }

    this.lab_content.string = str;
  }
});

cc._RF.pop();