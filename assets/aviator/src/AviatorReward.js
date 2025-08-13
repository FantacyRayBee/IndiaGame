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
        LoggerUtil.getInstance().log("caojun 1111111 notify == ", notify);

        let time = notify.time;     // 时间坐标
        let rate = notify.mul;      // 倍数
        let amount = notify.amount; // 领取的金额
        let after = notify.after;   // 钱包剩余
        let result = Math.floor(rate / 10) / 100;
        this.labRate.string = result.toFixed(2) + "X";
        this.labWin.string = (amount / 100).toFixed(2)
        GlobalCfg.USER_DATAS.userDiamond = after;
    },
});
