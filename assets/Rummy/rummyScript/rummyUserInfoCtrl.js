
cc.Class({
    extends: cc.Component,

    properties: {
        bqAtlas: cc.SpriteAtlas,
        win : sp.Skeleton,
        lab_01 : cc.Label,
        lab_02 : cc.Label,

        sprite_vipLevelIcon: cc.Sprite,
        atlas_icon: cc.SpriteAtlas,
    },


    onLoad() {
        this.lab_jb = this.node.getChildByName("score_bg").getChildByName("lab_jb").getComponent(cc.Label);         //金币
        this.lab_score = this.node.getChildByName("score_bg").getChildByName("lab_score").getComponent(cc.Label);   //分数
        this.lab_scoreName = this.node.getChildByName("score_bg").getChildByName("lab_Score").getComponent(cc.Label);

        this.tx = this.node.getChildByName("tx_k").getChildByName("tx").getComponent(cc.Sprite);                    //头像
        this.time_green = this.node.getChildByName("time_sprite_green").getComponent(cc.Sprite);                    //绿色时间圈
        this.lab_roundTime = this.time_green.node.getChildByName("ovel_green").getChildByName("lab_roundTime").getComponent(cc.Label);      //回合的20秒时间
        this.time_yellow = this.node.getChildByName("time_sprite_yellow").getComponent(cc.Sprite);                  //黄色时间圈
        this.lab_time_yellow = this.time_yellow.node.getChildByName("ovel_yellow").getChildByName("lab_overTime").getComponent(cc.Label);      //超时之后的30秒时间，以lab_allTime时间为准
        this.overTimeNode = this.node.getChildByName("over_time");
        this.lab_allTime = this.overTimeNode.getChildByName("lab_allTime").getComponent(cc.Label);                      //剩余的时间

        this.sprite_my_qph = GlobalCfg.ACT_SCENE_CTRL.node.getChildByName("node_face").getChildByName("node_myFace").getChildByName("sprite_my_qph"); 
        this.sprite_myEmotion  = GlobalCfg.ACT_SCENE_CTRL.node.getChildByName("node_face").getChildByName("node_myFace").getChildByName("sprite_myEmotion"); 
        this.lab_my_qph = this.sprite_my_qph.getChildByName("lab_my_qph"); 

        this.time_green.fillRange = 0;
        this.time_yellow.fillRange = 0;
        this.time_green.node.active = false;
        this.time_yellow.node.active = false;
        this.overTimeNode.active = false;
        this.nodePos = this.node.getPosition();
        this.coinBG = this.node.getChildByName('coinMask').getChildByName('coin');  //金币图片类型
        if (GlobalCfg.ACT_SCENE_CTRL.entrycondition == 0) {
            this.coinBG.active = false
        }

        //点击玩家弹出图像
        this.node.on(cc.Node.EventType.TOUCH_START,()=>{
            GlobalCfg.G_COMPONENTS.Audio.playButton();
            CommonFun.getInstance().showUserIU(this.imgUrl,this.nickname, this.coin,GlobalCfg.ACT_SCENE_CTRL.entrycondition)
        },this)
    },

    onDestroy() {
        clearInterval(this.myVar);
    },

    //倒计时
    countDown: function (isShow, roundTime = 0, extraTime = 0, isGameOver = false, playerstatus) {
        clearInterval(this.myVar);
        this.myVar = null;
        this.callback = null;
        if(playerstatus == 5){  //已完成摆牌
            return
        }
        this.shouZhiCount = true;
        let tempRoundTime = roundTime;
        let tempExtraTime = extraTime ? extraTime : 0;
        let roundTimelememt = roundTime == 0 ? 0 : (1 / 20).toFixed(3);     //0.1 为下方计时器的刷新时间
        let extraTimelememt = extraTime == 0 ? 0 : (1/ 30).toFixed(3);
        let time = roundTime+1;
        let time01 = tempExtraTime;


        if (isShow) {
            this.time_green.node.active = true;
            this.time_yellow.node.active = false;
            this.overTimeNode.active = true;
            this.lab_roundTime.string = tempRoundTime;
            this.lab_allTime.string = tempExtraTime;
            this.time_green.fillRange = roundTimelememt*tempRoundTime;
            this.time_yellow.fillRange = extraTimelememt*tempExtraTime;
            if(roundTime == 0){
                this.time_green.node.active = false;
            }
            if (isGameOver == true){
                this.time_green.node.getChildByName("ovel_green").active = false;
                this.time_yellow.node.getChildByName("ovel_yellow").active = false;
                this.overTimeNode.active = false;
                this.lab_roundTime.node.active = false;
                this.lab_allTime.node.active = false;
            } else{
                this.time_green.node.getChildByName("ovel_green").active = true;
                this.time_yellow.node.getChildByName("ovel_yellow").active = true;
                this.overTimeNode.active = true;
                this.lab_roundTime.node.active = true;
                this.lab_allTime.node.active = true;
            }
        } else {
            this.time_green.node.active = false;
            this.time_yellow.node.active = false;
            this.overTimeNode.active = false;
            return
        }
        

        this.callback = () => {
            if (tempRoundTime <= 0) {
                if (tempExtraTime > 0) {               //还有额外时间
                    this.time_green && (this.time_green.node.active = false);
                    this.time_yellow && (this.time_yellow.node.active = true);
                    if (this.time_yellow && this.time_yellow.fillRange >= extraTimelememt) {
                        this.time_yellow.fillRange = extraTimelememt*time01
                        this.fillRangeRoundTime(extraTimelememt,2)
                    }
                    this.lab_time_yellow && (this.lab_time_yellow.string = tempExtraTime.toFixed(0));
                    this.lab_allTime && (this.lab_allTime.string = tempExtraTime.toFixed(0));
                    tempExtraTime && (tempExtraTime -= 1);
                    time01--
                } else {
                    if (this.myVar != null) {//判断计时器是否为空
                        clearInterval(this.myVar);
                        this.myVar = null;
                        this.callback = null;
                        this.lab_time_yellow && (this.lab_time_yellow.string = 0);
                        this.lab_allTime && (this.lab_allTime.string = 0);
                        this.time_green && (this.time_green.node.active = false);
                        this.time_yellow && (this.time_yellow.node.active = true);
                        this.overTimeNode && (this.overTimeNode.active = true);
                    }
                }
            } else {
                time--
                this.time_green && (this.time_green.fillRange = roundTimelememt*time);
                this.fillRangeRoundTime(roundTimelememt,1)
                this.lab_roundTime && (this.lab_roundTime.string = tempRoundTime.toFixed(0));
                tempRoundTime && (tempRoundTime -= 1);
                if (tempRoundTime && tempRoundTime <= 8 && this.shouZhiCount && !GlobalCfg.ACT_SCENE_CTRL.isPickOneCard) {
                    this.shouZhiCount = false;
                    GlobalCfg.ACT_SCENE_CTRL.showLobbyUI("shouZhi", true)
                } 
            }
        }

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
                    this.time_green.fillRange  -= roundTimelememt
                } else {
                    this.time_yellow.fillRange  -= roundTimelememt
                }
            }
        }
        this.schedule(this.callbackCion, 0.2);
    },



    setUserInfo: function (userinfo, seat=0) {
        let relativeSeatId = 0;
        if(GlobalCfg.SMALL_GAME_DATAS.rummyData.enterPlayerNum == 6){
            relativeSeatId =  GlobalCfg.ACT_SCENE_CTRL.changeAbsoluteSeatIdToRelative(seat);
        }else{
            relativeSeatId = seat;
        }
        this.setPlayerState(userinfo.playerStatus);
        this.displayName = userinfo.displayName;
        this.sex = userinfo.sex;
        this.setCoin(userinfo.diamond);
        this.setPlayerId(userinfo.playerId);
        this.nickname = userinfo.nickname;
        if (relativeSeatId >= 0) {
            this.setSeatId(relativeSeatId);
        }
        if (GlobalCfg.USER_DATAS.userHeadimgurl !== null) {
            this.loadHeadSp(GlobalCfg.USER_DATAS.userHeadimgurl, 76, this.tx);
        } else {
            LoggerUtil.getInstance().log("收到的头像URL为空！")
            this.loadHeadSp(userinfo.imgUrl, 76, this.tx);
        }
        this.imgUrl = userinfo.imgUrl;
        this.setScore(0);

        if (userinfo.vipLevel >= 1 && userinfo.vipLevel <= 10 && CommonFun.getInstance().isOpenVipModule()) {
            this.sprite_vipLevelIcon.node.active = true;
            this.sprite_vipLevelIcon.spriteFrame = this.atlas_icon.getSpriteFrame(`${userinfo.vipLevel}`);
        }
        else {
            this.sprite_vipLevelIcon.node.active = false;
        };
    },

    getNickName() {
        LoggerUtil.getInstance().log("自己的NickName", this.nickname);
        let lab_string = CommonFun.getInstance().getStrByLength(this.nickname, 8)
        return lab_string;
    },

    //设置玩家的状态 0正常,1弃牌, 2胡,3炸胡,4观战
    setPlayerState(state){
        this.playerStatus = state;
        this.checkPlayerState(state);
    },

    getPlayerState(){
        return this.playerStatus
    },

    //根据不同的状态设置
    checkPlayerState(state){
        switch (state) {
            case 0:
                // this.state_mask.active = false;
                break;
            case 1:
                // this.state_mask.active = true;
                break;
            case 2:
        
                break;
            case 3:
            
                break;
            case 4:
            
                break;
            default:
                // this.state_mask.active = false;
                break;
        }
    },

    setPlayerId(playerid) {
        this.playerid = playerid;
    },

    getPlayerId() {
        if (!this.playerid) {
            return null;
        }
        return this.playerid;
    },

    setSeatId(data) {
        LoggerUtil.getInstance().log("设置自己座位号！", data);
        this.seatId = data;
    },

    getSeatId() {
        return this.seatId;
    },

    loadHeadSp: function (headUrl, realWidth, heaSprite) {
        if (headUrl && headUrl.length > 0) {
            cc.assetManager.loadRemote(headUrl, { ext: '.png' }, (err, texture) => {
                if (!err && cc.isValid(this) && cc.isValid(heaSprite)) {
                    heaSprite.spriteFrame = new cc.SpriteFrame(texture);
                    heaSprite.node.setScale(realWidth / heaSprite.node.width);
                }
            });
        }
    },

    getTxUrl() {
        return this.imgUrl;
    },

    setCoin: function (coin) {
        this.coin = coin / 100;
        if (this.lab_jb && coin != null) {
            this.lab_jb.string = CommonFun.getInstance().numberToShow(this.coin);
            // this.labGold.string = CommonFun.getInstance().numberToShow(this.coin);
            if(GlobalCfg.ACT_SCENE_CTRL.entrycondition != 0){
                GlobalCfg.USER_DATAS.userDiamond = coin;
            }
        }
    },

    setScore: function (score) {
        this.score = score;
        this.lab_score.string = score;
    },

    getScore: function () {
        return this.score;
    },

    start() {

    },

    // 处理弃牌或者摆牌的广播
    gameDropOrFinalcards:function(notify, isDrop){
        let curSeat = GlobalCfg.ACT_SCENE_CTRL.changeAbsoluteSeatIdToRelative(notify.seat);
        if(curSeat == this.seatId){
            if(isDrop){         //弃牌
                this.setPlayerState(1);
            }
            this.setCoin(notify.afterCalc);
            let coinMask = this.node.getChildByName("coinMask");
            coinMask.setPosition(0,0);
            let lab_coin = coinMask.getChildByName("lab_coin").getComponent(cc.Label);
            lab_coin.string = Math.abs(notify.calc) / 100;
            coinMask.opacity = 0;
            coinMask.active = true
            cc.tween(coinMask)
                .tag(10 + this.seatId)
                .to(0.3, { opacity:255 },{easing: 'fade'})
                .to(0.7, { position: cc.v2(0, 250)},{easing: 'cubicIn'})
                .start();
            this.countDown(false);
        }
        
    },

    gameover:function(notify,score){
        let winSeat = notify.singleEventSeat;
        let newScore =  Math.abs(score)
        let win_anim = this.node.getChildByName("win_anim");
        let img_winner = win_anim.getChildByName("img_winner");
        let star = win_anim.getChildByName("star");
        star.active = false
        img_winner.setPosition(0,-43)

        let coinMask = this.node.getChildByName("coinMask");
        // coinMask.setPosition(0,0)
        let lab_coin = coinMask.getChildByName("lab_coin").getComponent(cc.Label)
        lab_coin.string = newScore/100
        // 炸胡
        if(notify.reason == 1){
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
        }else{
            LoggerUtil.getInstance().log("执行UserCtrl的 GAMEOVER ！");
            if( winSeat == GlobalCfg.ACT_SCENE_CTRL.selfAbsoluteSeatId){
                this.lab_01.string = "";
                this.lab_02.string = "";
                GlobalCfg.ACT_SCENE_CTRL.rummyAudioCtrl.playGameSound("rummyWin");
                let spine =  GlobalCfg.ACT_SCENE_CTRL.skeleDataMap.get("winner_zj");
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
                })
            } else {
                coinMask.active = true;
                let pos = GlobalCfg.ACT_SCENE_CTRL.getOtherNodeCtrlBySeat(winSeat).getPosition();
                
                let posToWorld = GlobalCfg.ACT_SCENE_CTRL.node.convertToWorldSpaceAR(pos);
                LoggerUtil.getInstance().log("=======未转换前赢家的位置：",pos,`posToWorld:${posToWorld}`);
                let pos_end = this.node.convertToNodeSpaceAR(posToWorld);
                LoggerUtil.getInstance().log("UserInfo----赢家的位置：",pos_end);
                if(coinMask.x == 0 && coinMask.y == 0){
                    cc.Tween.stopAllByTag(10 + this.seatId);
                    cc.tween(coinMask)
                        .to(0.3, { opacity:255 },{easing: 'fade'})
                        .to(0.7, { position: cc.v2(0, 250)},{easing: 'cubicIn'})
                        .to(0.7, { position: pos_end},{easing: 'cubicIn'})
                        .to(0.5, { opacity:0 },{easing: 'fade'})
                        .start()
                }else{
                    coinMask.opacity = 255;
                    coinMask.setPosition(0, 250);
                    cc.tween(coinMask)
                        // .to(0.5, { opacity:255 },{easing: 'fade'})
                        // .to(0.7, { position: cc.v2(0, 130)},{easing: 'cubicIn'})
                        .delay(1)
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
            this.lab_my_qph.stopAllActions()
            this.sprite_my_qph.active = true;
            this.lab_my_qph.setPosition(156, 6)
            this.lab_my_qph.getComponent(cc.Label).string = msgid;

            cc.tween(this.lab_my_qph)
                .to(3, { position: cc.v2(-105, 6) })
                .call(() => {
                    this.sprite_my_qph.active = false;
                })
                .start()

        } else if (msgtype == 1) {
            this.sprite_myEmotion.stopAllActions()
            this.sprite_myEmotion.active = true
            this.sprite_myEmotion.getComponent(cc.Sprite).spriteFrame = this.bqAtlas.getSpriteFrame(msgid);
            cc.tween(this.sprite_myEmotion)
                .repeat(4, cc.tween().by(0.5, { position: cc.v2(0, -5) }).by(0.5, { position: cc.v2(0, 5) }))
                .call(() => {
                    this.sprite_myEmotion.getComponent(cc.Sprite).spriteFrame = null
                })
                .start()
        }
    },

    // update (dt) {},
});
