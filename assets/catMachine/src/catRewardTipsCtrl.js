cc.Class({
    extends: cc.Component,

    properties: {
        skeleton_wing: sp.Skeleton,
        btn_quick: cc.Button,
        lab_score: cc.Label,
    },

    ctor: function() {
        this.loadBundleName = "catMachine";
        this.skeletonUrl = "spine/pop/";
        this.skeletonNameArr = [
            'animation_bigwin','animation_megawin','animation_epicwin','animation_superwin','animation_superwin'
        ];
        this.soundNameArr = [
            'smallWin','midWin','bigWin','superWin','superWin'
        ];
        this.callback = null;

        // === 新增：状态与引用 ===
        this._scoreTweenTarget = null;   // tween 的目标对象 { num }
        this._scoreTween = null;         // tween 引用，便于 stop
        this._isRolling = false;         // 是否正在数字滚动
        this._finalScore = 0;            // 本次应显示的最终分数
        this._boundQuickHandler = null;  // 点击处理器引用
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

            // 初始禁用，等开始滚动后再启用（允许快进）
            if (this.btn_quick) this.btn_quick.interactable = true;

            // 清理旧监听
            if (this._boundQuickHandler && this.btn_quick && this.btn_quick.node) {
                this.btn_quick.node.off("click", this._boundQuickHandler, this);
            }

            // === 改动核心：点击优先快进；已到终点则结束 ===
            this._boundQuickHandler = () => {
                if (this._isRolling) {
                    this._fastForwardScore(); // 直接显示最终结果
                    return;                   // 本次不 resolve，允许用户再点一次结束
                }
                // 已经是最终结果 → 正常结束
                this.playEndAnim();
                resolve();
            };
            if (this.btn_quick && this.btn_quick.node) {
                // 用 on 而不是 once：第一次可快进，第二次再结束
                this.btn_quick.node.on("click", this._boundQuickHandler, this);
            }

            // 开始数字滚动
            this.setAllWinScore(curSpinAllWin, 2);
        });
    },

    playEndAnim: function() {
        if (this.btn_quick) this.btn_quick.interactable = false;
        this.callback && this.callback();
        this.node && this.node.destroy();
    },

    /**
     * 分数滚动；可被点击中断为最终值
     * @param {number} score
     * @param {number} time
     */
    setAllWinScore: function(score, time) {
        this._finalScore = score;

        // 目标与初值
        const obj = { num: 0 };
        this._scoreTweenTarget = obj;
        this._isRolling = true;

        // 先确保标签显示为 0
        if (this.lab_score) {
            this.lab_score.string = GlobalCfg.ACT_SCENE_CTRL.getCoinFormatStr(0);
        }

        // 创建并保存 tween 引用
        this._scoreTween = cc.tween(obj)
            .to(
                time,
                { num: score },
                {
                    progress: (start, end, current, t) => {
                        const v = start + (end - start) * t;
                        if (this && this.lab_score) {
                            this.lab_score.string = GlobalCfg.ACT_SCENE_CTRL.getCoinFormatStr(v);
                        }
                        return v;
                    }
                }
            )
            .call(() => {
                // 结束收尾
                if (this && this.lab_score) {
                    this.lab_score.string = GlobalCfg.ACT_SCENE_CTRL.getCoinFormatStr(score);
                }
                this._isRolling = false;   // 标记滚动完成
                // 此时按钮已可点：再点一下就结束
                if (this && this.btn_quick) {
                    this.btn_quick.interactable = true;
                }
                this._scoreTween = null;
            });

        this._scoreTween.start();
    },

    // === 新增：快进到最终结果 ===
    _fastForwardScore: function() {
        // 停止 tween
        if (this._scoreTween) {
            this._scoreTween.stop();
            this._scoreTween = null;
        }
        // 直接显示最终分
        if (this.lab_score) {
            this.lab_score.string = GlobalCfg.ACT_SCENE_CTRL.getCoinFormatStr(this._finalScore);
        }
        this._isRolling = false;
        // 允许再次点击来关闭
        if (this.btn_quick) {
            this.btn_quick.interactable = true;
        }
    },

    onDestroy: function() {
        this.unscheduleAllCallbacks();

        // 停止并释放 tween
        if (this._scoreTween) {
            this._scoreTween.stop();
            this._scoreTween = null;
        }
        this._scoreTweenTarget = null;
        this._isRolling = false;

        // 清理点击监听
        if (this._boundQuickHandler && this.btn_quick && this.btn_quick.node) {
            this.btn_quick.node.off("click", this._boundQuickHandler, this);
            this._boundQuickHandler = null;
        }
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
