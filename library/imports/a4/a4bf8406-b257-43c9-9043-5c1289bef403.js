"use strict";
cc._RF.push(module, 'a4bf8QGsldDyZBDXBKJvvQD', 'AndererAudioCtrl');
// andaerGame/andeerScr/AndererAudioCtrl.js

"use strict";

cc.Class({
  "extends": require('AudioBase'),
  properties: {},
  inite: function inite() {
    this.assetBundle = cc.assetManager.getBundle('andaerGame');
    this.gameSound = new Map();
    this.loadGameSound();
  },
  onLoad: function onLoad() {
    this.inite();
  },
  loadGameSound: function loadGameSound() {
    var _this = this;
    var url = 'andeerSound';
    if (this.assetBundle) {
      this.assetBundle.loadDir(url, cc.AudioClip, function (err, assets) {
        if (!err && _this.gameSound) {
          for (var i = 0; i < assets.length; i++) {
            _this.gameSound.set(assets[i]._name, assets[i]);
          }
        }
      });
    }
  },
  playGameMusic: function playGameMusic(name) {
    var _this2 = this;
    var clip = this.gameSound.get(name);
    if (clip) {
      this.playMusic(clip, true);
    } else {
      if (this.assetBundle) {
        this.assetBundle.load("7upSound/" + name, cc.AudioClip, function (err, audioClip) {
          if (!err) {
            _this2.playMusic(audioClip, true);
            _this2.gameSound.set(name, audioClip);
          }
        });
      }
    }
  },
  // 播放音效
  playGameSound: function playGameSound(name, isLoop) {
    var _this3 = this;
    if (isLoop === void 0) {
      isLoop = false;
    }
    var clip = this.gameSound.get(name);
    if (clip) {
      this.playSound(clip, isLoop);
    } else {
      if (this.assetBundle) {
        this.assetBundle.load("gameSound/cimmon/" + url, cc.AudioClip, function (err, audioClip) {
          if (!err) {
            _this3._playSFX(audioClip, false);
            _this3.gameSound.set(audioClip._name, audioClip);
          }
        });
      }
    }
  }
});

cc._RF.pop();