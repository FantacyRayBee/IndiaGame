cc.Class({
    extends: cc.Component,

    properties: {
        lab_win: cc.Label,
        node_freeNumTips: cc.Node,
        node_freeAllWin: cc.Node,
    },

    ctor: function() {
        this.isNormal = true;
    },

    setChangeStateData: function(isNormal, labStr) {
        this.isNormal = isNormal;
        return new Promise((resolve, reject) => {

            GlobalCfg.ACT_SCENE_CTRL.zeusAudiosCtrl.pauseMusic();

            this.node_freeNumTips.active = isNormal;
            this.node_freeAllWin.active = !isNormal;

            if (isNormal == true) {
                GlobalCfg.ACT_SCENE_CTRL.zeusAudiosCtrl.playFreeTipsShowEffect();
                this.scheduleOnce(() => {
                    GlobalCfg.ACT_SCENE_CTRL.zeusAudiosCtrl.playFreeTipsLongEffect(true);
                }, 1.5);
                this.lab_win.string = `${labStr}`;
            }
            else {
                GlobalCfg.ACT_SCENE_CTRL.zeusAudiosCtrl.playFreeFinishedResultShowEffect();
                this.scheduleOnce(() => {
                    GlobalCfg.ACT_SCENE_CTRL.zeusAudiosCtrl.playFreeFinishedResultLongEffect(false);
                }, 1);
                this.scheduleOnce(() => {
                    GlobalCfg.ACT_SCENE_CTRL.zeusAudiosCtrl.resumeMusic();
                }, 6);

                this.lab_win.string = GlobalCfg.ACT_SCENE_CTRL.getCoinFormatStr(labStr);
            };

            this.node.on("click", () => {
                this.unscheduleAllCallbacks();
                GlobalCfg.ACT_SCENE_CTRL.zeusAudiosCtrl.playFreeFinishedEffect();
                GlobalCfg.ACT_SCENE_CTRL.zeusAudiosCtrl.resumeMusic();
                this.node.destroy();
                resolve();
            }, this);
        })
    },

    onDestroy: function() {
        this.unscheduleAllCallbacks();

        let audioClipNameArr = [
            "freeFinishedResultLongEffect", "freeFinishedResultShow", 
            "freeTipsLongEffect", "freeTipsShow", 
        ];

        for (let i = 0, len = audioClipNameArr.length; i < len; i++) {
            let audioClipName = audioClipNameArr[i];
            GlobalCfg.ACT_SCENE_CTRL.zeusAudiosCtrl.stopEffectByAudioClipName(audioClipName);
        };
    },
});
