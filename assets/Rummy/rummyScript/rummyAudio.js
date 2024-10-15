cc.Class({
    extends: require('AudioBase'),

    onLoad() {
        this.inite();
    },

    inite: function () {
        this.assetBundle = cc.assetManager.getBundle('Rummy');
        this.gameSound = new Map();
        this.loadGameSound();
        this.stopMusic();
    },

    //加载音效
    loadGameSound: function () {
        var url = 'rummySound';
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

    // 播放音效
    playGameSound: function (name, isLoop = false) {
        let clip = this.gameSound.get(name);
        if (clip) {
            this.playSound(clip, isLoop);
        } else {
            if (this.assetBundle) {
                this.assetBundle.load("rummySound/" + name, cc.AudioClip, (err, audioClip) => {
                    if (!err) {
                        this.playSound(audioClip, isLoop);
                        this.gameSound.set(name, audioClip);
                    }
                });
            }
        }
    },


});
