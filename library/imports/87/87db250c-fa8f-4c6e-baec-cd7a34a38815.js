"use strict";
cc._RF.push(module, '87db2UM+o9MbrrszXo0o4gV', '7upAudioCtrl');
// 7up7downGame/7upScript/7upAudioCtrl.js

"use strict";

cc.Class({
  "extends": require('AudioBase'),
  properties: {},
  onLoad: function onLoad() {},
  onDestroy: function onDestroy() {},
  inite: function inite() {
    this.assetBundle = cc.assetManager.getBundle('7up7downGame');
    this.gameSound = new Map();
    this.loadGameSound();
  },
  //加载音效
  loadGameSound: function loadGameSound() {
    var _this = this;

    var soundArr = ['7upSound'];

    for (var index = 0; index < soundArr.length; index++) {
      var url = soundArr[index];

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
    }
  },
  playGameSound: function playGameSound(name, isLoop) {
    var _this2 = this;

    var clip = this.gameSound.get(name);

    if (clip) {
      this.playSound(clip, isLoop);
    } else {
      if (this.assetBundle) {
        this.assetBundle.load("7upSound/" + name, cc.AudioClip, function (err, audioClip) {
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
        this.assetBundle.load("7upSound/" + name, cc.AudioClip, function (err, audioClip) {
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