cc.Class({
    extends: cc.Component,

    properties: {
        bqAtlas : cc.SpriteAtlas,

        sprite_vipLevelIcon: cc.Sprite,
        atlas_icon: cc.SpriteAtlas,
    },

    ctor: function() {
        this.viewList = {};
        //玩家性别
        this.sex = 0;  
        this.coin = 0;
        this.seatid = 0;
        //玩家牌型列表
        this.skeleSkinCardSuitArr = [
            "default", "highcard", "pair", "color", "sequence", "pureseq", "set"
        ];

        
        //玩家状态的遮罩节点active列表
        this.statusNodeActiveArr = [
            false, true, true, true
        ];

        this.isHavePlayer = false;
    },

    onLoad: function() {
        this.viewList = CommonFun.getInstance().getAllChildrensNodeList(this.node, "");

        // 等待加入或已加入的显示节点
        this.node_wait = this.viewList["wait"];
        this.node_wanJia = this.viewList["wanJia"];
        this.node_wait.active = true;
        this.node_wanJia.active = false;
        
        // 玩家输赢分数结算
        this.node_winResult = this.viewList["wanJia/winResult"];
        this.lab_winAmount = this.viewList["wanJia/winResult/lab_winAmount"].getComponent(cc.Label);
        this.node_failResult = this.viewList["wanJia/failResult"];
        this.lab_failAmount = this.viewList["wanJia/failResult/lab_failAmount"].getComponent(cc.Label);
        this.node_winResult.active = false;
        this.node_failResult.active = false;

        // 玩家胜利，失败（爆炸）等动效节点
        this.node_shengLi = this.viewList["wanJia/winner_dj"];
        this.node_baoZha = this.viewList["wanJia/tx_baozha_shandian"];
        this.skeleton_shengLi = this.node_shengLi.getComponent(sp.Skeleton);
        this.skeleton_baoZha = this.node_baoZha.getComponent(sp.Skeleton);
        this.skeleton_shengLi.clearTracks();
        this.skeleton_baoZha.clearTracks();
        this.node_shengLi.active = false;
        this.node_baoZha.active = false;

        // 玩家名字，金币，头像，状态等节点
        this.lab_name = this.viewList["wanJia/lab_name"].getComponent(cc.Label);
        this.lab_coin = this.viewList["wanJia/lab_coin"].getComponent(cc.Label);
        this.sprite_tx = this.viewList["wanJia/wj_tx"].getComponent(cc.Sprite);
        this.lab_status = this.viewList["wanJia/lab_status"].getComponent(cc.Label);
        this.lab_status.node.active = false;

        // 玩家离线状态节点
        this.node_offlineMark = this.viewList["wanJia/img_dx"];
        this.node_offlineMark.active = false;

        // 玩家头像黑色遮罩
        this.node_zheZhao = this.viewList["wanJia/zheZhao"];
        this.node_zheZhao.active = false;

        // 玩家操作时间，呼吸灯等节点
        this.lab_actTime = this.viewList["wanJia/lab_actTime"].getComponent(cc.Label);
        this.lab_actTime.node.active = false;
        this.node_daojishilianyi = this.viewList["wanJia/daojishilianyi"];
        this.node_daojishilianyi.active = false;

        // 玩家手牌父节点
        this.node_cardsParent = this.viewList["wanJia/cardsParent"];

        // 玩家手牌遮罩
        this.node_card_mask = this.viewList["wanJia/cardMaskNode"];

        // 玩家下注类型动效节点
        this.node_catchChip_status = this.viewList["wanJia/pai_zi_s"];
        this.skeleton_catchChip_status = this.node_catchChip_status.getComponent(sp.Skeleton);
        this.skeleton_catchChip_status.clearTracks();
        this.node_catchChip_status.active = false;

        // 玩家牌型类型动效节点
        this.node_card_suit = this.viewList["wanJia/paiXingNode"];
        this.skele_card_suit = this.viewList["wanJia/paiXingNode/paixing_zi"].getComponent(sp.Skeleton);

        // 玩家已看牌的文字标识节点
        this.node_lab_seen = this.viewList["wanJia/lab_seen"];
        this.node_lab_seen.active = false;

        // 玩家投注总金额的显示节点
        this.node_chipAmount = this.viewList["wanJia/bg_tz"];
        this.node_jinbi = this.viewList["wanJia/bg_tz/jinbi"];
        this.node_chouma = this.viewList["wanJia/bg_tz/chouma"];
        this.lab_chipAmount = this.viewList["wanJia/bg_tz/lab_chipAmount"].getComponent(cc.Label);
        this.node_jinbi.active = false;
        this.node_chouma.active = false;
        this.node_chipAmount.active = false;

        // 玩家礼物按钮节点
        this.node_btn_gift = this.viewList["wanJia/btn_gift"];
        this.node_btn_gift.on('click', CommonFun.getInstance().debounce(this.btnClickCall, 1), this);

        // 玩家看牌按钮节点
        this.node_btn_seeCard = this.viewList["wanJia/btn_seeCard"];
        this.node_btn_seeCard.on('click', CommonFun.getInstance().debounce(this.btnClickCall, 0.5), this);
        this.node_btn_seeCard.active = false;

        // 玩家拒绝比牌节点
        this.node_agree = this.viewList["wanJia/bg_bp_agree"];
        this.node_refuse = this.viewList["wanJia/bg_bp_refuse"];
        this.node_agree.active = false;
        this.node_refuse.active = false;

        // 玩家购物zhong
        this.node_shoppingCart = this.viewList["wanJia/shoppingCart"];
        this.node_shoppingCart.active = false;

        this.colorTime = this.node.getChildByName('wanJia').getChildByName('colorTime');

        //点击玩家弹出图像
        let wanJia = this.node.getChildByName("wanJia");
        let wait = this.node.getChildByName("wanJia");
        if(wanJia && wait) {
            // wait.on(cc.Node.EventType.TOUCH_START,()=>{
            //     GlobalCfg.G_COMPONENTS.Audio.playButton();
            //     CommonFun.getInstance().showUserIU(this.playerImgUrl, this.playerNickName, 0, this.trial);
            // },this)
        }
    },

    onDestroy: function() {
        this.clearTeenPatiiPlayerActTimer();
    },

    btnClickCall: function(btn) {
        let btnName = btn.node.name;
        if (btnName == "btn_seeCard") {
            if (this.roomCtrl && this.roomCtrl.isCompleteFaPai == false) {
                return;
            };
            this.roomCtrl && this.roomCtrl.sendLookReq();
        }
        else if (btnName == "btn_gift") {
            GlobalCfg.G_COMPONENTS.Audio.playButton();
            if (this.roomCtrl.isCanSendGift() == false) {
                CommonFun.getInstance().showTips("Insufficient gold coins！");
                return; 
            };
            CommonFun.getInstance().showGameGifInteraction(this.seatid);
        };
    },

    // 发送表情  消息类型 0短语 1表情
    face:function(notify){
        let data = notify;
        let msgtype = notify.msgType;
        let msgid = data.name;
       
        if ( msgtype == 0){
            let bg_chat = this.node.getChildByName("wanJia").getChildByName("bg_chat"); 
            let lab_qph = bg_chat.getChildByName("mask").getChildByName("lab_qph"); 
            lab_qph.stopAllActions()
            bg_chat.active = true;
            lab_qph.setPosition(156,6)
            lab_qph.getComponent(cc.Label).string = msgid;

            cc.tween(lab_qph)
            .to(3, { position: cc.v2(-105, 6) })
            .call(() => {
                bg_chat.active = false;
            })
            .start()

        }else if( msgtype == 1 ) {
            this.emotion =  this.node.getChildByName("wanJia").getChildByName("bg_emotion");  
            this.emotion.stopAllActions()
            this.emotion.active = true
            this.emotion.getComponent(cc.Sprite).spriteFrame = this.bqAtlas.getSpriteFrame(msgid);
            cc.tween(this.emotion)
            .repeat(4,cc.tween().by(0.5, { position: cc.v2(0,-5) }).by(0.5, { position: cc.v2(0,5) }))
            .call(() => {
                this.emotion.getComponent(cc.Sprite).spriteFrame = null
            })
            .start()
        }
    },

    setTeenPattiPlayerSeat: function(seat,myPlayerSeat) {
        this.seatid = seat;
        this.curSeat = (this.seatid - myPlayerSeat + 5) % 5;
    },

    setTeenPattiPlayerRoomCtrl: function(roomCtrl) {
        this.roomCtrl = roomCtrl;
    },

    setTeenPattiPlayerResultScorePos: function(pos) {
        this.playerResultScorePos = pos;
    },

    setTeenPattiPlayerCardPosArr: function(cardPosArr) {
        this.playerCardPosArr = cardPosArr;
    },

    setTeenPattiPlayerCardScale: function(cardScale) {
        this.playerCardScale = cardScale;
    },

    setTeenPattiPlayerStatusDescArr: function(statusDescArr) { 
        this.playerStatusDescArr = teenPattiLanguage.palyerStatus[language];
    },

    setTeenPattiPlayerChipIsTrialType: function(isTrial) {
        this.trial = isTrial;
        this.node_jinbi.active = !isTrial;
        this.node_chouma.active = isTrial;
    },

    setTeenPattiPlayerJoinedStatus: function() {
        this.node.getChildByName("wait").active = false;
        this.node.getChildByName("wanJia").active = true;
        this.isHavePlayer = true;
    },

    setTeenPattiPlayerLeaveTable: function() {
        this.node.getChildByName("wait").active = true;
        this.node.getChildByName("wanJia").active = false;
        this.clearTeenPattiPlayerCardsGrayMask();
        this.clearTeenPattiPlayerCardSuitDisplay();
        this.clearTeenPattiPlayerWinSkeletonDisplay();
        this.clearTeenPattiPlayerBaoZhaSkeletonDisplay();
        this.clearTeenPattiPlayerCardsNode();
        this.setTeenPattiPlayerCatchChipDisplay(false);
        this.setTeenPattiPlayerCardsLookLabDisplay(false);
        this.setTeenPattiPlayerLookBtnActive(false);
        this.setTeenPattiPlayerAllChipNodeActive(false);
        this.clearTeenPatiiPlayerActTimer();
        this.clearTeenPattiPlayerStatusInfo();
        this.setTeenPattiPlayerIsOffLine(false);
        this.clearTeenPattiPlayerGameWinResultScore();
        this.clearTeenPattiPlayerGameFailResultScore();
        this.setTeenPattiPlayerLookValue(false);
        this.teenPattiPlayerShoppingCar(false);
        this.isHavePlayer = false;
    },

    setTeenPattiPlayerName: function(nickname) {
        this.playerNickName = nickname;
        this.lab_name.string = CommonFun.getInstance().getStrByLength(nickname, 8);
    },

    getTeenPattiPlayerName: function() {
        return this.playerNickName ? CommonFun.getInstance().getStrByLength(this.playerNickName, 10) : "";
    },

    setTeenPattiPlayerCoin: function(coinAmount, isDownPlayer) {
        this.coinAmount = coinAmount;
        let coin = FloatCalculation.accDiv(coinAmount, 100);
        if (isDownPlayer) {
            this.lab_coin.string = CommonFun.getInstance().numberToShow(coin);
            this.lab_coin.node.y = -55;
        }
        else {
            this.lab_coin.string = "";
            this.lab_coin.node.y = -55;
        };  
        this.coin = coinAmount;
    },

    getTeenPattiPlayerCoin: function() {
        return this.coin;
    },

    setTeenPattiPlayerAfter: function(after, isDownPlayer) {
        let coin = FloatCalculation.accDiv(after, 100);
        if (isDownPlayer) {
            this.lab_coin.string = CommonFun.getInstance().numberToShow(coin);
            this.lab_coin.node.y = -55;
        }
        else {
            this.lab_coin.string = "";
            this.lab_coin.node.y = -55;
        };  
        this.coin = after;
    },

    setTeenPattiPlayerSex: function(sex) {
        this.playerSex = sex;
    },

    setTeenPattiPlayerPid: function(pid) {
        this.playerPid = pid;
    },

    getTeenPattiPlayerPid: function(pid) {
        return this.playerPid;
    },

    setTeenPattiPlayerTX: function(imgUrl) {
        if (!imgUrl) {
            return;
        };
        this.playerImgUrl = imgUrl;
        let self = this;
        cc.assetManager.loadRemote(imgUrl, {ext: '.png'}, (err, texture) => {
            if (!err && cc.isValid(self) && cc.isValid(self.sprite_tx)) {  
                let spriteFrame = new cc.SpriteFrame(texture);
                self.sprite_tx.spriteFrame = spriteFrame;
                self.sprite_tx.node.setContentSize(96, 100);
            };
        });
    },

    getTeenPattiPlayerTX: function() {
        return this.playerImgUrl ? this.playerImgUrl : "";
    },

    setTeenPattiPlayerVipLevel: function(vipLevel) {
        if (vipLevel >= 1 && vipLevel <= 10 && CommonFun.getInstance().isOpenVipModule()) {
            this.sprite_vipLevelIcon.node.active = true;
            this.sprite_vipLevelIcon.spriteFrame = this.atlas_icon.getSpriteFrame(`${vipLevel}`);
        }
        else {
            this.sprite_vipLevelIcon.node.active = false;
        };

        let isCanShowVIPFont = CommonFun.getInstance().isCanShowVIPFontByLevel(vipLevel);
        if (isCanShowVIPFont) {
            this.lab_name.node.color = new cc.Color(250, 225, 76); 
        }
        else {
            this.lab_name.node.color = new cc.Color(255, 255, 255);
        };
    },

    getTeenPattiPlayerTXNode: function() {
        return this.sprite_tx.node;
    },

    ////////////////////////////////////////////////////////// 玩家的状态（0 正常, 1 弃牌, 2 比牌输了, 3 旁观）Start //////////////// 
    setTeenPattiPlayerStatusValue: function(status) {
        this.playerStatus = status;
    },

    getTeenPattiPlayerStatusValue: function() {
        return this.playerStatus ? this.playerStatus : 0;
    },

    setTeenPattiPlayerStatusDisplay: function() {
        if (this.playerStatus === null) {
            return;
        };
        let status = this.playerStatus;
        this.lab_status.string = this.playerStatusDescArr[status];
        this.lab_status.node.active = this.statusNodeActiveArr[status]; 
        this.node_zheZhao.active = status == 0 ? false : true;

    },

    // 手动切换语言动态改变
    setLabelStatus:function() {
        this.node_lab_seen.getComponent(cc.Label).string = xuanChangLanguage.lab_seen[language];
        this.playerStatusDescArr = teenPattiLanguage.palyerStatus[language];
        this.lab_status.string = this.playerStatusDescArr[this.playerStatus];
    },

    clearTeenPattiPlayerStatusInfo: function() {
        this.playerStatus = null;
        this.lab_status.string = "";
        this.lab_status.node.active = false;
        this.node_zheZhao.active = false;
    },
    ////////////////////////////////////////////////////////// 玩家的状态（0 正常, 1 弃牌, 2 比牌输了, 3 旁观）End //////////////// 

    
    setTeenPattiPlayerIsOffLine: function(isOffline) {
        this.node_offlineMark.active = isOffline
    },


    ////////////////////////////////////////////////////////// 玩家的手牌(发牌，牌展示，重连时牌的生成) Start /////////////////////////////////////////////
    setTeenPattiPlayerCardsValueArr: function(cardsValue) {
        this.playerCardsValueArr = this.teenPattiPlayerCardsValueSort(cardsValue);
    },
    
    clearTeenPattiPlayerCardsNode: function() {
        this.playerCardsValueArr = [];
        let cardNodeArr = this.node_cardsParent.children; 
        for (let i = 0, len = cardNodeArr.length; i < len; i++) {
            let cardNode = cardNodeArr[i];
            cardNode.destroy();
        };
    },

    playTeenPattiPlayerCardsRollingOverAnima: function() {
        let cardNodeArr = this.node_cardsParent.children;  
        for (let i = 0, len = cardNodeArr.length; i < len; i++) {
            this.scheduleOnce(() => {
                let cardNode = cardNodeArr[i];
                if (cardNode) {
                    let cardValue = this.playerCardsValueArr[i];
                    let cardNodeCtrl = cardNode.getComponent('teenPattiCardCtrl');
                    if (cardNodeCtrl) {
                        cardNodeCtrl.playTeenPattiCardRollingOverAnima(cardValue);
                    }; 
                };
            }, 0.03 * i);
        }; 
    },

    playTeenPattiPlayerFaCardAnim: function(cardNode, cardIndex) {
        if (!cardNode) {
            return;
        };
        let scale = this.playerCardScale;
        let girlNode = this.roomCtrl.node_faPaiRole;
        let pos = CommonFun.getInstance().convertOtherNodeSpaceAR(girlNode, this.node_cardsParent);
        let cardNodeCtrl = cardNode.getComponent('teenPattiCardCtrl');
        cardNodeCtrl.setTeenPattiCardRoomCtrl(this.roomCtrl);
        cardNodeCtrl.setTeenPattiCardScale(scale);
        cardNode.scale = 0;
        cardNode.setPosition(pos);
        this.node_cardsParent.addChild(cardNode);

        let targetPos = this.playerCardPosArr[cardIndex];
        let targetScale = this.playerCardScale;

        cc.tween(cardNode)
        .to(0.2, {scale: targetScale , position: targetPos}, {easing: "quadOut"})
        .start();
    },

    createTeenPattiPlayerCardsNode: function() {
        this.clearTeenPattiPlayerCardsNode();
        let scale = this.playerCardScale;
        for (let i = 0; i < 3; i++) {
            let cardNode = this.roomCtrl.getCardNodeFromCardsPool();
            let pos = this.playerCardPosArr[i];
            let cardNodeCtrl = cardNode.getComponent('teenPattiCardCtrl');
            cardNodeCtrl.setTeenPattiCardRoomCtrl(this.roomCtrl);
            cardNodeCtrl.setTeenPattiCardPosition(pos);
            cardNodeCtrl.setTeenPattiCardScale(scale);
            cardNodeCtrl.setTeenPattiCardSprite(52);
            this.node_cardsParent.addChild(cardNode);
        };
    },

    setTeenPattiPlayerCardsLookCardDisplay: function(isLook, cardsVauleArr) {
        if (isLook) {
            this.playerCardsValueArr = cardsVauleArr;
            if (!cardsVauleArr || cardsVauleArr.length != 3) {
                return;
            };

            cardsVauleArr = this.teenPattiPlayerCardsValueSort(cardsVauleArr);

            let cardNodeArr = this.node_cardsParent.children; 
            for (let i = 0, len = cardsVauleArr.length; i < len; i++) {
                let cardValue = cardsVauleArr[i];
                let cardNode = cardNodeArr[i];
                let CardNodeCtrl = cardNode.getComponent('teenPattiCardCtrl');
                CardNodeCtrl.setTeenPattiCardSprite(cardValue);
            };
        };
    },
    ////////////////////////////////////////////////////////// 玩家的手牌(发牌，牌展示，重连时牌的生成) End /////////////////////////////////////////////



    ////////////////////////////////////////////////////////// 玩家的手牌变灰 Start ///////////////////////////////////
    setTeenPattiPlayerCardsGrayEffect: function() {
        let cardNodeArr = this.node_cardsParent.children;  
        for (let i = 0, len = cardNodeArr.length; i < len; i++) {
            let cardNode = cardNodeArr[i];
            let cardNodeCtrl = cardNode.getComponent('teenPattiCardCtrl');
            if (cardNodeCtrl) {
                cardNodeCtrl.setTeenPattiCardGrayEffect();
            };
        }; 
    },

    clearTeenPattiPlayerCardsGrayEffect: function() {
        let cardNodeArr = this.node_cardsParent.children;  
        for (let i = 0, len = cardNodeArr.length; i < len; i++) {
            let cardNode = cardNodeArr[i];
            let cardNodeCtrl = cardNode.getComponent('teenPattiCardCtrl');
            if (cardNodeCtrl) {
                cardNodeCtrl.clearTeenPattiCardGrayEffect();
            };
        }; 
    },

    /**
     * 显示玩家手牌灰色遮罩
     */
    setTeenPattiPlayerCardsGrayMask: function() {
        this.node_card_mask.active = true;
    },

    clearTeenPattiPlayerCardsGrayMask: function() {
        this.node_card_mask.active = false;
    },
    ////////////////////////////////////////////////////////// 玩家的手牌变灰 End ///////////////////////////////////


    ////////////////////////////////////////////////////////// 玩家的已看牌标识 Start ///////////////////////////////////
    setTeenPattiPlayerCardsLookLabDisplay: function(isLook) {
        this.node_lab_seen.active = isLook;
        this.node_lab_seen.getComponent(cc.Label).string = xuanChangLanguage.lab_seen[language];

    },
    ////////////////////////////////////////////////////////// 玩家的已看牌标识 End ///////////////////////////////////


    ////////////////////////////////////////////////////////// 玩家的手牌类型 Start /////////////////////////////////// 
    setTeenPattiPlayerCardSuitDisplay: function(cardSuitValue) {
        this.node_card_suit.active = true;
        let skinName = this.skeleSkinCardSuitArr[cardSuitValue];
        this.skele_card_suit.setSkin(skinName);
        this.skele_card_suit.setAnimation(1, "chuxian", false);
    },

    clearTeenPattiPlayerCardSuitDisplay: function() {
        this.skele_card_suit.clearTracks();
        this.node_card_suit.active = false;
    },
    ////////////////////////////////////////////////////////// 玩家的手牌类型 End /////////////////////////////////////////////



    ///////////////////////////////////////////////////////// 玩家的下注  Start /////////////////////////////////////////////
    setTeenPattiPlayerAllChipNodeActive: function(active) {
        this.node_chipAmount.active = active;
    },

    setTeenPattiPlayerAllChip: function(allChip) {
        this.node_chipAmount.active = true;
        let chip = FloatCalculation.accDiv(allChip, 100);
        this.lab_chipAmount.string = chip;
    },
    ///////////////////////////////////////////////////////// 玩家的下注  End /////////////////////////////////////////////



    ///////////////////////////////////////////////////////// 玩家的动作信息 Start /////////////////////////////////////////////
    //////////////////////////////////////////（0空，1看牌，2跟注，4加注，8比牌，16弃牌，32同意比牌）
    setTeenPattiPlayerActionMaskValue: function(actionValue) {
        this.playerActionMaskValue = actionValue;
    },

    getTeenPattiPlayerActionMaskValue: function() {
        return this.playerActionMaskValue;
    },

    getTeenPattiPlayerActTime: function() {
        return this.lab_actTime.string.length == 0 ? 0 : parseInt(this.lab_actTime.string);
    },

    setTeenPattiPlayerActTime: function(actTime, isPrePayment = false) {
        if (actTime > 0) {  
            if (this.actTimer) {
                clearInterval(this.actTimer);
                this.actTimer = null;
            };
            this.clearTeenPatiiPlayerActTimer(); 
            ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, {msgCode: "teenPattiPlayerActTime", msgData: {actTime: actTime, seatid: this.seatid}}); 
            if(isPrePayment == true){
                this.lab_actTime.string = actTime;
            }else{
                // 正常下注倒计时
                this.lab_actTime.string = actTime - 5;
            }
            this.lab_actTime.node.active = true;
            this.colorTime.active = false;
            this.node_daojishilianyi.active = true;
            actTime--;
            let self = this;
            let actTimerCall = function() {
                if (self && self.lab_actTime) {
                    if (actTime < 0 && self) {
                        ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, {msgCode: "teenPattiPlayerActTime", msgData: {actTime: -1, seatid: self.seatid}}); 
                        self.clearTeenPatiiPlayerActTimer();
                        return;
                    };
                    ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, {msgCode: "teenPattiPlayerActTime", msgData: {actTime: actTime, seatid: self.seatid}}); 
                    if(isPrePayment == true){
                        self.lab_actTime.string = actTime;
                    }else{
                        let showtime = actTime - 5;
                        if(showtime > 0){
                            self.lab_actTime.string = showtime;
                        } else {
                            self.lab_actTime.node.active = false;
                            self.node_daojishilianyi.active = false;
                            self.colorTime.active = true;
                            let ratio = actTime / 5;
                            self.colorTime.getComponent(cc.Sprite).fillRange = ratio;
                        }
                    }
                    actTime--;
                };
            };
            this.actTimer = setInterval(actTimerCall, 1000);
        };
    },

    //清除玩家操作的倒计时显示
    clearTeenPatiiPlayerActTimer: function() {
        let self = this
        if (self.actTimer) {
            clearInterval(self.actTimer);
            self.actTimer = null;
        };
        if (self.lab_actTime && self.lab_actTime.node) {
            self.lab_actTime.node.active = false;
        };
        if (self.node_daojishilianyi) {
            self.node_daojishilianyi.active = false;
        };
        if(self.colorTime){
            self.colorTime.active = false;
        }
    },
    ///////////////////////////////////////////////////////// 玩家的动作信息 End /////////////////////////////////////////////


    setTeenPattiPlayerLookBtnActive: function(active) {
        this.node_btn_seeCard.active = active;
    },

    setTeenPattiPlayerLookValue: function(isLook) {
        this.isLookedCard = isLook;
    },

    getTeenPattiPlayerLookValue: function() {
        return this.isLookedCard ? true : false;
    },

        
    //设置玩家跟注的金额大小
    playTeenPattiPlayerCatchChipAnim: function(chip) {
        let chipsParentNode = this.roomCtrl.node_chips;
        let pos = CommonFun.getInstance().convertOtherNodeSpaceAR(this.node, chipsParentNode);
        let chipNode = this.roomCtrl.getChipNodeFromChipsPool();
        let chipCtrl = chipNode.getComponent("teenPattiChipCtrl");
        chipCtrl.setTeenPattiChipAmount(chip);
        chipNode.scale = 0.5;
        chipNode.setPosition(pos);
        chipsParentNode.addChild(chipNode);
        let verDistance = 30;
        let HorDistance = 120;
        let randomPos = cc.v2(Math.random() * HorDistance * (Math.random() > 0.5 ? 1 : -1), Math.random() * verDistance * (Math.random() > 0.5 ? 1 : -1));
        cc.tween(chipNode)
        .to(0.25, {position: randomPos, scale: 1}, {easing: "quadOut"}) 
        .start();
    },

    setTeenPattiPlayerCatchChipDisplay: function(active, opt) {
        this.node_catchChip_status.active = active;
        if (active) {
            let name = ["blind", "blindx2", "chaal", "chaalx2"][opt];
            this.skeleton_catchChip_status.setSkin(name);
            this.skeleton_catchChip_status.setAnimation(0, "chuxian", false);
        }
        else {
            this.skeleton_catchChip_status.clearTracks();
        };
    },

    setTeenPattiPlayerWinSkeletonDisplay: function() {
        this.skeleton_shengLi.setAnimation(0, "star", false);
        this.node_shengLi.active = true;
    },

    clearTeenPattiPlayerWinSkeletonDisplay: function() {
        this.skeleton_shengLi.clearTracks();
        this.node_shengLi.active = false;
    },

    setTeenPattiPlayerBaoZhaSkeletonDisplay: function() {
        this.skeleton_baoZha.setAnimation(0, "animation", false);
        this.node_baoZha.active = true;
    },

    clearTeenPattiPlayerBaoZhaSkeletonDisplay: function() {
        this.skeleton_baoZha.clearTracks();
        this.node_baoZha.active = false;
    },

    setTeenPattiPlayerGameWinResultScore: function(score) {
        this.lab_winAmount.string = "j" + score;
        this.node_winResult.active = true;
        cc.tween(this.node_winResult)
        .to(0.5, {position: this.playerResultScorePos})
        .delay(1)
        .call(() => {
            this.clearTeenPattiPlayerGameWinResultScore();
        })
        .start()
    }, 

    clearTeenPattiPlayerGameWinResultScore: function() {
        this.lab_winAmount.string = "";
        this.node_winResult.active = false;
        this.node_winResult.y = 0;
    }, 

    setTeenPattiPlayerGameFailResultScore: function(score) {
        this.lab_failAmount.string = score;
        this.node_failResult.active = true;
        cc.tween(this.node_failResult)
        .to(0.2, {position: this.playerResultScorePos}, {easing: "quadOut"}) 
        .delay(1)
        .call(() => {
            this.clearTeenPattiPlayerGameFailResultScore();
        })
        .start();
    }, 

    clearTeenPattiPlayerGameFailResultScore: function() {
        this.lab_failAmount.string = "";
        this.node_failResult.active = false;
        this.node_failResult.y = 0;
    }, 

    setTeenPattiPlayerGameOver: function() {
        this.clearTeenPattiPlayerCardsGrayMask();
        this.clearTeenPattiPlayerCardSuitDisplay();
        this.clearTeenPattiPlayerWinSkeletonDisplay();
        this.clearTeenPattiPlayerBaoZhaSkeletonDisplay();
        this.clearTeenPattiPlayerCardsNode();
        this.setTeenPattiPlayerCatchChipDisplay(false);
        this.setTeenPattiPlayerCardsLookLabDisplay(false);
        this.setTeenPattiPlayerLookBtnActive(false);
        this.setTeenPattiPlayerAllChipNodeActive(false);
        this.clearTeenPatiiPlayerActTimer();
        this.clearTeenPattiPlayerStatusInfo();
        this.setTeenPattiPlayerIsOffLine(false);
        this.clearTeenPattiPlayerGameWinResultScore();
        this.clearTeenPattiPlayerGameFailResultScore();
        this.setTeenPattiPlayerLookValue(false);
        this.teenPattiPlayerShoppingCar(false);
    },


    setTeenPattiPlayerAgreeActive: function(active) {
        this.node_agree.active = active;
        let lab =  this.node_agree.getChildByName('lab').getComponent(cc.Label);
        lab.string = playerCenterLanguage.lab_ok[language]
        if (active) {
            this.scheduleOnce(() => {
                this.node_agree.active = false;
            }, 3);
        };
    },

    setTeenPattiPlayerRefuseActive: function(active) {
        this.node_refuse.active = active;
        if (active) {
            this.scheduleOnce(() => {
                this.node_refuse.active = false;
            }, 3);
        };
    },

    teenPattiPlayerCardsValueSort: function(cardsVauleArr) {
        /**
         * 如果第一个参数应该位于第二个之前则返回一个负数;
         * 如果两个参数相等则返回0;
         * 如果第一个参数应该位于第二个参数之后则返回一个正数。
         **/ 
        cardsVauleArr = cardsVauleArr.sort((a, b) => {
            if (a%13 == 0 && b%13 == 0) {
                return a - b;
            }
            else if (a%13 == 0 && b%13 > 0) {
                return 1;
            }
            else if (a%13 > 0 && b%13 == 0) {
                return -1;
            }
            else {
                return a%13 - b%13;
            };
        });
        
        if (cardsVauleArr[0]%13 == 1 && cardsVauleArr[1]%13 == 2 && cardsVauleArr[2]%13 == 0) {
            let temp0 = cardsVauleArr[0];
            let temp1 = cardsVauleArr[1];
            let temp2 = cardsVauleArr[2];
            cardsVauleArr[0] = temp2;
            cardsVauleArr[1] = temp0;
            cardsVauleArr[2] = temp1;
        };

        return cardsVauleArr;
    },

    teenPattiPlayerShoppingCar: function(active) {
        if (this && this.node_shoppingCart) {
            this.node_shoppingCart.active = active;
        };
    },
});
