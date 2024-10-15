"use strict";
cc._RF.push(module, 'a9e2bB6vqFOn5e1E0g6OKTV', 'lhdAudioCtrl');
// lhdGame/lhdScr/lhdAudioCtrl.js

"use strict";

cc.Class({
  "extends": require('AudioBase'),
  properties: {},
  inite: function inite() {
    this.assetBundle = cc.assetManager.getBundle('lhdGame');
    this.gameSound = new Map();
    this.loadGameSound();
  },
  onLoad: function onLoad() {
    this.inite();
  },
  loadGameSound: function loadGameSound() {
    var _this = this;

    var url = 'lhdSound';

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
  //  播放大厅背景音乐
  playGameMusic: function playGameMusic(name) {
    var _this2 = this;

    var clip = this.gameSound.get(name);

    if (clip) {
      this.playMusic(clip, true);
    } else {
      if (this.assetBundle) {
        this.assetBundle.load("lhdSound/" + name, cc.AudioClip, function (err, audioClip) {
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
        this.assetBundle.load("lhdSound/" + name, cc.AudioClip, function (err, audioClip) {
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