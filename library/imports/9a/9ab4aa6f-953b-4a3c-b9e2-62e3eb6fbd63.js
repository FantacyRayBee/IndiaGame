"use strict";
cc._RF.push(module, '9ab4apvlTtKPLniYuPrb71j', 'mundaAudioCtrl');
// munda/mundaScript/mundaAudioCtrl.js

"use strict";

cc.Class({
  "extends": require('AudioManager'),
  properties: {},
  inite: function inite() {
    this.assetBundle = cc.assetManager.getBundle('munda');
    this.gameSound = new Map();
    this.loadGameSound();
  },
  //加载音效
  loadGameSound: function loadGameSound() {
    var _this = this;
    var url = 'mundaSound';
    if (this.assetBundle) {
      this.assetBundle.loadDir(url, cc.AudioClip, function (err, assets) {
        if (!err) {
          for (var i = 0; i < assets.length; i++) {
            if (assets[i]._name && _this.gameSound) {
              _this.gameSound.set(assets[i]._name, assets[i]);
            }
          }
        }
      });
    }
  },
  playGameSound: function playGameSound(name, isLoop) {
    var _this2 = this;
    if (isLoop === void 0) {
      isLoop = false;
    }
    var clip = this.gameSound.get(name);
    if (clip) {
      this.playSound(clip, isLoop);
    } else {
      if (this.assetBundle) {
        this.assetBundle.load("mundaSound/" + name, cc.AudioClip, function (err, audioClip) {
          if (!err) {
            _this2.playSound(audioClip, isLoop);
            _this2.gameSound.set(name, audioClip);
          }
        });
      }
    }
  },
  playGameMusic: function playGameMusic(name) {
    var _this3 = this;
    var clip = this.gameSound.get(name);
    if (clip) {
      this.playMusic(clip, true);
    } else {
      if (this.assetBundle) {
        this.assetBundle.load("mundaSound/" + name, cc.AudioClip, function (err, audioClip) {
          if (!err) {
            _this3.playMusic(audioClip, true);
            _this3.gameSound.set(name, audioClip);
          }
        });
      }
    }
  }
});

cc._RF.pop();