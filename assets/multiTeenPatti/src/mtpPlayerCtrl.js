cc.Class({
    extends: require('UINode'),

    properties: {
        lab_coin: cc.Label,
        sprite_tx: cc.Sprite,
        btn_gift: cc.Button,
        lab_win: cc.Label,
        textBg: cc.Node,
        bqAtlas:cc.SpriteAtlas,
        sprite_vipLevelIcon: cc.Sprite,
        atlas_icon: cc.SpriteAtlas,
    },
    ctor() {
        this.giftPos_1 = cc.v2(-50, -8);
        this.siteID = 0;
        this.isSitePlayer = false;
        this.Wincoin = 0;
        this.diamond = 0;
        this.vipNodePosArr = [cc.v2(567, -147), cc.v2(567, 13), cc.v2(567, 172), cc.v2(-568, 172), cc.v2(-568, 13), cc.v2(-568, -147)];
    },

    onLoad() {
        this.posX = this.node.x;
        this.posY = this.node.y;
        this.nodePos = this.node.getPosition();
        this.btn_gift.node.on("click", this.btnClick, this);
    },

    onDestroy: function () {
        this.node_chat && (this.node_chat.active = false);
    },

    start() {

    },

    btnClick: function (button) {
        let btnName = button.node.name;
        GlobalCfg.G_COMPONENTS.Audio.playButton();
        if (btnName == "btn_gift") {
            if (GlobalCfg.ACT_SCENE_CTRL.hasDown == true) {
                CommonFun.getInstance().showGameGifInteraction(this.siteID);
            } 
            else {
                CommonFun.getInstance().showTips("You're not a VIP. You can't send expressions");
            };
        }
    },

    setPlayerInfo: function (data, isLogin = false, mainCtrl = null) {
        if (isLogin == true) {
            if (GlobalCfg.USER_DATAS.userHeadimgurl !== null) {
                this.loadHeadSp(GlobalCfg.USER_DATAS.userHeadimgurl, 106, this.sprite_tx);
            } else {
                LoggerUtil.getInstance().log("收到的头像URL为空！")
            }
            this.setCoin(data.diamond);
            this.setPlayerid(data.playerId);
        } else {
            this.displayName = data.displayName;
            this.setPlayerid(data.playerId);
            if (data.imgUrl) {
                this.loadHeadSp(data.imgUrl, 106, this.sprite_tx);
            }
            this.setCoin(data.diamond);
            this.siteID = data.seat;
            this.seatid = data.seat;
            this.curSeat = data.seat;
            this.setVipNodePos(this.siteID);
            if (this.siteID <= 3) {
                this.btn_gift.node.position = this.giftPos_1 = cc.v2(-50, -8);
            }
        }
        this.setUserBgOraLab();

        if (data.vipLevel >= 1 && data.vipLevel <= 10 && CommonFun.getInstance().isOpenVipModule()) {
            this.sprite_vipLevelIcon.node.active = true;
            this.sprite_vipLevelIcon.spriteFrame = this.atlas_icon.getSpriteFrame(`${data.vipLevel}`);
        }
        else {
            this.sprite_vipLevelIcon.node.active = false;
        };
    },

    setWinNum: function (num) {
        if (num <= 0) { return };
        let number = parseFloat((num / 100).toFixed(2));
        this.lab_win.string = "+" + number;
        this.textBg.active = true;
        cc.tween(this.textBg)
            .to(1, { position: cc.v2(0, 90) })
            .delay(0.5)
            .call(() => {
                this.textBg.position = cc.v2(0, 30);
                this.textBg.active = false;
            })
            .start();
    },

    setCoin: function (coin, isSelf = false) {
        this.coin = coin / 100;
        if (this.lab_coin && coin != null) {
            this.lab_coin.string = CommonFun.getInstance().numberToShow(this.coin);
            if (isSelf == true) {
                GlobalCfg.USER_DATAS.userDiamond = coin;
            }
        }
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

    //设置VIP节点的坐标
    setVipNodePos: function (siteID) {
        if (siteID == 0 || siteID > 6) {
            LoggerUtil.getInstance().error("传入的seatID为0,不设置坐标，return,传入的id为", siteID);
            return
        }
        this.nodePos = this.vipNodePosArr[siteID - 1];
        this.node.setPosition(this.nodePos);
    },

    /**
     * 获取当前节点的坐标
     * @returns {cc.v2}
     */
    getVipNodePos: function (siteID) {
        // LoggerUtil.getInstance().log("===================================",this.vipNodePosArr[siteID - 1])
        return this.vipNodePosArr[siteID - 1];
    },

    //下注动作
    betAction: function () {
        let posY = this.posY;
        let posX = this.posX;
        cc.tween(this.node)
            .to(0.1, { position: cc.v2(posX, posY + 15) })
            .to(0.1, { position: cc.v2(posX, posY) })
            .start();
    },

    // 设置节点左右的位置
    setUserBgOraLab:function(){
            this.node_chat = this.node.getChildByName("node_chat");
            this.chat_bg =  this.node_chat.getChildByName("chat_bg");
            this.lab_qph = this.chat_bg.getChildByName("chat_bg_01").getChildByName("lab_qph").getComponent(cc.Label);
            this.node_emotion = this.node.getChildByName("emotion");
           
            if (this.curSeat == 1 || this.curSeat==2 || this.curSeat == 3) {
                this.btn_gift.node.setPosition(48,0);
                this.sprite_vipLevelIcon.node.setPosition(-48, 0);
                this.chat_bg.scaleX = 1;
                this.lab_qph.node.scaleX = -1;
                this.chat_bg.setPosition(185,100)
                this.node_emotion.setPosition(-123,-35)
            } else if(this.curSeat == 4 || this.curSeat==5 || this.curSeat == 6){
                this.btn_gift.node.setPosition(-48,0);
                this.sprite_vipLevelIcon.node.setPosition(48, 0);
                this.chat_bg.scaleX = -1;
                this.lab_qph.node.scaleX = 1;
                this.chat_bg.setPosition(-185,100)
                this.node_emotion.setPosition(123,-35)
            }
    },



    // 发送表情  消息类型 0短语 1表情
    face:function(notify){
        let data = notify;
        let msgtype = notify.msgType;
        let msgid = data.name;

        if ( msgtype == 0){
            this.lab_qph.node.stopAllActions()
            this.node_chat.active = true;
            this.lab_qph.node.setPosition(156,6)
            this.lab_qph.string = msgid;

            cc.tween(this.lab_qph.node)
            .to(3, { position: cc.v2(-105, 6) })
            .call(() => {
                this.node_chat.active = false;
            })
            .start()

        }else if( msgtype == 1 ) {
            this.node_emotion.stopAllActions()
            this.node_emotion.active = true
            this.node_emotion.getComponent(cc.Sprite).spriteFrame = this.bqAtlas.getSpriteFrame(msgid);

            cc.tween(this.node_emotion)
            .repeat(4,cc.tween().by(0.5, { position: cc.v2(0,-5) }).by(0.5, { position: cc.v2(0,5) }))
            .call(() => {
                this.node_emotion.active = false
                this.node_emotion.getComponent(cc.Sprite).spriteFrame = null
            })
            .start()
    }
},

    // update (dt) {},
});
