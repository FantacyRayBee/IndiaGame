cc.Class({
    extends: cc.Component,

    properties: {
        pab_user: cc.Prefab,
        pab_chat: cc.Prefab,
        pab_wanFa: cc.Prefab,
        btns: [cc.Button],
        btn_aBet: cc.Button,
        btn_bBet: cc.Button,
        btn_skip: cc.Button,
        lab_GameNotify : cc.Label,
        lab_A: cc.Label,
        lab_B: cc.Label,
        node_users: cc.Node,
        sk_shanPai: cc.Node,
        sk_crad: cc.Node,
        btn_openMenu: cc.Button,
        btn_tableInfo: cc.Button,
        selectLight: cc.Node,
        btnBets: [cc.Button]
    },

    ctor: function() {
        this.posOutOrINLogArr = [];         // 玩家进出房间的记录
        this.playerNodeArr = [] ;           // 存放玩家节点
        this.paymentSwitch = false;
        this.tuiChuLabel = [
            "Your game is not finished yet . If you wish to exit the table , you will lose your money . Do you want to leave table?", // 退出游戏
            "Are you sure you want to discard",  // 弃牌
            "Your cash is insufficient, Please recharge in time!" , //金币不足请充值
            "In the game, unable to exit",                              // 游戏中无法退出
            "Sorry, your gold coin can't be played in this game",     // 对不起，您的金币无法在本场内游戏）
            "You are not longer sitting on the table because you missed your turn"
        ];

        this.isCCGameEventHideStutas = false;

        this.isCanClickToAct = false;

        this.betDurationMs = 7;
        this.skeleDataMap = new Map();
        this.rateBetsArray = [1,2,4,8,16,32,64];     
        this.showBetSpineTimeInterval = 15;      // 显示下注动画的时间间隔
        this.showBetSpineTime = 0; 
        this.mySeatId = null;
    },

    onLoad: function() {
        CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.SHOW_ANDAR_GAME);

        GlobalCfg.ACT_SCENE_CTRL = this;

        GlobalCfg.G_COMPONENTS.Audio && GlobalCfg.G_COMPONENTS.Audio.pauseMusic();
        this.loadSkeleData();
        
        this.skeNode = new cc.Node();
        this.skeNode.setPosition(0,60);
        this.node.addChild(this.skeNode);
        
        this.node_btnAck = this.node.getChildByName("node_btnAck")
        this.Skeletonspine = this.skeNode.addComponent(sp.Skeleton);            // 开始倒计时骨骼动画
        this.andeerActionCtrl = this.node.getChildByName("andeerAction").getComponent('andeerActionCtrl'); 
        this.AndererAudioCtrl = this.node.getChildByName("AndererAudioCtrl").getComponent('AndererAudioCtrl');

        this.roomInfoData = JSON.parse(cc.sys.localStorage.getItem('AndeerData'));
        this.iEntryCondition = this.roomInfoData.cellscore/100;                              // 底注
        this.iEntryConditionMax = this.roomInfoData.entryconditionmax/100;                   // 单轮最大投注额
        this.iCellScore = this.roomInfoData.cellscore/100;                                   // 最大支出额
        this.isTrialRoom = this.roomInfoData.trial;                                          // 是否是体验场

        LoggerUtil.getInstance().log(`底注: ${this.iEntryCondition}, 单轮最大投注额: ${this.iEntryConditionMax}, 最大支出额: ${this.iCellScore}`);

   
        this.msgHandle = ClientNotify.register(GlobalCfg.MSG_TYPE.serverMsg,this.onEventMsg,this);   
        this.customMsgHandle = ClientNotify.register(GlobalCfg.MSG_TYPE.clientMsg, this.onEventMsg, this); 

        for (let i = 0; i < this.btns.length; i++) {
            this.btns[i].node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this)    
        };
        this.btn_openMenu.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
        this.btn_tableInfo.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);

        this.btn_aBet.node.on('click', CommonFun.getInstance().debounce(this.btnAckClick, 1), this);
        this.btn_bBet.node.on('click', CommonFun.getInstance().debounce(this.btnAckClick, 1), this);
        this.btn_skip.node.on('click', CommonFun.getInstance().debounce(this.btnAckClick, 1), this);
 
        this.sk_zhuang = this.sk_shanPai.getComponent(sp.Skeleton);
        this.sk_leftOrRight = this.sk_crad.getComponent(sp.Skeleton);

        this.node.getChildByName("btn_shop").active = GlobalCfg.USER_DATAS.openModules.includes(4);
        this.paymentSwitch = GlobalCfg.USER_DATAS.openModules.includes(4);
        if (this.isTrialRoom) {
            this.node.getChildByName("btn_shop").active = true;
        }; 

        //监听后台切换事件
        cc.game.on(cc.game.EVENT_HIDE, () => {
            LoggerUtil.getInstance().log("退入游戏后台！！！！！");
            GameServerManager.hideFilterMag(1);
            this.isCCGameEventHideStutas = true;
        }, this);

        cc.game.on(cc.game.EVENT_SHOW, () => {
            LoggerUtil.getInstance().log("切回游戏前台！！！！！");
            let self = this;
            if (!self.isCCGameEventHideStutas) {
                return;
            };
            self.isCCGameEventHideStutas = false;
            
            GameServerManager.hideFilterMag(2, () => {
                GameServerManager.send("gameservice.gamescene", "GameSceneReq", {});
            });
        }, this);
    },

    initBtnBetsLabel:function(){
        for (let i = 0; i < this.btnBets.length; i++) {
            let btn = this.btnBets[i];
            btn.node.on('click', this.btnBetsClick, this);
            let label = btn.node.getChildByName("label").getComponent(cc.Label);
            label.string = this.rateBetsArray[i] * this.iEntryCondition;
            if(this.isTrialRoom == false){
                this.btnBetGreyByCoin(label.string, btn, GlobalCfg.USER_DATAS.userDiamond);
            }
        }
        this.lab_A.string = this.btnBets[0].node.getChildByName("label").getComponent(cc.Label).string;
        this.lab_B.string = this.btnBets[0].node.getChildByName("label").getComponent(cc.Label).string;
        this.selectLight.setPosition(this.btnBets[0].node.getPosition());
    },

    updateBetBtnGreyState:function(diamond){
        for (let i = 0; i < this.btnBets.length; i++) {
            let btn = this.btnBets[i];
            let label = btn.node.getChildByName("label").getComponent(cc.Label);
            if(this.isTrialRoom == false){
                this.btnBetGreyByCoin(label.string, btn, diamond);
            }
        }
    },

    btnBetGreyByCoin(buttonLabelStr, button, currentDiamond){
        let num = Number(buttonLabelStr);
        if(currentDiamond < num * 100){
            button.interactable = false;
        }else{
            button.interactable = true;
        }
    },

    start: function() {
        GameServerManager.send("gameservice.login", "LoginReq", {
            userid: GlobalCfg.USER_DATAS.userId,
            token: GlobalCfg.USER_DATAS.token,
            fromid: GlobalCfg.PRODUCT_ID
        });
    },

    onDestroy: function() {
        GlobalCfg.ACT_SCENE_CTRL = null;
        ClientNotify.removeByHandle(GlobalCfg.MSG_TYPE.serverMsg, this.msgHandle);
        ClientNotify.removeByHandle(GlobalCfg.MSG_TYPE.clientMsg, this.customMsgHandle);
        CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.EXIT_ANDAR_GAME);
    },

    //  下载骨骼动画
    loadSkeleData: function () {
        let assetBundle = cc.assetManager.getBundle('andaerGame');
        if (assetBundle) {
            let self = this;
            var skeleArr = ['andeerSke/winner_dj']
            for (let index = 0; index < skeleArr.length; index++) {
                var url = skeleArr[index];
                assetBundle.load(url, sp.SkeletonData, function (err, asset) {
                    if (!err) {
                        if (asset._name && self.skeleDataMap) {
                            self.skeleDataMap.set(asset._name, asset);
                        }
                    }
                });
            }
        }
    },

    btnBetsClick:function(button){
        let btnName = button.node.name;
        GlobalCfg.G_COMPONENTS.Audio.playButton();
        this.selectLight.setPosition(button.node.getPosition());
        let curBetNum = button.node.getChildByName("label").getComponent(cc.Label).string;
        this.lab_A.string = curBetNum;
        this.lab_B.string = curBetNum;
    },

    btnAckClick: function(button) {
        let btnName = button.node.name;
        if (this.isCanClickToAct == false) {
            return;
        };
        if (btnName == "btn_aBet") {
            GlobalCfg.ACT_SCENE_CTRL.AndererAudioCtrl.playGameSound("bet");
            let num = Number(this.lab_A.string);
            this.UserSelectionActionReq(0, num);
        } 
        else if (btnName == "btn_bBet") {
            GlobalCfg.ACT_SCENE_CTRL.AndererAudioCtrl.playGameSound("bet");
            let num = Number(this.lab_B.string);
            this.UserSelectionActionReq(1, num);
        } 
        else if (btnName == "btn_skip") {
            GlobalCfg.G_COMPONENTS.Audio.playButton();
            this.UserSelectionActionReq(0, 0)
        }
    },

    btnClick: function(button) {
        let btnName = button.node.name;
        GlobalCfg.G_COMPONENTS.Audio.playButton();
        if (btnName == "btn_shop") {
            if (this.isTrialRoom) {
                CommonFun.getInstance().showSmallAddExperience();
            } 
            else {
                CommonFun.getInstance().showSmallAddCash();
            }
        } 
        else if (btnName == "btn_liaoTian") {
            CommonFun.getInstance().showGameWordInteraction(this.getMyPlayerSeatID());
        }
        else if (btnName == "btn_openMenu") {
            GlobalCfg.G_COMPONENTS.Audio.playButton();
            CommonFun.getInstance().showGameMenu();
        }
        else if (btnName == "btn_tableInfo") {
            GlobalCfg.G_COMPONENTS.Audio.playButton();
            let pab_wanFa = cc.instantiate(this.pab_wanFa);
            let wanFaCtrl = pab_wanFa.getComponent("AandeerWaFaCtrl");
            wanFaCtrl.setLabel(this.roomInfoData);
            this.node.addChild(pab_wanFa);
        }
    },

    onEventMsg: function(webData, target) { 
        let self = target;
        let msgId = webData.msgCode;
        let notify = webData.msgData;
        if (msgId == "gameservice.login") {
            self.dealLoginEvent(notify);
        }
        else if (msgId == "gameservice.enterroom") {
            self.setSceneInfo(notify.scene);
            self.betDurationMs = Math.floor(notify.betDurationMs/1000);
        }
        else if (msgId == "gameservice.exitroom") {
            self.dealExitRoomEvent();
        }
        else if (msgId == "gameservice.changeroom") {
            CommonFun.getInstance().showGameStartMask();
            self.setSceneInfo(notify.scene);
        }
        else if (msgId == "gameservice.playerenternotify") {
            self.dealPlayerEnterNotifyEvent(notify);
        }
        else if (msgId == "gameservice.playerexitnotify") {
            self.dealPlayerExitNotifyEvent(notify);
        }
        else if (msgId == "gameservice.gamescene") {
            self.setSceneInfo(notify.scene);
        }
        else if (msgId == "gameservice.firstbetstatusstartnotify") {
            self.roundBet = 0;
            self.dealFirstBetStatusStartNotifyEvent(notify);
        }
        else if (msgId == "gameservice.abdealnotify") {
            self.dealAbDealNotify(notify);
        }
        else if (msgId == "gameservice.secondbetstatusstartnotify") {
            self.dealSecondBetStatusStartNotifyEvent(notify);
        }
        else if (msgId == "gameservice.call") {
            self.dealCallEvent(notify);
        }
        else if (msgId == "gameservice.callnotify") {
            self.dealCallNotifyEvent(notify);
        }
        else if (msgId == "gameservice.gamesettlenotify") {
            self.dealGameSettleNotifyEvent(notify);
        }
        else if (msgId == "gameservice.shortmessage") {
            self.dealShortMessageEvent(notify);
        }
        else if (msgId == "gameservice.shortmessagenotify") {
            self.dealShortMessageNotifyEvent(notify);
        }
        else if (msgId == "gameservice.updatecoinnotify") {
            self.dealUpdateCoinNotifyEvent(notify);
        }
        else if (msgId == "gameservice.asktrial") {
            self.dealAskTrialEvent(notify);
        }
        else if(msgId == GlobalCfg.CLIENT_MSG_ID.FIRST_RECHARGE_TIPS){
            SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.ANDAER, SceneManager.getInstance().sceneType.LOBBY);
        }  
        else if(msgId == GlobalCfg.CLIENT_MSG_ID.GAME_MENU_CLICK_OUT_TO_LOBBY) {
            GameServerManager.send("gameservice.exitroom", "ExitRoomReq", {});
        }
        else if(msgId == GlobalCfg.CLIENT_MSG_ID.GAME_MENU_CLICK_SWITCH_TABLE) {
            GameServerManager.send("gameservice.changeroom", "ChangeRoomReq", {});
        }
        else if (msgId == GlobalCfg.CLIENT_MSG_ID.GAME_MENU_CLICK_HOW_TO_PLAY) {
            CommonFun.getInstance().showRule("Andeer");
        }
        else if (msgId == "lobbyservice.kicktolobby") {
            SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.ANDAER, SceneManager.getInstance().sceneType.LOBBY);
        }
        else if (msgId == "AndarDealingCardsEnd") {
            self.showWinAreaSkeleton(notify.winType);
        }
        else if (msgId == GlobalCfg.CLIENT_MSG_ID.CURRENCY_CHANGED_USER_INFO) {
            let myCtrl = self.getSelfPlayerCtrl();
            if (myCtrl) {
                myCtrl.setPlayerDiamond(GlobalCfg.USER_DATAS.userDiamond);
            }
        }
        else if(msgId == "Andar_SelfDiamond_Change"){
            let diamond = notify.diamond;
            self.updateBetBtnGreyState(diamond);
        }
    },

    // 监听错误消息
    checkWebMsgError: function(webData, target) {
        let self = target;
        let msgId = webData.msgCode;
        let notify = webData.msgData; 
        if (!notify) {
            let info = {
                errorMessage: `安达尔游戏中, 服务器下发的非正确消息中结构体异常, 内容为===>${JSON.stringify(webData)}`
            };
            CommonFun.getInstance().reportToTelegram(info);
            return;
        };
        let result = notify.result;
        if (notify.Result) {
            result = notify.Result;
        };
        if (msgId === "gameservice.login" || msgId == "gameservice.enterroom") {
            CommonFun.getInstance().showMsgBox(result.message, 'YES', () => {
                window.isNeedShowRoomList = "andar";
                SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.ANDAER, SceneManager.getInstance().sceneType.LOBBY);
            });
        }
        else if (msgId === "gameservice.changeroom") {
            CommonFun.getInstance().showMsgBox(result.message, 'YES', () => {
                window.isNeedShowRoomList = "andar";
                SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.ANDAER, SceneManager.getInstance().sceneType.LOBBY);
            });
        } 
        else if (msgId === "gameservice.call") {
            if (CommonFun.getInstance().isFreePlayerDirectedToFreeTP()) {
                if (result.result == 57) {
                    CommonFun.getInstance().showDiversionFreeTP(() => {
                        GameServerManager.send("gameservice.exitroom", "ExitRoomReq", {});
                        // SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.ANDAER, SceneManager.getInstance().sceneType.LOBBY);
                    });
                }
                else {
                    if (result.result == 19) {
                        if (this.isTrialRoom) {
                            CommonFun.getInstance().showMsgBox( "Your chip is insufficient！Please get the chip", "SHOP", () => {
                                CommonFun.getInstance().showSmallAddExperience();
                            }, false);
                        } 
                        else {
                            if (GlobalCfg.IS_CLUB_MODE == 1){  //代理模式不跳转商城
                                CommonFun.getInstance().showMsgBox('Insufficient cash', "YES", () => {}, false);}
                            else {
                                CommonFun.getInstance().showMsgBox( "Your cash is insufficient, Please recharge in time！", "SHOP", () => {
                                    CommonFun.getInstance().showSmallAddCash()
                                }, false);
                            }
                        };
                    }
                    else {
                        CommonFun.getInstance().showTips(result.message);
                    };        
                };
            }
            else {
                if (result.result == 19) {
                    if (this.isTrialRoom) {
                        CommonFun.getInstance().showMsgBox( "Your chip is insufficient！Please get the chip", "SHOP", () => {
                            CommonFun.getInstance().showSmallAddExperience();
                        }, false);
                    } 
                    else {
                        if (GlobalCfg.IS_CLUB_MODE == 1){  //代理模式不跳转商城
                            CommonFun.getInstance().showMsgBox('Insufficient cash', "YES", () => {}, false);}
                        else {
                            CommonFun.getInstance().showMsgBox( "Your cash is insufficient, Please recharge in time！", "SHOP", () => {
                                CommonFun.getInstance().showSmallAddCash()
                            }, false);
                        }
                    };
                }
                else {
                    CommonFun.getInstance().showTips(result.message);
                };    
            };
        }
    },

    dealLoginEvent: function(notify) {
        if (!notify) {
            LoggerUtil.getInstance().error("发送安达尔登录的消息时, 服务器返回的消息为空!");
            return;
        };


        this.myPlayerid = notify.pid;
      
        let cacheRoomId = notify.cacheRoomId;
        let iID = GlobalCfg.SMALL_GAME_DATAS.andeerData.roomID;
        let multiple = notify.multiple;
        if(multiple.length >= this.rateBetsArray.length){
            this.rateBetsArray = multiple.slice(0, this.rateBetsArray.length);
        }
        // console.warn(this.rateBetsArray);
        this.initBtnBetsLabel();
        GameServerManager.send("gameservice.enterroom", "EnterRoomReq", {id: Number(iID)});
    },

    setSceneInfo: function(sceneInfo) {
        if (!sceneInfo) {
            LoggerUtil.getInstance().error(`服务器下发的场景信息为空!`);
            return;
        };

        let status = sceneInfo.status;                                      // 当前状态 0: 第一次下注. 1: 第二次下注. 2: 发牌中. 3: 结算. 
        let currentStatusLeftMs = sceneInfo.currentStatusLeftMs;            // 当前状态剩余时间.毫秒
        let totalBet = sceneInfo.totalBet;                                  // 总下注信息
        let players = sceneInfo.players;                                    // vip玩家信息
        let midCard = sceneInfo.midCard;                                    // 中间牌
        let abCards = sceneInfo.abCards;                                    // 两边的牌,a,b,a,b,a,b......循环
        let aWin = sceneInfo.aWin;                                          // A赢
        let bWin = sceneInfo.bWin;                                          // B赢
        let winType = null;
        if(aWin == true || bWin == true){
            winType = aWin ? "A" : "B";
        }

        // 重置场景中的所有表现
        this.sk_zhuang.clearTracks(); 
        this.sk_leftOrRight.clearTracks(); 
        this.sk_zhuang.node.active = false;
        this.sk_leftOrRight.node.active = false;
        this.andeerActionCtrl.deleteAllCard();

        let userNodeArr = this.node_users.children;
        for (let i = 0, len = userNodeArr.length; i < len; ++i) {
            let userNode = userNodeArr[i];
            if (userNode) {
                userNode.destroy();
            };
        };

        this.posOutOrINLogArr = [];
        this.playerNodeArr = [];

        this.setRoomStatus(status);
        this.setMyPlayerSeatID(players);
        this.setAllPlayersBaseInfo(players);
        this.showMyBetBtns(false);
        
        // 设置庄家牌
        if (midCard != -1) {
            this.andeerActionCtrl.faMidPosCard(midCard, false);
        }
        else {
            LoggerUtil.getInstance().error('服务器下发的场景信息中, 庄家的牌值为-1, 不符合0 ~ 53的规定!');
        };

        let myPlayerSeatID = this.getMyPlayerSeatID();

        LoggerUtil.getInstance().log(`自己玩家的SeatID为: ${myPlayerSeatID}, 当前的游戏状态为: ${status}, 牌的值为: ${JSON.stringify([].concat(abCards))}`);

        if (status == 0) {
            this.lab_GameNotify.string = CommonFun.getInstance().showLabelLanguage("The first round starts to bet!");
            for (let i = 0, len = this.playerNodeArr.length; i < len; i++) {
                let playerNode = this.playerNodeArr[i];
                let andeerPalyerCtrl = playerNode.getComponent('andeerPalyerCtrl');
                andeerPalyerCtrl.countDownTime(Math.floor(currentStatusLeftMs/1000), true);
                andeerPalyerCtrl.setPlayerSkippedStatusActive(false);
                let seatID = andeerPalyerCtrl.getPlayerSeatID();
                if (myPlayerSeatID === seatID) {
                    this.showMyBetBtns(true);
                };
            };
        }
        else if (status == 1) {
            this.lab_GameNotify.string = CommonFun.getInstance().showLabelLanguage("The second round starts to bet!");
            for (let i = 0, len = this.playerNodeArr.length; i < len; i++) {
                let playerNode = this.playerNodeArr[i];
                let andeerPalyerCtrl = playerNode.getComponent('andeerPalyerCtrl');
                let aScore = andeerPalyerCtrl.getPlayerFirstBetScore();
                if (aScore == 0) {
                    andeerPalyerCtrl.setPlayerSkippedStatusActive(true);
                }
                else {
                    andeerPalyerCtrl.setPlayerSkippedStatusActive(false);
                    andeerPalyerCtrl.countDownTime(Math.floor(currentStatusLeftMs/1000), true);
                    let seatID = andeerPalyerCtrl.getPlayerSeatID();
                    if (myPlayerSeatID === seatID) {
                        this.showMyBetBtns(true);
                    };
                };
            };
        }
        else if (status == 2) {
            for (let i = 0, len = this.playerNodeArr.length; i < len; i++) {
                let playerNode = this.playerNodeArr[i];
                let andeerPalyerCtrl = playerNode.getComponent('andeerPalyerCtrl');
                let aScore = andeerPalyerCtrl.getPlayerFirstBetScore();
                if (aScore == 0) {
                    andeerPalyerCtrl.setPlayerSkippedStatusActive(true);
                }
                else {
                    andeerPalyerCtrl.setPlayerSkippedStatusActive(false);
                };
            };

            let duration = Math.floor(currentStatusLeftMs/1000);
            let abCardsLen = abCards.length;
            if (duration <= 2) {
                abCards = abCards.slice(abCardsLen - 2);
                this.andeerActionCtrl.faLeftRightPosCard(abCards, false);
            }
            else {
                if (duration >= abCardsLen) {
                    this.andeerActionCtrl.faLeftRightPosCard(abCards, true, winType);
                }
                else {
                    let deleteLen = (abCardsLen - duration)%2 == 0 ? (abCardsLen - duration) : (abCardsLen - duration - 1);
                    abCards.splice(0, deleteLen);
                    this.andeerActionCtrl.faLeftRightPosCard(abCards, true, winType);
                };
            };
        }
        else if (status == 3) {
            let tipsStr = "";
            if (aWin && bWin) {
                tipsStr = CommonFun.getInstance().showLabelLanguage("Andar Win And Barar Win!");
            }
            else if (aWin) {
                tipsStr = CommonFun.getInstance().showLabelLanguage("Andar Win!");
            }
            else if (bWin) {
                tipsStr = CommonFun.getInstance().showLabelLanguage("Barar Win!");
            }
            this.lab_GameNotify.string = tipsStr;

            let abCardsLen = abCards.length;
            abCards = abCards.slice(abCardsLen - 2);
            LoggerUtil.getInstance().log("dddddddddddddddddddddddddd", abCards);
            this.andeerActionCtrl.faLeftRightPosCard(abCards, false);
    
            this.sk_zhuang.node.active = true;
            this.sk_leftOrRight.node.active = true;
            this.sk_zhuang.setAnimation(0, "animation", true); 
            this.sk_leftOrRight.setAnimation(0, "animation", true); 
            if (bWin) {
                this.sk_shanPai.setPosition(192, 63);
            } 
            else {
                this.sk_shanPai.setPosition(-192, 63);
            };

            for (let i = 0, len = this.playerNodeArr.length; i < len; i++) {
                let playerNode = this.playerNodeArr[i];
                let andeerPalyerCtrl = playerNode.getComponent('andeerPalyerCtrl');
                let aScore = andeerPalyerCtrl.getPlayerFirstBetScore();
                if (aScore == 0) {
                    andeerPalyerCtrl.setPlayerSkippedStatusActive(true);
                }
                else {
                    andeerPalyerCtrl.setPlayerSkippedStatusActive(false);

                    let betAScore = andeerPalyerCtrl.getPlayerBetAScore();
                    let betBScore = andeerPalyerCtrl.getPlayerBetBScore();
                    if (aWin && betAScore > 0) {
                        andeerPalyerCtrl.setPlayerGameSettleEffect(betAScore);
                    }
                    else if (bWin && betBScore > 0) {
                        andeerPalyerCtrl.setPlayerGameSettleEffect(betBScore);
                    };
                };
            };
        };
    },

    showMyBetBtns: function(bool) {
        let posX = 0 ;
        let posY = bool ? -325 : -512;
        let time =  bool ? 0.3 : 0.15;
        let easName = bool ? 'backOut' : 'backIn';
        let btnAck = this.node.getChildByName("node_btnAck");
        this.isCanClickToAct = bool;
        cc.tween(btnAck)
        .to(time, {position: cc.v2(posX, posY)}, {easing: easName})
        .start()
    },

    setMyPlayerSeatID: function(players) {
        if (!Array.isArray(players)) {
            LoggerUtil.getInstance().error("服务器发送的玩家信息列表错误!");
            return;
        };

        for (let i = 0, len = players.length; i < len; i++) {
            let player = players[i];
            let pos = player.pos;                                   // 位置
            let userInfo = player.userInfo;                         // 用户信息
            let playerId = userInfo.playerId;                       // 玩家Id
            if (playerId === this.myPlayerid) {
                this.mySeatId = pos;
                return;
            };
        };
    },

    getMyPlayerSeatID: function() {
        return this.mySeatId;
    },

    getSelfPlayerCtrl: function() {
        let ctrl = null;
        let myPlayerSeatID = this.getMyPlayerSeatID();
        for (let i = 0, len = this.playerNodeArr.length; i < len; i++) {
            let playerNode = this.playerNodeArr[i];
            let andeerPalyerCtrl = playerNode.getComponent('andeerPalyerCtrl');
            let seatID = andeerPalyerCtrl.getPlayerSeatID();
            if (seatID === myPlayerSeatID) {
                ctrl = andeerPalyerCtrl;
                return ctrl;
            };
        };
        
    },

    setAllPlayersBaseInfo: function(players) {
        if (!Array.isArray(players)) {
            LoggerUtil.getInstance().error("服务器发送的玩家信息列表错误!");
            return;
        };

        for (let i = 0, len = players.length; i < len; i++) {
            let player = players[i];
            let pos = player.pos;                                   // 位置
            let betInfo = player.betInfo;                           // 下注信息 0: a, 1: b
            let userInfo = player.userInfo;                         // 用户信息
            let playerId = userInfo.playerId;                       // 玩家Id
            let imgUrl = userInfo.imgUrl;                           // 头像
            let nickname = userInfo.nickname;                       // 昵称
            let diamond = userInfo.diamond;                         // 金币
            let vipLevel = userInfo.vipLevel;

            let pab_user = cc.instantiate(this.pab_user);
            this.node_users.addChild(pab_user);  
            this.playerNodeArr.push(pab_user);
            let andeerPalyerCtrl = pab_user.getComponent('andeerPalyerCtrl');
            andeerPalyerCtrl.getUserLab();
            andeerPalyerCtrl.setLobbyThisToPlayer(this);
            andeerPalyerCtrl.setPlayerImgUrl(imgUrl);
            andeerPalyerCtrl.setPlayerNickName(nickname);
            andeerPalyerCtrl.setPlayerDiamond(diamond);
            andeerPalyerCtrl.setPlayerBetInfo(betInfo);
            andeerPalyerCtrl.setPlayerSeatID(pos); 
            andeerPalyerCtrl.setPlayerPlayerId(playerId);
            andeerPalyerCtrl.setPlayerVipLevel(vipLevel);
            
            let obj = {};
            obj.seatID = pos;
            obj.playerId = playerId;
            obj.act = 'enter';
            this.posOutOrINLogArr.push(obj);
        };
    },

    setRoomStatus: function(roomStatus) {
        this.roomStatus = roomStatus;
    },

    getRoomStatus: function() {
        return this.roomStatus ? this.roomStatus : 3;
    },

    dealExitRoomEvent: function() {
        window.isNeedShowRoomList = "andar";
        SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.ANDAER, SceneManager.getInstance().sceneType.LOBBY);
    },

    dealPlayerEnterNotifyEvent: function(notify) {
        if (!notify) {
            LoggerUtil.getInstance().error("服务器下发的玩家加入房间的消息为空!");
            return;
        };

        let player = notify.player;
        let pos = player.pos;                                   // 位置
        let betInfo = player.betInfo;                           // 下注信息 0: a, 1: b
        let userInfo = player.userInfo;                         // 用户信息
        let playerId = userInfo.playerId;                       // 玩家Id
        let displayName = userInfo.displayName;                 // 用于显示的数字ID
        let imgUrl = userInfo.imgUrl;                           // 头像
        let nickname = userInfo.nickname;                       // 昵称
        let diamond = userInfo.diamond;                         // 金币
        let vipLevel = userInfo.vipLevel;

        let isExist = false;
        for (let i = 0, len = this.playerNodeArr.length; i < len; i++) {
            let playerNode = this.playerNodeArr[i];
            let andeerPalyerCtrl = playerNode.getComponent('andeerPalyerCtrl');
            let seatID = andeerPalyerCtrl.getPlayerSeatID();
            if (seatID === pos) {
                isExist = true;
                break;
            };  
        };

        if (isExist) {
            LoggerUtil.getInstance().error(`此座位${pos}已存在玩家, 请查看进出消息排查! ${JSON.stringify(this.posOutOrINLogArr)}`);
            return;
        }

        let pab_user = cc.instantiate(this.pab_user);
        this.node_users.addChild(pab_user);  
        this.playerNodeArr.push(pab_user);
        let andeerPalyerCtrl = pab_user.getComponent('andeerPalyerCtrl');
        andeerPalyerCtrl.getUserLab();
        andeerPalyerCtrl.setLobbyThisToPlayer(this);
        andeerPalyerCtrl.setPlayerImgUrl(imgUrl);
        andeerPalyerCtrl.setPlayerNickName(nickname);
        andeerPalyerCtrl.setPlayerDiamond(diamond);
        andeerPalyerCtrl.setPlayerBetInfo(betInfo);
        andeerPalyerCtrl.setPlayerSeatID(pos); 
        andeerPalyerCtrl.setPlayerPlayerId(playerId); 
        andeerPalyerCtrl.setPlayerVipLevel(vipLevel);
        
        let roomStatus = this.getRoomStatus();
        if (roomStatus >= 1) {
            andeerPalyerCtrl.setPlayerSkippedStatusActive(true);
        }
        else {
            andeerPalyerCtrl.setPlayerSkippedStatusActive(false);
        };
        
        let obj = {};
        obj.seatID = pos;
        obj.playerId = playerId;
        obj.act = 'enter';
        this.posOutOrINLogArr.push(obj);
    },

    dealPlayerExitNotifyEvent: function(notify) {
        if (!notify) {
            LoggerUtil.getInstance().error("服务器下发的其他玩家退出房间的消息为空!");
            return;
        };

        let pos = notify.pos;

        let isExist = false;
        for (let i = 0, len = this.playerNodeArr.length; i < len; i++) {
            let playerNode = this.playerNodeArr[i];
            let andeerPalyerCtrl = playerNode.getComponent('andeerPalyerCtrl');
            let seatID = andeerPalyerCtrl.getPlayerSeatID();
            let playerId = andeerPalyerCtrl.getPlayerPlayerId();
            if (seatID === pos) {
                isExist = true;
                playerNode.destroy();
                this.playerNodeArr.splice(i, 1);

                let obj = {};
                obj.seatID = pos;
                obj.playerId = playerId;
                obj.act = 'out';
                this.posOutOrINLogArr.push(obj);
                break;
            };
        };

        if (isExist == false) {
            LoggerUtil.getInstance().error(`此座位${pos}并不存在玩家, 请查看进出消息排查! ${JSON.stringify(this.posOutOrINLogArr)}`);
            return;
        };
    },

    dealFirstBetStatusStartNotifyEvent: function(notify) {
        if (!notify) {
            LoggerUtil.getInstance().error("服务器下发的第一次下注通知消息为空!");
            return;
        };

        let midCard = notify.midCard;                   // 中间牌
        let duration = notify.duration;                 // 持续时间

        // 重置上一局信息
        this.sk_zhuang.clearTracks(); 
        this.sk_leftOrRight.clearTracks(); 
        this.sk_zhuang.node.active = false;
        this.sk_leftOrRight.node.active = false;
        this.andeerActionCtrl.deleteAllCard();

        for (let i = 0, len = this.playerNodeArr.length; i < len; i++) {
            let playerNode = this.playerNodeArr[i];
            let andeerPalyerCtrl = playerNode.getComponent('andeerPalyerCtrl');
            andeerPalyerCtrl.setPlayerSkippedStatusActive(false);
            andeerPalyerCtrl.setPlayerBetInfo([0, 0]);
        };

        this.lab_GameNotify.string = CommonFun.getInstance().showLabelLanguage("The first round starts to bet!");
        this.andeerActionCtrl.faMidPosCard(midCard);

        this.scheduleOnce(() => {
            this.showMyBetBtns(true);
            for (let i = 0, len = this.playerNodeArr.length; i < len; i++) {
                let playerNode = this.playerNodeArr[i];
                let andeerPalyerCtrl = playerNode.getComponent('andeerPalyerCtrl');
                andeerPalyerCtrl.countDownTime(Math.floor((duration - 500)/1000), true);
            };
        }, 0.5);
    },

    dealAbDealNotify: function(notify) {
        if (!notify) {
            LoggerUtil.getInstance().error("服务器下发的发牌通知消息为空!");
            return;
        };

        let abCards = notify.abCards;                        // 两边的牌, a,b,a,b,a,b......循环

        this.lab_GameNotify.string = CommonFun.getInstance().showLabelLanguage("Dealing Cards...");

        for (let i = 0, len = this.playerNodeArr.length; i < len; i++) {
            let playerNode = this.playerNodeArr[i];
            let andeerPalyerCtrl = playerNode.getComponent('andeerPalyerCtrl');
            andeerPalyerCtrl.countDownTime(0, false);
        };

        this.showMyBetBtns(false);

        let aWin = notify.aWin;
        let bWin = notify.bWin;
        let winType = null;
        if(aWin == true || bWin == true){
            winType = aWin ? "A" : "B";
        }

        this.andeerActionCtrl.faLeftRightPosCard(abCards, true, winType);
    },

    dealSecondBetStatusStartNotifyEvent: function(notify) {
        if (!notify) {
            LoggerUtil.getInstance().error("服务器下发的第二次下注通知消息为空!");
            return;
        };

        let duration = notify.duration;                     // 持续时间

        this.lab_GameNotify.string = CommonFun.getInstance().showLabelLanguage("The second round starts to bet!");

        let myPlayerSeatID = this.getMyPlayerSeatID();
        for (let i = 0, len = this.playerNodeArr.length; i < len; i++) {
            let playerNode = this.playerNodeArr[i];
            let andeerPalyerCtrl = playerNode.getComponent('andeerPalyerCtrl');
            let seatID = andeerPalyerCtrl.getPlayerSeatID();
            let aScore = andeerPalyerCtrl.getPlayerFirstBetScore();
            if (aScore == 0) {
                andeerPalyerCtrl.setPlayerSkippedStatusActive(true);
                if (seatID === myPlayerSeatID) {
                    this.showMyBetBtns(false);
                };
            }
            else {
                andeerPalyerCtrl.countDownTime(Math.floor(duration/1000), true);
                if (seatID === myPlayerSeatID) {
                    this.showMyBetBtns(true);
                };
            };
        };
    },

    dealCallEvent: function(notify) {

    },

    dealCallNotifyEvent: function(notify) {
        if (!notify) {
            LoggerUtil.getInstance().error("服务器下发的下注通知消息为空!");
            return;
        };

        let pos = notify.pos;                                   // 下注玩家seat
        let side = notify.side;                                 // 下注位置 A/B
        let amount = notify.amount;                             // 下注金额
        let after = notify.after;                               // 下注后剩余
        let playerBet = notify.playerBet;                       // 玩家总下注 0A,1B
        let poolBet = notify.poolBet;                           // 系统总下注 0A,1B

        let myPlayerSeatID = this.getMyPlayerSeatID();
        for (let i = 0, len = this.playerNodeArr.length; i < len; i++) {
            let playerNode = this.playerNodeArr[i];
            let andeerPalyerCtrl = playerNode.getComponent('andeerPalyerCtrl');
            let seatID = andeerPalyerCtrl.getPlayerSeatID();
            if (seatID === pos) {
                andeerPalyerCtrl.setPlayerDiamond(after);
                andeerPalyerCtrl.setPlayerBetInfo(playerBet);
                andeerPalyerCtrl.countDownTime(0, false);
                let aScore = andeerPalyerCtrl.getPlayerFirstBetScore();
                if (aScore == 0) {
                    andeerPalyerCtrl.setPlayerSkippedStatusActive(true);
                }
                else {
                    andeerPalyerCtrl.setPlayerSkippedStatusActive(false);
                }
                if (myPlayerSeatID === pos) {
                    this.showMyBetBtns(false);
                };
                return;
            };
        };
    },

    dealGameSettleNotifyEvent: function(notify) {
        if (!notify) {
            LoggerUtil.getInstance().error("服务器下发的游戏结束通知消息为空!");
            return;
        };

        let aWin = notify.aWin;      
        let bWin = notify.bWin;                
        let players = notify.players;
        
        let myPlayerSeatID = this.getMyPlayerSeatID();
        for (let i = 0, len = this.playerNodeArr.length; i < len; i++) {
            let playerNode = this.playerNodeArr[i];
            let andeerPalyerCtrl = playerNode.getComponent('andeerPalyerCtrl');
            let seatID = andeerPalyerCtrl.getPlayerSeatID();
            for (let k = 0, len1 = players.length; k < len1; k++) {
                let playerResult = players[k];
                let pos = playerResult.pos;                     // 座位号
                let win = playerResult.win;                     // 赢分
                let after = playerResult.after;                 // 结算后
                if (seatID === pos && win > 0) {
                    andeerPalyerCtrl.setPlayerDiamond(after);
                    andeerPalyerCtrl.setPlayerGameSettleEffect(win);
                };
                if(myPlayerSeatID == pos){
                    GlobalCfg.USER_DATAS.userDiamond = after;
                }
            };
        };
        this.curRoundAddCoinFinish();
    },

    showWinAreaSkeleton:function(winArea){
        let tipsStr = "";
        switch (winArea) {
            case "A":
                this.sk_shanPai.setPosition(-192, 63);
                tipsStr = CommonFun.getInstance().showLabelLanguage("Andar Win!");
                break;
            case "B":
                this.sk_shanPai.setPosition(192, 63);
                tipsStr = CommonFun.getInstance().showLabelLanguage("Bahar Win!");
                break;
        
            default:
                break;
        }
        this.lab_GameNotify.string = tipsStr;
        this.sk_zhuang.node.active = true;
        this.sk_leftOrRight.node.active = true;
        this.sk_zhuang.setAnimation(0, "animation", true); 
        this.sk_leftOrRight.setAnimation(0, "animation", true); 
    },

    curRoundAddCoinFinish(){
        if(cc.isValid(this)){
            let minLimit = this.roomInfoData.entrycondition || 0;
            CommonFun.getInstance().gameShowSecondRecharge(minLimit, this.roundBet);
            CommonFun.getInstance().showWithdrawToastInGame();
        }
    },

    dealShortMessageEvent: function(notify) {

    },

    dealShortMessageNotifyEvent: function(notify) {
        if (!notify) {
            LoggerUtil.getInstance().error("服务器下发的发送表情通知消息为空!");
            return;
        };

        let msgType = notify.msgType;               // 消息类型 0短语 1表情 2礼物
        let target = notify.target;                 // 接收者seat (-1表示群发)
        let sender = notify.sender;                 // 发送者seat
        let price = notify.price;                   // 消息价格
        let senderAfter = notify.senderAfter;       // 发送者扣价后货币
        let name = notify.name;                     // 表情名/短语内容
    
        if (msgType == 0 || msgType == 1) {
            for (let i = 0, len = this.playerNodeArr.length; i < len; i++) {
                let playerNode = this.playerNodeArr[i];
                let andeerPalyerCtrl = playerNode.getComponent('andeerPalyerCtrl');
                let seatID = andeerPalyerCtrl.getPlayerSeatID();
                if (seatID == target) {
                    andeerPalyerCtrl.face(notify);
                    break;
                }
            }
        }
        else if (msgType == 2) {
            let targetNodeArr = [];
            let senderCtrl = null;
            for (let i = 0, len = this.playerNodeArr.length; i < len; i++) {
                let playerNode = this.playerNodeArr[i];
                let andeerPalyerCtrl = playerNode.getComponent('andeerPalyerCtrl');
                let seatID = andeerPalyerCtrl.getPlayerSeatID();
                if (seatID == sender) {
                    senderCtrl = andeerPalyerCtrl;
                    break;
                };
            };

            if (!senderCtrl || !senderCtrl.node) {
                return;
            } else {
                senderCtrl.setPlayerDiamond(senderAfter);
            }
            
            if (target == -1) {
                for (let i = 0, len = this.playerNodeArr.length; i < len; i++) {
                    let playerNode = this.playerNodeArr[i];
                    let andeerPalyerCtrl = playerNode.getComponent('andeerPalyerCtrl');
                    if (andeerPalyerCtrl !== senderCtrl) {
                        targetNodeArr.push(andeerPalyerCtrl.node);
                    };
                };
            }
            else {
                for (let i = 0, len = this.playerNodeArr.length; i < len; i++) {
                    let playerNode = this.playerNodeArr[i];
                    let andeerPalyerCtrl = playerNode.getComponent('andeerPalyerCtrl');
                    let seatID = andeerPalyerCtrl.getPlayerSeatID();
                    if (seatID == target) {
                        targetNodeArr.push(andeerPalyerCtrl.node);
                        break;
                    };
                };
            };
            CommonFun.getInstance().playGameGifInteraction(name, senderCtrl.node, targetNodeArr);
        };
    },

    dealUpdateCoinNotifyEvent: function(notify) {
        if (!notify) {
            LoggerUtil.getInstance().error("服务器下发的游戏结束通知消息为空!");
            return;
        };

        let playerId = notify.playerId;     // 玩家Id
        let balance = notify.balance;       // 剩余数量
        let reason = notify.reason;         // 原因 1:支付; 其他：未知

        let myPlayerSeatID = this.getMyPlayerSeatID();
        for (let i = 0, len = this.playerNodeArr.length; i < len; i++) {
            let playerNode = this.playerNodeArr[i];
            let andeerPalyerCtrl = playerNode.getComponent('andeerPalyerCtrl');
            let andeerPlayerId = andeerPalyerCtrl.getPlayerPlayerId();
            if (andeerPlayerId == playerId) {
                andeerPalyerCtrl.setPlayerDiamond(balance);
                let playerSeatID = andeerPalyerCtrl.getPlayerSeatID();
                if (myPlayerSeatID == playerSeatID) {
                    if (this.isTrialRoom == false) {
                        GlobalCfg.USER_DATAS.userDiamond = balance;
                    };
                };
            };
        };
    },

    dealAskTrialEvent: function(notify) {
        
    },

    // 玩家下注请求
    UserSelectionActionReq: function(side, Score){
        if(Score > 0) {
            this.roundBet = this.roundBet + Score * 100;
        }
        GameServerManager.send("gameservice.call", "CallReq", {
            side: side,
            amount: Score*100,
        });
    },

    getPlayerInfoByUserId: function(seatid) {
        for (let i = 0, len = this.playerNodeArr.length; i < len; i++) {
            let playerNode = this.playerNodeArr[i];
            let andeerPalyerCtrl = playerNode.getComponent('andeerPalyerCtrl');
            let playerSeatID = andeerPalyerCtrl.getPlayerSeatID();
            if (seatid == playerSeatID) {
                return andeerPalyerCtrl;
            };
        };
    },

    update: function (dt) {
        this.showBetSpineTime += dt;
        if (this.showBetSpineTime > this.showBetSpineTimeInterval) {
            this.showBetSpineTime = 0;
            this.showBtnBetSpine();
        }
    },

    showBtnBetSpine: function () {
        let animationName = 'animation';
        let len = this.btnBets.length, i = 0;
        this.scheduleBetSpineTimeCallback = ()=>{
            let spine = this.btnBets[i].node.getChildByName('spine').getComponent(sp.Skeleton);
            spine.setAnimation(0, animationName, false);
            i++;
        };
        this.schedule(this.scheduleBetSpineTimeCallback, 0.8, len-1);
    },
});
