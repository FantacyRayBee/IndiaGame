"use strict";
cc._RF.push(module, 'd4148d4IKNM+6zcdN20zhNa', 'zeusChangeStateTipsCtrl');
// zeusGame/src/zeusChangeStateTipsCtrl.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    lab_win: cc.Label,
    node_freeNumTips: cc.Node,
    node_freeAllWin: cc.Node
  },
  ctor: function ctor() {
    this.isNormal = true;
  },
  setChangeStateData: function setChangeStateData(isNormal, labStr) {
    var _this = this;

    this.isNormal = isNormal;
    return new Promise(function (resolve, reject) {
      GlobalCfg.ACT_SCENE_CTRL.zeusAudiosCtrl.pauseMusic();
      _this.node_freeNumTips.active = isNormal;
      _this.node_freeAllWin.active = !isNormal;

      if (isNormal == true) {
        GlobalCfg.ACT_SCENE_CTRL.zeusAudiosCtrl.playFreeTipsShowEffect();

        _this.scheduleOnce(function () {
          GlobalCfg.ACT_SCENE_CTRL.zeusAudiosCtrl.playFreeTipsLongEffect(true);
        }, 1.5);

        _this.lab_win.string = "" + labStr;
      } else {
        GlobalCfg.ACT_SCENE_CTRL.zeusAudiosCtrl.playFreeFinishedResultShowEffect();

        _this.scheduleOnce(function () {
          GlobalCfg.ACT_SCENE_CTRL.zeusAudiosCtrl.playFreeFinishedResultLongEffect(false);
        }, 1);

        _this.scheduleOnce(function () {
          GlobalCfg.ACT_SCENE_CTRL.zeusAudiosCtrl.resumeMusic();
        }, 6);

        _this.lab_win.string = GlobalCfg.ACT_SCENE_CTRL.getCoinFormatStr(labStr);
      }

      ;

      _this.node.on("click", function () {
        _this.unscheduleAllCallbacks();

        GlobalCfg.ACT_SCENE_CTRL.zeusAudiosCtrl.playFreeFinishedEffect();
        GlobalCfg.ACT_SCENE_CTRL.zeusAudiosCtrl.resumeMusic();

        _this.node.destroy();

        resolve();
      }, _this);
    });
  },
  onDestroy: function onDestroy() {
    this.unscheduleAllCallbacks();
    var audioClipNameArr = ["freeFinishedResultLongEffect", "freeFinishedResultShow", "freeTipsLongEffect", "freeTipsShow"];

    for (var i = 0, len = audioClipNameArr.length; i < len; i++) {
      var audioClipName = audioClipNameArr[i];
      GlobalCfg.ACT_SCENE_CTRL.zeusAudiosCtrl.stopEffectByAudioClipName(audioClipName);
    }

    ;
  }
});

cc._RF.pop();