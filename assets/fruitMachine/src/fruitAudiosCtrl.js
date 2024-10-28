cc.Class({
    extends: require('AudioBase'),

    properties: {},

    ctor: function() {
        this.audioClipMap = new Map();

        this.boomArr = ["boom1", "boom2", "boom3"];
        this.freeXuLiArr = ["freeXuLi1", "freeXuLi2", "freeXuLi3"];
        this.curBoomIndex = 0;
        this.curFreeXuLiIndex = 0;


        this.audioIdMap = new Map();
    },


    onLoad: function() {
        this.loadGameSound();
    },

    onDestroy: function() {
        this.stopAllEffects();
    },

    _playEffect: function (audioClipName, isLoop) {
        if (true == this.checkState('toggle_yinxiao')) {
            if (this.audioClipMap.has(audioClipName)) {
                let audioClip = this.audioClipMap.get(audioClipName);
                let audioId = this.playSound(audioClip, isLoop);
                this.audioIdMap.set(audioClipName, audioId);
                return;
            };
            
            CommonFun.getInstance().loadBundle('zeusGame', (bundle) => {
                bundle.load(`audios/${audioClipName}`, cc.AudioClip, (err, audioClip) => {
                    if (!err) {
                        let audioClipName = audioClip.name;
                        this.audioClipMap.set(audioClipName, audioClip);
                        let audioId = this.playSound(audioClip, isLoop);
                        this.audioIdMap.set(audioClipName, audioId);
                    }
                    else {
                        LoggerUtil.getInstance().error(`加载zeusGame-${audioClipName}异常1: ${JSON.stringify(err)}`);
                    };
                });
            }, (err) => {
                LoggerUtil.getInstance().error(`加载zeusGame-${audioClipName}异常: ${JSON.stringify(err)}`);
            });
        };
    },



    _playMusic: function(audioClipName, isLoop = true, volume) {
        volume = volume ? volume : 1;
        if (true == this.checkState('toggle_yinyun')) {
            if (this.audioClipMap.has(audioClipName)) {
                let audioClip = this.audioClipMap.get(audioClipName);
                this.playMusic(audioClip, isLoop, volume);
                return;
            };
            CommonFun.getInstance().loadBundle('zeusGame', (bundle) => {
                bundle.load(`audios/${audioClipName}`, cc.AudioClip, (err, audioClip) => {
                    if (!err) {
                        let audioClipName = audioClip.name;
                        this.audioClipMap.set(audioClipName, audioClip);
                        this.playMusic(audioClip, isLoop, volume);
                    }
                    else {
                        LoggerUtil.getInstance().error(`加载zeusGame-${audioClipName}异常1: ${JSON.stringify(err)}`);
                    }
                });
            }, (err) => {
                LoggerUtil.getInstance().error(`加载zeusGame-${audioClipName}异常: ${JSON.stringify(err)}`);
            });
        };
    },


    /**
     * 播放增加金币（2s）音效
     */
    playAddAllCoin2sEffect: function() {
        this._playEffect("addAllCoin2s", false);
    },


    /**
     * 播放增加金币（3s）音效
     */
    playAddAllCoin3sEffect: function() {
        this._playEffect("addAllCoin3s", false);
    },


    /**
     * 播放scatter元素出现时音效
     */
    playScatterEleAppearEffect: function() {
        this._playEffect("scatterEleAppear", false);
    },


    /**
     * 播放15次免费提示框展示音效
     */
    playFreeTipsShowEffect: function() {
        this._playEffect("freeTipsShow", false);
    },


    /**
     * 播放闪电音效
     */
    playLightNingEffect: function() {
        this._playEffect("lightNing", false);
    },


    /**
     * 播放scatter元素出现时免费状态时音效
     */
    playScatterEleAppearFreeEffect: function() {
        this._playEffect("scatterEleAppearFree", false);
    },


    /**
     * 播放free结束音效
     */
    playFreeFinishedEffect: function() {
        this._playEffect("freeFinished", false);
    },


    /**
     * 播放倍数元素展示音效
     */
    playMultEleShowEffect: function() {
        this._playEffect("multEleShow", false);
    },



    /**
     * 播放角色闪电音效
     */
    playRoleLightNingEffect: function() {
        this._playEffect("roleLightNing", false);
    },


    /**
     * 播放总倍数文字飞行音效
     */
    playAllMultWordFlyEffect: function() {
        this._playEffect("allMultWordFly", false);
    },


    /**
     * 播放倍数元素文字飞行音效
     */
    playFlyMultScoreEffect: function() {
        this._playEffect("flyMultScore", false);
    },


    /**
     * 播放Head位置的倍数相加音效
     */
    playHeadMultAddEffect: function() {
        this._playEffect("headMultAdd", false);
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


    /**
     * 播放免费SPIN完成时弹框展示时的音效
     */
    playFreeFinishedResultShowEffect: function() {
        this._playEffect("freeFinishedResultShow", false);
    },


    /**
     * 设置免费蓄力音效索引为默认值
     */
    setFreeXuLiIndexDefault: function() {
        this.curFreeXuLiIndex = 0;
    },


    /**
     * 播放免费蓄力音效
     */
    playFreeXuLiEffect: function() {
        if (this.curFreeXuLiIndex >= this.freeXuLiArr.length - 1) {
            this.curFreeXuLiIndex = 0;
        }
        else {
            this.curFreeXuLiIndex += 1;
        };
        this._playEffect(this.freeXuLiArr[this.curFreeXuLiIndex], false);
    },


    /**
     * 播放常规蓄力音效
     */
    playNormalXuLiEffect: function() {
        this._playEffect("normalXuLi", false);
    },


    /**
     * 播放免费弹框展示时的背景音乐
     */
    playFreeTipsLongEffect: function(isLoop) {
        this._playEffect("freeTipsLongEffect", isLoop);
    },


    /**
     * 播放免费SPIN完成时弹框展示时的背景音乐
     */
    playFreeFinishedResultLongEffect: function(isLoop) {
        this._playEffect("freeFinishedResultLongEffect", isLoop);
    },


    /**
     * 播放分数相乘的音效
     */
    playScoreMultiplyEffect: function() {
        this._playEffect("scoreMultiply", false);
    },


    /**
     * 播放分数相乘完成的音效
     */
    playScoreMultiplyEndEffect: function() {
        this._playEffect("scoreMultiplyEnd", false);
    },
});


