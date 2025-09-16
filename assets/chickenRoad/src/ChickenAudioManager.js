cc.Class({
    extends: require('AudioBase'),

    properties: {},

    ctor(){
    },

    start() {
    },

    loadAudioClip: function(audioClipUrl = "", func = null, target = null) {
        if (!audioClipUrl || audioClipUrl.length == 0) {
            return;
        };
        CommonFun.getInstance().loadBundle('chickenroad', (bundle) => {
            bundle.load(audioClipUrl, cc.AudioClip, (err1, audioClip) => {
                if (!err1) {
                    func && func(audioClip, target);
                }
                else {
                    LoggerUtil.getInstance().error(err1); 
                };
            });
        }, (err) => {
            LoggerUtil.getInstance().error(err);
        });
    },

    playGameSound: function(name) {
        let audioClipUrl = "sound/" + name;
        this.loadAudioClip(audioClipUrl, (audioClip, target)=>{
            GlobalCfg.G_COMPONENTS.Audio.playSound(audioClip, false);
        }, this);
    },

    stopAllEffects: function() {
        GlobalCfg.G_COMPONENTS.Audio.stopAllEffects()
    },

    stopAll: function() {
        GlobalCfg.G_COMPONENTS.Audio.stopAll()
    },

    playGameMusic: function() {
        let audioClipUrl = "sound/bgm";
        this.loadAudioClip(audioClipUrl, (audioClip, target)=>{
            GlobalCfg.G_COMPONENTS.Audio.playMusic(audioClip, true)
        }, this);
    },
});
