"use strict";
cc._RF.push(module, 'e9b97R7cYZFR5r1YLFfwQbb', 'zeusAudiosCtrl');
// zeusGame/src/zeusAudiosCtrl.js

"use strict";

cc.Class({
  "extends": require('AudioBase'),
  properties: {},
  ctor: function ctor() {
    this.audioClipMap = new Map();
    this.boomArr = ["boom1", "boom2", "boom3"];
    this.freeXuLiArr = ["freeXuLi1", "freeXuLi2", "freeXuLi3"];
    this.curBoomIndex = 0;
    this.curFreeXuLiIndex = 0;
    this.audioIdMap = new Map();
  },
  onLoad: function onLoad() {
    this.loadGameSound();
  },
  onDestroy: function onDestroy() {
    this.stopAllEffects();
  },
  loadGameSound: function loadGameSound() {
    var _this = this;

    CommonFun.getInstance().loadBundle('zeusGame', function (bundle) {
      bundle.loadDir('audios', cc.AudioClip, function (err, audioClipArr) {
        if (!err) {
          for (var i = 0, len = audioClipArr.length; i < len; i++) {
            var audioClip = audioClipArr[i];
            var audioClipName = audioClip.name;

            _this.audioClipMap.set(audioClipName, audioClip);
          }

          ;
        }

        ;
      });
    }, function (err) {
      LoggerUtil.getInstance().error("\u52A0\u8F7DzeusGame-bundle\u5F02\u5E38: " + JSON.stringify(err));
    });
  },
  _playEffect: function _playEffect(audioClipName, isLoop) {
    var _this2 = this;

    if (true == this.checkState('toggle_yinxiao')) {
      if (this.audioClipMap.has(audioClipName)) {
        var audioClip = this.audioClipMap.get(audioClipName);
        var audioId = this.playSound(audioClip, isLoop);
        this.audioIdMap.set(audioClipName, audioId);
        return;
      }

      ;
      CommonFun.getInstance().loadBundle('zeusGame', function (bundle) {
        bundle.load("audios/" + audioClipName, cc.AudioClip, function (err, audioClip) {
          if (!err) {
            var _audioClipName = audioClip.name;

            _this2.audioClipMap.set(_audioClipName, audioClip);

            var _audioId = _this2.playSound(audioClip, isLoop);

            _this2.audioIdMap.set(_audioClipName, _audioId);
          } else {
            LoggerUtil.getInstance().error("\u52A0\u8F7DzeusGame-" + audioClipName + "\u5F02\u5E381: " + JSON.stringify(err));
          }

          ;
        });
      }, function (err) {
        LoggerUtil.getInstance().error("\u52A0\u8F7DzeusGame-" + audioClipName + "\u5F02\u5E38: " + JSON.stringify(err));
      });
    }

    ;
  },
  _playMusic: function _playMusic(audioClipName, isLoop, volume) {
    var _this3 = this;

    if (isLoop === void 0) {
      isLoop = true;
    }

    volume = volume ? volume : 1;

    if (true == this.checkState('toggle_yinyun')) {
      if (this.audioClipMap.has(audioClipName)) {
        var audioClip = this.audioClipMap.get(audioClipName);
        this.playMusic(audioClip, isLoop, volume);
        return;
      }

      ;
      CommonFun.getInstance().loadBundle('zeusGame', function (bundle) {
        bundle.load("audios/" + audioClipName, cc.AudioClip, function (err, audioClip) {
          if (!err) {
            var _audioClipName2 = audioClip.name;

            _this3.audioClipMap.set(_audioClipName2, audioClip);

            _this3.playMusic(audioClip, isLoop, volume);
          } else {
            LoggerUtil.getInstance().error("\u52A0\u8F7DzeusGame-" + audioClipName + "\u5F02\u5E381: " + JSON.stringify(err));
          }
        });
      }, function (err) {
        LoggerUtil.getInstance().error("\u52A0\u8F7DzeusGame-" + audioClipName + "\u5F02\u5E38: " + JSON.stringify(err));
      });
    }

    ;
  },

  /**
   * 根据音效文件名停止播放该音效
   * @param {string} audioClipName 音效文件名
   */
  stopEffectByAudioClipName: function stopEffectByAudioClipName(audioClipName) {
    if (this.audioIdMap.has(audioClipName)) {
      var audioId = this.audioIdMap.get(audioClipName);

      if (this.getState(audioId) == cc.audioEngine.AudioState.PLAYING) {
        this.stopEffect(audioId);
      }

      ;
      this.audioIdMap["delete"](audioClipName);
    }

    ;
  },

  /**
   * 播放常规spin时的背景音乐
   */
  playNormalStateBg: function playNormalStateBg() {
    this._playMusic("normalStateBg", true, 0.6);
  },

  /**
   * 播放免费spin时的背景音乐
   */
  playFreeStateBg: function playFreeStateBg() {
    this._playMusic("freeStateBg", true, 0.6);
  },

  /**
   * 设置boom音效索引为默认值
   */
  setBoomIndexDefault: function setBoomIndexDefault() {
    this.curBoomIndex = 0;
  },

  /**
   * 播放boom音效
   */
  playBoomEffect: function playBoomEffect() {
    if (this.curBoomIndex >= this.boomArr.length - 1) {
      this.curBoomIndex = 0;
    } else {
      this.curBoomIndex += 1;
    }

    ;

    this._playEffect(this.boomArr[this.curBoomIndex], false);
  },

  /**
   * 播放scatter音效
   */
  playScatterTriggerEffect: function playScatterTriggerEffect() {
    this._playEffect("scatterTrigger", false);
  },

  /**
   * 播放到达底部音效
   */
  playReachBottomEffect: function playReachBottomEffect() {
    this._playEffect("reachBottom", false);
  },

  /**
   * 播放到达顶部音效
   */
  playReachOutEffect: function playReachOutEffect() {
    this._playEffect("reachOut", false);
  },

  /**
   * 播放点击1.25倍时音效
   */
  playClick125TimesEffect: function playClick125TimesEffect() {
    this._playEffect("click125Times", false);
  },

  /**
   * 播放点击spin按钮音效
   */
  playClickSpinBtnEffect: function playClickSpinBtnEffect() {
    this._playEffect("clickSpinBtn", false);
  },

  /**
   * 播放点击普通按钮音效
   */
  playClickNormalBtnEffect: function playClickNormalBtnEffect() {
    this._playEffect("clickNormalBtn", false);
  },

  /**
   * 播放打开Free提示框时音效
   */
  playBuyFreeTipsShowEffect: function playBuyFreeTipsShowEffect() {
    this._playEffect("buyFreeTipsShow", false);
  },

  /**
   * 播放关闭Free提示框时音效
   */
  playBuyFreeTipsHideEffect: function playBuyFreeTipsHideEffect() {
    this._playEffect("buyFreeTipsHide", false);
  },

  /**
   * 播放点击Free提示框确定按钮音效
   */
  playBuyFreeTipsCliclOkEffect: function playBuyFreeTipsCliclOkEffect() {
    this._playEffect("buyFreeTipsCliclOk", false);
  },

  /**
   * 播放增加金币（2s）音效
   */
  playAddAllCoin2sEffect: function playAddAllCoin2sEffect() {
    this._playEffect("addAllCoin2s", false);
  },

  /**
   * 播放增加金币（3s）音效
   */
  playAddAllCoin3sEffect: function playAddAllCoin3sEffect() {
    this._playEffect("addAllCoin3s", false);
  },

  /**
   * 播放scatter元素出现时音效
   */
  playScatterEleAppearEffect: function playScatterEleAppearEffect() {
    this._playEffect("scatterEleAppear", false);
  },

  /**
   * 播放15次免费提示框展示音效
   */
  playFreeTipsShowEffect: function playFreeTipsShowEffect() {
    this._playEffect("freeTipsShow", false);
  },

  /**
   * 播放闪电音效
   */
  playLightNingEffect: function playLightNingEffect() {
    this._playEffect("lightNing", false);
  },

  /**
   * 播放scatter元素出现时免费状态时音效
   */
  playScatterEleAppearFreeEffect: function playScatterEleAppearFreeEffect() {
    this._playEffect("scatterEleAppearFree", false);
  },

  /**
   * 播放free结束音效
   */
  playFreeFinishedEffect: function playFreeFinishedEffect() {
    this._playEffect("freeFinished", false);
  },

  /**
   * 播放倍数元素展示音效
   */
  playMultEleShowEffect: function playMultEleShowEffect() {
    this._playEffect("multEleShow", false);
  },

  /**
   * 播放角色闪电音效
   */
  playRoleLightNingEffect: function playRoleLightNingEffect() {
    this._playEffect("roleLightNing", false);
  },

  /**
   * 播放总倍数文字飞行音效
   */
  playAllMultWordFlyEffect: function playAllMultWordFlyEffect() {
    this._playEffect("allMultWordFly", false);
  },

  /**
   * 播放倍数元素文字飞行音效
   */
  playFlyMultScoreEffect: function playFlyMultScoreEffect() {
    this._playEffect("flyMultScore", false);
  },

  /**
   * 播放Head位置的倍数相加音效
   */
  playHeadMultAddEffect: function playHeadMultAddEffect() {
    this._playEffect("headMultAdd", false);
  },

  /**
   * 播放大赢等级1展示音效
   */
  playBigWin1ShowEffect: function playBigWin1ShowEffect() {
    this._playEffect("bigWin1Show", false);
  },

  /**
   * 播放大赢等级1结束音效
   */
  playBigWin1EndEffect: function playBigWin1EndEffect() {
    this._playEffect("bigWin1End", false);
  },

  /**
   * 播放大赢等级2免费状态展示音效
   */
  playBigWin2ShowFreeEffect: function playBigWin2ShowFreeEffect() {
    this._playEffect("bigWin2ShowFree", false);
  },

  /**
   * 播放大赢等级2非免费状态展示音效
   */
  playBigWin2ShowNotFreeEffect: function playBigWin2ShowNotFreeEffect() {
    this._playEffect("bigWin2ShowNotFree", false);
  },

  /**
   * 播放大赢等级2增加金币音效
   */
  playBigWin2AddCoinEffect: function playBigWin2AddCoinEffect() {
    this._playEffect("bigWin2AddCoin", false);
  },

  /**
   * 播放大赢等级2结束音效
   */
  playBigWin2EndEffect: function playBigWin2EndEffect() {
    this._playEffect("bigWin2End", false);
  },

  /**
   * 播放大赢等级3免费状态展示音效
   */
  playBigWin3ShowFreeEffect: function playBigWin3ShowFreeEffect() {
    this._playEffect("bigWin3ShowFree", false);
  },

  /**
   * 播放大赢等级3非免费状态展示音效
   */
  playBigWin3ShowNotFreeEffect: function playBigWin3ShowNotFreeEffect() {
    this._playEffect("bigWin3ShowNotFree", false);
  },

  /**
   * 播放大赢等级3增加金币音效
   */
  playBigWin3AddCoinEffect: function playBigWin3AddCoinEffect() {
    this._playEffect("bigWin3AddCoin", false);
  },

  /**
   * 播放大赢等级3结束音效
   */
  playBigWin3EndEffect: function playBigWin3EndEffect() {
    this._playEffect("bigWin3End", false);
  },

  /**
   * 播放大赢等级4免费状态展示音效
   */
  playBigWin4ShowFreeEffect: function playBigWin4ShowFreeEffect() {
    this._playEffect("bigWin4ShowFree", false);
  },

  /**
   * 播放大赢等级4非免费状态展示音效
   */
  playBigWin4ShowNotFreeEffect: function playBigWin4ShowNotFreeEffect() {
    this._playEffect("bigWin4ShowNotFree", false);
  },

  /**
   * 播放大赢等级4增加金币音效
   */
  playBigWin4AddCoinEffect: function playBigWin4AddCoinEffect() {
    this._playEffect("bigWin4AddCoin", false);
  },

  /**
   * 播放大赢等级4结束音效
   */
  playBigWin4EndEffect: function playBigWin4EndEffect() {
    this._playEffect("bigWin4End", false);
  },

  /**
   * 播放大赢等级5免费状态展示音效
   */
  playBigWin5ShowFreeEffect: function playBigWin5ShowFreeEffect() {
    this._playEffect("bigWin5ShowFree", false);
  },

  /**
   * 播放大赢等级5非免费状态展示音效
   */
  playBigWin5ShowNotFreeEffect: function playBigWin5ShowNotFreeEffect() {
    this._playEffect("bigWin5ShowNotFree", false);
  },

  /**
   * 播放大赢等级5增加金币音效
   */
  playBigWin5AddCoinEffect: function playBigWin5AddCoinEffect() {
    this._playEffect("bigWin5AddCoin", false);
  },

  /**
   * 播放大赢等级5结束音效
   */
  playBigWin5EndEffect: function playBigWin5EndEffect() {
    this._playEffect("bigWin5End", false);
  },

  /**
   * 播放免费SPIN完成时弹框展示时的音效
   */
  playFreeFinishedResultShowEffect: function playFreeFinishedResultShowEffect() {
    this._playEffect("freeFinishedResultShow", false);
  },

  /**
   * 设置免费蓄力音效索引为默认值
   */
  setFreeXuLiIndexDefault: function setFreeXuLiIndexDefault() {
    this.curFreeXuLiIndex = 0;
  },

  /**
   * 播放免费蓄力音效
   */
  playFreeXuLiEffect: function playFreeXuLiEffect() {
    if (this.curFreeXuLiIndex >= this.freeXuLiArr.length - 1) {
      this.curFreeXuLiIndex = 0;
    } else {
      this.curFreeXuLiIndex += 1;
    }

    ;

    this._playEffect(this.freeXuLiArr[this.curFreeXuLiIndex], false);
  },

  /**
   * 播放常规蓄力音效
   */
  playNormalXuLiEffect: function playNormalXuLiEffect() {
    this._playEffect("normalXuLi", false);
  },

  /**
   * 播放免费弹框展示时的背景音乐
   */
  playFreeTipsLongEffect: function playFreeTipsLongEffect(isLoop) {
    this._playEffect("freeTipsLongEffect", isLoop);
  },

  /**
   * 播放免费SPIN完成时弹框展示时的背景音乐
   */
  playFreeFinishedResultLongEffect: function playFreeFinishedResultLongEffect(isLoop) {
    this._playEffect("freeFinishedResultLongEffect", isLoop);
  },

  /**
   * 播放分数相乘的音效
   */
  playScoreMultiplyEffect: function playScoreMultiplyEffect() {
    this._playEffect("scoreMultiply", false);
  },

  /**
   * 播放分数相乘完成的音效
   */
  playScoreMultiplyEndEffect: function playScoreMultiplyEndEffect() {
    this._playEffect("scoreMultiplyEnd", false);
  }
});

cc._RF.pop();