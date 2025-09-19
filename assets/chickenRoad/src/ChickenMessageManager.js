
cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {

    },

    // update (dt) {},

    /**
     * 登录
     */
    sendLoginMessage() {
        GameServerManager.send("gameservice.login", "LoginReq", {
            userid: GlobalCfg.USER_DATAS.userId,
            token: GlobalCfg.USER_DATAS.token,
        });
    },

    /**
     * 刷新游戏场景
     */
    sendRefreshMessage() {
        GameServerManager.send("gameservice.loadwhole", "LoadWholeReq", {

        });
    },

    /**
     * 退出
     */
    sendExitMessage() {
        GameServerManager.send("gameservice.exit", "ExitReq", {

        });
    },

    /**
     * 获取玩家列表
     * @param {Number} _page 页数 , 0 代表第一页
     * @param {Number} _rows 
     */
    sendGetPlayerListMessage(_page, _rows) {
        GameServerManager.send("gameservice.playerlist", "PlayerListReq", {
            page: _page,
            rows: _rows,
        });
    },

    /**
     * 玩家下注
     * @param {Number} amount 下注金额
     */
    sendBetMessage(amount) {
        GameServerManager.send("gameservice.bet", "BetReq", {
            amount: amount,
        });
    },

    /**
     * 领取奖励
     * @param {Number} _time 时间坐标
     * @param {Number} _mul 倍数
     */
    sendGetCashMessage(_time, _mul) {
        GameServerManager.send("gameservice.cash", "CashReq", {
            x: Math.round(_time * 1000),
            mul: Math.round(Number(_mul) * 1000),
        });
    },

});