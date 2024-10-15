cc.Class({
    extends: require('AudioBase'),

    properties: {},

    inite: function () {
        this.assetBundle = cc.assetManager.getBundle('lhdGame');
        this.gameSound = new Map();
        this.loadGameSound();
    },

    onLoad: function () {
        this.inite();
    },

    loadGameSound: function () {
        var url = 'lhdSound';
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

    //  播放大厅背景音乐
    playGameMusic: function (name) {
        let clip = this.gameSound.get(name);
        if (clip) {
            this.playMusic(clip, true);
        } else {
            if (this.assetBundle) {
                this.assetBundle.load("lhdSound/" + name, cc.AudioClip, (err, audioClip) => {
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
            this.playSound(clip, isLoop);
        } else {
            if (this.assetBundle) {
                this.assetBundle.load("lhdSound/" + name, cc.AudioClip, (err, audioClip) => {
                    if (!err) {
                        this.playSound(audioClip, isLoop);
                        this.gameSound.set(name, audioClip);
                    }
                });
            }
        }
    },
});
