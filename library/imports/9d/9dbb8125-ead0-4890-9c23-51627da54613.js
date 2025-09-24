"use strict";
cc._RF.push(module, '9dbb8El6tBIkJwjUWJ9pUYT', 'sscAudioCtrl');
// sscGame/sscScr/sscAudioCtrl.js

"use strict";

cc.Class({
  "extends": require('AudioBase'),
  ctor: function ctor() {
    this.assetBundle = cc.assetManager.getBundle('sscGame');
    this.gameSound = new Map();
    this.loadGameSound();
  },
  onLoad: function onLoad() {
    GlobalCfg.G_COMPONENTS.Audio.pauseMusic();
  },
  loadGameSound: function loadGameSound() {
    var _this = this;

    var url = 'sscSound';

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
        this.assetBundle.load("sscSound/" + name, cc.AudioClip, function (err, audioClip) {
          if (!err) {
            _this2.playSound(audioClip, isLoop);

            _this2.gameSound.set(name, audioClip);
          } else {
            LoggerUtil.getInstance().error('~~~~!!!!!', err);
          }
        });
      }
    }
  }
});

cc._RF.pop();