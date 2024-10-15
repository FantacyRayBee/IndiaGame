cc.Class({
    extends: require('AudioBase'),

    initAudio:function(){
        this.assetBundle = cc.assetManager.getBundle('baccarat3PattiGame');
        this.gameSound = new Map();
        this.loadSound();
    },

    loadSound:function(){
        let relativePath = 'sound';
        if(this.assetBundle){
            this.assetBundle.loadDir(relativePath, cc.AudioClip, (err, assets) => {
                if (!err && this.gameSound) {
                    for (let i = 0; i < assets.length; i++) {
                        this.gameSound.set(assets[i]._name, assets[i]);
                    }
                }
            });
        }
    },

    playGameMusic: function (name) {
        let clip = this.gameSound.get(name);
        if (clip) {
            this.playMusic(clip, true);
        } else {
            if (this.assetBundle) {
                this.assetBundle.load("sound/" + name, cc.AudioClip, (err, audioClip) => {
                    if (!err) {
                        this.playMusic(audioClip, true);
                        this.gameSound.set(name, audioClip);
                    }
                });
            }
        }
    },


     /**
      * 播放音效
      * @param {根据游戏音效的名字来播放游戏} name 
      */
     playGameSound: function (name, isLoop = false) {
        let clip = this.gameSound.get(name);
        if (clip) {
            this.playSound(clip, isLoop);
        } else {
            if (this.assetBundle) {
                this.assetBundle.load("sound/" + name, cc.AudioClip, (err, audioClip) => {
                    if (!err) {
                        this.playSound(audioClip, isLoop);
                        this.gameSound.set(name, audioClip);
                    }
                });
            }
        }
    },
});
