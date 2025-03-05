"use strict";
cc._RF.push(module, 'fe702j4Cs9NAYFL1Q242QoE', 'Rocket');
// rocket/Scripts/Rocket.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    // default
    btnBack: cc.Button,
    btnShop: cc.Button,
    btnPlayerList: cc.Button,
    nodeBtnBetSelect: cc.Node,
    btnReBet: cc.Button,
    btnBetList: [cc.Button],
    selfPlayer: cc.Node,
    nodeTrendParent: cc.Node,
    btnTrend: cc.Button,
    btnBottomTrend: cc.Button,
    labelJackPot: cc.Label,
    sprite_vipLevelIcon: cc.Sprite,
    atlas_icon: cc.SpriteAtlas,
    // waitLayer
    timerBar: cc.ProgressBar,
    betArea: cc.Node,
    labSelfBet: cc.Label,
    labAllBet: cc.Label,
    // during Game
    horizontalLine: cc.Node,
    variableLine: cc.Node,
    graphicsDrawLine: cc.Graphics,
    centerRateNode: cc.Node,
    flyRocketNode: cc.Node,
    unGetDownNode: cc.Node,
    getDownNode: cc.Node,
    rocketSpData: sp.SkeletonData,
    playerGetOutParent: cc.Node,
    // Prefabs
    pabfabCoin: cc.Prefab,
    prefabRecord: cc.Prefab,
    prefabTimeMark: cc.Prefab,
    prefabRateMark: cc.Prefab,
    prefabTrendItem: cc.Prefab,
    prefabPlayerList: cc.Prefab,
    prefabPlayerGetOut: cc.Prefab
  },
  ctor: function ctor() {
    // Config
    this.isHide = false; // 是否后台隐藏
    this.btnBetCoinNum = [10, 50, 200, 500, 1000]; // 配置下注按钮数值
    this.curSingleNote = this.btnBetCoinNum[0]; // 当前单注数值
    this.betDuration = 15000; // 下注持续时间 ms
    this.calcDuration = 3000; // 爆炸后结算时长 ms

    this.rocketMessageManager = null; // 存放消息的管理器
    this.isDuringBet = false; // 是否在下注

    this.isFlying = false; // 是否在飞行
    this.isMoveTimeMark = false; // 是否移动时间标记
    this.isMoveRateMark = false; // 是否移动比率标记
    this.lineTimeMarkOffsetX = 1000; // 时间线标记偏移量
    this.lineRateMarkOffsetY = 125; // 比率线标记偏移量

    this.betCoinNodeArray = []; // 存放下注金币的节点数组
    this.timeMarkNodeArray = []; // 存放时间线标记的节点数组
    this.rateMarkNodeArray = []; // 存放比率线标记的节点数组
    this.rectTrendNodeArray = []; // 存放矩形走势的节点数组

    this.pointRecordDataList = []; // 存放点记录的数组

    this.drawLine = false; // 是否绘制线
    this.drawPosX = -600; // 绘制线起点X坐标
    this.duringFlyTime = 0; // 存放当前飞行时长
    this.startFlyLineColor = new cc.Color(174, 36, 72, 255);
    // this.startFlyLineColor = cc.Color(255, 0, 0, 255);
    this.endFlyLineColor = new cc.Color(220, 96, 6, 255);
    this.numSelfBet = 0; // 存放当前玩家下注数
    this.numAllBet = 0; // 存放所有玩家下注数
    this.preRoundBetNum = 0; // 存放上一轮下注数
    this.showBetSpineTimeInterval = 15; // 显示下注动画的时间间隔
    this.showBetSpineTime = 0;
  },
  onLoad: function onLoad() {
    CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.SHOW_CRASH_GAME);
    GlobalCfg.ACT_SCENE_CTRL = this;
    this.rocketMessageManager = this.node.getComponent('RocketMessageManager');
    this.rocketMessageManager.sendLoginMessage();
    this.rocketAudioManager = this.node.getComponent('RocketAudioManager');
    CommonFun.getInstance().showProgress();
    this.msgHandle = ClientNotify.register(GlobalCfg.MSG_TYPE.serverMsg, this.onEventMsg, this);
    this.customMsgHandle = ClientNotify.register(GlobalCfg.MSG_TYPE.clientMsg, this.onEventMsg, this);
  },
  onDestroy: function onDestroy() {
    GlobalCfg.ACT_SCENE_CTRL = null;
    this.unschedule(this.scheduleBetSpineTimeCallback);
    ClientNotify.removeByHandle(GlobalCfg.MSG_TYPE.serverMsg, this.msgHandle);
    ClientNotify.removeByHandle(GlobalCfg.MSG_TYPE.clientMsg, this.customMsgHandle);
    CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.EXIT_CRASH_GAME);
  },
  start: function start() {
    var _this = this;
    cc.game.on(cc.game.EVENT_HIDE, function () {
      LoggerUtil.getInstance().log("Rocket 进入后台");
      _this.isHide = true;
      _this.unscheduleAll();
      _this.rocketAudioManager.pauseMusic();
      _this.setDefaultValueOfVariables();
    }, this);
    cc.game.on(cc.game.EVENT_SHOW, function () {
      LoggerUtil.getInstance().log("重新返回Rocket");
      _this.isHide = false;
      _this.rocketMessageManager.sendRefreshMessage();
    }, this);
    this.initialization();
    LoggerUtil.getInstance().warn("当前游戏帧率", cc.game.getFrameRate());
  },
  /**
   * 初始化变量
   */
  setDefaultValueOfVariables: function setDefaultValueOfVariables() {
    this.isDuringBet = false;
    this.isFlying = false;
    this.isMoveTimeMark = false;
    this.isMoveRateMark = false;
    for (var i = 0; i < this.betCoinNodeArray.length; i++) {
      var coin = this.betCoinNodeArray[i];
      this.removeJbNode(coin);
    }
    this.betCoinNodeArray.length = 0;
    this.numSelfBet = 0;
    this.numAllBet = 0;
  },
  unscheduleAll: function unscheduleAll() {
    this.unschedule(this.scheduleWaitBetCallback);
  },
  initialization: function initialization() {
    var _this2 = this;
    this.initJbPool();
    this.initLineMark(this.horizontalLine, "time");
    this.initLineMark(this.variableLine, "rate");
    this.defaultLayer = this.node.getChildByName('defaultLayer');
    this.waitLayer = this.node.getChildByName('waitLayer');
    this.duringLayer = this.node.getChildByName('during');
    this.popupLayer = this.node.getChildByName('popupLayer'); // 弹窗层

    this.duringLayer.active = false;
    this.waitLayer.active = false;
    this.popupLayer.active = false;
    this.popupLayer.on(cc.Node.EventType.TOUCH_START, function () {
      GlobalCfg.G_COMPONENTS.Audio.playButton();
      _this2.popupLayer.destroyAllChildren();
      _this2.popupLayer.active = false;
    }, this);
    this.setBetLabelInfo();
    this.btnCashout = this.unGetDownNode.getChildByName('btn_cashout').getComponent(cc.Button);
    this.btnCashout.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
    this.btnBack.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
    this.btnShop.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
    this.btnPlayerList.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
    this.btnTrend.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
    this.btnBottomTrend.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
    this.betArea.on('click', this.btnClick, this);
    this.btnReBet.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
    this.btnReBet.interactable = false;
  },
  /**
   * 初始化线标记
   * @param {cc.Node} directionLineNode 刻度父节点
   * @param {String} type time ， rate
   * @returns 
   */
  initLineMark: function initLineMark(directionLineNode, type) {
    var _this3 = this;
    directionLineNode.removeAllChildren();
    var func = function func(count, prefabAsset, originX, originY, type, parentNode, nodeArray) {
      nodeArray.length = 0;
      for (var i = 0; i < count; i++) {
        var node = cc.instantiate(prefabAsset);
        if (type == "time") {
          node.setPosition(cc.v2(originX + _this3.lineTimeMarkOffsetX * i, originY));
          node.getChildByName('Label').getComponent(cc.Label).string = i * 2 + 's';
        } else if (type == "rate") {
          node.setPosition(cc.v2(originX, originY + _this3.lineRateMarkOffsetY * i));
          node.getChildByName('Label').getComponent(cc.Label).string = Number(1 + i * 0.2).toFixed(1) + 'x';
        }
        parentNode.addChild(node);
        nodeArray.push(node);
      }
    };
    var originX = 0,
      originY = 0;
    switch (type) {
      case "time":
        originX = -600, originY = -3;
        func(8, this.prefabTimeMark, originX, originY, type, directionLineNode, this.timeMarkNodeArray);
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
  initBetBtnCoin: function initBetBtnCoin() {
    for (var index = 0; index < this.btnBetList.length; index++) {
      var btn = this.btnBetList[index];
      btn.target.getChildByName('Label').getComponent(cc.Label).string = this.btnBetCoinNum[index] / 100;
      // btn.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
      btn.node.on('click', this.btnClick, this);
    }
    ;
    this.curSingleNote = this.btnBetCoinNum[0];
    this.choiceBetButton(this.btnBetList[0], this.nodeBtnBetSelect);
  },
  choiceBetButton: function choiceBetButton(button, selectLight) {
    var scale = 1.1;
    var btnName = button.node.name;
    selectLight.setScale(scale);
    for (var i = 0; i < this.btnBetList.length; i++) {
      var btn = this.btnBetList[i];
      if (btn.node.name == btnName) {
        btn.node.setScale(scale);
      } else {
        btn.node.setScale(1);
      }
      var widget = btn.node.getComponent(cc.Widget);
      if (widget) {
        widget.updateAlignment();
      }
    }
    var pos = button.node.getPosition();
    selectLight.setPosition(pos.x, pos.y + 3.5);
  },
  freshGameData: function freshGameData() {
    this.betCoinNodeArray = []; // 存放下注金币的节点数组
    this.timeMarkNodeArray = []; // 存放时间线标记的节点数组
    this.rateMarkNodeArray = []; // 存放比率线标记的节点数组
    this.rectTrendNodeArray = []; // 存放矩形走势的节点数组

    this.pointRecordDataList = []; // 存放点记录的数组
  },
  onEventMsg: function onEventMsg(webData, target) {
    var self = target;
    var msgId = webData.msgCode;
    var notify = webData.msgData;
    if (msgId === "gameservice.login") {
      // 登录游戏
      self.dealLoginData(notify);
      CommonFun.getInstance().hidProgress();
    } else if (msgId == 'gameservice.exit') {
      // 退出房间
      SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.ROCKET, SceneManager.getInstance().sceneType.LOBBY);
    } else if (msgId == 'gameservice.loadwhole') {
      // 刷新游戏场景
      self.dealLoginData(notify);
    } else if (msgId == 'gameservice.playerlist') {
      // 获取玩家列表
      self.dealPlayerList(notify);
    } else if (msgId == 'gameservice.playernumberchangednotify') {
      // 人数变化通知
      if (notify.num) {
        self.btnPlayerList.node.getChildByName('redBg').getChildByName('Label').getComponent(cc.Label).string = notify.num;
      }
    } else if (msgId == 'gameservice.bet') {
      // 下注
      self.rocketAudioManager.playGameSound('mytouCoin', false);
      var fromPos = self.selfPlayer.getPosition();
      self.moveCoinToBetArea(fromPos);
      var amount = notify.amount; // 金额
      var totalChip = notify.totalChip; // 个人总下注
      var poolChip = notify.poolChip;
      var after = notify.after;
      GlobalCfg.USER_DATAS.userDiamond = after;
      if (self.numSelfBet < totalChip) {
        cc.tween(self.labSelfBet.node).to(0.1, {
          scale: 1.2
        }).to(0.1, {
          scale: 1
        }).start();
        cc.tween(self.labAllBet.node).to(0.1, {
          scale: 1.2
        }).to(0.1, {
          scale: 1
        }).start();
      }
      self.numSelfBet = totalChip;
      self.numAllBet = poolChip;
      self.setBetLabelInfo();
      self.updateSelfCoin();
      var txNode = self.selfPlayer.getChildByName('txk');
      var pos = txNode.getPosition();
      cc.tween(txNode).to(0.1, {
        position: cc.v2(pos.x, 20)
      }).to(0.1, {
        position: cc.v2(pos.x, 0)
      }).start();
    } else if (msgId == 'gameservice.cash') {
      // 领取奖励
      var time = notify.time; // 时间坐标
      var rate = notify.mul; // 倍数
      var _amount = notify.amount; // 领取的金额
      var _after = notify.after; // 钱包剩余

      self.getDownNode.getChildByName('labRate').getComponent(cc.Label).string = (rate / 1000).toFixed(2) + "X";
      self.getDownNode.getChildByName('labWin').getComponent(cc.Label).string = _amount / 100;
      self.getDownNode.active = true;
      self.unGetDownNode.active = false;
      self.rocketAudioManager.playGameSound('cash_out_win', false);
      GlobalCfg.USER_DATAS.userDiamond = _after;
      self.selfPlayer.getChildByName('coin').getComponent(cc.Label).string = GlobalCfg.USER_DATAS.userDiamond / 100;
    } else if (msgId == 'gameservice.cashnotify') {
      // 有人领取通知
      self.dealPlayerGetOut(notify);
    } else if (msgId == 'gameservice.startbettingnotify') {
      // 开始下注阶段通知
      self.rocketAudioManager.playGameMusic('betBgMusic');
      self.rocketAudioManager.playGameSound("start", false);
      self.startBetTimer(self.betDuration);
    } else if (msgId == 'gameservice.startflynotify') {
      // 开始飞行阶段通知
      self.rocketAudioManager.playGameMusic('rocketFlyBgMusic');
      self.rocketAudioManager.playGameSound('rocket_fly', false);
      self.startRocketFire();
    } else if (msgId == 'gameservice.flyfinishnotify') {
      // 飞行结束通知
      self.rocketAudioManager.pauseMusic();
      self.rocketEnd(notify);
    } else if (msgId == 'gameservice.bettingupdatenotify') {
      // 下注过程 update
      // LoggerUtil.getInstance().warn("下注过程 update", notify);
      if (self.isHide == true) {
        LoggerUtil.getInstance().log("Is In Hide");
        return;
      }
      var betAdd = notify.betAdd;
      var betPool = notify.betPool;
      var jackpotPool = notify.jackpotPool;
      if (jackpotPool) {
        self.labelJackPot.string = Number(jackpotPool / 100).toFixed(2);
      }
      self.numAllBet = betPool;
      self.setBetLabelInfo();
      if (betAdd > 0) {
        var _fromPos = self.btnPlayerList.node.getPosition();
        cc.tween(self.btnPlayerList.node).to(0.1, {
          position: cc.v2(_fromPos.x, 20)
        }).to(0.1, {
          position: cc.v2(_fromPos.x, 0)
        }).start();
        for (var i = 0; i < 5; i++) {
          self.moveCoinToBetArea(_fromPos);
        }
        self.rocketAudioManager.playGameSound('otherCoin', false);
      }
    } else if (msgId == 'gameservice.updatecoinnotify') {
      // 货币更新广播
    } else if (msgId == GlobalCfg.CLIENT_MSG_ID.CURRENCY_CHANGED_USER_INFO) {
      self.selfPlayer.getChildByName('coin').getComponent(cc.Label).string = GlobalCfg.USER_DATAS.userDiamond / 100;
    } else if (msgId == GlobalCfg.CLIENT_MSG_ID.FIRST_RECHARGE_TIPS) {
      LoggerUtil.getInstance().warn("首次充值提示");
      SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.ROCKET, SceneManager.getInstance().sceneType.LOBBY);
    } else if (msgId == GlobalCfg.CLIENT_MSG_ID.GAME_MENU_CLICK_OUT_TO_LOBBY) {
      self.rocketMessageManager.sendExitMessage();
    } else if (msgId == GlobalCfg.CLIENT_MSG_ID.GAME_MENU_CLICK_HOW_TO_PLAY) {
      CommonFun.getInstance().showRule("rocket");
    } else if (msgId == "lobbyservice.kicktolobby") {
      SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.ROCKET, SceneManager.getInstance().sceneType.LOBBY);
    }
  },
  checkWebMsgError: function checkWebMsgError(webData, target) {
    var self = target;
    var msgId = webData.msgCode;
    var notify = webData.msgData;
    var result = notify.result;
    LoggerUtil.getInstance().error(notify);
    var msg = result.message ? result.message : "SERVICE ERROR";
    if (!notify) {
      // let info = {
      //     errorMessage: `Rocket游戏中, 服务器下发的非正确消息中结构体异常, 内容为===>${JSON.stringify(webData)}`
      // };
      // CommonFun.getInstance().reportToTelegram(info);
      // return;
    }
    ;
    if (msgId == 'gameservice.bet') {
      if (CommonFun.getInstance().isFreePlayerDirectedToFreeTP()) {
        if (result.result == 57) {
          CommonFun.getInstance().showDiversionFreeTP(function () {
            GameServerManager.send("gameservice.exit", "ExitReq", {});
            // SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.ROCKET, SceneManager.getInstance().sceneType.LOBBY);
          });
        } else {
          if (notify.result.result == 19) {
            // 余额不足
            CommonFun.getInstance().showMsgBox('Your cash is insufficient, Please recharge in time!', "SHOP", function () {
              CommonFun.getInstance().showSmallAddCash();
            }, false);
          }
        }
        ;
      } else {
        if (notify.result.result == 19) {
          // 余额不足
          CommonFun.getInstance().showMsgBox('Your cash is insufficient, Please recharge in time!', "SHOP", function () {
            CommonFun.getInstance().showSmallAddCash();
          }, false);
        }
      }
      ;
    } else if (msgId === "gameservice.login") {
      CommonFun.getInstance().showMsgBox(result.message, "YES", function () {
        SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.ROCKET, SceneManager.getInstance().sceneType.LOBBY);
      }, false);
    }
  },
  btnClick: function btnClick(event) {
    var name = event.node.name;
    if (name == this.btnBack.node.name) {
      GlobalCfg.G_COMPONENTS.Audio.playButton();
      CommonFun.getInstance().showGameMenu(false);
    } else if (name == this.btnShop.node.name) {
      GlobalCfg.G_COMPONENTS.Audio.playButton();
      CommonFun.getInstance().showSmallAddCash();
    } else if (name == this.btnPlayerList.node.name) {
      GlobalCfg.G_COMPONENTS.Audio.playButton();
      this.rocketMessageManager.sendGetPlayerListMessage(0, 12);
    } else if (name == this.btnTrend.node.name) {
      GlobalCfg.G_COMPONENTS.Audio.playButton();
      this.showPointTrendNode();
    } else if (name == this.btnBottomTrend.node.name) {
      GlobalCfg.G_COMPONENTS.Audio.playButton();
      this.showPointTrendNode();
    } else if (name == this.btnCashout.node.name) {
      // 下车
      var rate = this.centerRateNode.getChildByName('Label').getComponent(cc.Label).string;
      this.rocketMessageManager.sendGetCashMessage(this.duringFlyTime, rate.split('x')[0]);
    } else if (name == this.btnBetList[0].node.name) {
      GlobalCfg.G_COMPONENTS.Audio.playButton();
      this.choiceBetButton(event, this.nodeBtnBetSelect);
      this.curSingleNote = this.btnBetCoinNum[0];
    } else if (name == this.btnBetList[1].node.name) {
      GlobalCfg.G_COMPONENTS.Audio.playButton();
      this.choiceBetButton(event, this.nodeBtnBetSelect);
      this.curSingleNote = this.btnBetCoinNum[1];
    } else if (name == this.btnBetList[2].node.name) {
      GlobalCfg.G_COMPONENTS.Audio.playButton();
      this.choiceBetButton(event, this.nodeBtnBetSelect);
      this.curSingleNote = this.btnBetCoinNum[2];
    } else if (name == this.btnBetList[3].node.name) {
      GlobalCfg.G_COMPONENTS.Audio.playButton();
      this.choiceBetButton(event, this.nodeBtnBetSelect);
      this.curSingleNote = this.btnBetCoinNum[3];
    } else if (name == this.btnBetList[4].node.name) {
      GlobalCfg.G_COMPONENTS.Audio.playButton();
      this.choiceBetButton(event, this.nodeBtnBetSelect);
      this.curSingleNote = this.btnBetCoinNum[4];
    } else if (name == this.betArea.name) {
      this.clickBtnBetCallback(this.curSingleNote);
    } else if (name == this.btnReBet.node.name) {
      GlobalCfg.G_COMPONENTS.Audio.playButton();
      var num = this.preRoundBetNum;
      this.clickBtnBetCallback(num);
      this.preRoundBetNum = 0;
      this.btnReBet.interactable = false;
    }
  },
  clickBtnBetCallback: function clickBtnBetCallback(num) {
    if (this.isDuringBet == true) {
      //playnow模式下 首充玩家 弹VIP弹框
      if (GlobalCfg.USER_DATAS.recharged == 0 && GlobalCfg.GAME_ENTER_ISFREE == false) {
        CommonFun.getInstance().showVipRechargeToast();
        return false;
      }
      if (num > GlobalCfg.USER_DATAS.userDiamond) {
        CommonFun.getInstance().showMsgBox('Your cash is insufficient, Please recharge in time!', "SHOP", function () {
          CommonFun.getInstance().showSmallAddCash();
        }, false);
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
  dealLoginData: function dealLoginData(data) {
    // LoggerUtil.getInstance().log("dealLoginData", data);
    // 初始化状态
    this.isDuringBet = false;
    this.isFlying = false;
    this.setMoveMark(false);
    this.drawLine = false;
    this.unscheduleAll();
    if (!data) return;
    var whole = data.whole;
    var config = whole == null ? void 0 : whole.config;
    var scene = whole == null ? void 0 : whole.scene;
    var requester = whole == null ? void 0 : whole.requester;
    if (config && scene && requester) {
      this.btnBetCoinNum = config.chipOption;
      this.betDuration = config.betDuration;
      this.calcDuration = config.calcDuration;
      this.initBetBtnCoin();
      var userInfo = requester.userInfo;
      var chip = requester.chip ? requester.chip : 0; // 已下注的
      var cashPoint = requester.cashPoint; // 领取点
      if (userInfo) {
        this.setSelfPlayerInfo(userInfo);
      }
      var status = scene.status; // 当前状态
      var playerNum = scene.playerNum; // 总玩家人数
      var currentStatusLeftMs = scene.currentStatusLeftMs; // 当前状态剩余时间.毫秒(下注，结算)
      var betPool = scene.betPool; // 下注池
      var jackpotPool = scene.jackpotPool; // 头奖池
      var curPoint = scene.point; // 当前坐标点
      var trends = scene.openRecord; // 开奖记录
      this.dealTrendData(trends);
      this.dealRectTrendData(this.pointRecordDataList);
      this.numSelfBet = chip;
      this.numAllBet = betPool;
      this.setBetLabelInfo();
      this.labelJackPot.string = jackpotPool / 100;
      this.btnPlayerList.node.getChildByName('redBg').getChildByName('Label').getComponent(cc.Label).string = playerNum;
      switch (status) {
        case 0:
          // 下注状态
          this.isDuringBet = true;
          this.labAllBet.string = betPool / 100;
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
          if (cashPoint) {
            // 已领取
            this.getDownNode.getChildByName('labRate').getComponent(cc.Label).string = (cashPoint.mul / 1000).toFixed(2) + "X";
            this.getDownNode.getChildByName('labWin').getComponent(cc.Label).string = cashPoint.win / 100;
            this.getDownNode.active = true;
            this.unGetDownNode.active = false;
          } else {
            // 未领取
            this.unGetDownNode.getChildByName('allBet').getComponent(cc.Label).string = betPool / 100;
            this.unGetDownNode.getChildByName('selfBet').getComponent(cc.Label).string = chip / 100;
            this.getDownNode.active = false;
            this.unGetDownNode.active = false;
            if (chip > 0) {
              this.labSelfBet.node.color = new cc.Color(254, 253, 1, 1);
              this.unGetDownNode.active = true;
            } else {
              this.labSelfBet.node.color = new cc.Color(255, 255, 255, 255);
            }
          }
          break;
        case 2:
          // 结算状态
          // let time = curPoint.x;         // 时间
          // let mul = curPoint.mul;         // 倍数
          // this.initTimeMarkByCurTime(time);
          // this.initRateMarkByCurRate(Number((mul / 1000).toFixed(2)));
          this.freshWaitLayer(false);
          if (cashPoint) {
            // 已领取
            this.getDownNode.getChildByName('labRate').getComponent(cc.Label).string = (cashPoint.mul / 1000).toFixed(2) + "X";
            this.getDownNode.getChildByName('labWin').getComponent(cc.Label).string = cashPoint.win / 100;
            this.getDownNode.active = false;
            this.unGetDownNode.active = false;
          } else {
            // 未领取
            this.getDownNode.active = false;
            this.unGetDownNode.active = false;
          }
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
  dealFlyState: function dealFlyState(point) {
    var time = point.x; // 时间 ms
    var mul = point.mul; // 倍数
    this.drawPosX = -600;
    this.duringFlyTime = Number(time / 1000);
    this.graphicsDrawLine.clear();
    this.graphicsDrawLine.moveTo(-600, -218);
    var rocketSke = this.flyRocketNode.getComponent(sp.Skeleton);
    rocketSke.skeletonData = this.rocketSpData;
    rocketSke.setAnimation(0, "feixing", true);
    // this.drawPosX > 550 || currentY > 145    y=X²/10+1  lineTimeMarkOffsetX
    var limitTime = 2.3;
    var time_s = Number(time / 1000);
    if (time_s <= limitTime) {
      limitTime = time_s;
    }
    var frameRate = cc.game.getFrameRate();
    var frameRateTime = 1 / frameRate;
    var drawCount = Math.floor(limitTime / frameRateTime);
    LoggerUtil.getInstance().warn('绘画次数：', limitTime, drawCount);
    // 公式：rate = math.Pow(float64(x)/1000, 2)/100 + 1

    var unitTime = limitTime / drawCount; // 单位时间
    for (var i = 0; i < drawCount; i++) {
      var x = i * unitTime;
      var frontY = 0;
      if (i > 0) {
        frontY = -218 + Math.pow(x - unitTime, 2) / 10 * this.lineRateMarkOffsetY * 5;
      } else {
        frontY = -218 + Math.pow(x, 2) / 10 * this.lineRateMarkOffsetY * 5;
      }
      var currentY = -218 + Math.pow(x, 2) / 10 * this.lineRateMarkOffsetY * 5;
      var deltaX = unitTime / 2 * this.lineTimeMarkOffsetX;
      var deltaY = currentY - frontY;
      var rate = 1 + Math.pow(x, 2) / 10;
      this.drawPosX += deltaX;
      var angle = Math.atan(deltaY / deltaX) * 180 / Math.PI;
      this.flyRocketNode.angle = -90 + angle;
      this.flyRocketNode.setPosition(this.drawPosX, currentY);
      this.graphicsDrawLine.lineTo(this.drawPosX, currentY);
      this.graphicsDrawLine.stroke();
    }
    this.initTimeMarkByCurTime(time);
    this.initRateMarkByCurRate(Number((mul / 1000).toFixed(2)));
  },
  /**
   * 设置移动刻度
   * @param {boolean} isMove 是否移动刻度
   */
  setMoveMark: function setMoveMark(isMove) {
    this.isMoveTimeMark = isMove;
    this.isMoveRateMark = isMove;
  },
  /**
   * 通过当前时间初始化时间刻度线
   * @param {Number} time ms
   */
  initTimeMarkByCurTime: function initTimeMarkByCurTime(time) {
    LoggerUtil.getInstance().log("initTimeMarkByCurTime", time);
    if (time > 10000) {
      // 已经开始移动刻度线
      this.timeMarkNodeArray.length = 0;
      this.horizontalLine.removeAllChildren();
      // x: 522.077874999999
      // y: 144.60892217858014
      var time_s = time / 1000; // 秒
      var more = Number((time_s % 2).toFixed(3)); // 跟上一个刻度之间的差值
      LoggerUtil.getInstance().log("time_s", time_s);
      LoggerUtil.getInstance().log("more", more);
      var lastPosX = 522 + (1 - more / 2) * this.lineTimeMarkOffsetX;
      LoggerUtil.getInstance().log("lastPosX", lastPosX);
      var lastTime = Math.round(time_s + 2 - more);
      LoggerUtil.getInstance().log("lastTime", lastTime);
      for (var i = 0; i < 8; i++) {
        var node = cc.instantiate(this.prefabTimeMark);
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
  initRateMarkByCurRate: function initRateMarkByCurRate(rate) {
    if (rate > 2) {
      this.rateMarkNodeArray.length = 0;
      this.variableLine.removeAllChildren();
      var moreRate = (Number((rate * 10 % 2).toFixed(1)) / 10).toFixed(2); // 跟下一个刻度之间的差值
      // LoggerUtil.getInstance().log("moreRate", moreRate);
      var lastPosY = 144 + (1 - Number(moreRate) / 0.2) * this.lineRateMarkOffsetY;
      var lastRate = rate + 0.2 - Number(moreRate);
      // LoggerUtil.getInstance().log("lastRate", lastRate, "lastPosY", lastPosY);
      for (var i = 0; i < 7; i++) {
        var node = cc.instantiate(this.prefabRateMark);
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
  dealWaitState: function dealWaitState() {},
  loadHeadSp: function loadHeadSp(headUrl, realWidth, heaSprite) {
    var _this4 = this;
    if (headUrl && headUrl.length > 0) {
      cc.assetManager.loadRemote(headUrl, {
        ext: '.png'
      }, function (err, texture) {
        if (!err && cc.isValid(_this4) && cc.isValid(heaSprite) && cc.isValid(heaSprite.spriteFrame)) {
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
  setSelfPlayerInfo: function setSelfPlayerInfo(data) {
    if (!data) return;
    GlobalCfg.USER_DATAS.userDiamond = data.diamond;
    this.selfPlayer.getChildByName('userName').getComponent(cc.Label).string = CommonFun.getInstance().getStrByLength(data.nickname, 8);
    this.selfPlayer.getChildByName('coin').getComponent(cc.Label).string = GlobalCfg.USER_DATAS.userDiamond / 100;
    var headUrl = data.imgUrl;
    if (headUrl) {
      this.loadHeadSp(headUrl, 85, this.selfPlayer.getChildByName('txk').getChildByName('mask').getChildByName('tx').getComponent(cc.Sprite));
    }
    if (data.vipLevel >= 1 && data.vipLevel <= 10 && CommonFun.getInstance().isOpenVipModule()) {
      this.sprite_vipLevelIcon.node.active = true;
      this.sprite_vipLevelIcon.spriteFrame = this.atlas_icon.getSpriteFrame("" + data.vipLevel);
    } else {
      this.sprite_vipLevelIcon.node.active = false;
    }
    ;
    var isCanShowVIPFont = CommonFun.getInstance().isCanShowVIPFontByLevel(data.vipLevel);
    if (isCanShowVIPFont) {
      this.selfPlayer.getChildByName('userName').color = new cc.Color(250, 225, 76);
    } else {
      this.selfPlayer.getChildByName('userName').color = new cc.Color(255, 255, 255);
    }
    ;
  },
  updateSelfCoin: function updateSelfCoin() {
    this.selfPlayer.getChildByName('coin').getComponent(cc.Label).string = GlobalCfg.USER_DATAS.userDiamond / 100;
  },
  dealPlayerList: function dealPlayerList(notify) {
    if (!notify) {
      LoggerUtil.getInstance().error("PlayerList Data Error!");
      return;
    }
    var node = this.node.getChildByName('playerList');
    if (node) {
      var nodeCtrl = node.getComponent('RocketPlayerList');
      if (nodeCtrl) {
        nodeCtrl.setPlayerData(notify);
      }
    } else {
      var nodePlayerList = cc.instantiate(this.prefabPlayerList);
      var _nodeCtrl = nodePlayerList.getComponent('RocketPlayerList');
      this.node.addChild(nodePlayerList);
      if (_nodeCtrl) {
        _nodeCtrl.setPlayerData(notify);
      }
    }
  },
  // ******************************************************************************************
  /**
   * 设置下注金额,使用之前请更新 numSelfBet，numAllBet
   */
  setBetLabelInfo: function setBetLabelInfo() {
    var selfBet = this.numSelfBet;
    var allBet = this.numAllBet;
    this.unGetDownNode.getChildByName('allBet').getComponent(cc.Label).string = allBet / 100;
    this.unGetDownNode.getChildByName('selfBet').getComponent(cc.Label).string = selfBet / 100;
    this.labAllBet.string = allBet / 100;
    this.labSelfBet.string = selfBet / 100;
    if (selfBet > 0) {
      this.labSelfBet.node.color = new cc.Color(254, 253, 1, 255);
      this.unGetDownNode.getChildByName('selfBet').color = new cc.Color(254, 253, 1, 255);
    }
  },
  /**
   * 开始下注阶段
   * @param {Number} remainder 剩余时间 ms
   */
  startBetTimer: function startBetTimer(remainder) {
    var _this5 = this;
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
    var useTime = Number(this.betDuration - remainder) / 1000;
    var coinCount = Math.ceil(useTime) * 5;
    // LoggerUtil.getInstance().log(">>>>>>>>>>>初始化金币数目", useTime, coinCount);
    for (var i = 0; i < coinCount; i++) {
      var areaWidth = this.betArea.width - 40;
      var areaHeight = this.betArea.height - 60;
      var areaPos = this.betArea.getPosition();
      var worldAreaPos = this.betArea.parent.convertToWorldSpaceAR(areaPos);
      var nodeAreaPos = this.betArea.convertToNodeSpaceAR(worldAreaPos);
      var toPos = cc.v2(nodeAreaPos.x - areaWidth / 2 + Math.random() * areaWidth, nodeAreaPos.y - areaHeight / 2 + Math.random() * areaHeight);
      var worldToPos = this.betArea.parent.convertToWorldSpaceAR(toPos);
      var nodeToPos = this.betArea.convertToNodeSpaceAR(worldToPos);
      var feijbNode = this.createJbNode();
      feijbNode.setPosition(nodeToPos);
      this.betArea.addChild(feijbNode);
      this.dealBetCoinArray(feijbNode);
    }
    var time = null,
      count = null;
    if (remainder) {
      time = remainder;
      count = time;
    } else {
      time = this.betDuration;
      count = time;
    }
    var lab = this.timerBar.node.getChildByName("labTime").getComponent(cc.Label);
    lab.string = Math.floor(count / 1000) + "s";
    this.scheduleWaitBetCallback = function () {
      count -= 100;
      lab.string = Math.floor(count / 1000) + "s";
      var rate = Number(count / _this5.betDuration).toFixed(2);
      _this5.timerBar.progress = rate;
      if (count <= 0 || rate <= 0) {
        LoggerUtil.getInstance().log("倒计时结束，火箭点火");
        _this5.isDuringBet = false;
      }
    };
    this.schedule(this.scheduleWaitBetCallback, 0.1, Math.floor(time / 100) - 1);
  },
  freshWaitLayer: function freshWaitLayer(bool) {
    this.waitLayer.active = bool;
    this.duringLayer.active = !bool;
  },
  // 开始火箭点火
  startRocketFire: function startRocketFire() {
    this.setBetLabelInfo();
    this.getDownNode.active = false;
    this.unGetDownNode.active = true;
    if (this.numSelfBet > 0) {
      this.unGetDownNode.active = true;
    } else {
      this.unGetDownNode.active = false;
    }
    this.btnReBet.interactable = false;
    this.rocketAudioManager.playGameSound('rocket_fly', false);
    this.graphicsDrawLine.clear();
    var rocketSke = this.flyRocketNode.getComponent(sp.Skeleton);
    rocketSke.skeletonData = this.rocketSpData;
    rocketSke.setAnimation(0, "feixing", true);
    this.freshWaitLayer(false);
    this.isMoveTimeMark = false;
    this.updateCenterRate(1);
    this.drawPosX = -600;
    this.duringFlyTime = 0;
    this.graphicsDrawLine.moveTo(-600, -218);
    this.flyRocketNode.setPosition(-600, -218);
    this.isFlying = true;
    this.drawLine = true;

    // 回收金币
    for (var i = 0; i < this.betCoinNodeArray.length; i++) {
      var coin = this.betCoinNodeArray[i];
      this.removeJbNode(coin);
    }
    this.betCoinNodeArray.length = 0;
  },
  rocketEnd: function rocketEnd(notify) {
    this.unGetDownNode.active = false;
    LoggerUtil.getInstance().warn("rocketEnd", notify);
    if (!notify) return;
    this.isFlying = false;
    this.drawLine = false;
    var time = notify.x;
    var rate = notify.mul;
    var jackpotPool = notify.jackpotPool;
    var point = {
      x: time,
      mul: rate
    };
    this.labelJackPot.string = jackpotPool / 100;
    this.updateCenterRate(Number((rate / 1000).toFixed(2)));
    var rocketSke = this.flyRocketNode.getComponent(sp.Skeleton);
    rocketSke.skeletonData = this.rocketSpData;
    rocketSke.setAnimation(0, "baozha", false);
    this.rocketAudioManager.playGameSound("explosion", false);
    this.updateTrendData(point);
    this.updateRectTrendNode(this.pointRecordDataList[this.pointRecordDataList.length - 1]);
    this.curRoundAddCoinFinish();
  },
  curRoundAddCoinFinish: function curRoundAddCoinFinish() {
    if (cc.isValid(this)) {
      var minLimit = this.btnBetCoinNum[0] || 0;
      CommonFun.getInstance().gameShowSecondRecharge(minLimit, this.numSelfBet);
      CommonFun.getInstance().showWithdrawToastInGame();
    }
  },
  /**
   * 有玩家领取
   */
  dealPlayerGetOut: function dealPlayerGetOut(notify) {
    if (!notify) {
      LoggerUtil.getInstance().error("PlayerGetOut Data Error!");
      return;
    }
    var playerGetOutNode = cc.instantiate(this.prefabPlayerGetOut);
    var pos = this.flyRocketNode.getPosition();
    playerGetOutNode.setPosition(pos);
    this.playerGetOutParent.addChild(playerGetOutNode);
    playerGetOutNode.getComponent("RocketPlayerGetOut").setNodeData(notify);
  },
  // ***************************************************************************************
  /**
   * 处理走势数据
   * @param {*} msg 
   */
  dealTrendData: function dealTrendData(trends) {
    this.pointRecordDataList.length = 0;
    for (var i = 0; i < trends.length; i++) {
      var element = trends[i];
      this.pointRecordDataList.push(element);
    }
  },
  /**
   * 更新走势数据
   */
  updateTrendData: function updateTrendData(pointData) {
    this.pointRecordDataList.push(pointData);
    if (this.pointRecordDataList.length > 100) {
      this.pointRecordDataList.shift();
    }
  },
  /**
   * 展示矩形走势
   */
  dealRectTrendData: function dealRectTrendData() {
    this.initRectTrend(this.pointRecordDataList);
  },
  /**
   * 
   * @param {*} data 
   */
  initRectTrend: function initRectTrend(data) {
    this.nodeTrendParent.removeAllChildren();
    this.rectTrendNodeArray.length = 0;
    if (data.length < 12) {
      for (var i = 0; i < data.length; i++) {
        this.createRectTrendNode(data[i]);
      }
    } else {
      for (var _i = data.length - 12; _i < data.length; _i++) {
        this.createRectTrendNode(data[_i]);
      }
    }
  },
  /**
   * 生成矩形走势数据节点
   */
  createRectTrendNode: function createRectTrendNode(data, isShowLight) {
    if (isShowLight == undefined) {
      isShowLight = false;
    }
    var trendNode = cc.instantiate(this.prefabTrendItem);
    var RocketRecordRectCtrl = trendNode.getComponent("RocketRecordRectCtrl");
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
  updateRectTrendNode: function updateRectTrendNode(data) {
    if (this.rectTrendNodeArray.length >= 12) {
      var node = this.rectTrendNodeArray.shift();
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
  showPointTrendNode: function showPointTrendNode() {
    var node = cc.instantiate(this.prefabRecord);
    node.getComponent("RocketRecord").init(this.pointRecordDataList);
    node.setPosition(cc.v2(0, 98));
    this.popupLayer.addChild(node);
    this.popupLayer.active = true;
  },
  // *************************************   Coin    *******************************************************************
  /**
   * 移动金币去指定区域
   * @param {cc.Vec2} fromPos 
   */
  moveCoinToBetArea: function moveCoinToBetArea(fromPos) {
    var _this6 = this;
    var areaWidth = this.betArea.width - 40;
    var areaHeight = this.betArea.height - 60;
    var areaPos = this.betArea.getPosition();
    var worldAreaPos = this.betArea.parent.convertToWorldSpaceAR(areaPos);
    var nodeAreaPos = this.betArea.convertToNodeSpaceAR(worldAreaPos);
    var toPos = cc.v2(nodeAreaPos.x - areaWidth / 2 + Math.random() * areaWidth, nodeAreaPos.y - areaHeight / 2 + Math.random() * areaHeight + 20);
    var worldFromPos = this.defaultLayer.getChildByName('bg_bottom').convertToWorldSpaceAR(fromPos);
    var worldToPos = this.betArea.parent.convertToWorldSpaceAR(toPos);
    var nodeFromPos = this.betArea.convertToNodeSpaceAR(worldFromPos);
    var nodeToPos = this.betArea.convertToNodeSpaceAR(worldToPos);
    var feijbNode = this.createJbNode();
    feijbNode.setPosition(nodeFromPos);
    this.betArea.addChild(feijbNode);
    cc.tween(feijbNode).delay(Number((Math.random() / 3).toFixed(2))).to(0.3, {
      position: nodeToPos
    }).call(function () {
      _this6.dealBetCoinArray(feijbNode);
    }).start();
  },
  dealBetCoinArray: function dealBetCoinArray(coinNode) {
    if (this.betCoinNodeArray.length > 150) {
      var coin = this.betCoinNodeArray.shift();
      this.removeJbNode(coin);
    }
    this.betCoinNodeArray.push(coinNode);
  },
  initJbPool: function initJbPool() {
    this.jbPool = new cc.NodePool();
    var initCount = 150;
    for (var i = 0; i < initCount; i++) {
      this.jbPool.put(cc.instantiate(this.pabfabCoin)); //放入对象池
    }
  },

  createJbNode: function createJbNode() {
    var feijbNode = null;
    if (this.jbPool.size() > 0) {
      //通过size接口判断对象池中是否有空闲的对象
      feijbNode = this.jbPool.get();
    } else {
      //对象池中的备用对象不够时，通过cc.instantiate 重新创建
      feijbNode = cc.instantiate(this.pabfabCoin);
    }
    return feijbNode;
  },
  removeJbNode: function removeJbNode(feijbNode) {
    if (feijbNode == null) {
      LoggerUtil.getInstance().error("将金币对象放回对象池中，金币对象为空！");
      return;
    }
    feijbNode.setPosition(0, 0);
    this.jbPool.put(feijbNode);
  },
  // *******************************************************************************************************************
  /**
   * 更新中间的倍率
   * @param {Number} rate 倍率
   */
  updateCenterRate: function updateCenterRate(rate) {
    if (rate) {
      var ctrl = this.centerRateNode.getComponent("RocketCenterRate");
      if (ctrl) {
        ctrl.updateRate(Number(rate).toFixed(2));
      }
    }
  },
  showBtnBetSpine: function showBtnBetSpine() {
    var _this7 = this;
    var animationName = 'animation';
    var len = this.btnBetList.length,
      i = 0;
    this.scheduleBetSpineTimeCallback = function () {
      var spine = _this7.btnBetList[i].node.getChildByName('spine').getComponent(sp.Skeleton);
      spine.setAnimation(0, animationName, false);
      i++;
    };
    this.schedule(this.scheduleBetSpineTimeCallback, 0.8, len - 1);
  },
  update: function update(dt) {
    this.showBetSpineTime += dt;
    if (this.showBetSpineTime > this.showBetSpineTimeInterval) {
      this.showBetSpineTime = 0;
      this.showBtnBetSpine();
    }
    if (this.isFlying == true) {
      // 倍数 = x的平方/100 + 1   , x: 毫秒ms  math.Pow(float64(x)/1000, 2)/100 + 1
      // y=X²/10+1  , x: 毫秒ms  math.Pow(float64(x)/1000, 2)/100 + 1
      var frontY = -218 + Math.pow(this.duringFlyTime, 2) / 10 * this.lineRateMarkOffsetY * 5;
      this.duringFlyTime += dt;
      var currentY = -218 + Math.pow(this.duringFlyTime, 2) / 10 * this.lineRateMarkOffsetY * 5;
      var deltaX = dt / 2 * this.lineTimeMarkOffsetX;
      var deltaY = currentY - frontY;
      var rate = 1 + Math.pow(this.duringFlyTime, 2) / 10;
      this.updateCenterRate(rate);
      if (this.isMoveTimeMark == true) {
        this.moveTimeMark(deltaX);
      }
      if (this.isMoveRateMark == true) {
        this.moveRateMark(deltaY);
      }
      if (this.drawLine == true) {
        this.drawPosX += deltaX;
        if (this.drawPosX > 550 || currentY > 145) {
          this.setMoveMark(true);
          this.drawLine = false;
          LoggerUtil.getInstance().log("当前时间", this.duringFlyTime, rate);
          LoggerUtil.getInstance().log("当前火箭位置", this.flyRocketNode.getPosition());
          LoggerUtil.getInstance().log("当前火箭角度", this.flyRocketNode.angle);
          return;
        }
        var angle = Math.atan(deltaY / deltaX) * 180 / Math.PI;
        this.flyRocketNode.angle = -90 + angle;
        this.flyRocketNode.setPosition(this.drawPosX, currentY);
        // this.graphicsDrawLine.strokeColor = this.startFlyLineColor;
        // this.graphicsDrawLine.fillColor = this.startFlyLineColor;
        var redOffset = 0,
          greenOffset = 0,
          blueOffset = 0;
        redOffset = this.endFlyLineColor.r - this.startFlyLineColor.r;
        greenOffset = this.endFlyLineColor.g - this.startFlyLineColor.g;
        blueOffset = this.endFlyLineColor.b - this.startFlyLineColor.b;
        if (this.duringFlyTime > 5 && this.duringFlyTime < 10) {
          this.graphicsDrawLine.strokeColor = new cc.Color(this.startFlyLineColor.r + redOffset * this.duringFlyTime / 10, this.startFlyLineColor.g + greenOffset * this.duringFlyTime / 10, this.startFlyLineColor.b + blueOffset * this.duringFlyTime / 10, 255);
          this.graphicsDrawLine.fillColor = new cc.Color(this.startFlyLineColor.r + redOffset * this.duringFlyTime / 10, this.startFlyLineColor.g + greenOffset * this.duringFlyTime / 10, this.startFlyLineColor.b + blueOffset * this.duringFlyTime / 10, 255);
        }
        // LoggerUtil.getInstance().log("graphicsDrawLine:", this.graphicsDrawLine.strokeColor.r, this.graphicsDrawLine.fillColor.r);
        this.graphicsDrawLine.lineTo(this.drawPosX, currentY);
        this.graphicsDrawLine.stroke();
      }
    }
  },
  moveRateMark: function moveRateMark(offsetY) {
    if (this.isMoveRateMark == true) {
      for (var i = 0; i < this.rateMarkNodeArray.length; i++) {
        var node = this.rateMarkNodeArray[i];
        var pos = node.getPosition();
        node.setPosition(cc.v2(pos.x, pos.y - offsetY));
      }
      for (var _i2 = 0; _i2 < this.rateMarkNodeArray.length; _i2++) {
        var _node2 = this.rateMarkNodeArray[_i2];
        var _pos = _node2.getPosition();
        if (_pos.y < -218 - 50) {
          var _node = this.rateMarkNodeArray.shift();
          _i2--;
          var lastNode = this.rateMarkNodeArray[this.rateMarkNodeArray.length - 1];
          var labStr = lastNode.getChildByName('Label').getComponent(cc.Label).string;
          var _pos2 = lastNode.getPosition();
          var rate = Number(labStr.split('x')[0]);
          _node.getChildByName('Label').getComponent(cc.Label).string = Number(rate + 0.2).toFixed(1) + 'x';
          _node.setPosition(cc.v2(_pos2.x, _pos2.y + this.lineRateMarkOffsetY));
          this.rateMarkNodeArray.push(_node);
        }
      }
    }
  },
  /**
   * 移动时间标记
   * @param {number} offsetX 
   */
  moveTimeMark: function moveTimeMark(offsetX) {
    for (var i = 0; i < this.timeMarkNodeArray.length; i++) {
      var node = this.timeMarkNodeArray[i];
      var pos = node.getPosition();
      node.setPosition(cc.v2(pos.x - offsetX, pos.y));
    }
    for (var _i3 = 0; _i3 < this.timeMarkNodeArray.length; _i3++) {
      var _node3 = this.timeMarkNodeArray[_i3];
      var _pos3 = _node3.getPosition();
      if (_pos3.x < -650) {
        var _node = this.timeMarkNodeArray.shift();
        _i3--;
        var lastNode = this.timeMarkNodeArray[this.timeMarkNodeArray.length - 1];
        var labStr = lastNode.getChildByName('Label').getComponent(cc.Label).string;
        var _pos4 = lastNode.getPosition();
        var time = Number(labStr.split('s')[0]);
        _node.getChildByName('Label').getComponent(cc.Label).string = time + 2 + 's';
        _node.setPosition(cc.v2(_pos4.x + this.lineTimeMarkOffsetX, _pos4.y));
        this.timeMarkNodeArray.push(_node);
      }
    }
  }
});

cc._RF.pop();