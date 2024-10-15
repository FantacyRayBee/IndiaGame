"use strict";
cc._RF.push(module, '2369b18bPhGNohLbqMlp0ol', 'zeusRightAreaCtrl');
// zeusGame/src/zeusRightAreaCtrl.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    skeleton_role: sp.Skeleton
  },
  checkShiPei: function checkShiPei() {
    var w = cc.view.getVisibleSize().width;
    var x = (w / 2 - 470) / 2 + 470;
    this.node.x = x;
  },
  onLoad: function onLoad() {
    this.checkShiPei();
  },
  playRoleDongZuoAnim: function playRoleDongZuoAnim() {
    var _this = this;

    this.skeleton_role.defaultSkin = 'default';
    this.skeleton_role.timeScale = 0.8;
    this.skeleton_role.setAnimation(0, 'dongzuo', false);
    this.skeleton_role.setCompleteListener(function (trackEntry, loopCount) {
      var name = trackEntry.animation.name;

      if (name == 'dongzuo') {
        _this.playRoleDaiJiAnim();
      }
    });
  },
  playRoleDaiJiAnim: function playRoleDaiJiAnim() {
    this.skeleton_role.defaultSkin = 'default';
    this.skeleton_role.setAnimation(0, 'daiji', true);
  }
});

cc._RF.pop();