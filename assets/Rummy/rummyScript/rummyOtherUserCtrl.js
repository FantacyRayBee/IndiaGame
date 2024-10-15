cc.Class({
    extends: require('UINode'),

    properties: {
        cir_green: cc.SpriteFrame,
        cir_yellow: cc.SpriteFrame,
        bqAtlas: cc.SpriteAtlas,
        win : sp.Skeleton,

        sprite_vipLevelIcon: cc.Sprite,
        atlas_icon: cc.SpriteAtlas,
    },

    ctor(){
        this.isUserGame = false;    // 判断改玩家是否在房间中
        this.playerid = null;
    },

    onLoad() {
        this.tx_k = this.node.getChildByName("tx_k");
        this.tx_k.active = false;
        this.tx = this.tx_k.getChildByName("tx").getComponent(cc.Sprite);
        this.lab_name = this.tx_k.getChildByName("lab_name").getComponent(cc.Label);
        this.lab_jb = this.tx_k.getChildByName("lab_jb").getComponent(cc.Label);
        this.node_green = this.tx_k.getChildByName("time_sprite_green");
        this.node_green.active = false;
        this.node_yellow = this.tx_k.getChildByName("time_sprite_yellow");
        this.node_yellow.active = false;
        this.btn_gift = this.tx_k.getChildByName("btn_gift_other").getComponent(cc.Button);
        // this.btn_gift.node.on("click", this.btnClick, this);
        this.sprite_cir = this.tx_k.getChildByName("ovel_green").getComponent(cc.Sprite);
        this.lab_roundTime = this.sprite_cir.node.getChildByName("lab_roundTime").getComponent(cc.Label);
        this.sprite_cir.node.active = false;
        this.ovel = this.tx_k.getChildByName("ovel");
        this.lab_allTime = this.ovel.getChildByName("lab_allTime").getComponent(cc.Label);
        this.ovel.active = false;
        this.imgCoin = this.tx_k.getChildByName("img_cm");
        this.state_mask = this.tx_k.getChildByName("state_mask");
        this.state_mask.active = false;

        this.nodePos = this.node.getPosition();
        
        this.rootNode = this.node.parent.parent;
        this.sprite_enemy_qph = this.rootNode.getChildByName("node_face").getChildByName("node_enemyFace").getChildByName("sprite_enemy_qph"); 
        this.sprit_enemyEmotion = this.rootNode.getChildByName("node_face").getChildByName("node_enemyFace").getChildByName("sprit_enemyEmotion"); 
        this.lab_enemy_qph = this.sprite_enemy_qph.getChildByName("lab_enemy_qph"); 
        this.myCionType = this.rootNode.getChildByName("userNode").getChildByName("score_bg").getChildByName("sprite_cm"); 
        this.myChip = this.rootNode.getChildByName("userNode").getChildByName("score_bg").getChildByName("img_cm"); 
        this.shopType = this.rootNode.getChildByName("btn_shop").getChildByName("Background").getChildByName("btn_cz");
    
        if(GlobalCfg.ACT_SCENE_CTRL.entrycondition == 0){         //体验场
            this.lab_jb.node.position = cc.v2(11,-56);
            this.myChip.active = true;
            this.myCionType.active = false;
            this.shopType.active = false;
            this.node.getChildByName('coinMask').getChildByName('coin').active = false;
        }else{
            this.lab_jb.node.position = cc.v2(1,-56);
            this.myChip.active = false;
            this.imgCoin.active = false;
            this.myCionType.active = true;
            this.shopType.active = true;
        }

        //点击玩家弹出图像
        this.node.on(cc.Node.EventType.TOUCH_START,()=>{
            if(this.isUserGame == true){
                LoggerUtil.getInstance().log("点击玩家弹出图像")
                GlobalCfg.G_COMPONENTS.Audio.playButton();
                CommonFun.getInstance().showUserIU(this.imgUrl,this.nickname, this.coin,GlobalCfg.ACT_SCENE_CTRL.isPractice)
            }
        },this)
    },

    onDestroy() {
        clearInterval(this.myVar);
    },


    setUserInfo(userInfo, seat) {
        // let userInfo = notify.userInfo;
        let relativeSeatId = 0;
        if(GlobalCfg.SMALL_GAME_DATAS.rummyData.enterPlayerNum == 6){
            relativeSeatId =  GlobalCfg.ACT_SCENE_CTRL.changeAbsoluteSeatIdToRelative(seat);
        }else{
            relativeSeatId = seat;
        }
        this.setPlayerState(userInfo.playerStatus);
        this.playerid = userInfo.playerId;
        this.displayName = userInfo.displayName;
        this.sex = userInfo.sex;
        this.nickname = userInfo.nickname;
        this.setCoin(userInfo.diamond);
        this.setNickName(userInfo.nickname);
        if (relativeSeatId >= 0) {
            this.setSeatId(relativeSeatId);
        }
        if (userInfo.imgUrl) {
            this.loadHeadSp(userInfo.imgUrl, 76, this.tx);
            this.imgUrl = userInfo.imgUrl;
        }
        this.tx_k.active = true;
        this.isUserGame = true;   

        if (userInfo.vipLevel >= 1 && userInfo.vipLevel <= 10 && CommonFun.getInstance().isOpenVipModule()) {
            this.sprite_vipLevelIcon.node.active = true;
            this.sprite_vipLevelIcon.spriteFrame = this.atlas_icon.getSpriteFrame(`${userInfo.vipLevel}`);
        }
        else {
            this.sprite_vipLevelIcon.node.active = false;
        };

        let isCanShowVIPFont = CommonFun.getInstance().isCanShowVIPFontByLevel(userInfo.vipLevel);
        if (isCanShowVIPFont) {
            this.lab_name.node.color = new cc.Color(250, 225, 76); 
        }
        else {
            this.lab_name.node.color = new cc.Color(255, 255, 255);
        };
        LoggerUtil.getInstance().log("设置了对方玩家的信息，且显示");
    },

    freshUser() {
        this.isUserGame = false;   
        this.tx_k.active = false;
        this.node_green.active = false;
        this.node_yellow.active = false;
        this.sprite_cir.node.active = false;
        this.ovel.active = false;
        this.sprit_enemyEmotion.active = false;
        this.imgUrl = null;
    },

    countDown: function (isShow, roundTime = 0, extraTime = 0, isGameOver = false, playerstatus) {
        clearInterval(this.myVar);
        this.myVar = null;
        this.callback = null;
        if(playerstatus == 5){  //已完成摆牌
            return
        }
        let tempRoundTime = Number(roundTime);
        let tempExtraTime = extraTime ? Number(extraTime) : 0;
        let roundTimelememt = roundTime == 0 ? 0 : (1 / 20).toFixed(3);     //0.1 为下方计时器的刷新时间
        let extraTimelememt = extraTime == 0 ? 0 : (1/ 30).toFixed(3);
        let time = roundTime+1;
        let time01 = tempExtraTime+1;


        if (isShow) {
            this.node_green.active = true;
            this.node_yellow.active = false;
            this.sprite_cir.node.active = true;
            this.ovel.active = true;
            this.sprite_cir.spriteFrame = this.cir_green;

            this.lab_roundTime.string = tempRoundTime;
            this.lab_allTime.string = tempExtraTime;

            this.node_green.getComponent(cc.Sprite).fillRange =  roundTimelememt*tempRoundTime;
            this.node_yellow.getComponent(cc.Sprite).fillRange = extraTimelememt*tempExtraTime;
            if(roundTime == 0){
                this.node_green.active = false;
            }
            if (isGameOver == true){
                this.tx_k.getChildByName("ovel_green").active = false;
                this.ovel.active = false;
                this.lab_roundTime.node.active = false;
                this.lab_allTime.node.active = false;
            } else {
                this.tx_k.getChildByName("ovel_green").active = true;
                this.ovel.active = true;
                this.lab_roundTime.node.active = true;
                this.lab_allTime.node.active = true;
            }
        } else {
            this.node_green.active = false;
            this.node_yellow.active = false;
            this.sprite_cir.node.active = false;
            this.ovel.active = false;
            return;
        }

      
        this.callback = () => {
            if (tempRoundTime <= 0) {
                if (tempExtraTime > 0) {               //还有额外时间
                    time01--
                    this.node_green && (this.node_green.active = false);
                    this.node_yellow && (this.node_yellow.active = true);
                    this.sprite_cir && (this.sprite_cir.spriteFrame = this.cir_yellow);

                    this.node_yellow && (this.node_yellow.getComponent(cc.Sprite).fillRange = extraTimelememt*time01);
                    this.fillRangeRoundTime(extraTimelememt,2)
                    this.lab_roundTime && (this.lab_roundTime.string = tempExtraTime.toFixed(0));
                    this.lab_allTime && (this.lab_allTime.string = tempExtraTime.toFixed(0));
                    tempExtraTime && (tempExtraTime -= 1);
                } else {
                    if (this.myVar != null) {//判断计时器是否为空
                        clearInterval(this.myVar);
                        this.myVar = null;
                        this.callback = null;
                    }
                        this.lab_allTime && (this.lab_allTime.string = 0);
                        this.lab_roundTime && (this.lab_roundTime.string = 0);
                        this.node_green && (this.node_green.active = false);
                        this.node_yellow && (this.node_yellow.active = false);
                        this.sprite_cir && (this.sprite_cir.node.active = true);
                        this.ovel && (this.ovel.active = true);
                    
                }
            } else {
                time--
                this.node_green && (this.node_green.getComponent(cc.Sprite).fillRange = roundTimelememt*time);
                this.fillRangeRoundTime(roundTimelememt,1)
                this.lab_roundTime && (this.lab_roundTime.string = tempRoundTime.toFixed(0));
                tempRoundTime && (tempRoundTime -= 1);
            }
            GlobalCfg.ACT_SCENE_CTRL.showLobbyUI("shouZhi", false)
        }
        GlobalCfg.ACT_SCENE_CTRL.showLobbyUI("shouZhi", false)
        this.myVar = setInterval(this.callback, 1000);
    },

     fillRangeRoundTime:function(roundTimelememt0,nodeNum){
        let roundTimelememt = Number(roundTimelememt0)/5
        let num = 0
        this.unschedule(this.callbackCion)
        this.callbackCion = function () {
            num++
            if(num >=5){
                num=0
                this.unschedule(this.callbackCion)
            }else{
                if(nodeNum == 1){
                    this.node_green.getComponent(cc.Sprite).fillRange  -= roundTimelememt
                } else {
                    this.node_yellow.getComponent(cc.Sprite).fillRange -= roundTimelememt
                }
               
            }
        }
        this.schedule(this.callbackCion, 0.2);
    },



    getTxUrl() {
        return this.imgUrl;
    },

    //设置玩家的状态 0正常,1弃牌, 2胡,3炸胡,4观战
    setPlayerState(state){
        this.playerStatus = state;
        this.checkPlayerState(state);
    },

    getPlayerState(){
        return this.playerStatus;
    },

    //根据不同的状态设置
    checkPlayerState(state){
        switch (state) {
            case 0:
                this.state_mask.active = false;
                break;
            case 1:
                this.state_mask.active = true;
                break;
            case 2:
        
                break;
            case 3:
            
                break;
            case 4:
            
                break;
            default:
                this.state_mask.active = false;
                break;
        }
    },

    setNickName(nickname) {
        this.lab_name.string = CommonFun.getInstance().getStrByLength(nickname, 8);
    },

    getNickName() {
        LoggerUtil.getInstance().log("其他玩家的NickName", this.lab_name.string);
        return this.lab_name.string;

    },

    setSeatId(data) {
        LoggerUtil.getInstance().log("设置对家座位号！", data);
        this.seatId = data;
        if(data > 3 ){
            this.btn_gift = this.tx_k.getChildByName("btn_gift_other").getComponent(cc.Button);
            this.btn_gift.node.position.x -= 100
        }
    },

    getSeatId() {
        return this.seatId;
    },

    setCoin(coin) {
        this.coin = coin;
        this.lab_jb.string = coin / 100;
    },

    getCoin() {
        return this.coin;
    },

    getPlayerId() {
        return this.playerid
    },

    getPosition(){
        return this.node.position
    },

    start() {

    },

    // 处理弃牌或者摆牌的广播
    gameDropOrFinalcards:function(notify, isDrop){
        let curSeat = GlobalCfg.ACT_SCENE_CTRL.changeAbsoluteSeatIdToRelative(notify.seat);
        LoggerUtil.getInstance().log(curSeat == this.seatId,"摆牌处理方法：",notify);
        if(curSeat == this.seatId){
            if(isDrop){         //弃牌
                this.setPlayerState(1);
            }
            this.setCoin(notify.afterCalc);
            let coinMask = this.node.getChildByName("coinMask");
            coinMask.setPosition(0,0);
            let lab_coin = coinMask.getChildByName("lab_coin").getComponent(cc.Label);
            lab_coin.string = Math.abs(notify.calc) / 100;
            coinMask.active = true;
            coinMask.opacity = 0;
            cc.tween(coinMask)
                .tag(10 + this.seatId)
                .to(0.3, { opacity:255 },{easing: 'fade'})
                .to(0.7, { position: cc.v2(0, -130)},{easing: 'cubicIn'})
                .start()
            this.countDown(false);
        }
        
    },

    gameover:function(notify,score){
        let winSeat = notify.singleEventSeat
        let newScore =  Math.abs(score) 
        if(GlobalCfg.SMALL_GAME_DATAS.rummyData.enterPlayerNum == 6){
            winSeat = GlobalCfg.ACT_SCENE_CTRL.changeAbsoluteSeatIdToRelative(notify.singleEventSeat);
        }
        let coinMask = this.node.getChildByName("coinMask");
        // coinMask.setPosition(0,0);
        let lab_coin = coinMask.getChildByName("lab_coin").getComponent(cc.Label);
        lab_coin.string = newScore / 100;
        
        LoggerUtil.getInstance().log("执行otherCtrl的 GAMEOVER ！");
        if(notify.reason == 1){         //炸胡
            if( winSeat == this.seatId){
                let settleMent;
                if(GlobalCfg.ACT_SCENE_CTRL.node.getChildByName("settlement")){
                    settleMent = GlobalCfg.ACT_SCENE_CTRL.node.getChildByName("settlement");
                } else {
                    settleMent = cc.instantiate(GlobalCfg.ACT_SCENE_CTRL.prefab_jiesuan);
                }
                let settleMentCtrl = null;
                if(GlobalCfg.SMALL_GAME_DATAS.rummyData.enterPlayerNum == 6){
                    settleMentCtrl = settleMent.getComponent("settlementCtrl_6");
                    settleMentCtrl.setGameOverPlayerInfo(notify, GlobalCfg.ACT_SCENE_CTRL, GlobalCfg.ACT_SCENE_CTRL.userInfoCtrl);
                }else{
                    settleMentCtrl = settleMent.getComponent("settlementCtrl");
                    settleMentCtrl.setGameOverPlayerInfo(notify, GlobalCfg.ACT_SCENE_CTRL, GlobalCfg.ACT_SCENE_CTRL.userInfoCtrl, GlobalCfg.ACT_SCENE_CTRL.otherUserCtrl);
                }
                LoggerUtil.getInstance().log("当前的singleEventSeat座位ID：",this.seatId,settleMentCtrl);
                settleMent.parent = GlobalCfg.ACT_SCENE_CTRL.node;
            }
        }else{
            if( winSeat == this.seatId){
                GlobalCfg.ACT_SCENE_CTRL.rummyAudioCtrl.playGameSound("rummyWin");
                let spine =  GlobalCfg.ACT_SCENE_CTRL.skeleDataMap.get("winner_dj");
                this.win.skeletonData = spine;
                this.win.setAnimation(0, "star", false); 
                this.win.setCompleteListener((trackEntry, loopCount) => {
                    var name = trackEntry.animation.name;
                    if( name == "star" ){
                        this.win.setAnimation(0, "loop", true); 
                        this.scheduleOnce(function(){
                            this.win.setAnimation(0, "out", false); 
                        },1)
                    }  else if (name == "out" ) {
                        
                        coinMask.active = false;
                        LoggerUtil.getInstance().log("主控制脚本：",GlobalCfg.ACT_SCENE_CTRL);
                        let settleMent;
                        if(GlobalCfg.ACT_SCENE_CTRL.node.getChildByName("settlement")){
                            settleMent = GlobalCfg.ACT_SCENE_CTRL.node.getChildByName("settlement");
                        } else {
                            settleMent = cc.instantiate(GlobalCfg.ACT_SCENE_CTRL.prefab_jiesuan);
                        }
                        let settleMentCtrl = null;
                        if(GlobalCfg.SMALL_GAME_DATAS.rummyData.enterPlayerNum == 6){
                            settleMentCtrl = settleMent.getComponent("settlementCtrl_6");
                            settleMentCtrl.setGameOverPlayerInfo(notify, GlobalCfg.ACT_SCENE_CTRL, GlobalCfg.ACT_SCENE_CTRL.userInfoCtrl);
                        }else{
                            settleMentCtrl = settleMent.getComponent("settlementCtrl");
                            settleMentCtrl.setGameOverPlayerInfo(notify, GlobalCfg.ACT_SCENE_CTRL, GlobalCfg.ACT_SCENE_CTRL.userInfoCtrl, GlobalCfg.ACT_SCENE_CTRL.otherUserCtrl);
                        }
                        LoggerUtil.getInstance().log("当前的赢家座位ID：",this.seatId,settleMentCtrl);
                        settleMent.parent = GlobalCfg.ACT_SCENE_CTRL.node;
                    } 
                })
            } else{
                coinMask.active = true;
                let pos,pos_end,posToWorld;
                if(notify.singleEventSeat == GlobalCfg.ACT_SCENE_CTRL.selfSeat){
                    posToWorld = GlobalCfg.ACT_SCENE_CTRL.node.convertToWorldSpaceAR(cc.v2(0.435,-315.526));
                }else{
                    pos = GlobalCfg.ACT_SCENE_CTRL.getOtherNodeCtrlBySeat(notify.singleEventSeat)?.getPosition();
                    posToWorld = GlobalCfg.ACT_SCENE_CTRL.node.convertToWorldSpaceAR(pos);
                }
                pos_end = this.node.convertToNodeSpaceAR(posToWorld);
                LoggerUtil.getInstance().log("=======未转换前赢家的位置：",pos,`posToWorld:${posToWorld}`);
                LoggerUtil.getInstance().log("赢家的位置：",pos_end);
                if(coinMask.x == 0 && coinMask.y == 0){
                    cc.Tween.stopAllByTag(10 + this.seatId);
                    cc.tween(coinMask)
                    .to(0.3, { opacity:255 },{easing: 'fade'})
                    .to(0.7, { position: cc.v2(0, -130)},{easing: 'cubicIn'})
                    .to(0.7, { position: pos_end},{easing: 'cubicIn'})
                    .to(0.5, { opacity:0 },{easing: 'fade'})
                    .start()
                }else{
                    coinMask.opacity = 255;
                    coinMask.setPosition(0, -130);
                    cc.tween(coinMask)
                    // .to(0.5, { opacity:255 },{easing: 'fade'})
                    // .to(0.7, { position: cc.v2(0, -130)},{easing: 'cubicIn'})
                    .delay(1)
                    // .call(()=>{
                    // })
                    .to(0.7, { position: pos_end},{easing: 'cubicIn'})
                    .to(0.5, { opacity:0 },{easing: 'fade'})
                    .start()
                }
            }
        }
        
    },

    // 发送表情  消息类型 0短语 1表情
    face: function (notify) {
        let data = notify
        let msgtype = notify.msgType;
        let msgid = data.name;


        if (msgtype == 0) {
            this.lab_enemy_qph.stopAllActions()
            this.sprite_enemy_qph.active = true;
            this.lab_enemy_qph.setPosition(156, 6)
            this.lab_enemy_qph.getComponent(cc.Label).string = msgid;

            cc.tween(this.lab_enemy_qph)
                .to(3, { position: cc.v2(-105, 6) })
                .call(() => {
                    this.sprite_enemy_qph.active = false;
                })
                .start()

        } else if (msgtype == 1) {
            this.sprit_enemyEmotion.stopAllActions()
            this.sprit_enemyEmotion.setPosition(this.nodePos);
            this.sprit_enemyEmotion.active = true
            this.sprit_enemyEmotion.getComponent(cc.Sprite).spriteFrame = this.bqAtlas.getSpriteFrame(msgid);
            cc.tween(this.sprit_enemyEmotion)
                .repeat(4, cc.tween().by(0.1, { position: cc.v2(0, -5) }).by(0.1, { position: cc.v2(0, 5) }))
                .call(() => {
                    this.sprit_enemyEmotion.getComponent(cc.Sprite).spriteFrame = null
                })
                .start()
        }
    },

    // update (dt) {},
});
