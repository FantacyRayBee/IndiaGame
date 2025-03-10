cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {

    },

    loginReq: function () {
        GameServerManager.send("gameservice.login", "LoginReq", {
            userid: GlobalCfg.USER_DATAS.userId,	    //用户ID
            token: GlobalCfg.USER_DATAS.token,	    //登录服拿到的token
            fromid: GlobalCfg.PRODUCT_ID,
            isFree: GlobalCfg.GAME_ENTER_ISFREE,       //是否进入免费场
        });
    },

    exitGameReq: function (call) {
        GameServerManager.send("gameservice.exit", "ExitGameCallReq", {
            Call: call
        });
    },

    
    gameSceneReq: function () {
        GameServerManager.send("gameservice.gamescene", "GameSceneReq", {

        });
    },

    /**
     * 
     * @param {*} playerid 
     * @param {Array} call {Amount,type}
     */
    sendCallReq: function (call) {
        GameServerManager.send("gameservice.call", "CallReq", {
            Call: call
        });
    },

    
    // update (dt) {},
});
