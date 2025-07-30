cc.Class({
    extends: cc.Component,

    properties: {
        labRate: cc.Label,
        labWin: cc.Label,
    },
    start() {
    },

    setData(notify) {
        // 领取奖励
        let time = notify.time;     // 时间坐标
        let rate = notify.mul;      // 倍数
        let amount = notify.amount; // 领取的金额
        let after = notify.after;   // 钱包剩余
        this.labRate.string = (rate / 1000).toFixed(2) + "X";
        this.labWin.string = amount / 100;
        GlobalCfg.USER_DATAS.userDiamond = after;
    },
});
