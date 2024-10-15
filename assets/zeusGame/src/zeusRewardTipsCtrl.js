cc.Class({
    extends: cc.Component,

    properties: {
        skeleton_fallingCoin: sp.Skeleton,
        skeleton_wing: sp.Skeleton,

        node_notAnim: cc.Node,

        node_title1: cc.Node,
        node_title2: cc.Node,
        node_title3: cc.Node,
        node_title4: cc.Node,
        node_title5: cc.Node,

        lab_score: cc.Label,
    },

    ctor: function() {
        this.stopShowScoreTween = false;
    },

    showRewardTips: function(curSpinAllWin, bigWinLevel, isNormal) {
        return new Promise((resolve, reject) => {

            GlobalCfg.ACT_SCENE_CTRL.zeusAudiosCtrl.pauseMusic();

            this.node_title1.active = bigWinLevel == 1 ? true : false;
            this.node_title2.active = bigWinLevel == 2 ? true : false;
            this.node_title3.active = bigWinLevel == 3 ? true : false;
            this.node_title4.active = bigWinLevel == 4 ? true : false;
            this.node_title5.active = bigWinLevel == 5 ? true : false;  

            this.skeleton_wing.node.active = true;
            this.skeleton_wing.timeScale = 1.5;
            this.skeleton_wing.defaultSkin = 'default';
            this.skeleton_wing.setAnimation(0, 'Chuxian', false); 
            this.skeleton_fallingCoin.setAnimation(0, 'animation', true);
            this.node.getComponent(cc.Button).interactable = false;
            this.node_notAnim.active = true;
            this.node.on("click", CommonFun.getInstance().debounce(() => {
                this.stopShowScoreTween = true;
                this.lab_score.string = GlobalCfg.ACT_SCENE_CTRL.getCoinFormatStr(curSpinAllWin); 
                this.scheduleOnce(() => {
                    this.playXiaoShiAnim(bigWinLevel);
                }, 1);
            }, 1), this);  
            this.skeleton_wing.setCompleteListener((trackEntry, loopCount) => {
                let name = trackEntry.animation.name;
                if (name == 'Chuxian') {
                    this.node.getComponent(cc.Button).interactable = true;
                    this.skeleton_wing.setAnimation(0, 'Daiji', true);
                }
                else if (name == 'Xiaoshi') {
                    GlobalCfg.ACT_SCENE_CTRL.zeusAudiosCtrl.resumeMusic();
                    this.node.destroy();
                    resolve();
                };
            });
           

            if (bigWinLevel == 1) {
                GlobalCfg.ACT_SCENE_CTRL.zeusAudiosCtrl.playBigWin1ShowEffect();
                this.scheduleOnce(() => {
                    this.playXiaoShiAnim(bigWinLevel);
                }, 13);
                this.setAllWinScore(curSpinAllWin, 12);
            }
            else if (bigWinLevel == 2) {
                if (isNormal) {
                    GlobalCfg.ACT_SCENE_CTRL.zeusAudiosCtrl.playBigWin2ShowNotFreeEffect();
                }
                else {
                    GlobalCfg.ACT_SCENE_CTRL.zeusAudiosCtrl.playBigWin2ShowFreeEffect();
                };
                this.scheduleOnce(() => {
                    GlobalCfg.ACT_SCENE_CTRL.zeusAudiosCtrl.playBigWin2AddCoinEffect();
                }, 0.6);
                this.scheduleOnce(() => {
                    this.playXiaoShiAnim(bigWinLevel);
                }, 11);
                this.setAllWinScore(curSpinAllWin, 10);
            }
            else if (bigWinLevel == 3) {
                if (isNormal) {
                    GlobalCfg.ACT_SCENE_CTRL.zeusAudiosCtrl.playBigWin3ShowNotFreeEffect();
                }
                else {
                    GlobalCfg.ACT_SCENE_CTRL.zeusAudiosCtrl.playBigWin3ShowFreeEffect();
                };
                this.scheduleOnce(() => {
                    GlobalCfg.ACT_SCENE_CTRL.zeusAudiosCtrl.playBigWin3AddCoinEffect();
                }, 2.5);
                this.scheduleOnce(() => {
                    this.playXiaoShiAnim(bigWinLevel);
                }, 18);
                this.setAllWinScore(curSpinAllWin, 17);
            }
            else if (bigWinLevel == 4) {
                if (isNormal) {
                    GlobalCfg.ACT_SCENE_CTRL.zeusAudiosCtrl.playBigWin4ShowNotFreeEffect();
                }
                else {
                    GlobalCfg.ACT_SCENE_CTRL.zeusAudiosCtrl.playBigWin4ShowFreeEffect();
                };
                this.scheduleOnce(() => {
                    GlobalCfg.ACT_SCENE_CTRL.zeusAudiosCtrl.playBigWin4AddCoinEffect();
                }, 1.5);
                this.scheduleOnce(() => {
                    this.playXiaoShiAnim(bigWinLevel);
                }, 13.5);
                this.setAllWinScore(curSpinAllWin, 12.5);
            }
            else if (bigWinLevel == 5) {
                if (isNormal) {
                    GlobalCfg.ACT_SCENE_CTRL.zeusAudiosCtrl.playBigWin5ShowNotFreeEffect();
                }
                else {
                    GlobalCfg.ACT_SCENE_CTRL.zeusAudiosCtrl.playBigWin5ShowFreeEffect();
                };
                this.scheduleOnce(() => {
                    GlobalCfg.ACT_SCENE_CTRL.zeusAudiosCtrl.playBigWin5AddCoinEffect();
                }, 1.5);
                this.scheduleOnce(() => {
                    this.playXiaoShiAnim(bigWinLevel);
                }, 24.5);
                this.setAllWinScore(curSpinAllWin, 23.5);
            };
        });
    },


    playXiaoShiAnim: function(bigWinLevel) {
        this.unscheduleAllCallbacks();
        this.node.getComponent(cc.Button).interactable = false;
        this.skeleton_wing.setAnimation(0, 'Xiaoshi', false);
        this.node_notAnim.active = false;
        this.skeleton_fallingCoin.node.active = false;
        if (bigWinLevel == 1) {
            GlobalCfg.ACT_SCENE_CTRL.zeusAudiosCtrl.playBigWin1EndEffect();
        }
        else if (bigWinLevel == 2) {
            GlobalCfg.ACT_SCENE_CTRL.zeusAudiosCtrl.playBigWin2EndEffect();
        }
        else if (bigWinLevel == 3) {
            GlobalCfg.ACT_SCENE_CTRL.zeusAudiosCtrl.playBigWin3EndEffect();
        }
        else if (bigWinLevel == 4) {
            GlobalCfg.ACT_SCENE_CTRL.zeusAudiosCtrl.playBigWin4EndEffect();
        }
        else if (bigWinLevel == 5) {
            GlobalCfg.ACT_SCENE_CTRL.zeusAudiosCtrl.playBigWin5EndEffect();
        };
    },

    setAllWinScore: function(score, time) {
        let obj = {};
        obj.num = 0;

        cc.tween(obj)
        .to(
            time,
            {num: score},
            {
                progress: (start, end, current, t) => {
                    if (this && this.lab_score && this.stopShowScoreTween == false) {
                        let temp = (end - start == 0) ? GlobalCfg.ACT_SCENE_CTRL.getCoinFormatStr(score) : GlobalCfg.ACT_SCENE_CTRL.getCoinFormatStr(start + (end - start) * t);
                        this.lab_score.string = temp; 
                    };
                    return start + (end - start) * t;
                }
            }
        )
        .start();
    },

    onDestroy: function() {
        this.unscheduleAllCallbacks();
        // "bigWin5End", "bigWin4End", "bigWin3End", "bigWin2End", "bigWin1End", 
        let audioClipNameArr = [
            "bigWin1Show", 
            "bigWin2ShowFree", "bigWin2ShowNotFree", "bigWin2AddCoin", 
            "bigWin3ShowFree", "bigWin3ShowNotFree", "bigWin3AddCoin", 
            "bigWin4ShowFree", "bigWin4ShowNotFree", "bigWin4AddCoin", 
            "bigWin5ShowFree", "bigWin5ShowNotFree", "bigWin5AddCoin", 
        ];

        for (let i = 0, len = audioClipNameArr.length; i < len; i++) {
            let audioClipName = audioClipNameArr[i];
            GlobalCfg.ACT_SCENE_CTRL.zeusAudiosCtrl.stopEffectByAudioClipName(audioClipName);
        };
    },
});
