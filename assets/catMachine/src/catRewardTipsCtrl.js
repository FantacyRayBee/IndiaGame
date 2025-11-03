cc.Class({
    extends: cc.Component,

    properties: {
        skeleton_wing: sp.Skeleton,
        btn_quick: cc.Button,

        lab_score: cc.Label,
    },

    ctor: function() {
        this.stopShowScoreTween = false;

        this.loadBundleName = "catMachine";
        this.skeletonUrl = "spine/pop/";
        this.skeletonNameArr = [
            'animation_bigwin','animation_megawin','animation_epicwin','animation_superwin','animation_superwin'
        ];
        this.soundNameArr = [
            'smallWin','midWin','bigWin','superWin','superWin'
        ]
        this.callback = null;
    },

    showRewardTips: function(curSpinAllWin, bigWinLevel, callback) {
        return new Promise((resolve, reject) => {
            // GlobalCfg.ACT_SCENE_CTRL.mayaAudiosCtrl.pauseMusic();
            this.callback = callback;
            GlobalCfg.ACT_SCENE_CTRL.playGameSound("win");
            GlobalCfg.ACT_SCENE_CTRL.playGameSound(this.soundNameArr[bigWinLevel - 1]);
            let skeletonName = this.skeletonNameArr[bigWinLevel - 1];
            this.loadSkeletonData(skeletonName, (skeletonData, self) => {
                if (self && this.skeleton_wing) {
                    this.skeleton_wing.skeletonData = skeletonData;
                    this.skeleton_wing.setAnimation(0, skeletonName, false); 
                };
            }, this);

            this.btn_quick.node.on("click", CommonFun.getInstance().debounce(() => {
                this.btn_quick.interactable = true;
                this.stopShowScoreTween = true;
                this.lab_score.string = GlobalCfg.ACT_SCENE_CTRL.getCoinFormatStr(curSpinAllWin); 
                this.scheduleOnce(() => {
                    this.playEndAnim();
                    resolve();
                }, 1);
            }, 1), this);

            this.setAllWinScore(curSpinAllWin, 2);
        });
    },

    playEndAnim: function() {
        this.btn_quick.interactable = false;
        this.callback && this.callback();
        this.node.destroy();
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
    },

    loadSkeletonData: function(skeletonName, func = null, target = null) {
        if (!skeletonName || skeletonName.length == 0) {
            return;
        };
        let self = this;
        this.loadGameAssets(self.loadBundleName, (bundle, target) => {
            bundle.load(self.skeletonUrl + skeletonName, sp.SkeletonData, (err, skeletonData) => {
                if (!err) {
                    func && func(skeletonData, target);
                }
                else{
                    LoggerUtil.getInstance().error(err);
                }
            });
        }, target);
    },

    loadGameAssets: function (gameBundleName, func, target) {
        if (gameBundleName) {
            CommonFun.getInstance().loadBundle(gameBundleName, (bundle) => {
                func && func(bundle, target);
            }, (err) => {
                LoggerUtil.getInstance().error(err);
            });
        }
    },
});
