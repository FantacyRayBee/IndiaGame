"use strict";
cc._RF.push(module, '07bbcepDBVNZ66K3jeAGpD1', 'zooAudioManager');
// zooGame/Scripts/zooAudioManager.js

"use strict";

cc.Class({
  "extends": require('AudioBase'),
  inite: function inite() {
    this.assetBundle = cc.assetManager.getBundle('zooGame');
    this.gameSound = new Map();
    this.loadGameSound();
  },
  //加载音效
  loadGameSound: function loadGameSound() {
    var _this = this;
    var url = 'res/sound';
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
        this.assetBundle.load("res/sound/" + name, cc.AudioClip, function (err, audioClip) {
          if (!err) {
            _this2.playSound(audioClip, isLoop);
            LoggerUtil.getInstance().log('~~~~!!!!!', _this2.gameSound);
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
        this.assetBundle.load("res/sound/" + name, cc.AudioClip, function (err, audioClip) {
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