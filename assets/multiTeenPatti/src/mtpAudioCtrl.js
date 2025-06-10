
cc.Class({
    extends: require('AudioManager'),

    properties: {},

    inite: function () {
        this.assetBundle = cc.assetManager.getBundle('munda');
        this.gameSound = new Map();
        this.loadGameSound();
    },

    //加载音效
    loadGameSound: function () {
        var url = 'mundaSound';
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
    },

    playGameSound: function (name, isLoop = false) {
        let clip = this.gameSound.get(name);
        if (clip) {
            this.playSound(clip, isLoop);
        } else {
            if (this.assetBundle) {
                this.assetBundle.load("mundaSound/" + name, cc.AudioClip, (err, audioClip) => {
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
                this.assetBundle.load("mundaSound/" + name, cc.AudioClip, (err, audioClip) => {
                    if (!err) {
                        this.playMusic(audioClip, true);
                        this.gameSound.set(name, audioClip);
                    }
                });
            }
        }
    },
});
