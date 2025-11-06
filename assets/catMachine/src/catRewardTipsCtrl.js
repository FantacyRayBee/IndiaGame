cc.Class({
    extends: cc.Component,

    properties: {
        skeleton_wing: sp.Skeleton,
        btn_quick: cc.Button,

        lab_score: cc.Label,
    },

    ctor: function() {
        // 不再允许中途打断分数滚动
        this.stopShowScoreTween = false;

        this.loadBundleName = "catMachine";
        this.skeletonUrl = "spine/pop/";
        this.skeletonNameArr = [
            'animation_bigwin','animation_megawin','animation_epicwin','animation_superwin','animation_superwin'
        ];
        this.soundNameArr = [
            'smallWin','midWin','bigWin','superWin','superWin'
        ];
        this.callback = null;
        this._scoreTweenTarget = null; // 记录 tween 目标，便于必要时清理
    },

    showRewardTips: function(curSpinAllWin, bigWinLevel, callback) {
        return new Promise((resolve) => {
            this.callback = callback;

            // 播放音效
            GlobalCfg.ACT_SCENE_CTRL.playGameSound("win");
            GlobalCfg.ACT_SCENE_CTRL.playGameSound(this.soundNameArr[bigWinLevel - 1]);

            // 载入并播放对应 Spine
            const skeletonName = this.skeletonNameArr[bigWinLevel - 1];
            this.loadSkeletonData(skeletonName, (skeletonData, self) => {
                if (self && this.skeleton_wing) {
                    this.skeleton_wing.skeletonData = skeletonData;
                    this.skeleton_wing.setAnimation(0, skeletonName, false);
                }
            }, this);

            // 进来先禁用点击，等数字滚完再放开
            if (this.btn_quick) this.btn_quick.interactable = false;

            // 先清理旧监听，避免重复绑定
            if (this._boundQuickHandler) {
                this.btn_quick.node.off("click", this._boundQuickHandler, this);
            }

            // 只允许触发一次
            this._boundQuickHandler = CommonFun.getInstance().debounce(() => {
                // 能点到这里，说明滚动已经结束并且按钮已解锁
                this.playEndAnim();
                resolve();
            }, 1);

            this.btn_quick.node.once("click", this._boundQuickHandler, this);

            // 开始数字滚动；滚动结束后会自动把按钮解锁
            this.setAllWinScore(curSpinAllWin, 2);
        });
    },

    playEndAnim: function() {
        if (this.btn_quick) this.btn_quick.interactable = false;
        this.callback && this.callback();
        this.node.destroy();
    },

    /**
     * 分数滚动；结束时解锁按钮
     * @param {number} score
     * @param {number} time
     */
    setAllWinScore: function(score, time) {
        // 显示从 0 到 score 的数字滚动
        const obj = { num: 0 };
        this._scoreTweenTarget = obj;

        cc.tween(obj)
            .to(
                time,
                { num: score },
                {
                    progress: (start, end, current, t) => {
                        if (this && this.lab_score) {
                            const v = start + (end - start) * t;
                            this.lab_score.string = GlobalCfg.ACT_SCENE_CTRL.getCoinFormatStr(v);
                        }
                        return start + (end - start) * t;
                    }
                }
            )
            .call(() => {
                // 保障最终显示为目标值
                if (this && this.lab_score) {
                    this.lab_score.string = GlobalCfg.ACT_SCENE_CTRL.getCoinFormatStr(score);
                }
                // 数字滚动结束 → 允许点击
                if (this && this.btn_quick) {
                    this.btn_quick.interactable = true;
                }
            })
            .start();
    },

    onDestroy: function() {
        this.unscheduleAllCallbacks();

        // 清理点击监听
        if (this._boundQuickHandler && this.btn_quick && this.btn_quick.node) {
            this.btn_quick.node.off("click", this._boundQuickHandler, this);
            this._boundQuickHandler = null;
        }
        this._scoreTweenTarget = null;
    },

    loadSkeletonData: function(skeletonName, func = null, target = null) {
        if (!skeletonName || skeletonName.length === 0) return;
        let self = this;
        this.loadGameAssets(self.loadBundleName, (bundle, target2) => {
            bundle.load(self.skeletonUrl + skeletonName, sp.SkeletonData, (err, skeletonData) => {
                if (!err) {
                    func && func(skeletonData, target);
                } else {
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
