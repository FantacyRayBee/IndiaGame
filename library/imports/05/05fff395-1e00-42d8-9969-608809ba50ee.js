"use strict";
cc._RF.push(module, '05fffOVHgBC2JlpYIgJulDu', 'horseRaceRuleCtrl');
// horseRaceGame/horseScr/horseRaceRuleCtrl.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {},
  onLoad: function onLoad() {
    var btnArr = this.node.getComponentsInChildren(cc.Button);
    for (var i = 0; i < btnArr.length; i++) {
      btnArr[i].node.on("click", this.btnClick, this);
    }
  },
  start: function start() {},
  btnClick: function btnClick(button) {
    GlobalCfg.G_COMPONENTS.Audio.playButton();
    this.node.destroy();
  }

  // update (dt) {},
});

cc._RF.pop();