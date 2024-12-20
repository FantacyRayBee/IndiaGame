"use strict";
cc._RF.push(module, 'b59a4IguDFKzZ9MKY+FOA7I', 'soundPlayCtrl');
// baccarat3PattiGame/src/soundPlayCtrl.js

"use strict";

cc.Class({
  "extends": require('AudioBase'),
  initAudio: function initAudio() {
    this.assetBundle = cc.assetManager.getBundle('baccarat3PattiGame');
    this.gameSound = new Map();
    this.loadSound();
  },
  loadSound: function loadSound() {
    var _this = this;
    var relativePath = 'sound';
    if (this.assetBundle) {
      this.assetBundle.loadDir(relativePath, cc.AudioClip, function (err, assets) {
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
        this.assetBundle.load("sound/" + name, cc.AudioClip, function (err, audioClip) {
          if (!err) {
            _this2.playMusic(audioClip, true);
            _this2.gameSound.set(name, audioClip);
          }
        });
      }
    }
  },
  /**
   * 播放音效
   * @param {根据游戏音效的名字来播放游戏} name 
   */
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
        this.assetBundle.load("sound/" + name, cc.AudioClip, function (err, audioClip) {
          if (!err) {
            _this3.playSound(audioClip, isLoop);
            _this3.gameSound.set(name, audioClip);
          }
        });
      }
    }
  }
});

cc._RF.pop();