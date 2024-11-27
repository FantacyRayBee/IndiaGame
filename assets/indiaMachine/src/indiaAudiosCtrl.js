cc.Class({
    extends: require('AudioBase'),

    properties: {},

    ctor: function() {
        this.audioClipMap = new Map();
        this.audioIdMap = new Map();
    },


    onLoad: function() {
        // this.loadGameSound();
    },

    onDestroy: function() {
        this.stopAllEffects();
    },

    /**
     * 根据音效文件名停止播放该音效
     * @param {string} audioClipName 音效文件名
     */
    stopEffectByAudioClipName(audioClipName) {
        if (this.audioIdMap.has(audioClipName)) {
            let audioId = this.audioIdMap.get(audioClipName);
            if (this.getState(audioId) == cc.audioEngine.AudioState.PLAYING) {
                this.stopEffect(audioId);
            };
            this.audioIdMap.delete(audioClipName);
        };
    },
    _playEffect: function (audioClipName, isLoop) {
        if (true == this.checkState('toggle_yinxiao')) {
            if (this.audioClipMap.has(audioClipName)) {
                let audioClip = this.audioClipMap.get(audioClipName);
                let audioId = this.playSound(audioClip, isLoop);
                this.audioIdMap.set(audioClipName, audioId);
                return;
            };
            
            CommonFun.getInstance().loadBundle('main', (bundle) => {
                bundle.load(`Audios/${audioClipName}`, cc.AudioClip, (err, audioClip) => {
                    if (!err) {
                        let audioClipName = audioClip.name;
                        this.audioClipMap.set(audioClipName, audioClip);
                        let audioId = this.playSound(audioClip, isLoop);
                        this.audioIdMap.set(audioClipName, audioId);
                    }
                    else {
                        LoggerUtil.getInstance().error(`加载main Audios-${audioClipName}异常1: ${JSON.stringify(err)}`);
                    };
                });
            }, (err) => {
                LoggerUtil.getInstance().error(`加载main Audios-${audioClipName}异常: ${JSON.stringify(err)}`);
            });
        };
    },

    /**
     * 播放大赢等级1展示音效
     */
    playBigWin1ShowEffect: function() {
        this._playEffect("bigWin1Show", false);
    },

    /**
     * 播放大赢等级1结束音效
     */
    playBigWin1EndEffect: function() {
        this._playEffect("bigWin1End", false);
    },

    /**
     * 播放大赢等级2免费状态展示音效
     */
    playBigWin2ShowFreeEffect: function() {
        this._playEffect("bigWin2ShowFree", false);
    },


    /**
     * 播放大赢等级2非免费状态展示音效
     */
    playBigWin2ShowNotFreeEffect: function() {
        this._playEffect("bigWin2ShowNotFree", false);
    },


    /**
     * 播放大赢等级2增加金币音效
     */
    playBigWin2AddCoinEffect: function() {
        this._playEffect("bigWin2AddCoin", false);
    },


    /**
     * 播放大赢等级2结束音效
     */
    playBigWin2EndEffect: function() {
        this._playEffect("bigWin2End", false);
    },


    /**
     * 播放大赢等级3免费状态展示音效
     */
    playBigWin3ShowFreeEffect: function() {
        this._playEffect("bigWin3ShowFree", false);
    },


    /**
     * 播放大赢等级3非免费状态展示音效
     */
    playBigWin3ShowNotFreeEffect: function() {
        this._playEffect("bigWin3ShowNotFree", false);
    },


    /**
     * 播放大赢等级3增加金币音效
     */
    playBigWin3AddCoinEffect: function() {
        this._playEffect("bigWin3AddCoin", false);
    },


    /**
     * 播放大赢等级3结束音效
     */
    playBigWin3EndEffect: function() {
        this._playEffect("bigWin3End", false);
    },


    /**
     * 播放大赢等级4免费状态展示音效
     */
    playBigWin4ShowFreeEffect: function() {
        this._playEffect("bigWin4ShowFree", false);
    },


    /**
     * 播放大赢等级4非免费状态展示音效
     */
    playBigWin4ShowNotFreeEffect: function() {
        this._playEffect("bigWin4ShowNotFree", false);
    },


    /**
     * 播放大赢等级4增加金币音效
     */
    playBigWin4AddCoinEffect: function() {
        this._playEffect("bigWin4AddCoin", false);
    },


    /**
     * 播放大赢等级4结束音效
     */
    playBigWin4EndEffect: function() {
        this._playEffect("bigWin4End", false);
    },


    /**
     * 播放大赢等级5免费状态展示音效
     */
    playBigWin5ShowFreeEffect: function() {
        this._playEffect("bigWin5ShowFree", false);
    },


    /**
     * 播放大赢等级5非免费状态展示音效
     */
    playBigWin5ShowNotFreeEffect: function() {
        this._playEffect("bigWin5ShowNotFree", false);
    },


    /**
     * 播放大赢等级5增加金币音效
     */
    playBigWin5AddCoinEffect: function() {
        this._playEffect("bigWin5AddCoin", false);
    },


    /**
     * 播放大赢等级5结束音效
     */
    playBigWin5EndEffect: function() {
        this._playEffect("bigWin5End", false);
    },

});


