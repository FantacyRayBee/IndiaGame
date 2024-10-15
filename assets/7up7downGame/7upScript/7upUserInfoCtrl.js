cc.Class({
    extends: require('UINode'),

    properties: {
        sprite_vipLevelIcon: cc.Sprite,
        atlas_icon: cc.SpriteAtlas,
    },

    ctor() {
        this.playerid = 0;
        this.downSiteState = true;
    },

    onLoad() {
        this.posX = this.node.x;
        this.posY = this.node.y;
        this.nodeTx = this.node.getChildByName("node_tx");
        this.nodeTxmask = this.nodeTx.getChildByName("node_txmask")
        this.userTx = this.nodeTxmask.getChildByName("user_tx").getComponent(cc.Sprite);            //用户的头像
        this.img_dx = this.nodeTx.getChildByName("img_dx").getComponent(cc.Sprite);                 //断线中的图标
        this.img_dx.activr = false;
        this.nodeuserInfo = this.node.getChildByName("user_name_input");
        this.userName = this.nodeuserInfo.getChildByName("lab_userName").getComponent(cc.Label);   //用户名
        this.labGold = this.nodeuserInfo.getChildByName("lab_gold").getComponent(cc.Label);        //金币数量
        this.textBg = this.node.getChildByName("bg");
        this.lab_num = this.node.getChildByName("bg").getChildByName("lab_num").getComponent(cc.Label);                 //赢得的数目
        this.textBg.active = false;
        this.lab_num.node.active = false;
        this.msgHandle = ClientNotify.register(GlobalCfg.MSG_TYPE.serverMsg, this.onEventMsg, this);
        this.nodePos = this.node.getPosition();
        this.btn_gift = this.node.getChildByName("btn_gift").getComponent(cc.Button);
        this.btn_gift.node.on("click", this.btnClick, this);
    },

    btnClick: function (button) {
        let btnName = button.node.name;
        GlobalCfg.G_COMPONENTS.Audio.playButton();
        LoggerUtil.getInstance().log("发送自定义消息！！！！");
        if (btnName == "btn_gift") {
            if(this.checkSelfIsVip() == true){
                ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, { msgCode: "btn_gift", msgData: { SiteId: 0 } });
            }else{
                CommonFun.getInstance().showMsgBox("VIP players can use this function", "YES", () => { }, false);
            }
            
        }
    },

    checkSelfIsVip:function(){
        let playerid = this.playerid;
        for (let i = 0,len = GlobalCfg.ACT_SCENE_CTRL.vipPlayerScriptArr.length; i < len; i++) {
            let vipPlayerScript = GlobalCfg.ACT_SCENE_CTRL.vipPlayerScriptArr[i];
            if(playerid == vipPlayerScript.getPlayerID()){
                return true
            }
        }
        return false
        
    },

    onEventMsg: function (webData, target) {
        let self = target;
        let msgId = webData.msgCode;
        let notify = webData.msgData;
        if (msgId == "gameservice.currencycovert") {
            self.setDiamond(notify.srcCurrency.Remain);
            self.setCoin(notify.dstCurrency.Remain);
            GlobalCfg.USER_DATAS.userCoin = notify.dstCurrency.Remain;
            GlobalCfg.USER_DATAS.userDiamond = notify.srcCurrency.Remain;
        }
        // else if (msgId == "lobbyservice.updatesafe") {
        //     self.setCoin(notify.coin);
        //     GlobalCfg.USER_DATAS.userCoin = notify.coin;
        // } 
        else if (msgId == "gameservice.updatebalance" || msgId == "lobbyservice.updatebalance") {
            self.setCoin(notify.balance);
            GlobalCfg.USER_DATAS.userCoin = notify.balance;
        }
    },

    start() {

    },

    onDestroy: function () {
        ClientNotify.removeByHandle(GlobalCfg.MSG_TYPE.serverMsg, this.msgHandle);
    },

    setPlayerInfo: function (userinfo) {
        this.setName(GlobalCfg.USER_DATAS.userName);
        if (GlobalCfg.USER_DATAS.userHeadimgurl !== null) {
            this.loadHeadSp(GlobalCfg.USER_DATAS.userHeadimgurl, 90, this.userTx);
        } else {
            LoggerUtil.getInstance().log("收到的头像URL为空！")
        }
        this.setCoin(userinfo.Diamond);
        this.setPlayerid(userinfo.PlayerId);
        if (userinfo.vipLevel >= 1 && userinfo.vipLevel <= 10 && CommonFun.getInstance().isOpenVipModule()) {
            this.sprite_vipLevelIcon.node.active = true;
            this.sprite_vipLevelIcon.spriteFrame = this.atlas_icon.getSpriteFrame(`${userinfo.vipLevel}`);
        }
        else {
            this.sprite_vipLevelIcon.node.active = false;
        };

        let isCanShowVIPFont = CommonFun.getInstance().isCanShowVIPFontByLevel(userinfo.vipLevel);
        if (isCanShowVIPFont) {
            this.userName.node.color = new cc.Color(250, 225, 76); 
        }
        else {
            this.userName.node.color = new cc.Color(255, 255, 255); 
        };
    },

    setWinNum: function (num) {
        if (num <= 0) { return };
        let number = FloatCalculation.accDiv(num, 100);
        this.lab_num.string = "+" + number;
        this.textBg.active = true;
        this.lab_num.node.active = true;
        cc.tween(this.textBg)
        .to(1,{ position: cc.v2(0,60) })
        .delay(0.5)
        .call(()=>{
            this.textBg.position = cc.v2(0, 30);
            this.textBg.active = false;
            this.lab_num.node.active = false;
        })
        .start();
    },

    setName: function (name) {
        this.name = name;
        if (this.userName) {
            this.userName.string = CommonFun.getInstance().getStrByLength(name, 9);;
        }
    },

    setCoin: function (coin) {
        this.coin = coin / 100;
        if (this.labGold && coin != null) {
            this.labGold.string = CommonFun.getInstance().numberToShow(this.coin);
            // this.labGold.string = CommonFun.getInstance().numberToShow(this.coin);
            GlobalCfg.USER_DATAS.userDiamond = coin;
        }
    },

    betAction:function(){
        let posY = this.posY;
        let posX = this.posX;
        cc.tween(this.node)
            .to(0.1,{position:cc.v2(posX, posY + 15)})
            .to(0.1,{position:cc.v2(posX, posY)})
            .start();
    },

    setPlayerid: function (playerid) {
        if (!playerid) {
            LoggerUtil.getInstance().error("playerID为空");
            return;
        }
        this.playerid = playerid;
    },

    getPlayerid: function () {
        return this.playerid;
    },

    //设置该座位能否入座
    setVipSiteState: function (state) {
        this.vipSiteState = state;
        // this.nodeTxmask.getComponent(cc.Button).interactable = state;       //true时可用，false不可用
    },

    getVipSiteState: function () {
        return this.vipSiteState;
    },

    winGoldMoveAnim(count, winGoldArr) {
        let pos = this.getVipPlayerPos();
        for (let i = 0; i < count; i++) {
            cc.tween(winGoldArr[i])
                .to(0.15, { scale: 1, position: pos })
                .call(() => {
                    this.removeJbNode(winGoldArr[i])
                })
                .start();
        }
    },

});
