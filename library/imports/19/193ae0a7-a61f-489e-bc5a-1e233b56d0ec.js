"use strict";
cc._RF.push(module, '193aeCnph9InrxaHiM7VtDs', 'AudioBase');
// Main/AudioBase.js

"use strict";

var AudioBase = cc.Class({
  "extends": cc.Component,
  /**
   * 播放音乐
   * @param {cc.AudioClip} clip 
   * @param {boolean} loop 
   * @param {number} volume 
   * @returns 
   */
  playMusic: function playMusic(clip, loop, volume) {
    if (!clip) {
      return;
    }
    if (true === this.checkState("toggle_yinyun")) {
      volume = volume ? volume : 1;
      this.setMusicVolume(volume);
    } else {
      this.setMusicVolume(0);
    }
    cc.audioEngine.playMusic(clip, loop);
  },
  /**
   * 播放音效
   * @param {cc.AudioClip} clip 
   * @param {boolean} loop 
   * @param {number} volume 
   * @returns {number} audioID
   */
  playSound: function playSound(clip, loop, volume) {
    // LoggerUtil.getInstance().error(`clip == ${clip}, loop == ${loop}, volume == ${volume},`);
    if (!clip) {
      return;
    }
    if (true === this.checkState("toggle_yinxiao")) {
      volume = volume ? volume : 1;
      this.setSoundVolume(volume);
    } else {
      this.setSoundVolume(0);
    }
    return cc.audioEngine.playEffect(clip, loop);
  },
  pauseMusic: function pauseMusic() {
    cc.audioEngine.pauseMusic();
  },
  stopMusic: function stopMusic() {
    cc.audioEngine.stopMusic();
  },
  resumeMusic: function resumeMusic() {
    cc.audioEngine.resumeMusic();
  },
  pauseEffect: function pauseEffect(audioID) {
    if (!audioID) {
      console.error("audioID is null");
      return;
    }
    cc.audioEngine.pauseEffect(audioID);
  },
  resumeEffect: function resumeEffect(audioID) {
    if (!audioID) {
      console.error("audioID is null");
      return;
    }
    cc.audioEngine.resumeEffect(audioID);
  },
  stopEffect: function stopEffect(audioID) {
    if (!audioID) {
      console.error("audioID is null");
      return;
    }
    cc.audioEngine.stopEffect(audioID);
  },
  /**
   * 停止播放所有音效
   */
  stopAllEffects: function stopAllEffects() {
    cc.audioEngine.stopAllEffects();
  },
  /**
   * 停止正在播放的所有音频 (包括背景音乐)
   */
  stopAll: function stopAll() {
    cc.audioEngine.stopAll();
  },
  setMusicVolume: function setMusicVolume(volume) {
    volume = cc.misc.clamp01(volume);
    cc.audioEngine.setMusicVolume(volume);
    this.setLocalData("value_musicSound", volume);
  },
  getMusicVolume: function getMusicVolume() {
    return cc.audioEngine.getMusicVolume();
  },
  setSoundVolume: function setSoundVolume(volume) {
    volume = cc.misc.clamp01(volume);
    cc.audioEngine.setEffectsVolume(volume);
    this.setLocalData("value_effectSound", volume);
  },
  getSoundVolume: function getSoundVolume() {
    return cc.audioEngine.getEffectsVolume();
  },
  openMusic: function openMusic() {
    this.setLocalData("toggle_yinyun", true);
    this.setMusicVolume(1);
  },
  closeMusic: function closeMusic() {
    this.setLocalData("toggle_yinyun", false);
    this.setMusicVolume(0);
  },
  openSound: function openSound() {
    this.setLocalData("toggle_yinxiao", true);
    this.setSoundVolume(1);
  },
  closeSound: function closeSound() {
    this.setLocalData("toggle_yinxiao", false);
    this.setSoundVolume(0);
  },
  checkState: function checkState(key) {
    if (!key) {
      return false;
    }
    if (this.getLocalData(key) == null || this.getLocalData(key) == true || this.getLocalData(key) == "true") {
      if (this.getLocalData(key) == null || this.getLocalData(key) == "0") {
        this.setLocalData(key, true);
      }
      return true;
    } else {
      this.setLocalData(key, false);
      return false;
    }
  },
  setLocalData: function setLocalData(key, value) {
    cc.sys.localStorage.setItem(key, value);
  },
  getLocalData: function getLocalData(key) {
    return cc.sys.localStorage.getItem(key);
  },
  /**
   * 设置一个音频结束后的回调
   * @param {number} audioID 
   * @param {Function} _cb 
   * @returns 
   */
  setFinishCallback: function setFinishCallback(audioID, _cb) {
    if (!audioID) {
      console.error("audioID is null");
      return;
    }
    cc.audioEngine.setFinishCallback(audioID, _cb);
  },
  /**
   * 获取音频状态
   * @param {number} audioID 
   * @returns {audioEngine.AudioState} audio duration.
   */
  getState: function getState(audioID) {
    return cc.audioEngine.getState(audioID);
  }
});

cc._RF.pop();