"use strict";
cc._RF.push(module, '14486VYXAJO9pwc3M95Ii9i', 'skeAimPlayCtrl');
// baccarat3PattiGame/src/skeAimPlayCtrl.js

"use strict";

cc.Class({
  "extends": cc.Component,

  /**
   * 播放开始下注动画
   * @param {动画播完回调事件} fun 
   */
  playStartAim: function playStartAim() {
    var self = GlobalCfg.ACT_SCENE_CTRL;
    self.ske_start.active = true;
    self.soundPlayCtrl.playGameSound('VS');
    var ske_start = self.ske_start.getComponent(sp.Skeleton);
    ske_start.setAnimation(0, "animation", false);
    ske_start.setCompleteListener(function (trackEntry, loopCount) {
      var name = trackEntry.animation.name;

      if (name == "animation") {
        self.ske_start.active = false;
      }
    });
  },

  /**
   * 播放框的动画
  * @param {红闪还是蓝闪} winType 
   */
  playKuangAim: function playKuangAim(winType) {
    var pos = winType == 7 ? cc.v2(138, 292) : cc.v2(-140, 292);
    var self = GlobalCfg.ACT_SCENE_CTRL;
    self.ske_kuang.active = true;
    self.ske_kuang.setPosition(pos);
    var ske_kuang = self.ske_kuang.getComponent(sp.Skeleton);
    ske_kuang.setAnimation(0, "chuxian", true);
    this.scheduleOnce(function () {
      ske_kuang.setAnimation(0, "chixu", true);
    }, 2);
  },

  /**
   * 游戏结束后框闪烁
   * @param {小框坐标下标} winSide 
   * @param {大框坐标下标} winBlueRed 
   */
  kuangBlinkAct: function kuangBlinkAct(winSide, winBlueRed, time) {
    if (time === void 0) {
      time = 5;
    }

    var self = GlobalCfg.ACT_SCENE_CTRL;
    var smallArr = [cc.v2(371, -136), cc.v2(186, -136), cc.v2(0, -136), cc.v2(-186, -136), cc.v2(-371, -136), cc.v2(0, 0)];
    var maxPos = winBlueRed == 7 ? cc.v2(233, 44) : cc.v2(-233, 44);
    self.wimAct_01.active = true;
    self.wimAct_01.setPosition(maxPos);
    cc.tween(self.wimAct_01).blink(time, 6).call(function () {
      self.wimAct_01.active = false;
    }).start();

    if (winSide != 5) {
      // 高牌直接忽略
      self.wimAct_02.active = true;
      self.wimAct_02.setPosition(smallArr[winSide]);
      cc.tween(self.wimAct_02).blink(time, 6).call(function () {
        self.wimAct_02.active = false;
      }).start();
    }
  },

  /**
   * 初始化框闪烁
   */
  setKuang: function setKuang() {
    var self = GlobalCfg.ACT_SCENE_CTRL;

    if (self.node) {
      if (self.wimAct_01 && self.wimAct_01.active) self.wimAct_01.active = false;
      if (self.wimAct_02 && self.wimAct_02.active) self.wimAct_02.active = false;
      if (self.ske_kuang && self.ske_kuang.active) self.ske_kuang.active = false;
    }
  }
});

cc._RF.pop();