

cc.Class({
    extends: cc.Component,

    properties: {
        lab_aetA: cc.Label,
        lab_aetB: cc.Label,
        lab_userName: cc.Label,
        lab_userCoin: cc.Label,
        lab_packer: cc.Label,
        lab_win: cc.Label,
        lab_qph: cc.Label,
        node_emotion: cc.Node,
        node_chat: cc.Node,
        node_packer: cc.Node,
        bqAtlas: cc.SpriteAtlas,
        yellow: cc.SpriteFrame,
        red:  cc.SpriteFrame,
        win: sp.Skeleton,
        btn_gift: cc.Button,
        node_actCion: cc.Node,
        sprite_vipLevelIcon: cc.Sprite,
        atlas_icon: cc.SpriteAtlas,
        atlas_new_icon: cc.SpriteAtlas,
    },

    onLoad: function() {
        this.node.on(cc.Node.EventType.TOUCH_START,()=>{
            GlobalCfg.G_COMPONENTS.Audio.playButton();
            CommonFun.getInstance().showUserIU(this.imgurl, this.nickname, this.diamond, GlobalCfg.ACT_SCENE_CTRL.entrycondition==0)
        },this)

        this.btn_gift.node.on('click', this.btnClick, this);
    },

    setLobbyThisToPlayer: function(self) {
        this.lobbyThis = self;
    },

    setPlayerImgUrl: function(imgurl) {
        let self = this;
        this.imgurl = imgurl;
        cc.assetManager.loadRemote(imgurl, {ext: '.png'}, (err, texture) => {
            if(!err && cc.isValid(self) && cc.isValid(self.headSp)){
                self.headSp.spriteFrame = new cc.SpriteFrame(texture);
                self.headSp.node.setScale(90/self.headSp.node.width);
            }
        });
    },

    setPlayerNickName: function(nickname) {
        this.nickname = nickname;
        this.lab_userName.string =  CommonFun.getInstance().getStrByLength(this.nickname, 8);
    },

    setPlayerDiamond: function(diamond) {
        this.diamond = diamond;
        this.lab_userCoin.string = CommonFun.getInstance().numberToShow(this.diamond / 100, GlobalCfg.ACT_SCENE_CTRL.entrycondition);
        if (GlobalCfg.ACT_SCENE_CTRL.mySeatId == this.seatid) {
            ClientNotify.send(GlobalCfg.MSG_TYPE.serverMsg, {
                msgCode: "Andar_SelfDiamond_Change",
                msgData: { diamond: this.diamond }
            });
        }
    },

    setCoin: function(diamond) {
        this.diamond = diamond;
        this.lab_userCoin.string = CommonFun.getInstance().numberToShow(this.diamond / 100, GlobalCfg.ACT_SCENE_CTRL.entrycondition);
    },

    setPlayerBetInfo: function(betInfo) {
        this.betAScore = betInfo[0] / 100;
        this.betBScore = betInfo[1] / 100;

        this.lab_aetA.string = this.betAScore;
        this.lab_aetB.string = this.betBScore;

        this.firstBetScore = this.betAScore + this.betBScore;
    },

    getPlayerFirstBetScore: function() {
        return this.firstBetScore ? this.firstBetScore : 0;
    },

    getPlayerBetAScore: function() {
        return this.betAScore ? this.betAScore : 0;
    },

    getPlayerBetBScore: function() {
        return this.betBScore ? this.betBScore : 0;
    },

    setPlayerPlayerId: function(playerId) {
        this.playerId = playerId;
    },

    getPlayerPlayerId: function() {
        return this.playerId;
    },

    setPlayerSeatID: function(seatID) {
        if (seatID >= 5) {
            LoggerUtil.getInstance().log("服务器下发的玩家座位信息错误!");
            return;
        };

        this.seatid = seatID; 
        this.curSeat = (this.seatid - GlobalCfg.ACT_SCENE_CTRL.mySeatId + 5) % 5;
        this.nodePos = this.userSeatSort[this.curSeat];
        this.node.name = "" + this.curSeat;
        this.node.setPosition(this.nodePos.x, this.nodePos.y);
        if (this.curSeat == 1 || this.curSeat == 2) {
            this.btn_gift.node.x = 47.5; 
            this.node_chat.parent.setPosition(-110,114)
            this.node_chat.scaleX = -1
            this.node_chat.getChildByName("lab_wz").scaleX = -1;
            this.sprite_vipLevelIcon.node.setPosition(-48, 0);
        } 
        else {
            this.btn_gift.node.x = -47.5; 
            this.sprite_vipLevelIcon.node.setPosition(48, 0);
        };

        let a_input = this.node.getChildByName("user_head_bg").getChildByName("a_input");
        let b_input = this.node.getChildByName("user_head_bg").getChildByName("b_input");
        if (this.curSeat == 2) {
            a_input.setPosition(-141, 22);  
            b_input.setPosition(-141, -37);
        } 
        else {
            a_input.setPosition(141, 22);  
            b_input.setPosition(141, -37);
        };
    },

    getPlayerSeatID: function() {
        return this.seatid;
    },

    setPlayerGameSettleEffect: function(win) {
        if (win <= 0) {
            return;
        };

        GlobalCfg.ACT_SCENE_CTRL.AndererAudioCtrl.playGameSound("gz");
        let spine = GlobalCfg.ACT_SCENE_CTRL.skeleDataMap.get("winner_dj");
        this.win.skeletonData = spine;
        this.win.setAnimation(0, "star", false); 
        this.win.setCompleteListener((trackEntry, loopCount) => {
            var name = trackEntry.animation.name;
            if (name == "star" ){
                this.win.setAnimation(0, "out", false); 
            } 
            else if (name == "out") {
                this.node_actCion.active = true;
                this.node_actCion.setPosition(0, 65);
                this.lab_win.string = "+" + win/100;
                cc.tween(this.node_actCion)
                .to(1, {position: cc.v2(0, 100)})
                .delay(0.5)
                .call(() => {
                    this.node_actCion.active = false;
                })
                .start()
            }
        })
    },

    setPlayerSkippedStatusActive: function(active = false) {
        this.node_packer.active = active ;
    },

    // 玩家倒计时
    // time剩余可走的时间
    countDownTime: function(time, isShow){
        let timeSpriteNode = this.node.getChildByName("time_02");
        let sprite = timeSpriteNode.getComponent(cc.Sprite); 
        if (isShow) {
            let betDurationMs = 7;
            if (this.lobbyThis && this.lobbyThis.betDurationMs) {
                betDurationMs = this.lobbyThis.betDurationMs;
            };
            let count = time * 10;
            let callback = () => {
                count -= 1;
                if (sprite.fillRange <= 0 || count <= 0) {
                    this.unschedule(callback);
                    sprite.fillRange = 0;
                    timeSpriteNode.active = false;
                    return;
                } 
                else {
                    sprite.fillRange = count/(betDurationMs * 10);
                    if (sprite.fillRange <= 0.35) {  
                        sprite.spriteFrame = this.red;
                    };
                }; 
            };
            this.schedule(callback, 0.1);

            sprite.fillRange = time/betDurationMs;
            sprite.spriteFrame = this.yellow;
            timeSpriteNode.active = true;
        }
        else {
            timeSpriteNode.active = false;
            this.unscheduleAllCallbacks();
        };
    },

    getUserLab: function() {
        this.userSeatSort = [cc.v2(-77, -172), cc.v2(376, -142), cc.v2(596, 76), cc.v2(-602, 76), cc.v2(-523, -142)];
        this.user_head = this.node.getChildByName("user_head_bg");
        this.headSp = this.user_head.getChildByName("mask").getChildByName("suer_head_02").getComponent(cc.Sprite);
        this.lab_win.string =  "";
        this.img_gold = this.node.getChildByName("user_head_bg").getChildByName("img_gold")
        this.img_cm =  this.node.getChildByName("user_head_bg").getChildByName("img_cm");

        if (GlobalCfg.ACT_SCENE_CTRL.entrycondition == 0 ) {
            this.isPractice = true;
            this.lab_userCoin.node.x = 8;
            this.img_gold.active = false
            this.img_cm.active = true
        } 
        else {
            this.isPractice = false;
            this.lab_userCoin.node.x = 0;
            this.img_gold.active = true
            this.img_cm.active = false
        }
    },

    // 发送表情  消息类型 0短语 1表情
    face: function(notify){
        let data = notify;
        let msgtype = notify.msgType;
        let msgid = data.name;

        if (msgtype == 0) {
            this.lab_qph.node.stopAllActions();
            this.node_chat.active = true;
            this.lab_qph.node.setPosition(156,6)
            this.lab_qph.string = msgid;
            cc.tween(this.lab_qph.node)
            .to(3, { position: cc.v2(-105, 6) })
            .call(() => {
                this.node_chat.active = false;
            })
            .start()
        }
        else if (msgtype == 1) {
            this.node_emotion.stopAllActions()
            this.node_emotion.active = true
            this.node_emotion.getComponent(cc.Sprite).spriteFrame = this.bqAtlas.getSpriteFrame(msgid);
            cc.tween(this.node_emotion)
            .repeat(4,cc.tween().by(0.5, { position: cc.v2(0,-5) }).by(0.5, { position: cc.v2(0,5) }))
            .call(() => {
                this.node_emotion.getComponent(cc.Sprite).spriteFrame = null
            })
            .start();
        };
    },


    btnClick: function(button){
        GlobalCfg.G_COMPONENTS.Audio.playButton();
        if (this.lobbyThis) { 
            CommonFun.getInstance().showGameGifInteraction(this.seatid);
        } 
        else {
            CommonFun.getInstance().showTips("Interface loading...");
        }
    },

    setPlayerVipLevel: function(vipLevel) {
        // if (vipLevel >= 1 && vipLevel <= 10 && CommonFun.getInstance().isOpenVipModule()) {
        //     this.sprite_vipLevelIcon.node.active = true;
            // this.sprite_vipLevelIcon.spriteFrame = this.atlas_icon.getSpriteFrame(`${vipLevel}`);
            let targetVipLevel = Number(vipLevel);
            if (isNaN(targetVipLevel) || targetVipLevel < 0) {
                targetVipLevel = Math.floor(Math.random() * 30) + 1; // 0-30随机数
            }
            this.sprite_vipLevelIcon.spriteFrame = this.atlas_new_icon.getSpriteFrame(`vip_${targetVipLevel}`);
        // }
        // else {
        //     this.sprite_vipLevelIcon.node.active = false;
        // };

        let isCanShowVIPFont = CommonFun.getInstance().isCanShowVIPFontByLevel(vipLevel);
        if (isCanShowVIPFont) {
            this.lab_userName.node.color = new cc.Color(250, 225, 76); 
        }
        else {
            this.lab_userName.node.color = new cc.Color(255, 255, 255);
        };
    },
});
