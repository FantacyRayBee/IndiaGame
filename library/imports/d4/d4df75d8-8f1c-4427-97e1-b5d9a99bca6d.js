"use strict";
cc._RF.push(module, 'd4df7XYjxxEJ5fhtdmpm8pt', 'tishiCtrl');
// Rummy/rummyScript/tishiCtrl.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    lab_tishi: cc.Label
  },
  onLoad: function onLoad() {},
  setTishi: function setTishi(content) {
    if (this.lab_tishi) {
      this.lab_tishi.string = content;
    }
    return;
  },
  removeFromParentNode: function removeFromParentNode(parentNode) {
    parentNode.removeChild(this.node);
  },
  start: function start() {} // update (dt) {},
});

cc._RF.pop();