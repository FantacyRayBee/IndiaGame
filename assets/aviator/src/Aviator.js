
cc.Class({
    extends: cc.Component,

    properties: {
        // default
        btnBack: cc.Button,
        selfPlayer: cc.Node,
        nodeTrendParent: cc.Node,
        btnTrend: cc.Button,
        background: cc.Node,
        btnSetting: cc.Button,

        // waitLayer
        timerBar: cc.ProgressBar,

        // during Game
        centerRateNode: cc.Node,
        flyRocketNode: cc.Node,
        playerGetOutParent: cc.Node,
        rewardPosNode: cc.Node,
        node_autoSetting: cc.Node,

        node_betinfo1: cc.Node,
        node_betinfo2: cc.Node,
        node_playerBet: cc.Node,
        // Prefabs
        pabfabCoin: cc.Prefab,
        prefabRecord: cc.Prefab,
        prefabTimeMark: cc.Prefab,
        prefabRateMark: cc.Prefab,
        prefabTrendItem: cc.Prefab,
        prefabPlayerGetOut: cc.Prefab,
        prefabSetting: cc.Prefab,
        prefabMybet: cc.Prefab,
        prefabReward: cc.Prefab,

        region: cc.Node,      // 红色区域图片节点
        lights: [cc.Node],
        atlas_head: cc.SpriteAtlas,     // 头像图集

        lab_dw: cc.Label,       // 单位
    },

    ctor() {
        // Config
        this.isHide = false;                                // 是否后台隐藏
        this.btnBetCoinNum = [10, 50, 200, 500, 1000];      // 配置下注按钮数值
        this.curSingleNote = this.btnBetCoinNum[0];             // 当前单注数值
        this.betDuration = 15000;                              // 下注持续时间 ms
        this.calcDuration = 3000;                              // 爆炸后结算时长 ms

        this.aviatorMessageManager = null;      // 存放消息的管理器
        this.isDuringBet = false;           // 是否在下注

        this.isFlying = false;                  // 是否在飞行
        this.isMoveTimeMark = false;            // 是否移动时间标记
        this.lineTimeMarkOffsetX = 1000;         // 时间线标记偏移量
        this.lineRateMarkOffsetY = 125;         // 比率线标记偏移量

        this.timeMarkNodeArray = [];           // 存放时间线标记的节点数组
        this.rateMarkNodeArray = [];           // 存放比率线标记的节点数组
        this.rectTrendNodeArray = [];          // 存放矩形走势的节点数组

        this.pointRecordDataList = [];          // 存放点记录的数组

        this.drawLine = false;                  // 是否绘制线
        this.constStartPosX = -298;               // 走势起点X坐标
        this.constStartPosY = -182;               // 走势起点Y坐标
        this.drawPosX = -298;                    // 绘制线起点X坐标
        this.duringFlyTime = 0;                    // 存放当前飞行时长
        this.updateRateCD = 0;                    // 更新比率CD
        this.startFlyLineColor = new cc.Color(174, 36, 72, 255);
        // this.startFlyLineColor = cc.Color(255, 0, 0, 255);
        this.endFlyLineColor = new cc.Color(220, 96, 6, 255);

        this.endFlyPos = cc.v2(433, 255);              // 游戏结束时 飞机终点位置

        this.numSelfBet = 0;                        // 存放当前玩家下注数
        this.showBetSpineTimeInterval = 15;      // 显示下注动画的时间间隔
        this.showBetSpineTime = 0;
        this.trendMaxNum = 15;                     // 走势图最大显示点数
        this.roundTopRankInfo = {};
        this.provablyData = {}
        this.betTimerTween = null;
        this.autoSettingInfos = [null, null]
        this.currentSetAutoDiamond = 0; // 当次选择自动下注的钻石数 记录下来 用于判断是否需要停止自动下注
        this.headId = 1; // 头像ID
        this.isHideAviatorAnim = true; // 是否隐藏飞行动画
    },

    onLoad: function () {
        CommonFun.getInstance().addVerticalAcc();
        CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.SHOW_CRASH_GAME);
        GlobalCfg.ACT_SCENE_CTRL = this;
        this.aviatorMessageManager = this.node.getComponent('AviatorMessageManager');
        this.aviatorMessageManager.sendLoginMessage();
        this.aviatorAudioManager = this.node.getComponent('AviatorAudioManager');
        CommonFun.getInstance().showProgress();
        this.aviatorMultManager = this.node.getComponent('AviatorMultManager');


        this.msgHandle = ClientNotify.register(GlobalCfg.MSG_TYPE.serverMsg, this.onEventMsg, this);
        this.customMsgHandle = ClientNotify.register(GlobalCfg.MSG_TYPE.clientMsg, this.onEventMsg, this);
        this.calcSceneScale();
    },


    calcSceneScale() {
        const size = cc.view.getFrameSize();
        let frameW = size.width;
        let frameH = size.height;
        LoggerUtil.getInstance().log("当前屏幕分辨率 ", frameW, frameH);

        // 宽高比
        const r = frameW / frameH;

        // 二次拟合系数（保证 371×808→1.0, 371×663→1.2, 744×1829→0.9）
        const A = 0.53978958;
        const B = 1.44174666;
        const C = 0.22420797;

        let scale = A * r * r + B * r + C;

        // 限制缩放范围，避免极端机型过大过小
        scale = Math.max(0.85, Math.min(scale, 1.2));

        // 保留三位小数避免浮点抖动
        scale = Math.round(scale * 1000) / 1000;

        LoggerUtil.getInstance().log("计算后的 scale ", scale);

        this.node.scale = scale;  // 根节点缩放
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
            this.setDefaultValueOfVariables();
        }, this);
        cc.game.on(cc.game.EVENT_SHOW, () => {
            LoggerUtil.getInstance().log("重新返回Rocket");
            this.isHide = false;
            this.aviatorMessageManager.sendRefreshMessage();
        }, this);
        this.initialization();
        LoggerUtil.getInstance().warn("当前游戏帧率", cc.game.getFrameRate());
        this.aviatorAudioManager.playGameMusic();
    },

    /**
     * 初始化变量
     */
    setDefaultValueOfVariables() {
        this.isDuringBet = false;
        this.isFlying = false;
        this.isMoveTimeMark = false;
        this.numSelfBet = 0;
    },

    unscheduleAll() {
        this.unschedule(this.scheduleWaitBetCallback);
    },


    initialization() {
        this.defaultLayer = this.node.getChildByName('root').getChildByName('defaultLayer');
        this.waitLayer = this.node.getChildByName('root').getChildByName('waitLayer');
        this.duringLayer = this.node.getChildByName('root').getChildByName('during');
        this.popupLayer = this.node.getChildByName('root').getChildByName('popupLayer');       // 弹窗层
        this.touchbg = this.node.getChildByName(`root`).getChildByName(`touchbg`);

        this.duringLayer.active = false;
        this.waitLayer.active = false;
        this.popupLayer.active = false;
        this.touchbg.active = false;
        this.touchbg.on(cc.Node.EventType.TOUCH_START, () => {
            GlobalCfg.G_COMPONENTS.Audio.playButton();
            this.popupLayer.destroyAllChildren();
            this.popupLayer.active = false;
            this.touchbg.active = false;
        }, this);

        this.btnBack.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
        this.btnSetting.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
        this.btnTrend.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
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
            GameServerManager.send("gameservice.getrankingdata", "GetRankingDataReq", { //开局请求左侧top数据
                types: 1,
                timer: 1,
            });
        }
        else if (msgId == 'gameservice.exit') {
            // 退出房间
            SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.ROCKET, SceneManager.getInstance().sceneType.LOBBY);
            CommonFun.getInstance().decVerticalAcc();
        }
        else if (msgId == 'gameservice.loadwhole') {
            // 刷新游戏场景
            self.dealLoginData(notify);
        }
        else if (msgId == 'gameservice.bet') {
            // 下注
            let totalChip = notify.totalChip;        // 个人总下注
            let after = notify.after;

            GlobalCfg.USER_DATAS.userDiamond = after;
            self.numSelfBet = totalChip;
            self.updateSelfCoin();
        }
        else if (msgId == 'gameservice.cash') {
            LoggerUtil.getInstance().log("gameservice.cash notify = ", notify);
            self.showReward(notify);
            self.updateSelfCoin(); // 更新自己的金币
        }
        else if (msgId == 'gameservice.startbettingnotify') {
            // 开始下注阶段通知
            this.betStatus = 0; //下注状态
            self.startBetTimer(self.betDuration);
            self.dealBetInfo(msgId);
        }
        else if (msgId == 'gameservice.startflynotify') {
            // 开始飞行阶段通知
            this.betStatus = 1; //飞行阶段
            self.startRocketFire();
            self.dealBetInfo(msgId);
        }
        else if (msgId == 'gameservice.flyfinishnotify') {
            // 飞行结束通知
            this.betStatus = 2; //结束阶段
            self.aviatorAudioManager.playGameSound('end', false);
            self.rocketEnd(notify);
            self.dealBetInfo(msgId);
        }
        else if (msgId == 'gameservice.updatecoinnotify') {
            // 货币更新广播
        }
        else if (msgId == 'gameservice.getplayerrecord') {
            //获取自己的投注记录
            self.getBetRecord(notify);
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
            self.aviatorMessageManager.sendExitMessage();
        }
        else if (msgId == GlobalCfg.CLIENT_MSG_ID.GAME_MENU_CLICK_HOW_TO_PLAY) {
            CommonFun.getInstance().showRule("rocket");
        }
        else if (msgId == "lobbyservice.kicktolobby") {
            SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.ROCKET, SceneManager.getInstance().sceneType.LOBBY);
            CommonFun.getInstance().decVerticalAcc();
        }
        else if (msgId == "STOP_GAME") {
            self.stopAutoBetStatus();
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
                        // CommonFun.getInstance().decVerticalAcc(); 
                        // SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.ROCKET, SceneManager.getInstance().sceneType.LOBBY);
                    });
                }
                else {
                    if (notify.result.result == 19) {         // 余额不足
                        if (GlobalCfg.IS_CLUB_MODE == 1) {  //代理模式不跳转商城
                            CommonFun.getInstance().showMsgBox(commonTipsLanguage.insufficientCash[language], "YES", () => { }, false, null, null, null, null, 0.85);
                        }
                        else {
                            this.stopAutoBetStatus();
                            CommonFun.getInstance().showMsgBox(commonTipsLanguage.cashInsufficientRecharge[language], "SHOP", () => {
                                CommonFun.getInstance().showSmallAddCash()
                            }, false, null, null, null, null, 0.85);
                        }
                    }
                };
            }
            else {
                if (notify.result.result == 19) {         // 余额不足
                    if (GlobalCfg.IS_CLUB_MODE == 1) {  //代理模式不跳转商城
                        CommonFun.getInstance().showMsgBox(commonTipsLanguage.insufficientCash[language], "YES", () => { }, false, null, null, null, null, 0.85);
                    }
                    else {
                        this.stopAutoBetStatus();
                        CommonFun.getInstance().showMsgBox(commonTipsLanguage.cashInsufficientRecharge[language], "SHOP", () => {
                            CommonFun.getInstance().showSmallAddCash()
                        }, false, null, null, null, null, 0.85);
                    }
                }
            };
        }
        else if (msgId === "gameservice.login") {
            CommonFun.getInstance().showMsgBox(result.message, "YES", () => {
                SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.ROCKET, SceneManager.getInstance().sceneType.LOBBY);
                CommonFun.getInstance().decVerticalAcc();
            }, false, null, null, null, null, 0.85);
        }
    },

    btnClick(event) {
        let name = event.node.name;
        if (name == this.btnBack.node.name) {
            GlobalCfg.G_COMPONENTS.Audio.playButton();
            ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, { msgCode: GlobalCfg.CLIENT_MSG_ID.GAME_MENU_CLICK_OUT_TO_LOBBY, msgData: {} });
        }
        else if (name == this.btnSetting.node.name) {
            GlobalCfg.G_COMPONENTS.Audio.playButton();
            this.showSettingNode();
        }
        else if (name == this.btnTrend.node.name) {
            GlobalCfg.G_COMPONENTS.Audio.playButton();
            this.showPointTrendNode();
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

            let userInfo = requester.userInfo;
            let chip = requester.chip ? requester.chip : 0;              // 已下注的
            let cashPoint = requester.cashPoint;    // 领取点
            if (userInfo) {
                this.setSelfPlayerInfo(userInfo);
            }

            let status = scene.status;                  // 当前状态
            this.betStatus = status;
            let currentStatusLeftMs = scene.currentStatusLeftMs;    // 当前状态剩余时间.毫秒(下注，结算)
            let curPoint = scene.point;                 // 当前坐标点
            let trends = scene.openRecord;              // 开奖记录
            this.dealTrendData(trends);
            this.dealRectTrendData(this.pointRecordDataList);
            LoggerUtil.getInstance().log("重连 scene :", scene);
            this.numSelfBet = chip;
            switch (status) {
                case 0:
                    // 下注状态
                    this.isDuringBet = true;
                    this.startBetTimer(currentStatusLeftMs);
                    this.freshWaitLayer(true);
                    break;
                case 1:
                    // 飞行中
                    this.duringFlyTime = curPoint.x / 1000;
                    this.isFlying = true;
                    this.freshWaitLayer(false);
                    this.dealFlyState(curPoint);
                    this.background.getComponent(cc.Animation).play("rotate"); // 背景旋转
                    break;
                case 2:
                    this.freshWaitLayer(false);
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
        const MAX_X = 280;
        const MAX_Y = 160;
        let time = point.x;   // ms
        let mul = point.mul; // 倍数
        this.drawPosX = this.constStartPosX;
        this.duringFlyTime = Number(time / 1000);

        // 只补画最近 ~2.3s 的轨迹，避免一次性画太多
        let limitTime = 2.3;
        let time_s = this.duringFlyTime;
        if (time_s <= limitTime) limitTime = time_s;

        let frameRate = cc.game.getFrameRate();
        let unitTime = 1 / frameRate;                 // 每帧时间
        let drawCount = Math.floor(limitTime / unitTime);

        for (let i = 0; i < drawCount; i++) {
            const x = i * unitTime;

            // 轨迹公式
            let currentY = this.constStartPosY + Math.pow(x, 2) / 10 * this.lineRateMarkOffsetY * 8;
            let deltaX = (unitTime / 3) * this.lineTimeMarkOffsetX;

            // 预计算下一帧位置
            let nextX = this.drawPosX + deltaX;
            let nextY = currentY;

            // ✅ 边界裁剪 + 切换震荡
            if (nextX >= MAX_X || nextY >= MAX_Y) {
                this.drawPosX = Math.min(nextX, MAX_X);
                this.drawPosY = Math.min(nextY, MAX_Y);
                this.flyRocketNode.setPosition(this.drawPosX, this.drawPosY);
                this.setRegion();
                this.isOscillating = true;
                this.setMoveMark(true);
                LoggerUtil.getInstance().log("🎯 重连补画触边，切震荡 at", this.drawPosX, this.drawPosY);
                break;
            }

            // 正常前进
            this.drawPosX = nextX;
            this.drawPosY = nextY;
            this.flyRocketNode.setPosition(this.drawPosX, this.drawPosY);
            this.setRegion();
        }

        // 兜底：循环可能没触发（drawCount==0）或刚好卡边界
        if (this.drawPosX >= MAX_X || this.drawPosY >= MAX_Y) {
            this.drawPosX = Math.min(this.drawPosX, MAX_X);
            this.drawPosY = Math.min(this.drawPosY, MAX_Y);
            this.flyRocketNode.setPosition(this.drawPosX, this.drawPosY);
            this.isOscillating = true;
            this.setMoveMark(true);
        }
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
        LoggerUtil.getInstance().log(`setAutoStatus: infos: ${infos}, count: ${count}`);
        this.currentSetAutoDiamond = GlobalCfg.USER_DATAS.userDiamond; // 当前设置自动的钻石
        this.autoSettingInfos[this.openAutoSettingIndex] = infos
        LoggerUtil.getInstance().log(`setAutoStatus: this.autoSettingInfos: `, this.autoSettingInfos);
        if (this.openAutoSettingIndex == 0) {
            this.node_betinfo1.getComponent('AviatorBetCtrl').setAutoInfo(count);
        }
        else {
            this.node_betinfo2.getComponent('AviatorBetCtrl').setAutoInfo(count);
        }
    },

    dealBetInfo(msgId) {
        if (msgId == 'gameservice.startbettingnotify') {
            // 开始下注阶段通知
            this.node_betinfo1.getComponent('AviatorBetCtrl').StartBet();
            this.node_betinfo2.getComponent('AviatorBetCtrl').StartBet();
            this.node_playerBet.getComponent('AviatorPlayerBet').init();
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
    },


    dealWaitState() {

    },

    loadHead(spriteNode, headId) {
        let random = Math.floor(Math.random() * 72) + 1; // 1-72
        let id = headId == null || headId == 0 ? random : headId;
        spriteNode.getComponent(cc.Sprite).spriteFrame = this.atlas_head.getSpriteFrame("head_" + id);
    },

    /**
     * 设置自己玩家信息
     * @param {UserInfo} data 
     * @returns 
     */
    setSelfPlayerInfo(data) {
        if (!data) return;
        LoggerUtil.getInstance().log('caojun setSelfPlayerInfo data: ', data);
        GlobalCfg.USER_DATAS.userDiamond = data.diamond;
        this.selfPlayer.getChildByName('coin').getComponent(cc.Label).string = GlobalCfg.USER_DATAS.userDiamond / 100;
        LoggerUtil.getInstance().log('selfPlayerInfo data: ', data);
        this.headId = data.imgUrl == 0 ? 1 : data.imgUrl;
    },

    updateSelfCoin() {
        this.selfPlayer.getChildByName('coin').getComponent(cc.Label).string = GlobalCfg.USER_DATAS.userDiamond / 100;
    },

    //获取自己的下注记录
    getBetRecord(notify) {
        LoggerUtil.getInstance().log("getBetRecord notify = ", notify);
        let node = cc.instantiate(this.prefabMybet);
        node.setPosition(cc.v2(0, -170));
        node.getComponent("AviatorMybet").setData(notify);
        GlobalCfg.ACT_SCENE_CTRL.popupLayer.addChild(node);
        GlobalCfg.ACT_SCENE_CTRL.popupLayer.active = true;
    },

    // ******************************************************************************************
    /**
     * 开始下注阶段
     * @param {Number} remainder 剩余时间 ms
     */
    startBetTimer(remainder) {
        if (this.betDuration == remainder) {
            this.numSelfBet = 0;
        }
        this.freshWaitLayer(true);
        this.playerGetOutParent.removeAllChildren();
        this.isDuringBet = true;
        this.isFlying = false;
        this.setMoveMark(false);

        let time = null, count = null;
        if (remainder) {
            time = remainder;
            count = time;
        } else {
            time = this.betDuration;
            count = time;
        }

        if (this.betTimerTween) {
            this.betTimerTween.stop();
            this.betTimerTween = null;
        }
        // this.timerBar.node.getChildByName("logo").getComponent(cc.Animation).play("rotate2");
        this.timerBar.node.stopAllActions();
        this.timerBar.progress = 1;
        this.betTimerTween = cc.tween(this.timerBar)
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
        this.updateRateCD = 0;
        this.isOscillating = false;
        this.flyRocketNode.setPosition(this.drawPosX, this.drawPosY);
        this.region.width = 0;
        this.region.height = 0;
        this.freshWaitLayer(false);
        this.isMoveTimeMark = false;
        this.updateCenterRate(1);
        this.isFlying = true;
        this.drawLine = true;
        this.background.getComponent(cc.Animation).play("rotate");
        this.rewardPosNode.removeAllChildren();
    },

    rocketEnd(notify) {
        LoggerUtil.getInstance().warn("rocketEnd", notify);
        if (!notify) return;
        this.isOscillating = false;
        this.isFlying = false;
        this.drawLine = false;
        this.region.width = 0;
        this.region.height = 0;
        let time = notify.x;
        let rate = notify.mul;
        let jackpotPool = notify.jackpotPool;
        let point = { x: time, mul: rate };
        this.updateCenterRate(CommonFun.getInstance().fixed(rate / 1000), true);
        this.flyEndAnimion(point);
        this.background.getComponent(cc.Animation).stop();
        this.checkAutoSettingStatus();
    },

    flyEndAnimion(point) {
        // 使用tween实现爆炸后飞向终点
        cc.tween(this.flyRocketNode)
            .to(0.4, {
                position: this.endFlyPos
            }, { easing: 'sineOut' })
            .call(() => {
                this.updateTrendData(point);
                this.updateRectTrendNode(this.pointRecordDataList[this.pointRecordDataList.length - 1], true);
                // this.curRoundAddCoinFinish();
            })
            .start();
    },

    curRoundAddCoinFinish() {
        if (cc.isValid(this)) {
            let minLimit = this.btnBetCoinNum[0] || 0;
            CommonFun.getInstance().gameShowSecondRecharge(minLimit, this.numSelfBet);
            CommonFun.getInstance().showWithdrawToastInGame();
        }
    },

    showReward(notify) {
        let pos = cc.Vec2(0, 0);
        if (this.rewardPosNode.children.length > 0) {
            pos = cc.Vec2(0, 90);
        }
        let prefabRwd = cc.instantiate(this.prefabReward);
        prefabRwd.setPosition(pos);
        this.rewardPosNode.addChild(prefabRwd);
        prefabRwd.getComponent("AviatorReward").setData(notify);
        this.checkAutoSettingStatus(notify.mul);
        let rootPos = notify.pos;
        LoggerUtil.getInstance().log("showReward notify = ", notify);
        if (rootPos === 0) {
            this.node_betinfo1.getComponent("AviatorBetCtrl").showReward();
        } else if (rootPos === 1) {
            this.node_betinfo2.getComponent("AviatorBetCtrl").showReward();
        } else {
            // pos 字段缺失时兜底，两个都更新
            this.node_betinfo1.getComponent("AviatorBetCtrl").showReward();
            this.node_betinfo2.getComponent("AviatorBetCtrl").showReward();
        }
    },

    checkAutoSettingStatus(curWinMult = 0) {
        if (this.currentSetAutoDiamond == 0) {
            return;
        }
        let targetValue = GlobalCfg.USER_DATAS.userDiamond - this.currentSetAutoDiamond;
        LoggerUtil.getInstance().log(`checkAutoSettingStatus:`, this.autoSettingInfos);
        LoggerUtil.getInstance().log(`checkAutoSettingStatus targetValue :`, targetValue);
        for (let index = 0; index < 2; index++) {
            if (this.autoSettingInfos[index] != null) {
                let infos = this.autoSettingInfos[index];
                let betCtrl = this[`node_betinfo${index + 1}`].getComponent('AviatorBetCtrl')
                if (infos[0] > 0 && targetValue < 0 && infos[0] <= Math.abs(targetValue)) {
                    betCtrl.dealStopAutoEvent();
                    this.autoSettingInfos[index] = null;
                    this.currentSetAutoDiamond = 0;
                    break;
                }
                if (infos[1] > 0 && targetValue > 0 && infos[1] <= targetValue) {
                    betCtrl.dealStopAutoEvent();
                    this.autoSettingInfos[index] = null;
                    this.currentSetAutoDiamond = 0;
                    break;
                }
                if (infos[2] > 0 && (curWinMult / 10) >= infos[2]) {
                    betCtrl.dealStopAutoEvent();
                    this.autoSettingInfos[index] = null;
                    this.currentSetAutoDiamond = 0;
                    break;
                }
            }
        }
    },

    stopAutoBetStatus() {
        this.node_betinfo1.getComponent('AviatorBetCtrl').dealStopAutoEvent();
        this.node_betinfo2.getComponent('AviatorBetCtrl').dealStopAutoEvent();
    },

    // ***************************************************************************************
    /**
     * 处理走势数据
     * @param {*
        }
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

        const start = Math.max(0, data.length - this.trendMaxNum);
        const latest = data.slice(start); // 旧 ... 新

        // 反向添加：新 -> 旧；这样左到右就是 新 -> 旧
        for (let i = latest.length - 1; i >= 0; i--) {
            const trendNode = cc.instantiate(this.prefabTrendItem);
            const ctrl = trendNode.getComponent("AviatorRecordRectCtrl");
            if (ctrl) ctrl.init(latest[i], false); // 初始化不播缩放动画
            this.nodeTrendParent.addChild(trendNode);
            this.rectTrendNodeArray.push(trendNode);
        }
    },

    /**
     * 生成矩形走势数据节点
     */
    createRectTrendNode(data, isShowAnim = false) {
        let trendNode = cc.instantiate(this.prefabTrendItem);
        let RocketRecordRectCtrl = trendNode.getComponent("AviatorRecordRectCtrl");
        if (RocketRecordRectCtrl) {
            RocketRecordRectCtrl.init(data, isShowAnim);
            this.nodeTrendParent.addChild(trendNode);
            this.rectTrendNodeArray.push(trendNode);
        }
    },

    // 计算一格位移
    getTrendItemShift() {
        const parent = this.nodeTrendParent;
        const layout = parent.getComponent(cc.Layout);
        const spacing = layout ? layout.spacingX : 0;
        const sample = this.rectTrendNodeArray[0] || parent.children[0];
        const width = sample ? sample.width : (this.prefabTrendItem?.data?.width || 110);
        return width + spacing;
    },

    // 先右移旧项；领先一点时间后再让新项在最左淡入+弹出
    animateInsertTrendLeft(newNode) {
        const parent = this.nodeTrendParent;
        const layout = parent.getComponent(cc.Layout);
        const hadLayout = !!(layout && layout.enabled);
        if (hadLayout) layout.enabled = false;

        const shift = this.getTrendItemShift();
        const hasChildren = parent.children.length > 0;
        const baseY = hasChildren ? parent.children[0].y : 0;
        const leftX = hasChildren ? parent.children[0].x : 0;

        // 先把新节点插入最左，但设成“不可见”，避免与旧项重叠时看到
        newNode.setPosition(leftX, baseY);
        newNode.opacity = 0;
        newNode.scale = 0.8;
        newNode.active = true;
        parent.insertChild(newNode, 0);

        // 旧项统一右移
        const moveDur = 1.2;             // 右移总时长（已放慢）
        const leadDelay = 0.25;           // 领先时间：旧项先挪开一点
        for (let i = 1; i < parent.children.length; i++) {
            const child = parent.children[i];
            cc.tween(child).by(moveDur, { position: cc.v2(shift, 0) }, { easing: 'cubicOut' }).start();
        }

        // 领先一点时间后，新节点再出现（只做淡入+弹出缩放，不做位移动画）
        this.scheduleOnce(() => {
            // 显示新节点（淡入）
            cc.tween(newNode).to(0.08, { opacity: 255 }).start();
            // 弹出缩放
            cc.tween(newNode)
                .to(0.8, { scale: 1.3 }, { easing: 'quadOut' })
                .to(0.2, { scale: 1 }, { easing: 'quadIn' })
                .start();
        }, leadDelay);

        // 收尾：右移结束后再恢复 Layout
        this.scheduleOnce(() => {
            if (hadLayout) {
                layout.enabled = true;
                layout.updateLayout();
            }
        }, moveDur + 0.02);
    },

    // 增量更新：移除最右 → 新项最左（先不播动画，交给 animateInsertTrendLeft 控制时机）
    updateRectTrendNode(data) {
        if (this.rectTrendNodeArray.length >= this.trendMaxNum) {
            const rightMost = this.rectTrendNodeArray.pop();
            rightMost.removeFromParent(true);
            if (cc.isValid(rightMost)) rightMost.destroy();
        }

        const trendNode = cc.instantiate(this.prefabTrendItem);
        const ctrl = trendNode.getComponent("AviatorRecordRectCtrl");
        if (ctrl) ctrl.init(data, false);   // 不要立刻播出现动画

        this.rectTrendNodeArray.unshift(trendNode); // 最新放数组头
        this.animateInsertTrendLeft(trendNode);     // 旧项先右移 → 新项再出现
    },
    /**
     * 展示点形走势数据
     * @param {*} msg 
     */
    showPointTrendNode() {
        let node = cc.instantiate(this.prefabRecord);
        node.getComponent("AviatorRecord").init(this.pointRecordDataList);
        node.setPosition(cc.v2(0, -36));
        this.popupLayer.addChild(node);
        this.popupLayer.active = true;
        this.touchbg.active = true;
    },

    /**
     * 展示设置界面
     * @param {*} msg 
     */
    showSettingNode() {
        let node = cc.instantiate(this.prefabSetting);
        node.setPosition(cc.v2(100, -386));
        this.popupLayer.addChild(node);
        this.popupLayer.active = true;
        this.touchbg.active = true;
    },

    setAviatorAnimation(isShow) {
        this.isHideAviatorAnim = isShow;
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
                ctrl.updateRate(CommonFun.getInstance().fixed(rate), isEnd);
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

    update(dt) {
        if (!this.isFlying) return;

        // ✅ 飞行期间倍率始终增长
        // let rate = 1 + Math.pow(this.duringFlyTime, 2) / 20
        let rate = this.aviatorMultManager.getSpeedRate(this.duringFlyTime)
        if (this.updateRateCD % 6 == 0) {//每6帧更新一次倍率
            this.updateCenterRate(rate);
        }
        this.updateRateCD++;
        // ✅ 正确震荡逻辑：震荡时一定执行
        this.duringFlyTime += dt;
        if (this.isOscillating) {
            // 震荡配置
            const baseX = this.drawPosX;
            const baseY = this.drawPosY;
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
        let currentY = this.constStartPosY + Math.pow(this.duringFlyTime, 2) / 70 * this.lineRateMarkOffsetY * 8;
        let deltaX = (dt / 9) * this.lineTimeMarkOffsetX;

        if (this.isMoveTimeMark) this.moveTimeMark(deltaX);

        this.drawPosX += deltaX;
        this.drawPosY = currentY;
        this.flyRocketNode.setPosition(this.drawPosX, this.drawPosY);
        this.setRegion();

        // ✅ 当达到边界时，切换为震荡阶段（一次性）
        if (!this.isOscillating && (this.drawPosX >= 280 || this.drawPosY >= 160)) {
            this.drawPosX = Math.min(this.drawPosX, 280);
            this.drawPosY = Math.min(this.drawPosY, 160);
            this.flyRocketNode.setPosition(this.drawPosX, this.drawPosY);
            this.isOscillating = true;
            this.setMoveMark(true);
            LoggerUtil.getInstance().log("🎯 切换为震荡阶段 at", this.drawPosX, this.drawPosY);
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
