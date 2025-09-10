
cc.Class({
    extends: cc.Component,

    properties: {
        // default
        btnBack: cc.Button,
        selfPlayer: cc.Node,
        btnSetting: cc.Button,

        // main
        node_content: cc.Node,
        node_item: cc.Node,

        node_betinfo: cc.Node,
        // Prefabs
        prefabSetting: cc.Prefab,
        prefabMybet: cc.Prefab,
        prefabReward: cc.Prefab,

        atlas_head: cc.SpriteAtlas,     // 头像图集
    },

    ctor() {
        // Config
        this.isHide = false;                                // 是否后台隐藏
        this.chickenMessageManager = null;      // 存放消息的管理器
        this.headId = 1; // 头像ID
    },

    onLoad: function () {
        CommonFun.getInstance().addVerticalAcc();
        CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.SHOW_CRASH_GAME);
        GlobalCfg.ACT_SCENE_CTRL = this;
        this.chickenMessageManager = this.node.getComponent('ChickenMessageManager');
        this.chickenMessageManager.sendLoginMessage();
        this.chickenAudioManager = this.node.getComponent('ChickenAudioManager');
        CommonFun.getInstance().showProgress();


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


    /**
     * 初始化变量
     */
    setDefaultValueOfVariables() {
    },

    unscheduleAll() {
        this.unschedule(this.scheduleWaitBetCallback);
    },


    initialization() {
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
            ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, { msgCode: GlobalCfg.CLIENT_MSG_ID.GAME_MENU_CLICK_OUT_TO_LOBBY, msgData: {} });
        }
        else if (name == this.btnSetting.node.name) {
            GlobalCfg.G_COMPONENTS.Audio.playButton();
            this.showSettingNode();
        }
    },

    // ******************************************************************************************

    /**
     * 处理登录数据
     * @param {Object} data 
     * @returns 
     */
    dealLoginData(data) {
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
        this.selfPlayer.getChildByName('coin').getComponent(cc.Label).string = GlobalCfg.USER_DATAS.userDiamond / 100;
        LoggerUtil.getInstance().log('selfPlayerInfo data: ', data);
        this.headId = data.imgUrl == 0 ? 1 : data.imgUrl;
    },

    updateSelfCoin() {
        this.selfPlayer.getChildByName('coin').getComponent(cc.Label).string = GlobalCfg.USER_DATAS.userDiamond / 100;
    },

    // ******************************************************************************************
    showReward(notify) {
    },

    stopAutoBetStatus() {

    },

    // ***************************************************************************************
    /**
     * 处理走势数据
     * @param {*
        }
    },

    // ***************************************************************************************
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
    update(dt) {
    },

});
