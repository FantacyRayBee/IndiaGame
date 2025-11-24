
cc.Class({
    extends: cc.Component,
    properties: {
        lab_1: cc.Label,
        lab_2: cc.Label,
        img_coin1: cc.Node,
        img_coin2: cc.Node,
        btn_get: cc.Button,
    },
    onLoad() {
        this.btn_get.node.on('click', this.btnClick, this);
        this.btn_get.interactable = false;
    },

    start () {
    },

    //changed:转换的金币值, coin:本次获得的货币数量, bonus:本次获得的代金券数量
    setStartCoin: function(changed, coin, bonus, remind) {
        this.lab_1.string = changed.toString();;
        this.startCoin = changed;
        this.coin = coin;
        this.bonus = bonus;
        this.remind = remind;
        this.PlayAnimation();
    },

    waitForSeconds(time = 0) {
        return new Promise((resolve) => {
            this.scheduleOnce(() => {
                if (this.isValid) {
                    resolve();
                }
            }, time);
        });
    },

    async PlayAnimation() {
        await this.waitForSeconds(0.7);
        CommonFun.getInstance().startTextAnimation(this.lab_1, this.startCoin, 0, ()=>{}, 2.3);
        await this.waitForSeconds(2.1);
        cc.tween(this.img_coin2)
        .to(1.2, { scale: 1 })
        .start();
        CommonFun.getInstance().startTextAnimation(this.lab_2, 0, this.remind, ()=>{}, 2.3);
        await this.waitForSeconds(1);

        var fadeIn = cc.fadeIn(1); // 参数表示动作持续的时间，单位为秒
        this.btn_get.node.runAction(fadeIn);
        this.btn_get.interactable = true;
    },

    btnClick: function() {
        GlobalCfg.G_COMPONENTS.Audio.playBack();
        this.node.destroy();
        if (this.bonus > 0) {
            CommonFun.getInstance().showRewardsTips([{ id: 10, amount: this.coin },{ id: 12, amount: this.bonus }]);
        }
        else {
            CommonFun.getInstance().showRewardsTips([{ id: 10, amount: this.coin }]);
        }
    }
});