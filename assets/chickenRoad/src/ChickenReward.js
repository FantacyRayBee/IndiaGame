cc.Class({
    extends: cc.Component,

    properties: {
        labRate: cc.Label,
        labWin: cc.Label,
        skeleton: sp.Skeleton,
    },
    start() {
        this.skeleton.setAnimation(0, "animation", false);

        setTimeout(() => {
            GlobalCfg.ACT_SCENE_CTRL.endGame()
            // 3秒后销毁
            GlobalCfg.ACT_SCENE_CTRL.popupLayer.destroyAllChildren();
            GlobalCfg.ACT_SCENE_CTRL.popupLayer.active = false;
            GlobalCfg.ACT_SCENE_CTRL.touchbg.active = false;
        }, 3000);
    },

    setData(notify) {
        // 领取奖励
        let rate = notify.mul;      // 倍数
        let amount = notify.amount; // 领取的金额
        this.labRate.string = "X" + CommonFun.getInstance().fixed(rate);
        this.labWin.string = "+" + CommonFun.getInstance().fixed(amount / 100)
    },
});