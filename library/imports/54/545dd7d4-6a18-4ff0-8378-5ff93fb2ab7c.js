"use strict";
cc._RF.push(module, '545ddfUahhP8IN4X/k/sqt8', 'zeusFiresAreaCtrl');
// zeusGame/src/zeusFiresAreaCtrl.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    skeleton_fireArr: [sp.Skeleton],
    skeletonData_fireNormal: sp.SkeletonData,
    skeletonData_fireFree: sp.SkeletonData
  },
  setFireSpinFreeType: function setFireSpinFreeType() {
    var _this = this;

    this.skeleton_fireArr.forEach(function (skeleton_fire) {
      skeleton_fire.skeletonData = _this.skeletonData_fireFree;
      skeleton_fire.defaultSkin = 'default';
      skeleton_fire.setAnimation(0, 'animation', true);
    });
  },
  setFireSpinNormalType: function setFireSpinNormalType() {
    var _this2 = this;

    this.skeleton_fireArr.forEach(function (skeleton_fire) {
      skeleton_fire.skeletonData = _this2.skeletonData_fireNormal;
      skeleton_fire.defaultSkin = 'default';
      skeleton_fire.setAnimation(0, 'animation', true);
    });
  }
});

cc._RF.pop();