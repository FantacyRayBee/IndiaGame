

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

     //   获取普通玩家列表
    playerlistReq: function (page,rows) {
        GameServerManager.send("gameservice.playerlist", "PlayerListReq", {
            page : page,
            rows : 12,
        });
    },

    // 加入房间
    JoinRoomReq: function () {
        GameServerManager.send("gameservice.joinroom", "JoinRoomReq", {});
    },

     // 加入vip座位
    JoinVipPosReq: function (pos) {
        GameServerManager.send("gameservice.joinvippos", "JoinVipPosReq", {
            pos :pos 
        });
    
    },

     //   下注类型
    callReq: function (amount,types) {
        if(amount>0) {
            GameServerManager.send("gameservice.call", "CallReq", {
                amount : amount,
                types : types,
            });
        }
    },

     // 获取获取战绩信息
    GameRecordListReq: function (pos) {
        GameServerManager.send("gameservice.gamerecordlist", "GameRecordListReq", {});
    },

     // 退出游戏
     OutGameReq: function () {
        GameServerManager.send("gameservice.outgame", "OutGameReq", {});
    },

  

  
});
