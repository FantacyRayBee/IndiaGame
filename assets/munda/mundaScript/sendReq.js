cc.Class({
    extends: cc.Component,

    // 游戏登录
    loginReq: function () {
        GameServerManager.send("gameservice.login", "LoginReq", {
            userid: GlobalCfg.USER_DATAS.userId,	    //用户ID
            token: GlobalCfg.USER_DATAS.token,	    //登录服拿到的token
            fromid: GlobalCfg.PRODUCT_ID       //平台
        });
    },

    // 加入vip座位
    JoinVipReq: function (seat, act) {
        GameServerManager.send("gameservice.joinvip", "JoinVipReq", {
            seat: seat,
            act: act
        });
    },

    //   获取普通玩家列表
    playerlistReq: function (page, size) {
        GameServerManager.send("gameservice.playerlist", "PlayerListReq", {
            page: page,
            size: size,
        });
    },

    //获取VIP玩家列表
    VipListReq: function () {
        GameServerManager.send("gameservice.viplist", "VipListReq", {});
    },

    //   下注类型()
    callReq: function (amount, types) {
        GameServerManager.send("gameservice.call", "CallReq", {
            amount: amount * 100,
            boss: types,
        });
    },

    // 退出游戏
    ExitGameReq: function () {
        GameServerManager.send("gameservice.exitgame", "ExitGameReq", {});
    },

    QueryGameEndInfoReq: function () {
        GameServerManager.send("gameservice.querygameendinfo", "QueryGameEndInfoReq", {});
    },
});
