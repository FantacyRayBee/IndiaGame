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
        this.labRate.string = CommonFun.getInstance().fixed(result) + "X";
        this.labWin.string = CommonFun.getInstance().fixed(amount / 100)
        GlobalCfg.USER_DATAS.userDiamond = after;
    },
});
