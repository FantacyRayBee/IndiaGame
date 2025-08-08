"use strict";
cc._RF.push(module, '36cb1ERR6pKiYdQi3hjmap9', 'andeerLobbyCtrl');
// andaerGame/andeerScr/andeerLobbyCtrl.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    pab_user: cc.Prefab,
    pab_chat: cc.Prefab,
    pab_wanFa: cc.Prefab,
    btns: [cc.Button],
    btn_aBet: cc.Button,
    btn_bBet: cc.Button,
    btn_skip: cc.Button,
    lab_GameNotify: cc.Label,
    lab_A: cc.Label,
    lab_B: cc.Label,
    node_users: cc.Node,
    sk_shanPai: cc.Node,
    sk_crad: cc.Node,
    btn_openMenu: cc.Button,
    btn_tableInfo: cc.Button,
    selectLight: cc.Node,
    btnBets: [cc.Button]
  },
  ctor: function ctor() {
    this.posOutOrINLogArr = []; // 玩家进出房间的记录
    this.playerNodeArr = []; // 存放玩家节点
    this.paymentSwitch = false;
    this.tuiChuLabel = ["Your game is not finished yet . If you wish to exit the table , you will lose your money . Do you want to leave table?",
    // 退出游戏
    "Are you sure you want to discard",
    // 弃牌
    "Your cash is insufficient, Please recharge in time!",
    //金币不足请充值
    "In the game, unable to exit",
    // 游戏中无法退出
    "Sorry, your gold coin can't be played in this game",
    // 对不起，您的金币无法在本场内游戏）
    "You are not longer sitting on the table because you missed your turn"];
    this.isCCGameEventHideStutas = false;
    this.isCanClickToAct = false;
    this.betDurationMs = 7;
    this.skeleDataMap = new Map();
    this.rateBetsArray = [1, 2, 4, 8, 16, 32, 64];
    this.showBetSpineTimeInterval = 15; // 显示下注动画的时间间隔
    this.showBetSpineTime = 0;
    this.mySeatId = null;
  },
  onLoad: function onLoad() {
    var _this = this;
    CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.SHOW_ANDAR_GAME);
    GlobalCfg.ACT_SCENE_CTRL = this;
    GlobalCfg.G_COMPONENTS.Audio && GlobalCfg.G_COMPONENTS.Audio.pauseMusic();
    this.loadSkeleData();
    this.skeNode = new cc.Node();
    this.skeNode.setPosition(0, 60);
    this.node.addChild(this.skeNode);
    this.node_btnAck = this.node.getChildByName("node_btnAck");
    this.Skeletonspine = this.skeNode.addComponent(sp.Skeleton); // 开始倒计时骨骼动画
    this.andeerActionCtrl = this.node.getChildByName("andeerAction").getComponent('andeerActionCtrl');
    this.AndererAudioCtrl = this.node.getChildByName("AndererAudioCtrl").getComponent('AndererAudioCtrl');
    this.roomInfoData = JSON.parse(cc.sys.localStorage.getItem('AndeerData'));
    this.iEntryCondition = this.roomInfoData.cellscore / 100; // 底注
    this.iEntryConditionMax = this.roomInfoData.entryconditionmax / 100; // 单轮最大投注额
    this.iCellScore = this.roomInfoData.cellscore / 100; // 最大支出额
    this.isTrialRoom = this.roomInfoData.trial; // 是否是体验场

    LoggerUtil.getInstance().log("\u5E95\u6CE8: " + this.iEntryCondition + ", \u5355\u8F6E\u6700\u5927\u6295\u6CE8\u989D: " + this.iEntryConditionMax + ", \u6700\u5927\u652F\u51FA\u989D: " + this.iCellScore);
    this.msgHandle = ClientNotify.register(GlobalCfg.MSG_TYPE.serverMsg, this.onEventMsg, this);
    this.customMsgHandle = ClientNotify.register(GlobalCfg.MSG_TYPE.clientMsg, this.onEventMsg, this);
    for (var i = 0; i < this.btns.length; i++) {
      this.btns[i].node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
    }
    ;
    this.btn_openMenu.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
    this.btn_tableInfo.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
    this.btn_aBet.node.on('click', CommonFun.getInstance().debounce(this.btnAckClick, 1), this);
    this.btn_bBet.node.on('click', CommonFun.getInstance().debounce(this.btnAckClick, 1), this);
    this.btn_skip.node.on('click', CommonFun.getInstance().debounce(this.btnAckClick, 1), this);
    this.sk_zhuang = this.sk_shanPai.getComponent(sp.Skeleton);
    this.sk_leftOrRight = this.sk_crad.getComponent(sp.Skeleton);
    this.node.getChildByName("btn_shop").active = GlobalCfg.USER_DATAS.openModules.includes(4);
    this.paymentSwitch = GlobalCfg.USER_DATAS.openModules.includes(4);
    if (this.isTrialRoom) {
      this.node.getChildByName("btn_shop").active = true;
    }
    ;

    //监听后台切换事件
    cc.game.on(cc.game.EVENT_HIDE, function () {
      LoggerUtil.getInstance().log("退入游戏后台！！！！！");
      GameServerManager.hideFilterMag(1);
      _this.isCCGameEventHideStutas = true;
    }, this);
    cc.game.on(cc.game.EVENT_SHOW, function () {
      LoggerUtil.getInstance().log("切回游戏前台！！！！！");
      var self = _this;
      if (!self.isCCGameEventHideStutas) {
        return;
      }
      ;
      self.isCCGameEventHideStutas = false;
      GameServerManager.hideFilterMag(2, function () {
        GameServerManager.send("gameservice.gamescene", "GameSceneReq", {});
      });
    }, this);
  },
  initBtnBetsLabel: function initBtnBetsLabel() {
    for (var i = 0; i < this.btnBets.length; i++) {
      var btn = this.btnBets[i];
      btn.node.on('click', this.btnBetsClick, this);
      var label = btn.node.getChildByName("label").getComponent(cc.Label);
      label.string = this.rateBetsArray[i] * this.iEntryCondition;
      if (this.isTrialRoom == false) {
        this.btnBetGreyByCoin(label.string, btn, GlobalCfg.USER_DATAS.userDiamond);
      }
    }
    this.lab_A.string = this.btnBets[0].node.getChildByName("label").getComponent(cc.Label).string;
    this.lab_B.string = this.btnBets[0].node.getChildByName("label").getComponent(cc.Label).string;
    this.selectLight.setPosition(this.btnBets[0].node.getPosition());
  },
  updateBetBtnGreyState: function updateBetBtnGreyState(diamond) {
    for (var i = 0; i < this.btnBets.length; i++) {
      var btn = this.btnBets[i];
      var label = btn.node.getChildByName("label").getComponent(cc.Label);
      if (this.isTrialRoom == false) {
        this.btnBetGreyByCoin(label.string, btn, diamond);
      }
    }
  },
  btnBetGreyByCoin: function btnBetGreyByCoin(buttonLabelStr, button, currentDiamond) {
    var num = Number(buttonLabelStr);
    if (currentDiamond < num * 100) {
      button.interactable = false;
    } else {
      button.interactable = true;
    }
  },
  start: function start() {
    GameServerManager.send("gameservice.login", "LoginReq", {
      userid: GlobalCfg.USER_DATAS.userId,
      token: GlobalCfg.USER_DATAS.token,
      fromid: GlobalCfg.PRODUCT_ID
    });
  },
  onDestroy: function onDestroy() {
    GlobalCfg.ACT_SCENE_CTRL = null;
    ClientNotify.removeByHandle(GlobalCfg.MSG_TYPE.serverMsg, this.msgHandle);
    ClientNotify.removeByHandle(GlobalCfg.MSG_TYPE.clientMsg, this.customMsgHandle);
    CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.EXIT_ANDAR_GAME);
  },
  //  下载骨骼动画
  loadSkeleData: function loadSkeleData() {
    var assetBundle = cc.assetManager.getBundle('andaerGame');
    if (assetBundle) {
      var self = this;
      var skeleArr = ['andeerSke/winner_dj'];
      for (var index = 0; index < skeleArr.length; index++) {
        var url = skeleArr[index];
        assetBundle.load(url, sp.SkeletonData, function (err, asset) {
          if (!err) {
            if (asset._name && self.skeleDataMap) {
              self.skeleDataMap.set(asset._name, asset);
            }
          }
        });
      }
    }
  },
  btnBetsClick: function btnBetsClick(button) {
    if (GlobalCfg.USER_DATAS.isNotCharge == true && GlobalCfg.USER_DATAS.gamePattern == 0 && GlobalCfg.USER_DATAS.refuseUnpayHundred == true) {
      //未曾充值
      CommonFun.getInstance().showMsgBox("This feature is available only for premium players . Add cash now to become a premium player .", "SHOP", function () {
        CommonFun.getInstance().showSmallAddCash();
      }, false);
      return;
    }
    var btnName = button.node.name;
    GlobalCfg.G_COMPONENTS.Audio.playButton();
    this.selectLight.setPosition(button.node.getPosition());
    var curBetNum = button.node.getChildByName("label").getComponent(cc.Label).string;
    this.lab_A.string = curBetNum;
    this.lab_B.string = curBetNum;
  },
  btnAckClick: function btnAckClick(button) {
    var btnName = button.node.name;
    if (this.isCanClickToAct == false) {
      return;
    }
    ;
    if (btnName == "btn_aBet") {
      if (GlobalCfg.USER_DATAS.isNotCharge == true && GlobalCfg.USER_DATAS.gamePattern == 0 && GlobalCfg.USER_DATAS.refuseUnpayHundred == true) {
        //未曾充值
        CommonFun.getInstance().showMsgBox("This feature is available only for premium players . Add cash now to become a premium player .", "SHOP", function () {
          CommonFun.getInstance().showSmallAddCash();
        }, false);
        return;
      }
      GlobalCfg.ACT_SCENE_CTRL.AndererAudioCtrl.playGameSound("bet");
      var num = Number(this.lab_A.string);
      this.UserSelectionActionReq(0, num);
    } else if (btnName == "btn_bBet") {
      if (GlobalCfg.USER_DATAS.isNotCharge == true && GlobalCfg.USER_DATAS.gamePattern == 0 && GlobalCfg.USER_DATAS.refuseUnpayHundred == true) {
        //未曾充值
        CommonFun.getInstance().showMsgBox("This feature is available only for premium players . Add cash now to become a premium player .", "SHOP", function () {
          CommonFun.getInstance().showSmallAddCash();
        }, false);
        return;
      }
      GlobalCfg.ACT_SCENE_CTRL.AndererAudioCtrl.playGameSound("bet");
      var _num = Number(this.lab_B.string);
      this.UserSelectionActionReq(1, _num);
    } else if (btnName == "btn_skip") {
      GlobalCfg.G_COMPONENTS.Audio.playButton();
      this.UserSelectionActionReq(0, 0);
    }
  },
  btnClick: function btnClick(button) {
    var btnName = button.node.name;
    GlobalCfg.G_COMPONENTS.Audio.playButton();
    if (btnName == "btn_shop") {
      if (this.isTrialRoom) {
        CommonFun.getInstance().showSmallAddExperience();
      } else {
        CommonFun.getInstance().showSmallAddCash();
      }
    } else if (btnName == "btn_liaoTian") {
      CommonFun.getInstance().showGameWordInteraction(this.getMyPlayerSeatID());
    } else if (btnName == "btn_openMenu") {
      GlobalCfg.G_COMPONENTS.Audio.playButton();
      CommonFun.getInstance().showGameMenu();
    } else if (btnName == "btn_tableInfo") {
      GlobalCfg.G_COMPONENTS.Audio.playButton();
      var pab_wanFa = cc.instantiate(this.pab_wanFa);
      var wanFaCtrl = pab_wanFa.getComponent("AandeerWaFaCtrl");
      wanFaCtrl.setLabel(this.roomInfoData);
      this.node.addChild(pab_wanFa);
    }
  },
  onEventMsg: function onEventMsg(webData, target) {
    var self = target;
    var msgId = webData.msgCode;
    var notify = webData.msgData;
    if (msgId == "gameservice.login") {
      self.dealLoginEvent(notify);
    } else if (msgId == "gameservice.enterroom") {
      self.setSceneInfo(notify.scene);
      self.betDurationMs = Math.floor(notify.betDurationMs / 1000);
    } else if (msgId == "gameservice.exitroom") {
      self.dealExitRoomEvent();
    } else if (msgId == "gameservice.changeroom") {
      CommonFun.getInstance().showGameStartMask();
      self.setSceneInfo(notify.scene);
    } else if (msgId == "gameservice.playerenternotify") {
      self.dealPlayerEnterNotifyEvent(notify);
    } else if (msgId == "gameservice.playerexitnotify") {
      self.dealPlayerExitNotifyEvent(notify);
    } else if (msgId == "gameservice.gamescene") {
      self.setSceneInfo(notify.scene);
    } else if (msgId == "gameservice.firstbetstatusstartnotify") {
      self.roundBet = 0;
      self.dealFirstBetStatusStartNotifyEvent(notify);
    } else if (msgId == "gameservice.abdealnotify") {
      self.dealAbDealNotify(notify);
    } else if (msgId == "gameservice.secondbetstatusstartnotify") {
      self.dealSecondBetStatusStartNotifyEvent(notify);
    } else if (msgId == "gameservice.call") {
      self.dealCallEvent(notify);
    } else if (msgId == "gameservice.callnotify") {
      self.dealCallNotifyEvent(notify);
    } else if (msgId == "gameservice.gamesettlenotify") {
      self.dealGameSettleNotifyEvent(notify);
    } else if (msgId == "gameservice.shortmessage") {
      self.dealShortMessageEvent(notify);
    } else if (msgId == "gameservice.shortmessagenotify") {
      self.dealShortMessageNotifyEvent(notify);
    } else if (msgId == "gameservice.updatecoinnotify") {
      self.dealUpdateCoinNotifyEvent(notify);
    } else if (msgId == "gameservice.asktrial") {
      self.dealAskTrialEvent(notify);
    }
    // else if(msgId == GlobalCfg.CLIENT_MSG_ID.FIRST_RECHARGE_TIPS){
    //     SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.ANDAER, SceneManager.getInstance().sceneType.LOBBY);
    // }  
    else if (msgId == GlobalCfg.CLIENT_MSG_ID.GAME_MENU_CLICK_OUT_TO_LOBBY) {
      GameServerManager.send("gameservice.exitroom", "ExitRoomReq", {});
    } else if (msgId == GlobalCfg.CLIENT_MSG_ID.GAME_MENU_CLICK_SWITCH_TABLE) {
      GameServerManager.send("gameservice.changeroom", "ChangeRoomReq", {});
    } else if (msgId == GlobalCfg.CLIENT_MSG_ID.GAME_MENU_CLICK_HOW_TO_PLAY) {
      CommonFun.getInstance().showRule("Andeer");
    } else if (msgId == "lobbyservice.kicktolobby") {
      SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.ANDAER, SceneManager.getInstance().sceneType.LOBBY);
    } else if (msgId == "AndarDealingCardsEnd") {
      self.showWinAreaSkeleton(notify.winType);
    } else if (msgId == GlobalCfg.CLIENT_MSG_ID.CURRENCY_CHANGED_USER_INFO) {
      var myCtrl = self.getSelfPlayerCtrl();
      if (myCtrl) {
        myCtrl.setPlayerDiamond(GlobalCfg.USER_DATAS.userDiamond);
      }
    } else if (msgId == "Andar_SelfDiamond_Change") {
      var diamond = notify.diamond;
      self.updateBetBtnGreyState(diamond);
    }
  },
  // 监听错误消息
  checkWebMsgError: function checkWebMsgError(webData, target) {
    var self = target;
    var msgId = webData.msgCode;
    var notify = webData.msgData;
    if (!notify) {
      var info = {
        errorMessage: "\u5B89\u8FBE\u5C14\u6E38\u620F\u4E2D, \u670D\u52A1\u5668\u4E0B\u53D1\u7684\u975E\u6B63\u786E\u6D88\u606F\u4E2D\u7ED3\u6784\u4F53\u5F02\u5E38, \u5185\u5BB9\u4E3A===>" + JSON.stringify(webData)
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
    if (msgId === "gameservice.login" || msgId == "gameservice.enterroom") {
      CommonFun.getInstance().showMsgBox(result.message, 'YES', function () {
        window.isNeedShowRoomList = "andar";
        SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.ANDAER, SceneManager.getInstance().sceneType.LOBBY);
      });
    } else if (msgId === "gameservice.changeroom") {
      CommonFun.getInstance().showMsgBox(result.message, 'YES', function () {
        window.isNeedShowRoomList = "andar";
        SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.ANDAER, SceneManager.getInstance().sceneType.LOBBY);
      });
    } else if (msgId === "gameservice.call") {
      if (CommonFun.getInstance().isFreePlayerDirectedToFreeTP()) {
        if (result.result == 57) {
          CommonFun.getInstance().showDiversionFreeTP(function () {
            GameServerManager.send("gameservice.exitroom", "ExitRoomReq", {});
            // SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.ANDAER, SceneManager.getInstance().sceneType.LOBBY);
          });
        } else {
          if (result.result == 19) {
            if (this.isTrialRoom) {
              CommonFun.getInstance().showMsgBox("Your chip is insufficient！Please get the chip", "SHOP", function () {
                CommonFun.getInstance().showSmallAddExperience();
              }, false);
            } else {
              if (GlobalCfg.IS_CLUB_MODE == 1) {
                //代理模式不跳转商城
                CommonFun.getInstance().showMsgBox('Insufficient cash', "YES", function () {}, false);
              } else {
                CommonFun.getInstance().showMsgBox("Your cash is insufficient, Please recharge in time！", "SHOP", function () {
                  CommonFun.getInstance().showSmallAddCash();
                }, false);
              }
            }
            ;
          } else {
            CommonFun.getInstance().showTips(result.message);
          }
          ;
        }
        ;
      } else {
        if (result.result == 19) {
          if (this.isTrialRoom) {
            CommonFun.getInstance().showMsgBox("Your chip is insufficient！Please get the chip", "SHOP", function () {
              CommonFun.getInstance().showSmallAddExperience();
            }, false);
          } else {
            if (GlobalCfg.IS_CLUB_MODE == 1) {
              //代理模式不跳转商城
              CommonFun.getInstance().showMsgBox('Insufficient cash', "YES", function () {}, false);
            } else {
              CommonFun.getInstance().showMsgBox("Your cash is insufficient, Please recharge in time！", "SHOP", function () {
                CommonFun.getInstance().showSmallAddCash();
              }, false);
            }
          }
          ;
        } else {
          CommonFun.getInstance().showTips(result.message);
        }
        ;
      }
      ;
    }
  },
  dealLoginEvent: function dealLoginEvent(notify) {
    if (!notify) {
      LoggerUtil.getInstance().error("发送安达尔登录的消息时, 服务器返回的消息为空!");
      return;
    }
    ;
    this.myPlayerid = notify.pid;
    var cacheRoomId = notify.cacheRoomId;
    var iID = GlobalCfg.SMALL_GAME_DATAS.andeerData.roomID;
    var multiple = notify.multiple;
    if (multiple.length >= this.rateBetsArray.length) {
      this.rateBetsArray = multiple.slice(0, this.rateBetsArray.length);
    }
    // console.warn(this.rateBetsArray);
    this.initBtnBetsLabel();
    GameServerManager.send("gameservice.enterroom", "EnterRoomReq", {
      id: Number(iID)
    });
  },
  setSceneInfo: function setSceneInfo(sceneInfo) {
    if (!sceneInfo) {
      LoggerUtil.getInstance().error("\u670D\u52A1\u5668\u4E0B\u53D1\u7684\u573A\u666F\u4FE1\u606F\u4E3A\u7A7A!");
      return;
    }
    ;
    var status = sceneInfo.status; // 当前状态 0: 第一次下注. 1: 第二次下注. 2: 发牌中. 3: 结算. 
    var currentStatusLeftMs = sceneInfo.currentStatusLeftMs; // 当前状态剩余时间.毫秒
    var totalBet = sceneInfo.totalBet; // 总下注信息
    var players = sceneInfo.players; // vip玩家信息
    var midCard = sceneInfo.midCard; // 中间牌
    var abCards = sceneInfo.abCards; // 两边的牌,a,b,a,b,a,b......循环
    var aWin = sceneInfo.aWin; // A赢
    var bWin = sceneInfo.bWin; // B赢
    var winType = null;
    if (aWin == true || bWin == true) {
      winType = aWin ? "A" : "B";
    }

    // 重置场景中的所有表现
    this.sk_zhuang.clearTracks();
    this.sk_leftOrRight.clearTracks();
    this.sk_zhuang.node.active = false;
    this.sk_leftOrRight.node.active = false;
    this.andeerActionCtrl.deleteAllCard();
    var userNodeArr = this.node_users.children;
    for (var i = 0, len = userNodeArr.length; i < len; ++i) {
      var userNode = userNodeArr[i];
      if (userNode) {
        userNode.destroy();
      }
      ;
    }
    ;
    this.posOutOrINLogArr = [];
    this.playerNodeArr = [];
    this.setRoomStatus(status);
    this.setMyPlayerSeatID(players);
    this.setAllPlayersBaseInfo(players);
    this.showMyBetBtns(false);

    // 设置庄家牌
    if (midCard != -1) {
      this.andeerActionCtrl.faMidPosCard(midCard, false);
    } else {
      LoggerUtil.getInstance().error('服务器下发的场景信息中, 庄家的牌值为-1, 不符合0 ~ 53的规定!');
    }
    ;
    var myPlayerSeatID = this.getMyPlayerSeatID();
    LoggerUtil.getInstance().log("\u81EA\u5DF1\u73A9\u5BB6\u7684SeatID\u4E3A: " + myPlayerSeatID + ", \u5F53\u524D\u7684\u6E38\u620F\u72B6\u6001\u4E3A: " + status + ", \u724C\u7684\u503C\u4E3A: " + JSON.stringify([].concat(abCards)));
    if (status == 0) {
      this.lab_GameNotify.string = CommonFun.getInstance().showLabelLanguage("The first round starts to bet!");
      for (var _i = 0, _len = this.playerNodeArr.length; _i < _len; _i++) {
        var playerNode = this.playerNodeArr[_i];
        var andeerPalyerCtrl = playerNode.getComponent('andeerPalyerCtrl');
        andeerPalyerCtrl.countDownTime(Math.floor(currentStatusLeftMs / 1000), true);
        andeerPalyerCtrl.setPlayerSkippedStatusActive(false);
        var seatID = andeerPalyerCtrl.getPlayerSeatID();
        if (myPlayerSeatID === seatID) {
          this.showMyBetBtns(true);
        }
        ;
      }
      ;
    } else if (status == 1) {
      this.lab_GameNotify.string = CommonFun.getInstance().showLabelLanguage("The second round starts to bet!");
      for (var _i2 = 0, _len2 = this.playerNodeArr.length; _i2 < _len2; _i2++) {
        var _playerNode = this.playerNodeArr[_i2];
        var _andeerPalyerCtrl = _playerNode.getComponent('andeerPalyerCtrl');
        var aScore = _andeerPalyerCtrl.getPlayerFirstBetScore();
        if (aScore == 0) {
          _andeerPalyerCtrl.setPlayerSkippedStatusActive(true);
        } else {
          _andeerPalyerCtrl.setPlayerSkippedStatusActive(false);
          _andeerPalyerCtrl.countDownTime(Math.floor(currentStatusLeftMs / 1000), true);
          var _seatID = _andeerPalyerCtrl.getPlayerSeatID();
          if (myPlayerSeatID === _seatID) {
            this.showMyBetBtns(true);
          }
          ;
        }
        ;
      }
      ;
    } else if (status == 2) {
      for (var _i3 = 0, _len3 = this.playerNodeArr.length; _i3 < _len3; _i3++) {
        var _playerNode2 = this.playerNodeArr[_i3];
        var _andeerPalyerCtrl2 = _playerNode2.getComponent('andeerPalyerCtrl');
        var _aScore = _andeerPalyerCtrl2.getPlayerFirstBetScore();
        if (_aScore == 0) {
          _andeerPalyerCtrl2.setPlayerSkippedStatusActive(true);
        } else {
          _andeerPalyerCtrl2.setPlayerSkippedStatusActive(false);
        }
        ;
      }
      ;
      var duration = Math.floor(currentStatusLeftMs / 1000);
      var abCardsLen = abCards.length;
      if (duration <= 2) {
        abCards = abCards.slice(abCardsLen - 2);
        this.andeerActionCtrl.faLeftRightPosCard(abCards, false);
      } else {
        if (duration >= abCardsLen) {
          this.andeerActionCtrl.faLeftRightPosCard(abCards, true, winType);
        } else {
          var deleteLen = (abCardsLen - duration) % 2 == 0 ? abCardsLen - duration : abCardsLen - duration - 1;
          abCards.splice(0, deleteLen);
          this.andeerActionCtrl.faLeftRightPosCard(abCards, true, winType);
        }
        ;
      }
      ;
    } else if (status == 3) {
      var tipsStr = "";
      if (aWin && bWin) {
        tipsStr = CommonFun.getInstance().showLabelLanguage("Andar Win And Barar Win!");
      } else if (aWin) {
        tipsStr = CommonFun.getInstance().showLabelLanguage("Andar Win!");
      } else if (bWin) {
        tipsStr = CommonFun.getInstance().showLabelLanguage("Barar Win!");
      }
      this.lab_GameNotify.string = tipsStr;
      var _abCardsLen = abCards.length;
      abCards = abCards.slice(_abCardsLen - 2);
      LoggerUtil.getInstance().log("dddddddddddddddddddddddddd", abCards);
      this.andeerActionCtrl.faLeftRightPosCard(abCards, false);
      this.sk_zhuang.node.active = true;
      this.sk_leftOrRight.node.active = true;
      this.sk_zhuang.setAnimation(0, "animation", true);
      this.sk_leftOrRight.setAnimation(0, "animation", true);
      if (bWin) {
        this.sk_shanPai.setPosition(192, 63);
      } else {
        this.sk_shanPai.setPosition(-192, 63);
      }
      ;
      for (var _i4 = 0, _len4 = this.playerNodeArr.length; _i4 < _len4; _i4++) {
        var _playerNode3 = this.playerNodeArr[_i4];
        var _andeerPalyerCtrl3 = _playerNode3.getComponent('andeerPalyerCtrl');
        var _aScore2 = _andeerPalyerCtrl3.getPlayerFirstBetScore();
        if (_aScore2 == 0) {
          _andeerPalyerCtrl3.setPlayerSkippedStatusActive(true);
        } else {
          _andeerPalyerCtrl3.setPlayerSkippedStatusActive(false);
          var betAScore = _andeerPalyerCtrl3.getPlayerBetAScore();
          var betBScore = _andeerPalyerCtrl3.getPlayerBetBScore();
          if (aWin && betAScore > 0) {
            _andeerPalyerCtrl3.setPlayerGameSettleEffect(betAScore);
          } else if (bWin && betBScore > 0) {
            _andeerPalyerCtrl3.setPlayerGameSettleEffect(betBScore);
          }
          ;
        }
        ;
      }
      ;
    }
    ;
  },
  showMyBetBtns: function showMyBetBtns(bool) {
    var posX = 0;
    var posY = bool ? -325 : -512;
    var time = bool ? 0.3 : 0.15;
    var easName = bool ? 'backOut' : 'backIn';
    var btnAck = this.node.getChildByName("node_btnAck");
    this.isCanClickToAct = bool;
    cc.tween(btnAck).to(time, {
      position: cc.v2(posX, posY)
    }, {
      easing: easName
    }).start();
  },
  setMyPlayerSeatID: function setMyPlayerSeatID(players) {
    if (!Array.isArray(players)) {
      LoggerUtil.getInstance().error("服务器发送的玩家信息列表错误!");
      return;
    }
    ;
    for (var i = 0, len = players.length; i < len; i++) {
      var player = players[i];
      var pos = player.pos; // 位置
      var userInfo = player.userInfo; // 用户信息
      var playerId = userInfo.playerId; // 玩家Id
      if (playerId === this.myPlayerid) {
        this.mySeatId = pos;
        return;
      }
      ;
    }
    ;
  },
  getMyPlayerSeatID: function getMyPlayerSeatID() {
    return this.mySeatId;
  },
  getSelfPlayerCtrl: function getSelfPlayerCtrl() {
    var ctrl = null;
    var myPlayerSeatID = this.getMyPlayerSeatID();
    for (var i = 0, len = this.playerNodeArr.length; i < len; i++) {
      var playerNode = this.playerNodeArr[i];
      var andeerPalyerCtrl = playerNode.getComponent('andeerPalyerCtrl');
      var seatID = andeerPalyerCtrl.getPlayerSeatID();
      if (seatID === myPlayerSeatID) {
        ctrl = andeerPalyerCtrl;
        return ctrl;
      }
      ;
    }
    ;
  },
  setAllPlayersBaseInfo: function setAllPlayersBaseInfo(players) {
    if (!Array.isArray(players)) {
      LoggerUtil.getInstance().error("服务器发送的玩家信息列表错误!");
      return;
    }
    ;
    for (var i = 0, len = players.length; i < len; i++) {
      var player = players[i];
      var pos = player.pos; // 位置
      var betInfo = player.betInfo; // 下注信息 0: a, 1: b
      var userInfo = player.userInfo; // 用户信息
      var playerId = userInfo.playerId; // 玩家Id
      var imgUrl = userInfo.imgUrl; // 头像
      var nickname = userInfo.nickname; // 昵称
      var diamond = userInfo.diamond; // 金币
      var vipLevel = userInfo.vipLevel;
      var pab_user = cc.instantiate(this.pab_user);
      this.node_users.addChild(pab_user);
      this.playerNodeArr.push(pab_user);
      var andeerPalyerCtrl = pab_user.getComponent('andeerPalyerCtrl');
      andeerPalyerCtrl.getUserLab();
      andeerPalyerCtrl.setLobbyThisToPlayer(this);
      andeerPalyerCtrl.setPlayerImgUrl(imgUrl);
      andeerPalyerCtrl.setPlayerNickName(nickname);
      andeerPalyerCtrl.setPlayerDiamond(diamond);
      andeerPalyerCtrl.setPlayerBetInfo(betInfo);
      andeerPalyerCtrl.setPlayerSeatID(pos);
      andeerPalyerCtrl.setPlayerPlayerId(playerId);
      andeerPalyerCtrl.setPlayerVipLevel(vipLevel);
      var obj = {};
      obj.seatID = pos;
      obj.playerId = playerId;
      obj.act = 'enter';
      this.posOutOrINLogArr.push(obj);
    }
    ;
  },
  setRoomStatus: function setRoomStatus(roomStatus) {
    this.roomStatus = roomStatus;
  },
  getRoomStatus: function getRoomStatus() {
    return this.roomStatus ? this.roomStatus : 3;
  },
  dealExitRoomEvent: function dealExitRoomEvent() {
    window.isNeedShowRoomList = "andar";
    SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.ANDAER, SceneManager.getInstance().sceneType.LOBBY);
  },
  dealPlayerEnterNotifyEvent: function dealPlayerEnterNotifyEvent(notify) {
    if (!notify) {
      LoggerUtil.getInstance().error("服务器下发的玩家加入房间的消息为空!");
      return;
    }
    ;
    var player = notify.player;
    var pos = player.pos; // 位置
    var betInfo = player.betInfo; // 下注信息 0: a, 1: b
    var userInfo = player.userInfo; // 用户信息
    var playerId = userInfo.playerId; // 玩家Id
    var displayName = userInfo.displayName; // 用于显示的数字ID
    var imgUrl = userInfo.imgUrl; // 头像
    var nickname = userInfo.nickname; // 昵称
    var diamond = userInfo.diamond; // 金币
    var vipLevel = userInfo.vipLevel;
    var isExist = false;
    for (var i = 0, len = this.playerNodeArr.length; i < len; i++) {
      var playerNode = this.playerNodeArr[i];
      var _andeerPalyerCtrl4 = playerNode.getComponent('andeerPalyerCtrl');
      var seatID = _andeerPalyerCtrl4.getPlayerSeatID();
      if (seatID === pos) {
        isExist = true;
        break;
      }
      ;
    }
    ;
    if (isExist) {
      LoggerUtil.getInstance().error("\u6B64\u5EA7\u4F4D" + pos + "\u5DF2\u5B58\u5728\u73A9\u5BB6, \u8BF7\u67E5\u770B\u8FDB\u51FA\u6D88\u606F\u6392\u67E5! " + JSON.stringify(this.posOutOrINLogArr));
      return;
    }
    var pab_user = cc.instantiate(this.pab_user);
    this.node_users.addChild(pab_user);
    this.playerNodeArr.push(pab_user);
    var andeerPalyerCtrl = pab_user.getComponent('andeerPalyerCtrl');
    andeerPalyerCtrl.getUserLab();
    andeerPalyerCtrl.setLobbyThisToPlayer(this);
    andeerPalyerCtrl.setPlayerImgUrl(imgUrl);
    andeerPalyerCtrl.setPlayerNickName(nickname);
    andeerPalyerCtrl.setPlayerDiamond(diamond);
    andeerPalyerCtrl.setPlayerBetInfo(betInfo);
    andeerPalyerCtrl.setPlayerSeatID(pos);
    andeerPalyerCtrl.setPlayerPlayerId(playerId);
    andeerPalyerCtrl.setPlayerVipLevel(vipLevel);
    var roomStatus = this.getRoomStatus();
    if (roomStatus >= 1) {
      andeerPalyerCtrl.setPlayerSkippedStatusActive(true);
    } else {
      andeerPalyerCtrl.setPlayerSkippedStatusActive(false);
    }
    ;
    var obj = {};
    obj.seatID = pos;
    obj.playerId = playerId;
    obj.act = 'enter';
    this.posOutOrINLogArr.push(obj);
  },
  dealPlayerExitNotifyEvent: function dealPlayerExitNotifyEvent(notify) {
    if (!notify) {
      LoggerUtil.getInstance().error("服务器下发的其他玩家退出房间的消息为空!");
      return;
    }
    ;
    var pos = notify.pos;
    var isExist = false;
    for (var i = 0, len = this.playerNodeArr.length; i < len; i++) {
      var playerNode = this.playerNodeArr[i];
      var andeerPalyerCtrl = playerNode.getComponent('andeerPalyerCtrl');
      var seatID = andeerPalyerCtrl.getPlayerSeatID();
      var playerId = andeerPalyerCtrl.getPlayerPlayerId();
      if (seatID === pos) {
        isExist = true;
        playerNode.destroy();
        this.playerNodeArr.splice(i, 1);
        var obj = {};
        obj.seatID = pos;
        obj.playerId = playerId;
        obj.act = 'out';
        this.posOutOrINLogArr.push(obj);
        break;
      }
      ;
    }
    ;
    if (isExist == false) {
      LoggerUtil.getInstance().error("\u6B64\u5EA7\u4F4D" + pos + "\u5E76\u4E0D\u5B58\u5728\u73A9\u5BB6, \u8BF7\u67E5\u770B\u8FDB\u51FA\u6D88\u606F\u6392\u67E5! " + JSON.stringify(this.posOutOrINLogArr));
      return;
    }
    ;
  },
  dealFirstBetStatusStartNotifyEvent: function dealFirstBetStatusStartNotifyEvent(notify) {
    var _this2 = this;
    if (!notify) {
      LoggerUtil.getInstance().error("服务器下发的第一次下注通知消息为空!");
      return;
    }
    ;
    var midCard = notify.midCard; // 中间牌
    var duration = notify.duration; // 持续时间

    // 重置上一局信息
    this.sk_zhuang.clearTracks();
    this.sk_leftOrRight.clearTracks();
    this.sk_zhuang.node.active = false;
    this.sk_leftOrRight.node.active = false;
    this.andeerActionCtrl.deleteAllCard();
    for (var i = 0, len = this.playerNodeArr.length; i < len; i++) {
      var playerNode = this.playerNodeArr[i];
      var andeerPalyerCtrl = playerNode.getComponent('andeerPalyerCtrl');
      andeerPalyerCtrl.setPlayerSkippedStatusActive(false);
      andeerPalyerCtrl.setPlayerBetInfo([0, 0]);
    }
    ;
    this.lab_GameNotify.string = CommonFun.getInstance().showLabelLanguage("The first round starts to bet!");
    this.andeerActionCtrl.faMidPosCard(midCard);
    this.scheduleOnce(function () {
      _this2.showMyBetBtns(true);
      for (var _i5 = 0, _len5 = _this2.playerNodeArr.length; _i5 < _len5; _i5++) {
        var _playerNode4 = _this2.playerNodeArr[_i5];
        var _andeerPalyerCtrl5 = _playerNode4.getComponent('andeerPalyerCtrl');
        _andeerPalyerCtrl5.countDownTime(Math.floor((duration - 500) / 1000), true);
      }
      ;
    }, 0.5);
  },
  dealAbDealNotify: function dealAbDealNotify(notify) {
    if (!notify) {
      LoggerUtil.getInstance().error("服务器下发的发牌通知消息为空!");
      return;
    }
    ;
    var abCards = notify.abCards; // 两边的牌, a,b,a,b,a,b......循环

    this.lab_GameNotify.string = CommonFun.getInstance().showLabelLanguage("Dealing Cards...");
    for (var i = 0, len = this.playerNodeArr.length; i < len; i++) {
      var playerNode = this.playerNodeArr[i];
      var andeerPalyerCtrl = playerNode.getComponent('andeerPalyerCtrl');
      andeerPalyerCtrl.countDownTime(0, false);
    }
    ;
    this.showMyBetBtns(false);
    var aWin = notify.aWin;
    var bWin = notify.bWin;
    var winType = null;
    if (aWin == true || bWin == true) {
      winType = aWin ? "A" : "B";
    }
    this.andeerActionCtrl.faLeftRightPosCard(abCards, true, winType);
  },
  dealSecondBetStatusStartNotifyEvent: function dealSecondBetStatusStartNotifyEvent(notify) {
    if (!notify) {
      LoggerUtil.getInstance().error("服务器下发的第二次下注通知消息为空!");
      return;
    }
    ;
    var duration = notify.duration; // 持续时间

    this.lab_GameNotify.string = CommonFun.getInstance().showLabelLanguage("The second round starts to bet!");
    var myPlayerSeatID = this.getMyPlayerSeatID();
    for (var i = 0, len = this.playerNodeArr.length; i < len; i++) {
      var playerNode = this.playerNodeArr[i];
      var andeerPalyerCtrl = playerNode.getComponent('andeerPalyerCtrl');
      var seatID = andeerPalyerCtrl.getPlayerSeatID();
      var aScore = andeerPalyerCtrl.getPlayerFirstBetScore();
      if (aScore == 0) {
        andeerPalyerCtrl.setPlayerSkippedStatusActive(true);
        if (seatID === myPlayerSeatID) {
          this.showMyBetBtns(false);
        }
        ;
      } else {
        andeerPalyerCtrl.countDownTime(Math.floor(duration / 1000), true);
        if (seatID === myPlayerSeatID) {
          this.showMyBetBtns(true);
        }
        ;
      }
      ;
    }
    ;
  },
  dealCallEvent: function dealCallEvent(notify) {},
  dealCallNotifyEvent: function dealCallNotifyEvent(notify) {
    if (!notify) {
      LoggerUtil.getInstance().error("服务器下发的下注通知消息为空!");
      return;
    }
    ;
    var pos = notify.pos; // 下注玩家seat
    var side = notify.side; // 下注位置 A/B
    var amount = notify.amount; // 下注金额
    var after = notify.after; // 下注后剩余
    var playerBet = notify.playerBet; // 玩家总下注 0A,1B
    var poolBet = notify.poolBet; // 系统总下注 0A,1B

    var myPlayerSeatID = this.getMyPlayerSeatID();
    for (var i = 0, len = this.playerNodeArr.length; i < len; i++) {
      var playerNode = this.playerNodeArr[i];
      var andeerPalyerCtrl = playerNode.getComponent('andeerPalyerCtrl');
      var seatID = andeerPalyerCtrl.getPlayerSeatID();
      if (seatID === pos) {
        andeerPalyerCtrl.setPlayerDiamond(after);
        andeerPalyerCtrl.setPlayerBetInfo(playerBet);
        andeerPalyerCtrl.countDownTime(0, false);
        var aScore = andeerPalyerCtrl.getPlayerFirstBetScore();
        if (aScore == 0) {
          andeerPalyerCtrl.setPlayerSkippedStatusActive(true);
        } else {
          andeerPalyerCtrl.setPlayerSkippedStatusActive(false);
        }
        if (myPlayerSeatID === pos) {
          this.showMyBetBtns(false);
        }
        ;
        return;
      }
      ;
    }
    ;
  },
  dealGameSettleNotifyEvent: function dealGameSettleNotifyEvent(notify) {
    if (!notify) {
      LoggerUtil.getInstance().error("服务器下发的游戏结束通知消息为空!");
      return;
    }
    ;
    var aWin = notify.aWin;
    var bWin = notify.bWin;
    var players = notify.players;
    var myPlayerSeatID = this.getMyPlayerSeatID();
    for (var i = 0, len = this.playerNodeArr.length; i < len; i++) {
      var playerNode = this.playerNodeArr[i];
      var andeerPalyerCtrl = playerNode.getComponent('andeerPalyerCtrl');
      var seatID = andeerPalyerCtrl.getPlayerSeatID();
      for (var k = 0, len1 = players.length; k < len1; k++) {
        var playerResult = players[k];
        var pos = playerResult.pos; // 座位号
        var win = playerResult.win; // 赢分
        var after = playerResult.after; // 结算后
        if (seatID === pos && win > 0) {
          andeerPalyerCtrl.setPlayerDiamond(after);
          andeerPalyerCtrl.setPlayerGameSettleEffect(win);
        }
        ;
        if (myPlayerSeatID == pos) {
          GlobalCfg.USER_DATAS.userDiamond = after;
        }
      }
      ;
    }
    ;
    this.curRoundAddCoinFinish();
  },
  showWinAreaSkeleton: function showWinAreaSkeleton(winArea) {
    var tipsStr = "";
    switch (winArea) {
      case "A":
        this.sk_shanPai.setPosition(-192, 63);
        tipsStr = CommonFun.getInstance().showLabelLanguage("Andar Win!");
        break;
      case "B":
        this.sk_shanPai.setPosition(192, 63);
        tipsStr = CommonFun.getInstance().showLabelLanguage("Bahar Win!");
        break;
      default:
        break;
    }
    this.lab_GameNotify.string = tipsStr;
    this.sk_zhuang.node.active = true;
    this.sk_leftOrRight.node.active = true;
    this.sk_zhuang.setAnimation(0, "animation", true);
    this.sk_leftOrRight.setAnimation(0, "animation", true);
  },
  curRoundAddCoinFinish: function curRoundAddCoinFinish() {
    if (cc.isValid(this)) {
      var minLimit = this.roomInfoData.entrycondition || 0;
      CommonFun.getInstance().gameShowSecondRecharge(minLimit, this.roundBet);
      CommonFun.getInstance().showWithdrawToastInGame();
    }
  },
  dealShortMessageEvent: function dealShortMessageEvent(notify) {},
  dealShortMessageNotifyEvent: function dealShortMessageNotifyEvent(notify) {
    if (!notify) {
      LoggerUtil.getInstance().error("服务器下发的发送表情通知消息为空!");
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
      for (var i = 0, len = this.playerNodeArr.length; i < len; i++) {
        var playerNode = this.playerNodeArr[i];
        var andeerPalyerCtrl = playerNode.getComponent('andeerPalyerCtrl');
        var seatID = andeerPalyerCtrl.getPlayerSeatID();
        if (seatID == target) {
          andeerPalyerCtrl.face(notify);
          break;
        }
      }
    } else if (msgType == 2) {
      var targetNodeArr = [];
      var senderCtrl = null;
      for (var _i6 = 0, _len6 = this.playerNodeArr.length; _i6 < _len6; _i6++) {
        var _playerNode5 = this.playerNodeArr[_i6];
        var _andeerPalyerCtrl6 = _playerNode5.getComponent('andeerPalyerCtrl');
        var _seatID2 = _andeerPalyerCtrl6.getPlayerSeatID();
        if (_seatID2 == sender) {
          senderCtrl = _andeerPalyerCtrl6;
          break;
        }
        ;
      }
      ;
      if (!senderCtrl || !senderCtrl.node) {
        return;
      } else {
        senderCtrl.setPlayerDiamond(senderAfter);
      }
      if (target == -1) {
        for (var _i7 = 0, _len7 = this.playerNodeArr.length; _i7 < _len7; _i7++) {
          var _playerNode6 = this.playerNodeArr[_i7];
          var _andeerPalyerCtrl7 = _playerNode6.getComponent('andeerPalyerCtrl');
          if (_andeerPalyerCtrl7 !== senderCtrl) {
            targetNodeArr.push(_andeerPalyerCtrl7.node);
          }
          ;
        }
        ;
      } else {
        for (var _i8 = 0, _len8 = this.playerNodeArr.length; _i8 < _len8; _i8++) {
          var _playerNode7 = this.playerNodeArr[_i8];
          var _andeerPalyerCtrl8 = _playerNode7.getComponent('andeerPalyerCtrl');
          var _seatID3 = _andeerPalyerCtrl8.getPlayerSeatID();
          if (_seatID3 == target) {
            targetNodeArr.push(_andeerPalyerCtrl8.node);
            break;
          }
          ;
        }
        ;
      }
      ;
      CommonFun.getInstance().playGameGifInteraction(name, senderCtrl.node, targetNodeArr);
    }
    ;
  },
  dealUpdateCoinNotifyEvent: function dealUpdateCoinNotifyEvent(notify) {
    if (!notify) {
      LoggerUtil.getInstance().error("服务器下发的游戏结束通知消息为空!");
      return;
    }
    ;
    var playerId = notify.playerId; // 玩家Id
    var balance = notify.balance; // 剩余数量
    var reason = notify.reason; // 原因 1:支付; 其他：未知

    var myPlayerSeatID = this.getMyPlayerSeatID();
    for (var i = 0, len = this.playerNodeArr.length; i < len; i++) {
      var playerNode = this.playerNodeArr[i];
      var andeerPalyerCtrl = playerNode.getComponent('andeerPalyerCtrl');
      var andeerPlayerId = andeerPalyerCtrl.getPlayerPlayerId();
      if (andeerPlayerId == playerId) {
        andeerPalyerCtrl.setPlayerDiamond(balance);
        var playerSeatID = andeerPalyerCtrl.getPlayerSeatID();
        if (myPlayerSeatID == playerSeatID) {
          if (this.isTrialRoom == false) {
            GlobalCfg.USER_DATAS.userDiamond = balance;
          }
          ;
        }
        ;
      }
      ;
    }
    ;
  },
  dealAskTrialEvent: function dealAskTrialEvent(notify) {},
  // 玩家下注请求
  UserSelectionActionReq: function UserSelectionActionReq(side, Score) {
    if (Score > 0) {
      this.roundBet = this.roundBet + Score * 100;
    }
    GameServerManager.send("gameservice.call", "CallReq", {
      side: side,
      amount: Score * 100
    });
  },
  getPlayerInfoByUserId: function getPlayerInfoByUserId(seatid) {
    for (var i = 0, len = this.playerNodeArr.length; i < len; i++) {
      var playerNode = this.playerNodeArr[i];
      var andeerPalyerCtrl = playerNode.getComponent('andeerPalyerCtrl');
      var playerSeatID = andeerPalyerCtrl.getPlayerSeatID();
      if (seatid == playerSeatID) {
        return andeerPalyerCtrl;
      }
      ;
    }
    ;
  },
  update: function update(dt) {
    this.showBetSpineTime += dt;
    if (this.showBetSpineTime > this.showBetSpineTimeInterval) {
      this.showBetSpineTime = 0;
      this.showBtnBetSpine();
    }
  },
  showBtnBetSpine: function showBtnBetSpine() {
    var _this3 = this;
    var animationName = 'animation';
    var len = this.btnBets.length,
      i = 0;
    this.scheduleBetSpineTimeCallback = function () {
      var spine = _this3.btnBets[i].node.getChildByName('spine').getComponent(sp.Skeleton);
      spine.setAnimation(0, animationName, false);
      i++;
    };
    this.schedule(this.scheduleBetSpineTimeCallback, 0.8, len - 1);
  }
});

cc._RF.pop();