"use strict";
cc._RF.push(module, 'b371c0beVlOaKqO4pCsV8NN', 'zeusCellCtrl');
// zeusGame/src/zeusCellCtrl.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    skeleton_animIcon: sp.Skeleton,
    skeleton_outLine: sp.Skeleton,
    skeleton_boom: sp.Skeleton,
    lab_mul: cc.Label,
    skeletonData_1: sp.SkeletonData,
    skeletonData_3: sp.SkeletonData,
    skeletonData_4: sp.SkeletonData,
    skeletonData_5: sp.SkeletonData,
    skeletonData_6: sp.SkeletonData,
    skeletonData_7: sp.SkeletonData,
    skeletonData_8: sp.SkeletonData,
    skeletonData_9: sp.SkeletonData,
    skeletonData_10: sp.SkeletonData,
    skeletonData_11: sp.SkeletonData,
    skeletonData_12: sp.SkeletonData
  },
  ctor: function ctor() {
    this.cellData = null;
  },
  onLoad: function onLoad() {
    this.skeleton_animIcon.node.active = false;
    this.skeleton_outLine.node.active = false;
    this.skeleton_boom.node.active = false;
    this.lab_mul.string = "";
  },
  reSetting: function reSetting() {
    this.cellData = null;
    this.skeleton_animIcon.node.active = false;
    this.skeleton_outLine.node.active = false;
    this.skeleton_boom.node.active = false;
    this.lab_mul.string = "";
  },
  setItemData: function setItemData(cellData) {
    if (!cellData) {
      return;
    }
    ;
    this.cellData = cellData;
    var elf = cellData.elf; // 元素内容
    var x = cellData.x; // 附加属性:X倍数
    var read = cellData.read; // 已读

    if (elf == 0 || elf == 2) {
      LoggerUtil.getInstance().warn("setItemData: Elf " + elf + " exceeds the scope of use");
      return;
    }
    ;
    var animationName = 'Standby';
    if (elf == 12) {
      if (x <= 8) {
        animationName = 'VStandby';
      } else if (x <= 20) {
        animationName = 'LStandby';
      } else if (x <= 100) {
        animationName = 'HStandby';
      } else {
        animationName = 'ZiStandby';
      }
    }
    ;
    this.skeleton_animIcon.node.active = true;
    this.skeleton_animIcon.skeletonData = this["skeletonData_" + elf];
    this.skeleton_animIcon.defaultSkin = 'default';
    this.skeleton_animIcon.setAnimation(0, animationName, true);
    if (elf == 12 && x > 1) {
      this.lab_mul.string = x + "X";
    } else {
      this.lab_mul.string = "";
    }
    ;
  },
  playScatterShowAnim: function playScatterShowAnim() {
    this.skeleton_animIcon.setAnimation(0, 'Show', false);
  },
  playAccumulatePowerAnims: function playAccumulatePowerAnims() {
    var _this = this;
    if (this.cellData.elf != 1) {
      this.playSkeletonOutLineAnim();
    }
    ;
    var animArr = [this.playSkeletonIconTriggerAnim(this.cellData.elf, this.cellData.x)];
    return new Promise(function (resolve, reject) {
      Promise.all(animArr).then(function () {
        _this.skeleton_outLine.node.active = false;
        _this.skeleton_animIcon.node.active = false;
        resolve();
      });
    });
  },
  playBoomAnim: function playBoomAnim() {
    var _this2 = this;
    return new Promise(function (resolve, reject) {
      _this2.skeleton_boom.node.active = true;
      _this2.skeleton_boom.setCompleteListener(function (trackEntry, loopCount) {
        resolve();
      });
      _this2.skeleton_boom.timeScale = 0.67;
      _this2.skeleton_boom.defaultSkin = 'default';
      _this2.skeleton_boom.setAnimation(0, 'animation', false);
    });
  },
  playMulAnims: function playMulAnims() {
    var _this3 = this;
    return new Promise(function (resolve, reject) {
      if (_this3.cellData.elf != 12) {
        resolve();
        return;
      }
      ;
      var animArr = [_this3.playSkeletonIconTriggerAnim(_this3.cellData.elf, _this3.cellData.x)];
      Promise.all(animArr).then(function () {
        resolve();
      });
    });
  },
  playSkeletonOutLineAnim: function playSkeletonOutLineAnim() {
    this.skeleton_outLine.node.active = true;
    this.skeleton_outLine.timeScale = 1.6;
    this.skeleton_outLine.defaultSkin = 'default';
    this.skeleton_outLine.setAnimation(0, 'animation', true);
  },
  playSkeletonIconTriggerAnim: function playSkeletonIconTriggerAnim(elf, x) {
    var _this4 = this;
    return new Promise(function (resolve, reject) {
      if (elf == 0) {
        resolve();
        return;
      }
      ;
      var animationName = 'Pay';
      if (elf == 1) {
        animationName = 'Trigger';
      } else if (elf == 12) {
        if (x <= 8) {
          animationName = 'V';
        } else if (x <= 20) {
          animationName = 'Lan';
        } else if (x <= 100) {
          animationName = 'Hong';
        } else {
          animationName = 'Zi';
        }
      }
      ;
      _this4.skeleton_animIcon.node.active = true;
      _this4.skeleton_animIcon.setCompleteListener(function (trackEntry, loopCount) {
        resolve();
      });
      _this4.skeleton_animIcon.timeScale = 1.3;
      _this4.skeleton_animIcon.skeletonData = _this4["skeletonData_" + elf];
      _this4.skeleton_animIcon.defaultSkin = 'default';
      _this4.skeleton_animIcon.setAnimation(0, animationName, false);
    });
  },
  getLabMultiNode: function getLabMultiNode() {
    return this.lab_mul.node;
  }
});

cc._RF.pop();