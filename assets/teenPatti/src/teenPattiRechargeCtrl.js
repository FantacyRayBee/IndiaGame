cc.Class({
    extends: cc.Component,

    properties: {
        lab_cash: cc.Label,
        lab_extraCash: cc.Label,
        lab_bonus: cc.Label,
        lab_total: cc.Label,
        lab_amount: cc.Label,
        lab_timeTip: cc.Label,

        btn_close: cc.Button,
        btn_addCash: cc.Button,
    },

    ctor: function() {
        this.rechargeData = {};
    },


    onLoad: function() {
        this.btn_close.node.on('click', CommonFun.getInstance().debounce(this.btnClickCall, 1), this);
        this.btn_addCash.node.on('click', CommonFun.getInstance().debounce(this.btnClickCall, 1), this);
    },

    onDestroy: function() {
        this.clearChongZhiActTimer();
    },


    btnClickCall: function(btn) {
        GlobalCfg.G_COMPONENTS.Audio.playButton();
        let btnName = btn.node.name;
        switch (btnName) {
            case this.btn_close.node.name:
                this.node.destroy();
                break;
            case this.btn_addCash.node.name:
                this.dealBtnAddCashEvent();
                break;
            default:
                break;
        }
    },

    setTeenPattiRechargeData: function(data) {
        this.rechargeData = data;

        let id = data.id;               // 商品ID(支付接口用)
        let amount = data.amount;       // 金额
        let add = data.add;             // 额外赠送-dep
        let bonus = data.bonus;         // 额外赠送-bonus

        this.lab_cash.string = CommonFun.getInstance().formatCurrencyAmount(amount / 100);
        this.lab_extraCash.string = CommonFun.getInstance().formatCurrencyAmount(add / 100);
        this.lab_bonus.string = CommonFun.getInstance().formatCurrencyAmount(bonus / 100);
        this.lab_total.string = CommonFun.getInstance().formatCurrencyAmount((amount + add + bonus) / 100);
        this.lab_amount.string = CommonFun.getInstance().formatCurrencyAmount(amount / 100);
    },

    setTeenPattiRechargeTime: function(time) {
        let actTime = time - Math.floor(new Date().getTime() / 1000);
        this.lab_timeTip.string = `You Have ${actTime}s to Recharge`;
        actTime -= 1;
        let actTimerCall = () => {
            if (this && this.lab_timeTip) {
                if (actTime < 0) {
                    this.clearChongZhiActTimer();
                    this.lab_timeTip.string = `You Have 0s to Recharge`;
                    return;
                };
                this.lab_timeTip.string = `You Have ${actTime}s to Recharge`;
                actTime -= 1;
            };
        };
        this.actTimer = setInterval(actTimerCall, 1000);
    },


    dealBtnAddCashEvent: function() {
        CommonFun.getInstance().rechargeByCommodityId(this.rechargeData.id, `TP局内${this.rechargeData.plot ? "-剧情" : ""}`, () => {
            this.node.destroy();
        });
    },

    clearChongZhiActTimer: function () {
        if (this.actTimer) {
            clearInterval(this.actTimer);
            this.actTimer = null;
        };
    },
});
