cc.Class({
    extends: cc.Component,

    properties: {
        btn_close: cc.Button,
        lab_tips: cc.Label,
        spine_reward: sp.Skeleton,
    },

    onLoad: function() {
        this.btn_close.node.on("click", () => {
            GlobalCfg.G_COMPONENTS.Audio.playButton();
            this.node.destroy();
        }, this);
    },

    setVipRewardToastAmount: function(amount, isBonus) {
        GlobalCfg.G_COMPONENTS.Audio.playSoundByNameInResources("sajinbi", false);
        this.spine_reward.setAnimation(0, isBonus ? "animation2" : "animation", true);
        this.lab_tips.string = CommonFun.getInstance().formatCurrencyAmount(amount);
    },
});
