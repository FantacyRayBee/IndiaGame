
cc.Class({
    extends: require('AudioBase'),

    ctor: function() {
        this.assetBundle = cc.assetManager.getBundle('sscGame');
        this.gameSound = new Map();
        this.loadGameSound();
    },

    onLoad: function () {
        GlobalCfg.G_COMPONENTS.Audio.pauseMusic();
    },

    loadGameSound:function(){
        let url = 'sscSound';
        if(this.assetBundle){
            this.assetBundle.loadDir(url, cc.AudioClip, (err, assets) => {
                if (!err && this.gameSound) {
                    for (let i = 0; i < assets.length; i++) {
                        this.gameSound.set(assets[i]._name, assets[i]);
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
                this.assetBundle.load("sscSound/" + name, cc.AudioClip, (err, audioClip) => {
                    if (!err) {
                        this.playSound(audioClip, isLoop);
                        this.gameSound.set(name, audioClip);
                    }else{
                        LoggerUtil.getInstance().error('~~~~!!!!!', err);
                    }
                });
            }
        }
    },
});
