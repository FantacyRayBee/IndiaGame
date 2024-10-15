cc.Class({
    extends: cc.Component,

    properties: {
       
    },

    ctor: function() {
        this.netReconnection = 0;
    },
    
    onLoad () {
        this.houtai = false;
        this.eventShow();
        this.eventHide();
        this.msgHandle = ClientNotify.register(GlobalCfg.MSG_TYPE.serverMsg,this.onEventMsg,this);  
        this.msgHandle1 = ClientNotify.register(GlobalCfg.MSG_TYPE.clientMsg, this.onEventMsg, this);
    },

    onDestroy: function () {
        ClientNotify.removeByHandle(GlobalCfg.MSG_TYPE.serverMsg, this.msgHandle);
        ClientNotify.removeByHandle(GlobalCfg.EVENT_NET_OPEN, this.msgHandle1);
    },

    onEventMsg:function(webData,target){
        let self = target;
        var msgId = webData.msgCode;
        var notify = webData.msgData;
        if (msgId == "gameservice.login" && self.netReconnection == 1){
            LoggerUtil.getInstance().log("重连后台登录了")
            let mainScript = self.node.getComponent('7upCtrl')
            let scene = cc.director.getScene();
        } else if (msgId == GlobalCfg.CLIENT_MSG_ID.NET_OPEN && notify === "GAME_SERVER" && self.netReconnection == 1) {
            // GlobalCfg.SMALL_GAME_DATAS.upDownData.upThisCtrl.Up7LoginReq();
        }
    },

    // 游戏切回到前台
    eventShow:function(){
        cc.game.on(cc.game.EVENT_SHOW, () => {  
            if (this.houtai) {
                this.netReconnection = 1;
                GameServerManager.hideFilterMag(2,function () {
                    GameServerManager.send("gameservice.gamestartnotify", "GameStartNotifyReq", {});
                })
            } 
            else {
                this.netReconnection = 2;
            }
        }, this);
    },

    //游戏切入到后台
    eventHide:function(){
        cc.game.on(cc.game.EVENT_HIDE, function () {   
            GameServerManager.hideFilterMag(1)
            this.houtai = true
        }, this);
    },

    


    start () {

    },

    update (dt) {},


});
