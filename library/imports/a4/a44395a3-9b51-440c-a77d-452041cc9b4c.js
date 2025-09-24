"use strict";
cc._RF.push(module, 'a4439Wjm1FEDKd9RSBBzJtM', 'recordBallCtrl');
// horseRaceGame/horseScr/recordBallCtrl.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {},
  onLoad: function onLoad() {},
  start: function start() {},
  setID: function setID(id) {
    if (CommonFun.getInstance().isValidForScr(this) && this.node.getChildByName("num_0" + id)) {
      this.node.getChildByName("num_0" + id).active = true;
    }

    ;
  },
  setNewState: function setNewState(state) {
    this.node.getChildByName("NEW").active = state;
  },
  setParticleState: function setParticleState(state) {}
});

cc._RF.pop();