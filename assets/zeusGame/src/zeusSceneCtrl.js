cc.Class({
    extends: cc.Component,

    properties: {
        btn_back: cc.Button,
        btn_getCoin: cc.Button,
        node_myCoin: cc.Node,
        node_topArea: cc.Node,
        node_centreArea: cc.Node,
        node_bottomArea: cc.Node,
        node_leftArea: cc.Node,
        node_rightArea: cc.Node,
        node_fireArea: cc.Node,
        node_lightNingBg: cc.Node,
        skeleton_lightNing: sp.Skeleton,
    },


    ctor: function() {
        this.isCCGameEventHideStutas = false;

        this.isAuto = false;

        this.bet = 0;

        this.isLoginFinished = false;

        this.curPlayerId = null;
        this.curGameState = "";
    },


    onLoad: function() {
        CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.SHOW_ZEUS_GAME);

        GlobalCfg.ACT_SCENE_CTRL = this;

        this.node_lightNingBg.active = false;
        this.skeleton_lightNing.node.active = false;
        this.skeleton_lightNing.setCompleteListener((trackEntry, loopCount) => {
            let name = trackEntry.animation.name;
            this.node_lightNingBg.active = false;
            this.skeleton_lightNing.node.active = false;
            if (this.curGameState == "freeState") {
                this.leftAreaCtrl.setMutil(0);
                this.leftAreaCtrl.setFreeStatus(true);
                this.zeusAudiosCtrl.playFreeStateBg();
                this.firesAreaCtrl.setFireSpinFreeType();
            }
            else if (this.curGameState == "normalState") {
                this.leftAreaCtrl.setMutil(0);
                this.leftAreaCtrl.setFreeStatus(false);
                this.zeusAudiosCtrl.playNormalStateBg();
                this.firesAreaCtrl.setFireSpinNormalType();
                
                if (this.isAuto) {
                    this.dealSendSpinReqEvent(this.bet, this.isDoubleMulti);
                }
                else {
                    this.bottomAreaCtrl.setBtnSpinInteractableStatus(true);    
                    this.leftAreaCtrl.setBtnBuyFreeInteractableStatus(true); 
                    this.leftAreaCtrl.setTogDoubleMultiInteractableStatus(true);   
                    let curBetIndex = this.bottomAreaCtrl.getCurBetIndex();
                    this.bottomAreaCtrl.setBetBtnsAndLabByIndex(curBetIndex);
                    this.curRoundAddCoinFinish();
                };
            };
        });
        this.zeusAudiosCtrl = this.node.getComponent("zeusAudiosCtrl");
        this.myCoinCtrl = this.node_myCoin.getComponent("zeusMyCoinCtrl");
        this.headAreaCtrl = this.node_topArea.getComponent("zeusHeadAreaCtrl");
        this.centreAreaCtrl = this.node_centreArea.getComponent("zeusCentreAreaCtrl");
        this.bottomAreaCtrl = this.node_bottomArea.getComponent("zeusBottomAreaCtrl");
        this.leftAreaCtrl = this.node_leftArea.getComponent("zeusLeftAreaCtrl");
        this.rightAreaCtrl = this.node_rightArea.getComponent("zeusRightAreaCtrl");
        this.firesAreaCtrl = this.node_fireArea.getComponent("zeusFiresAreaCtrl");


        // this.zeusAudiosCtrl.setMusicVolume(0.6);
        this.zeusAudiosCtrl.setSoundVolume(1);
        this.zeusAudiosCtrl.playNormalStateBg();
        /**
         * 注册按钮点击事件
         */
        this.btn_back.node.on("click", CommonFun.getInstance().debounce(this.btnClick, 1), this);
        this.btn_getCoin.node.on("click", CommonFun.getInstance().debounce(this.btnClick, 1), this);

        this.msgHandle = ClientNotify.register(GlobalCfg.MSG_TYPE.serverMsg, this.onEventMsg, this);
        this.customMsgHandle = ClientNotify.register(GlobalCfg.MSG_TYPE.clientMsg, this.onEventMsg, this);

        this.btn_getCoin.node.active = GlobalCfg.USER_DATAS.openModules.includes(4);

        /**
         * 监听后台切换事件
         */
        cc.game.on(cc.game.EVENT_HIDE, () => {
            GameServerManager.hideFilterMag(1);
            this.isCCGameEventHideStutas = true;
        }, this);

        cc.game.on(cc.game.EVENT_SHOW, () => {
            if (this.isCCGameEventHideStutas == false) {
                return;
            };
            GameServerManager.hideFilterMag(2, () => {
                this.isCCGameEventHideStutas = false;
            });
        }, this);
    },

    curRoundAddCoinFinish(){
        if(cc.isValid(this)){
            let minLimit = this.bottomAreaCtrl.getBetArr()[0] || 0;
            CommonFun.getInstance().gameShowSecondRecharge(minLimit, Number.MAX_SAFE_INTEGER);
            CommonFun.getInstance().showWithdrawToastInGame();
        }
    },

    start: function() {
        let  scroll = [
            {cell: [{elf: 11}, {elf: 3}, {elf: 3}, {elf: 4}, {elf: 4}]},
            {cell: [{elf: 4}, {elf: 10}, {elf: 10}, {elf: 10}, {elf: 9}]},
            {cell: [{elf: 7}, {elf: 7}, {elf: 6}, {elf: 6}, {elf: 11}]},
            {cell: [{elf: 11}, {elf: 11}, {elf: 7}, {elf: 7}, {elf: 7}]},
            {cell: [{elf: 9}, {elf: 9}, {elf: 7}, {elf: 7}, {elf: 11}]},
            {cell: [{elf: 9}, {elf: 9}, {elf: 9}, {elf: 11}, {elf: 11}]},
        ];
        this.centreAreaCtrl.initShowCellNodes(scroll);

        this.leftAreaCtrl.setTogDoubleMultiCheckedStatus(false);

        this.isAuto = this.bottomAreaCtrl.getTogAutoCheckedStatus();

        let proroID = "gameservice.login";
        let message = "LoginReq";
        GameServerManager.send(proroID, message, {
            userid: GlobalCfg.USER_DATAS.userId,
            token: GlobalCfg.USER_DATAS.token,
            fromid: GlobalCfg.PRODUCT_ID
        });
    },

    onDestroy: function() {
        this.zeusAudiosCtrl.setMusicVolume(1);
        this.zeusAudiosCtrl.setSoundVolume(1);
        ClientNotify.removeByHandle(GlobalCfg.MSG_TYPE.serverMsg, this.msgHandle);
        ClientNotify.removeByHandle(GlobalCfg.MSG_TYPE.clientMsg, this.customMsgHandle);
        CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.EXIT_ZEUS_GAME);
        GlobalCfg.ACT_SCENE_CTRL = null;
    },

    onEventMsg: function(webData, target){
        let self = target;
        let msgId = webData.msgCode;
        let notify = webData.msgData;
        if (msgId == 'gameservice.login' && self.isLoginFinished == false) {
            self.isLoginFinished = true;
            self.dealLoginAckEvent(notify);
        }
        else if (msgId === "gameservice.call" || msgId == 'gameservice.freecall') {
            self.dealCallAckEvent(notify, msgId === "gameservice.freecall");
        }
        else if (msgId == 'gameservice.exit') {
            self.dealExitAckEvent(notify);
        }
        else if (msgId == 'gameservice.updatecoinnotify') {
            self.dealUpdateCoinNotifyEvent(notify);
        }
        else if (msgId == GlobalCfg.CLIENT_MSG_ID.ZEUS_ALL_SPIN_FINISHED) {
            self.dealAllSpinFinishedEvent(notify);
        }
        else if (msgId == GlobalCfg.CLIENT_MSG_ID.ZEUS_SEND_SPIN_REQ) {
            self.dealSendSpinReqEvent(notify.bet, notify.isDoubleMulti);
        }   
        else if (msgId == GlobalCfg.CLIENT_MSG_ID.ZEUS_TRIGGER_AUTO_TOGGLE) {
            self.dealTriggerAutoToggleEvent(notify);
        }
        else if (msgId == GlobalCfg.CLIENT_MSG_ID.ZEUS_SELECTED_BET_FRESH) {
            self.dealSelectedBetEvent(notify);
        }
        else if (msgId == GlobalCfg.CLIENT_MSG_ID.ZEUS_SHOW_BUY_FREE_TIPS) {
            self.dealShowBuyFreeTipsEvent(notify);
        }
        else if (msgId == GlobalCfg.CLIENT_MSG_ID.ZEUS_SEND_BUY_FREE_REQ) {
            self.dealSendBuyFreeReqEvent(notify);
        }
        else if (msgId == GlobalCfg.CLIENT_MSG_ID.ZEUS_ONCE_ERASE_FINISHED) {
            self.dealOnceEraseFinishedEvent(notify);
        }
        else if (msgId == GlobalCfg.CLIENT_MSG_ID.ZEUS_TRIGGER_DOUBLE_TOGGLE) {
            self.dealTriggerDoubleToggleEvent(notify);
        }
        // else if(msgId == GlobalCfg.CLIENT_MSG_ID.FIRST_RECHARGE_TIPS){
        //     SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.ZEUS, SceneManager.getInstance().sceneType.LOBBY);
        // }
        else if (msgId == GlobalCfg.CLIENT_MSG_ID.ZEUS_ENTER_FREE_STATUS) {
            self.dealEnterFreeStatusEvent(notify);
        }
        else if (msgId == GlobalCfg.CLIENT_MSG_ID.GAME_MENU_CLICK_OUT_TO_LOBBY) {
            let proroID = "gameservice.exit";
            let message = "ExitReq";
            GameServerManager.send(proroID, message, {});
        }
        else if (msgId == GlobalCfg.CLIENT_MSG_ID.GAME_MENU_CLICK_HOW_TO_PLAY) {
            CommonFun.getInstance().showRule("zeusGame");
        }
        else if (msgId == GlobalCfg.CLIENT_MSG_ID.GAME_MENU_CLOSE) {
            
        }
        else if (msgId == "lobbyservice.kicktolobby") {
            SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.ZEUS, SceneManager.getInstance().sceneType.LOBBY);
        }
    },

    // 监听错误消息
    checkWebMsgError: function(webData, target) {
        let self = target;
        let msgId = webData.msgCode;
        let notify = webData.msgData;
        if (!notify) {
            let info = {
                errorMessage: `zeus游戏中, 服务器下发的非正确消息中结构体异常$ringify(webData)}`
            };
            CommonFun.getInstance().reportToTelegram(info);
            return;
        };
        let result = notify.result;
        if (notify.Result) {
            result = notify.Result;
        };
        if (msgId === "gameservice.login") {
            CommonFun.getInstance().showMsgBox(result.message, "YES", () => {
                SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.ZEUS, SceneManager.getInstance().sceneType.LOBBY);
            }, false);
        } 
        else if (msgId === "gameservice.call" || msgId == 'gameservice.freecall') { 
            self.bottomAreaCtrl.setBtnSpinInteractableStatus(true);
            self.leftAreaCtrl.setBtnBuyFreeInteractableStatus(true);
            self.leftAreaCtrl.setTogDoubleMultiInteractableStatus(true);
            if (CommonFun.getInstance().isFreePlayerDirectedToFreeTP()) {
                if (result.result == 57) {
                    CommonFun.getInstance().showDiversionFreeTP(() => {
                        let proroID = "gameservice.exit";
                        let message = "ExitReq";
                        GameServerManager.send(proroID, message, {});
                        // SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.ZEUS, SceneManager.getInstance().sceneType.LOBBY);
                    });
                }
                else {
                    CommonFun.getInstance().showTips(result.message);
                };
            }
            else {
                CommonFun.getInstance().showTips(result.message);
            };
        }
        else {
            CommonFun.getInstance().showTips(result.message);
        };
    },

    dealLoginAckEvent: function(notify) {
        if (!notify) {
            LoggerUtil.getInstance().warn("zeus游戏中, 服务器下发的gameservice.login结构体异常");
            return;
        };

        let whole = notify.whole;
        if (!whole) {
            LoggerUtil.getInstance().warn("zeus游戏中, 服务器下发的gameservice.login结构体中whole字段异常");
            return;
        };

        /**
         * 配置信息
         */
        let config = whole.config;
        if (config) {
            let chipOption = config.chipOption;
            if (Array.isArray(chipOption) && chipOption.length > 0) {
                let state = this.leftAreaCtrl.getTogDoubleMultiCheckedStatus();
                this.bottomAreaCtrl.setDoubleMultiState(state);
                this.bottomAreaCtrl.setBetArr(chipOption);
                this.bottomAreaCtrl.setCurBetIndex(0);
                let bet = chipOption[0];
                let score = (bet * 1.25)/100; 
                this.leftAreaCtrl.setMutilPrice(score);
            }
            else {
                LoggerUtil.getInstance().warn("zeus游戏中, 服务器下发的gameservice.login结构体中whole.config.chipOption字段异常");
            };
        }
        else {
            LoggerUtil.getInstance().warn("zeus游戏中, 服务器下发的gameservice.login结构体中whole.config字段异常");
        };

        /**
         * 玩家信息
         */
        let requester = whole.requester;
        if (requester) {
            let userInfo = requester.userInfo;
            if (userInfo) {
                let playerId = userInfo.playerId;               // 玩家游戏Id
                let uid = userInfo.uid;                         // userid
                let imgUrl = userInfo.imgUrl;                   // 头像
                let nickname = userInfo.nickname;               // 昵称
                let diamond = userInfo.diamond;                 // 金币
                let vipLevel = userInfo.vipLevel;               // vip等级
                this.myCoinCtrl.setMyCoin(diamond);

                this.curPlayerId = playerId;
            }
            else {
                LoggerUtil.getInstance().warn("zeus游戏中, 服务器下发的gameservice.login结构体中whole.requester.userInfo字段异常");
            };

            let leftFreeSpin = requester.leftFreeSpin;
            this.leftAreaCtrl.setFreeCount(leftFreeSpin);
        }
        else {
            LoggerUtil.getInstance().warn("zeus游戏中, 服务器下发的gameservice.login结构体中whole.requester字段异常");
        };

        /**
         * 场景信息
         */
        let scene = whole.scene;
        if (scene) {
            let scroll = scene.scroll;
            if (!scroll || !Array.isArray(scroll) || scroll.length != 6) {
                LoggerUtil.getInstance().warn("zeus游戏中, 服务器下发的gameservice.login结构体中whole.scene.scroll字段异常");
            }
            else {
            };
        }
        else {
            LoggerUtil.getInstance().warn("zeus游戏中, 服务器下发的gameservice.login结构体中whole.scene字段异常");
        };
    },

    dealCallAckEvent: function(notify, isBuy) {
        if (!notify) {
            this.bottomAreaCtrl.setBtnSpinInteractableStatus(true);
            this.leftAreaCtrl.setBtnBuyFreeInteractableStatus(true);
            this.leftAreaCtrl.setTogDoubleMultiInteractableStatus(true);
            LoggerUtil.getInstance().warn("zeus游戏中, 服务器下发的gameservice.call结构体异常");
            return;
        };

        /**
         * 开始时免费次数
         */
        let startFreeSpin = notify.startFreeSpin;
        /**
         * 常规SPIN
         */
        let generalSpin = notify.spin;
        /**
         * 常规SPIN结算后剩余金币
         */
        let normalAfter = notify.normalAfter;
        /**
         * FreeSPIN列表
         */
        let freeSpin = notify.freeSpin;
        /**
         * 结算后剩余金币
         */
        let finalAfter = notify.finalAfter;
        /**
         * 下注金额(底注)
         */
        let bet = notify.bet;

        if (!isBuy) {
            if (!generalSpin) {
                LoggerUtil.getInstance().warn("zeus游戏中, 服务器下发的gameservice.call结构体中spin字段异常");
                this.bottomAreaCtrl.setBtnSpinInteractableStatus(true);
                this.leftAreaCtrl.setBtnBuyFreeInteractableStatus(true);
                this.leftAreaCtrl.setTogDoubleMultiInteractableStatus(true);
                return;
            };
    
            let generalSpinStartScroll = generalSpin.startScroll;
            if (!generalSpinStartScroll || !Array.isArray(generalSpinStartScroll) || generalSpinStartScroll.length != 6) {
                LoggerUtil.getInstance().warn("zeus游戏中, 服务器下发的gameservice.call结构体中spin.startScroll字段异常");
                this.bottomAreaCtrl.setBtnSpinInteractableStatus(true);
                this.leftAreaCtrl.setBtnBuyFreeInteractableStatus(true);
                this.leftAreaCtrl.setTogDoubleMultiInteractableStatus(true);
                return;
            };
    
            for (let i = 0, len = generalSpinStartScroll.length; i < len; i++) {
                let axis = generalSpinStartScroll[i];
                let cellArr = axis.cell;
                if (!cellArr || !Array.isArray(cellArr) || cellArr.length < 5) {
                    LoggerUtil.getInstance().warn(`zeus游戏中, 服务器下发的gameservice.call结构体中spin.startScroll[${i}].cell字段异常`);
                    this.bottomAreaCtrl.setBtnSpinInteractableStatus(true);
                    this.leftAreaCtrl.setBtnBuyFreeInteractableStatus(true);
                    this.leftAreaCtrl.setTogDoubleMultiInteractableStatus(true);
                    return;
                };
            };
    
            let generalSpinErase = generalSpin.erase;
            if (!Array.isArray(generalSpinErase)) {
                LoggerUtil.getInstance().warn("zeus游戏中, 服务器下发的gameservice.call结构体中spin.erase字段异常");
                this.bottomAreaCtrl.setBtnSpinInteractableStatus(true);
                this.leftAreaCtrl.setBtnBuyFreeInteractableStatus(true);
                this.leftAreaCtrl.setTogDoubleMultiInteractableStatus(true);
                return;
            };
        };
        
        if (!Array.isArray(freeSpin)) {
            LoggerUtil.getInstance().warn("zeus游戏中, 服务器下发的gameservice.call结构体中freeSpin字段异常");
            this.bottomAreaCtrl.setBtnSpinInteractableStatus(true);
            this.leftAreaCtrl.setBtnBuyFreeInteractableStatus(true);
            this.leftAreaCtrl.setTogDoubleMultiInteractableStatus(true);
            return;
        };

        for (let i = 0, len = freeSpin.length; i < len; i++) {
            let freeSpinOnce = freeSpin[i];

            let freeSpinOnceStartScroll = freeSpinOnce.startScroll;
            if (!freeSpinOnceStartScroll || !Array.isArray(freeSpinOnceStartScroll) || freeSpinOnceStartScroll.length != 6) {
                LoggerUtil.getInstance().warn(`zeus游戏中, 服务器下发的gameservice.call结构体中freeSpin[${i}].startScroll字段异常`);
                this.bottomAreaCtrl.setBtnSpinInteractableStatus(true);
                this.leftAreaCtrl.setBtnBuyFreeInteractableStatus(true);
                this.leftAreaCtrl.setTogDoubleMultiInteractableStatus(true);
                return;
            };

            let freeSpinOnceErase = freeSpinOnce.erase;
            if (!Array.isArray(freeSpinOnceErase)) {
                LoggerUtil.getInstance().warn(`zeus游戏中, 服务器下发的gameservice.call结构体中freeSpin[${i}].erase字段异常`);
                this.bottomAreaCtrl.setBtnSpinInteractableStatus(true);
                this.leftAreaCtrl.setBtnBuyFreeInteractableStatus(true);
                this.leftAreaCtrl.setTogDoubleMultiInteractableStatus(true);
                return;
            };

            for (let k = 0, len = freeSpinOnceStartScroll.length; k < len; k++) {
                let axis = freeSpinOnceStartScroll[k];
                let cellArr = axis.cell;
                if (!cellArr || !Array.isArray(cellArr) || cellArr.length < 5) {
                    LoggerUtil.getInstance().warn(`zeus游戏中, 服务器下发的gameservice.call结构体中freeSpin[${i}].startScroll[${k}].cell字段异常`);
                    this.bottomAreaCtrl.setBtnSpinInteractableStatus(true);
                    this.leftAreaCtrl.setBtnBuyFreeInteractableStatus(true);
                    this.leftAreaCtrl.setTogDoubleMultiInteractableStatus(true);
                    return;
                };
            };
        };

        // LoggerUtil.getInstance().log("服务器下发的源数据 =======> ", JSON.parse(JSON.stringify(notify)));

        /**
         * 先扣除bet金额
         */
        let coin = this.myCoinCtrl.getMyCoin();
        let coinTemp = coin - (isBuy ? bet * 100 : bet);
        this.myCoinCtrl.setMyCoin(coinTemp);

        LoggerUtil.getInstance().log("服务器下发的源数据 =======> ", JSON.parse(JSON.stringify(notify)));


        /**
         * 清空上次SPIN相关内容
         */
        this.bottomAreaCtrl.removeWinScore();
        this.centreAreaCtrl.removeSpinData();
        this.leftAreaCtrl.removeAllRecordItems();

        /**
         * 处理本次SPIN相关内容
         */
        this.leftAreaCtrl.setFreeCount(startFreeSpin);
        this.leftAreaCtrl.setFreeStatus(false);
        this.centreAreaCtrl.dealSpinResultProcess(notify);
    },
 
    dealExitAckEvent: function(notify) {
        SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.ZEUS, SceneManager.getInstance().sceneType.LOBBY);
    },

    dealUpdateCoinNotifyEvent: function(notify) {
        if (!notify) {
            return;
        };

        let playerId = notify.playerId;    // 玩家Id
        let balance = notify.balance;      // 剩余数量
        let reason = notify.reason;       // 原因 1:支付; 其他：未知

        if (this.curPlayerId == playerId) {
            this.myCoinCtrl.setMyCoin(balance);
        };
    },

    btnClick: function(btn) {
        let btnName = btn.node.name;
        GlobalCfg.G_COMPONENTS.Audio.playButton();
        switch (btnName) {
            case this.btn_back.node.name:
                this.dealBtnBackEvent();
                break;
            case this.btn_getCoin.node.name:
                this.dealBtnGetCoinEvent();
                break;
            default:
                break;
        }
    },

    dealBtnBackEvent: function() {
        CommonFun.getInstance().showGameMenu(false);
    },

    dealBtnGetCoinEvent: function() {
        CommonFun.getInstance().showSmallAddCash();
    },  
    
    dealAllSpinFinishedEvent: function(notify) {
        let isHaveFreeSpin = notify.isHaveFreeSpin;
        if (isHaveFreeSpin) {
            this.playLightNingAnim("normalState");
            let finalAfter = notify.finalAfter;
            this.myCoinCtrl.setMyCoin(finalAfter);
            this.leftAreaCtrl.setBuyFreeState(false);
            this.curRoundAddCoinFinish();
        }
        else {
            let finalAfter = notify.finalAfter;
            this.myCoinCtrl.setMyCoin(finalAfter);
            if (this.isAuto) {
                this.dealSendSpinReqEvent(this.bet, this.isDoubleMulti);
            }
            else {
                this.bottomAreaCtrl.setBtnSpinInteractableStatus(true);    
                this.leftAreaCtrl.setBtnBuyFreeInteractableStatus(true); 
                this.leftAreaCtrl.setTogDoubleMultiInteractableStatus(true);   
                let curBetIndex = this.bottomAreaCtrl.getCurBetIndex();
                this.bottomAreaCtrl.setBetBtnsAndLabByIndex(curBetIndex);
                this.curRoundAddCoinFinish();
            };
        };
    },

    dealSendSpinReqEvent: function(bet, isDoubleMulti) {
        if (bet <= 0) {
            LoggerUtil.getInstance().warn(`zeus游戏中, 自定义ZEUS_SEND_SPIN_REQ消息的数据异常`, bet)
            return;
        };

        let coin = this.myCoinCtrl.getMyCoin();
        if (GlobalCfg.USER_DATAS.recharged == 0){
            this.bottomAreaCtrl.setBtnSpinInteractableStatus(true);  
            this.leftAreaCtrl.setBtnBuyFreeInteractableStatus(true); 
            this.leftAreaCtrl.setTogDoubleMultiInteractableStatus(true);
            CommonFun.getInstance().showMsgBox("You need to become a recharge player , go to recharge?", "SHOP", () => {
                CommonFun.getInstance().showSmallAddCash()
            }, false);
            return;
        } 
        if (coin < bet) {
            this.bottomAreaCtrl.setBtnSpinInteractableStatus(true);  
            this.leftAreaCtrl.setBtnBuyFreeInteractableStatus(true); 
            this.leftAreaCtrl.setTogDoubleMultiInteractableStatus(true);
            if (GlobalCfg.IS_CLUB_MODE == 1)  //代理模式不跳转商城
                CommonFun.getInstance().showMsgBox('Insufficient cash', "YES", () => {}, false);
            else 
                CommonFun.getInstance().showSmallAddCash();
            return;
        };

        this.leftAreaCtrl.setBtnBuyFreeInteractableStatus(false);
        this.leftAreaCtrl.setTogDoubleMultiInteractableStatus(false);

        this.bet = bet;
        this.isDoubleMulti = isDoubleMulti;
        let proroID = "gameservice.call";
        let message = "CallReq";
        GameServerManager.send(proroID, message, {amount: this.bet, double: this.isDoubleMulti});
    },

    dealTriggerAutoToggleEvent: function(notify) {
        if (!notify) {
            return;
        };
        
        this.isAuto = notify.isAuto;
    },

    dealSelectedBetEvent: function(notify) {
        if (!notify) {
            return;
        };

        let bet = notify.bet;
        this.bet = bet;

        let score = (bet * 1.5)/100; 
        // this.bottomAreaCtrl.setMutilPrice(score);
    },

    dealShowBuyFreeTipsEvent: function(notify) {
        if (!notify || notify.bet <= 0) {
            LoggerUtil.getInstance().warn(`zeus游戏中, dealShowBuyFreeTipsEvent`, notify);
            return;
        };

        CommonFun.getInstance().loadBundle('zeusGame', (bundle) => {
            bundle.load("prefabs/zeusBuyFreeTips", cc.Prefab, (err, prefab) => {
                if (!err) {
                    GlobalCfg.ACT_SCENE_CTRL.zeusAudiosCtrl.playBuyFreeTipsShowEffect();
                    let zeusBuyFreeTips = cc.instantiate(prefab);
                    let zeusBuyFreeTipsCtrl = zeusBuyFreeTips.getComponent("zeusBuyFreeTipsCtrl");
                    zeusBuyFreeTipsCtrl.setBuyFreeTipsData(notify.bet);
                    this.node.addChild(zeusBuyFreeTips);
                };
            });
        }, (err) => {
            LoggerUtil.getInstance().error(`加载zeusGame-Bundle异常: ${JSON.stringify(err)}`);
        });
    },

    dealSendBuyFreeReqEvent: function(notify) {
        if (!notify || notify.bet <= 0) {
            LoggerUtil.getInstance().warn(`zeus游戏中, dealSendBuyFreeReqEvent`, notify);
            return;
        };

        let isAgree = notify.isAgree;

        if (isAgree) {
            if (GlobalCfg.USER_DATAS.recharged == 0){
                CommonFun.getInstance().showMsgBox("You need to become a recharge player , go to recharge?", "SHOP", () => {
                    CommonFun.getInstance().showSmallAddCash()
                }, false);
                return;
            }
            let coin = this.myCoinCtrl.getMyCoin();
            if (coin < notify.bet * 100) {
                GlobalCfg.ACT_SCENE_CTRL.zeusAudiosCtrl.playBuyFreeTipsHideEffect();
                this.leftAreaCtrl.setBuyFreeState(false);
                this.leftAreaCtrl.playBtnFreeAnim(true);
                this.bottomAreaCtrl.setBtnSpinInteractableStatus(true);  
                this.leftAreaCtrl.setBtnBuyFreeInteractableStatus(true); 
                this.leftAreaCtrl.setTogDoubleMultiInteractableStatus(true);
                if (GlobalCfg.IS_CLUB_MODE == 1)  //代理模式不跳转商城
                    CommonFun.getInstance().showMsgBox('Insufficient cash', "YES", () => {}, false);
                else 
                    CommonFun.getInstance().showSmallAddCash();
                
                return;
            };

            GlobalCfg.ACT_SCENE_CTRL.zeusAudiosCtrl.playBuyFreeTipsCliclOkEffect();
            this.leftAreaCtrl.setBuyFreeState(true);
            this.leftAreaCtrl.playBtnFreeAnim(true);
            this.bottomAreaCtrl.setBtnSpinInteractableStatus(false);
            this.leftAreaCtrl.setBtnBuyFreeInteractableStatus(false); 
            this.leftAreaCtrl.setTogDoubleMultiInteractableStatus(false); 

            let bet = notify.bet;
            let proroID = "gameservice.freecall";
            let message = "FreeCallReq";
            GameServerManager.send(proroID, message, {amount: bet});
        }
        else {
            GlobalCfg.ACT_SCENE_CTRL.zeusAudiosCtrl.playBuyFreeTipsHideEffect();
            this.leftAreaCtrl.setBuyFreeState(false);
            this.leftAreaCtrl.playBtnFreeAnim(true);
            this.leftAreaCtrl.setBtnBuyFreeInteractableStatus(true);
            this.leftAreaCtrl.setTogDoubleMultiInteractableStatus(true);
        };
    },

    dealOnceEraseFinishedEvent: function(notify) {
        if (!notify) {
            LoggerUtil.getInstance().warn(`zeus游戏中, dealOnceEraseFinishedEvent`, notify);
            return;
        };

        let erase = notify.erase;
        let bet = erase.bet;
        let mul = erase.mul;             // 倍数

        let addCoin = bet * mul/20;

        if (addCoin > 0) {
            let coin = this.myCoinCtrl.getMyCoin();
            let coinTemp = coin + addCoin;
            this.myCoinCtrl.setMyCoin(coinTemp);
        };
    },

    dealTriggerDoubleToggleEvent: function(notify) {
        if (!notify) {
            LoggerUtil.getInstance().warn(`zeus游戏中, dealTriggerDoubleToggleEvent`, notify);
            return;
        };


        this.isDoubleMulti = notify.isDoubleMulti;
        this.bottomAreaCtrl.setDoubleMultiState(this.isDoubleMulti);
        let curBetIndex = this.bottomAreaCtrl.getCurBetIndex();
        this.bottomAreaCtrl.setBetBtnsAndLabByIndex(curBetIndex);
    },


    dealEnterFreeStatusEvent: function() {
        this.playLightNingAnim("freeState");
    },


    playLightNingAnim: function(state) {
        this.curGameState = state;
        GlobalCfg.ACT_SCENE_CTRL.zeusAudiosCtrl.playLightNingEffect();
        this.node_lightNingBg.active = true;
        this.skeleton_lightNing.node.active = true;
        this.skeleton_lightNing.defaultSkin = 'default';
        this.skeleton_lightNing.setAnimation(0, 'animation', false);
    },


    getCoinFormatStr: function(coin) {
        let decimalPlaces = this.getCoinDecimalPlaces(coin);
        return coin.toFixed(decimalPlaces);
    },


    getCoinDecimalPlaces: function(coin) {
        let decimalPlaces = 0;
        if (coin < 100000) {
            decimalPlaces = 2;
        }
        else if (100000 <= coin && coin < 1000000) {
            decimalPlaces = 1;
        }
        else if (1000000 <= coin) {
            decimalPlaces = 0;
        };
        return decimalPlaces;
    },
});
