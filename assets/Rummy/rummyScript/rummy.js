cc.Class({
    extends: cc.Component,

    properties: {
        pab_rummy2: cc.Prefab,
        pab_rummy6: cc.Prefab,
    },

    onLoad: function() {
        CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.SHOW_RUMMY_GAME);

        let rummyList = GlobalCfg.USER_DATAS.gameRoomList.rummy ? GlobalCfg.USER_DATAS.gameRoomList.rummy : [];
        if (GlobalCfg.SMALL_GAME_DATAS.rummyData.roomID) {
            for (let i = 0; i < rummyList.length; i++) {
                if (rummyList[i].id == GlobalCfg.SMALL_GAME_DATAS.rummyData.roomID) {
                    GlobalCfg.SMALL_GAME_DATAS.rummyData.enterPlayerNum = rummyList[i].num;
                };
            };
        };
       
        this.msgHandle = ClientNotify.register(GlobalCfg.MSG_TYPE.serverMsg, this.onEventMsg, this);

        this.rummyLoginReq();
    },

    //Rummy 登录
    rummyLoginReq: function () {
        GameServerManager.send("gameservice.login", "LoginReq", {
            userid: GlobalCfg.USER_DATAS.userId,	    //用户ID
            token: GlobalCfg.USER_DATAS.token,	    //登录服拿到的token
            fromid: GlobalCfg.PRODUCT_ID       //平台
        });
    },

    onEventMsg: function (webData, target) {
        let self = target;
        var msgId = webData.msgCode;
        var notify = webData.msgData;
        if (msgId === "gameservice.login") {                                // 登录游戏
            CommonFun.getInstance().hidProgress();
            if (notify.roomId != -1) {
                GlobalCfg.SMALL_GAME_DATAS.rummyData.roomID = notify.roomId;
            }
            GlobalCfg.SMALL_GAME_DATAS.rummyData.enterPlayerNum = self.getCurRoomNumsByRoomId();
            LoggerUtil.getInstance().warn(`进入房间ID: ${notify.roomId},是${GlobalCfg.SMALL_GAME_DATAS.rummyData.enterPlayerNum}人场`);
            if (GlobalCfg.SMALL_GAME_DATAS.rummyData.enterPlayerNum == 2) {
                if(self.node.getChildByName('rummy_2')){
                    return;
                }
                self.rummy2 = cc.instantiate(self.pab_rummy2);
                self.rummy2.parent = self.node;
            } else {
                if(self.node.getChildByName('rummy_6')){
                    return;
                }
                self.rummy6 = cc.instantiate(self.pab_rummy6);
                self.rummy6.parent = self.node;
            }
        }
    },

    getCurRoomNumsByRoomId() {
        let roomId = GlobalCfg.SMALL_GAME_DATAS.rummyData.roomID;
        let num = 2;
        let rummyList = GlobalCfg.USER_DATAS.gameRoomList.rummy ? GlobalCfg.USER_DATAS.gameRoomList.rummy : [];
        for (let i = 0, len = rummyList.length; i < len; i++) {
            let room = rummyList[i];
            if (room.id == roomId) {
                num = room.num;
            }
        }
        return num;
    },

    onDestroy: function() {
        ClientNotify.removeByHandle(GlobalCfg.MSG_TYPE.serverMsg, this.msgHandle);
        CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.EXIT_RUMMY_GAME);
    },
});
