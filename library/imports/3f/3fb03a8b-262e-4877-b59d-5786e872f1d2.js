"use strict";
cc._RF.push(module, '3fb03qLJi5Id7WdV4bocvHS', 'AudioManager');
// Main/AudioManager.js

"use strict";

cc.Class({
  "extends": require('AudioBase'),
  ctor: function ctor() {
    this.soundAudioClips = {};
  },
  preloadAudioClip: function preloadAudioClip() {
    var _this = this;
    var soundArry = ["sound/lobby", "sound/button", "sound/back"];
    for (var index = 0; index < soundArry.length; index++) {
      var element = soundArry[index];
      cc.resources.load(element, cc.AudioClip, function (err, audioClip) {
        if (!err && _this) {
          _this.soundAudioClips[audioClip._name] = audioClip;
        }
      });
    }
  },
  playSoundByNameInResources: function playSoundByNameInResources(soundName, loop) {
    var _this2 = this;
    loop = loop || false;
    var clip = this.soundAudioClips[soundName];
    if (clip) {
      this.playSound(clip, loop);
    } else {
      cc.resources.load("sound/" + soundName, cc.AudioClip, function (err, audioClip) {
        if (!err) {
          _this2.soundAudioClips[audioClip._name] = audioClip;
          _this2.playSound(audioClip, loop);
        }
      });
    }
  },
  playLobby: function playLobby() {
    var _this3 = this;
    var clip = this.soundAudioClips['lobby'];
    if (clip) {
      this.playMusic(clip, true);
    } else {
      cc.resources.load("sound/lobby", cc.AudioClip, function (err, audioClip) {
        if (!err) {
          _this3.soundAudioClips[audioClip._name] = audioClip;
          _this3.playMusic(audioClip, true);
        }
      });
    }
  },
  playButton: function playButton() {
    var _this4 = this;
    var clip = this.soundAudioClips['button'];
    if (clip) {
      this.playSound(clip, false);
    } else {
      cc.resources.load("sound/button", cc.AudioClip, function (err, audioClip) {
        if (!err) {
          _this4.soundAudioClips[audioClip._name] = audioClip;
          _this4.playSound(audioClip, false);
        }
      });
    }
  },
  playBack: function playBack() {
    var _this5 = this;
    var clip = this.soundAudioClips['back'];
    if (clip) {
      this.playSound(clip, false);
    } else {
      cc.resources.load("sound/back", cc.AudioClip, function (err, audioClip) {
        if (!err) {
          _this5.soundAudioClips[audioClip._name] = audioClip;
          _this5.playSound(audioClip, false);
        }
      });
    }
  }
});

cc._RF.pop();