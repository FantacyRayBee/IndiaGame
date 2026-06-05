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

        // online
        node_online: cc.Node,
        item_online: cc.Node,
        lab_onlineCount: cc.Label,

        // Prefabs
        prefabSetting: cc.Prefab,
        prefabMybet: cc.Prefab,
        prefabReward: cc.Prefab,
        prefabHowtoPlay: cc.Prefab,
        prefabAutoBet: cc.Prefab,

        atlas_head: cc.SpriteAtlas,
    },

    ctor() {
        // 状态
        this.isHide = false;
        this.isGaming = false;
        this.isAutoGame = false;
        this.isPause = false;
        this.isMoving = false;   // 是否正在播放移动 tween
        this.isWaitingReward = false;   // ★ 是否在等待开奖/奖励动画结束

        this.msgIsSend = false;            // 是否有未完成的 bet 请求
        this.autoTime = 0;                 // 自动剩余轮数
        this.autoGameLevel = 1;            // 自动关数
        this._autoMoveCallback = null;     // 调度回调

        // 地图/位置
        this.mapListArr = [];
        this.curStandMapIndex = -1;
        this.mapMaxCount = 24;
        this.difficulty = 0;
        this.curWinMoney = 0;
        this.deadMapIndex = Infinity;

        this.mapPool = null;

        // 组件
        this.chickenMessageManager = null;
        this.chickenAudioManager = null;
        this.chickenDataManager = null;
        this.headId = 1;
    },

    onLoad() {
        CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.SHOW_CRASH_GAME);
        GlobalCfg.ACT_SCENE_CTRL = this;

        this.chickenMessageManager = this.node.getComponent('ChickenMessageManager');
        this.chickenAudioManager   = this.node.getComponent('ChickenAudioManager');
        this.chickenDataManager    = this.node.getComponent('ChickenData');

        this.chickenMessageManager.sendLoginMessage();
        CommonFun.getInstance().showProgress();

        this.mapPool = new cc.NodePool();

        // 注册消息监听
        this.msgHandle = ClientNotify.register(GlobalCfg.MSG_TYPE.serverMsg, this.onEventMsg, this);
        this.customMsgHandle = ClientNotify.register(GlobalCfg.MSG_TYPE.clientMsg, this.onEventMsg, this);

        const size = cc.view.getFrameSize();
        let frameW = size.width;
        let frameH = size.height;
        this.isSmallScreen = (frameW / frameH) < 2;
        if (this.isSmallScreen) {
            this.node_betinfo.getChildByName("info").scale = 0.85;
        }
    },

    onDestroy() {
        GlobalCfg.ACT_SCENE_CTRL = null;
        ClientNotify.removeByHandle(GlobalCfg.MSG_TYPE.serverMsg, this.msgHandle);
        ClientNotify.removeByHandle(GlobalCfg.MSG_TYPE.clientMsg, this.customMsgHandle);
        CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.EXIT_CRASH_GAME);
    },

    start() {
        this.initOnline();
        this.initialization();
    },

    // ========== 地图对象池 ========== 
    getMapItem() {
        return this.mapPool.size() > 0 ? this.mapPool.get() : cc.instantiate(this.node_item);
    },
    putMapItem(node) {
        node.removeFromParent(false);
        this.mapPool.put(node);
    },

    // ========== 初始化/UI ==========
    initialization() {
        this.contentStartPosX = this.node_content.position.x;
        this.popupLayer = this.node.getChildByName('root').getChildByName('popupLayer');
        this.touchbg    = this.node.getChildByName('root').getChildByName('touchbg');

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

        this.setMap();
        this.initGame();
    },

    btnClick(event) {
        let name = event.node.name;
        if (name === this.btnBack.node.name) {
            GlobalCfg.G_COMPONENTS.Audio.playButton();
            this.chickenMessageManager.sendExitMessage();
        } else if (name === this.btnSetting.node.name) {
            GlobalCfg.G_COMPONENTS.Audio.playButton();
            this.showSettingNode();
        } else if (name === this.btnHowtoPlay.node.name) {
            GlobalCfg.G_COMPONENTS.Audio.playButton();
            this.showHowToPlayNode();
        }
    },

    setMap() {
        for (let i = 0; i < this.mapListArr.length; i++) this.putMapItem(this.mapListArr[i]);
        this.mapListArr = [];

        let mapConfig = this.chickenDataManager.getMapConfig(this.difficulty);
        this.mapMaxCount = mapConfig.length;

        for (let i = 0; i < this.mapMaxCount; i++) {
            let mapItem = this.getMapItem();
            let script = mapItem.getComponent('ChickenMapItem');
            mapItem.active = true;
            mapItem.position = cc.v2(mapItem.position.x, 0);
            let idx4 = i % 4;
            script.setPanel(idx4, i === this.mapMaxCount - 1);
            script.setData(mapConfig[i]);
            this.mapListArr.push(mapItem);
            this.node_content.addChild(mapItem);
        }
        this.node_map_end.setSiblingIndex(Infinity);
    },

    // ========== 服务器消息 ==========
    onEventMsg(webData, target) {
        let self = target;
        const msgId = webData.msgCode;
        const notify = webData.msgData;

        if (msgId === 'gameservice.bet') {
            self.msgIsSend = false;
            self.dealBetResult(notify);
        }
        else if (msgId === 'gameservice.cash') {
            self.dealCashOutResult(notify);
        }
        else if (msgId == 'gameservice.loadwhole') {
            self.setMap();
            self.initGame();
        }
        else if (msgId === "gameservice.login") {
            self.dealLoginData(notify);
        }
        else if (msgId === "gameservice.exit" || msgId === "lobbyservice.kicktolobby") {
            SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.ROCKET, SceneManager.getInstance().sceneType.LOBBY);
        }
        else if (msgId === 'gameservice.getplayerrecord') {
            self.getBetRecord(notify);
        }
        else if (msgId === GlobalCfg.CLIENT_MSG_ID.CURRENCY_CHANGED_USER_INFO) {
            self.selfPlayer.getChildByName('lab_coin').getComponent(cc.Label).string = GlobalCfg.USER_DATAS.userDiamond / 100;
        }
    },

    dealLoginData(data) {
        // this.unscheduleAllCallbacks();
        if (!data) return;
        let userInfo = data?.whole?.requester?.userInfo;
        if (userInfo) this.setSelfPlayerInfo(userInfo);
    },

    setSelfPlayerInfo(data) {
        if (!data) return;
        GlobalCfg.USER_DATAS.userDiamond = data.diamond;
        this.selfPlayer.getChildByName('lab_coin').getComponent(cc.Label).string = GlobalCfg.USER_DATAS.userDiamond / 100;
        this.headId = data.imgUrl == 0 ? 1 : data.imgUrl;
    },

    getBetRecord(notify) {
        let node = cc.instantiate(this.prefabMybet);
        node.setPosition(cc.v2(0, 0));
        node.getComponent("ChickenMybet").setData(notify);
        this.popupLayer.addChild(node);
        this.popupLayer.active = true;
        this.touchbg.active = true;
    },

    // ========== 开/结算 ==========
    initGame() {
        this.isPause  = false;
        this.msgIsSend = false;
        this.isMoving = false;
        this.curStandMapIndex = -1;
        this.deadMapIndex = Infinity;
        this.node_betinfo.getComponent("ChickenBet").setButtonEnabled(true);
        this.chickenObj.active = true;
        this.chickenObj.setParent(this.startPos);
        this.chickenObj.setPosition(cc.v2(0, 0));

        for (let i = 0; i < this.mapListArr.length; i++) {
            this.mapListArr[i].getComponent('ChickenMapItem').init(i === this.mapListArr.length - 1);
        }
        if (!this.isAutoGame) {
            this.node_betinfo.getComponent('ChickenBet').init();
        }

        cc.tween(this.node_content)
          .to(0.6, { position: cc.v2(this.contentStartPosX, 0) }, { easing: 'quadOut' })
          .call(() => {
                this.isWaitingReward = false;
          })
          .start();
    },

    startGame() {
        let curbet = this.node_betinfo.getComponent('ChickenBet').getCurBet();
        if (curbet > GlobalCfg.USER_DATAS.userDiamond) {
            this.stopAutoSchedule(true);
            CommonFun.getInstance().showMsgBox('Your cash is insufficient, Please recharge in time!', "SHOP", () => {
                CommonFun.getInstance().showSmallAddCash()
            }, false);
            return;
        }
        if (this.isGaming || this.msgIsSend) return;
        this.node_betinfo.getComponent("ChickenBet").setButtonEnabled(false);
        this.curWinMoney = 0;
        this.isGaming = true;
        this.msgIsSend = true;
        GlobalCfg.USER_DATAS.userDiamond -= curbet;
        this.updateSelfCoin();
        GameServerManager.send("gameservice.bet", "BetReq", {
            amount: curbet,
            mode: this.difficulty + 1
        });
    },

    endGame() {
        this.isGaming = false;
        this.msgIsSend = false;
        this.isMoving = false;
        // this.isWaitingReward = false;

        if (this.isAutoGame) {
            this.autoTime--;
            this.node_betinfo.getComponent("ChickenBet").startAutoGame(this.autoTime);
            if (this.autoTime <= 0) {
                this.stopAutoSchedule(true);
            }
        }
        this.initGame();
    },

    withDraw() {
        GameServerManager.send("gameservice.cash", "CashReq", {});
    },

    dealBetResult(notify) {
        if (!notify) return;
        if (!notify.isWin) this.deadMapIndex = this.curStandMapIndex + 1;
        this.chickenMove();
    },

    updateSelfCoin() {
        this.selfPlayer.getChildByName('lab_coin').getComponent(cc.Label).string = GlobalCfg.USER_DATAS.userDiamond / 100;
    },

    dealCashOutResult(notify) {
        let node = cc.instantiate(this.prefabReward);
        node.setPosition(cc.v2(0, 0));
        node.getComponent('ChickenReward').setData(notify);
        this.popupLayer.addChild(node);
        this.popupLayer.active = true;
        this.touchbg.active = true;
        this.chickenAudioManager.playGameSound('win');
        this.updateSelfCoin();

        // if (this.isAutoGame) {
        //     this.scheduleOnce(() => { this.endGame(); }, 0.2);
        // }
    },

    // ========== 自动模式 ==========
    startAutoGame(data) {
        if (this.isGaming || this.isAutoGame) return;

        this.autoTime = data.time | 0;
        this.autoGameLevel = Math.max(1, data.level | 0);
        this.isAutoGame = true;
        this.isPause = false;
        this.msgIsSend = false;

        this.node_betinfo.getComponent("ChickenBet").startAutoGame(this.autoTime);
        this.startAutoSchedule();
        this.startGame(); 
    },

    startAutoSchedule() {
        this.stopAutoSchedule(false);
        this._autoMoveCallback = () => {
            if (!this.isAutoGame) return;
            if (this.isPause) return;
            if (this.autoTime <= 0) return;
            if (this.isWaitingReward) return; // ★ 正在开奖动画，先别动

            if (!this.msgIsSend && !this.isMoving) {
                if (!this.isGaming) {
                    this.startGame();
                } else {
                    this.sendMove();
                }
            }
        };
        this.schedule(this._autoMoveCallback, 1);
    },

    stopAutoSchedule(force = true) {
        if (force) {
            this.isAutoGame = false;
            this.isPause = false;
            this.node_betinfo.getComponent("ChickenBet").endAutoGame(this.isGaming);
        }
        if (this._autoMoveCallback) {
            this.unschedule(this._autoMoveCallback);
            this._autoMoveCallback = null;
        }
    },

    togglePause() {
        if (!this.isAutoGame) return;
        this.isPause = !this.isPause;
    },

    setDiffculty(difficulty) {
        this.difficulty = difficulty;
        this.setMap();
    },

    // ========== 关卡行走 ==========
    chickenMove() {
        this.curStandMapIndex++;

        if (this.isAutoGame && this.curStandMapIndex >= this.autoGameLevel - 1) {
            this.isPause = true;
            const isEnd = this.curStandMapIndex >= (this.mapMaxCount - 1);
            this.chickenMoveTo(this.curStandMapIndex, isEnd, () => { this.withDraw(); });
            return;
        }

        if (this.curStandMapIndex >= (this.mapMaxCount - 1)) {
            this.chickenMoveTo(this.curStandMapIndex, true);
            return;
        }
        this.chickenMoveTo(this.curStandMapIndex, false);
    },

    chickenMoveTo(index, isEnd, callback) {
        const node = this.chickenObj;
        const newParent = this.mapListArr[index];
        const endPos = cc.v2(0, -151);
        const duration = 0.3;
        const mapConfig = this.chickenDataManager.getMapConfig(this.difficulty);

        this.curWinMoney = mapConfig[index] * this.node_betinfo.getComponent("ChickenBet").getCurBet();
        this.node_betinfo.getComponent("ChickenBet").setMultiplier(this.curWinMoney);

        let stepIndex = this.isSmallScreen ? 3 : 5;
        if (index >= 2 && index < this.mapMaxCount - stepIndex) {
            const endPos2 = cc.v2(this.node_content.x - 202, 0);
            cc.tween(this.node_content).to(duration, { position: endPos2 }, { easing: 'quadOut' }).start();
        }

        const worldPos = node.parent.convertToWorldSpaceAR(node.position);
        node.setParent(newParent, false);
        const startPos = newParent.convertToNodeSpaceAR(worldPos);
        node.setPosition(startPos);

        node.getChildByName("kun").getComponent(sp.Skeleton).setAnimation(0, "skill", false);
        this.isMoving = true;

        cc.tween(node)
          .to(duration, { position: endPos }, {
              progress: function (start, end, current, ratio) {
                  let x = startPos.x + (endPos.x - startPos.x) * ratio;
                  let y = startPos.y + (endPos.y - startPos.y) * ratio;
                  return cc.v2(x, y);
              }
          })
          .call(() => {
              if (this.curStandMapIndex >= this.deadMapIndex) { //死亡
                  this.isPause = true;
                  this.chickenObj.active = false;
                  this.mapListArr[this.curStandMapIndex].getComponent('ChickenMapItem').playDead(() => { this.endGame(); });
                  this.mapListArr[index].getComponent('ChickenMapItem').rotate(3);
                  if (index > 0) {
                      this.scheduleOnce(() => { this.mapListArr[index - 1].getComponent('ChickenMapItem').rotate(2); }, 0.1);
                  }
                  this.isMoving = false;
                  this.chickenAudioManager.playGameSound('dead');
                  return;
              }

              if (isEnd) {
                  this.mapListArr[index].getComponent('ChickenMapItem').rotate(4);
                  this.node_betinfo.getComponent("ChickenBet").setPlayButtonEnabled(false);
                  this.scheduleOnce(() => { this.withDraw(); }, 0.3);
                  this.scheduleOnce(() => { this.node_betinfo.getComponent("ChickenBet").setPlayButtonEnabled(true); }, 3.0);
              } else {
                  this.mapListArr[index].getComponent('ChickenMapItem').rotate(1);
              }

              if (index > 0) {
                  this.scheduleOnce(() => { this.mapListArr[index - 1].getComponent('ChickenMapItem').rotate(2); }, 0.1);
              }

              this.isMoving = false;
              if (callback) this.scheduleOnce(callback, 1.0);
          })
          .start();
    },

    sendMove() {
        if (!this.isGaming) return;
        if (this.msgIsSend) return;

        this.msgIsSend = true;
        GameServerManager.send("gameservice.bet", "BetReq", {});
    },

    pauseGame(isPause) { this.isPause = !!isPause; },
    getRightPos() {
        // 父容器的宽度
        let parentWidth = this.popupLayer.getContentSize().width;
        // 预制体宽度
        let nodeWidth = 429;

        // 父容器的锚点在中心 (0.5, 0.5)
        // 所以右边界 = 父容器宽度的一半 - 自身宽度的一半
        LoggerUtil.getInstance().log("parentWidth ",parentWidth)
        LoggerUtil.getInstance().log("nodeWidth ",nodeWidth)
        
        let posX = parentWidth / 2 - nodeWidth/2;

        return cc.v2(posX, 0);
    },
    // ========== 其它弹窗 ==========
    showAutoSetting() {
        let node = cc.instantiate(this.prefabAutoBet);
        let mapConfig = this.chickenDataManager.getMapConfig(this.difficulty);
        node.getComponent('ChickenAutoSetting').init(mapConfig);
        node.setPosition(cc.v2(0, 0));
        this.popupLayer.addChild(node);
        this.popupLayer.active = true;
        this.touchbg.active = true;
    },
    showSettingNode() {
        let node = cc.instantiate(this.prefabSetting);
        this.popupLayer.addChild(node);
        node.active = false;
        this.popupLayer.active = true;
        this.touchbg.active = true;

        this.scheduleOnce(() => {
            node.active = true;
            let parentWidth = this.popupLayer.getContentSize().width;
            let nodeWidth = node.getContentSize().width;
            let posX = parentWidth / 2 - nodeWidth / 2;
            node.setPosition(cc.v2(posX, 0));
        }, 0); // 等一帧再执行
    },
    showHowToPlayNode() {
        let node = cc.instantiate(this.prefabHowtoPlay);
        node.setPosition(cc.v2(0, 0));
        this.popupLayer.addChild(node);
        this.popupLayer.active = true;
        this.touchbg.active = true;
    },

    // ========== Online ==========
    initOnline() {
        // 立即更新一次在线人数
        this.updateOnlineCount();
        // 每 5 分钟更新一次
        this.schedule(() => {
            this.updateOnlineCount();
        }, 60 * 5);

        // 立即生成一次 item_online
        this.spawnOnlineItem();
        this.schedule(() => {
            this.spawnOnlineItem();
        }, 4);
    },
    updateOnlineCount() {
        this.lab_onlineCount.string = "Online:" + this.chickenDataManager.getOnlineCount();
    },
    spawnOnlineItem() {
        let item = cc.instantiate(this.item_online);
        this.node_online.addChild(item);
        item.active = true;
        // 初始状态
        item.setPosition(cc.v2(0, 200));
        item.opacity = 0;
        let randomHead = Math.floor(Math.random() * 12) + 1; // 1-12
        item.getChildByName("tx").getComponent(cc.Sprite).spriteFrame = this.atlas_head.getSpriteFrame('img_head_' + randomHead);
        item.getChildByName("name").getComponent(cc.Label).string = "player" + (Math.floor(Math.random() * (299 - 100 + 1)) + 100) + "...";
        let wins = (Math.random() * (5000 - 200) + 200).toFixed(2)
        item.getChildByName("win").getComponent(cc.Label).string = CommonFun.getInstance().formatCurrencyAmount(wins, { prefix: '+' });
        // 动画：从上到下淡入
        cc.tween(item)
        .to(0.6, { position: cc.v2(0, 0), opacity: 255 }, { easing: "quadOut" })
        .start();

        // 3 秒后销毁
        this.scheduleOnce(() => {
            if (item && item.isValid) {
                item.destroy();
            }
        }, 3);
    },
    // ========== 工具 ==========
    loadHead(spriteNode, headId) {
        let random = Math.floor(Math.random() * 12) + 1; // 1-12
        let id = headId == null || headId == 0 ? random : headId;
        spriteNode.getComponent(cc.Sprite).spriteFrame = this.atlas_head.getSpriteFrame("img_head_" + id);
    },

    _hardResetRoundState() {
        this.msgIsSend = false;
        this.isGaming = false;
        this.isMoving = false;
        cc.Tween.stopAllByTarget(this.chickenObj);
        cc.Tween.stopAllByTarget(this.node_content);
    },
});
