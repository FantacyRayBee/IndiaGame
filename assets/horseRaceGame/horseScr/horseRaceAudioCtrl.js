
cc.Class({
    extends: require('AudioBase'),

    properties: {},

    inite: function () {
        this.assetBundle = cc.assetManager.getBundle('horseRaceGame');
        this.gameSound = new Map();
        this.gameSoundAudioID = new Map();
        this.loadGameSound();
        this.stopMusic();
    },

    onLoad: function () {
        this.inite();
    },

    loadGameSound: function () {
        let url = 'horseSound';
        if (this.assetBundle) {
            this.assetBundle.loadDir(url, cc.AudioClip, (err, assets) => {
                if (!err && this.gameSound) {
                    for (let i = 0; i < assets.length; i++) {
                        this.gameSound.set(assets[i]._name, assets[i]);
                    }
                }
            });
        }
    },

    //  播放背景音乐
    playGameMusic: function (name) {
        let clip = this.gameSound.get(name);
        if (clip) {
            this.playMusic(clip, true);
        } else {
            if (this.assetBundle) {
                this.assetBundle.load("horseSound/" + name, cc.AudioClip, (err, audioClip) => {
                    if (!err) {
                        this.playMusic(audioClip, true);
                        this.gameSound.set(name, audioClip);
                    }
                });
            }
        }
    },

    // 播放音效
    playGameSound: function (name, isLoop = false) {
        let clip = this.gameSound.get(name);
        if (clip) {
            let audioID = this.playSound(clip, isLoop);
            if (audioID) {
                this.gameSoundAudioID.set(name, audioID);
            }
        } else {
            if (this.assetBundle) {
                this.assetBundle.load("horseSound/" + name, cc.AudioClip, (err, audioClip) => {
                    if (!err) {
                        let audioID = this.playSound(audioClip, isLoop);
                        if (audioID) {
                            this.gameSoundAudioID.set(name, audioID);
                        }
                        LoggerUtil.getInstance().log('~~~~!!!!!', this.gameSound);
                        this.gameSound.set(name, audioClip);
                    }
                });
            }
        }
    },

    stopGameEffectByName: function (name) {
        if(!name){
            this.gameSoundAudioID.forEach((value, key) => {
                if(value){
                    this.stopEffect(value);
                }else{
                    LoggerUtil.getInstance().warn("audioID is null")
                }
            });
            return;
        }
        let audioID = this.gameSoundAudioID.get(name);
        if (audioID) {
            this.stopEffect(audioID);
        }
    }

});
