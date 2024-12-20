"use strict";
cc._RF.push(module, 'cdb5eKdGOVDsrO8Mtuj3+AY', 'selectedCtrl');
// Benz/BenzScript/selectedCtrl.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {},
  // LIFE-CYCLE CALLBACKS:
  onLoad: function onLoad() {
    this.sprSelected = this.node.getChildByName("spr_selected");
    this.sprSelectedAnim = this.node.getChildByName("spr_selectedAnim");
  },
  start: function start() {},
  setSelfOpacity: function setSelfOpacity(value, blink) {
    this.sprSelected.opacity = value;
    this.sprSelectedAnim.active = blink;
    if (blink) {
      this.sprSelected.active = false;
    }
  }

  // update (dt) {},
});

cc._RF.pop();