
cc.Class({
    extends: cc.Component,

    properties: {
        // default
        btnBack: cc.Button,
        selfPlayer: cc.Node,
        btnSetting: cc.Button,
        btnHowtoPlay: cc.Button,

        // main
        chickenObj: cc.Node,
        startPos: cc.Node,
        node_content: cc.Node,
        node_item: cc.Node,
        node_map_start: cc.Node,
        node_map_end: cc.Node,

        node_betinfo: cc.Node,
        // Prefabs
        prefabSetting: cc.Prefab,
        prefabMybet: cc.Prefab,
        prefabReward: cc.Prefab,
        prefabHowtoPlay: cc.Prefab,
        prefabAutoBet: cc.Prefab,

        atlas_head: cc.SpriteAtlas,     // 头像图集
    },

    ctor() {
        // Config
        this.isHide = false;                                // 是否后台隐藏
        this.chickenMessageManager = null;      // 存放消息的管理器
        this.headId = 1; // 头像ID
        this.mapListArr = []; // 地图列表
        this.curStandMapIndex = -1; // 当前地图索引
        this.mapMaxCount = 24; // 最大地图数量 默认24
        this.difficulty = 0; // 难度
        this.isGaming = false; // 是否正在游戏
        this.curWinMoney = 0; // 当前赢钱
        this.randomDeadMapIndex = 0 // 随机死亡地图索引
    },

    onLoad: function () {
        CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.SHOW_CRASH_GAME);
        GlobalCfg.ACT_SCENE_CTRL = this;
        this.chickenMessageManager = this.node.getComponent('ChickenMessageManager');
        this.chickenMessageManager.sendLoginMessage();
        this.chickenAudioManager = this.node.getComponent('ChickenAudioManager');
        this.chickenDataManager = this.node.getComponent('ChickenData');
        CommonFun.getInstance().showProgress();
        this.mapPool = new cc.NodePool();  // 用来存放复用的地图格子

        this.msgHandle = ClientNotify.register(GlobalCfg.MSG_TYPE.serverMsg, this.onEventMsg, this);
        this.customMsgHandle = ClientNotify.register(GlobalCfg.MSG_TYPE.clientMsg, this.onEventMsg, this);
    },

    onDestroy() {
        GlobalCfg.ACT_SCENE_CTRL = null;
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
            this.chickenMessageManager.sendRefreshMessage();
        }, this);
        this.initialization();
        LoggerUtil.getInstance().warn("当前游戏帧率", cc.game.getFrameRate());
        this.chickenAudioManager.playGameMusic();
    },
    // 取节点
    getMapItem() {
        let item = null;
        if (this.mapPool.size() > 0) {
            item = this.mapPool.get();
        } else {
            item = cc.instantiate(this.node_item);
        }
        return item;
    },

    // 回收节点
    putMapItem(node) {
        node.removeFromParent(false);
        this.mapPool.put(node);
    },

    /**
     * 初始化变量
     */
    setDefaultValueOfVariables() {
    },

    initGame() {
        this.curStandMapIndex = -1;
        this.chickenObj.active = true;
        this.chickenObj.setParent(this.startPos);
        this.chickenObj.setPosition(cc.Vec2(0, 0));

        for (let i = 0, len = this.mapListArr.length; i < len; i++) {
            let mapItem = this.mapListArr[i]
            let script = mapItem.getComponent('ChickenMapItem');
            script.init(i == len - 1);
        }
        this.node_betinfo.getComponent('ChickenBet').init();
        let endPos2 = cc.v2(this.contentStartPosX, 0);
            cc.tween(this.node_content)
            .to(1, { position: endPos2 }, {
                easing: 'quadOut'})
            .start();
    },

    startGame() {
        this.curWinMoney = 0;
        this.isGaming = true;
        //TODO 这里跟服务器发送开始游戏的请求
        this.chickenMove();
    },
    //进入结束游戏阶段
    endGame(){
        LoggerUtil.getInstance().log("进入结束游戏阶段");
        this.isGaming = false;
        this.node_betinfo.getComponent("ChickenBet").setButtonEnabled(true);

        if (this.isAutoGame) {
            this.autoTime--;
            this.isPause = false;
            this.node_betinfo.getComponent("ChickenBet").startAutoGame(this.autoTime);
            if (this.autoTime <= 0) {
                this.stopAutoSchedule(); // 停止自动调度
            }
        }
        this.initGame();
    },

    unscheduleAll() {
    },

    initialization() {
        this.contentStartPosX = this.node_content.position.x;
        this.popupLayer = this.node.getChildByName('root').getChildByName('popupLayer');       // 弹窗层
        this.touchbg = this.node.getChildByName(`root`).getChildByName(`touchbg`);

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
        this.btnHowtoPlay.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);

        //加载地图数据
        this.setMap();
    },

    setMap() {
        // 先把原有的 mapListArr 全部回收进对象池
        for (let i = 0; i < this.mapListArr.length; i++) {
            this.putMapItem(this.mapListArr[i]);
        }
        this.mapListArr = [];

        let mapConfig = this.chickenDataManager.getMapConfig(this.difficulty);
        this.mapMaxCount = mapConfig.length;

        // 遍历配置，动态创建或取出
        for (let i = 0, len = this.mapMaxCount; i < len; i++) {
            let mapItem = this.getMapItem();
            let script = mapItem.getComponent('ChickenMapItem');
            mapItem.active = true;
            mapItem.position = cc.v2(mapItem.position.x, 0);

            let index = i % 4; // 0-3
            script.setPanel(index, i == len - 1);
            script.setData(mapConfig[i]);

            this.mapListArr.push(mapItem);
            this.node_content.addChild(mapItem);
        }
        this.node_map_end.setSiblingIndex(Infinity);
    },

    onEventMsg(webData, target) {
        let self = target;
        var msgId = webData.msgCode;
        var notify = webData.msgData;
        if (msgId === "gameservice.login") {
            // 登录游戏
            self.dealLoginData(notify);
        }
        else if (msgId == "gameservice.exit") {
            SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.ROCKET, SceneManager.getInstance().sceneType.LOBBY);
        }
        else if (msgId == "lobbyservice.kicktolobby") {
            SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.ROCKET, SceneManager.getInstance().sceneType.LOBBY);
        }
        else if (msgId == 'gameservice.getplayerrecord') {
            //获取自己的投注记录
            self.getBetRecord(notify);
        }
        else if (msgId == GlobalCfg.CLIENT_MSG_ID.CURRENCY_CHANGED_USER_INFO) {
            self.selfPlayer.getChildByName('lab_coin').getComponent(cc.Label).string = GlobalCfg.USER_DATAS.userDiamond / 100;
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
                            CommonFun.getInstance().showMsgBox('Insufficient cash', "YES", () => { }, false, null, null, null, null, 0.85);
                        }
                        else {
                            this.stopAutoBetStatus();
                            CommonFun.getInstance().showMsgBox('Your cash is insufficient, Please recharge in time!', "SHOP", () => {
                                CommonFun.getInstance().showSmallAddCash()
                            }, false, null, null, null, null, 0.85);
                        }
                    }
                };
            }
            else {
                if (notify.result.result == 19) {         // 余额不足
                    if (GlobalCfg.IS_CLUB_MODE == 1) {  //代理模式不跳转商城
                        CommonFun.getInstance().showMsgBox('Insufficient cash', "YES", () => { }, false, null, null, null, null, 0.85);
                    }
                    else {
                        this.stopAutoBetStatus();
                        CommonFun.getInstance().showMsgBox('Your cash is insufficient, Please recharge in time!', "SHOP", () => {
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
            this.chickenMessageManager.sendExitMessage();
        }
        else if (name == this.btnSetting.node.name) {
            GlobalCfg.G_COMPONENTS.Audio.playButton();
            this.showSettingNode();
        }
        else if (name == this.btnHowtoPlay.node.name) {
            GlobalCfg.G_COMPONENTS.Audio.playButton();
            this.showHowToPlayNode();
        }
    },

    // ******************************************************************************************

    /**
     * 处理登录数据
     * @param {Object} data 
     * @returns 
     */
    dealLoginData(data) {
        this.unscheduleAll();
        if (!data) return;
        let whole = data.whole;
        let scene = whole?.scene;
        let requester = whole?.requester;

        if (scene && requester) {
            let userInfo = requester.userInfo;
            if (userInfo) {
                this.setSelfPlayerInfo(userInfo);
            }
        } else {
            LoggerUtil.getInstance().error("LoginData error");
            return;
        }
    },

    dealSendMsgInfo() {

    },

    loadHead(spriteNode, headId) {
        let random = Math.floor(Math.random() * 12) + 1; // 1-12
        let id = headId == null || headId == 0 ? random : headId;
        spriteNode.getComponent(cc.Sprite).spriteFrame = this.atlas_head.getSpriteFrame("img_head_" + id);
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
        this.selfPlayer.getChildByName('lab_coin').getComponent(cc.Label).string = GlobalCfg.USER_DATAS.userDiamond / 100;
        LoggerUtil.getInstance().log('selfPlayerInfo data: ', data);
        this.headId = data.imgUrl == 0 ? 1 : data.imgUrl;
    },

    updateSelfCoin() {
        this.selfPlayer.getChildByName('lab_coin').getComponent(cc.Label).string = GlobalCfg.USER_DATAS.userDiamond / 100;
    },
    withDraw() {
        //TODO 提现
        this.showReward();
    },

    showAutoSetting() {
        let node = cc.instantiate(this.prefabAutoBet);
        node.setPosition(cc.v2(0, 0));
        let mapConfig = this.chickenDataManager.getMapConfig(this.difficulty); //获取地图配置
        LoggerUtil.getInstance().log('showAutoSetting: this.difficulty', this.difficulty);
        LoggerUtil.getInstance().log('showAutoSetting: mapConfig', mapConfig);
        node.getComponent('ChickenAutoSetting').init(mapConfig);
        this.popupLayer.addChild(node);
        this.popupLayer.active = true;
        this.touchbg.active = true;
    },

    // ******************************************************************************************
    showReward(notify) {
        let mapConfig = this.chickenDataManager.getMapConfig(this.difficulty); //获取地图配置
        let node = cc.instantiate(this.prefabReward);
        node.setPosition(cc.v2(0, 0));
        node.getComponent('ChickenReward').setData({mul: mapConfig[this.curStandMapIndex], amount: this.curWinMoney});
        this.popupLayer.addChild(node);
        this.popupLayer.active = true;
        this.touchbg.active = true;
    },

    //获取自己的下注记录
    getBetRecord(notify) {
        let node = cc.instantiate(this.prefabMybet);
        node.setPosition(cc.v2(0, 0));
        node.getComponent("ChickenMybet").setData(notify);
        this.popupLayer.addChild(node);
        this.popupLayer.active = true;
        this.touchbg.active = true;
    },

    // ***************************************************************************************

    chickenMove() {
        this.curStandMapIndex++;

        if (this.isAutoGame) {
            if (this.curStandMapIndex >= this.autoGameLevel - 1) {
                this.isPause = true; //暂停
                let isEnd = this.curStandMapIndex >= (this.mapMaxCount - 1)
                this.chickenMoveTo(this.curStandMapIndex, isEnd, ()=> {
                    this.withDraw(); //走提现逻辑
                }
                );
                return;
            }
        }
        if (this.curStandMapIndex >= (this.mapMaxCount - 1)) {
            this.chickenMoveTo(this.curStandMapIndex, true);
            return;
        }
        this.chickenMoveTo(this.curStandMapIndex);
    },
    chickenMoveTo(index, isEnd, callback) {
        let node = this.chickenObj;
        let newParent = this.mapListArr[index];
        let endPos = cc.v2(0, -151);
        let duration = 0.3;
        let mapConfig = this.chickenDataManager.getMapConfig(this.difficulty); //获取地图配置
        this.curWinMoney = mapConfig[index] * this.node_betinfo.getComponent("ChickenBet").getCurBet();
        this.node_betinfo.getComponent("ChickenBet").setMultiplier(this.curWinMoney);
        //如果移动到第三格 则屏幕往左移202个像素
        if (index >= 2 && index < this.mapMaxCount - 5) {
            let endPos2 = cc.v2(this.node_content.x - 202, 0);
            cc.tween(this.node_content)
            .to(duration, { position: endPos2 }, {
                easing: 'quadOut'})
            .start();
        }
        // 1. 保存切换前的世界坐标
        let worldPos = node.parent.convertToWorldSpaceAR(node.position);

        // 2. 设置新的父节点
        node.setParent(newParent, false);

        // 3. 转换回新父节点的局部坐标（保持位置不变）
        let startPos = newParent.convertToNodeSpaceAR(worldPos);
        node.setPosition(startPos);
        node.getChildByName("kun").getComponent(sp.Skeleton).setAnimation(0, "skill", false);
        // 4. tween 实现平移
        cc.tween(node)
            .to(duration, { position: endPos }, {
                progress: function (start, end, current, ratio) {
                    // X 插值
                    let x = startPos.x + (endPos.x - startPos.x) * ratio;
                    // Y 插值（线性）
                    let y = startPos.y + (endPos.y - startPos.y) * ratio;
                    return cc.v2(x, y);
                }
            })
            .call(() => {
                if (this.curStandMapIndex == this.randomDeadMapIndex) { //如果触发死亡
                    this.isPause = true; //暂停
                    this.chickenObj.active = false;
                    this.mapListArr[this.curStandMapIndex].getComponent('ChickenMapItem').playDead(
                        ()=>{
                            this.endGame()
                        }
                    );
                    return;
                }
                if (isEnd) {
                    //达到终点 直接跳最终奖励界面
                    this.mapListArr[index].getComponent('ChickenMapItem').rotate(4);
                    this.node_betinfo.getComponent("ChickenBet").setPlayButtonEnabled(false);
                    setTimeout(() => {
                        this.withDraw();
                    }, 300);
                    setTimeout(() => {
                        this.node_betinfo.getComponent("ChickenBet").setPlayButtonEnabled(true);
                    }, 3000); // 延时 2 秒
                }else{
                    this.mapListArr[index].getComponent('ChickenMapItem').rotate(1);
                }
                if (index > 0) {
                    setTimeout(() => {
                        this.mapListArr[index - 1].getComponent('ChickenMapItem').rotate(2);
                    }, 100); // 延时 0.1 秒
                }
                if(callback){
                    setTimeout(() => {
                        callback();
                    }, 1000);
                }
                })

            .start()
    },

    setDiffculty(difficulty) {
        this.difficulty = difficulty;
        let mapConfig = this.chickenDataManager.getMapConfig(this.difficulty); //获取地图配置
        this.randomDeadMapIndex = Math.random(0, mapConfig.length - 1); //随机生成一个死亡地图索引
        // this.randomDeadMapIndex = 0
        this.setMap();
    },

    startAutoGame(data) {
        LoggerUtil.getInstance().log("startAutoGame data: ", data);
        this.isAutoGame = true;
        this.autoTime = data.time;   // 自动轮数
        this.autoGameLevel = data.level; // 自动关数
        this.curWinMoney = 0;
        this.startGame();
        this.node_betinfo.getComponent("ChickenBet").startAutoGame(this.autoTime);

        this.startAutoSchedule(); // 开始自动调度
    },

    startAutoSchedule() {
        // 先清理掉旧的定时器
        this.unschedule(this._autoMoveCallback);
        // 定义回调
        this._autoMoveCallback = () => {
            if (this.isAutoGame && !this.isPause && this.autoTime > 0) {
                this.chickenMove();
            }
        };
        // 每隔 1 秒调一次
        this.schedule(this._autoMoveCallback, 1);
    },

    stopAutoSchedule() {
        this.isAutoGame = false; // 停止自动游戏
        this.isPause = false; // 停止暂停
        if (this._autoMoveCallback) {
            this.unschedule(this._autoMoveCallback);
            this._autoMoveCallback = null;
        }
        this.node_betinfo.getComponent("ChickenBet").endAutoGame();
    },

    //暂停或者继续游戏
    pauseGame(isPause) {
        this.isPause = isPause;
    },
    // ***************************************************************************************
    /**
     * 展示设置界面
     * @param {*} msg 
     */
    showSettingNode() {
        let node = cc.instantiate(this.prefabSetting);
        node.setPosition(cc.v2(700, 10));
        this.popupLayer.addChild(node);
        this.popupLayer.active = true;
        this.touchbg.active = true;
    },
    //展示帮助界面
    showHowToPlayNode() {
        let node = cc.instantiate(this.prefabHowtoPlay);
        node.setPosition(cc.v2(0, 0));
        this.popupLayer.addChild(node);
        this.popupLayer.active = true;
        this.touchbg.active = true;
    },
    update(dt) {
    },

});
