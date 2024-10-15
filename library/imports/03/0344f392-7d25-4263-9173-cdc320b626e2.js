"use strict";
cc._RF.push(module, '0344fOSfSVCY5FzzcMgtibi', 'rummyAudio');
// Rummy/rummyScript/rummyAudio.js

"use strict";

cc.Class({
  "extends": require('AudioBase'),
  onLoad: function onLoad() {
    this.inite();
  },
  inite: function inite() {
    this.assetBundle = cc.assetManager.getBundle('Rummy');
    this.gameSound = new Map();
    this.loadGameSound();
    this.stopMusic();
  },
  //加载音效
  loadGameSound: function loadGameSound() {
    var _this = this;

    var url = 'rummySound';

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
  // 播放音效
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
        this.assetBundle.load("rummySound/" + name, cc.AudioClip, function (err, audioClip) {
          if (!err) {
            _this2.playSound(audioClip, isLoop);

            _this2.gameSound.set(name, audioClip);
          }
        });
      }
    }
  }
});

cc._RF.pop();