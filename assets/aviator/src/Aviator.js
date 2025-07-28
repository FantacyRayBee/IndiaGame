
cc.Class({
    extends: cc.Component,

    properties: {
        // default
        btnBack: cc.Button,
        btnPlayerList: cc.Button,
        nodeBtnBetSelect: cc.Node,
        btnReBet: cc.Button,
        btnBetList: [cc.Button],
        selfPlayer: cc.Node,
        nodeTrendParent: cc.Node,
        btnTrend: cc.Button,
        btnBottomTrend: cc.Button,
        background: cc.Node,
        btnSetting: cc.Button,

        // waitLayer
        timerBar: cc.ProgressBar,

        // during Game
        horizontalLine: cc.Node,
        variableLine: cc.Node,
        graphicsDrawLine: cc.Graphics,
        centerRateNode: cc.Node,
        flyRocketNode: cc.Node,
        unGetDownNode: cc.Node,
        getDownNode: cc.Node,
        playerGetOutParent: cc.Node,
        node_autoSetting: cc.Node,

        node_betinfo1: cc.Node,
        node_betinfo2: cc.Node,

        // Prefabs
        pabfabCoin: cc.Prefab,
        prefabRecord: cc.Prefab,
        prefabTimeMark: cc.Prefab,
        prefabRateMark: cc.Prefab,
        prefabTrendItem: cc.Prefab,
        prefabPlayerList: cc.Prefab,
        prefabPlayerGetOut: cc.Prefab,
        prefabSetting: cc.Prefab,

        region: cc.Node,      // 红色区域图片节点
        lights: [cc.Node],      
    },

    ctor() {
        // Config
        this.isHide = false;                                // 是否后台隐藏
        this.btnBetCoinNum = [10, 50, 200, 500, 1000];      // 配置下注按钮数值
        this.curSingleNote = this.btnBetCoinNum[0];             // 当前单注数值
        this.betDuration = 15000;                              // 下注持续时间 ms
        this.calcDuration = 3000;                              // 爆炸后结算时长 ms

        this.rocketMessageManager = null;      // 存放消息的管理器
        this.isDuringBet = false;           // 是否在下注

        this.isFlying = false;                  // 是否在飞行
        this.isMoveTimeMark = false;            // 是否移动时间标记
        this.isMoveRateMark = false;            // 是否移动比率标记
        this.lineTimeMarkOffsetX = 1000;         // 时间线标记偏移量
        this.lineRateMarkOffsetY = 125;         // 比率线标记偏移量

        this.timeMarkNodeArray = [];           // 存放时间线标记的节点数组
        this.rateMarkNodeArray = [];           // 存放比率线标记的节点数组
        this.rectTrendNodeArray = [];          // 存放矩形走势的节点数组

        this.pointRecordDataList = [];          // 存放点记录的数组

        this.drawLine = false;                  // 是否绘制线
        this.constStartPosX = -540;               // 走势起点X坐标
        this.constStartPosY = -198;               // 走势起点Y坐标
        this.drawPosX = -540;                    // 绘制线起点X坐标
        this.duringFlyTime = 0;                    // 存放当前飞行时长
        this.startFlyLineColor = new cc.Color(174, 36, 72, 255);
        // this.startFlyLineColor = cc.Color(255, 0, 0, 255);
        this.endFlyLineColor = new cc.Color(220, 96, 6, 255);

        this.endFlyPos = cc.v2(755, 270);              // 游戏结束时 飞机终点位置

        this.numSelfBet = 0;                        // 存放当前玩家下注数
        this.numAllBet = 0;                         // 存放所有玩家下注数
        this.preRoundBetNum = 0;                      // 存放上一轮下注数
        this.showBetSpineTimeInterval = 15;      // 显示下注动画的时间间隔
        this.showBetSpineTime = 0;
        this.trendMaxNum = 12;                     // 走势图最大显示点数
    },

    onLoad: function() {
        CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.SHOW_CRASH_GAME);

        GlobalCfg.ACT_SCENE_CTRL = this;
        this.rocketMessageManager = this.node.getComponent('RocketMessageManager');
        this.rocketMessageManager.sendLoginMessage();
        this.rocketAudioManager = this.node.getComponent('RocketAudioManager');
        CommonFun.getInstance().showProgress();

        this.msgHandle = ClientNotify.register(GlobalCfg.MSG_TYPE.serverMsg, this.onEventMsg, this);
        this.customMsgHandle = ClientNotify.register(GlobalCfg.MSG_TYPE.clientMsg, this.onEventMsg, this);

    },

    onDestroy() {
        GlobalCfg.ACT_SCENE_CTRL = null;
        this.unschedule(this.scheduleBetSpineTimeCallback);
        ClientNotify.removeByHandle(GlobalCfg.MSG_TYPE.serverMsg, this.msgHandle);
        ClientNotify.removeByHandle(GlobalCfg.MSG_TYPE.clientMsg, this.customMsgHandle);
        CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.EXIT_CRASH_GAME);
    },

    start() {
        cc.game.on(cc.game.EVENT_HIDE, () => {
            LoggerUtil.getInstance().log("Rocket 进入后台");
            this.isHide = true;
            this.unscheduleAll();
            this.rocketAudioManager.pauseMusic();
            this.setDefaultValueOfVariables();
        }, this);
        cc.game.on(cc.game.EVENT_SHOW, () => {
            LoggerUtil.getInstance().log("重新返回Rocket");
            this.isHide = false;
            this.rocketMessageManager.sendRefreshMessage();
        }, this);
        this.initialization();
        LoggerUtil.getInstance().warn("当前游戏帧率", cc.game.getFrameRate());
    },

    /**
     * 初始化变量
     */
    setDefaultValueOfVariables() {
        this.isDuringBet = false;
        this.isFlying = false;
        this.isMoveTimeMark = false;
        this.isMoveRateMark = false;
        this.numSelfBet = 0;
        this.numAllBet = 0;
    },

    unscheduleAll() {
        this.unschedule(this.scheduleWaitBetCallback);
    },


    initialization() {
        this.initLineMark(this.horizontalLine, "time");
        this.initLineMark(this.variableLine, "rate");
        this.defaultLayer = this.node.getChildByName('defaultLayer');
        this.waitLayer = this.node.getChildByName('waitLayer');
        this.duringLayer = this.node.getChildByName('during');
        this.popupLayer = this.node.getChildByName('popupLayer');       // 弹窗层

        this.duringLayer.active = false;
        this.waitLayer.active = false;
        this.popupLayer.active = false;
        this.popupLayer.on(cc.Node.EventType.TOUCH_START, () => {
            GlobalCfg.G_COMPONENTS.Audio.playButton();
            this.popupLayer.destroyAllChildren();
            this.popupLayer.active = false;
        }, this);

        this.setBetLabelInfo();

        this.btnCashout = this.unGetDownNode.getChildByName('btn_cashout').getComponent(cc.Button);
        this.btnCashout.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
        this.btnBack.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
        this.btnSetting.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
        this.btnPlayerList.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
        this.btnTrend.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
        this.btnBottomTrend.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
        this.btnReBet.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
        this.btnReBet.interactable = false;
    },

    /**
     * 初始化线标记
     * @param {cc.Node} directionLineNode 刻度父节点
     * @param {String} type time ， rate
     * @returns 
     */
    initLineMark(directionLineNode, type) {
        directionLineNode.removeAllChildren();
        let func = (count, prefabAsset, originX, originY, type, parentNode, nodeArray) => {
            nodeArray.length = 0;
            for (let i = 0; i < count; i++) {
                let node = cc.instantiate(prefabAsset);
                if (type == "time") {
                    node.setPosition(cc.v2(originX + 200 * i, originY));
                    node.getChildByName('Label').active = false;

                } else if (type == "rate") {
                    node.setPosition(cc.v2(originX, originY + this.lineRateMarkOffsetY * i));
                    // node.getChildByName('Label').getComponent(cc.Label).string = Number(1 + i * 0.2).toFixed(1) + 'x';
                }
                parentNode.addChild(node);
                nodeArray.push(node);
            }
        };
        let originX = 0, originY = 0;
        switch (type) {
            case "time":
                originX = -600, originY = -3;
                func(16, this.prefabTimeMark, originX, originY, type, directionLineNode, this.timeMarkNodeArray);
                break;
            case "rate":
                originX = -8, originY = -249;
                func(7, this.prefabRateMark, originX, originY, type, directionLineNode, this.rateMarkNodeArray);
                break;

            default:
                LoggerUtil.getInstance().error("initLineMark Type error");
                return;
        }

    },

    // 初始化下注按钮
    initBetBtnCoin() {
        for (let index = 0; index < this.btnBetList.length; index++) {
            const btn = this.btnBetList[index];
            btn.target.getChildByName('Label').getComponent(cc.Label).string = this.btnBetCoinNum[index] / 100;
            // btn.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
            btn.node.on('click', this.btnClick, this);
        };
        this.curSingleNote = this.btnBetCoinNum[0];
        this.choiceBetButton(this.btnBetList[0], this.nodeBtnBetSelect);
    },

    choiceBetButton: function (button, selectLight){
        let scale = 1.1;
        let btnName = button.node.name;
        selectLight.setScale(scale);
        for (let i = 0; i < this.btnBetList.length; i++) {
            let btn = this.btnBetList[i];
            if(btn.node.name == btnName){
                btn.node.setScale(scale);
            }else{
                btn.node.setScale(1);
            }
            let widget = btn.node.getComponent(cc.Widget);
            if(widget){
                widget.updateAlignment();
            }
        }
        let pos = button.node.getPosition();
        selectLight.setPosition(pos.x, pos.y + 3.5);
    },


    freshGameData() {
        this.timeMarkNodeArray = [];           // 存放时间线标记的节点数组
        this.rateMarkNodeArray = [];           // 存放比率线标记的节点数组
        this.rectTrendNodeArray = [];          // 存放矩形走势的节点数组

        this.pointRecordDataList = [];          // 存放点记录的数组
    },

    onEventMsg(webData, target) {
        let self = target;
        var msgId = webData.msgCode;
        var notify = webData.msgData;
        if (msgId === "gameservice.login") {
            // 登录游戏
            self.dealLoginData(notify);
            CommonFun.getInstance().hidProgress();
        }
        else if (msgId == 'gameservice.exit') {
            // 退出房间
            SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.ROCKET, SceneManager.getInstance().sceneType.LOBBY);
        }
        else if (msgId == 'gameservice.loadwhole') {
            // 刷新游戏场景
            self.dealLoginData(notify);
        }
        else if (msgId == 'gameservice.playerlist') {
            // 获取玩家列表
            self.dealPlayerList(notify);
        }
        else if (msgId == 'gameservice.playernumberchangednotify') {
            // 人数变化通知
            if (notify.num) {
                self.btnPlayerList.node.getChildByName('redBg').getChildByName('Label').getComponent(cc.Label).string = notify.num;
            }
        }
        else if (msgId == 'gameservice.bet') {
            // 下注
            self.rocketAudioManager.playGameSound('mytouCoin', false);
            let totalChip = notify.totalChip;        // 个人总下注
            let poolChip = notify.poolChip;
            let after = notify.after;

            GlobalCfg.USER_DATAS.userDiamond = after;
            self.numSelfBet = totalChip;
            self.numAllBet = poolChip;
            self.setBetLabelInfo();
            self.updateSelfCoin();
        }
        else if (msgId == 'gameservice.cash') {
            // 领取奖励
            let time = notify.time;     // 时间坐标
            let rate = notify.mul;      // 倍数
            let amount = notify.amount; // 领取的金额
            let after = notify.after;   // 钱包剩余

            self.getDownNode.getChildByName('labRate').getComponent(cc.Label).string = (rate / 1000).toFixed(2) + "X";
            self.getDownNode.getChildByName('labWin').getComponent(cc.Label).string = amount / 100;
            self.getDownNode.active = true;
            self.unGetDownNode.active = false;
            self.rocketAudioManager.playGameSound('cash_out_win', false);
            GlobalCfg.USER_DATAS.userDiamond = after;
            self.selfPlayer.getChildByName('coin').getComponent(cc.Label).string = GlobalCfg.USER_DATAS.userDiamond / 100;
        }

        else if (msgId == 'gameservice.startbettingnotify') {
            // 开始下注阶段通知
            self.rocketAudioManager.playGameMusic('betBgMusic');
            self.rocketAudioManager.playGameSound("start", false);
            this.betStatus = 0; //下注状态
            self.startBetTimer(self.betDuration);
            self.dealBetInfo(msgId);
        }
        else if (msgId == 'gameservice.startflynotify') {
            // 开始飞行阶段通知
            this.betStatus = 1; //飞行阶段
            self.rocketAudioManager.playGameMusic('rocketFlyBgMusic');
            self.rocketAudioManager.playGameSound('rocket_fly', false);
            self.startRocketFire();
            self.dealBetInfo(msgId);
        }
        else if (msgId == 'gameservice.flyfinishnotify') {
            // 飞行结束通知
            this.betStatus = 2; //结束阶段
            self.rocketAudioManager.pauseMusic();
            self.rocketEnd(notify);
            self.dealBetInfo(msgId);
        }
        else if (msgId == 'gameservice.bettingupdatenotify') {
            // 下注过程 update
            // LoggerUtil.getInstance().warn("下注过程 update", notify);
            if (self.isHide == true) {
                LoggerUtil.getInstance().log("Is In Hide");
                return;
            }
            let betPool = notify.betPool;
            self.numAllBet = betPool;
            self.setBetLabelInfo();
        }
        else if (msgId == 'gameservice.updatecoinnotify') {
            // 货币更新广播

        }
        else if (msgId == 'gameservice.endbettingnotify') {
            //结束下注 传消息给服务器
            this.betStatus = 3; //结束操作阶段，把操作发给服务器的阶段
            self.dealSendMsgInfo();
        }
        else if (msgId == GlobalCfg.CLIENT_MSG_ID.CURRENCY_CHANGED_USER_INFO) {
            self.selfPlayer.getChildByName('coin').getComponent(cc.Label).string = GlobalCfg.USER_DATAS.userDiamond / 100;
        }
        // else if (msgId == GlobalCfg.CLIENT_MSG_ID.FIRST_RECHARGE_TIPS) {
        //     LoggerUtil.getInstance().warn("首次充值提示");
        //     SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.ROCKET, SceneManager.getInstance().sceneType.LOBBY);
        // }
        else if (msgId == GlobalCfg.CLIENT_MSG_ID.GAME_MENU_CLICK_OUT_TO_LOBBY) {
            self.rocketMessageManager.sendExitMessage();
        }
        else if (msgId == GlobalCfg.CLIENT_MSG_ID.GAME_MENU_CLICK_HOW_TO_PLAY) {
            CommonFun.getInstance().showRule("rocket");
        }
        else if (msgId == "lobbyservice.kicktolobby") {
            SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.ROCKET, SceneManager.getInstance().sceneType.LOBBY);
        }
    },

    checkWebMsgError(webData, target) {
        let self = target;
        let msgId = webData.msgCode;
        let notify = webData.msgData;
        let result = notify.result;
        LoggerUtil.getInstance().error(notify);
        let msg = result.message ? result.message : "SERVICE ERROR";
        if (!notify) {
            // let info = {
            //     errorMessage: `Rocket游戏中, 服务器下发的非正确消息中结构体异常, 内容为===>${JSON.stringify(webData)}`
            // };
            // CommonFun.getInstance().reportToTelegram(info);
            // return;
        };
        if (msgId == 'gameservice.bet') {
            if (CommonFun.getInstance().isFreePlayerDirectedToFreeTP()) {
                if (result.result == 57) {
                    CommonFun.getInstance().showDiversionFreeTP(() => {
                        GameServerManager.send("gameservice.exit", "ExitReq", {});
                        // SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.ROCKET, SceneManager.getInstance().sceneType.LOBBY);
                    });
                }
                else {
                    if (notify.result.result == 19) {         // 余额不足
                        if (GlobalCfg.IS_CLUB_MODE == 1){  //代理模式不跳转商城
                            CommonFun.getInstance().showMsgBox('Insufficient cash', "YES", () => {}, false);}
                        else {
                            CommonFun.getInstance().showMsgBox('Your cash is insufficient, Please recharge in time!', "SHOP", () => {
                                CommonFun.getInstance().showSmallAddCash()
                            }, false);
                        }
                    }
                };
            }
            else {
                if (notify.result.result == 19) {         // 余额不足
                    if (GlobalCfg.IS_CLUB_MODE == 1){  //代理模式不跳转商城
                        CommonFun.getInstance().showMsgBox('Insufficient cash', "YES", () => {}, false);}
                    else {
                        CommonFun.getInstance().showMsgBox('Your cash is insufficient, Please recharge in time!', "SHOP", () => {
                            CommonFun.getInstance().showSmallAddCash()
                        }, false);
                    }
                }
            };
        }
        else if (msgId === "gameservice.login") {
            CommonFun.getInstance().showMsgBox(result.message, "YES", () => {
                SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.ROCKET, SceneManager.getInstance().sceneType.LOBBY);
            }, false);
        }
    },

    btnClick(event) {
        let name = event.node.name;
        if (name == this.btnBack.node.name) {
            GlobalCfg.G_COMPONENTS.Audio.playButton();
            CommonFun.getInstance().showGameMenu(false);
        }
        else if (name == this.btnPlayerList.node.name) {
            GlobalCfg.G_COMPONENTS.Audio.playButton();
            this.rocketMessageManager.sendGetPlayerListMessage(0, 12);
        }
        else if (name == this.btnSetting.node.name) {
            GlobalCfg.G_COMPONENTS.Audio.playButton();
            this.showSettingNode();
        }
        else if (name == this.btnTrend.node.name) {
            GlobalCfg.G_COMPONENTS.Audio.playButton();
            this.showPointTrendNode();
        }
        else if (name == this.btnBottomTrend.node.name) {
            GlobalCfg.G_COMPONENTS.Audio.playButton();
            this.showPointTrendNode();
        }
        else if (name == this.btnCashout.node.name) {
            // 下车
            let rate = this.centerRateNode.getChildByName('Label').getComponent(cc.Label).string;
            this.rocketMessageManager.sendGetCashMessage(this.duringFlyTime, rate.split('x')[0]);
        }
        else if (name == this.btnBetList[0].node.name) {
            GlobalCfg.G_COMPONENTS.Audio.playButton();
            this.choiceBetButton(event, this.nodeBtnBetSelect);
            this.curSingleNote = this.btnBetCoinNum[0];
        }
        else if (name == this.btnBetList[1].node.name) {
            GlobalCfg.G_COMPONENTS.Audio.playButton();
            this.choiceBetButton(event, this.nodeBtnBetSelect);
            this.curSingleNote = this.btnBetCoinNum[1];
        }
        else if (name == this.btnBetList[2].node.name) {
            GlobalCfg.G_COMPONENTS.Audio.playButton();
            this.choiceBetButton(event, this.nodeBtnBetSelect);
            this.curSingleNote = this.btnBetCoinNum[2];
        }
        else if (name == this.btnBetList[3].node.name) {
            GlobalCfg.G_COMPONENTS.Audio.playButton();
            this.choiceBetButton(event, this.nodeBtnBetSelect);
            this.curSingleNote = this.btnBetCoinNum[3];
        }
        else if (name == this.btnBetList[4].node.name) {
            GlobalCfg.G_COMPONENTS.Audio.playButton();
            this.choiceBetButton(event, this.nodeBtnBetSelect);
            this.curSingleNote = this.btnBetCoinNum[4];
        }
        else if (name == this.btnReBet.node.name) {
            GlobalCfg.G_COMPONENTS.Audio.playButton();
            let num = this.preRoundBetNum;
            this.clickBtnBetCallback(num);
            this.preRoundBetNum = 0;
            this.btnReBet.interactable = false;
        }
    },

    clickBtnBetCallback(num) {
        if (this.isDuringBet == true) {
            if (num > GlobalCfg.USER_DATAS.userDiamond) {
                if (GlobalCfg.IS_CLUB_MODE == 1){  //代理模式不跳转商城
                    CommonFun.getInstance().showMsgBox('Insufficient cash', "YES", () => {}, false);}
                else {
                    CommonFun.getInstance().showMsgBox('Your cash is insufficient, Please recharge in time!', "SHOP", () => {
                        CommonFun.getInstance().showSmallAddCash()
                    }, false);
                }
            } else {
                this.rocketMessageManager.sendBetMessage(num);
            }
        }
    },

    // ******************************************************************************************

    /**
     * 处理登录数据
     * @param {Object} data 
     * @returns 
     */
    dealLoginData(data) {
        // LoggerUtil.getInstance().log("dealLoginData", data);
        // 初始化状态
        this.isDuringBet = false;
        this.isFlying = false;
        this.setMoveMark(false);
        this.drawLine = false;
        this.unscheduleAll();

        if (!data) return;
        let whole = data.whole;
        let config = whole?.config;
        let scene = whole?.scene;
        let requester = whole?.requester;
        if (config && scene && requester) {
            this.btnBetCoinNum = config.chipOption;
            this.betDuration = config.betDuration;
            this.calcDuration = config.calcDuration;
            this.initBetBtnCoin();

            let userInfo = requester.userInfo;
            let chip = requester.chip ? requester.chip : 0;              // 已下注的
            let cashPoint = requester.cashPoint;    // 领取点
            if (userInfo) {
                this.setSelfPlayerInfo(userInfo);
            }

            let status = scene.status;                  // 当前状态
            this.betStatus = status;
            let playerNum = scene.playerNum;            // 总玩家人数
            let currentStatusLeftMs = scene.currentStatusLeftMs;    // 当前状态剩余时间.毫秒(下注，结算)
            let betPool = scene.betPool;                // 下注池
            let curPoint = scene.point;                 // 当前坐标点
            let trends = scene.openRecord;              // 开奖记录
            this.dealTrendData(trends);
            this.dealRectTrendData(this.pointRecordDataList);

            this.numSelfBet = chip;
            this.numAllBet = betPool;
            this.setBetLabelInfo();
            this.btnPlayerList.node.getChildByName('redBg').getChildByName('Label').getComponent(cc.Label).string = playerNum;
            switch (status) {
                case 0:
                    // 下注状态
                    this.isDuringBet = true;
                    if (this.rocketAudioManager.curMusicName == 'betBgMusic') {
                        this.rocketAudioManager.resumeMusic();
                    } else {
                        this.rocketAudioManager.playGameMusic('betBgMusic');
                    }
                    this.startBetTimer(currentStatusLeftMs);
                    this.freshWaitLayer(true);
                    break;
                case 1:
                    // 飞行中
                    if (this.rocketAudioManager.curMusicName == 'rocketFlyBgMusic') {
                        this.rocketAudioManager.resumeMusic();
                    } else {
                        this.rocketAudioManager.playGameMusic('rocketFlyBgMusic');
                    }
                    this.duringFlyTime = curPoint.x / 1000;
                    this.isFlying = true;
                    this.freshWaitLayer(false);
                    this.dealFlyState(curPoint);
                    this.btnReBet.interactable = false;
                    this.background.getComponent(cc.Animation).play("rotate"); // 背景旋转
                    // if (cashPoint) {
                    //     // 已领取
                    //     this.getDownNode.getChildByName('labRate').getComponent(cc.Label).string = (cashPoint.mul / 1000).toFixed(2) + "X";
                    //     this.getDownNode.getChildByName('labWin').getComponent(cc.Label).string = cashPoint.win / 100;
                    //     this.getDownNode.active = true;
                    //     this.unGetDownNode.active = false;
                    // } else {
                    //     // 未领取
                    //     this.unGetDownNode.getChildByName('allBet').getComponent(cc.Label).string = betPool / 100;
                    //     this.unGetDownNode.getChildByName('selfBet').getComponent(cc.Label).string = chip / 100;
                    //     this.getDownNode.active = false;
                    //     this.unGetDownNode.active = false;
                    //     if (chip > 0) {
                    //         this.unGetDownNode.active = true;
                    //     }
                    // }
                    break;
                case 2:
                    // 结算状态
                    // let time = curPoint.x;         // 时间
                    // let mul = curPoint.mul;         // 倍数
                    // this.initTimeMarkByCurTime(time);
                    // this.initRateMarkByCurRate(Number((mul / 1000).toFixed(2)));
                    this.freshWaitLayer(false);
                    // if (cashPoint) {
                    //     // 已领取
                    //     this.getDownNode.getChildByName('labRate').getComponent(cc.Label).string = (cashPoint.mul / 1000).toFixed(2) + "X";
                    //     this.getDownNode.getChildByName('labWin').getComponent(cc.Label).string = cashPoint.win / 100;
                    //     this.getDownNode.active = false;
                    //     this.unGetDownNode.active = false;
                    // } else {
                    //     // 未领取
                    //     this.getDownNode.active = false;
                    //     this.unGetDownNode.active = false;
                    // }
                    this.duringLayer.active = false;
                    this.waitLayer.active = false;
                    break;
                default:
                    break;
            }
        } else {
            LoggerUtil.getInstance().error("LoginData error");
            return;
        }
    },

    /**
     * 处理飞行状态  + (518 + 600) / 10  + (134 + 218) / 10
     * @param {Point {  int64 x = 1;  int64 mul = 2;}} point 当前飞机的坐标点
     */
    dealFlyState(point) {
        let time = point.x;         // 时间 ms
        let mul = point.mul;         // 倍数
        this.drawPosX = this.constStartPosX;
        this.duringFlyTime = Number(time / 1000);
        let limitTime = 2.3;
        let time_s = Number(time / 1000);
        if (time_s <= limitTime) {
            limitTime = time_s;
        }
        let frameRate = cc.game.getFrameRate();
        let frameRateTime = 1 / frameRate;
        let drawCount = Math.floor(limitTime / frameRateTime);
        LoggerUtil.getInstance().warn('绘画次数：', limitTime, drawCount);
        // 公式：rate = math.Pow(float64(x)/1000, 2)/100 + 1
        
        let unitTime = limitTime / drawCount;         // 单位时间
        for (let i = 0; i < drawCount; i++) {
            const x = i * unitTime;
            let frontY = 0;
            if (i > 0) {
                frontY = this.constStartPosY + Math.pow(x - unitTime, 2) / 10 * this.lineRateMarkOffsetY * 5;
            } else {
                frontY = this.constStartPosY + Math.pow(x, 2) / 10 * this.lineRateMarkOffsetY * 5;
            }
            let currentY = this.constStartPosY + Math.pow(x, 2) / 10 * this.lineRateMarkOffsetY * 5;
            let deltaX = (unitTime / 2) * this.lineTimeMarkOffsetX;
            this.drawPosX += deltaX;
            this.flyRocketNode.setPosition(this.drawPosX, currentY);
            this.setRegion();
        }
        this.initTimeMarkByCurTime(time);
        this.initRateMarkByCurRate(Number((mul / 1000).toFixed(2)));
    },

    setRegion() {
        // 获取飞机和红区节点的位置（世界坐标）
        let planeWorld = this.flyRocketNode.convertToWorldSpaceAR(cc.Vec2.ZERO);
        // 转为同一坐标系（本地坐标）
        let local = this.region.parent.convertToNodeSpaceAR(planeWorld);
        // 区域左下角是 anchor (0,0)，直接用宽高覆盖即可
        let width = local.x - this.region.x;
        let height = local.y - this.region.y;
        if (width > 0 && height > 0) {
            this.region.width = width - 30;
            this.region.height = height - 25;
        }
    },

    openAutoSetting(openAutoSettingIndex) {
        this.openAutoSettingIndex = openAutoSettingIndex;
        this.node_autoSetting.active = true;
    },

    setAutoStatus(infos, count) {
        this.autoSettingInfos = infos;
        if (this.openAutoSettingIndex == 0) {
            this.node_betinfo1.getComponent('AviatorBetCtrl').setAutoInfo(count);
        }
        else{
            this.node_betinfo2.getComponent('AviatorBetCtrl').setAutoInfo(count);
        }
    },

    dealBetInfo(msgId) {
        if (msgId == 'gameservice.startbettingnotify') {
            // 开始下注阶段通知
            this.node_betinfo1.getComponent('AviatorBetCtrl').StartBet();
            this.node_betinfo2.getComponent('AviatorBetCtrl').StartBet();
        }
        else if (msgId == 'gameservice.startflynotify') {
            // 开始飞行阶段通知
            this.node_betinfo1.getComponent('AviatorBetCtrl').dealBetStatus();
            this.node_betinfo2.getComponent('AviatorBetCtrl').dealBetStatus();
        }
        else if (msgId == 'gameservice.flyfinishnotify') {
            // 飞行结束通知
            this.node_betinfo1.getComponent('AviatorBetCtrl').flyEnd();
            this.node_betinfo2.getComponent('AviatorBetCtrl').flyEnd();
        }
    },

    dealSendMsgInfo() {
        this.node_betinfo1.getComponent('AviatorBetCtrl').checkSendStatus();
        this.node_betinfo2.getComponent('AviatorBetCtrl').checkSendStatus();
    },

    /**
     * 设置移动刻度
     * @param {boolean} isMove 是否移动刻度
     */
    setMoveMark(isMove) {
        this.isMoveTimeMark = isMove;
        this.isMoveRateMark = isMove;
    },

    /**
     * 通过当前时间初始化时间刻度线
     * @param {Number} time ms
     */
    initTimeMarkByCurTime(time) {
        LoggerUtil.getInstance().log("initTimeMarkByCurTime", time);
        if (time > 10000) {
            // 已经开始移动刻度线
            this.timeMarkNodeArray.length = 0;
            this.horizontalLine.removeAllChildren();
            // x: 522.077874999999
            // y: 144.60892217858014
            let time_s = time / 1000;       // 秒
            let more = Number((time_s % 2).toFixed(3));     // 跟上一个刻度之间的差值
            let lastPosX = 522 + (1 - more / 2) * this.lineTimeMarkOffsetX;
            let lastTime = Math.round(time_s + 2 - more);
            for (let i = 0; i < 8; i++) {
                let node = cc.instantiate(this.prefabTimeMark);
                node.setPosition(cc.v2(lastPosX - this.lineTimeMarkOffsetX * i, -3));
                node.getChildByName('Label').getComponent(cc.Label).string = lastTime - i * 2 + 's';
                this.horizontalLine.addChild(node);
                this.timeMarkNodeArray.unshift(node);
            }
            this.setMoveMark(true);
        } else {
            // 暂未移动刻度线
            this.setMoveMark(false);
            this.drawLine = true;
        }
    },

    /**
     * 通过当前倍率初始化倍率刻度线
     * @param {Number} rate 倍率
     */
    initRateMarkByCurRate(rate) {
        if (rate > 2) {
            this.rateMarkNodeArray.length = 0;
            this.variableLine.removeAllChildren();
            let moreRate = (Number(((rate * 10) % 2).toFixed(1)) / 10).toFixed(2);    // 跟下一个刻度之间的差值
            // LoggerUtil.getInstance().log("moreRate", moreRate);
            let lastPosY = 144 + (1 - Number(moreRate) / 0.2) * this.lineRateMarkOffsetY;
            let lastRate = rate + 0.2 - Number(moreRate);
            // LoggerUtil.getInstance().log("lastRate", lastRate, "lastPosY", lastPosY);
            for (let i = 0; i < 7; i++) {
                let node = cc.instantiate(this.prefabRateMark);
                node.setPosition(cc.v2(-8, lastPosY - this.lineRateMarkOffsetY * i));
                node.getChildByName('Label').getComponent(cc.Label).string = Number(lastRate - i * 0.2).toFixed(1) + 'x';
                this.variableLine.addChild(node);
                this.rateMarkNodeArray.unshift(node);
            }
            this.setMoveMark(true);
        } else {
            // 暂未移动刻度线
            this.setMoveMark(false);
            this.drawLine = true;
        }
    },

    dealWaitState() {

    },


    loadHeadSp(headUrl, realWidth, heaSprite) {
        if (headUrl && headUrl.length > 0) {
            cc.assetManager.loadRemote(headUrl, { ext: '.png' }, (err, texture) => {
                if (!err && cc.isValid(this) && cc.isValid(heaSprite) && cc.isValid(heaSprite.spriteFrame)) {
                    heaSprite.spriteFrame = new cc.SpriteFrame(texture);
                    heaSprite.node.setScale(realWidth / heaSprite.node.width);
                }
            });
        }
    },

    /**
     * 设置自己玩家信息
     * @param {UserInfo} data 
     * @returns 
     */
    setSelfPlayerInfo(data) {
        if (!data) return;
        GlobalCfg.USER_DATAS.userDiamond = data.diamond;
        this.selfPlayer.getChildByName('coin').getComponent(cc.Label).string = GlobalCfg.USER_DATAS.userDiamond / 100;
    },

    updateSelfCoin() {
        this.selfPlayer.getChildByName('coin').getComponent(cc.Label).string = GlobalCfg.USER_DATAS.userDiamond / 100;
    },

    dealPlayerList(notify) {
        if (!notify) {
            LoggerUtil.getInstance().error("PlayerList Data Error!");
            return;
        }
        let node = this.node.getChildByName('playerList');
        if (node) {
            let nodeCtrl = node.getComponent('RocketPlayerList');
            if (nodeCtrl) {
                nodeCtrl.setPlayerData(notify);
            }
        } else {
            let nodePlayerList = cc.instantiate(this.prefabPlayerList);
            let nodeCtrl = nodePlayerList.getComponent('RocketPlayerList');
            this.node.addChild(nodePlayerList);
            if (nodeCtrl) {
                nodeCtrl.setPlayerData(notify);
            }
        }
    },

    // ******************************************************************************************

    /**
     * 设置下注金额,使用之前请更新 numSelfBet，numAllBet
     */
    setBetLabelInfo() {
        let selfBet = this.numSelfBet;
        let allBet = this.numAllBet;

        this.unGetDownNode.getChildByName('allBet').getComponent(cc.Label).string = allBet / 100;
        this.unGetDownNode.getChildByName('selfBet').getComponent(cc.Label).string = selfBet / 100;

        if (selfBet > 0) {
            this.unGetDownNode.getChildByName('selfBet').color = new cc.Color(254, 253, 1, 255);
        }
    },
    /**
     * 开始下注阶段
     * @param {Number} remainder 剩余时间 ms
     */
    startBetTimer(remainder) {
        if (this.numSelfBet == 0) {
            LoggerUtil.getInstance().log("上一局自己下注为 0 ");
            this.preRoundBetNum = 0;
        } else {
            this.preRoundBetNum = this.numSelfBet;
            LoggerUtil.getInstance().log("上一局自己下注为: ", this.preRoundBetNum);
        }
        if (this.betDuration == remainder) {
            this.numSelfBet = 0;
            this.numAllBet = 0;
        }
        this.setBetLabelInfo();
        this.freshWaitLayer(true);
        this.playerGetOutParent.removeAllChildren();
        if (this.preRoundBetNum > 0) {
            this.btnReBet.interactable = true;
        }
        this.isDuringBet = true;
        this.isFlying = false;
        this.setMoveMark(false);
        this.initLineMark(this.horizontalLine, "time");
        this.initLineMark(this.variableLine, "rate");

        let time = null, count = null;
        if (remainder) {
            time = remainder;
            count = time;
        } else {
            time = this.betDuration;
            count = time;
        }
        // let lab = this.timerBar.node.getChildByName("labTime").getComponent(cc.Label);
        // lab.string = Math.floor(count / 1000) + "s";

        this.timerBar.node.getChildByName("logo").getComponent(cc.Animation).play("rotate2");
        this.timerBar.node.stopAllActions();
        this.timerBar.progress = 1;
        cc.tween(this.timerBar)
          .to((remainder / 1000) + 1, { progress: 0 })
          .call(() => {
              LoggerUtil.getInstance().log("倒计时结束，火箭点火");
              this.isDuringBet = false;
          })
          .start();
    },

    freshWaitLayer(bool) {
        this.waitLayer.active = bool;
        this.duringLayer.active = !bool;
    },

    // 开始火箭点火
    startRocketFire() {
        this.drawPosX = this.constStartPosX;
        this.drawPosY = this.constStartPosY;
        this.duringFlyTime = 0;
        this.isOscillating = false;
        this.flyRocketNode.setPosition(this.drawPosX, this.drawPosY);
        this.region.active = true;
        this.region.width = 0;
        this.region.height = 0;
        this.setBetLabelInfo();
        this.getDownNode.active = false;
        // this.unGetDownNode.active = true;
        // if (this.numSelfBet > 0) {
        //     this.unGetDownNode.active = true;
        // } else {
        //     this.unGetDownNode.active = false;
        // }
        this.btnReBet.interactable = false;
        this.rocketAudioManager.playGameSound('rocket_fly', false);
        this.graphicsDrawLine.clear();
        this.freshWaitLayer(false);
        this.isMoveTimeMark = false;
        this.updateCenterRate(1);
        this.graphicsDrawLine.moveTo(this.drawPosX, this.constStartPosY);
        this.isFlying = true;
        this.drawLine = true;

        this.background.getComponent(cc.Animation).play("rotate");
    },

    rocketEnd(notify) {
        this.unGetDownNode.active = false;
        LoggerUtil.getInstance().warn("rocketEnd", notify);
        if (!notify) return;
        this.isOscillating = false;
        this.isFlying = false;
        this.drawLine = false;
        this.region.active = false;
        let time = notify.x;
        let rate = notify.mul;
        let jackpotPool = notify.jackpotPool;
        let point = { x: time, mul: rate };
        this.updateCenterRate(Number((rate / 1000).toFixed(2)), true);
        this.flyEndAnimion(point);
        this.background.getComponent(cc.Animation).stop();
    },

    flyEndAnimion(point) {
        // 使用tween实现爆炸后飞向终点
        cc.tween(this.flyRocketNode)
        .to(0.2, {
            position: this.endFlyPos
        }, { easing: 'sineOut' })
        .call(() => {
            this.rocketAudioManager.playGameSound("explosion", false);
            this.updateTrendData(point);
            this.updateRectTrendNode(this.pointRecordDataList[this.pointRecordDataList.length - 1]);
            this.curRoundAddCoinFinish();
        })
        .start();
    },

    curRoundAddCoinFinish(){
        if(cc.isValid(this)){
            let minLimit = this.btnBetCoinNum[0] || 0;
            CommonFun.getInstance().gameShowSecondRecharge(minLimit, this.numSelfBet);
            CommonFun.getInstance().showWithdrawToastInGame();
        }
    },

    /**
     * 有玩家领取
     */
    dealPlayerGetOut(notify) {
        if (!notify) {
            LoggerUtil.getInstance().error("PlayerGetOut Data Error!");
            return;
        }
        let playerGetOutNode = cc.instantiate(this.prefabPlayerGetOut);
        let pos = this.flyRocketNode.getPosition();
        playerGetOutNode.setPosition(pos);
        this.playerGetOutParent.addChild(playerGetOutNode);
        playerGetOutNode.getComponent("RocketPlayerGetOut").setNodeData(notify);
    },


    // ***************************************************************************************

    /**
     * 处理走势数据
     * @param {*} msg 
     */
    dealTrendData(trends) {
        this.pointRecordDataList.length = 0;
        for (let i = 0; i < trends.length; i++) {
            const element = trends[i];
            this.pointRecordDataList.push(element);
        }
    },

    /**
     * 更新走势数据
     */
    updateTrendData(pointData) {
        this.pointRecordDataList.push(pointData);
        if (this.pointRecordDataList.length > 100) {
            this.pointRecordDataList.shift();
        }
    },

    /**
     * 展示矩形走势
     */
    dealRectTrendData() {
        this.initRectTrend(this.pointRecordDataList);
    },

    /**
     * 
     * @param {*} data 
     */
    initRectTrend(data) {
        this.nodeTrendParent.removeAllChildren();
        this.rectTrendNodeArray.length = 0;
        if (data.length < this.trendMaxNum) {
            for (let i = 0; i < data.length; i++) {
                this.createRectTrendNode(data[i]);
            }
        } else {
            for (let i = data.length - this.trendMaxNum; i < data.length; i++) {
                this.createRectTrendNode(data[i]);
            }
        }
    },

    /**
     * 生成矩形走势数据节点
     */
    createRectTrendNode(data, isShowLight) {
        if (isShowLight == undefined) {
            isShowLight = false;
        }
        let trendNode = cc.instantiate(this.prefabTrendItem);
        let RocketRecordRectCtrl = trendNode.getComponent("AviatorRecordRectCtrl");
        if (RocketRecordRectCtrl) {
            RocketRecordRectCtrl.init(data);
            this.nodeTrendParent.addChild(trendNode);
            RocketRecordRectCtrl.showLight(isShowLight);
            this.rectTrendNodeArray.push(trendNode);
        }
    },

    /**
     * 更新矩形走势数据节点
     */
    updateRectTrendNode(data) {
        if (this.rectTrendNodeArray.length >= this.trendMaxNum) {
            let node = this.rectTrendNodeArray.shift();
            node.removeFromParent(true);
            if (cc.isValid(node)) {
                node.destroy();
            }
        }
        this.createRectTrendNode(data, true);
    },

    /**
     * 展示点形走势数据
     * @param {*} msg 
     */
    showPointTrendNode() {
        let node = cc.instantiate(this.prefabRecord);
        node.getComponent("AviatorRecord").init(this.pointRecordDataList);
        node.setPosition(cc.v2(210, 195));
        this.popupLayer.addChild(node);
        this.popupLayer.active = true;
    },

    /**
     * 展示设置界面
     * @param {*} msg 
     */
    showSettingNode() {
        let node = cc.instantiate(this.prefabSetting);
        node.setPosition(cc.v2(767.5, 0));
        this.popupLayer.addChild(node);
        this.popupLayer.active = true;
    },

    setAviatorAnimation(isShow) {
        this.flyRocketNode.active = isShow;
        this.region.active = isShow;
    },

    /**
     * 更新中间的倍率
     * @param {Number} rate 倍率
     */
    updateCenterRate(rate, isEnd = false) {
        if (rate) {
            let ctrl = this.centerRateNode.getComponent("AviatorCenterRate");
            if (ctrl) {
                ctrl.updateRate(Number(rate).toFixed(2), isEnd);
            }
            this.node_betinfo1.getComponent('AviatorBetCtrl').updateRate(Number(rate).toFixed(2));
            this.node_betinfo2.getComponent('AviatorBetCtrl').updateRate(Number(rate).toFixed(2));

            for (let i = 0; i < 3; i++) {
                this.lights[i].active = false;
            }
            if (rate <= 2) {
                this.lights[0].active = true;
            } else if (rate <= 10) {
                this.lights[1].active = true;
            } else {
                this.lights[2].active = true;
            }
        }
    },

    showBtnBetSpine: function () {
        let animationName = 'animation';
        let len = this.btnBetList.length, i = 0;
        this.scheduleBetSpineTimeCallback = ()=>{
            let spine = this.btnBetList[i].node.getChildByName('spine').getComponent(sp.Skeleton);
            spine.setAnimation(0, animationName, false);
            i++;
        }
        this.schedule(this.scheduleBetSpineTimeCallback, 0.8, len-1);
    },

    update(dt) {
        this.showBetSpineTime += dt;
        if (this.showBetSpineTime > this.showBetSpineTimeInterval) {
            this.showBetSpineTime = 0;
            this.showBtnBetSpine();
        }
        if (!this.isFlying) return;
    
        // ✅ 飞行期间倍率始终增长
        let rate = 1 + Math.pow(this.duringFlyTime, 2) / 10;
        this.updateCenterRate(rate);
    
        // ✅ 正确震荡逻辑：震荡时一定执行
        if (this.isOscillating) {
            this.duringFlyTime += dt;
            // 震荡配置
            const baseX = this.drawPosX;
            const baseY = 200;
            const freqX = 2;     // 左右震荡频率
            const freqY = 3;     // 上下震荡频率
            const ampX = 6;      // 左右幅度
            const ampY = 20;     // 上下幅度
            const x = baseX + Math.sin(this.duringFlyTime * freqX) * ampX;
            const y = baseY + Math.sin(this.duringFlyTime * freqY) * ampY;
            this.flyRocketNode.setPosition(x, y);
            this.setRegion();
            return;
        }
    
        // ❗此处不能再判断 drawLine，必须继续逻辑
        let frontY = this.constStartPosY + Math.pow(this.duringFlyTime, 2) / 10 * this.lineRateMarkOffsetY * 8;
        this.duringFlyTime += dt;
        let currentY = this.constStartPosY + Math.pow(this.duringFlyTime, 2) / 10 * this.lineRateMarkOffsetY * 8;
        let deltaX = (dt / 2) * this.lineTimeMarkOffsetX;
        let deltaY = currentY - frontY;
    
        if (this.isMoveTimeMark) this.moveTimeMark(deltaX);
        if (this.isMoveRateMark) this.moveRateMark(deltaY);
    
        this.drawPosX += deltaX;
        this.drawPosY = currentY;
        this.flyRocketNode.setPosition(this.drawPosX, this.drawPosY);
        this.setRegion();
    
        // ✅ 当达到边界时，切换为震荡阶段（一次性）
        if (!this.isOscillating && (this.drawPosX >= 650 || this.drawPosY >= 200)) {
            this.drawPosX = Math.min(this.drawPosX, 650);
            this.drawPosY = Math.min(this.drawPosY, 200);
            this.flyRocketNode.setPosition(this.drawPosX, this.drawPosY);
            this.isOscillating = true;
            this.setMoveMark(true);
            LoggerUtil.getInstance().log("🎯 切换为震荡阶段 at", this.drawPosX, this.drawPosY);
        }
    },

    moveRateMark(offsetY) {
        if (this.isMoveRateMark == true) {
            for (let i = 0; i < this.rateMarkNodeArray.length; i++) {
                let node = this.rateMarkNodeArray[i];
                let pos = node.getPosition();
                node.setPosition(cc.v2(pos.x, pos.y - offsetY));
            }
            for (let i = 0; i < this.rateMarkNodeArray.length; i++) {
                let node = this.rateMarkNodeArray[i];
                let pos = node.getPosition();
                if (pos.y < this.constStartPosY - 50) {
                    let _node = this.rateMarkNodeArray.shift();
                    i--;
                    let lastNode = this.rateMarkNodeArray[this.rateMarkNodeArray.length - 1];
                    let labStr = lastNode.getChildByName('Label').getComponent(cc.Label).string;
                    let pos = lastNode.getPosition();
                    let rate = Number(labStr.split('x')[0]);
                    _node.getChildByName('Label').getComponent(cc.Label).string = Number(rate + 0.2).toFixed(1) + 'x';
                    _node.setPosition(cc.v2(pos.x, pos.y + this.lineRateMarkOffsetY));
                    this.rateMarkNodeArray.push(_node);
                }
            }
        }

    },

    /**
     * 移动时间标记
     * @param {number} offsetX 
     */
    moveTimeMark(offsetX) {
        for (let i = 0; i < this.timeMarkNodeArray.length; i++) {
            let node = this.timeMarkNodeArray[i];
            let pos = node.getPosition();
            node.setPosition(cc.v2(pos.x - offsetX, pos.y));
        }
        for (let i = 0; i < this.timeMarkNodeArray.length; i++) {
            let node = this.timeMarkNodeArray[i];
            let pos = node.getPosition();
            if (pos.x < -650) {
                let _node = this.timeMarkNodeArray.shift();
                i--;
                let lastNode = this.timeMarkNodeArray[this.timeMarkNodeArray.length - 1];
                let labStr = lastNode.getChildByName('Label').getComponent(cc.Label).string;
                let pos = lastNode.getPosition();
                let time = Number(labStr.split('s')[0]);
                _node.getChildByName('Label').getComponent(cc.Label).string = (time + 2) + 's';
                _node.setPosition(cc.v2(pos.x + 200, pos.y));
                this.timeMarkNodeArray.push(_node);
            }
        }
    },
});
