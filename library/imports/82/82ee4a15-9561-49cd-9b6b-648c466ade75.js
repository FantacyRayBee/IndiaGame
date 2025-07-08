"use strict";
cc._RF.push(module, '82ee4oVlWFJzZtrZIxGat51', 'mundaMainCtrl');
// munda/mundaScript/mundaMainCtrl.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    pab_player: cc.Prefab,
    pab_history: cc.Prefab,
    pab_jinbi: cc.Prefab,
    pab_rule: cc.Prefab,
    pab_touzi: cc.Prefab,
    pab_trend: cc.Prefab,
    pab_playerlist: cc.Prefab,
    pab_chat: cc.Prefab,
    sprite_TouziList: [cc.SpriteFrame],
    ske_light: [sp.SkeletonData],
    ske_touzhong: sp.SkeletonData,
    ske_win: sp.SkeletonData,
    ske_start: sp.SkeletonData,
    ske_stop: sp.SkeletonData,
    sprite_winNum: [cc.SpriteFrame]
  },
  ctor: function ctor() {
    this.betRoundCount = 0;
    this.userArryNode = []; //存放VIP玩家节点
    this.userBtnCion = 1;
    this.downSite = 0; //自己的VIP座位ID
    this.hasDown = false; //已经坐下（true），未上座（false）
    this.betBtnState = false; //下注按钮能否使用
    this.goldAllArr = [[], [], [], [], [], []]; //存放所有金币的数组
    this.tempTime = 0; //用来甄别是不是同一秒钟的两次消息
    this.selfBetAmount = [0, 0, 0, 0, 0, 0]; //自己下注的每个区域的数目，用来处理repeat bets
    this.betAllAmount = [0, 0, 0, 0, 0, 0]; //所有区域下注数目
    this.touziPosList = [cc.v2(-205, 50), cc.v2(0, 75), cc.v2(198, 90), cc.v2(-118, -67), cc.v2(45.5, -46.5), cc.v2(250, -55)];
    this.touziPosList_small = [cc.v2(-75, 30), cc.v2(0, 30), cc.v2(75, 30), cc.v2(-75, -35), cc.v2(0, -35), cc.v2(75, -35)];
    this.touziNodeList = [];
    this.loseAreaCountArr = []; //存放输的区域的金币移动完毕标识
    this.histAllArr = [[], [], [], [], [], []]; //存放每个区域历史记录的值
    this.repeatBetArr = [];
    this.currentBetNum = 0; //当前下注额
    this.limitMaxBetNum = 3000000; //下注上限
    this.tipsLabel = ["Your game is not finished yet . If you wish to exit the table , you will lose your money . Do you want to leave table?",
    // 退出游戏
    "Your cash is insufficient, Please recharge in time!",
    //您的现金不足，请及时充值！
    "non betting stage",
    //暂时不能下注
    "Upper limit of betting amount！" //投注金额上限！
    ];

    this.isGameEndStatus = false;
    this.showBetSpineTimeInterval = 15; // 显示下注动画的时间间隔
    this.showBetSpineTime = 0;
  },
  onLoad: function onLoad() {
    CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.SHOW_MUNDA_GAME);
    GlobalCfg.ACT_SCENE_CTRL = this, this.initNode();
    this.initJbPool();
    this.mundaBundle = cc.assetManager.getBundle('munda');
    this.sendReqCtrl = this.node.getComponent("sendReq");
    this.mundaAudioCtrl = this.node.getComponent("mundaAudioCtrl");
    this.mundaAudioCtrl.inite();
    this.EventHide();
    this.EventShow();
    this.paymentSwitch = false;
    this.cashSwitch();
    this.msgHandle = ClientNotify.register(GlobalCfg.MSG_TYPE.serverMsg, this.onEventMsg, this);
    this.msgHandle1 = ClientNotify.register(GlobalCfg.MSG_TYPE.clientMsg, this.onEventMsg, this);
  },
  initNode: function initNode() {
    GlobalCfg.ACT_SCENE_CTRL = this;
    CommonFun.getInstance().hidProgress();
    this.touziNode = this.node.getChildByName("touzi");
    this.jinbiParent = this.node.getChildByName("jinbiPool");
    this.startBettingSke = this.node.getChildByName("startBetting").getComponent(sp.Skeleton);
    this.startBettingSke.node.active = false;
    this.node_playersSeat = cc.find('Canvas_munda/node_players/node_playersSeat');
    this.playerSelf = cc.find('Canvas_munda/node_players/playerSelf');
    this.selfNodeCtrl = this.playerSelf.getComponent("playerCtrl");
    this.node_btnGuangQuan = cc.find('Canvas_munda/node_playerBetBtn/node_btnGuangQuan');
    this.node_time = this.node.getChildByName("node_time");
    this.lab_time = this.node_time.getChildByName("node_bg").getChildByName("lab_time").getComponent(cc.Label);
    this.node_clock = this.node_time.getChildByName("node_clock");
    this.lab_clock = this.node_clock.getChildByName("lab_time").getComponent(cc.Label);
    this.node_clock.active = false;
    this.btn_chat = cc.find('Canvas_munda/btn_chat').getComponent(cc.Button);
    this.btn_playersAll = cc.find('Canvas_munda/btn_playersAll').getComponent(cc.Button);
    this.playListPosX = this.btn_playersAll.node.x;
    this.playListPosY = this.btn_playersAll.node.y;
    this.lab_playerCount = this.btn_playersAll.node.getChildByName("playerCount").getChildByName("lab").getComponent(cc.Label);
    this.node_table = this.node.getChildByName("node_table");
    this.saizhongSke = this.node.getChildByName("touzhong").getComponent(sp.Skeleton);
    this.saizhongSke.setAnimation(0, "idle", false);
    this.btn_area_1 = this.node_table.getChildByName("node_1").getComponent(cc.Button);
    this.btn_area_2 = this.node_table.getChildByName("node_2").getComponent(cc.Button);
    this.btn_area_3 = this.node_table.getChildByName("node_3").getComponent(cc.Button);
    this.btn_area_4 = this.node_table.getChildByName("node_4").getComponent(cc.Button);
    this.btn_area_5 = this.node_table.getChildByName("node_5").getComponent(cc.Button);
    this.btn_area_6 = this.node_table.getChildByName("node_6").getComponent(cc.Button);
    this.betAreaArr = [this.btn_area_1, this.btn_area_2, this.btn_area_3, this.btn_area_4, this.btn_area_5, this.btn_area_6];
    this.lab_1 = this.node_table.getChildByName("node_1").getChildByName("lab_1").getComponent(cc.RichText);
    this.lab_2 = this.node_table.getChildByName("node_2").getChildByName("lab_2").getComponent(cc.RichText);
    this.lab_3 = this.node_table.getChildByName("node_3").getChildByName("lab_3").getComponent(cc.RichText);
    this.lab_4 = this.node_table.getChildByName("node_4").getChildByName("lab_4").getComponent(cc.RichText);
    this.lab_5 = this.node_table.getChildByName("node_5").getChildByName("lab_5").getComponent(cc.RichText);
    this.lab_6 = this.node_table.getChildByName("node_6").getChildByName("lab_6").getComponent(cc.RichText);
    this.betLabArr = [this.lab_1, this.lab_2, this.lab_3, this.lab_4, this.lab_5, this.lab_6];
    this.selfBetNum = new Array(this.betLabArr.length).fill(0);
    this.hist_1 = this.node_table.getChildByName("node_his1");
    this.hist_2 = this.node_table.getChildByName("node_his2");
    this.hist_3 = this.node_table.getChildByName("node_his3");
    this.hist_4 = this.node_table.getChildByName("node_his4");
    this.hist_5 = this.node_table.getChildByName("node_his5");
    this.hist_6 = this.node_table.getChildByName("node_his6");
    this.histArr = [this.hist_1, this.hist_2, this.hist_3, this.hist_4, this.hist_5, this.hist_6];
    this.btn_trendChart = cc.find('Canvas_munda/btn_trendChart').getComponent(cc.Button);
    this.btn_shop = cc.find('Canvas_munda/btn_shop').getComponent(cc.Button);
    this.btn_tc = cc.find('Canvas_munda/btn_tc').getComponent(cc.Button);
    this.btn_wf = cc.find('Canvas_munda/btn_wf').getComponent(cc.Button);
    this.btn_10 = cc.find('Canvas_munda/node_playerBetBtn/btn_10').getComponent(cc.Button);
    this.btn_50 = cc.find('Canvas_munda/node_playerBetBtn/btn_50').getComponent(cc.Button);
    this.btn_100 = cc.find('Canvas_munda/node_playerBetBtn/btn_100').getComponent(cc.Button);
    this.btn_1000 = cc.find('Canvas_munda/node_playerBetBtn/btn_1000').getComponent(cc.Button);
    this.btn_2000 = cc.find('Canvas_munda/node_playerBetBtn/btn_2000').getComponent(cc.Button);
    this.betAmountList = [10, 50, 100, 1000, 2000];
    if (GlobalCfg.USER_DATAS.gamePattern == 1) {
      this.betAmountList = [1, 10, 50, 100, 1000];
    }
    this.userBtnCion = this.betAmountList[0];
    this.choiceBetButton(this.btn_10);
    this.btn_10.node.getChildByName('lab').getComponent(cc.Label).string = this.betAmountList[0];
    this.btn_50.node.getChildByName('lab').getComponent(cc.Label).string = this.betAmountList[1];
    this.btn_100.node.getChildByName('lab').getComponent(cc.Label).string = this.betAmountList[2];
    this.btn_1000.node.getChildByName('lab').getComponent(cc.Label).string = this.betAmountList[3];
    this.btn_2000.node.getChildByName('lab').getComponent(cc.Label).string = this.betAmountList[4];
    this.btn_repeatBet = cc.find('Canvas_munda/node_playerBetBtn/btn_repeatBet').getComponent(cc.Button);
    this.btn_1 = cc.find('Canvas_munda/node_players/btn_01').getComponent(cc.Button);
    this.btn_2 = cc.find('Canvas_munda/node_players/btn_02').getComponent(cc.Button);
    this.btn_3 = cc.find('Canvas_munda/node_players/btn_03').getComponent(cc.Button);
    this.btn_4 = cc.find('Canvas_munda/node_players/btn_04').getComponent(cc.Button);
    this.btn_5 = cc.find('Canvas_munda/node_players/btn_05').getComponent(cc.Button);
    this.btn_6 = cc.find('Canvas_munda/node_players/btn_06').getComponent(cc.Button);
    var btnArr = this.node.getComponentsInChildren(cc.Button);
    for (var i = 0; i < btnArr.length; i++) {
      var name = btnArr[i].node.name;
      btnArr[i].node.on("click", this.btnClick, this);
    }
  },
  start: function start() {
    GameServerManager.send("gameservice.login", "LoginReq", {
      userid: GlobalCfg.USER_DATAS.userId,
      token: GlobalCfg.USER_DATAS.token,
      fromid: GlobalCfg.PRODUCT_ID //平台ID
    });
  },

  EventHide: function EventHide() {
    cc.game.on(cc.game.EVENT_HIDE, function () {
      LoggerUtil.getInstance().log("游戏进入后台");
      GameServerManager.hideFilterMag(1);
      this.saizhongSke.setAnimation(0, "idle", false);
      this.reConnection();
      this.freshScene();
    }, this);
  },
  EventShow: function EventShow() {
    cc.game.on(cc.game.EVENT_SHOW, function () {
      LoggerUtil.getInstance().log("重新返回游戏");
      this.saizhongSke.setAnimation(0, "idle", false);
      GameServerManager.hideFilterMag(2, function () {
        GameServerManager.send("gameservice.gamescene", "GameSceneReq", {});
      });
    }, this);
  },
  //重新开始刷新场景数据，重置
  freshScene: function freshScene() {
    this.selfBetNum.fill(0, 0);
    for (var i = 0; i < this.betAreaArr.length; i++) {
      this.showWinAreaSke(false, i);
    }
    for (var _i = 0, len = this.betLabArr.length; _i < len; _i++) {
      var lab = this.betLabArr[_i];
      // lab.string = "0 / 0";
      lab.string = "<color=#ffc705>0</c><color=#ffffff>/0</color>";
    }
    for (var _i2 = 0, _len = this.goldAllArr.length; _i2 < _len; _i2++) {
      var arr = this.goldAllArr[_i2];
      for (var j = arr.length - 1; j >= 0; j--) {
        var jbNode = arr[j];
        this.removeJbNode(jbNode);
        arr.splice(j, 1);
      }
      arr.length = 0;
    }
    for (var _i3 = this.touziNodeList.length - 1; _i3 >= 0; _i3--) {
      var touzi = this.touziNodeList[_i3];
      touzi.destroy();
      this.touziNodeList.splice(_i3, 1);
    }
    for (var _i4 = 0; _i4 < this.selfBetAmount.length; _i4++) {
      this.selfBetAmount[_i4] = 0;
    }
    for (var _i5 = 0; _i5 < this.betAllAmount.length; _i5++) {
      this.betAllAmount[_i5] = 0;
    }
    this.jinbiParent.removeAllChildren();
    this.loseAreaCountArr.length = 0;
    this.loseAreaCount = 0;
    // cc.Tween.stopAll();
    for (var _i6 = 1; _i6 < 11; _i6++) {
      cc.Tween.stopAllByTag(_i6);
    }
  },
  //断线重连
  reConnection: function reConnection() {
    this.clearSchedule();
    //删除之前的VIP节点
    for (var i = 0; i < this.userArryNode.length; i++) {
      var node = this.userArryNode[i];
      if (node) {
        node.destroy();
      }
    }
    this.hasDown = false;
    this.downSite = 0;
  },
  //清除计时器
  clearSchedule: function clearSchedule() {
    this.unschedule(this.selfBetCallBack);
    this.unschedule(this.vipBetCallBack);
    this.unschedule(this.otherBetCallBack);
    this.unschedule(this.waitToMoveSchedule);
    this.unschedule(this.touziInitSchedule);
  },
  initJbPool: function initJbPool() {
    this.jbPool = new cc.NodePool();
    var initCount = 150;
    for (var i = 0; i < initCount; i++) {
      this.jbPool.put(cc.instantiate(this.pab_jinbi)); //放入对象池
    }
  },

  createJbNode: function createJbNode() {
    var feijbNode = null;
    if (this.jbPool.size() > 0) {
      //通过size接口判断对象池中是否有空闲的对象
      feijbNode = this.jbPool.get();
    } else {
      //对象池中的备用对象不够时，通过cc.instantiate 重新创建
      feijbNode = cc.instantiate(this.pab_jinbi);
    }
    // feijbNode.setPosition(0, 0);
    return feijbNode;
  },
  removeJbNode: function removeJbNode(feijbNode) {
    if (feijbNode == null) {
      LoggerUtil.getInstance().error("将金币对象放回对象池中，金币对象为空！");
      return;
    }
    // feijbNode.destroy();
    feijbNode.setPosition(0, 0);
    this.jbPool.put(feijbNode);
  },
  btnClick: function btnClick(button) {
    var pos = button.node.getPosition();
    var btnName = button.node.name;
    LoggerUtil.getInstance().log("点击的button节点名：", btnName);
    if (btnName == "btn_chat") {
      GlobalCfg.G_COMPONENTS.Audio.playButton();
      if (this.hasDown) {
        var pab_chat = cc.instantiate(this.pab_chat);
        var ctrl = pab_chat.getComponent("chatCtrl");
        ctrl.setPlayerSeat(this.getVIPistMe());
        this.node.addChild(pab_chat);
      } else {
        CommonFun.getInstance().showTips("You're not a VIP. You can't send expressions");
      }
    } else if (btnName == "btn_playersAll") {
      GlobalCfg.G_COMPONENTS.Audio.playButton();
      var playList = cc.instantiate(this.pab_playerlist);
      var _ctrl = playList.getComponent("mundaPlayerListCtrl");
      _ctrl.reqPlayerlist(0, 12);
      this.node.addChild(playList);
    } else if (btnName == "btn_trendChart") {
      GlobalCfg.G_COMPONENTS.Audio.playButton();
      var trend = cc.instantiate(this.pab_trend);
      var trendCtrl = trend.getComponent("trendCtrl");
      trendCtrl.setTrendData(this.histAllArr);
      trend.parent = this.node;
    } else if (btnName == "btn_shop") {
      GlobalCfg.G_COMPONENTS.Audio.playButton();
      CommonFun.getInstance().showSmallAddCash();
    } else if (btnName == "btn_tableInfo") {
      var rule = this.node.getChildByName("rule");
      if (!rule) {
        GlobalCfg.G_COMPONENTS.Audio.playButton();
        var pab_rule = cc.instantiate(this.pab_rule);
        this.node.addChild(pab_rule);
      }
    } else if (btnName == "btn_openMenu") {
      GlobalCfg.G_COMPONENTS.Audio.playButton();
      CommonFun.getInstance().showGameMenu(false);
    } else if (btnName == "btn_10") {
      GlobalCfg.G_COMPONENTS.Audio.playButton();
      this.userBtnCion = button.node.getChildByName('lab').getComponent(cc.Label).string;
      this.choiceBetButton(button);
    } else if (btnName == "btn_50") {
      GlobalCfg.G_COMPONENTS.Audio.playButton();
      this.userBtnCion = button.node.getChildByName('lab').getComponent(cc.Label).string;
      this.choiceBetButton(button);
    } else if (btnName == "btn_100") {
      GlobalCfg.G_COMPONENTS.Audio.playButton();
      this.userBtnCion = button.node.getChildByName('lab').getComponent(cc.Label).string;
      this.choiceBetButton(button);
    } else if (btnName == "btn_1000") {
      GlobalCfg.G_COMPONENTS.Audio.playButton();
      this.userBtnCion = button.node.getChildByName('lab').getComponent(cc.Label).string;
      this.choiceBetButton(button);
    } else if (btnName == "btn_2000") {
      GlobalCfg.G_COMPONENTS.Audio.playButton();
      this.userBtnCion = button.node.getChildByName('lab').getComponent(cc.Label).string;
      this.choiceBetButton(button);
    } else if (btnName == "btn_01") {
      GlobalCfg.G_COMPONENTS.Audio.playButton();
      this.clickVIPuP(1);
    } else if (btnName == "btn_02") {
      GlobalCfg.G_COMPONENTS.Audio.playButton();
      this.clickVIPuP(2);
    } else if (btnName == "btn_03") {
      GlobalCfg.G_COMPONENTS.Audio.playButton();
      this.clickVIPuP(3);
    } else if (btnName == "btn_04") {
      GlobalCfg.G_COMPONENTS.Audio.playButton();
      this.clickVIPuP(4);
    } else if (btnName == "btn_05") {
      GlobalCfg.G_COMPONENTS.Audio.playButton();
      this.clickVIPuP(5);
    } else if (btnName == "btn_06") {
      GlobalCfg.G_COMPONENTS.Audio.playButton();
      this.clickVIPuP(6);
    } else if (btnName == "node_1") {
      //下注区域 0
      if (this.betBtnState == true) {
        GlobalCfg.G_COMPONENTS.Audio.playButton();
      }
      this.betting(this.userBtnCion, 0);
    } else if (btnName == "node_2") {
      if (this.betBtnState == true) {
        GlobalCfg.G_COMPONENTS.Audio.playButton();
      }
      this.betting(this.userBtnCion, 1);
    } else if (btnName == "node_3") {
      if (this.betBtnState == true) {
        GlobalCfg.G_COMPONENTS.Audio.playButton();
      }
      this.betting(this.userBtnCion, 2);
    } else if (btnName == "node_4") {
      if (this.betBtnState == true) {
        GlobalCfg.G_COMPONENTS.Audio.playButton();
      }
      this.betting(this.userBtnCion, 3);
    } else if (btnName == "node_5") {
      if (this.betBtnState == true) {
        GlobalCfg.G_COMPONENTS.Audio.playButton();
      }
      this.betting(this.userBtnCion, 4);
    } else if (btnName == "node_6") {
      if (this.betBtnState == true) {
        GlobalCfg.G_COMPONENTS.Audio.playButton();
      }
      this.betting(this.userBtnCion, 5);
    } else if (btnName == "btn_repeatBet") {
      //重复上局下注
      if (this.betBtnState == true) {
        GlobalCfg.G_COMPONENTS.Audio.playButton();
        this.repeatBet();
      }
    }
  },
  onEventMsg: function onEventMsg(webData, target) {
    var self = target;
    var msgId = webData.msgCode;
    var notify = webData.msgData;
    if (msgId === "gameservice.login") {
      // 登录游戏
      self.setLoginInfo(notify);
    } else if (msgId === "gameservice.gamescene") {
      // 刚进入游戏后游戏场景信息
      self.setGameScene(notify);
    } else if (msgId === "gameservice.callnotify") {
      // vip发射广播，这里普通用户就自己ack vip用户就广播
      self.resolveCallNotify(notify);
    } else if (msgId === "gameservice.gamestartnotify") {
      // 游戏开始
      self.isGameEndStatus = false;
      self.setGameStart(notify);
    } else if (msgId === "gameservice.gameendnotify") {
      // 游戏结果
      self.isGameEndStatus = true;
      self.resolveGameEndNotify(notify);
    } else if (msgId === "gameservice.joinvipnotify") {
      // vip入座进入
      self.setJoinVipNotify(notify);
    } else if (msgId === "gameservice.leavevipnotify") {// 玩家离开
    } else if (msgId === "gameservice.exitgame") {
      //退出游戏
      LoggerUtil.getInstance().log("~~~~~~~~~~~~~~退出游戏");
      self.clearSchedule();
      SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.MUNDA, SceneManager.getInstance().sceneType.LOBBY);
    } else if (msgId === "gameservice.viplist") {
      //VIP列表
      self.updateVipList(notify);
    } else if (msgId === "gameservice.playerlist") {
      LoggerUtil.getInstance().log("palyerList", notify);
      self.lab_playerCount.string = notify.total;
    } else if (msgId === "gameservice.querygameendinfo") {
      self.setGameEndInfo(notify);
    } else if (msgId == GlobalCfg.CLIENT_MSG_ID.NET_OPEN && notify === "GAME_SERVER") {
      // self.sendReqCtrl.loginReq();
    } else if (msgId == "gameservice.shortmessagenotify") {
      self.shortmessagenotify(notify);
    } else if (msgId == GlobalCfg.CLIENT_MSG_ID.CURRENCY_CHANGED_USER_INFO) {
      var coin = notify.deposit + notify.winnings;
      self.selfNodeCtrl.setCoin(coin);
    }
    // else if(msgId == GlobalCfg.CLIENT_MSG_ID.FIRST_RECHARGE_TIPS) {
    //     SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.MUNDA, SceneManager.getInstance().sceneType.LOBBY);
    // }
    else if (msgId == GlobalCfg.CLIENT_MSG_ID.GAME_MENU_CLICK_OUT_TO_LOBBY) {
      var betCoinAll = 0;
      for (var i = 0; i < self.selfBetAmount.length; i++) {
        var element = self.selfBetAmount[i];
        betCoinAll += element;
      }
      ;
      if (betCoinAll > 0 && self.isGameEndStatus == false) {
        CommonFun.getInstance().showMsgBox(self.tipsLabel[0], "YES_NO", function () {
          self.sendReqCtrl.ExitGameReq();
        }, false);
      } else {
        self.sendReqCtrl.ExitGameReq();
      }
    } else if (msgId == GlobalCfg.CLIENT_MSG_ID.GAME_MENU_CLICK_HOW_TO_PLAY) {
      CommonFun.getInstance().showRule("munda");
    } else if (msgId == "lobbyservice.kicktolobby") {
      SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.MUNDA, SceneManager.getInstance().sceneType.LOBBY);
    }
  },
  checkWebMsgError: function checkWebMsgError(webData, target) {
    var self = target;
    var msgId = webData.msgCode;
    var notify = webData.msgData;
    if (!notify) {
      var info = {
        errorMessage: "Munda\u6E38\u620F\u4E2D, \u670D\u52A1\u5668\u4E0B\u53D1\u7684\u975E\u6B63\u786E\u6D88\u606F\u4E2D\u7ED3\u6784\u4F53\u5F02\u5E38, \u5185\u5BB9\u4E3A===>" + JSON.stringify(webData)
      };
      CommonFun.getInstance().reportToTelegram(info);
      return;
    }
    ;
    var result = notify.result;
    if (notify.Result) {
      result = notify.Result;
    }
    ;
    if (msgId === "gameservice.call") {
      if (CommonFun.getInstance().isFreePlayerDirectedToFreeTP()) {
        if (result.result == 57) {
          CommonFun.getInstance().showDiversionFreeTP(function () {
            GameServerManager.send("gameservice.exitgame", "ExitGameReq", {});
            // SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.MUNDA, SceneManager.getInstance().sceneType.LOBBY);
          });
        } else {
          if (result.result == 19) {
            if (GlobalCfg.IS_CLUB_MODE == 1) {
              //代理模式不跳转商城
              CommonFun.getInstance().showMsgBox('Insufficient cash', "YES", function () {}, false);
            } else {
              CommonFun.getInstance().showMsgBox("Your cash is insufficient, Please recharge in time！", "SHOP", function () {
                CommonFun.getInstance().showSmallAddCash();
              }, false);
            }
          } else {
            CommonFun.getInstance().showTips(result.message);
          }
          ;
        }
        ;
      } else {
        if (result.result == 19) {
          if (GlobalCfg.IS_CLUB_MODE == 1) {
            //代理模式不跳转商城
            CommonFun.getInstance().showMsgBox('Insufficient cash', "YES", function () {}, false);
          } else {
            CommonFun.getInstance().showMsgBox("Your cash is insufficient, Please recharge in time！", "SHOP", function () {
              CommonFun.getInstance().showSmallAddCash();
            }, false);
          }
        } else {
          CommonFun.getInstance().showTips(result.message);
        }
        ;
      }
      ;
    } else if (msgId === "gameservice.login") {
      CommonFun.getInstance().showMsgBox(result.message, "YES", function () {
        SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.MUNDA, SceneManager.getInstance().sceneType.LOBBY);
      }, false);
    }
  },
  cashSwitch: function cashSwitch() {
    if (GlobalCfg.PAYMENT_SWITCH == 2 && GlobalCfg.CHANNEL == "ios") {
      var btn_add = cc.find('Canvas_munda/btn_shop/Background/icon_chipsshop');
      btn_add.active = GlobalCfg.USER_DATAS.isNotCharge;
    }
    this.node.getChildByName("btn_shop").active = GlobalCfg.USER_DATAS.openModules.includes(4);
    this.paymentSwitch = GlobalCfg.USER_DATAS.openModules.includes(4);
  },
  setLoginInfo: function setLoginInfo(notify) {
    var _this = this;
    if (!notify) {
      LoggerUtil.getInstance().error("登录的消息为空！", notify);
      return;
    }
    if (!notify.config) {
      LoggerUtil.getInstance().error("登录的config消息为空！");
      CommonFun.getInstance().showMsgBox("Connection error " + "\n" + "403", "YES", function () {
        _this.sendReqCtrl.ExitGameReq();
      }, false);
      return;
    }
    this.selfNodeCtrl.setPlayerInfo(notify.userinfo, true);
    this.mundaAudioCtrl.playGameMusic("munda");
    // this.setGameConfig(notify.config);
  },

  //登录设置时间
  setGameConfig: function setGameConfig(config) {
    if (config.bettingTime > 0) {
      this.lab_clock.string = config.bettingTime;
      this.node_clock.active = true;
      this.lab_time.string = config.bettingTime;
    } else {
      this.node_clock.active = false;
    }
    LoggerUtil.getInstance().log("结算后等待时间：", config.waitTime);
  },
  updateVipList: function updateVipList(notify) {
    var vipList = notify.list;
    var vipSiteArr = [];
    for (var i = 0; i < vipList.length; i++) {
      var userInfo = vipList[i];
      var seat = userInfo.seat;
      vipSiteArr.push(seat);
    }
    for (var _i7 = 0; _i7 < this.userArryNode.length; _i7++) {
      var playerNode = this.userArryNode[_i7];
      if (playerNode && playerNode.isValid == true) {
        var playerCtrl = playerNode.getComponent("playerCtrl");
        var siteID = playerCtrl.siteID;
        if (vipSiteArr.indexOf(siteID) == -1) {
          playerNode.destroy();
        }
      }
    }
    for (var _i8 = 0; _i8 < vipList.length; _i8++) {
      var _userInfo = vipList[_i8];
      var _seat = _userInfo.seat;
      var _playerNode = this.getPlayerNodeBySeatID(_seat);
      if (_playerNode && _playerNode.isValid == true) {
        var _playerCtrl = _playerNode.getComponent("playerCtrl");
        _playerCtrl.setPlayerInfo(_userInfo, false);
      } else {
        var vipNode = cc.instantiate(this.pab_player);
        var _playerCtrl2 = vipNode.getComponent("playerCtrl");
        _playerCtrl2.setPlayerInfo(_userInfo, false);
        vipNode.parent = this.node_playersSeat;
        this.userArryNode[_seat] = vipNode;
      }
    }
  },
  setGameScene: function setGameScene(notify) {
    if (!notify) {
      LoggerUtil.getInstance().error("Munda-服务器返回的GameScene的数据为空！");
      return;
    }
    ;
    LoggerUtil.getInstance().log("gamescene===============================>", notify.first);
    this.lab_playerCount.string = notify.playerNumber;
    var vipList = notify.vipList;
    var requester = notify.requester;
    if (requester) {
      GlobalCfg.USER_DATAS.userDiamond = requester.diamond;
      this.selfNodeCtrl.lab_coin.string = CommonFun.getInstance().numberToShow(requester.diamond / 100);
    }
    ;
    if (notify.first) {
      LoggerUtil.getInstance().log("gamescene----------------------------->");
      this.freshScene();
      this.reConnection();
      var pools = notify.pools;
      if (notify.status == 0) {
        for (var i = 0, len = pools.length; i < len; i++) {
          var BossPool = pools[i];
          this.resolveBoosPool(BossPool, true, true);
        }
      } else {
        var _pools = notify.pools;
        for (var _i9 = 0; _i9 < _pools.length; _i9++) {
          var _BossPool = _pools[_i9];
          var boss = _BossPool.boss;
          this.betAllAmount[boss] = _BossPool.all;
          // this.betLabArr[boss].string = BossPool.self / 100 + " / " + BossPool.all / 100;
          this.betLabArr[boss].string = "<color=#ffc705>" + _BossPool.self / 100 + "</c><color=#ffffff>/" + _BossPool.all / 100 + "</color>";
        }
      }
      ;
      for (var _i10 = 0, _len2 = vipList.length; _i10 < _len2; _i10++) {
        var item = vipList[_i10];
        var seat = item.seat;
        var vipNode = cc.instantiate(this.pab_player);
        var playerCtrl = vipNode.getComponent("playerCtrl");
        playerCtrl.setPlayerInfo(item, false);
        vipNode.parent = this.node_playersSeat;
        this.userArryNode[seat] = vipNode;
      }
      ;
      LoggerUtil.getInstance().log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>", vipList);
      this.selfNodeCtrl.setPlayerInfo(notify.requester, true);
    }
    ;
    if (notify.status == 0) {
      this.setGameReadyStatus(notify);
    } else if (notify.status == 1) {
      this.setGameResultStatus(notify);
    }
  },
  //游戏中
  setGameReadyStatus: function setGameReadyStatus(notify) {
    var _this2 = this;
    var isFirstTime = false;
    var remaining = notify.remaining;
    if (this.tempTime == remaining) {
      isFirstTime = false;
    } else {
      isFirstTime = true;
    }
    this.tempTime = remaining;
    if (remaining > 15 && remaining < 20 && isFirstTime == true) {
      this.betBtnState = false;
      var time = remaining - 16;
      this.lab_time.string = CommonFun.getInstance().showLabelLanguage("Betting starts in " + time + " seconds");
      if (time == 0) {
        this.mundaAudioCtrl.playGameSound("start", false);
        this.startBettingSke.skeletonData = this.ske_start;
        var curScene = cc.director.getScene();
        if (curScene.getChildByName("Tips")) {
          LoggerUtil.getInstance().log("当前tips存在，执行 tipsCtrl.showConten();");
          var tipsCtrl = curScene.getChildByName("Tips").getComponent("TipsCtrl");
          tipsCtrl.showConten();
        }
        this.startBettingSke.node.active = true;
        this.startBettingSke.setAnimation(0, "animation", false);
      }
    } else if (remaining <= 15 && isFirstTime == true) {
      var self = this;
      if (this.repeatBetArr.length > 0) {
        this.mundaBundle.load("mundaRes/main/btn_repeat", cc.SpriteFrame, function (err, spriteFrame) {
          if (!err) {
            self.btn_repeatBet.node.getChildByName("Background").getComponent(cc.Sprite).spriteFrame = spriteFrame;
            self.btn_repeatBet.enabled = true;
          } else {
            LoggerUtil.getInstance().error(JSON.stringify(err));
          }
        });
      } else {
        this.mundaBundle.load("mundaRes/main/btn_newOra_big", cc.SpriteFrame, function (err, spriteFrame) {
          if (!err) {
            self.btn_repeatBet.node.getChildByName("Background").getComponent(cc.Sprite).spriteFrame = spriteFrame;
            self.btn_repeatBet.enabled = false;
          } else {
            LoggerUtil.getInstance().error(JSON.stringify(err));
          }
        });
      }
      this.startBettingSke.node.active = false;
      // this.startBettingSke.skeletonData = null;
      this.betBtnState = true;
      this.lab_clock.string = remaining;
      this.node_clock.active = true;
      this.lab_time.string = CommonFun.getInstance().showLabelLanguage("Betting end in " + remaining + " seconds");
      if (remaining < 3 && remaining > 0 && isFirstTime == true) {
        this.mundaAudioCtrl.playGameSound("countDown", false);
      }
      if (remaining <= 1) {
        this.betBtnState = false;
      }
      if (remaining == 0 && isFirstTime == true) {
        LoggerUtil.getInstance().log("此时倒计时为0");
        this.startBettingSke.skeletonData = this.ske_stop;
        var _curScene = cc.director.getScene();
        if (_curScene.getChildByName("Tips")) {
          var _tipsCtrl = _curScene.getChildByName("Tips").getComponent("TipsCtrl");
          _tipsCtrl.showConten();
        }
        this.startBettingSke.node.active = true;
        this.startBettingSke.setAnimation(0, "animation", false);
        this.mundaAudioCtrl.playGameSound("stopBet", false);
      }
      this.startBettingSke.setCompleteListener(function (trackEntry, loopCount) {
        var name = trackEntry.animation.name;
        if (name == "animation") {
          _this2.startBettingSke.node.active = false;
        }
      });
    }
    var pools = notify.pools;
    LoggerUtil.getInstance().log("gameScene中的pools下注信息", pools);
    var isPlaySound = false;
    for (var i = 0, len = pools.length; i < len; i++) {
      var BossPool = pools[i];
      var boss = BossPool.boss;
      if (BossPool.all > this.betAllAmount[boss] && isPlaySound == false) {
        this.mundaAudioCtrl.playGameSound("otherCoin", false);
        isPlaySound = true;
      }
      this.resolveBoosPool(BossPool, false);
    }
    var num = FloatCalculation.accDiv(GlobalCfg.USER_DATAS.userDiamond, 100);
  },
  //结算中
  setGameResultStatus: function setGameResultStatus(notify) {
    if (notify.first == true) {
      this.sendReqCtrl.QueryGameEndInfoReq();
    }
    this.node_clock.active = false;
    this.lab_time.string = CommonFun.getInstance().showLabelLanguage("Billing...");
    var self = this;
    // if (this.repeatBetArr.length <= 0) {
    this.mundaBundle.load("mundaRes/main/btn_newOra_big", cc.SpriteFrame, function (err, spriteFrame) {
      if (!err) {
        self.btn_repeatBet.node.getChildByName("Background").getComponent(cc.Sprite).spriteFrame = spriteFrame;
        self.btn_repeatBet.enabled = false;
      } else {
        LoggerUtil.getInstance().error(JSON.stringify(err));
      }
    });
    // }
  },

  //处于结算状态进入游戏显示当前局的骰子结果
  setGameEndInfo: function setGameEndInfo(notify) {
    var dice = notify.dice;
    for (var i = 0; i < dice.length; i++) {
      var element = dice[i];
      var touzi = cc.instantiate(this.pab_touzi);
      touzi.getComponent(cc.Sprite).spriteFrame = this.sprite_TouziList[element];
      var touziCtrl = touzi.getComponent("touziCtrl");
      touziCtrl.setTouziDice(element);
      touzi.setPosition(this.touziPosList[i]);
      touzi.parent = this.touziNode;
      this.touziNodeList.push(touzi);
    }
    var pools = notify.pools;
    for (var _i11 = 0; _i11 < pools.length; _i11++) {
      var BossPool = pools[_i11];
      var boss = BossPool.boss;
      var number = BossPool.number;
      this.showWinAreaSke(true, boss, number);
      if (number >= 2) {
        this.resolveBoosPool(BossPool, true, true);
      } else {
        var historyDataArr = BossPool.history;
        this.histAllArr.splice(boss, 1, historyDataArr);
        var tempArr = historyDataArr.concat();
        var arr_12 = this.deleteArrToAmount(tempArr, 12);
        this.resolveHistoryData(boss, arr_12, true);
      }
    }
    this.waitToMove(notify, true);
  },
  /**
   * 处理服务器的BossPool数据，BossPool 即为下注数据
   * @param {Object} BossPool 
   * @param {Boolean} isGameEnd 是否游戏结束
   * @param {Boolean} isFirstEnter 是否第一次连接
   */
  resolveBoosPool: function resolveBoosPool(BossPool, isGameEnd, isFirstEnter) {
    var _this3 = this;
    if (isFirstEnter === void 0) {
      isFirstEnter = false;
    }
    var boss = BossPool.boss;
    this.selfBetAmount[boss] = BossPool.self;
    var goldCount = this.initTableGlodCount(BossPool.all);
    if (isFirstEnter == true) {
      for (var i = 0; i < goldCount; i++) {
        var jbnode = this.createJbNode();
        var pos = this.randomPos(boss);
        jbnode.setPosition(pos);
        jbnode.parent = this.jinbiParent;
        this.pushToArr(boss, jbnode);
      }
    }
    if (BossPool.all > this.betAllAmount[boss] && isFirstEnter == false) {
      this.playListAnimation();
      var startPos = cc.v2(-539, -319);
      this.otherBetCallBack = function () {
        var endPos = _this3.randomPos(boss);
        _this3.bettingCoin(startPos, endPos, boss, _this3.jinbiParent);
      };
      this.schedule(this.otherBetCallBack, 0.05, 2, 0);
    }
    if (this.selfBetNum[boss] < BossPool.self) {
      cc.tween(this.betLabArr[boss].node).to(0.1, {
        scale: 1.2
      }).to(0.1, {
        scale: 1
      }).start();
    }
    this.selfBetNum[boss] = BossPool.self;
    this.betAllAmount[boss] = BossPool.all;
    this.betLabArr[boss].string = "<color=#ffc705>" + BossPool.self / 100 + "</c><color=#ffffff>/" + BossPool.all / 100 + "</color>";
    if (isGameEnd == true) {
      var historyDataArr = BossPool.history;
      this.histAllArr.splice(boss, 1, historyDataArr);
      var tempArr = historyDataArr.concat();
      var arr_12 = this.deleteArrToAmount(tempArr, 12);
      this.resolveHistoryData(boss, arr_12, isGameEnd);
    }
  },
  /**
   * 从数组头部删除数据至指定长度
   * @param {Array} arr 
   * @param {Number} amount 
   * @returns arr
   */
  deleteArrToAmount: function deleteArrToAmount(arr, amount) {
    if (!arr || arr.length == 0) {
      return [];
    }
    ;
    if (arr.length > amount) {
      arr.splice(0, arr.length - amount);
      return arr;
    } else {
      return arr;
    }
  },
  /**
   * /**
   * 设置历史记录
   * @param {Number} type 下注区域
   * @param {Array} arr 历史记录数组
   * @param {Boolean} isSettlement 是否结算消息或者第一次进入
   */
  resolveHistoryData: function resolveHistoryData(type, arr, isSettlement) {
    if (isSettlement == true) {
      if (Array.isArray(arr) != true) {
        LoggerUtil.getInstance().error("resolveHistoryData方法传入参数错误：", arr);
        return;
      }
      var historyNodeParent = this.histArr[type];
      historyNodeParent.removeAllChildren();
      for (var i = 0, len = arr.length; i < len; i++) {
        var data = arr[i];
        var histortyNode = cc.instantiate(this.pab_history);
        var historyCtrl = histortyNode.getComponent("historyCtrl");
        historyCtrl.setSprite(data);
        historyNodeParent.addChild(histortyNode);
      }
    }
  },
  // 处理下注消息
  resolveCallNotify: function resolveCallNotify(notify) {
    var _this4 = this;
    var playerid = notify.playerId;
    var seat = notify.seat;
    var boss = notify.boss;
    var afterGold = notify.after; //下注之后的金币数目
    if (playerid == this.selfNodeCtrl.getPlayerid()) {
      //表示玩家自己
      this.mundaAudioCtrl.playGameSound("touCoin", false);
      this.upAnimation(this.selfNodeCtrl.node);
      var startPos = cc.v2(-343, -304);
      var count = this.setCount(notify.amount);
      this.selfBetCallBack = function () {
        var endPos = _this4.randomPos(boss);
        _this4.bettingCoin(startPos, endPos, boss, _this4.jinbiParent);
      };
      this.schedule(this.selfBetCallBack, 0.05, count - 1, 0);
      this.selfNodeCtrl.setCoin(afterGold, true);
      if (this.hasDown) {
        this.betRoundCount = 0;
        var playerCtrl = this.getPlayerInfoByUserId(this.downSite);
        playerCtrl && playerCtrl.setCoin(afterGold);
      }
    } else {
      //VIP 座位
      this.mundaAudioCtrl.playGameSound("otherCoin", false);
      var _playerCtrl3 = this.getPlayerInfoByUserId(seat);
      if (_playerCtrl3) {
        this.upAnimation(_playerCtrl3.node, cc.find("Canvas_munda/node_players/btn_0" + seat));
        var _startPos = _playerCtrl3.getVipNodePos(seat);
        this.vipBetCallBack = function () {
          var endPos = _this4.randomPos(boss);
          _this4.bettingCoin(_startPos, endPos, boss, _this4.jinbiParent);
        };
        this.schedule(this.vipBetCallBack, 0.05, 5, 0);
        _playerCtrl3.setCoin(afterGold);
      }
    }
  },
  // 玩家发送表情
  shortmessagenotify: function shortmessagenotify(notify) {
    if (!notify) {
      return;
    }
    ;
    var msgType = notify.msgType; // 消息类型 0短语 1表情 2礼物
    var target = notify.target; // 接收者seat (-1表示群发)
    var sender = notify.sender; // 发送者seat
    var price = notify.price; // 消息价格
    var senderAfter = notify.senderAfter; // 发送者扣价后货币
    var name = notify.name; // 表情名/短语内容

    if (msgType == 0 || msgType == 1) {
      var playScript = this.getPlayerInfoByUserId(target);
      playScript.face(notify);
    } else if (msgType == 2) {
      var targetNodeArr = [];
      var senderCtrl = this.getPlayerInfoByUserId(sender);
      if (!senderCtrl || !senderCtrl.node) {
        return;
      } else {
        senderCtrl.setCoin(senderAfter);
        if (senderCtrl.getPlayerid() == this.selfNodeCtrl.getPlayerid()) {
          this.selfNodeCtrl.setCoin(senderAfter, true);
        }
      }
      if (target == -1) {
        for (var i = 0; i < this.userArryNode.length; i++) {
          var userNode = this.userArryNode[i];
          if (userNode) {
            var userInfoCtrl = userNode.getComponent('playerCtrl');
            if (userInfoCtrl && userInfoCtrl !== senderCtrl) {
              targetNodeArr.push(userNode);
            }
            ;
          }
          ;
        }
        ;
      } else {
        var playersCtrl = this.getPlayerInfoByUserId(target);
        if (playersCtrl) {
          targetNodeArr.push(playersCtrl.node);
        }
        ;
      }
      ;
      CommonFun.getInstance().playGameGifInteraction(name, senderCtrl.node, targetNodeArr);
    }
    ;
  },
  //游戏开始
  setGameStart: function setGameStart(notify) {
    this.freshScene();
    this.sendReqCtrl.VipListReq();
  },
  //游戏结果
  resolveGameEndNotify: function resolveGameEndNotify(notify) {
    var _this5 = this;
    LoggerUtil.getInstance().log("游戏结算---------===========", this.selfBetAmount);
    var betCount = 0;
    for (var i = 0; i < this.selfBetAmount.length; i++) {
      var element = this.selfBetAmount[i];
      betCount += element;
    }
    this.curRoundBet = betCount;
    if (this.hasDown) {
      if (betCount <= 0) {
        this.betRoundCount++;
      } else {
        this.betRoundCount = 0;
      }
    }
    if (this.betRoundCount > 3) {
      this.sendReqCtrl.JoinVipReq(this.downSite, 2);
    }
    ;
    this.selfResult = notify.selfResult;
    this.gameResults = notify.vipResult;
    this.gameEndData = notify.dice; //骰子的哪个面
    var pools = notify.pools; //结算信息
    this.betBtnState = false;
    this.saizhongSke.skeletonData = this.ske_touzhong;
    this.saizhongSke.setAnimation(0, "star", false);
    this.mundaAudioCtrl.playGameSound("shake", false); //播放色盅的音效
    this.repeatBetArr.length = 0;
    for (var _i12 = 0; _i12 < this.selfBetAmount.length; _i12++) {
      var _element = this.selfBetAmount[_i12];
      if (_element > 0) {
        this.repeatBetArr.push({
          type: _i12,
          count: _element
        });
      }
    }
    LoggerUtil.getInstance().log("开始播放：", Date.now());
    this.touziInitSchedule = function () {
      _this5.mundaAudioCtrl.playGameSound("throw", false);
      _this5.saizhongSke.setAnimation(0, "idle", false);
      for (var _i13 = 0; _i13 < _this5.gameEndData.length; _i13++) {
        var dice = _this5.gameEndData[_i13];
        // LoggerUtil.getInstance().log("骰子面的值:", dice);
        var touzi = cc.instantiate(_this5.pab_touzi);
        touzi.getComponent(cc.Sprite).spriteFrame = _this5.sprite_TouziList[dice];
        var touziCtrl = touzi.getComponent("touziCtrl");
        touziCtrl.setTouziDice(dice);
        touzi.setPosition(_this5.touziPosList[_i13]);
        touzi.parent = _this5.touziNode;
        _this5.touziNodeList.push(touzi);
      }
      _this5.waitToMove(notify);
    };
    this.scheduleOnce(this.touziInitSchedule, 2.7);
  },
  waitToMove: function waitToMove(notify, isReconn) {
    var _this6 = this;
    if (isReconn === void 0) {
      isReconn = false;
    }
    this.waitToMoveSchedule = function () {
      _this6.moveTouziToArea(notify, isReconn);
    };
    this.scheduleOnce(this.waitToMoveSchedule, 1);
  },
  //移动骰子到获胜区域
  moveTouziToArea: function moveTouziToArea(notify, isReconn) {
    var _this7 = this;
    if (isReconn === void 0) {
      isReconn = false;
    }
    var dices = notify.dice;
    this.touziNodeList.sort(function (a, b) {
      if (a && b) {
        var ValueA = a.getComponent("touziCtrl").getTouziDice();
        var ValueB = b.getComponent("touziCtrl").getTouziDice();
        if (ValueA < ValueB) {
          // 按某种排序标准进行比较, a 小于 b
          return -1;
        }
        if (ValueA > ValueB) {
          return 1;
        }
        return 0;
      }
    });
    var temp = null;
    var count = 0;
    var index = 0;
    for (var i = 0; i < this.touziNodeList.length; i++) {
      var touzi = this.touziNodeList[i];
      var dice = touzi.getComponent("touziCtrl").getTouziDice();
      if (temp == dice) {
        count++;
      } else {
        count = 1;
      }
      var toPos = this.getTouziPos(dice, count);
      temp = dice;
      cc.tween(touzi).tag(1).to(0.5, {
        scale: 0.65,
        position: toPos
      }).call(function () {
        index++;
        if (index == dices.length - 1 && isReconn == false) {
          _this7.settlement(notify);
        }
      }).start();
    }
  },
  /**
   * 
   * @param {Number} boss >=0
   * @param {Number} count >= 1
   * @returns 骰子移动到的位置
   */
  getTouziPos: function getTouziPos(boss, count) {
    var node = this.betAreaArr[boss].node;
    var pos = this.touziPosList_small[count - 1];
    if (cc.isValid(node) && pos) {
      var nodepos = node.getPosition();
      return cc.v2(nodepos.x + pos.x, nodepos.y + pos.y);
    }
    ;
    if (pos) {
      return cc.v2(pos.x, pos.y);
    }
    ;
    return cc.v2(0, 0);
  },
  //结算
  settlement: function settlement(notify) {
    var pools = notify.pools; //结算信息
    this.loseAreaCount = 0;
    this.mundaAudioCtrl.playGameSound("jbrecover", false);
    this.mundaAudioCtrl.playGameSound("win", false);
    for (var i = 0; i < pools.length; i++) {
      var BossPool = pools[i];
      var boss = BossPool.boss;
      var number = BossPool.number;
      if (number < 2) {
        this.loseAreaCount++;
        this.moveToZhuang(this.goldAllArr[boss], notify);
      } else {
        this.showWinAreaSke(true, boss, number);
      }
    }
    for (var _i14 = 0, len = pools.length; _i14 < len; _i14++) {
      var _BossPool2 = pools[_i14];
      // this.resolveBoosPool(BossPool, true);
    }
  },

  /**
   * 
   * @param {Boolean} isShow 是否展示
   * @param {Number} boss  区域编号
   * @param {Number} count 区域中骰子数目
   * @returns 
   */
  showWinAreaSke: function showWinAreaSke(isShow, boss, count) {
    var _this8 = this;
    if (count === void 0) {
      count = 1;
    }
    if (typeof isShow != "boolean" || typeof boss != "number") {
      LoggerUtil.getInstance().error("方法 showWinAreaSke 传入参数错误！！", typeof isShow, typeof boss);
      return;
    }
    var win_light = this.betAreaArr[boss].node.getChildByName("win_light").getComponent(sp.Skeleton);
    var win = this.betAreaArr[boss].node.getChildByName("win").getComponent(sp.Skeleton);
    var sprite_num = this.betAreaArr[boss].node.getChildByName("sprite_num").getComponent(cc.Sprite);
    var posX = 50;
    if (isShow == false) {
      win_light.node.active = false;
      win.node.active = false;
      sprite_num.node.active = false;
      win_light.skeletonData = null;
      win.skeletonData = null;
      sprite_num.spriteFrame = null;
    } else {
      if (count <= 1) {
        return;
      }
      win_light.skeletonData = this.ske_light[boss];
      win.skeletonData = this.ske_win;
      win_light.node.active = true;
      win.node.active = true;
      sprite_num.node.active = true;
      win_light.setAnimation(0, "animation", true);
      win.setAnimation(0, "star", false);
      win.setCompleteListener(function (trackEntry, loopCount) {
        var name = trackEntry.animation.name;
        if (name == "star") {
          switch (count) {
            case 2:
              sprite_num.spriteFrame = _this8.sprite_winNum[0];
              sprite_num.node.x = posX;
              break;
            case 3:
              sprite_num.spriteFrame = _this8.sprite_winNum[1];
              sprite_num.node.x = posX;
              break;
            case 4:
              sprite_num.spriteFrame = _this8.sprite_winNum[2];
              sprite_num.node.x = posX + 10;
              break;
            case 5:
              sprite_num.spriteFrame = _this8.sprite_winNum[3];
              sprite_num.node.x = posX + 10;
              break;
            case 6:
              sprite_num.spriteFrame = _this8.sprite_winNum[4];
              sprite_num.node.x = posX + 20;
              break;
            default:
              break;
          }
          win.setAnimation(0, "loop", false);
        }
      });
    }
  },
  //VIP 上下座相关消息处理
  setJoinVipNotify: function setJoinVipNotify(notify) {
    var act = notify.act; //Vip 进出的标识，1/2/3，进/出/换座
    var userinfo = notify.user;
    var vipSite = userinfo.seat;
    var oldSite = notify.oldSeat;
    var playerid = userinfo.playerId;
    var selfid = this.selfNodeCtrl.getPlayerid();
    LoggerUtil.getInstance().log("VIP玩家Join广播", "\u7C7B\u578B" + act, "\u5EA7\u4F4D\u53F7" + vipSite, "oldSite" + oldSite);
    var playerNode = cc.instantiate(this.pab_player);
    var playerCtrl = playerNode.getComponent("playerCtrl");
    // 1 上座  2 下座  3 换座
    switch (act) {
      case 1:
        if (playerid == selfid) {
          this.hasDown = true;
          this.downSite = vipSite;
        }
        this.leaveSiteList(userinfo.playerId);
        playerCtrl.setPlayerInfo(userinfo);
        playerNode.parent = this.node_playersSeat;
        this.userArryNode[vipSite] = playerNode;
        break;
      case 2:
        if (playerid == selfid) {
          this.hasDown = false;
        }
        this.leaveSiteList(userinfo.playerId);
        break;
      case 3:
        this.leaveSiteList(userinfo.playerId);
        if (playerid == selfid) {
          this.hasDown = true;
          this.downSite = vipSite;
        }
        playerCtrl.setPlayerInfo(userinfo);
        playerNode.parent = this.node_playersSeat;
        this.userArryNode[vipSite] = playerNode;
        break;
      default:
        break;
    }
  },
  /**
   * 根据playerid删除VIP节点
   * @param {Number} id PlayerId
   */
  leaveSiteList: function leaveSiteList(id) {
    for (var i = 0; i < this.userArryNode.length; i++) {
      var playerNode = this.userArryNode[i];
      if (playerNode && playerNode.isValid == true) {
        var playerCtrl = playerNode.getComponent("playerCtrl");
        var sitePlayerId = playerCtrl.getPlayerid();
        if (id == sitePlayerId) {
          this.userArryNode[i] = null;
          playerNode.destroy();
        }
      }
    }
  },
  /**
   * 下注金币
   * @param {cc.v2()} startPos 
   * @param {cc.v2()} endPos 
   * @param {Number} boss 
   * @param {cc.Node} parentNode 
   */
  bettingCoin: function bettingCoin(startPos, endPos, boss, parentNode) {
    var _this9 = this;
    var jbnode = this.createJbNode();
    if (!jbnode) {
      LoggerUtil.getInstance().error("--------------下注金币-----");
      return;
    }
    // parentNode.addChild(jbnode);
    // LoggerUtil.getInstance().log(parentNode, "-----------------!!!!!!!", jbnode);
    jbnode.setPosition(startPos);
    jbnode.parent = parentNode;
    cc.tween(jbnode).tag(2).to(0.25, {
      position: endPos
    }).call(function () {
      _this9.pushToArr(boss, jbnode);
    }).start();
  },
  pushToArr: function pushToArr(boss, node) {
    if (this.goldAllArr[boss].length >= 80) {
      var jbNode = this.goldAllArr[boss].shift();
      this.removeJbNode(jbNode);
    }
    this.goldAllArr[boss].push(node);
  },
  moveToZhuang: function moveToZhuang(loseArr, notify) {
    var _this10 = this;
    // let loseArr = this.goldAllArr[type];
    if (Array.isArray(loseArr) == false || loseArr.length == 0) {
      return;
    }
    var _loop = function _loop() {
      var jbnode = loseArr[i];
      var index = i;
      cc.tween(jbnode).tag(3).delay(Math.random() * 0.45).to(0.3, {
        position: cc.v2(0, 210)
      }).call(function () {
        _this10.removeJbNode(jbnode);
        loseArr.splice(index, 1);
        if (index == 0) {
          loseArr.length = 0;
          _this10.loseAreaCountArr.push(true);
          _this10.moveToWinArea(notify);
        }
      }).delay(1.5).start();
    };
    for (var i = loseArr.length - 1; i >= 0; i--) {
      _loop();
    }
    ;
  },
  moveToWinArea: function moveToWinArea(notify) {
    var _this11 = this;
    LoggerUtil.getInstance().log("this.loseAreaCountArr.length: " + this.loseAreaCountArr.length + "\u6B64\u65F6\u7684  this.loseAreaCount\uFF1A" + this.loseAreaCount);
    if (this.loseAreaCountArr.length != this.loseAreaCount) {
      LoggerUtil.getInstance().log("金币尚未移动完毕-------等待------");
      return;
    }
    LoggerUtil.getInstance().log("金币移动完毕");
    this.mundaAudioCtrl.playGameSound("moveToArea", false);
    var pools = notify.pools;
    var moveFun = function moveFun(boss) {
      var count = 40; //从庄家飞往每个区域的金币数目
      var isMoveToPlayer = false; // 是否调用移动到玩家方法
      var startPos = cc.v2(0, 210);
      var index = 0;
      var _loop2 = function _loop2() {
        var jbnode = _this11.createJbNode();
        jbnode.setPosition(startPos);
        jbnode.parent = _this11.jinbiParent;
        var endPos = _this11.randomPos(boss);
        cc.tween(jbnode).tag(4).delay(Math.random() * 0.5).to(0.3, {
          position: endPos
        }).call(function () {
          _this11.goldAllArr[boss].push(jbnode);
          // this.pushToArr(boss, jbnode);
          index++;
          if (index == count) {
            if (isMoveToPlayer == false) {
              LoggerUtil.getInstance().log("======================", index);
              _this11.moveToPlayer(notify);
              isMoveToPlayer = true;
            }
          }
        }).start();
      };
      for (var j = 0; j < count; j++) {
        _loop2();
      }
    };
    for (var i = 0; i < pools.length; i++) {
      var BossPool = pools[i];
      var boss = BossPool.boss;
      var number = BossPool.number;
      if (number < 2) {
        continue;
      } else {
        moveFun(boss);
      }
    }
  },
  moveToPlayer: function moveToPlayer(notify) {
    var pools = notify.pools;
    for (var i = 0; i < pools.length; i++) {
      var BossPool = pools[i];
      if (BossPool.number >= 2) {
        this.moveToPlayerByBoss(BossPool.boss, notify);
      }
    }
    var selfResult = notify.selfResult;
    this.selfNodeCtrl.setCoin(selfResult.after, true);
    this.curRoundAddCoinFinish();
  },
  curRoundAddCoinFinish: function curRoundAddCoinFinish() {
    if (cc.isValid(this)) {
      var minLimit = this.betAmountList[0] || 0;
      minLimit *= 100;
      CommonFun.getInstance().gameShowSecondRecharge(minLimit, this.curRoundBet);
      CommonFun.getInstance().showWithdrawToastInGame();
    }
  },
  moveToPlayerByBoss: function moveToPlayerByBoss(boss, notify) {
    var _this12 = this;
    var vipList = notify.vipResult;
    var selfResult = notify.selfResult;
    var goldArr = this.goldAllArr[boss];
    if (selfResult.score > 0) {
      LoggerUtil.getInstance().log("自己赢钱----------", selfResult.score);
      this.selfNodeCtrl.setWinNum(selfResult.score);
      var selfWinJbArr = goldArr.splice(0, 15);
      var posSelf = cc.v2(-343, -304);
      var _loop3 = function _loop3() {
        var tempIndex = i;
        cc.tween(selfWinJbArr[tempIndex]).tag(5).delay(Math.random() * 0.5).to(0.3, {
          scale: 1,
          position: posSelf
        }).call(function () {
          _this12.removeJbNode(selfWinJbArr[tempIndex]);
        }).start();
      };
      for (var i = selfWinJbArr.length - 1; i >= 0; i--) {
        _loop3();
      }
    }
    var _loop4 = function _loop4() {
      var calcResult = vipList[_i15];
      var seat = calcResult.seat;
      if (seat > 0) {
        var vipPlayerScript = _this12.getPlayerInfoByUserId(seat);
        vipPlayerScript && vipPlayerScript.setCoin(calcResult.after);
        if (calcResult.score > 0 && vipPlayerScript) {
          vipPlayerScript.setWinNum(calcResult.score);
          var endPos = vipPlayerScript.getVipNodePos(seat);
          var tempArr = goldArr.splice(0, 15);
          var _loop5 = function _loop5() {
            var jbNode = tempArr.pop();
            cc.tween(jbNode).tag(6).delay(Math.random() * 0.5).to(0.3, {
              scale: 1,
              position: endPos
            }).call(function () {
              _this12.removeJbNode(jbNode);
            }).start();
          };
          for (var _i16 = tempArr.length - 1; _i16 >= 0; _i16--) {
            _loop5();
          }
        }
      } else {
        if (goldArr.length > 0) {
          var pos = _this12.btn_playersAll.node.position;
          _this12.mundaAudioCtrl.playGameSound("jbrecover", false);
          var tempIndex = 0,
            len = goldArr.length;
          var _loop6 = function _loop6() {
            var jbNode = goldArr.pop();
            cc.tween(jbNode).tag(7).delay(Math.random() * 0.5).to(0.3, {
              scale: 1,
              position: pos
            }).call(function () {
              tempIndex++;
              _this12.removeJbNode(jbNode);
            }).start();
          };
          for (var _i17 = goldArr.length - 1; _i17 >= 0; _i17--) {
            _loop6();
          }
        }
      }
    };
    for (var _i15 = 0; _i15 < vipList.length; _i15++) {
      _loop4();
    }
  },
  //重复上局下注
  repeatBet: function repeatBet() {
    var _this13 = this;
    var amount = 0;
    for (var i = 0; i < this.repeatBetArr.length; i++) {
      var item = this.repeatBetArr[i];
      amount += parseInt(item.count / 100);
    }
    LoggerUtil.getInstance().log("\u5F53\u524D\u9636\u6BB5\u91CD\u590D\u4E0B\u6CE8\u91D1\u989D: " + amount);
    if (GlobalCfg.USER_DATAS.userDiamond < amount * 100) {
      if (GlobalCfg.IS_CLUB_MODE == 1) {
        //代理模式不跳转商城
        CommonFun.getInstance().showMsgBox('Insufficient cash', "YES", function () {}, false);
      } else {
        CommonFun.getInstance().showMsgBox("Your cash is insufficient, Please recharge in time!", "SHOP", function () {
          if (_this13.paymentSwitch) {
            CommonFun.getInstance().showSmallAddCash();
          }
        }, false);
      }
    } else {
      this.currentBetNum = this.getCurrentBetNum();
      var repeatBetNum = 0;
      for (var _i18 = 0; _i18 < this.repeatBetArr.length; _i18++) {
        repeatBetNum += this.repeatBetArr[_i18].count;
      }
      if (this.currentBetNum + repeatBetNum > this.limitMaxBetNum) {
        CommonFun.getInstance().showMsgBox(this.tipsLabel[3], "YES", function () {}, false);
        return;
      }
      for (var _i19 = 0; _i19 < this.repeatBetArr.length; _i19++) {
        var _item = this.repeatBetArr[_i19];
        this.sendReqCtrl.callReq(parseInt(_item.count / 100), _item.type);
      }
      this.repeatBetArr.length = 0;
      var self = this;
      this.mundaBundle.load("mundaRes/main/btn_newOra_big", cc.SpriteFrame, function (err, spriteFrame) {
        if (!err) {
          self.btn_repeatBet.node.getChildByName("Background").getComponent(cc.Sprite).spriteFrame = spriteFrame;
          self.btn_repeatBet.enabled = false;
        } else {
          LoggerUtil.getInstance().error(JSON.stringify(err));
        }
      });
    }
  },
  //下注玩家头像跳动
  upAnimation: function upAnimation(nodeplayer, nodeButton) {
    if (nodeButton === void 0) {
      nodeButton = null;
    }
    var ctrl = nodeplayer.getComponent("playerCtrl");
    var nodeX = ctrl.posX;
    var nodeY = ctrl.posY;
    cc.tween(nodeplayer).tag(8).to(0.1, {
      position: cc.v2(nodeX, nodeY + 15)
    }).to(0.1, {
      position: cc.v2(nodeX, nodeY)
    }).start();
    if (nodeButton) {
      cc.tween(nodeButton).tag(9).to(0.1, {
        position: cc.v2(nodeX, nodeY + 15)
      }).to(0.1, {
        position: cc.v2(nodeX, nodeY)
      }).start();
    }
  },
  playListAnimation: function playListAnimation() {
    var nodeX = this.playListPosX;
    var nodeY = this.playListPosY;
    cc.tween(this.btn_playersAll.node).tag(10).to(0.1, {
      position: cc.v2(nodeX, nodeY + 15)
    }).to(0.1, {
      position: cc.v2(nodeX, nodeY)
    }).start();
  },
  // 点击上VIP按钮
  clickVIPuP: function clickVIPuP(siteID) {
    var _this14 = this;
    var mysiteID = null;
    this.hasDown = this.checkSelfInVip();
    mysiteID = this.downSite;
    LoggerUtil.getInstance().log("点击VIP按钮：", this.hasDown, "\u70B9\u51FB\u7684siteID" + siteID);
    if (this.hasDown && mysiteID == siteID) {
      CommonFun.getInstance().showMsgBox("Do you want to exit the VIP seat?", "YES_NO", function () {
        _this14.sendReqCtrl.JoinVipReq(siteID, 2);
      }, false);
      return;
    }
    ;
    var ctrl = this.getPlayerInfoByUserId(siteID);
    if (ctrl && ctrl.siteID == siteID) {
      CommonFun.getInstance().showTips("This seat already has a player, Please select another empty seat!");
      return;
    }
    ;
    var act = this.hasDown ? 3 : 1;
    if (CommonFun.getInstance().isOpenVipModule()) {
      if (GlobalCfg.USER_DATAS.userVip.level == 0) {
        CommonFun.getInstance().showFirstRecharge();
        return;
      }
      ;
      var isCanSitVipSeat = CommonFun.getInstance().isCanSitVipSeatByLevel(GlobalCfg.USER_DATAS.userVip.level);
      if (isCanSitVipSeat) {
        this.sendReqCtrl.JoinVipReq(siteID, act);
        return;
      }
      ;
      CommonFun.getInstance().showVipUpgradeToast();
      return;
    }
    ;
    if (GlobalCfg.USER_DATAS.userDiamond <= 10000) {
      if (GlobalCfg.IS_CLUB_MODE == 1) {
        //代理模式不跳转商城
        CommonFun.getInstance().showMsgBox('Insufficient cash', "YES", function () {}, false);
      } else {
        CommonFun.getInstance().showMsgBox("Your cash is insufficient, Please recharge in time!", "SHOP", function () {
          CommonFun.getInstance().showSmallAddCash();
        }, false);
      }
      return;
    }
    ;
    this.sendReqCtrl.JoinVipReq(siteID, act);
  },
  // 在VIP列表中找自己
  getVIPistMe: function getVIPistMe() {
    var playerNode = null;
    for (var i = 0; i < this.userArryNode.length; i++) {
      var userNode = this.userArryNode[i];
      if (userNode) {
        var playerCtrl = userNode.getComponent('playerCtrl');
        if (playerCtrl && playerCtrl.getPlayerid() == this.selfNodeCtrl.getPlayerid()) {
          playerNode = playerCtrl.siteID;
          break;
        }
      }
    }
    return playerNode;
  },
  /**
   * 再次判断VIP节点中有没有自己（playerID相等）
   * @returns 
   */
  checkSelfInVip: function checkSelfInVip() {
    for (var i = 0; i < this.userArryNode.length; i++) {
      var playerNode = this.userArryNode[i];
      if (playerNode && playerNode.isValid == true) {
        var playerCtrl = playerNode.getComponent("playerCtrl");
        if (playerCtrl && playerCtrl.getPlayerid() == this.selfNodeCtrl.getPlayerid()) {
          this.downSite = playerCtrl.siteID;
          return true;
        }
      }
    }
    return false;
  },
  /**
   * 根据用户座位ID获取用户控制脚本
   * @param {Number} siteID 
   * @returns 
   */
  getPlayerInfoByUserId: function getPlayerInfoByUserId(siteID) {
    var playerInfo = null;
    if (siteID == 0) {
      return this.selfNodeCtrl;
    }
    for (var i = 0; i < this.userArryNode.length; i++) {
      var userNode = this.userArryNode[i];
      if (userNode && userNode.name != '') {
        var userInfoCtrl = userNode.getComponent('playerCtrl');
        if (userInfoCtrl && userInfoCtrl.siteID === siteID) {
          playerInfo = userInfoCtrl;
          break;
        }
      }
    }
    return playerInfo;
  },
  /**
   * 根据用户座位ID返回玩家节点
   * @param {Number} siteID 
   * @returns 
   */
  getPlayerNodeBySeatID: function getPlayerNodeBySeatID(siteID) {
    var playerNode = null;
    for (var i = 0; i < this.userArryNode.length; i++) {
      var userNode = this.userArryNode[i];
      if (userNode && userNode.name != '') {
        var userInfoCtrl = userNode.getComponent('playerCtrl');
        if (userInfoCtrl && userInfoCtrl.siteID === siteID) {
          playerNode = userNode;
          break;
        }
      }
    }
    return playerNode;
  },
  randomPos: function randomPos(boss) {
    var posx = 0;
    var posy = 0;
    var v2 = 0;
    switch (boss) {
      case 0:
        posx = Math.random() * 232 - 388;
        posy = Math.random() * 88 + 33;
        break;
      case 1:
        posx = Math.random() * 232 - 116;
        posy = Math.random() * 88 + 33;
        break;
      case 2:
        posx = Math.random() * 232 + 156;
        posy = Math.random() * 88 + 33;
        break;
      case 3:
        posx = Math.random() * 232 - 388;
        posy = Math.random() * 88 - 157;
        break;
      case 4:
        posx = Math.random() * 232 - 116;
        posy = Math.random() * 88 - 157;
        break;
      case 5:
        posx = Math.random() * 232 + 156;
        posy = Math.random() * 88 - 157;
        break;
      default:
        break;
    }
    v2 = cc.v2(posx, posy);
    return v2;
  },
  setCount: function setCount(number) {
    if (number >= 1000 && number < 2000) {
      return 1;
    } else if (number >= 2000 && number < 5000) {
      return 2;
    } else if (number >= 5000 && number < 10000) {
      return 3;
    } else if (number >= 10000 && number < 20000) {
      return 5;
    } else if (number >= 20000 && number < 50000) {
      return 6;
    } else if (number >= 50000 && number < 100000) {
      return 8;
    } else if (number >= 100000 && number < 200000) {
      return 10;
    } else if (number >= 200000 && number < 500000) {
      return 12;
    } else if (number >= 500000) {
      return 15;
    } else {
      return 1;
    }
  },
  initTableGlodCount: function initTableGlodCount(number) {
    if (number < 100000) {
      return parseInt(number / 1000);
    } else {
      return 100;
    }
  },
  getCurrentBetNum: function getCurrentBetNum() {
    var num = 0;
    for (var i = 0; i < this.selfBetAmount.length; i++) {
      num += Number(this.selfBetAmount[i]);
    }
    return num;
  },
  //下注
  betting: function betting(amount, type) {
    var _this15 = this;
    this.currentBetNum = this.getCurrentBetNum();
    if (this.betBtnState == true) {
      if (GlobalCfg.USER_DATAS.isNotCharge == true && GlobalCfg.USER_DATAS.gamePattern == 0 && GlobalCfg.USER_DATAS.refuseUnpayHundred == true) {
        //未曾充值
        CommonFun.getInstance().showMsgBox("This feature is available only for premium players . Add cash now to become a premium player .", "SHOP", function () {
          if (_this15.paymentSwitch) {
            CommonFun.getInstance().showSmallAddCash();
          }
        }, false);
      } else if (GlobalCfg.USER_DATAS.userDiamond < amount * 100) {
        if (GlobalCfg.IS_CLUB_MODE == 1) {
          //代理模式不跳转商城
          CommonFun.getInstance().showMsgBox('Insufficient cash', "YES", function () {}, false);
        } else {
          CommonFun.getInstance().showMsgBox("Your cash is insufficient, Please recharge in time!", "SHOP", function () {
            if (_this15.paymentSwitch) {
              CommonFun.getInstance().showSmallAddCash();
            }
          }, false);
        }
      } else {
        LoggerUtil.getInstance().log("\u5F53\u524D\u4E0B\u6CE8\u7684\u6570\u76EE\uFF1A" + this.currentBetNum);
        if (this.currentBetNum + amount * 100 > this.limitMaxBetNum) {
          CommonFun.getInstance().showMsgBox(this.tipsLabel[3], "YES", function () {}, false);
          return;
        }
        this.sendReqCtrl.callReq(amount, type);
      }
    } else {
      if (this.startBettingSke.node.active == false) {
        CommonFun.getInstance().showTips(this.tipsLabel[2]);
      }
    }
  },
  onDestroy: function onDestroy() {
    GlobalCfg.ACT_SCENE_CTRL = null;
    this.unschedule(this.scheduleBetSpineTimeCallback);
    ClientNotify.removeByHandle(GlobalCfg.MSG_TYPE.serverMsg, this.msgHandle);
    ClientNotify.removeByHandle(GlobalCfg.MSG_TYPE.clientMsg, this.msgHandle1);
    CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.EXIT_MUNDA_GAME);
  },
  choiceBetButton: function choiceBetButton(button) {
    var scale = 1.1;
    var btnArr = [this.btn_10, this.btn_50, this.btn_100, this.btn_1000, this.btn_2000];
    var btnName = button.node.name;
    this.node_btnGuangQuan.setScale(scale);
    for (var i = 0; i < btnArr.length; i++) {
      var btn = btnArr[i];
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
    this.node_btnGuangQuan.setPosition(pos.x, pos.y + 3.5);
  },
  showBtnBetSpine: function showBtnBetSpine() {
    var animationName = 'animation';
    var btnArr = [this.btn_10, this.btn_50, this.btn_100, this.btn_1000, this.btn_2000];
    var len = btnArr.length,
      i = 0;
    this.scheduleBetSpineTimeCallback = function () {
      var spine = btnArr[i].node.getChildByName('spine').getComponent(sp.Skeleton);
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
  }
});

cc._RF.pop();