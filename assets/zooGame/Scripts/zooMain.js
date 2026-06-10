const zooAnimal = cc.Enum({
    Shark: 0, // 鲨鱼
    Monkey: 1, // 猴子
    Rabbit: 2, // 兔子
    Lion: 3, // 狮子
    Panda: 4, // 熊猫
    Swallow: 5, // 喜鹊
    Pigeon: 6, // 鸽子
    Peacock: 7, // 孔雀
    Eagle: 8, // 老鹰
    Beast: 9, // 走兽
    Bird: 10, // 飞禽
    // 以上是下注枚举, 以下包含额外开奖枚举
    GoldShark: 11, // 金鲨鱼
    AllKill: 12, // 全杀
    AllWin: 13 // 全赢
});
cc.Class({
    extends: cc.Component,

    properties: {
        btnBetMonkey: cc.Button,
        btnBetRabbit: cc.Button,
        btnBetPanda: cc.Button,
        btnBetLion: cc.Button,
        btnBetSwallow: cc.Button,
        btnBetPigeon: cc.Button,
        btnBetPeacock: cc.Button,
        btnBetEagle: cc.Button,
        btnBetBeast: cc.Button,
        btnBetBird: cc.Button,
        btnBetShark: cc.Button,
        btnOpenMenu: cc.Button,

        labTotalBet: cc.Label,

        selfPlayerNode: cc.Node,
        betButtonsNode: cc.Node,
        recordNode: cc.Node,        // 历史记录
        playerSeatNode: cc.Node,    // 玩家座位
        rouletteNode: cc.Node,      // 转盘节点
        coinParentNode: cc.Node,    // 金币父节点

        pabfabCoin: cc.Prefab,
        prefabPlayerList: cc.Prefab,
        resultNode: cc.Prefab,

        btnAllWj: cc.Button,
        btnAddCash: cc.Button,
        endAnimationNode: cc.Node,                  // 结束动画
        spineSkeletonData: [sp.SkeletonData],       // spine动画数据, 0 是Animal 1-8，1是鲨鱼，2是通吃，3是通赔
        betStartEndAnimationNode: cc.Node,          // 开始结束动画节点
        startEndSkeletonData: [sp.SkeletonData],
        vipSpriteAtlas: cc.SpriteAtlas,
        btnRepeat: cc.Button,

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
    },

    ctor() {
        this._isInHide = false;
        this.betDuration = 0;   // 下注时长
        this.calcDuration = 0;  // 结算时长
        this.betPoolsLabel = {};     // 下注池,存放cc.Label
        this.selfBetPoolsLabel = {};     // 自己下注池,存放cc.Label
        this.gameEndServerMsg = null;         // 游戏结束消息        
        this.preRoundBetData = [];         // 上一局下注数据
        this.curRoundBetData = [];          // 当局下注数据
        this.gameState = null;          // 游戏状态, 0 下注中，1转动+结算
    },

    onLoad: function() {
        CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.SHOW_ZOO_GAME);

        GlobalCfg.ACT_SCENE_CTRL = this;
        this.serverMsgManager = this.node.getComponent("zooServerMsgManager");
        this.zooCurBetCtrl = this.betButtonsNode.getComponent('zooCurBetCtrl');
        this.zooRecordCtrl = this.recordNode.getComponent('zooRecord');
        this.zooSeatManager = this.playerSeatNode.getComponent('zooSeatManager');
        this.zooRouletteManager = this.rouletteNode.getComponent('zooRouletteManager');
        this.zooAudioManager = this.node.getComponent('zooAudioManager');
        this.zooAudioManager.inite();

        this.btnBetButtons = {
            0: this.btnBetShark,        // 鲨鱼
            1: this.btnBetMonkey,       // 猴子
            2: this.btnBetRabbit,       // 兔子
            3: this.btnBetLion,         // 狮子
            4: this.btnBetPanda,        // 熊猫
            5: this.btnBetSwallow,      // 喜鹊
            6: this.btnBetPigeon,       // 鸽子
            7: this.btnBetPeacock,      // 孔雀
            8: this.btnBetEagle,        // 老鹰
            9: this.btnBetBeast,         // 走兽
            10: this.btnBetBird,       // 飞禽
        };
        for (const key in this.btnBetButtons) {
            const btn = this.btnBetButtons[key];
            btn.node.on('click', CommonFun.getInstance().debounce(() => {
                LoggerUtil.getInstance().log('点击了', key, zooAnimal[key], typeof key);
                this.btnBetClick(Number(key));
            }, 0), this);
        }

        this.labBetMonkey = this.btnBetMonkey.node.parent.getChildByName('lab').getComponent(cc.Label);
        this.labBetRabbit = this.btnBetRabbit.node.parent.getChildByName('lab').getComponent(cc.Label);
        this.labBetPanda = this.btnBetPanda.node.parent.getChildByName('lab').getComponent(cc.Label);
        this.labBetLion = this.btnBetLion.node.parent.getChildByName('lab').getComponent(cc.Label);
        this.labBetSwallow = this.btnBetSwallow.node.parent.getChildByName('lab').getComponent(cc.Label);
        this.labBetPigeon = this.btnBetPigeon.node.parent.getChildByName('lab').getComponent(cc.Label);
        this.labBetPeacock = this.btnBetPeacock.node.parent.getChildByName('lab').getComponent(cc.Label);
        this.labBetEagle = this.btnBetEagle.node.parent.getChildByName('lab').getComponent(cc.Label);
        this.labBetBeast = this.btnBetBeast.node.parent.getChildByName('lab').getComponent(cc.Label);
        this.labBetBird = this.btnBetBird.node.parent.getChildByName('lab').getComponent(cc.Label);
        this.labBetShark = this.btnBetShark.node.parent.getChildByName('lab').getComponent(cc.Label);
        this.betPoolsLabel = {
            0: this.labBetShark,        // 鲨鱼
            1: this.labBetMonkey,       // 猴子
            2: this.labBetRabbit,       // 兔子
            3: this.labBetLion,         // 狮子
            4: this.labBetPanda,        // 熊猫
            5: this.labBetSwallow,      // 喜鹊
            6: this.labBetPigeon,       // 鸽子
            7: this.labBetPeacock,      // 孔雀
            8: this.labBetEagle,        // 老鹰
            9: this.labBetBeast,         // 走兽
            10: this.labBetBird,       // 飞禽
        };
        this.labSelfBetMonkey = this.btnBetMonkey.node.parent.getChildByName('labSelf').getComponent(cc.Label);
        this.labSelfBetRabbit = this.btnBetRabbit.node.parent.getChildByName('labSelf').getComponent(cc.Label);
        this.labSelfBetLion = this.btnBetLion.node.parent.getChildByName('labSelf').getComponent(cc.Label);
        this.labSelfBetPanda = this.btnBetPanda.node.parent.getChildByName('labSelf').getComponent(cc.Label);
        this.labSelfBetSwallow = this.btnBetSwallow.node.parent.getChildByName('labSelf').getComponent(cc.Label);
        this.labSelfBetPigeon = this.btnBetPigeon.node.parent.getChildByName('labSelf').getComponent(cc.Label);
        this.labSelfBetPeacock = this.btnBetPeacock.node.parent.getChildByName('labSelf').getComponent(cc.Label);
        this.labSelfBetEagle = this.btnBetEagle.node.parent.getChildByName('labSelf').getComponent(cc.Label);
        this.labSelfBetBeast = this.btnBetBeast.node.parent.getChildByName('labSelf').getComponent(cc.Label);
        this.labSelfBetBird = this.btnBetBird.node.parent.getChildByName('labSelf').getComponent(cc.Label);
        this.labSelfBetShark = this.btnBetShark.node.parent.getChildByName('labSelf').getComponent(cc.Label);
        this.selfBetPoolsLabel = {
            0: this.labSelfBetShark,        // 鲨鱼
            1: this.labSelfBetMonkey,       // 猴子
            2: this.labSelfBetRabbit,       // 兔子
            3: this.labSelfBetLion,         // 狮子
            4: this.labSelfBetPanda,        // 熊猫
            5: this.labSelfBetSwallow,      // 喜鹊
            6: this.labSelfBetPigeon,       // 鸽子
            7: this.labSelfBetPeacock,      // 孔雀
            8: this.labSelfBetEagle,        // 老鹰
            9: this.labSelfBetBeast,         // 走兽
            10: this.labSelfBetBird,       // 飞禽
        };
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

        this.initJbPool();

        this.endAnimationNode.active = false;
        this.betStartEndAnimationNode.active = false;
        this.labelStartNode = this.betStartEndAnimationNode.getChildByName('label_start');
        this.labelStopNode = this.betStartEndAnimationNode.getChildByName('label_stop');
        this.setBetStateLabelVisible(false, false);
        this.btnAddCash.node.active = GlobalCfg.USER_DATAS.openModules.includes(4);

        this.msgHandle = ClientNotify.register(GlobalCfg.MSG_TYPE.serverMsg, this.onEventMsg, this);
        this.customMsgHandle = ClientNotify.register(GlobalCfg.MSG_TYPE.clientMsg, this.onCustomEventMsg, this);
    },

    start() {
        this.serverMsgManager.sendLoginMsg();
        this.zooAudioManager.playGameMusic('zooBgMusic');
        this.eventHide = () => {
            LoggerUtil.getInstance().log("ZooGame: 切入到后台", this);
            if (this.isValid) {
                this.isInHide = true;
                this.zooRouletteManager.stopRotate();
                this.unscheduleAll();
            } else {
                this.destroy();
            }
        }
        cc.game.on(cc.game.EVENT_HIDE, this.eventHide);
        this.eventShow = () => {
            LoggerUtil.getInstance().log("ZooGame: 切入到前台", this);
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
        CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.EXIT_ZOO_GAME);
    },

    unscheduleAll() {
        this.unschedule(this.scheduleUpdateEndCoinCallback);
        this.unschedule(this.scheduleTime1Callback);
        this.unschedule(this.scheduleTime2Callback);
        this.unschedule(this.scheduleTimeCallback);
    },

    btnBetClick(ani) {
        if (GlobalCfg.USER_DATAS.isNotCharge == true && GlobalCfg.USER_DATAS.gamePattern == 0 && GlobalCfg.USER_DATAS.refuseUnpayHundred["minizoo"]== true) { //未曾充值
            CommonFun.getInstance().showMsgBox(commonTipsLanguage.premiumPlayersOnly[language], "SHOP", () => {
                CommonFun.getInstance().showSmallAddCash()
            }, false);
            return
        } 
        this.serverMsgManager.sendBetMsg([{ ani: ani, amount: this.zooCurBetCtrl.curBetNum }]);
    },

    btnClick(button) {
        let name = button.node.name;
        GlobalCfg.G_COMPONENTS.Audio.playButton();
        if (name == this.btnAllWj.node.name) {
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
        else if (name == 'btnOpenMenu') {
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
            self.dealLoginData(notify);
        }
        else if (msgId == 'gameservice.loadwhole') {
            // 刷新游戏场景
            LoggerUtil.getInstance().log("刷新游戏场景>>>>", notify);
            self.dealLoginData(notify);
        }
        else if (msgId == 'gameservice.exit') {
            // 退出游戏通知
            self.unscheduleAll();
            self.zooRouletteManager.unscheduleAll();
            SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.ZOO, SceneManager.getInstance().sceneType.LOBBY);
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
                let isShowAction = false;
                for (let i = 0; i < betPool.length; i++) {
                    const element = betPool[i];
                    if (Reflect.has(self.betPoolsLabel, i) == true) {
                        let amount = Number(self.betPoolsLabel[i].string) * 100;
                        if (element > amount) {
                            self.dealBetInfo(i, null, self.btnAllWj.node);
                            isShowAction = true;
                        }
                    }
                }
                if(isShowAction == true){
                    let pos = self.btnAllWj.node.getPosition();
                    cc.tween(self.btnAllWj.node)
                        .to(0.1, { position: cc.v2(pos.x, 20) })
                        .to(0.1, { position: cc.v2(pos.x, 0)  })
                        .start();
                }
                self.zooAudioManager.playGameSound('otherCoin');
                self.dealTableBetPoolData(betPool, false);
            }
        }
        else if (msgId == 'gameservice.startbettingnotify') {
            // 开始下注阶段通知
            LoggerUtil.getInstance().log("开始下注阶段通知>>>>", notify);
            self.zooAudioManager.playGameMusic('zooBgMusic');
            self.gameState = 0;
            if(notify){
                let diamond = notify.diamond;
                GlobalCfg.USER_DATAS.userDiamond = diamond;
            }
            self.updateSelfCoin();
            self.timeSound();
            self.dealStartEndBet(true);
            if (self.preRoundBetData.length > 0) {
                self.btnRepeat.interactable = true;
            } else {
                self.btnRepeat.interactable = false;
            }

        }
        else if (msgId == 'gameservice.startflynotify') {
            // 开始转动阶段通知, 结束
            self.zooAudioManager.pauseMusic();
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
                self.zooRouletteManager.startRotate(targetNum);
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
        //     self.unscheduleAll();
        //     self.zooRouletteManager.unscheduleAll();
        //     SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.ZOO, SceneManager.getInstance().sceneType.LOBBY);
        // }
    },

    onCustomEventMsg(webData, target) {
        let self = target;
        var msgId = webData.msgCode;
        var notify = webData.msgData;
        if (self.isInHide == true) {
            LoggerUtil.getInstance().log('当前处于后台！！');
            return;
        }
        if (msgId == "GAME_ZOO_ROULETTEE_END") {
            LoggerUtil.getInstance().warn("轮盘转动结束", notify, self.gameEndServerMsg);
            LoggerUtil.getInstance().timeEnd('GAME_ZOO_ROULETTEE_END');
            if (!self.gameEndServerMsg) {
                return
            }
            self.zooAudioManager.playGameSound('showAnimal');
            // 轮盘转动结束
            /**
             * 更新历史记录，播放动效
             * 回收金币、散金币、发放到个人，飘加钱数值
             *
             */
            let ani = self.gameEndServerMsg.ani;
            let endNode = notify.endNode;
            let pos1 = endNode.getPosition();
            // 游戏结束，生成节点至历史记录位置
            let node = cc.instantiate(self.resultNode);
            node.getComponent('zooResultNodeCtrl').setSpriteFrame(ani);
            node.setPosition(pos1);
            node.parent = self.zooRouletteManager.node.parent;
            let pos = self.zooRecordCtrl.getEndNodePos();
            let worldPos = self.zooRecordCtrl.nodeList.convertToWorldSpaceAR(pos);
            let nodePos = self.zooRouletteManager.node.parent.convertToNodeSpaceAR(worldPos);
            cc.tween(node)
                .to(1, { scale: 1, position: nodePos }, { easing: 'quadInOut' })
                .call(() => {
                    self.zooRecordCtrl.updateRecord(ani);
                    self.playEndAnimation(ani, self.gameEndServerMsg);
                    node.destroy();
                })
                .start();

            self.dealGameFinishData(self.gameEndServerMsg);


        }
        else if (msgId == "GAME_ZOO_GIFT_SEND_COIN_UPDATE") {
            // 自己发送表情，更新金币值
            self.updateSelfCoin();
        }
        else if (msgId == GlobalCfg.CLIENT_MSG_ID.GAME_MENU_CLICK_OUT_TO_LOBBY) {
            self.serverMsgManager.sendExitMsg();
        }
        else if (msgId == GlobalCfg.CLIENT_MSG_ID.GAME_MENU_CLICK_HOW_TO_PLAY) {
            CommonFun.getInstance().showRule("zoo");
        }
        else if (msgId == "lobbyservice.kicktolobby") {
            SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.ZOO, SceneManager.getInstance().sceneType.LOBBY);
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
                msgCode: "GAME_ZOO_SEAT_JOINVIP_ERROR",
                msgData: { result: result }
            });
        }
        else if (msgId === "gameservice.login") {
            CommonFun.getInstance().showMsgBox(result.message, "YES", () => {
                SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.ZOO, SceneManager.getInstance().sceneType.LOBBY);
            }, false);
        }
        else if (msgId == "gameservice.bet") {
            if (CommonFun.getInstance().isFreePlayerDirectedToFreeTP()) {
                if (result.result == 57) {
                    CommonFun.getInstance().showDiversionFreeTP(() => {
                        GameServerManager.send("gameservice.exit", "ExitReq", {});
                        // SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.ZOO, SceneManager.getInstance().sceneType.LOBBY);
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
            CommonFun.getInstance().showTips(msg);
        };
    },

    
    shortmessagenotify: function(notify) {
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
            let senderCtrl = this.zooSeatManager.getPlayerCtrlBySeatId(sender);
            if (!senderCtrl || !senderCtrl.node) {
                return;
            }else{
                senderCtrl.setUserCoinLabel(senderAfter);
            }

            if (target == -1) {
                for (let i = 0; i < this.zooSeatManager.seatNodeList.length; i++) {
                    let seatNode = this.zooSeatManager.seatNodeList[i];
                    let seatNodeCtrl = seatNode.getComponent('zooSeatCtrl');
                    if (seatNodeCtrl.isSelf == false && seatNodeCtrl.node.childrenCount > 0) {
                        targetNodeArr.push(seatNode);
                    };
                };
            }
            else {
                let playersCtrl = this.zooSeatManager.getPlayerCtrlBySeatId(target);
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
    setBetStateLabelVisible(showStart, showStop) {
        if (this.labelStartNode) {
            this.labelStartNode.active = !!showStart;
        }
        if (this.labelStopNode) {
            this.labelStopNode.active = !!showStop;
        }
    },

    dealStartEndBet(bool) {
        this.zooRouletteManager.offEndNodeLight();
        this.betStartEndAnimationNode.active = true;
        let spine = this.betStartEndAnimationNode.getComponent(sp.Skeleton);
        if (bool) {
            this.setBetStateLabelVisible(true, false);
            this.zooAudioManager.playGameSound('time1');
            spine.skeletonData = this.startEndSkeletonData[1];
            let arr = new Array(11).fill(0, 0, 11);
            this.dealTableBetPoolData(arr, false);
            this.dealTableBetPoolData(arr, true);
            for (let i = 0; i < this.coinParentNode.children.length; i++) {
                let coinNode = this.coinParentNode.children[i];
                if (coinNode && coinNode.isValid) {
                    this.removeJbNode(coinNode);
                }
            }
        } else {
            this.setBetStateLabelVisible(false, true);
            this.zooAudioManager.playGameSound('Sotpbeting');
            spine.skeletonData = this.startEndSkeletonData[0];
        }
        spine.setAnimation(0, "animation", false);
        spine.setCompleteListener(() => {
            this.setBetStateLabelVisible(false, false);
            this.betStartEndAnimationNode.active = false;
        });
    },

    /**
     * 登录
     * @param {*} notify 
     */
    dealLoginData(notify) {
        this.zooRouletteManager.stopRotate();
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
        this.zooCurBetCtrl.initBetNum(chips);
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
        LoggerUtil.getInstance().warn("当前状态剩余时间", currentStatusLeftMs + "ms", currentStatusLeftMs / 1000 + "s");
        let openInfo = sceneInfo.openInfo;                          // 延时开奖信息
        let betPool = sceneInfo.betPool;                            // 下注池 Array
        this.dealTableBetPoolData(betPool, false);
        let openRecord = sceneInfo.openRecord;                      // 开奖记录
        this.zooRecordCtrl.initItem(openRecord);
        let vips = sceneInfo.vip;
        this.zooSeatManager.initAllPlayer(vips);
        this.gameState = status;
        switch (status) {
            case 0:     // 下注状态
                LoggerUtil.getInstance().warn('下注状态');
                this.timeSound(currentStatusLeftMs);
                break;
            case 1:     // 转动中
                LoggerUtil.getInstance().warn('转动中');
                let targetNum = openInfo.ani;
                this.zooRouletteManager.startRotate(targetNum, currentStatusLeftMs);
                this.gameEndServerMsg = openInfo;
                break;
            case 2:     // 结算中
                LoggerUtil.getInstance().warn('结算中');
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
                this.scheduleTime2Callback = () => {
                    count--;
                    if (count <= 3 && count > 0) {
                        this.zooAudioManager.playGameSound('time3-2');
                    }
                };
                this.scheduleTime1Callback = () => {
                    this.schedule(this.scheduleTime2Callback, 1, count - 1);
                }
                this.scheduleOnce(this.scheduleTime1Callback, time_S_1);

            }

        } else {
            let count = 10;
            this.scheduleTimeCallback = () => {
                count--;
                if (count <= 3 && count > 0) {
                    this.zooAudioManager.playGameSound('time3-2');
                }
            };
            this.schedule(this.scheduleTimeCallback, 1, 9);
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
        this.vipSprite.spriteFrame = this.vipSpriteAtlas.getSpriteFrame(`${vipLevel}`);
        this.selfPlayerNode.getChildByName('userName').getComponent(cc.Label).string = CommonFun.getInstance().getStrByLength(GlobalCfg.USER_DATAS.userName, 8);
        this.updateSelfCoin();
        let tx = cc.find('txk/mask/tx', this.selfPlayerNode);
        this.loadHeadSp(GlobalCfg.USER_DATAS.userHeadimgurl, 80, tx.getComponent(cc.Sprite));
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
     * @param {Array} betPools 稀疏数组, 数组下标为动物类型
     * @param {boolean} isSelfBet 是否是自己下注
     */
    dealTableBetPoolData(betPools, isSelfBet = false) {
        for (let i = 0; i < betPools.length; i++) {
            const element = betPools[i];
            if (Reflect.has(this.betPoolsLabel, i) == true) {
                if (isSelfBet) {
                    this.selfBetPoolsLabel[i].string = Number(element) / 100;
                } else {
                    this.betPoolsLabel[i].string = Number(element) / 100;
                }
            }
        }
        if (isSelfBet == false) {
            this.setTotalBetNum(betPools);
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
            this.zooAudioManager.playGameSound('mytouCoin');
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
                let playerCtrl = this.zooSeatManager.getPlayerCtrlBySeatId(pos);
                playerCtrl.setUserCoinLabel(after);
            }
        } else {
            this.zooAudioManager.playGameSound('otherCoin');
            let playerNode = this.zooSeatManager.getPlayerBySeatId(pos);
            let seatNode = this.zooSeatManager.getSeatNodeBySeatId(pos);
            if (playerNode) {
                let playerCtrl = playerNode.getComponent("zooPlayerCtrl");
                playerCtrl.setUserCoinLabel(after);
            }
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
        let btnAreaNode = this.btnBetButtons[ani].node.parent;
        let selfBetLab = btnAreaNode.getChildByName('labSelf');
        if (selfBetLab) {
            cc.tween(selfBetLab)
                .to(0.1, { scale: 1.2 })
                .to(0.1, { scale: 1 })
                .start();
        }
    },

    /**
     * 
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
     */
    dealBetInfo(ani, num, betNode) {
        let pos = betNode.getPosition();
        let betArea = this.btnBetButtons[ani].node;
        let count = 3;          // 每次下注个数
        for (let i = 0; i < count; i++) {
            this.moveCoinToBetArea(pos, betArea, betNode);
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
            let nodeCtrl = node.getComponent('zooPlayerList');
            if (nodeCtrl) {
                nodeCtrl.setPlayerData(notify);
            }
        } else {
            let nodePlayerList = cc.instantiate(this.prefabPlayerList);
            let nodeCtrl = nodePlayerList.getComponent('zooPlayerList');
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
        let otherTake = notify.otherTake;       // 非VIP输赢
        let self = notify.self;           // 自己
        let vips = notify.vips;         // VIP 玩家输赢
        let ani = notify.ani;           // 中奖位置
        this.dealGameEndCoin(notify);
    },

    /**
     * 播放结束动画
     * @param {Number} ani zooAnimal
     */
    playEndAnimation(ani, notify) {

        let spine = this.endAnimationNode.getChildByName('spine').getComponent(sp.Skeleton);
        this.endAnimationNode.active = true;
        let spSkData = null;
        let animationName = null;
        if (ani == zooAnimal.Shark) {
            spSkData = this.spineSkeletonData[1];
            animationName = 'animation';
        } else if (ani == zooAnimal.AllKill) {
            spSkData = this.spineSkeletonData[2];
            animationName = 'animation';
        } else if (ani == zooAnimal.AllWin) {
            spSkData = this.spineSkeletonData[3];
            animationName = 'animation';
        } else if (ani == zooAnimal.GoldShark) {
            spSkData = this.spineSkeletonData[4];
            animationName = 'animation';
        } else {
            spSkData = this.spineSkeletonData[0];
            animationName = zooAnimal[ani];
        }
        spine.skeletonData = spSkData;
        spine.setAnimation(0, animationName, false);
        spine.setCompleteListener(() => {
            LoggerUtil.getInstance().warn('动画播放一次循环结束后的事件监听');
            this.endAnimationNode.active = false;
            this.scheduleUpdateEndCoinCallback = () => {
                if(!notify){
                    return
                }
                let selfInfo = notify.self;
                this.selfSettlement(selfInfo);
                this.updateGameEndPlayersCoin(notify);
            };
            this.scheduleOnce(this.scheduleUpdateEndCoinCallback, 0.5);
        });
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

    curRoundAddCoinFinish() {
        if (cc.isValid(this)) {
            let minLimit = this.zooCurBetCtrl.betNumList[0] || 0;
            CommonFun.getInstance().gameShowSecondRecharge(minLimit, this.curRoundBet);
            CommonFun.getInstance().showWithdrawToastInGame();
        }
    },

    /**
     * 处理游戏结束金币动画
     * @param {OpenInfo} notify 
     */
    async dealGameEndCoin(notify) {
        let ani = notify.ani;
        let arr = this.creatCoin();
        if (ani == zooAnimal.AllWin) {
            LoggerUtil.getInstance().time('全赢收金币');
            await this.collectCoin(arr, false)
            LoggerUtil.getInstance().timeEnd('全赢收金币');
            this.sendCoinToWiner(arr, notify);
        } else if (ani == zooAnimal.AllKill) {
            LoggerUtil.getInstance().time('全输收金币');
            await this.collectCoin(arr, true)
            LoggerUtil.getInstance().timeEnd('全输收金币');
        } else if (ani == zooAnimal.Shark || ani == zooAnimal.GoldShark) {
            await this.collectCoin(arr, false)
            let node = this.btnBetButtons[0].node;
            Promise.all([
                this.sendOutCoin(arr, node)
            ]).then(() => {
                LoggerUtil.getInstance().log('>>>>>>>>>发放到获胜区域完毕', ani, zooAnimal[ani]);
            }).catch((err) => {
                LoggerUtil.getInstance().error(err);
            });

            this.sendCoinToWiner(arr, notify);
        } else if (ani == zooAnimal.Lion || ani == zooAnimal.Panda || ani == zooAnimal.Rabbit || ani == zooAnimal.Monkey) {
            await this.collectCoin(arr, false)
            let length = arr.length;
            let arr1 = arr.slice(0, Math.floor(length / 2));
            let arr2 = arr.slice(Math.floor(length / 2), length);
            Promise.all([
                this.sendOutCoin(arr1, this.btnBetButtons[ani].node),
                this.sendOutCoin(arr2, this.btnBetBeast.node)
            ]).then(() => {
                LoggerUtil.getInstance().warn('>>>>>>>>>发放到获胜区域完毕', ani, zooAnimal[ani]);
                this.sendCoinToWiner(arr, notify);
            }).catch((err) => {
                LoggerUtil.getInstance().error(err);
            });
        } else if (ani == zooAnimal.Swallow || ani == zooAnimal.Pigeon || ani == zooAnimal.Peacock || ani == zooAnimal.Eagle) {
            await this.collectCoin(arr, false)
            let length = arr.length;
            let arr1 = arr.slice(0, Math.floor(length / 2));
            let arr2 = arr.slice(Math.floor(length / 2), length);
            Promise.all([
                this.sendOutCoin(arr1, this.btnBetButtons[ani].node),
                this.sendOutCoin(arr2, this.btnBetBird.node)
            ]).then(() => {
                LoggerUtil.getInstance().log('>>>>>>>>>发放到获胜区域完毕', ani, zooAnimal[ani]);
                this.sendCoinToWiner(arr, notify);
            }).catch((err) => {
                LoggerUtil.getInstance().error(err);
            });


        }
    },

    /**
     * 发金币到赢家
     */
    sendCoinToWiner(arr, notify) {
        LoggerUtil.getInstance().warn('发金币到赢家>>>>>');
        this.zooAudioManager.playGameSound("jbrecover", false);
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
                func(coinNode, this.selfPlayerNode, 0.45);
            }
        }
        // VIP 座位有人赢 
        if (vips.length > 0) {
            for (let i = 0; i < vips.length; i++) {
                let Player = vips[i];
                let playerSeatNode = this.zooSeatManager.getSeatNodeBySeatId(Player.pos);
                if (Player.take > 0) {
                    let arr1 = arr.splice(-5, 5);
                    for (let j = 0; j < arr1.length; j++) {
                        let coinNode = arr1[j];
                        func(coinNode, playerSeatNode, 0.55);
                    }
                }
            }
        }
        for (let i = 0; i < arr.length; i++) {
            let coinNode = arr[i];
            func(coinNode, this.btnAllWj.node, 0.55, false);
            if (i == arr.length - 1) {
                func(coinNode, this.btnAllWj.node, 0.55, true);
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
            winLabel.string = "+" + Math.round(selfWin / 100);
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
                let vipPlayerCtrl = this.zooSeatManager.getPlayerCtrlBySeatId(Player.pos);
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
     * 收金币
     * @param {boolean} remove 是否回收至对象池
     */
    async collectCoin(arr, remove) {
        return new Promise((resolve, reject) => {
            for (let i = 0; i < arr.length; i++) {
                let coinNode = arr[i];
                cc.tween(coinNode)
                    .to(1, { position: cc.v2(0, 0) }, { easing: 'quadInOut' })
                    .delay(0.5)
                    .call(() => {
                        if (remove) {
                            this.removeJbNode(coinNode);
                        }
                        resolve(true);
                    })
                    .start();
            }
        })
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
     */
    moveCoinToBetArea(fromPos, betArea, fromNode) {
        let areaWidth = betArea.width - 40;
        let areaHeight = betArea.height - 60;
        let areaPos = betArea.getPosition();
        let worldAreaPos = betArea.parent.convertToWorldSpaceAR(areaPos);
        let nodeAreaPos = betArea.convertToNodeSpaceAR(worldAreaPos);
        let toPos = cc.v2(nodeAreaPos.x - areaWidth / 2 + Math.random() * areaWidth, nodeAreaPos.y - areaHeight / 2 + Math.random() * areaHeight + 20);

        let worldFromPos = fromNode.parent.convertToWorldSpaceAR(fromPos);
        let worldToPos = betArea.parent.convertToWorldSpaceAR(toPos);

        let nodeFromPos = this.coinParentNode.convertToNodeSpaceAR(worldFromPos);
        let nodeToPos = this.coinParentNode.convertToNodeSpaceAR(worldToPos);

        let feijbNode = this.createJbNode();
        feijbNode.setPosition(nodeFromPos);
        this.coinParentNode.addChild(feijbNode);
        cc.tween(feijbNode)
            .delay(Number((Math.random()/3).toFixed(2))) 
            .to(0.5, { position: nodeToPos })
            .to(0.2, { opacity: 0 })
            .call(() => {
                this.removeJbNode(feijbNode);
            })
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
     * @return {zooSeatCtrl}
     */
    getPlayerInfoByUserId(seatId) {
        let playerCtrl = null;
        playerCtrl = this.zooSeatManager.getSeatNodeCtrlBySeatId(seatId);
        return playerCtrl
    },

});
