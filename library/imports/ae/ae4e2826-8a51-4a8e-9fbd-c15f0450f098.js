"use strict";
cc._RF.push(module, 'ae4e2gmilFKjp+9wV8EUPCY', 'horseRaceLobbyCtrl');
// horseRaceGame/horseScr/horseRaceLobbyCtrl.js

"use strict";

cc.Class({
  "extends": require('UINode'),
  properties: {
    pab_coin: cc.Prefab,
    pab_player: cc.Prefab,
    record_ball: cc.Prefab,
    pab_playersList: cc.Prefab,
    pab_rule: cc.Prefab,
    pab_chat: cc.Prefab,
    btn_openMenu: cc.Button
  },
  onLoad: function onLoad() {
    CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.SHOW_HORSE_GAME);
    this.myNodeCtrl = null;
    GlobalCfg.ACT_SCENE_CTRL = this;
    this.initLocalBtn(); // 实例化节点
    this.initCoinPool(); // 创建金币对象池
    this.assetBundle = cc.assetManager.getBundle('horseRaceGame');
    this.skeleDataMap = new Map();
    this.loadSkeleData();
    this.loadSkeleData1();
    this.cashSwitch();
    this.msgHandle = ClientNotify.register(GlobalCfg.MSG_TYPE.serverMsg, this.onEventMsg, this);
    this.customMsgEventHandle = ClientNotify.register(GlobalCfg.MSG_TYPE.clientMsg, this.onEventMsg, this);
    this.eventShow();
    this.eventHide();
  },
  start: function start() {
    GameServerManager.send("gameservice.login", "LoginReq", {
      userid: GlobalCfg.USER_DATAS.userId,
      token: GlobalCfg.USER_DATAS.token,
      fromid: GlobalCfg.PRODUCT_ID //平台ID
    });
  },

  onDestroy: function onDestroy() {
    GlobalCfg.ACT_SCENE_CTRL = null;
    this.unschedule(this.scheduleBetSpineTimeCallback);
    ClientNotify.removeByHandle(GlobalCfg.MSG_TYPE.serverMsg, this.msgHandle);
    ClientNotify.removeByHandle(GlobalCfg.MSG_TYPE.clientMsg, this.customMsgEventHandle);
    CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.EXIT_HORSE_GAME);
  },
  onEventMsg: function onEventMsg(webData, target) {
    var self = target;
    var msgId = webData.msgCode;
    var notify = webData.msgData;
    if (msgId == "gameservice.login") {
      self.login(notify);
    } else if (msgId == "gameservice.joinroom") {
      self.joinroom(notify);
    } else if (msgId == "gameservice.joinroomnotify") {
      //加入房间通知
    } else if (msgId == "gameservice.joinvipposnotify") {
      self.joinvipposnotify(notify);
    } else if (msgId == "gameservice.vipplayerlist") {
      //获取Vip列表
    } else if (msgId == "gameservice.shortmessagenotify") {
      self.chatnotify(notify);
    } else if (msgId == "gameservice.gamerecordlist") {} else if (msgId == "gameservice.callnotify") {
      self.callnotify(notify); //下注通知
    } else if (msgId == "gameservice.gameovernotify") {
      self.isGameEndStatus = true;
      self.gameovernotify(notify);
    } else if (msgId == "gameservice.startgamenotify") {
      self.isGameEndStatus = false;
      self.startgamenotify(notify);
    } else if (msgId == "gameservice.outgamenotify") {
      self.outgamenotify(notify);
    } else if (msgId == "gameservice.playerlist") {
      self.playerlist(notify);
    } else if (msgId == "gameservice.outgame") {
      // self.outgamenotify(notify);
      SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.HORSERACE, SceneManager.getInstance().sceneType.LOBBY);
    } else if (msgId == "gameservice.endbetnotify") {
      self.endbetnotify(notify);
    } else if (msgId == "gameservice.playerwinloseinfonotify") {
      self.playerwinloseinfonotify(notify);
    } else if (msgId == GlobalCfg.CLIENT_MSG_ID.CURRENCY_CHANGED_USER_INFO) {
      var coin = notify.deposit + notify.winnings;
      var myVIPCtrl = self.setNodeCtrl(self.my_playerid);
      self.myNodeCtrl.shePlayCion(coin);
      if (myVIPCtrl) myVIPCtrl.shePlayCion(coin);
    }
    // else if(msgId == GlobalCfg.CLIENT_MSG_ID.FIRST_RECHARGE_TIPS) {
    //     SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.HORSERACE, SceneManager.getInstance().sceneType.LOBBY);
    // }
    else if (msgId == GlobalCfg.CLIENT_MSG_ID.GAME_MENU_CLICK_OUT_TO_LOBBY) {
      //退出游戏
      var betCoin = 0;
      for (var index = 1; index < 7; index++) {
        betCoin += self.myBetCoin[index];
      }
      ;
      if (betCoin > 0 && self.isGameEndStatus == false) {
        CommonFun.getInstance().showMsgBox(self.tipsLabel[0], "YES_NO", function () {
          self.sendReqCtrl.OutGameReq();
        }, false);
      } else {
        self.sendReqCtrl.OutGameReq();
      }
      ;
    } else if (msgId == GlobalCfg.CLIENT_MSG_ID.GAME_MENU_CLICK_HOW_TO_PLAY) {
      CommonFun.getInstance().showRule("horseRace");
    } else if (msgId == "lobbyservice.kicktolobby") {
      SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.HORSERACE, SceneManager.getInstance().sceneType.LOBBY);
    }
  },
  cashSwitch: function cashSwitch() {
    if (GlobalCfg.PAYMENT_SWITCH == 2 && GlobalCfg.CHANNEL == "ios") {
      var btn_add = this.btn_shop.node.getChildByName('Background').getChildByName('icon_chipsshop');
      btn_add.active = GlobalCfg.USER_DATAS.isNotCharge;
    }
    this.paymentSwitch = GlobalCfg.USER_DATAS.openModules.includes(4);
    this.btn_shop.node.active = GlobalCfg.USER_DATAS.openModules.includes(4);
  },
  btnClick: function btnClick(button) {
    var pos = button.node.getPosition();
    var btnName = button.node.name;
    GlobalCfg.G_COMPONENTS.Audio.playButton();
    if (btnName == "btn_chat") {
      // 聊天
      var ctrl = this.setNodeCtrl(this.my_playerid);
      if (ctrl) {
        var pab_chat = cc.instantiate(this.pab_chat);
        var _ctrl = pab_chat.getComponent("chatCtrl");
        _ctrl.setPlayerSeat(this.getVIPistMe());
        this.node.addChild(pab_chat);
      } else {
        CommonFun.getInstance().showTips("You're not a VIP. You can't send expressions");
      }
    } else if (btnName == "btn_playersAll") {
      // 玩家列表
      this.sendReqCtrl.playerlistReq(1, 12);
    } else if (btnName == "btn_shop") {
      CommonFun.getInstance().showSmallAddCash();
    } else if (btnName == "btn_10") {
      var num = Number(button.node.getChildByName('lab').getComponent(cc.Label).string);
      this.userBtnCion = num * 100;
      this.choiceBetButton(button);
    } else if (btnName == "btn_50") {
      var _num = Number(button.node.getChildByName('lab').getComponent(cc.Label).string);
      this.userBtnCion = _num * 100;
      this.choiceBetButton(button);
    } else if (btnName == "btn_100") {
      var _num2 = Number(button.node.getChildByName('lab').getComponent(cc.Label).string);
      this.userBtnCion = _num2 * 100;
      this.choiceBetButton(button);
    } else if (btnName == "btn_1000") {
      var _num3 = Number(button.node.getChildByName('lab').getComponent(cc.Label).string);
      this.userBtnCion = _num3 * 100;
      this.choiceBetButton(button);
    } else if (btnName == "btn_2000") {
      var _num4 = Number(button.node.getChildByName('lab').getComponent(cc.Label).string);
      this.userBtnCion = _num4 * 100;
      this.choiceBetButton(button);
    } else if (btnName == "btn_repeatBet") {
      this.repeatPreviousRound("bet");
      button.node.active = false;
    } else if (btnName == "btn_01") {
      this.clickVIPuP(0);
    } else if (btnName == "btn_02") {
      this.clickVIPuP(1);
    } else if (btnName == "btn_03") {
      this.clickVIPuP(2);
    } else if (btnName == "btn_04") {
      this.clickVIPuP(3);
    } else if (btnName == "btn_05") {
      this.clickVIPuP(4);
    } else if (btnName == "btn_06") {
      this.clickVIPuP(5);
    } else if (btnName == "btn_openMenu") {
      CommonFun.getInstance().showGameMenu(false);
    }
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
  // 监听错误消息
  checkWebMsgError: function checkWebMsgError(webData, target) {
    var self = target;
    var msgId = webData.msgCode;
    var notify = webData.msgData;
    if (!notify) {
      var info = {
        errorMessage: "\u8D5B\u9A6C\u6E38\u620F\u4E2D, \u670D\u52A1\u5668\u4E0B\u53D1\u7684\u975E\u6B63\u786E\u6D88\u606F\u4E2D\u7ED3\u6784\u4F53\u5F02\u5E38, \u5185\u5BB9\u4E3A===>" + JSON.stringify(webData)
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
            GameServerManager.send("gameservice.outgame", "OutGameReq", {});
            // SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.HORSERACE, SceneManager.getInstance().sceneType.LOBBY);
          });
        } else {
          CommonFun.getInstance().showTips(result.message);
        }
        ;
      } else {
        CommonFun.getInstance().showTips(result.message);
      }
      ;
    } else if (msgId === "gameservice.login") {
      CommonFun.getInstance().showMsgBox(result.message, "YES", function () {
        SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.HORSERACE, SceneManager.getInstance().sceneType.LOBBY);
      }, false);
    }
    ;
  },
  login: function login(notify) {
    if (!notify || !notify.userinfo) {
      return;
    }
    ;
    this.ske_endWin.skeletonData = null;
    this.ske_endWin.node.active = false;
    this.ske_start.skeletonData = null;
    this.ske_start.node.active = false;
    cc.Tween.stopAll();
    this.unscheduleAllCallbacks();
    var userinfo = notify.userinfo;
    this.pos = userinfo.pos;
    this.my_playerid = userinfo.playerid;
    this.myNodeCtrl = this.horsePlayer.getComponent("horseRacePlayerCtrl");
    this.myNodeCtrl.setUserData(userinfo);
    // this.sendReqCtrl.JoinRoomReq();

    this.wj_kong_01.active = true;
    this.wj_kong_02.active = true;
    this.wj_kong_03.active = true;
    this.wj_kong_04.active = true;
    this.wj_kong_05.active = true;
    this.wj_kong_06.active = true;
    GameServerManager.send("gameservice.joinroom", "JoinRoomReq", {});
  },
  joinroom: function joinroom(notify) {
    if (!notify) {
      return;
    }
    ;
    var ownerDiamond = notify.ownerDiamond;
    var roomconfig = notify.roomconfig;
    var players = notify.players;
    var vipplayers = notify.vipplayers;
    var roomruntimeinfo = notify.roomruntimeinfo;
    var runtime = roomruntimeinfo.runtime; // 小局开始(开始下注)到现在的毫秒数, 下注阶段 10s 跑马 10s 结算等待 7s
    var status = roomruntimeinfo.status;
    var betscore = roomruntimeinfo.betscore;
    var betconf = roomruntimeinfo.betconf;
    var recordlist = notify.recordlist;
    var gameoverinfo = notify.gameoverinfo;
    var betnotify = notify.endbetnotify;
    var winloseinfonotify = notify.playerwinloseinfonotify;
    this.lab_palyersAll.string = notify.onlinenum;
    this.vipplayers(vipplayers);
    this.showBetScore(betscore);
    this.showBetScore(notify.betscore, "me");
    this.setHistory(recordlist);
    this.node_djs.active = false;
    this.myNodeCtrl.bg_js.active = false;
    if (ownerDiamond) {
      GlobalCfg.USER_DATAS.userDiamond = ownerDiamond;
      this.myNodeCtrl.lab_coin.string = CommonFun.getInstance().numberToShow(ownerDiamond / 100);
    }
    if (this.recordBall) {
      this.recordBall.destroy();
    }
    for (var index = 0; index < this.sprWonHorse.children.length; index++) {
      this.sprWonHorse.children[index].opacity = 255;
    }
    this.ske_endWin.skeletonData = null;
    this.ske_endWin.node.active = false;
    this.labYouWon.node.opacity = 255;
    this.labIndia.node.opacity = 255;
    this.labWonHorse.node.opacity = 255;
    this.spr_TrackTerminus.node.active = false;
    this.nodeTrack.x = 0;
    this.spr_Track1.x = 0;
    this.spr_Track2.x = 940;
    for (var _index = 1; _index < this.lab_OddsNum.length; _index++) {
      this.lab_OddsNum[_index].string = "Odds " + (betconf[_index - 1] / 10).toFixed(1);
      cc.tween(this.lab_OddsNum[_index].node).tag(1).to(0.3, {
        scale: 1.1
      }, {
        easing: 'sineInOut'
      }).to(0.1, {
        scale: 1
      }).start();
    }
    if (status == 0) {
      // 开始游戏
      this.betStatus = true;
    } else if (status == 2) {
      // 下注
      this.betStatus = true;
    } else if (status == 3) {
      // 结束下注
      this.betStatus = false;
      this.btn_repeatBet.node.active = false;
      this.random = betnotify && betnotify.rand;
      this.winorlose = betnotify && betnotify.winorlose;
      Math.seed = this.random;
      Math.seededRandom = function (max, min) {
        max = max || 1;
        min = min || 0;
        Math.seed = (Math.seed * 9301 + 49297) % 233280;
        var rnd = Math.seed / 233280.0;
        return Math.floor(min + rnd * (max - min));
      };
      this.leaderChange(0);
      for (var _index2 = 1; _index2 < this.horseAnimNodeArr.length; _index2++) {
        var ske_horse = this.horseAnimNodeArr[_index2].getComponent(sp.Skeleton);
        ske_horse.node.active = false;
        ske_horse.skeletonData = null;
        this.horseAnimNodeArr[_index2].x = this.originX;
      }
      if (runtime > 10000) {
        var runtimeTemp = 27000 - runtime - 7000;
        var kind = Math.seededRandom(10, 0) + 1;
        this.getHorseSpeedArr(this.horseSpeedData[kind], this.random, 10 - Number((runtimeTemp / 1000).toFixed(3)));
      }
      return;
    } else if (status == 4) {
      // 结算阶段
      this.betStatus = false;
      this.btn_repeatBet.node.active = false;
      this.random = betnotify.rand;
      this.winorlose = betnotify.winorlose;
      this.leaderChange(0);
      for (var _index3 = 1; _index3 < this.horseAnimNodeArr.length; _index3++) {
        var _ske_horse = this.horseAnimNodeArr[_index3].getComponent(sp.Skeleton);
        _ske_horse.node.active = false;
        _ske_horse.skeletonData = null;
        this.horseAnimNodeArr[_index3].x = this.originX;
      }
      if (runtime > 20000) {
        this.showBetScore(betscore);
        this.showBetScore(notify.betscore, "me");
      } else if (runtime > 22000) {
        this.infos = gameoverinfo.infos;
        if (winloseinfonotify) {
          this.myScore = winloseinfonotify.score;
          this.myCoin = winloseinfonotify.coin;
        }
        this.allPlayerWinArr = [];
        this.infos = this.infos.sort(this.compare("pos"));
        for (var i = 0; i < this.infos.length; i++) {
          var playerid = this.infos[i].pid;
          var score = this.infos[i].score;
          var pos = this.infos[i].pos;
          if (score > 0) {
            for (var _i = 0; _i < this.userArryNode.length; _i++) {
              var userNode = this.userArryNode[_i];
              if (userNode.name != '') {
                var userInfoCtrl = userNode.getComponent('horseRacePlayerCtrl');
                if (userInfoCtrl && userInfoCtrl.playerid == playerid) {
                  this.allPlayerWinArr.push(pos);
                  userInfoCtrl.setPlayerWinCion(score); // 设置每个VIP玩家是否赢
                }
              }
            }
          }
        }

        if (this.myScore > 0) {
          this.allPlayerWinArr.push(6);
          var UserInfo = {
            coin: this.myCoin,
            score: this.myScore,
            pid: this.my_playerid,
            pos: 6
          };
          this.infos.push(UserInfo);
        }
        this.winorloseCoinAct();
        this.myBetCoin = [null, 0, 0, 0, 0, 0, 0];
        this.allBetCoin = [null, 0, 0, 0, 0, 0, 0];
        for (var _index4 = 1; _index4 < this.lab_betSelf.length; _index4++) {
          this.lab_betSelf[_index4].node.color = new cc.color(255, 255, 255, 255);
          this.lab_betSelf[_index4].string = '0';
          this.lab_betAll[_index4].string = '0';
        }
      } else {
        this.node_coinAll.removeAllChildren();
        this.myBetCoin = [null, 0, 0, 0, 0, 0, 0];
        this.allBetCoin = [null, 0, 0, 0, 0, 0, 0];
        for (var _index5 = 1; _index5 < this.lab_betSelf.length; _index5++) {
          this.lab_betSelf[_index5].node.color = new cc.color(255, 255, 255, 255);
          this.lab_betSelf[_index5].string = '0';
          this.lab_betAll[_index5].string = '0';
        }
      }
      return;
    }
    this.repeatPreviousRound();
    if (runtime < 10000) {
      this.showRuntime(10000 - runtime);
    }
  },
  // 下注广播
  callnotify: function callnotify(notify) {
    var _this = this;
    var pos = notify.pos;
    var amount = notify.amount;
    var types = notify.types;
    var playerid = notify.pid;
    var startNode = null;
    var endNode = this.betNodeArr[types];
    if (this.my_playerid == playerid) {
      //自己下注
      this.horseRaceAudioCtrl.playGameSound("mytouCoin");
      startNode = this.horsePlayer;
      this.myNodeCtrl.headAct("me");
      this.myNodeCtrl.showPlayCion(amount);
      var ctrl = this.getPlayerInfoByUserId(pos); //自己在vip位置上下注
      if (ctrl) {
        ctrl.showPlayCion(amount);
      }
    } else {
      if (pos == -1) {
        //普通玩家下注
        if (this.limitBetPlayAim) {
          //限制下注的声音
          this.limitBetPlayAim = false;
          this.horseRaceAudioCtrl.playGameSound("otherCoin");
          this.onVipBet();
          this.btnTime = setTimeout(function () {
            _this.limitBetPlayAim = true;
          }, 1000);
        }
      } else {
        // vip 玩家下注
        var _ctrl2 = this.getPlayerInfoByUserId(pos);
        this.horseRaceAudioCtrl.playGameSound("otherCoin");
        if (_ctrl2) {
          _ctrl2.showPlayCion(amount);
          if (this.my_playerid != playerid) {
            // 自己在VIP座位上不显示投注金币动作
            for (var i = 0; i < 4; i++) {
              // vip投注规定4个币
              this.createEnemy(this.getPlayNode(pos).getPosition(), endNode, types, true);
            }
            _ctrl2.headAct();
          }
        }
      }
    }
    if (startNode) {
      this.showcoinNumm(startNode, endNode, amount, types);
    }

    // this.allBetCoin[types] += amount;
    // this.lab_betAll[types].string = this.allBetCoin[types] / 100

    var BetScore = notify.BetScore ? notify.BetScore : [];
    for (var _i2 = 0; _i2 < BetScore.length; _i2++) {
      var betCoin = BetScore[_i2];
      this.lab_betAll[_i2 + 1].string = betCoin / 100;
      this.allBetCoin[_i2 + 1] = betCoin / 100;
    }
    if (this.myNodeCtrl && this.myNodeCtrl.playerid == playerid) {
      this.myBetCoin[types] += amount;
      this.lab_betSelf[types].string = this.myBetCoin[types] / 100;
      this.lab_betSelf[types].node.color = new cc.color(255, 255, 0, 255);
      cc.tween(this.lab_betSelf[types].node).to(0.1, {
        scale: 1.2
      }).to(0.1, {
        scale: 1
      }).start();
    }
  },
  // 玩家点击下注
  touchstart: function touchstart(event) {
    var _this2 = this;
    var name = event.currentTarget.name;
    var types = null;
    if (name == "node_horse_1") {
      types = 1;
    } else if (name == "node_horse_2") {
      types = 2;
    } else if (name == "node_horse_3") {
      types = 3;
    } else if (name == "node_horse_4") {
      types = 4;
    } else if (name == "node_horse_5") {
      types = 5;
    } else if (name == "node_horse_6") {
      types = 6;
    }
    if (this.betStatus) {
      if (GlobalCfg.IS_CLUB_MODE == 0 && GlobalCfg.USER_DATAS.isNotCharge == true && GlobalCfg.USER_DATAS.gamePattern == 0 && GlobalCfg.USER_DATAS.refuseUnpayHundred == true) {
        //未曾充值
        CommonFun.getInstance().showMsgBox("This feature is available only for premium players . Add cash now to become a premium player .", "SHOP", function () {
          if (_this2.paymentSwitch) {
            CommonFun.getInstance().showSmallAddCash();
          }
        }, false);
        return;
      } else if (this.userBtnCion > GlobalCfg.USER_DATAS.userDiamond) {
        if (GlobalCfg.IS_CLUB_MODE == 1) {
          //代理模式不跳转商城
          CommonFun.getInstance().showMsgBox('Insufficient cash', "YES", function () {}, false);
        } else {
          CommonFun.getInstance().showMsgBox(this.tipsLabel[5], "SHOP", function () {
            if (_this2.paymentSwitch) {
              CommonFun.getInstance().showSmallAddCash();
            }
          }, false);
        }
      } else {
        var betCoinAll = this.userBtnCion;
        for (var i = 1; i < this.myBetCoin.length; i++) {
          betCoinAll += this.myBetCoin[i];
        }
        if (betCoinAll > 2000000) {
          // 限制玩家下注
          CommonFun.getInstance().showTips("Upper limit of betting amount!");
        } else {
          this.sendReqCtrl.callReq(this.userBtnCion, types);
        }
      }
    } else {
      LoggerUtil.getInstance().log("游戏未开始");
      CommonFun.getInstance().showTips('non betting stage');
    }
  },
  // 模拟非vip下注
  onVipBet: function onVipBet() {
    var startNode = this.btn_playersAll.node;
    startNode.setPosition(615, -319);
    var endNode = null;
    for (var i = 1; i < 7; i++) {
      endNode = this.betNodeArr[i];
      for (var k = 0; k < 6; k++) {
        this.createEnemy(startNode.getPosition(), endNode, i, true);
      }
    }
    cc.tween(startNode).tag(1).to(0.1, {
      position: cc.v2(startNode.x, startNode.y + 5)
    }).to(0.1, {
      position: cc.v2(615, -319)
    }).start();
  },
  initLocalBtn: function initLocalBtn() {
    CommonFun.getInstance().hidProgress();
    this.node_chat = cc.find('Canvas/node_chat');
    this.wj_kong_01 = cc.find('Canvas/node_players/wj_kong_01');
    this.wj_kong_02 = cc.find('Canvas/node_players/wj_kong_02');
    this.wj_kong_03 = cc.find('Canvas/node_players/wj_kong_03');
    this.wj_kong_04 = cc.find('Canvas/node_players/wj_kong_04');
    this.wj_kong_05 = cc.find('Canvas/node_players/wj_kong_05');
    this.wj_kong_06 = cc.find('Canvas/node_players/wj_kong_06');
    this.node_propSke = cc.find('Canvas/node_prop/prop/prop_ske');
    this.node_btnGuangQuan = cc.find('Canvas/node_playerBetBtn/node_btnGuangQuan');
    this.node_horse1 = cc.find('Canvas/node_HorseBet/node_horse_1');
    this.node_horse2 = cc.find('Canvas/node_HorseBet/node_horse_2');
    this.node_horse3 = cc.find('Canvas/node_HorseBet/node_horse_3');
    this.node_horse4 = cc.find('Canvas/node_HorseBet/node_horse_4');
    this.node_horse5 = cc.find('Canvas/node_HorseBet/node_horse_5');
    this.node_horse6 = cc.find('Canvas/node_HorseBet/node_horse_6');
    this.horse1 = cc.find('Canvas/node_HorsePD/horse_1');
    this.horse2 = cc.find('Canvas/node_HorsePD/horse_2');
    this.horse3 = cc.find('Canvas/node_HorsePD/horse_3');
    this.horse4 = cc.find('Canvas/node_HorsePD/horse_4');
    this.horse5 = cc.find('Canvas/node_HorsePD/horse_5');
    this.horse6 = cc.find('Canvas/node_HorsePD/horse_6');
    this.node_coinAll = cc.find('Canvas/node_coinAll');
    this.node_playersSeat = cc.find('Canvas/node_players/node_playersSeat');
    this.horsePlayer = cc.find('Canvas/node_players/HorsePlayer');
    this.nodeTrack = cc.find('Canvas/node_HorsePD/node_pd');
    this.spr_Track1 = cc.find('Canvas/node_HorsePD/node_pd/pd_bg_1');
    this.spr_Track2 = cc.find('Canvas/node_HorsePD/node_pd/pd_bg_2');
    this.historyNode = cc.find('Canvas/node_Record');
    this.historyLayout = cc.find('Canvas/node_history/layout_history');
    this.node_djs = cc.find('Canvas/node_djs');
    this.lab_gameTime = cc.find('Canvas/node_djs/lab_gameTime').getComponent(cc.Label);
    this.lab_palyersAll = cc.find('Canvas/btn_playersAll/Background/playersNum/lab_palyersAll').getComponent(cc.Label);
    this.spr_gameTime = cc.find('Canvas/node_djs/bg_djsPro').getComponent(cc.Sprite);
    this.spr_TrackTerminus = cc.find('Canvas/node_HorsePD/pd_zdx').getComponent(cc.Sprite);
    this.spr_LeaderNum = cc.find('Canvas/node_lx');
    this.sendReqCtrl = this.node.getComponent("horseRaceSendReq"); //跟服务器请求数据
    this.horseRaceAudioCtrl = this.node.getComponent("horseRaceAudioCtrl");
    this.btn_chat = cc.find('Canvas/btn_chat').getComponent(cc.Button);
    this.btn_playersAll = cc.find('Canvas/btn_playersAll').getComponent(cc.Button);
    this.btn_shop = cc.find('Canvas/btn_shop').getComponent(cc.Button);
    this.btn_menu = cc.find('Canvas/btn_back').getComponent(cc.Button);
    this.btn_wf = cc.find('Canvas/btn_wf').getComponent(cc.Button);
    this.btn_10 = cc.find('Canvas/node_playerBetBtn/btn_10').getComponent(cc.Button);
    this.btn_50 = cc.find('Canvas/node_playerBetBtn/btn_50').getComponent(cc.Button);
    this.btn_100 = cc.find('Canvas/node_playerBetBtn/btn_100').getComponent(cc.Button);
    this.btn_1000 = cc.find('Canvas/node_playerBetBtn/btn_1000').getComponent(cc.Button);
    this.btn_2000 = cc.find('Canvas/node_playerBetBtn/btn_2000').getComponent(cc.Button);
    this.betAmountList = [10, 50, 100, 1000, 2000];
    if (GlobalCfg.USER_DATAS.gamePattern == 1) {
      this.betAmountList = [1, 10, 50, 100, 1000];
    }
    this.userBtnCion = this.betAmountList[0] * 100;
    this.choiceBetButton(this.btn_10);
    this.btn_10.node.getChildByName('lab').getComponent(cc.Label).string = this.betAmountList[0];
    this.btn_50.node.getChildByName('lab').getComponent(cc.Label).string = this.betAmountList[1];
    this.btn_100.node.getChildByName('lab').getComponent(cc.Label).string = this.betAmountList[2];
    this.btn_1000.node.getChildByName('lab').getComponent(cc.Label).string = this.betAmountList[3];
    this.btn_2000.node.getChildByName('lab').getComponent(cc.Label).string = this.betAmountList[4];
    this.btn_repeatBet = cc.find('Canvas/node_playerBetBtn/btn_repeatBet').getComponent(cc.Button);
    this.btn_1 = cc.find('Canvas/node_players/btn_01').getComponent(cc.Button);
    this.btn_2 = cc.find('Canvas/node_players/btn_02').getComponent(cc.Button);
    this.btn_3 = cc.find('Canvas/node_players/btn_03').getComponent(cc.Button);
    this.btn_4 = cc.find('Canvas/node_players/btn_04').getComponent(cc.Button);
    this.btn_5 = cc.find('Canvas/node_players/btn_05').getComponent(cc.Button);
    this.btn_6 = cc.find('Canvas/node_players/btn_06').getComponent(cc.Button);
    this.ske_start = cc.find('Canvas/node_ske/gameStart').getComponent(sp.Skeleton);
    this.ske_endWin = cc.find('Canvas/node_ske/winner').getComponent(sp.Skeleton);
    this.ske_touzhu1 = cc.find('Canvas/node_HorseBet/node_horse_1/ske_touzhu').getComponent(sp.Skeleton);
    this.ske_touzhu2 = cc.find('Canvas/node_HorseBet/node_horse_2/ske_touzhu').getComponent(sp.Skeleton);
    this.ske_touzhu3 = cc.find('Canvas/node_HorseBet/node_horse_3/ske_touzhu').getComponent(sp.Skeleton);
    this.ske_touzhu4 = cc.find('Canvas/node_HorseBet/node_horse_4/ske_touzhu').getComponent(sp.Skeleton);
    this.ske_touzhu5 = cc.find('Canvas/node_HorseBet/node_horse_5/ske_touzhu').getComponent(sp.Skeleton);
    this.ske_touzhu6 = cc.find('Canvas/node_HorseBet/node_horse_6/ske_touzhu').getComponent(sp.Skeleton);
    this.sprWonHorse = cc.find('Canvas/node_ske/winner/ATTACHED_NODE_TREE/ATTACHED_NODE:root/ATTACHED_NODE:shiziguang/win_horse');
    this.labWonHorse = cc.find('Canvas/node_ske/winner/ATTACHED_NODE_TREE/ATTACHED_NODE:root/ATTACHED_NODE:winner_dikuang/lab_horse').getComponent(cc.Label);
    this.labYouWon = cc.find('Canvas/node_ske/winner/ATTACHED_NODE_TREE/ATTACHED_NODE:root/ATTACHED_NODE:winner_dikuang/lab_youWon').getComponent(cc.Label);
    this.labIndia = cc.find('Canvas/node_ske/winner/ATTACHED_NODE_TREE/ATTACHED_NODE:root/ATTACHED_NODE:winner_dikuang/lab_india').getComponent(cc.Label);
    this.ske_touzhuArr = [null, this.ske_touzhu1, this.ske_touzhu2, this.ske_touzhu3, this.ske_touzhu4, this.ske_touzhu5, this.ske_touzhu6];
    this.betNodeArr = [null, this.node_horse1, this.node_horse2, this.node_horse3, this.node_horse4, this.node_horse5, this.node_horse6];
    this.horseAnimNodeArr = [null, this.horse1, this.horse2, this.horse3, this.horse4, this.horse5, this.horse6];
    this.ruZuoBtnArr = [this.wj_kong_01, this.wj_kong_02, this.wj_kong_03, this.wj_kong_04, this.wj_kong_05, this.wj_kong_06];
    this.lab_betSelf = [null];
    this.lab_betAll = [null];
    this.lab_OddsNum = [null];
    for (var index = 1; index < 7; index++) {
      this.lab_betSelf[index] = this.betNodeArr[index].getChildByName("lab_betSelf_" + index).getComponent(cc.Label);
      this.lab_betAll[index] = this.betNodeArr[index].getChildByName("lab_betAll_" + index).getComponent(cc.Label);
      this.lab_OddsNum[index] = this.node.getChildByName("Odds_node").getChildByName("lab_OddsNum_" + index).getComponent(cc.Label);
    }
    var btnArr = this.node.getComponentsInChildren(cc.Button);
    for (var i = 0; i < btnArr.length; i++) {
      if (btnArr[i].node.name != "btn_openMenu") {
        btnArr[i].node.on("click", this.btnClick, this);
      }
    }
    ;
    this.btn_openMenu.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
    this.node_horse1.on(cc.Node.EventType.TOUCH_START, this.touchstart, this);
    this.node_horse2.on(cc.Node.EventType.TOUCH_START, this.touchstart, this);
    this.node_horse3.on(cc.Node.EventType.TOUCH_START, this.touchstart, this);
    this.node_horse4.on(cc.Node.EventType.TOUCH_START, this.touchstart, this);
    this.node_horse5.on(cc.Node.EventType.TOUCH_START, this.touchstart, this);
    this.node_horse6.on(cc.Node.EventType.TOUCH_START, this.touchstart, this);
  },
  //  下载骨骼动画
  loadSkeleData: function loadSkeleData() {
    var _this3 = this;
    if (this.assetBundle) {
      var skeleArr = ['horseSke/gamestart', 'horseSke/winner', 'horseSke/ui_touzhu_k'];
      for (var index = 0; index < skeleArr.length; index++) {
        var url = skeleArr[index];
        this.assetBundle.load(url, sp.SkeletonData, function (err, asset) {
          if (!err) {
            if (asset._name && _this3.skeleDataMap) {
              _this3.skeleDataMap.set(asset._name, asset);
            }
          }
        });
      }
    }
  },
  //  下载骨骼动画
  loadSkeleData1: function loadSkeleData1() {
    var _this4 = this;
    if (this.assetBundle) {
      var skeleArr = ['horseSke/saima_6', 'horseSke/saima_2', 'horseSke/saima_3', 'horseSke/saima_4', 'horseSke/saima_1', 'horseSke/saima_5'];
      var _loop = function _loop(index) {
        url = skeleArr[index];
        _this4.assetBundle.load(url, sp.SkeletonData, function (err, asset) {
          if (!err) {
            if (asset._name && _this4.skeleDataMap) {
              _this4.skeleDataMap.set('horse_' + (index + 1), asset);
            }
          }
        });
      };
      for (var index = 0; index < skeleArr.length; index++) {
        var url;
        _loop(index);
      }
    }
  },
  // 显示玩家VIP列表
  vipplayers: function vipplayers(vipList) {
    this.node_playersSeat.removeAllChildren();
    this.userArryNode = [];
    for (var i = 0; i < vipList.length; i++) {
      var vipUserDate = vipList[i];
      if (vipUserDate.pos != -1) {
        var pab_player = cc.instantiate(this.pab_player);
        var ctrl = pab_player.getComponent("horseRacePlayerCtrl");
        ctrl.setUserData(vipUserDate);
        this.userArryNode.push(pab_player);
        this.node_playersSeat.addChild(pab_player);
      }
    }
  },
  // 显示倒计时
  showRuntime: function showRuntime(runtime) {
    if (runtime <= 0) {
      return;
    }
    var time = runtime / 1000;
    this.lab_gameTime.string = Math.floor(time);
    var totalTime = 10;
    var timeNum = (1 / totalTime).toFixed(3);
    var count = time;
    this.spr_gameTime.fillRange = timeNum * count;
    this.node_djs.active = true;
    this.fillRangeRoundTime(timeNum, this.spr_gameTime);
    this.RuntimeCallback = function () {
      time--;
      count--;
      if (time <= 0 || this.spr_gameTime.fillRange <= 0) {
        this.node_djs.active = false;
        this.betStatus = false;
        this.unschedule(this.RuntimeCallback);
      } else {
        if (time <= 3) {
          this.horseRaceAudioCtrl.playGameSound("daojishi");
        }
        this.lab_gameTime.string = Math.ceil(time);
        this.spr_gameTime.fillRange = count * timeNum;
        this.fillRangeRoundTime(timeNum, this.spr_gameTime);
      }
    };
    this.schedule(this.RuntimeCallback, 1);
  },
  fillRangeRoundTime: function fillRangeRoundTime(roundTimelememt, sprite) {
    var roundTimelememt1 = Number(roundTimelememt) / 10;
    var num = 0;
    this.unschedule(this.callbackCheck);
    this.callbackCheck = function () {
      num++;
      if (num >= 10) {
        num = 0;
        this.unschedule(this.callbackCheck);
      } else {
        sprite.fillRange -= roundTimelememt1;
        if (sprite.fillRange <= 0) {
          this.node_djs.active = false;
          this.betStatus = false;
        }
      }
    };
    this.schedule(this.callbackCheck, 0.1);
  },
  //切换领先马匹
  leaderChange: function leaderChange(id) {
    var _this5 = this;
    if (this.leaderNum != id) {
      this.leaderNum = id;
    } else {
      return;
    }
    var _loop2 = function _loop2(index) {
      _this5.spr_LeaderNum.getChildByName('lx_0' + (index + 1)).active = false;
      _this5.betNodeArr[index + 1].getChildByName('bg_ma_light').active = false;
      _this5.betNodeArr[index + 1].getChildByName('spr_cup').active = false;
      _this5.ske_touzhuArr[index + 1].skeletonData = null;
      _this5.ske_touzhuArr[index + 1].node.active = false;
      if (index + 1 == id) {
        var spine = _this5.skeleDataMap.get("ui_touzhu_k");
        _this5.ske_touzhuArr[index + 1].node.active = true;
        _this5.ske_touzhuArr[index + 1].skeletonData = spine;
        _this5.ske_touzhuArr[index + 1].timeScale = 2;
        _this5.spr_LeaderNum.getChildByName('lx_0' + (index + 1)).active = true;
        _this5.betNodeArr[index + 1].getChildByName('spr_cup').active = true;
        _this5.betNodeArr[index + 1].getChildByName('bg_ma_light').active = true;
        cc.tween(_this5.betNodeArr[index + 1]).tag(1).call(function () {
          _this5.ske_touzhuArr[index + 1].addAnimation(0, "animation", false);
        }).to(0.3, {
          scale: 1.1
        }, {
          easing: 'sineInOut'
        }).to(0.1, {
          scale: 1
        }).start();
      }
    };
    for (var index = 0; index < 6; index++) {
      _loop2(index);
    }
  },
  // 根据玩家分数来显示筹码的个数
  showcoinNumm: function showcoinNumm(startNode, endNode, amount, types) {
    var coinNum = 0;
    var betAmount = amount / 100;
    if (betAmount == 10) {
      coinNum = 1;
    } else if (betAmount == 50) {
      coinNum = 3;
    } else if (betAmount == 100) {
      coinNum = 5;
    } else if (betAmount == 1000) {
      coinNum = 10;
    } else if (betAmount == 2000) {
      coinNum = 12;
    } else {
      coinNum = Math.ceil(Math.random() * 5);
    }
    for (var i = 0; i < coinNum; i++) {
      this.createEnemy(startNode.getPosition(), endNode, types, true);
    }
  },
  // 从对象池请求对象筹码
  createEnemy: function createEnemy(startNode, endNode, types, isMove, bool) {
    var chouMa = null;
    var coinCtrl = null;
    if (this.coinPool.size() > 0) {
      chouMa = this.coinPool.get();
      this.node_coinAll.addChild(chouMa);
    } else {
      chouMa = cc.instantiate(this.pab_coin);
      this.node_coinAll.addChild(chouMa);
    }
    if (chouMa && !chouMa.getComponent("horseRaceBetCoinCtrl")) {
      coinCtrl = chouMa.addComponent('horseRaceBetCoinCtrl');
    }
    if (chouMa) {
      coinCtrl = chouMa.getComponent("horseRaceBetCoinCtrl");
      chouMa.active = true;
      // 是否移动坐标
      if (isMove) {
        if (coinCtrl && startNode) {
          var pos = startNode;
          chouMa.setPosition(pos);
          coinCtrl.setMovePos(endNode);
        }
      } else {
        if (coinCtrl) coinCtrl.setStaticPos(endNode);
      }
      this.coinAllArr[types].unshift(chouMa);
      if (!bool) {
        for (var i = 1; i < this.coinAllArr.length; i++) {
          if (this.coinAllArr[i].length > 150) {
            for (var k = this.coinAllArr[i].length - 1; k >= 150; k--) {
              this.coinAllArr[i][k].destroy();
              this.coinAllArr[i].splice(k, 1);
            }
          }
        }
      }
    }
  },
  // 创造筹码的对象池
  initCoinPool: function initCoinPool() {
    this.coinPool = new cc.NodePool();
    for (var i = 0; i < 500; i++) {
      var pab_coin = cc.instantiate(this.pab_coin);
      this.coinPool.put(pab_coin);
    }
  },
  // 庄家回收玩家输的筹码
  winorloseCoinAct: function winorloseCoinAct() {
    var _this6 = this;
    var winorlose = this.winorlose;
    var loseArrNum = 0;
    for (var index = 1; index < this.coinAllArr.length; index++) {
      if (index != winorlose) {
        loseArrNum += this.coinAllArr[index].length;
      }
    }
    if (loseArrNum != 0) {
      this.horseRaceAudioCtrl.playGameSound("jbrecover");
    }
    var _loop3 = function _loop3(k) {
      if (k != winorlose) {
        var _loop4 = function _loop4(j) {
          var node = _this6.coinAllArr[k][j];
          cc.tween(node).tag(1).delay((Math.random() * 0.7).toFixed(2)).to(0.5, {
            position: _this6.getRecordNewPos()
          }, {
            easing: "quadIn"
          }).delay(0.8).call(function () {
            node.destroy();
            _this6.coinAllArr[k].splice(j, 1);
          }).start();
        };
        for (var j = _this6.coinAllArr[k].length - 1; j >= 0; j--) {
          _loop4(j);
        }
      }
    };
    for (var k = 1; k < this.coinAllArr.length; k++) {
      _loop3(k);
    }
    this.scheduleOnce(function () {
      this.addCoinNumber(winorlose);
    }, 1.6);
  },
  // 庄家发放玩家赢的筹码
  addCoinNumber: function addCoinNumber(types) {
    if (this.coinAllArr[types].length == 0) {
      return;
    } // 没有玩家下中输赢
    this.horseRaceAudioCtrl.playGameSound("moveToArea");
    var endNode = this.betNodeArr[types];
    var coinNum = 50;
    var startNode = this.getRecordNewPos();
    var isMove = true;
    if (endNode.length < 100) {
      coinNum = 160 - endNode.length;
    }
    for (var i = 0; i < coinNum; i++) {
      this.createEnemy(startNode, endNode, types, isMove, true);
    }
    this.scheduleOnce(function () {
      this.playerWincCionAct(); // 玩家飞金币
    }, 1);
  },
  // 庄家赔赢的玩家金币动作 
  playerWincCionAct: function playerWincCionAct() {
    var _this7 = this;
    //
    var self = this;
    var time = 0;
    var winArr = self.coinAllArr[self.winorlose];
    self.showPlayerGameOver();
    for (var i = 0; i < winArr.length; i++) {
      var node = winArr[i];
      if (i < 20) {
        node.name = "0";
      } else if (i < 40) {
        node.name = "1";
      } else if (i < 60) {
        node.name = "2";
      } else if (i < 80) {
        node.name = "3";
      } else if (i < 100) {
        node.name = "4";
      } else if (i < 120) {
        node.name = "5";
      } else if (i < 140) {
        node.name = "6";
      } else {
        node.name = "-1";
      }
    }
    var _loop5 = function _loop5() {
      var pos = self.allPlayerWinArr[k];
      var ctrl = _this7.getPlayerInfoByUserId(pos);
      if (ctrl || pos == 6) {
        var nodePos = pos == 6 ? cc.v2(-488, -319) : ctrl.setNodePos();
        self.scheduleOnce(function () {
          var _loop7 = function _loop7(_i4) {
            if (winArr[_i4].name != "" && winArr[_i4].name == "" + pos) {
              cc.tween(winArr[_i4]).tag(1).delay(Math.random() * 0.5).to(0.3, {
                position: cc.v2(nodePos)
              }).to(0.01, {
                scale: 0
              }).call(function () {
                if (winArr[_i4]) {
                  winArr[_i4].destroy();
                  winArr.splice(_i4, 1);
                }
              }).start();
            }
          };
          for (var _i4 = winArr.length - 1; _i4 >= 0; _i4--) {
            _loop7(_i4);
          }
        }, time);
      }
      time += 0.2;
    };
    for (var k = 0; k < self.allPlayerWinArr.length; k++) {
      _loop5();
    }
    self.scheduleOnce(function () {
      self.horseRaceAudioCtrl.playGameSound("shouCoin");
      var _loop6 = function _loop6() {
        var node = winArr[_i3];
        if (node.name != "") {
          cc.tween(node).tag(1).delay((Math.random() / 3).toFixed(2)).to(0.3, {
            position: cc.v2(615, -319)
          }).call(function () {
            node.destroy();
          }).start();
        }
      };
      for (var _i3 = 0; _i3 < winArr.length; _i3++) {
        _loop6();
      }
    }, (self.allPlayerWinArr.length + 1) * 0.2);
  },
  // 显示玩家结算后的金币
  showPlayerGameOver: function showPlayerGameOver() {
    for (var i = 0; i < this.infos.length; i++) {
      var playerid = this.infos[i].pid;
      var score = this.infos[i].score;
      var pos = this.infos[i].pos;
      var coin = this.infos[i].coin;
      var ctrl = this.getPlayerInfoByUserId(pos);
      if (pos == 6) {
        this.myNodeCtrl.showPlayWinCion(coin, score);
      } else {
        if (ctrl) {
          ctrl.showPlayWinCion(coin, score);
        }
      }
    }
  },
  //根据用户ID获取用户控制脚本
  getPlayerInfoByUserId: function getPlayerInfoByUserId(pos) {
    var playerInfo = null;
    for (var i = 0; i < this.userArryNode.length; i++) {
      var userNode = this.userArryNode[i];
      if (userNode.name != '') {
        var userInfoCtrl = userNode.getComponent('horseRacePlayerCtrl');
        if (userInfoCtrl && userInfoCtrl.pos === pos) {
          playerInfo = userInfoCtrl;
          break;
        }
      }
    }
    return playerInfo;
  },
  //根据用户座位号来获取node
  getPlayNode: function getPlayNode(seatid) {
    var playerNode = null;
    for (var i = 0; i < this.userArryNode.length; i++) {
      var userNode = this.userArryNode[i];
      if (userNode.name != '') {
        var userInfoCtrl = userNode.getComponent('horseRacePlayerCtrl');
        if (userInfoCtrl && userInfoCtrl.curSeat === seatid) {
          playerNode = userNode;
          break;
        }
      }
    }
    return playerNode;
  },
  /**
   * 根据 playerid 来找脚本
   * @param {uint64} playerid 
   * @returns {cc.Node}
   */
  setNodeCtrl: function setNodeCtrl(playerid) {
    var playerNode = null;
    for (var i = 0; i < this.userArryNode.length; i++) {
      var userNode = this.userArryNode[i];
      if (userNode.name != '') {
        var userInfoCtrl = userNode.getComponent('horseRacePlayerCtrl');
        if (userInfoCtrl && userInfoCtrl.playerid === playerid) {
          playerNode = userInfoCtrl;
          break;
        }
      }
    }
    return playerNode;
  },
  //聊天广播
  chatnotify: function chatnotify(notify) {
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
      if (playScript) playScript.face(notify);
    } else {
      var targetNodeArr = [];
      var senderCtrl = this.getPlayerInfoByUserId(sender);
      if (!senderCtrl || !senderCtrl.node) {
        return;
      } else {
        senderCtrl.setVipCoin(senderAfter);
        if (this.my_playerid == senderCtrl.playerid) {
          this.myNodeCtrl.shePlayCion(senderAfter);
        }
      }
      if (target == -1) {
        for (var i = 0; i < this.userArryNode.length; i++) {
          var userNode = this.userArryNode[i];
          var userInfoCtrl = userNode.getComponent('horseRacePlayerCtrl');
          if (userInfoCtrl && userInfoCtrl !== senderCtrl) {
            targetNodeArr.push(userNode);
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
  },
  // 游戏开始
  startgamenotify: function startgamenotify(notify) {
    this.showRuntime(10000);
    this.horseRaceAudioCtrl.playGameMusic("bgm");
    this.repeatPreviousRound();
    this.betStatus = true;
    this.spr_TrackTerminus.node.active = false;
    this.nodeTrack.x = 0;
    this.spr_Track1.x = 0;
    this.spr_Track2.x = 940;
    this.lab_palyersAll.string = notify.onlinenum;
    this.node_coinAll.removeAllChildren();
    for (var index = 1; index < this.coinAllArr.length; index++) {
      this.coinAllArr[index] = [];
      this.lab_OddsNum[index].string = "Odds " + (notify.betconf[index - 1] / 10).toFixed(1);
      cc.tween(this.lab_OddsNum[index].node).tag(1).to(0.3, {
        scale: 1.1
      }, {
        easing: 'sineInOut'
      }).to(0.1, {
        scale: 1
      }).start();
    }
  },
  // 游戏结束
  gameovernotify: function gameovernotify(notify) {
    this.infos = notify.infos;
    this.allPlayerWinArr = [];
    if (Array.isArray(this.infos)) {
      this.infos = this.infos.sort(this.compare("pos"));
    }
    ;
    for (var i = 0; i < this.infos.length; i++) {
      var playerid = this.infos[i].pid;
      var score = this.infos[i].score;
      var pos = this.infos[i].pos;
      if (score > 0) {
        for (var _i5 = 0; _i5 < this.userArryNode.length; _i5++) {
          var userNode = this.userArryNode[_i5];
          if (userNode.name != '') {
            var userInfoCtrl = userNode.getComponent('horseRacePlayerCtrl');
            if (userInfoCtrl && userInfoCtrl.playerid == playerid) {
              this.allPlayerWinArr.push(pos);
              userInfoCtrl.setPlayerWinCion(score); // 设置每个VIP玩家是否赢
            }
          }
        }
      }
    }

    ;
    var _score = this.myScore;
    if (this.myScore > 0) {
      this.allPlayerWinArr.push(6);
      this.myScore = 0;
      var UserInfo = {
        coin: this.myCoin,
        score: _score,
        pid: this.my_playerid,
        pos: 6
      };
      this.infos.push(UserInfo);
    }
    this.endGameAim(_score);
  },
  // 显示桌上下注总筹码
  showBetScore: function showBetScore(betscore, str) {
    if (str == "me") {
      for (var index = 0; index < betscore.length; index++) {
        this.myBetCoin[index + 1] = betscore[index];
        this.lab_betSelf[index + 1].string = this.myBetCoin[index + 1] / 100;
        if (this.myBetCoin[index + 1] > 0) {
          this.lab_betSelf[index + 1].node.color = new cc.color(255, 255, 0, 255);
        }
      }
    } else {
      var betscoreArr = [];
      for (var _index6 = 0; _index6 < betscore.length; _index6++) {
        this.allBetCoin[_index6 + 1] = betscore[_index6];
        this.lab_betAll[_index6 + 1].string = this.allBetCoin[_index6 + 1] / 100;
        betscoreArr[_index6] = betscore[_index6];
      }
      this.node_coinAll.removeAllChildren();
      for (var i = 0; i < 6; i++) {
        // 重连进来显示桌上金币
        var coinNum = 300;
        var type = i + 1;
        var endNode = this.betNodeArr[i + 1];
        if (betscoreArr[i] > 0) {
          for (var _i6 = 0; _i6 < coinNum; _i6++) {
            this.createEnemy(null, endNode, type, false);
          }
        }
      }
    }
  },
  // 上下vip座位通知 
  joinvipposnotify: function joinvipposnotify(notify) {
    var pos = notify.userinfo.pos;
    var playerid = notify.userinfo.playerid;
    if (pos == -1) {
      // 下VIP
      for (var i = 0; i < this.userArryNode.length; i++) {
        var userNode = this.userArryNode[i];
        if (userNode.name != '') {
          var userInfoCtrl = userNode.getComponent('horseRacePlayerCtrl');
          if (userInfoCtrl && userInfoCtrl.playerid == playerid) {
            userNode.destroy();
            this.userArryNode.splice(i, 1);
          }
        }
      }
    } else {
      // 换位置
      var ctrl = this.setNodeCtrl(playerid);
      if (ctrl) {
        ctrl.setUserData(notify.userinfo);
      } else {
        var pab_player = cc.instantiate(this.pab_player);
        var PlayerCtrl = pab_player.getComponent("horseRacePlayerCtrl");
        PlayerCtrl.setUserData(notify.userinfo);
        this.userArryNode.push(pab_player);
        this.node_playersSeat.addChild(pab_player);
      }
    }
  },
  // 结束下注通知
  endbetnotify: function endbetnotify(notify) {
    this.betStatus = false;
    this.node_djs.active = false;
    this.btn_repeatBet.node.active = false;
    this.ske_start.node.active = true;
    this.horseRaceAudioCtrl.playGameSound("go");
    var spine = this.skeleDataMap.get("gamestart");
    this.ske_start.skeletonData = spine;
    this.ske_start.addAnimation(0, "animation", false);
    // this.ske_start.setCompleteListener((trackEntry, loopCount) => {
    //     var name = trackEntry.animation.name;
    //     if (name == "animation") {
    //     }
    // })
    this.repeatBetArr[0] = this.myBetCoin[1];
    this.repeatBetArr[1] = this.myBetCoin[2];
    this.repeatBetArr[2] = this.myBetCoin[3];
    this.repeatBetArr[3] = this.myBetCoin[4];
    this.repeatBetArr[4] = this.myBetCoin[5];
    this.repeatBetArr[5] = this.myBetCoin[6];
    this.winorlose = notify.winorlose;
    this.random = notify.rand;
    Math.seed = this.random;
    Math.seededRandom = function (max, min) {
      max = max || 1;
      min = min || 0;
      Math.seed = (Math.seed * 9301 + 49297) % 233280;
      var rnd = Math.seed / 233280.0;
      return Math.floor(min + rnd * (max - min));
    };
    var kind = Math.seededRandom(10, 0) + 1;
    this.getHorseSpeedArr(this.horseSpeedData[kind], this.random);
  },
  //移动赛道
  moveTrack: function moveTrack(time) {
    var _this8 = this;
    //time为跑道移动速率
    cc.tween(this.nodeTrack).tag(1).repeatForever(cc.tween().tag(1).by(time, {
      position: cc.v2(-940, 0)
    }).call(function () {
      _this8.spr_Track1.x < _this8.spr_Track2.x ? _this8.spr_Track1.x = _this8.spr_Track1.x + 1880 : _this8.spr_Track2.x = _this8.spr_Track2.x + 1880;
    })).start();
  },
  //移动领先马匹标识
  moveLeaderNum: function moveLeaderNum(time, id) {
    var totalDistance = 896;
    this.spr_LeaderNum.x = -448;
    if (!id) {
      return;
    }
    if (time != this.totalTime) {
      this.spr_LeaderNum.x += totalDistance / this.totalTime * time;
      time = this.totalTime - time;
    }
    for (var index = 0; index < 6; index++) {
      this.spr_LeaderNum.children[index].active = false;
    }
    this.spr_LeaderNum.children[id - 1].active = true;
    cc.tween(this.spr_LeaderNum).tag(1).to(time, {
      position: cc.v2(448, -4)
    }).start();
  },
  //移动记录球
  moveHistoryBall: function moveHistoryBall(id, callback) {
    var _this9 = this;
    this.horseRaceAudioCtrl.playGameSound("moveRecord");
    this.recordBall = cc.instantiate(this.record_ball);
    var recordBallCtrl = this.recordBall.getComponent("recordBallCtrl");
    this.recordBall.parent = this.historyNode;
    var pos = cc.v2(-292.459, 333);
    this.recordBall.y = 100;
    recordBallCtrl.setID(id);
    cc.tween(this.recordBall).tag(1).to(1, {
      position: cc.v2(pos.x + (this.historyLayout.childrenCount == 12 && this.historyLayout.childrenCount > 0 ? this.historyLayout.childrenCount - 1 : this.historyLayout.childrenCount) * 48, pos.y)
    }).delay(0.1).call(function () {
      _this9.recordBall.destroy();
      _this9.updateHistory(id);
      _this9.winorloseCoinAct();
      _this9.curRoundAddCoinFinish();
      _this9.myBetCoin = [null, 0, 0, 0, 0, 0, 0];
      _this9.allBetCoin = [null, 0, 0, 0, 0, 0, 0];
      for (var index = 1; index < _this9.lab_betSelf.length; index++) {
        _this9.lab_betSelf[index].node.color = new cc.color(255, 255, 255, 255);
        _this9.lab_betSelf[index].string = '0';
        _this9.lab_betAll[index].string = '0';
      }
      if (callback) {
        callback();
      }
    }).start();
  },
  curRoundAddCoinFinish: function curRoundAddCoinFinish() {
    var betCoin = 0;
    for (var index = 1; index < 7; index++) {
      betCoin += this.myBetCoin[index];
    }
    ;
    if (cc.isValid(this)) {
      var minLimit = this.betAmountList[0] || 0;
      minLimit *= 100;
      CommonFun.getInstance().gameShowSecondRecharge(minLimit, betCoin);
      CommonFun.getInstance().showWithdrawToastInGame();
    }
  },
  getRecordNewPos: function getRecordNewPos() {
    var pos = cc.v2(-292.459, 333);
    var pos1 = cc.v2(pos.x + (this.historyLayout.childrenCount > 0 ? this.historyLayout.childrenCount - 1 : this.historyLayout.childrenCount) * 48, pos.y);
    pos1.x += 48;
    return pos1;
  },
  //设置历史记录
  setHistory: function setHistory(notify) {
    var list = notify;
    var len = list.length;
    if (len <= 12) {
      for (var i = 0; i < len; i++) {
        this.historiesScoreArr[i] = list[i].winrolose;
      }
    } else if (len > 12) {
      for (var _i7 = 0; _i7 < 12; _i7++) {
        this.historiesScoreArr[_i7] = list[_i7].winrolose;
      }
    }
    this.historyLayout.removeAllChildren();
    LoggerUtil.getInstance().log("this.historiesScoreArr:", this.historiesScoreArr);
    this.historiesScoreArr = this.historiesScoreArr.reverse();
    LoggerUtil.getInstance().log("转置之后的this.historiesScoreArr:", this.historiesScoreArr);
    for (var _i8 = 0; _i8 < this.historiesScoreArr.length; _i8++) {
      var recordBall = cc.instantiate(this.record_ball);
      var recordBallCtrl = recordBall.getComponent("recordBallCtrl");
      this.historyLayout.addChild(recordBall);
      recordBallCtrl.setID(this.historiesScoreArr[_i8]);
      this.historyLayout.children[_i8].getChildByName("NEW").active = false;
      if (_i8 == this.historiesScoreArr.length - 1) {
        this.historyLayout.children[_i8].getChildByName("NEW").active = true;
      }
    }
  },
  // 更新历史记录
  updateHistory: function updateHistory(id) {
    if (this.historyLayout.childrenCount < 12) {
      this.historyLayout.removeAllChildren();
      for (var i = 0; i < this.historiesScoreArr.length; i++) {
        var _recordBall = cc.instantiate(this.record_ball);
        var _recordBallCtrl = _recordBall.getComponent("recordBallCtrl");
        _recordBallCtrl.setID(this.historiesScoreArr[i]);
        this.historyLayout.addChild(_recordBall);
        this.historyLayout.children[i].getChildByName("NEW").active = false;
        if (i == this.historiesScoreArr.length - 1) {
          this.historyLayout.children[i].getChildByName("NEW").active = true;
        }
      }
    }
    this.checkLayout(this.historyLayout); //确保layout中的节点永远 <= 9
    if (this.historiesScoreArr.length == 0 || this.historiesScoreArr.length < 12) {
      this.historiesScoreArr.push(id);
    } else {
      LoggerUtil.getInstance().log("历史记录数组", this.historiesScoreArr);
      this.historiesScoreArr.shift();
      this.historyLayout.removeChild(this.historyLayout.children[0], true);
      LoggerUtil.getInstance().log("历史记录数组", this.historiesScoreArr);
      this.historiesScoreArr.push(id);
    }
    var recordBall = cc.instantiate(this.record_ball);
    var recordBallCtrl = recordBall.getComponent("recordBallCtrl");
    recordBallCtrl.setID(id);
    this.historyLayout.addChild(recordBall);
    for (var _i9 = 0; _i9 < this.historyLayout.childrenCount; _i9++) {
      this.historyLayout.children[_i9].getChildByName("NEW").active = false;
      if (_i9 == this.historyLayout.childrenCount - 1) {
        this.historyLayout.children[_i9].getChildByName("NEW").active = true;
      }
    }
  },
  //检测记录数量
  checkLayout: function checkLayout(node) {
    if (node.childrenCount > 12) {
      node.removeChild(node.children[0], true);
      this.checkLayout(node);
    } else {
      return;
    }
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
  },
  //设置马匹数据
  setHorseSpeedData: function setHorseSpeedData(TimeTemp) {
    var _this10 = this;
    // LoggerUtil.getInstance().warn("设置马匹数据", TimeTemp,this.horseSpeedArr);
    if (TimeTemp < 0 || Number.isNaN(TimeTemp)) {
      TimeTemp = null;
    }
    this.moveTrack(1);
    var speedConstant = 0.03;
    var speedX = this.averageSpeed * speedConstant;
    var horseTime = TimeTemp ? TimeTemp : 0;
    if (TimeTemp) {
      this.moveLeaderNum(TimeTemp, this.winorlose);
      for (var index = 1; index < this.horseAnimNodeArr.length; index++) {
        this.horseAnimNodeArr[index].x = this.originX;
        if (TimeTemp > 6) {
          this.horseAnimNodeArr[index].x += this.averageSpeed * (this.horseSpeedArr[index][2] * (TimeTemp - 10));
          this.horseAnimNodeArr[index].x += this.averageSpeed * this.horseSpeedArr[index][1] * 5;
          this.horseAnimNodeArr[index].x += this.averageSpeed * this.horseSpeedArr[index][0] * 5;
        } else if (TimeTemp > 3) {
          this.horseAnimNodeArr[index].x += this.averageSpeed * this.horseSpeedArr[index][1] * (TimeTemp - 5);
          this.horseAnimNodeArr[index].x += this.averageSpeed * this.horseSpeedArr[index][0] * 5;
        } else {
          this.horseAnimNodeArr[index].x += this.averageSpeed * this.horseSpeedArr[index][0] * TimeTemp;
        }
        // this.scheduleOnce(function () {
        var ske_horse = this.horseAnimNodeArr[index].getComponent(sp.Skeleton);
        var spine = this.skeleDataMap.get("horse_" + index);
        ske_horse.node.active = true;
        ske_horse.skeletonData = spine;
        ske_horse.addAnimation(0, "animation", true);
        // }, Math.random())
      }
    } else {
      this.moveLeaderNum(this.totalTime, this.winorlose);
      var _loop8 = function _loop8(_index7) {
        _this10.horseAnimNodeArr[_index7].x = _this10.originX;
        _this10.scheduleOnce(function () {
          var ske_horse = this.horseAnimNodeArr[_index7].getComponent(sp.Skeleton);
          var spine = this.skeleDataMap.get("horse_" + _index7);
          ske_horse.node.active = true;
          ske_horse.paused = false;
          ske_horse.skeletonData = spine;
          ske_horse.addAnimation(0, "animation", true);
        }, Math.random());
      };
      for (var _index7 = 1; _index7 < this.horseAnimNodeArr.length; _index7++) {
        _loop8(_index7);
      }
    }
    this.horsesLisenerCallBack = function () {
      for (var _index8 = 1; _index8 < 7; _index8++) {
        // cc.tween(this.horseAnimNodeArr[index]).by(5, {
        //         position: cc.v2((speedX * this.horseSpeedData[index][0]) * 5, 0)
        //     }).by(5, {
        //         position: cc.v2((speedX * this.horseSpeedData[index][1]) * 5, 0)
        //     })
        //     .by(5, {
        //         position: cc.v2((speedX * this.horseSpeedData[index][2]) * 5, 0)
        //     }).start();
        if (horseTime <= 3) {
          this.horseAnimNodeArr[_index8].x += speedX * this.horseSpeedArr[_index8][0];
        } else if (horseTime > 3 && horseTime <= 6) {
          this.horseAnimNodeArr[_index8].x += speedX * this.horseSpeedArr[_index8][1];
        } else {
          this.horseAnimNodeArr[_index8].x += speedX * this.horseSpeedArr[_index8][2];
        }
      }
      var leaderNum = 1;
      var leaderHorseX = this.horseAnimNodeArr[1].x;
      for (var _index9 = 2; _index9 < this.horseAnimNodeArr.length; _index9++) {
        var node = this.horseAnimNodeArr[_index9];
        if (node.x > leaderHorseX) {
          leaderHorseX = node.x;
          leaderNum = _index9;
        }
      }
      this.leaderChange(leaderNum);
      if (leaderHorseX >= this.terminusX) {
        this.showTerminus();
      }
      horseTime += speedConstant;
    };
    var type = 1;
    this.playAudioCallBack = function () {
      if (type == 1) {
        this.horseRaceAudioCtrl.playGameSound("horseshoe1");
        for (var _index10 = 0; _index10 < 2; _index10++) {
          this.scheduleOnce(function () {
            this.horseRaceAudioCtrl.playGameSound("horseshoe1");
          }, 0.5);
        }
      } else {
        this.horseRaceAudioCtrl.playGameSound("horseshoe");
        for (var _index11 = 0; _index11 < 2; _index11++) {
          this.scheduleOnce(function () {
            this.horseRaceAudioCtrl.playGameSound("horseshoe");
          }, 0.5);
        }
        type = 0;
      }
      type++;
    };
    this.schedule(this.playAudioCallBack, 1);
    this.schedule(this.horsesLisenerCallBack, speedConstant);
  },
  /**
   * 
   * @param {*} arr 马匹速度数据数组
   * @param {*} seed 随机数种子
   * @param {*} TimeTemp 
   */
  getHorseSpeedArr: function getHorseSpeedArr(arr, seed, TimeTemp) {
    var arrTemp = arr.slice(0); //数组的深拷贝
    this.horseSpeedArr = [null];
    Math.seed = seed;
    Math.seededRandom = function (max, min) {
      max = max || 1;
      min = min || 0;
      Math.seed = (Math.seed * 9301 + 49297) % 233280;
      var rnd = Math.seed / 233280.0;
      return Math.floor(min + rnd * (max - min));
    };
    var maxArr = arrTemp[1];
    var maxSpeed = arrTemp[1][0] + arrTemp[1][1] + arrTemp[1][2];
    var maxIndex = 1;
    for (var index = 1; index < arrTemp.length; index++) {
      var temp = arrTemp[index][0] + arrTemp[index][1] + arrTemp[index][2];
      if (temp > maxSpeed) {
        maxSpeed = temp;
        maxArr = arrTemp[index];
        maxIndex = index;
      }
    }
    arrTemp.splice(maxIndex, 1);
    while (arrTemp.length > 1) {
      var i = Math.seededRandom(arrTemp.length, 1);
      this.horseSpeedArr.push(arrTemp[i]);
      arrTemp.splice(i, 1);
    }

    // this.originX = this.terminusX - (maxArr[0]*speedX*5 + maxArr[1]*speedX*5 + maxArr[2]*speedX*5)
    this.horseSpeedArr.splice(this.winorlose, 0, maxArr);
    if (typeof TimeTemp == 'number') {
      this.setHorseSpeedData(Number(TimeTemp.toFixed(3)));
    } else {
      this.setHorseSpeedData(TimeTemp);
    }
  },
  showTerminus: function showTerminus() {
    var _this11 = this;
    this.spr_TrackTerminus.node.active = true;
    this.unschedule(this.horsesLisenerCallBack);
    this.unschedule(this.playAudioCallBack);
    this.unscheduleAllCallbacks();
    // this.horseRaceAudioCtrl.stopGameEffectByName();
    this.horseRaceAudioCtrl.playGameSound("kacha");
    cc.Tween.stopAllByTarget(this.nodeTrack);
    for (var index = 1; index < this.horseAnimNodeArr.length; index++) {
      var ske_horse = this.horseAnimNodeArr[index].getComponent(sp.Skeleton);
      ske_horse.paused = true;
    }
    var _loop9 = function _loop9() {
      var ske_horse = _this11.horseAnimNodeArr[_index12].getComponent(sp.Skeleton);
      cc.tween(_this11.horseAnimNodeArr[_index12]).tag(1).delay(1.5).call(function () {
        ske_horse.paused = false;
        _this11.horseRaceAudioCtrl.playGameSound("out");
      }).to(1, {
        position: cc.v2(1000, _this11.horseAnimNodeArr[_index12].y)
      }).call(function () {
        // this.horseRaceAudioCtrl.stopGameEffectByName();
      }).start();
    };
    for (var _index12 = 1; _index12 < 7; _index12++) {
      _loop9();
    }
    this.scheduleOnce(function () {
      this.leaderChange(0);
      for (var _index13 = 1; _index13 < this.horseAnimNodeArr.length; _index13++) {
        cc.Tween.stopAllByTarget(this.horseAnimNodeArr[_index13]);
        var _ske_horse2 = this.horseAnimNodeArr[_index13].getComponent(sp.Skeleton);
        _ske_horse2.node.active = false;
        _ske_horse2.skeletonData = null;
        this.horseAnimNodeArr[_index13].x = this.originX;
      }
    }, 2.5);
  },
  eventShow: function eventShow() {
    cc.game.on(cc.game.EVENT_SHOW, function () {
      LoggerUtil.getInstance().log("游戏切回到前台");
      this.unscheduleAllCallbacks();
      // cc.Tween.stopAll();
      cc.Tween.stopAllByTag(1);
      GameServerManager.hideFilterMag(2, function () {
        GameServerManager.send("gameservice.joinroom", "JoinRoomReq", {});
      });
    }, this);
  },
  eventHide: function eventHide() {
    cc.game.on(cc.game.EVENT_HIDE, function () {
      LoggerUtil.getInstance().log("游戏切入到后台");
      GameServerManager.hideFilterMag(1);
    }, this);
  },
  outgamenotify: function outgamenotify(notify) {
    if (notify && notify.userinfo && this.myNodeCtrl) {
      var playerid = notify.userinfo.playerid;
      var pos = notify.userinfo.pos;
      if (playerid == this.myNodeCtrl.playerid) {
        SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.HORSERACE, SceneManager.getInstance().sceneType.LOBBY);
      } else {
        if (pos != -1) {
          for (var i = 0; i < this.userArryNode.length; i++) {
            var userNode = this.userArryNode[i];
            if (userNode.name != '') {
              var userInfoCtrl = userNode.getComponent('horseRacePlayerCtrl');
              if (userInfoCtrl && userInfoCtrl.pos === pos) {
                userNode.destroy();
                this.userArryNode.splice(i, 1);
                break;
              }
            }
          }
        }
      }
    }
    ;
  },
  // 游戏自己结算
  playerwinloseinfonotify: function playerwinloseinfonotify(notify) {
    this.myScore = notify.score;
    this.myCoin = notify.coin;
    if (this.myNodeCtrl) {
      this.myNodeCtrl.shePlayCion(this.myCoin);
    }
  },
  // 获取普通玩家列表
  playerlist: function playerlist(notify) {
    this.lab_palyersAll.string = notify.allcount;
    var node = this.node.getChildByName("horseRacePlayerList");
    if (node) {
      var ctrl = node.getComponent("horseRacePlayerListCtrl");
      ctrl.setPlayerDate(notify);
    } else {
      var pab_playersList = cc.instantiate(this.pab_playersList);
      var _ctrl3 = pab_playersList.getComponent("horseRacePlayerListCtrl");
      _ctrl3.setPlayerDate(notify);
      this.node.addChild(pab_playersList);
    }
  },
  compare: function compare(property) {
    return function (a, b) {
      var value1 = a[property];
      var value2 = b[property];
      return value1 - value2;
    };
  },
  // 在VIP列表中找自己
  getVIPistMe: function getVIPistMe() {
    var playerNode = null;
    for (var i = 0; i < this.userArryNode.length; i++) {
      var userNode = this.userArryNode[i];
      if (userNode.name != '') {
        var userInfoCtrl = userNode.getComponent('horseRacePlayerCtrl');
        if (userInfoCtrl && userInfoCtrl.playerid === this.myNodeCtrl.playerid) {
          playerNode = userInfoCtrl.pos;
          break;
        }
      }
    }
    return playerNode;
  },
  setMyVIPPos: function setMyVIPPos() {
    var ctrl = GlobalCfg.ACT_SCENE_CTRL.setNodeCtrl(GlobalCfg.ACT_SCENE_CTRL.my_playerid);
    if (ctrl) {
      return ctrl.pos;
    }
    return null;
  },
  // 重复上一轮的下注
  repeatPreviousRound: function repeatPreviousRound(str) {
    var _this12 = this;
    var betCoinAll = this.repeatBetArr[0] + this.repeatBetArr[1] + this.repeatBetArr[2] + this.repeatBetArr[3] + this.repeatBetArr[4] + this.repeatBetArr[5];
    if (str == "bet") {
      if (betCoinAll > GlobalCfg.USER_DATAS.userDiamond || GlobalCfg.USER_DATAS.userDiamond == 0) {
        if (GlobalCfg.IS_CLUB_MODE == 1) {
          //代理模式不跳转商城
          CommonFun.getInstance().showMsgBox('Insufficient cash', "YES", function () {}, false);
        } else {
          CommonFun.getInstance().showMsgBox(this.tipsLabel[5], "SHOP", function () {
            if (_this12.paymentSwitch) {
              CommonFun.getInstance().showSmallAddCash();
            }
          }, false);
        }
      } else {
        for (var i = 1; i < this.myBetCoin.length; i++) {
          betCoinAll += this.myBetCoin[i];
        }
        if (betCoinAll > 2000000) {
          CommonFun.getInstance().showTips("Upper limit of betting amount!");
          return;
        } else {
          this.sendReqCtrl.callReq(this.repeatBetArr[0], 1);
          this.sendReqCtrl.callReq(this.repeatBetArr[1], 2);
          this.sendReqCtrl.callReq(this.repeatBetArr[2], 3);
          this.sendReqCtrl.callReq(this.repeatBetArr[3], 4);
          this.sendReqCtrl.callReq(this.repeatBetArr[4], 5);
          this.sendReqCtrl.callReq(this.repeatBetArr[5], 6);
          this.repeatBetArr[0] = 0;
          this.repeatBetArr[1] = 0;
          this.repeatBetArr[2] = 0;
          this.repeatBetArr[3] = 0;
          this.repeatBetArr[4] = 0;
          this.repeatBetArr[5] = 0;
        }
        this.btn_repeatBet.node.active = false;
      }
    } else {
      if (betCoinAll > 0) {
        this.btn_repeatBet.node.active = true;
      } else {
        this.btn_repeatBet.node.active = false;
      }
    }
  },
  // 点击上VIP按钮
  clickVIPuP: function clickVIPuP(pos) {
    var _this13 = this;
    var myPos = this.getVIPistMe();
    if (myPos == pos) {
      // 自己下VIP
      CommonFun.getInstance().showMsgBox("Do you want to exit the VIP seat?", "YES_NO", function () {
        _this13.sendReqCtrl.JoinVipPosReq(-1);
      }, false);
      return;
    }
    ;
    var ctrl = this.getPlayerInfoByUserId(pos);
    if (ctrl) {
      CommonFun.getInstance().showTips("This seat already has a player, Please select another empty seat!");
      return;
    }
    ;
    if (CommonFun.getInstance().isOpenVipModule()) {
      if (GlobalCfg.USER_DATAS.userVip.level == 0) {
        CommonFun.getInstance().showFirstRecharge();
        return;
      }
      ;
      var isCanSitVipSeat = CommonFun.getInstance().isCanSitVipSeatByLevel(GlobalCfg.USER_DATAS.userVip.level);
      if (isCanSitVipSeat) {
        this.sendReqCtrl.JoinVipPosReq(pos);
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
    this.sendReqCtrl.JoinVipPosReq(pos);
  },
  //游戏结束输赢动画
  endGameAim: function endGameAim(selfScore) {
    var _this14 = this;
    if (selfScore === void 0) {
      selfScore = 0;
    }
    this.horseRaceAudioCtrl.playGameSound("winPlay");
    var winType = this.winorlose;
    var spine = this.skeleDataMap.get('winner');
    this.ske_endWin.node.active = true;
    this.ske_endWin.skeletonData = spine;
    this.ske_endWin.setCompleteListener(function (trackEntry, loopCount) {
      var name = trackEntry.animation.name;
      if (name == "star") {
        _this14.ske_endWin.addAnimation(0, 'loop', true);
        _this14.ske_endWin.setAnimation(0, 'out', false, 4);
      } else if (name == "loop") {} else if (name == "out") {
        _this14.moveHistoryBall(winType, function () {
          _this14.ske_endWin.skeletonData = null;
          _this14.ske_endWin.node.active = false;
        });
      }
    });
    this.ske_endWin.setStartListener(function (trackEntry, loopCount) {
      var name = trackEntry.animation.name;
      if (name == "star") {
        for (var index = 0; index < 6; index++) {
          _this14.sprWonHorse.children[index].active = false;
          if (index == winType - 1) {
            _this14.sprWonHorse.children[winType - 1].active = true;
            _this14.labWonHorse.node.active = true;
            _this14.labWonHorse.string = 'Horse ' + winType;
          }
        }
        if (selfScore > 0) {
          _this14.labYouWon.node.active = true;
          _this14.labIndia.node.active = true;
          _this14.labIndia.string = selfScore / 100;
        } else {
          _this14.labYouWon.node.active = false;
          _this14.labIndia.node.active = false;
        }
      } else if (name == "out") {
        cc.tween(_this14.labYouWon.node).tag(1).to(1, {
          opacity: 0
        }).call(function () {
          _this14.labYouWon.node.opacity = 255;
        }).start();
        cc.tween(_this14.labIndia.node).tag(1).to(1, {
          opacity: 0
        }).call(function () {
          _this14.labIndia.node.opacity = 255;
        }).start();
        cc.tween(_this14.sprWonHorse.children[winType - 1]).tag(1).to(1, {
          opacity: 0
        }).call(function () {
          _this14.sprWonHorse.children[winType - 1].opacity = 255;
        }).start();
        cc.tween(_this14.labWonHorse.node).tag(1).to(1, {
          opacity: 0
        }).call(function () {
          _this14.labWonHorse.node.opacity = 255;
        }).start();
      }
    });
    this.ske_endWin.addAnimation(0, 'star', false);
  },
  ctor: function ctor() {
    this.userArryNode = []; // 存放玩家的数组(Vip)
    this.userBtnCion = 100; // 玩家默认下注的金额
    // this.totalDistance = 900;
    this.originX = -650;
    this.terminusX = 310;
    this.totalTime = 10;
    this.leaderNum = 8;
    this.averageSpeed = 96;
    this.historiesScoreArr = [];
    this.coinAllArr = [null, [], [], [], [], [], []]; // 存放下注筹码
    this.myBetCoin = [null, 0, 0, 0, 0, 0, 0]; //自己下注的金币
    this.allBetCoin = [null, 0, 0, 0, 0, 0, 0]; //总下注的金币
    this.repeatBetArr = []; // 存放重复下注的数据
    this.betStatus = true; //自己是否可以点击下注
    this.limitBetPlayAim = true; //限制普通玩家吸住播放音效    
    this.paymentSwitch = false;
    this.horseSpeedData = [null, [null, [0.75, 0.8, 1.1], [0.97, 1, 1.1], [0.85, 1, 1.2], [0.9, 1, 1.2], [1.2, 1.2, 1.2], [1.3, 1.4, 1.2]], [null, [0.9, 1, 1], [0.9, 1.3, 1.1], [1, 1.1, 1], [1.2, 1, 1.4], [1.3, 1.3, 1.4], [1.5, 1.2, 0.9]], [null, [0.8, 1.4, 1.2], [0.9, 1, 1], [1.2, 1.1, 1.3], [1.1, 1.4, 1.4], [1.2, 1.3, 1], [1.3, 1.1, 1.1]], [null, [0.7, 1.2, 1.4], [0.9, 1.3, 1], [1, 1.5, 1.4], [1.1, 1, 1], [1.2, 1.2, 1.1], [1.4, 1, 1.1]], [null, [0.8, 1.2, 1.1], [1.1, 1.4, 1.4], [1.1, 1.3, 1.2], [1.2, 1.1, 1.3], [1.3, 1.2, 1.2], [1.3, 1.2, 1.1]], [null, [0.9, 1.4, 1.3], [1, 1.2, 1.2], [1.1, 1.1, 1], [1.2, 1.1, 1], [1.3, 0.9, 1.1], [1.3, 1.1, 0.9]], [null, [0.8, 1.1, 1], [1.1, 1.5, 1.3], [1, 1, 1], [1.2, 1.2, 1.2], [1.3, 1.2, 1.1], [1.4, 1, 1.4]], [null, [0.8, 1, 1.1], [1, 1.5, 0.9], [1.2, 1, 1.1], [1.3, 1.2, 1], [1.4, 1.2, 1.3], [1.5, 0.9, 1]], [null, [0.7, 1.3, 1], [0.8, 1.1, 1], [1, 1.3, 1.2], [1.1, 1.2, 1.5], [1.2, 1.1, 1.1], [1.3, 0.9, 1.1]], [null, [0.8, 1.2, 1.1], [1, 1, 1], [1.1, 1.3, 1.1], [1.2, 1.1, 1.3], [1.3, 1.1, 1.4], [1.4, 1, 1]]]; //马匹速度配置表

    this.tipsLabel = ["Your game is not finished yet . If you wish to exit the table , you will lose your money . Do you want to leave table?",
    // 退出游戏
    "Sorry, there are not enough gold coins.",
    //金币不足请充值
    "In the game, unable to exit",
    // 游戏中无法退出
    "Sorry, your gold coin can't be played in this game",
    // 对不起，您的金币无法在本场内游戏）
    "Can't bet temporarily",
    //请选择下注的范围
    "Your cash is insufficient, Please recharge in time!"];
    this.isGameEndStatus = false;
    this.showBetSpineTimeInterval = 15; // 显示下注动画的时间间隔
    this.showBetSpineTime = 0;
  }
});

cc._RF.pop();