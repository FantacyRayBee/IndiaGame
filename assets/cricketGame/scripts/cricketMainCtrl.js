const Team = cc.Enum({
    None: 0,
    T1: 1,
    T2: 2,
    T3: 3,
    T4: 4,
    T5: 5,
    T6: 6,
    T7: 7,
    T8: 8
})
cc.Class({
    extends: cc.Component,

    properties: {
        betBtns: { default: [], type: cc.Button, tooltip: "Bet按钮" },
        teamSpriteFrames: { default: [], type: cc.SpriteFrame, tooltip: "队伍图标" },

        pabfabCoin: cc.Prefab,
        pabfabHistory: { default: null, type: cc.Prefab, tooltip: "历史记录预制节点" },
        prefabPlayerList: { default: null, type: cc.Prefab, tooltip: "玩家列表预制节点" },
        resultNode: { default: null, type: cc.Prefab, tooltip: "结束记录预制节点" },


        clockNode: { default: null, type: cc.Node, tooltip: "闹钟节点" },
        selfPlayerNode: { default: null, type: cc.Node, tooltip: "玩家自己节点" },
        betButtonsNode: cc.Node,
        recordNode: { default: null, type: cc.Node, tooltip: "历史记录管理节点" },
        playerSeatNode: { default: null, type: cc.Node, tooltip: "玩家座位管理" },
        rouletteNode: { default: null, type: cc.Node, tooltip: "转盘节点" },
        coinParentNode: { default: null, type: cc.Node, tooltip: "金币父节点" },
        recordParentNode: { default: null, type: cc.Node, tooltip: "历史记录父节点" },

        btnRecord: { default: null, type: cc.Button, tooltip: "记录按钮" },
        btnAllWj: { default: null, type: cc.Button, tooltip: "所有玩家" },
        btnAddCash: { default: null, type: cc.Button, tooltip: "充值按钮" },
        btnRepeat: { default: null, type: cc.Button, tooltip: "重复下注" },

        btnOpenMenu: { default: null, type: cc.Button, tooltip: "菜单按钮" },

        endAnimationNode: { default: null, type: cc.Node, tooltip: "游戏结束结算动画节点" },
        endAnimationResultNode: { default: null, type: cc.Node, tooltip: "游戏结束结算动画结果" },
        spineSkeletonData: { default: null, type: sp.SkeletonData, tooltip: "游戏结束结算动画数据" },
        betStartEndAnimationNode: { default: null, type: cc.Node, tooltip: "开始结束Bet动画节点" },
        startEndSkeletonData: { default: [], type: sp.SkeletonData, tooltip: "开始结束Spine动画数据" },
        vipSpriteAtlas: { default: null, type: cc.SpriteAtlas, tooltip: "vip图标" },

        isInHide: {
            get: function () {
                return this._isInHide;
            },
            set: function (value) {
                this._isInHide = value;
            },
            type: cc.Boolean,
            visible: false
        },
        btnFreeGame: cc.Node,
    },

    ctor() {
        this._isInHide = false;
        this.betDuration = 0;   // 下注时长
        this.calcDuration = 0;  // 结算时长
        this.betRates = [40, 30, 25, 20, 15, 10, 5, 2];
        this.betPoolsLabel = [null];
        this.selfBetPoolsLabel = [null];
        this.gameEndServerMsg = null;         // 游戏结束消息        
        this.preRoundBetData = [];         // 上一局下注数据
        this.curRoundBetData = [];          // 当局下注数据
        this.gameState = null;          // 游戏状态, 0 下注中，1转动+结算
        this.tableCoinsList = [null];       // 8个table的金币列表
        for (let i = 1; i <= 8; i++) {
            this.tableCoinsList.push(new Array())
        }
        this.isHaveBet = false;    // 是否有下注
    },

    onLoad() {
        CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.SHOW_CRICKET_GAME);

        GlobalCfg.ACT_SCENE_CTRL = this;
        CommonFun.getInstance().checkShiPei(this.node);
        this.serverMsgManager = this.node.getComponent("cricketServerMsgManager");
        this.curBetCtrl = this.betButtonsNode.getComponent('cricketCurBetCtrl');
        this.seatManager = this.playerSeatNode.getComponent('cricketSeatManager');
        this.recordCtrl = this.recordNode.getComponent('cricketRecordCtrl');
        this.rouletteManager = this.rouletteNode.getComponent('cricketRouletteManager');
        this.audioManager = this.node.getComponent('cricketAudioManager');
        this.audioManager.inite();

        for (let i = 0; i < this.betBtns.length; i++) {
            let btnNode = this.betBtns[i].node;
            btnNode.getChildByName('labRate').getComponent(cc.Label).string = this.betRates[i] + 'x';
            btnNode.getChildByName('num').getComponent(cc.Label).string = 0;
            btnNode.getChildByName('selfNum').getComponent(cc.Label).string = 0;
            btnNode.getChildByName('fg_01').active = false;
            this.betPoolsLabel.push(btnNode.getChildByName('num').getComponent(cc.Label));
            this.selfBetPoolsLabel.push(btnNode.getChildByName('selfNum').getComponent(cc.Label));

            btnNode.on('click', CommonFun.getInstance().debounce(() => {
                this.btnBetClick(i + 1);
            }, 0), this);
        }
        this.btnRecord.node.on('click', CommonFun.getInstance().debounce(this.btnClick), this);
        this.labAllPlayer = this.btnAllWj.node.getChildByName('playersNum').getChildByName('Label').getComponent(cc.Label);
        this.btnAllWj.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
        this.btnAddCash.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
        this.btnRepeat.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
        this.btnOpenMenu.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
        this.btnRepeat.interactable = false;
        this.vipSprite = this.selfPlayerNode.getChildByName('txk').getChildByName('VIP').getComponent(cc.Sprite);
        if (CommonFun.getInstance().isOpenVipModule() == false) {
            this.vipSprite.node.active = false;
        }
        this.selfPlayerNode.getChildByName('WinLabel').active = false;

        this.btnAddCash.node.active = GlobalCfg.USER_DATAS.openModules.includes(4);
        this.clockNode.active = false;
        this.initJbPool();
        this.endAnimationNode.active = false;
        this.betStartEndAnimationNode.active = false;

        this.msgHandle = ClientNotify.register(GlobalCfg.MSG_TYPE.serverMsg, this.onEventMsg, this);
        this.customMsgHandle = ClientNotify.register(GlobalCfg.MSG_TYPE.clientMsg, this.onCustomEventMsg, this);

        this.btnFreeGame.active = GlobalCfg.USER_DATAS.isNotCharge;
        this.btnFreeGame.getChildByName("lab").getComponent(cc.Label).string = "Free Games\n(" + GlobalCfg.USER_DATAS.freegameBetCount + ")";
        // this.curBetCtrl.refreshBetCoinBtn(!GlobalCfg.USER_DATAS.isNotCharge);
    },

    start() {
        this.serverMsgManager.sendLoginMsg();
        this.audioManager.playGameMusic('BgMusic');
        this.eventHide = () => {
            LoggerUtil.getInstance().log("Cricket Game: 切入到后台", this);
            if (this.isValid) {
                this.isInHide = true;
                this.rouletteManager.stopRotate();
                this.unscheduleAll();
            } else {
                this.destroy();
            }
        }
        cc.game.on(cc.game.EVENT_HIDE, this.eventHide);
        this.eventShow = () => {
            LoggerUtil.getInstance().log("Cricket Game: 切入到前台", this);
            if (this.isValid) {
                this.isInHide = false;
                this.serverMsgManager.sendFreshSceneMsg();
            } else {
                this.destroy();
            }
        }
        cc.game.on(cc.game.EVENT_SHOW, this.eventShow);
    },

    onDestroy: function () {
        GlobalCfg.ACT_SCENE_CTRL = null;
        ClientNotify.removeByHandle(GlobalCfg.MSG_TYPE.serverMsg, this.msgHandle);
        ClientNotify.removeByHandle(GlobalCfg.MSG_TYPE.clientMsg, this.customMsgHandle);
        cc.game.off(cc.game.EVENT_HIDE, this.eventHide);
        cc.game.off(cc.game.EVENT_SHOW, this.eventShow);
        CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.EXIT_CRICKET_GAME);
    },

    // update (dt) {},

    unscheduleAll() {
        this.unschedule(this.scheduleUpdateEndCoinCallback);
        this.unschedule(this.scheduleTime1Callback);
        this.unschedule(this.scheduleTime2Callback);
        this.unschedule(this.scheduleTimeCallback);
    },

    refreshScene() {
        for (let i = 1; i < this.tableCoinsList.length; i++) {
            let tableCoins = this.tableCoinsList[i];
            for (let j = 0; j < tableCoins.length; j++) {
                let jbNode = tableCoins[j];
                if (jbNode.isValid == true) {
                    this.removeJbNode(jbNode);
                }
            }
            tableCoins.length = 0;
        }
        this.closeTableLight();
    },

    closeTableLight(){
        for (let i = 0; i < this.betBtns.length; i++) {
            let node = this.betBtns[i].node;
            let lightNode = node.getChildByName('fg_01');
            lightNode.active = false;
            let lightAnimation = lightNode.getComponent(cc.Animation);
            if (lightAnimation) {
                lightAnimation.stop();
            }
            lightNode.opacity = 255;
        }
    },

    btnBetClick(ani) {
        // if (GlobalCfg.USER_DATAS.isNotCharge == true && GlobalCfg.USER_DATAS.gamePattern == 0 && GlobalCfg.USER_DATAS.refuseUnpayHundred["minicricket"]== true) { //未曾充值
        //     CommonFun.getInstance().showMsgBox("This feature is available only for premium players . Add cash now to become a premium player .", "SHOP", () => {
        //         CommonFun.getInstance().showSmallAddCash()
        //     }, false);
        //     return
        // } 
        if(this.gameState == 0){
            if (this.isHaveBet) {
                CommonFun.getInstance().showTips("Non-VIP players can only bet once.");
                return;
            }
            if (CommonFun.getInstance().checkFreeGameBetCountEmpty()) {
                return
            }
            if (GlobalCfg.USER_DATAS.isNotCharge) {
                this.isHaveBet = true;
                CommonFun.getInstance().refreshFreeGameBetCount(this.btnFreeGame);
            }
            this.serverMsgManager.sendBetMsg([{ ani: ani, amount: this.curBetCtrl.curBetNum }]);
        }else{
            // 1 转动、结算
            CommonFun.getInstance().showTips('non betting stage');
        }

    },

    btnClick(Button) {
        let name = Button.node.name;
        GlobalCfg.G_COMPONENTS.Audio.playButton();
        if (name == this.btnRecord.node.name) {
            let history = cc.instantiate(this.pabfabHistory);
            history.parent = this.node;
            let data = this.recordCtrl.getHistoryData();
            history.getComponent('cricketHistoryCtrl').initHistory(data);
        }
        else if (name == this.btnAllWj.node.name) {
            this.serverMsgManager.sendGetPlayerListMsg(0, 12);
        }
        else if (name == this.btnAddCash.node.name) {
            CommonFun.getInstance().showSmallAddCash()
        }
        else if (name == this.btnRepeat.node.name) {
            let arr = this.preRoundBetData.slice();
            this.serverMsgManager.sendBetMsg(arr);
            this.preRoundBetData.length = 0;
            this.btnRepeat.interactable = false;
        }
        else if (name == this.btnOpenMenu.node.name) {
            CommonFun.getInstance().showGameMenu(false);
        }
    },

    onEventMsg(webData, target) {
        let self = target;
        var msgId = webData.msgCode;
        var notify = webData.msgData;
        if (self.isInHide == true) {
            LoggerUtil.getInstance().log('当前处于后台！！');
            return;
        }
        if (msgId == 'gameservice.login') {
            CommonFun.getInstance().hidProgress();
            self.dealLoginData(notify);
            CommonFun.getInstance().hidProgress();
        }
        else if (msgId == 'gameservice.loadwhole') {
            // 刷新游戏场景
            LoggerUtil.getInstance().log("刷新游戏场景>>>>", notify);
            self.dealLoginData(notify);
        }
        else if (msgId == 'gameservice.exit') {
            // 退出游戏通知
            self.unscheduleAll();
            self.rouletteManager.unscheduleAll();
            SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.CRICKET, SceneManager.getInstance().sceneType.LOBBY);
        }
        else if (msgId == 'gameservice.playerlist') {
            // 获取玩家列表
            LoggerUtil.getInstance().log("获取玩家列表>>>>", notify);
            self.dealPlayerList(notify);
        }
        else if (msgId == 'gameservice.playernumberchangednotify') {
            // 人数变化通知
            LoggerUtil.getInstance().log("人数变化通知>>>>", notify);
            let num = notify.num;
            self.labAllPlayer.string = num;
        }
        else if (msgId == 'gameservice.bet') {
            // 下注通知
        }
        else if (msgId == 'gameservice.betnotify') {
            // 下注通知
            self.dealBetNotify(notify);
        }
        else if (msgId == 'gameservice.bettingupdatenotify') {
            // 下注过程update
            // LoggerUtil.getInstance().log("下注过程update>>>>", notify);
            if (notify) {
                let betPool = notify.betPool;
                let isPlaySound = false;
                for (let i = 0; i < betPool.length; i++) {
                    const element = betPool[i];

                    if (self.betPoolsLabel[i]) {
                        let amount = Number(self.betPoolsLabel[i].string) * 100;
                        if (element > amount) {
                            if(!isPlaySound){
                                self.audioManager.playGameSound('otherCoin');
                                let pos = self.btnAllWj.node.getPosition();
                                cc.tween(self.btnAllWj.node)
                                    .to(0.1, {position: cc.v2(pos.x, 20)})
                                    .to(0.1, {position: cc.v2(pos.x, 0)})
                                    .start();
                                isPlaySound = true;
                            }
                            self.dealBetInfo(i, null, self.btnAllWj.node);
                        }
                    }
                }
                
                self.dealTableBetPoolData(betPool, false);
            }
        }
        else if (msgId == 'gameservice.startbettingnotify') {
            // 开始下注阶段通知
            LoggerUtil.getInstance().log("开始下注阶段通知>>>>", notify);
            self.audioManager.playGameMusic('BgMusic');
            self.gameState = 0;
            if (notify) {
                let diamond = notify.diamond;
                GlobalCfg.USER_DATAS.userDiamond = diamond;
            }
            self.updateSelfCoin();
            self.timeSound();
            self.dealStartEndBet(true);
            self.refreshScene();
            if (self.preRoundBetData.length > 0) {
                self.btnRepeat.interactable = true;
            } else {
                self.btnRepeat.interactable = false;
            }


        }
        else if (msgId == 'gameservice.startflynotify') {
            // 开始转动阶段通知, 结束
            self.audioManager.pauseMusic();
            self.gameState = 1;
            LoggerUtil.getInstance().log("开始转动阶段通知>>>>", notify);
            self.curRoundBet = 0;
            for (let i = 0; i < self.curRoundBetData.length; i++) {
                const betData = self.curRoundBetData[i];
                self.curRoundBet = self.curRoundBet + Number(betData.amount);
            }
            if (self.curRoundBetData.length > 0) {
                self.preRoundBetData = self.curRoundBetData.slice();
                self.curRoundBetData.length = 0;
            } else {
                self.curRoundBetData.length = 0;
                self.preRoundBetData.length = 0;
            }
            self.btnRepeat.interactable = false;
            self.dealStartEndBet(false);
            if (notify) {
                let openInfo = notify.openInfo;
                let targetNum = openInfo.ani;
                self.rouletteManager.startRotate(targetNum);
                self.gameEndServerMsg = openInfo;
            }
        }
        else if (msgId == 'gameservice.updatecoinnotify') {
            // 货币更新广播

        }
        else if (msgId == 'gameservice.joinvip') {
            //vip入座

        }
        else if (msgId == 'gameservice.joinvipnotify') {
            //vip入座广播
            LoggerUtil.getInstance().log("vip入座广播>>>>", notify);
        }
        else if (msgId == "gameservice.shortmessagenotify") {  
            self.shortmessagenotify(notify);             // 发送表情
        }
        else if (msgId == GlobalCfg.CLIENT_MSG_ID.CURRENCY_CHANGED_USER_INFO) {
            self.updateSelfCoin();
        }
        // else if (msgId == GlobalCfg.CLIENT_MSG_ID.FIRST_RECHARGE_TIPS) {
            // self.unscheduleAll();
            // self.rouletteManager.unscheduleAll();
            // SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.CRICKET, SceneManager.getInstance().sceneType.LOBBY);
        // }
        else if (msgId == "close_Only_Pay") {
            this.btnFreeGame.active = GlobalCfg.USER_DATAS.isNotCharge;
            this.curBetCtrl.refreshBetCoinBtn(!GlobalCfg.USER_DATAS.isNotCharge);
        }
    },

    onCustomEventMsg(webData, target) {
        let self = target;
        var msgId = webData.msgCode;
        var notify = webData.msgData;
        if (self.isInHide == true) {
            LoggerUtil.getInstance().log('当前处于后台！！');
            return;
        }
        if (msgId == "GAME_CRICKET_ROULETTEE_END") {
            LoggerUtil.getInstance().warn("轮盘转动结束", notify, self.gameEndServerMsg);
            LoggerUtil.getInstance().timeEnd('GAME_CRICKET_ROULETTEE_END');
            if (!self.gameEndServerMsg) {
                return
            }
            self.audioManager.playGameSound('settlementBGM');
            // 轮盘转动结束
            /**
             * 播放动效, 更新历史记录
             * 回收金币、散金币、发放到个人，飘加钱数值
             *
             */
            let ani = self.gameEndServerMsg.ani;
            let endNode = notify.endNode;
            self.playEndAnimation(ani, self.gameEndServerMsg, endNode);
            this.showWinAreaLight(ani);
            self.dealGameFinishData(self.gameEndServerMsg);
            this.isHaveBet = false;
        }
        else if (msgId == "GAME_CRICKET_GIFT_SEND_COIN_UPDATE") {
            // 自己发送表情，更新金币值
            self.updateSelfCoin();
        }
        else if (msgId == GlobalCfg.CLIENT_MSG_ID.GAME_MENU_CLICK_OUT_TO_LOBBY) {
            self.serverMsgManager.sendExitMsg();
        }
        else if (msgId == GlobalCfg.CLIENT_MSG_ID.GAME_MENU_CLICK_HOW_TO_PLAY) {
            CommonFun.getInstance().showRule("cricket");
        }
        else if (msgId == "lobbyservice.kicktolobby") {
            SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.CRICKET, SceneManager.getInstance().sceneType.LOBBY);
        }
    },

    checkWebMsgError(webData, target) {
        let self = target;
        let msgId = webData.msgCode;
        let notify = webData.msgData;
        let result = notify.result;
        LoggerUtil.getInstance().error(notify);
        let msg = result.message ? result.message : "SERVICE ERROR";
        if (msgId == 'gameservice.joinvip') {
            ClientNotify.send(GlobalCfg.MSG_TYPE.serverMsg, {
                msgCode: "GAME_CRICKET_SEAT_JOINVIP_ERROR",
                msgData: { result: result }
            });
            CommonFun.getInstance().showTips(msg);
        }
        else if (msgId == 'gameservice.bet') {
            if (CommonFun.getInstance().isFreePlayerDirectedToFreeTP()) {
                if (result.result == 57) {
                    CommonFun.getInstance().showDiversionFreeTP(() => {
                        GameServerManager.send("gameservice.exit", "ExitReq", {});
                        // SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.CRICKET, SceneManager.getInstance().sceneType.LOBBY);
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
        else if (msgId === "gameservice.login") {
            CommonFun.getInstance().showMsgBox(result.message, "YES", () => {
                SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.CRICKET, SceneManager.getInstance().sceneType.LOBBY);           
            }, false);
        } 
        else {
            CommonFun.getInstance().showTips(msg);
        };
    },


    shortmessagenotify:function(notify) {
        if (!notify) {
            return;
        };

        let msgType = notify.msgType;               // 消息类型 0短语 1表情 2礼物
        let target = notify.target;                 // 接收者seat (-1表示群发)
        let sender = notify.sender;                 // 发送者seat
        let price = notify.price;                   // 消息价格
        let senderAfter = notify.senderAfter;       // 发送者扣价后货币
        let name = notify.name;                     // 表情名/短语内容

        if (msgType != 2) {    // 1表情
            
        } 
        else {
            let targetNodeArr = [];
            let senderCtrl = this.seatManager.getPlayerCtrlBySeatId(sender);
            if (!senderCtrl || !senderCtrl.node) {
                return;
            }else{
                senderCtrl.setUserCoinLabel(senderAfter);
            }

            if (target == -1) {
                for (let i = 0; i < this.seatManager.seatNodeList.length; i++) {
                    let seatNode = this.seatManager.seatNodeList[i];
                    let seatNodeCtrl = seatNode.getComponent('cricketSeatCtrl');
                    if (seatNodeCtrl.isSelf == false && seatNodeCtrl.node.childrenCount > 0) {
                        targetNodeArr.push(seatNode);
                    };
                };
            }
            else {
                let playersCtrl = this.seatManager.getPlayerCtrlBySeatId(target);
                if (playersCtrl) {
                    targetNodeArr.push(playersCtrl.node);
                };
            };
            CommonFun.getInstance().playGameGifInteraction(name, senderCtrl.node, targetNodeArr);
        };
    },

    /**
     * 开始/结束下注
     * @param {boolean} bool true 开始，false 结束
     */
    dealStartEndBet(bool) {
        this.rouletteManager.offEndNodeLight();
        this.betStartEndAnimationNode.active = true;
        let spine = this.betStartEndAnimationNode.getComponent(sp.Skeleton);
        if (bool) {
            this.audioManager.playGameSound('start');
            spine.skeletonData = this.startEndSkeletonData[1];
            let arr = new Array(9).fill(0, 0, 9);
            this.dealTableBetPoolData(arr, false);
            this.dealTableBetPoolData(arr, true);
        } else {
            this.audioManager.playGameSound('Sotpbeting');
            spine.skeletonData = this.startEndSkeletonData[0];
        }
        spine.setAnimation(0, "animation", false);
        spine.setCompleteListener(() => {
            this.betStartEndAnimationNode.active = false;
        });
    },

    /**
     * 登录
     * @param {*} notify 
     */
    dealLoginData(notify) {
        this.rouletteManager.stopRotate();
        if (!notify) {
            LoggerUtil.getInstance().warn("dealLoginData:notify is Error", notify);
            return;
        }
        let allInfo = notify.whole;
        this.dealWholeInfo(allInfo);
    },

    /**
     * 处理场景所有信息
     * @param {WholeInfo} WholeInfo 
     */
    dealWholeInfo(WholeInfo) {
        if (!WholeInfo) {
            return;
        }
        this.gameEndServerMsg = null;
        let config = WholeInfo.config;
        let chips = config.chipOption;          // 下注选项
        this.curBetCtrl.initBetNum(chips);
        this.betDuration = config.betDuration;
        this.calcDuration = config.calcDuration;

        let requester = WholeInfo.requester;        // 玩家信息
        let userInfo = requester.userInfo;
        let chiped = requester.chip;         // 已下注的，下标为Animal
        this.setSelfUserInfo(userInfo);
        this.dealTableBetPoolData(chiped, true);
        let sceneInfo = WholeInfo.scene;
        let status = sceneInfo.status;
        let playerNum = sceneInfo.playerNum;                        // 总玩家人数
        this.labAllPlayer.string = playerNum;
        let currentStatusLeftMs = sceneInfo.currentStatusLeftMs;    // 当前状态剩余时间
        // LoggerUtil.getInstance().warn("当前状态剩余时间", currentStatusLeftMs + "ms", currentStatusLeftMs / 1000 + "s");
        let openInfo = sceneInfo.openInfo;                          // 延时开奖信息
        let betPool = sceneInfo.betPool;                            // 下注池 Array
        this.dealTableBetPoolData(betPool, false);
        let openRecord = sceneInfo.openRecord;                      // 开奖记录
        this.recordCtrl.initItem(openRecord);
        let vips = sceneInfo.vip;
        this.seatManager.initAllPlayer(vips);
        this.gameState = status;
        this.updateClockTime(-1);
        this.closeTableLight();
        switch (status) {
            case 0:     // 下注状态
                // LoggerUtil.getInstance().log('下注状态');
                this.timeSound(currentStatusLeftMs);
                break;
            case 1:     // 转动中
                // LoggerUtil.getInstance().log('转动中');
                let targetNum = openInfo.ani;
                this.rouletteManager.startRotate(targetNum, currentStatusLeftMs);
                this.gameEndServerMsg = openInfo;
                break;
            case 2:     // 结算中
                // LoggerUtil.getInstance().log('结算中');
                break;

            default:
                break;
        }
    },

    /**
     * 倒计时 ， 
     * @param {Number} time ms
     */
    timeSound(timeMs) {
        if (timeMs) {
            let time_S_1 = (timeMs % 1000) / 1000;
            let time_S_2 = Math.floor(timeMs / 1000);
            if (time_S_2 >= 1) {
                let count = time_S_2;
                this.updateClockTime(count);
                this.scheduleTime2Callback = () => {
                    count--;
                    this.updateClockTime(count);
                    if (count <= 3 && count > 0) {
                        this.audioManager.playGameSound('time3-2');
                    }
                    if (count <= 0) {
                        this.updateClockTime(-1);
                    }
                };
                this.scheduleTime1Callback = () => {
                    this.schedule(this.scheduleTime2Callback, 1, count - 1);
                }
                this.scheduleOnce(this.scheduleTime1Callback, time_S_1);

            } else {
                this.updateClockTime(time_S_2);
                this.scheduleTime1Callback = () => {
                    this.updateClockTime(-1);
                }
                this.scheduleOnce(this.scheduleTime1Callback, time_S_1);
            }

        } else {
            let count = Math.floor(this.betDuration / 1000);
            this.updateClockTime(count);
            this.scheduleTimeCallback = () => {
                count--;
                this.updateClockTime(count);
                if (count <= 3 && count > 0) {
                    this.audioManager.playGameSound('time3-2');
                }
                if (count <= 0) {
                    this.updateClockTime(-1);
                }
            };
            this.schedule(this.scheduleTimeCallback, 1, Math.floor(this.betDuration / 1000) - 1);
        }
    },

    /**
     * 
     * @param {*} time 闹钟内的时间，单位：s
     */
    updateClockTime(time) {
        if (time >= 0) {
            let lab = this.clockNode.getChildByName('time').getComponent(cc.Label);
            lab.string = time.toFixed(0);
            this.clockNode.active = true;
        } else {
            this.clockNode.active = false;
        }
    },

    /**
     * 玩家自己信息
     * @param {*} UserInfo 用户信息
     */
    setSelfUserInfo(UserInfo) {
        if (!UserInfo) {
            return;
        }
        GlobalCfg.USER_DATAS.userId = UserInfo.uid;
        GlobalCfg.USER_DATAS.userName = UserInfo.nickname;
        GlobalCfg.USER_DATAS.userDiamond = UserInfo.diamond;
        GlobalCfg.USER_DATAS.userHeadimgurl = UserInfo.imgUrl;
        this.selfPid = UserInfo.playerId;           // 当前游戏玩家唯一标识
        let pos = UserInfo.pos;
        let vipLevel = UserInfo.vipLevel;
        this.selfPlayerNode.getChildByName('userName').getComponent(cc.Label).string = CommonFun.getInstance().getStrByLength(GlobalCfg.USER_DATAS.userName, 8);
        this.updateSelfCoin();
        let tx = cc.find('txk/mask/tx', this.selfPlayerNode);
        this.loadHeadSp(GlobalCfg.USER_DATAS.userHeadimgurl, 80, tx.getComponent(cc.Sprite));
        if (vipLevel >= 1 && vipLevel <= 10 && CommonFun.getInstance().isOpenVipModule()) {
            this.vipSprite.node.active = true;
            this.vipSprite.spriteFrame = this.vipSpriteAtlas.getSpriteFrame(`${vipLevel}`);
        }
        else {
            this.vipSprite.node.active = false;
        };
        let isCanShowVIPFont = CommonFun.getInstance().isCanShowVIPFontByLevel(vipLevel);
        if (isCanShowVIPFont) {
            this.selfPlayerNode.getChildByName('userName').color = new cc.Color(250, 225, 76);
        }
        else {
            this.selfPlayerNode.getChildByName('userName').color = new cc.Color(255, 255, 255);
        };
        if (pos > -1) {
            // 自己在座位上

        }
    },

    /**
    * 更新自己的金币
    */
    updateSelfCoin() {
        this.selfPlayerNode.getChildByName('wj_jb_bg').getChildByName('labCoin').getComponent(cc.Label).string = CommonFun.getInstance().numberToShow(GlobalCfg.USER_DATAS.userDiamond / 100);
    },

    loadHeadSp(headUrl, realWidth, heaSprite) {
        if (headUrl && headUrl.length > 0) {
            cc.assetManager.loadRemote(headUrl, { ext: '.png' }, (err, texture) => {
                if (!err && cc.isValid(this) && cc.isValid(heaSprite)) {
                    heaSprite.spriteFrame = new cc.SpriteFrame(texture);
                    heaSprite.node.setScale(realWidth / heaSprite.node.width);
                }
            });
        }
    },

    /**
     * 处理桌面下注池数据
     * @param {Array} betPools 稀疏数组, 数组下标为类型
     * @param {boolean} isSelfBet 是否是自己下注
     */
    dealTableBetPoolData(betPools, isSelfBet = false) {
        for (let i = 0; i < betPools.length; i++) {
            const element = betPools[i];
            if (isSelfBet) {
                if (this.selfBetPoolsLabel[i]) {
                    this.selfBetPoolsLabel[i].string = Number(element) / 100;
                }
            } else {
                if (this.betPoolsLabel[i]) {
                    this.betPoolsLabel[i].string = Number(element) / 100;
                }
            }

        }
    },

    /**
     * 处理下注信息
     * @param {BetNotify} notify 
     */
    dealBetNotify(notify) {
        if (!notify) {
            LoggerUtil.getInstance().warn("dealBetNotify:notify is Error", notify);
            return;
        }
        let playerid = notify.pid;
        let pos = notify.pos;
        let after = notify.after;
        if (pos == -1 || playerid == this.selfPid) {
            // 自己
            this.audioManager.playGameSound('mytouCoin');
            this.selfBetCoinAction();
            let chip = notify.chip;
            this.updateCurRoundBetInfo(chip);
            let selfAllChip = notify.allChip;
            GlobalCfg.USER_DATAS.userDiamond = after;
            this.updateSelfCoin();
            this.dealTableBetPoolData(selfAllChip, true);
            for (let i = 0; i < chip.length; i++) {
                this.dealBetInfo(chip[i].ani, chip[i].amount, this.selfPlayerNode);
                this.showBetAreaClickAction(chip[i].ani);
            }
            if (pos !== -1) {
                let playerCtrl = this.seatManager.getPlayerCtrlBySeatId(pos);
                playerCtrl.setUserCoinLabel(after);
            }
        } else {
            this.audioManager.playGameSound('otherCoin');
            let playerCtrl = this.seatManager.getPlayerCtrlBySeatId(pos);
            let seatNode = this.seatManager.getSeatNodeBySeatId(pos);
            if (playerCtrl) {
                playerCtrl.setUserCoinLabel(after);
            }
            this.seatManager.seatNodePlayerBet(pos);
            let chip = notify.chip;
            for (let i = 0; i < chip.length; i++) {
                this.dealBetInfo(chip[i].ani, chip[i].amount, seatNode);
            }
        }
    },

    selfBetCoinAction(){
        let txNode = this.selfPlayerNode.getChildByName('txk');
        cc.tween(txNode)
            .to(0.1, { position: cc.v2(0, 20) })
            .to(0.1, { position: cc.v2(0, 0) })
            .start();
    },

    showBetAreaClickAction(ani) {
        if (ani > 8 || ani == 0) {
            LoggerUtil.getInstance().error("ani 类型超出范围", ani);
            return;
        }
        let btnAreaNode = this.betBtns[ani - 1].node;
        let selfBetLab = btnAreaNode.getChildByName('selfNum');
        if (selfBetLab) {
            cc.tween(selfBetLab)
                .to(0.1, { scale: 1.2 })
                .to(0.1, { scale: 1 })
                .start();
        }
    },

    /**
     * 更新当前回合下注信息
     * @param {Array<{ani, amount}>} arr 
     */
    updateCurRoundBetInfo: function (arr) {
        for (let i = 0; i < arr.length; i++) {
            let ani = arr[i].ani;
            let isAdd = false;
            for (let j = 0; j < this.curRoundBetData.length; j++) {
                let element = this.curRoundBetData[j];
                if (ani == element.ani) {
                    element.amount += arr[i].amount;
                    isAdd = true;
                    break;
                }
            }
            if (isAdd == false) {
                this.curRoundBetData.push({
                    ani: ani,
                    amount: arr[i].amount
                });
            }
        }
        // LoggerUtil.getInstance().warn('我当前的下注：', this.curRoundBetData);
    },

    /**
     * 设置总下注值
     * @param {Array} betPools 
     */
    setTotalBetNum(betPools) {
        let all = 0;
        for (let i = 0; i < betPools.length; i++) {
            const element = betPools[i];
            all += element;
        }
        this.labTotalBet.string = all / 100;
    },

    /**
    * 处理下注信息
    * @param {Team} ani Team {1~8}
    * @param {number} num
    * @param {cc.Node} betNode
    * @returns
    */
    dealBetInfo(ani, num, betNode) {
        if (ani > 8 || ani == 0) {
            LoggerUtil.getInstance().error("ani 类型超出范围", ani);
            return;
        }
        let pos = betNode.getPosition();
        let betArea = this.betBtns[ani - 1].node;
        let count = 3;          // 每次下注个数
        for (let i = 0; i < count; i++) {
            this.moveCoinToBetArea(pos, betArea, betNode, ani);
        }
    },

    /**
     * 玩家列表
     * @param {*} notify 
     * @returns 
     */
    dealPlayerList(notify) {
        if (!notify) {
            LoggerUtil.getInstance().error("PlayerList Data Error!");
            return;
        }
        let node = this.node.getChildByName('playerList');
        if (node) {
            let nodeCtrl = node.getComponent('cricketPlayerList');
            if (nodeCtrl) {
                nodeCtrl.setPlayerData(notify);
            }
        } else {
            let nodePlayerList = cc.instantiate(this.prefabPlayerList);
            let nodeCtrl = nodePlayerList.getComponent('cricketPlayerList');
            this.node.addChild(nodePlayerList);
            if (nodeCtrl) {
                nodeCtrl.setPlayerData(notify);
            }
        }
    },

    /**
     * 游戏结束
     * @param {OpenInfo} notify 
     */
    dealGameFinishData(notify) {
        if (!notify) {
            LoggerUtil.getInstance().error("GameFinish Data Error!", notify);
            return;
        }

    },

    /**
     * 播放结束动画
     * @param {Number} ani Animal
     */
    playEndAnimation(ani, notify, endNode) {
        if (ani == 0 || ani > 8) {
            LoggerUtil.getInstance().error("ani is Error", ani);
            return;
        }
        let spine = this.endAnimationNode.getChildByName('spine').getComponent(sp.Skeleton);
        this.endAnimationNode.active = true;
        this.endAnimationResultNode.getComponent(cc.Sprite).spriteFrame = this.teamSpriteFrames[ani - 1];
        let animationName = "animation";
        spine.skeletonData = this.spineSkeletonData;
        spine.setAnimation(0, animationName, false);
        spine.setCompleteListener(() => {
            LoggerUtil.getInstance().warn('动画播放一次循环结束后的事件监听');
            this.endAnimationNode.active = false;
            
            this.dealGameEndCoin(notify);
            this.scheduleUpdateEndCoinCallback = () => {
                let selfInfo = notify.self;
                this.showEndRecordTween(ani, endNode);
                this.selfSettlement(selfInfo);
                this.updateGameEndPlayersCoin(notify);
            };
            this.scheduleOnce(this.scheduleUpdateEndCoinCallback, 0.5);
        });
    },

    showEndRecordTween(ani, endNode) {
        let pos1 = endNode.getPosition();
        // 游戏结束，生成节点至历史记录位置
        let node = cc.instantiate(this.resultNode);
        let worldPos = endNode.parent.convertToWorldSpaceAR(pos1);
        let nodePos = this.recordCtrl.nodeList.convertToNodeSpaceAR(worldPos);
        node.getComponent(cc.Sprite).spriteFrame = this.teamSpriteFrames[ani - 1];

        node.parent = this.recordCtrl.node.getChildByName('New Node');
        node.setPosition(nodePos);
        let pos = this.recordCtrl.getEndNodePos();
        cc.tween(node)
            .to(1, { scale: 0.14, position: pos }, { easing: 'quadInOut' })
            .call(() => {
                this.recordCtrl.updateRecord(ani);
                node.destroy();
            })
            .start();
    },

    /**
     * 展示赢的区域金色光效
     * @param {Team} ani 
     */
    showWinAreaLight(ani) {
        let winNode = this.betBtns[ani - 1].node;
        let lightNode = winNode.getChildByName('fg_01');
        let lightAnimation = lightNode.getComponent(cc.Animation);
        lightNode.active = true;
        lightAnimation.play();
    },

    /**
     * 自己结算
     * @param {*} Player 
     */
    selfSettlement(Player) {
        if (!Player) {
            LoggerUtil.getInstance().error('结算玩家自己数据错误！');
            return
        }
        let pos = Player.pos;                   // 座位号
        let playerid = Player.pid;
        let after = Player.after;               // 结算过后
        let take = Player.take;                 // 输赢积分
        GlobalCfg.USER_DATAS.userDiamond = after;
        this.updateSelfCoin();
        this.curRoundAddCoinFinish();
    },

    curRoundAddCoinFinish(){
        let minLimit = this.curBetCtrl.betNumList[0] || 0;
        CommonFun.getInstance().gameShowSecondRecharge(minLimit, this.curRoundBet);
        CommonFun.getInstance().showWithdrawToastInGame();
    },

    /**
     * 处理游戏结束金币动画
     * @param {OpenInfo} notify 
     */
    dealGameEndCoin(notify) {
        let ani = notify.ani;
        if (ani > 8 || ani == 0) {
            LoggerUtil.getInstance().error("服务器消息错误!!ani 类型超出范围", ani);
            return;
        }
        let winAreaJbNodeList = this.tableCoinsList[ani];
        for (let i = 1; i < this.tableCoinsList.length; i++) {
            if (i == ani) {
                continue;
            }
            let array = this.tableCoinsList[i];
            for (let j = 0; j < array.length; j++) {
                let coinNode = array[j];
                this.funcMoveCoin(coinNode, this.btnAllWj.node, 0.35);
            }
        }
        this.sendCoinToWiner(winAreaJbNodeList, notify);
    },

    funcMoveCoin(coin, toNode, delayTime, isLastNode = false) {
        let localToPos = toNode.getPosition();
        let worldPos = toNode.parent.convertToWorldSpaceAR(localToPos);
        let toPos = this.coinParentNode.convertToNodeSpaceAR(worldPos);
        cc.tween(coin)
            .delay(Math.random() * delayTime + 0.1)
            .to(0.5, { position: toPos }, { easing: 'quadInOut' })
            .call(() => {
                this.removeJbNode(coin);
                if (isLastNode) {
                    LoggerUtil.getInstance().warn('发金币到赢家发放完毕===========');
                }
            })
            .start();
    },

    /**
     * 发金币到赢家
     */
    sendCoinToWiner(arr, notify) {
        LoggerUtil.getInstance().warn('发金币到赢家>>>>>');
        this.audioManager.playGameSound("jbrecover", false);
        let func = (coin, toNode, delayTime, isLastNode = false) => {
            let localToPos = toNode.getPosition();
            let worldPos = toNode.parent.convertToWorldSpaceAR(localToPos);
            let toPos = this.coinParentNode.convertToNodeSpaceAR(worldPos);
            cc.tween(coin)
                .delay(Math.random() * delayTime + 0.1)
                .to(0.5, { position: toPos }, { easing: 'quadInOut' })
                .call(() => {
                    this.removeJbNode(coin);
                    if (isLastNode) {
                        LoggerUtil.getInstance().warn('发金币到赢家发放完毕===========');
                    }
                })
                .start();
        }
        let self = notify.self;
        let vips = notify.vips;
        if (self.take > 0) {
            let arr1 = arr.splice(-5, 5);
            for (let i = 0; i < arr1.length; i++) {
                let coinNode = arr1[i];
                this.funcMoveCoin(coinNode, this.selfPlayerNode, 0.45);
            }
        }
        // VIP 座位有人赢 
        if (vips.length > 0) {
            for (let i = 0; i < vips.length; i++) {
                let Player = vips[i];
                let playerSeatNode = this.seatManager.getSeatNodeBySeatId(Player.pos);
                if (Player.take > 0) {
                    let arr1 = arr.splice(-5, 5);
                    for (let j = 0; j < arr1.length; j++) {
                        let coinNode = arr1[j];
                        this.funcMoveCoin(coinNode, playerSeatNode, 0.55);
                    }
                }
            }
        }
        for (let i = 0; i < arr.length; i++) {
            let coinNode = arr[i];
            this.funcMoveCoin(coinNode, this.btnAllWj.node, 0.55, false);
            if (i == arr.length - 1) {
                this.funcMoveCoin(coinNode, this.btnAllWj.node, 0.55, true);
            }
        }
    },

    /**
     * 更新游戏结束的玩家金币
     * @param {Object} notify 
     */
    updateGameEndPlayersCoin(notify) {
        let self = notify.self;
        let selfWin = self.take;
        if (selfWin > 0) {
            let winLabel = this.selfPlayerNode.getChildByName('WinLabel').getComponent(cc.Label);
            winLabel.node.setPosition(cc.v2(0, 0));
            winLabel.string = "+" + parseFloat((selfWin / 100).toFixed(2));
            winLabel.node.active = true;
            cc.tween(winLabel.node)
                .to(1, { position: cc.v2(0, 100) })
                .delay(0.5)
                .call(() => {
                    winLabel.node.active = false;
                })
                .start();
        }
        let vips = notify.vips;
        if (vips.length > 0) {
            for (let i = 0; i < vips.length; i++) {
                let Player = vips[i];
                let vipPlayerCtrl = this.seatManager.getPlayerCtrlBySeatId(Player.pos);
                let take = Player.take;
                let after = Player.after;
                if (CommonFun.getInstance().isValidForScr(vipPlayerCtrl)) {
                    vipPlayerCtrl.setUserCoinLabel(after);
                    if (take > 0) {
                        vipPlayerCtrl.showWinLabel(take);
                    }
                }
            }
        }
    },

    /**
     * 发金币
     * @param {Array} arr 
     */
    async sendOutCoin(arr, winArea) {
        return new Promise((resolve, reject) => {
            for (let i = 0; i < arr.length; i++) {
                let areaWidth = winArea.width - 40;
                let areaHeight = winArea.height - 60;
                let areaPos = winArea.getPosition();
                let worldAreaPos = winArea.parent.convertToWorldSpaceAR(areaPos);
                let nodeAreaPos = winArea.convertToNodeSpaceAR(worldAreaPos);
                let pos = cc.v2(nodeAreaPos.x - areaWidth / 2 + Math.random() * areaWidth, nodeAreaPos.y - areaHeight / 2 + Math.random() * areaHeight + 20);
                let worldToPos = winArea.parent.convertToWorldSpaceAR(pos);
                let nodeToPos = this.coinParentNode.convertToNodeSpaceAR(worldToPos);

                let coinNode = arr[i];
                cc.tween(coinNode)
                    .to(1, { position: nodeToPos }, { easing: 'quadInOut' })
                    .delay(0.5)
                    .call(() => {
                        resolve(true);
                    })
                    .start();
            }
        })

    },


    //******************************************************************************* */
    /**
     * 生成各个区域的金币，并返回存储金币节点数组
     * @returns [cc.Node]
     */
    creatCoin() {
        for (let i = 0; i < this.coinParentNode.children.length; i++) {
            let coin = this.coinParentNode.children[i];
            this.removeJbNode(coin);
        }
        let coinNodeList = [];
        let func = (betArea) => {
            let areaWidth = betArea.width - 40;
            let areaHeight = betArea.height - 60;
            let areaPos = betArea.getPosition();
            let worldAreaPos = betArea.parent.convertToWorldSpaceAR(areaPos);
            let nodeAreaPos = betArea.convertToNodeSpaceAR(worldAreaPos);
            let pos = cc.v2(nodeAreaPos.x - areaWidth / 2 + Math.random() * areaWidth, nodeAreaPos.y - areaHeight / 2 + Math.random() * areaHeight + 20);

            let worldToPos = betArea.parent.convertToWorldSpaceAR(pos);
            let nodeToPos = this.coinParentNode.convertToNodeSpaceAR(worldToPos);

            let coin = this.createJbNode();
            coin.setPosition(nodeToPos);
            this.coinParentNode.addChild(coin);
            coinNodeList.push(coin);
        };
        for (const key in this.btnBetButtons) {
            let betNode = this.btnBetButtons[key].node;
            for (let i = 0; i < 10; i++) {
                func(betNode);
            }
        }
        return coinNodeList;
    },

    /**
    * 移动金币去指定区域
    * @param {cc.Vec2} fromPos 
    * @param {cc.Node} betArea 下注区域节点
    * @param {cc.Node} fromNode 来自节点
    * @param {number} ani Team
    */
    moveCoinToBetArea(fromPos, betArea, fromNode, ani) {
        let areaNode = betArea.getChildByName('areaNode');
        let areaWidth = areaNode.width - 65;
        let areaHeight = areaNode.height - 65;
        let areaPos = areaNode.getPosition();
        let worldAreaPos = betArea.convertToWorldSpaceAR(areaPos);
        let nodeAreaPos = this.coinParentNode.convertToNodeSpaceAR(worldAreaPos);
        let toPos = cc.v2(nodeAreaPos.x - areaWidth / 2 + Math.random() * areaWidth, nodeAreaPos.y - areaHeight / 2 + Math.random() * areaHeight);

        let worldFromPos = fromNode.parent.convertToWorldSpaceAR(fromPos);
        let nodeFromPos = this.coinParentNode.convertToNodeSpaceAR(worldFromPos);

        let feijbNode = this.createJbNode();
        feijbNode.setPosition(nodeFromPos);
        this.coinParentNode.addChild(feijbNode);
        if (this.tableCoinsList[ani].length > 50) {
            let jbNode = this.tableCoinsList[ani].shift();
            this.removeJbNode(jbNode);
        }
        this.tableCoinsList[ani].push(feijbNode);
        cc.tween(feijbNode)
            .delay(Number((Math.random()/3).toFixed(2))) 
            .to(0.5, { position: toPos })
            .start();
    },

    initJbPool: function () {
        this.jbPool = new cc.NodePool();
        let initCount = 150;
        for (let i = 0; i < initCount; i++) {
            this.jbPool.put(cc.instantiate(this.pabfabCoin));    //放入对象池
        }
    },

    createJbNode: function () {
        let feijbNode = null;
        if (this.jbPool.size() > 0) {       //通过size接口判断对象池中是否有空闲的对象
            feijbNode = this.jbPool.get();
        } else {                          //对象池中的备用对象不够时，通过cc.instantiate 重新创建
            feijbNode = cc.instantiate(this.pabfabCoin);
        }
        return feijbNode;
    },

    removeJbNode: function (feijbNode) {
        if (feijbNode == null) {
            LoggerUtil.getInstance().error("将金币对象放回对象池中，金币对象为空！");
            return;
        }
        feijbNode.setPosition(0, 0);
        feijbNode.opacity = 255;
        this.jbPool.put(feijbNode);
    },

    /**
     * 获取VIP座位控制脚本
     * @param {*} seatId 座位ID
     * @return {seatCtrl}
     */
    getPlayerInfoByUserId(seatId) {
        let playerCtrl = null;
        playerCtrl = this.seatManager.getSeatNodeCtrlBySeatId(seatId);
        return playerCtrl
    },

});
