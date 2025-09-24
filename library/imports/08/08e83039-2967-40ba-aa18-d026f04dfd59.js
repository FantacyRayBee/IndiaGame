"use strict";
cc._RF.push(module, '08e83A5KWdAuqoY0CbwTf1Z', 'horseRaceAudioCtrl');
// horseRaceGame/horseScr/horseRaceAudioCtrl.js

"use strict";

cc.Class({
  "extends": require('AudioBase'),
  properties: {},
  inite: function inite() {
    this.assetBundle = cc.assetManager.getBundle('horseRaceGame');
    this.gameSound = new Map();
    this.gameSoundAudioID = new Map();
    this.loadGameSound();
    this.stopMusic();
  },
  onLoad: function onLoad() {
    this.inite();
  },
  loadGameSound: function loadGameSound() {
    var _this = this;

    var url = 'horseSound';

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
  //  播放背景音乐
  playGameMusic: function playGameMusic(name) {
    var _this2 = this;

    var clip = this.gameSound.get(name);

    if (clip) {
      this.playMusic(clip, true);
    } else {
      if (this.assetBundle) {
        this.assetBundle.load("horseSound/" + name, cc.AudioClip, function (err, audioClip) {
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
      var audioID = this.playSound(clip, isLoop);

      if (audioID) {
        this.gameSoundAudioID.set(name, audioID);
      }
    } else {
      if (this.assetBundle) {
        this.assetBundle.load("horseSound/" + name, cc.AudioClip, function (err, audioClip) {
          if (!err) {
            var _audioID = _this3.playSound(audioClip, isLoop);

            if (_audioID) {
              _this3.gameSoundAudioID.set(name, _audioID);
            }

            LoggerUtil.getInstance().log('~~~~!!!!!', _this3.gameSound);

            _this3.gameSound.set(name, audioClip);
          }
        });
      }
    }
  },
  stopGameEffectByName: function stopGameEffectByName(name) {
    var _this4 = this;

    if (!name) {
      this.gameSoundAudioID.forEach(function (value, key) {
        if (value) {
          _this4.stopEffect(value);
        } else {
          LoggerUtil.getInstance().warn("audioID is null");
        }
      });
      return;
    }

    var audioID = this.gameSoundAudioID.get(name);

    if (audioID) {
      this.stopEffect(audioID);
    }
  }
});

cc._RF.pop();