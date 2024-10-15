
cc.Class({
    extends: require('AudioBase'),

    properties: {},

    onLoad() {

    },

    onDestroy() {

    },

    inite: function () {
        this.assetBundle = cc.assetManager.getBundle('7up7downGame');
        this.gameSound = new Map();
        this.loadGameSound();
    },

    //加载音效
    loadGameSound: function () {
        var soundArr = ['7upSound'];
        for (let index = 0; index < soundArr.length; index++) {
            var url = soundArr[index];
            if (this.assetBundle) {
                this.assetBundle.loadDir(url, cc.AudioClip, (err, assets) => {
                    if (!err) {
                        for (let i = 0; i < assets.length; i++) {
                            if (assets[i]._name && this.gameSound) {
                                this.gameSound.set(assets[i]._name, assets[i]);
                            }
                        }
                    }
                });
            }
        }
    },

    playGameSound: function (name, isLoop) {
        let clip = this.gameSound.get(name);
        if (clip) {
            this.playSound(clip, isLoop);
        } else {
            if (this.assetBundle) {
                this.assetBundle.load("7upSound/" + name, cc.AudioClip, (err, audioClip) => {
                    if (!err) {
                        this.playSound(audioClip, isLoop);
                        this.gameSound.set(name, audioClip);
                    }
                });
            }
        }
    },

    playGameMusic: function (name) {
        let clip = this.gameSound.get(name);
        if (clip) {
            this.playMusic(clip, true);
        } else {
            if (this.assetBundle) {
                this.assetBundle.load("7upSound/" + name, cc.AudioClip, (err, audioClip) => {
                    if (!err) {
                        this.playMusic(audioClip, true);
                        this.gameSound.set(name, audioClip);
                    }
                });
            }
        }
    },

});
