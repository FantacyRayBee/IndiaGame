let AudioBase = cc.Class({
    extends: cc.Component,

    /**
     * 播放音乐
     * @param {cc.AudioClip} clip 
     * @param {boolean} loop 
     * @param {number} volume 
     * @returns 
     */
    playMusic(clip, loop, volume) {
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
    playSound(clip, loop, volume) {
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

    pauseMusic() {
        cc.audioEngine.pauseMusic();
    },

    stopMusic() {
        cc.audioEngine.stopMusic();
    },

    resumeMusic() {
        cc.audioEngine.resumeMusic();
    },

    pauseEffect(audioID) {
        if (!audioID) {
            console.error("audioID is null");
            return;
        }
        cc.audioEngine.pauseEffect(audioID);
    },

    resumeEffect(audioID) {
        if (!audioID) {
            console.error("audioID is null");
            return;
        }
        cc.audioEngine.resumeEffect(audioID);
    },

    stopEffect(audioID) {
        if (!audioID) {
            console.error("audioID is null");
            return;
        }
        cc.audioEngine.stopEffect(audioID);
    },

    /**
     * 停止播放所有音效
     */
    stopAllEffects(){
        cc.audioEngine.stopAllEffects();
    },

    /**
     * 停止正在播放的所有音频 (包括背景音乐)
     */
    stopAll(){
        cc.audioEngine.stopAll();
    },

    setMusicVolume(volume) {
        volume = cc.misc.clamp01(volume);

        cc.audioEngine.setMusicVolume(volume);
    },

    getMusicVolume() {
        return cc.audioEngine.getMusicVolume();
    },

    setSoundVolume(volume) {
        volume = cc.misc.clamp01(volume);

        cc.audioEngine.setEffectsVolume(volume);
    },

    getSoundVolume() {
        return cc.audioEngine.getEffectsVolume();
    },

    openMusic() {
        this.setLocalData("toggle_yinyun", true);
        this.setMusicVolume(1);
    },

    closeMusic() {
        this.setLocalData("toggle_yinyun", false);
        this.setMusicVolume(0);
    },

    openSound() {
        this.setLocalData("toggle_yinxiao", true);
        this.setSoundVolume(1);
    },

    closeSound() {
        this.setLocalData("toggle_yinxiao", false);
        this.setSoundVolume(0);
    },



    checkState(key) {
        if (!key) {
            return false;
        }
        if (this.getLocalData(key) == null || this.getLocalData(key) == true || this.getLocalData(key) == "true") {
            if(this.getLocalData(key) == null || this.getLocalData(key) == "0"){
                this.setLocalData(key, true);
            }
            return true;
        }else{
            this.setLocalData(key, false);
            return false;
        }
    },

    setLocalData(key, value) {
        cc.sys.localStorage.setItem(key, value);
    },

    getLocalData(key) {
        return cc.sys.localStorage.getItem(key);
    },

    /**
     * 设置一个音频结束后的回调
     * @param {number} audioID 
     * @param {Function} _cb 
     * @returns 
     */
    setFinishCallback(audioID, _cb){
        if(!audioID){
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
    getState(audioID){
        return cc.audioEngine.getState(audioID);
    },
});