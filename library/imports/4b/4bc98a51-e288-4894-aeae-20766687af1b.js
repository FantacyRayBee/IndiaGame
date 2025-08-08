"use strict";
cc._RF.push(module, '4bc98pR4ohIlK6uIHZmh68b', 'zeusSceneCtrl');
// zeusGame/src/zeusSceneCtrl.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    btn_back: cc.Button,
    btn_getCoin: cc.Button,
    node_myCoin: cc.Node,
    node_topArea: cc.Node,
    node_centreArea: cc.Node,
    node_bottomArea: cc.Node,
    node_leftArea: cc.Node,
    node_rightArea: cc.Node,
    node_fireArea: cc.Node,
    node_lightNingBg: cc.Node,
    skeleton_lightNing: sp.Skeleton
  },
  ctor: function ctor() {
    this.isCCGameEventHideStutas = false;
    this.isAuto = false;
    this.bet = 0;
    this.isLoginFinished = false;
    this.curPlayerId = null;
    this.curGameState = "";
  },
  onLoad: function onLoad() {
    var _this = this;
    CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.SHOW_ZEUS_GAME);
    GlobalCfg.ACT_SCENE_CTRL = this;
    this.node_lightNingBg.active = false;
    this.skeleton_lightNing.node.active = false;
    this.skeleton_lightNing.setCompleteListener(function (trackEntry, loopCount) {
      var name = trackEntry.animation.name;
      _this.node_lightNingBg.active = false;
      _this.skeleton_lightNing.node.active = false;
      if (_this.curGameState == "freeState") {
        _this.leftAreaCtrl.setMutil(0);
        _this.leftAreaCtrl.setFreeStatus(true);
        _this.zeusAudiosCtrl.playFreeStateBg();
        _this.firesAreaCtrl.setFireSpinFreeType();
      } else if (_this.curGameState == "normalState") {
        _this.leftAreaCtrl.setMutil(0);
        _this.leftAreaCtrl.setFreeStatus(false);
        _this.zeusAudiosCtrl.playNormalStateBg();
        _this.firesAreaCtrl.setFireSpinNormalType();
        if (_this.isAuto) {
          _this.dealSendSpinReqEvent(_this.bet, _this.isDoubleMulti);
        } else {
          _this.bottomAreaCtrl.setBtnSpinInteractableStatus(true);
          _this.leftAreaCtrl.setBtnBuyFreeInteractableStatus(true);
          _this.leftAreaCtrl.setTogDoubleMultiInteractableStatus(true);
          var curBetIndex = _this.bottomAreaCtrl.getCurBetIndex();
          _this.bottomAreaCtrl.setBetBtnsAndLabByIndex(curBetIndex);
          _this.curRoundAddCoinFinish();
        }
        ;
      }
      ;
    });
    this.zeusAudiosCtrl = this.node.getComponent("zeusAudiosCtrl");
    this.myCoinCtrl = this.node_myCoin.getComponent("zeusMyCoinCtrl");
    this.headAreaCtrl = this.node_topArea.getComponent("zeusHeadAreaCtrl");
    this.centreAreaCtrl = this.node_centreArea.getComponent("zeusCentreAreaCtrl");
    this.bottomAreaCtrl = this.node_bottomArea.getComponent("zeusBottomAreaCtrl");
    this.leftAreaCtrl = this.node_leftArea.getComponent("zeusLeftAreaCtrl");
    this.rightAreaCtrl = this.node_rightArea.getComponent("zeusRightAreaCtrl");
    this.firesAreaCtrl = this.node_fireArea.getComponent("zeusFiresAreaCtrl");

    // this.zeusAudiosCtrl.setMusicVolume(0.6);
    this.zeusAudiosCtrl.setSoundVolume(1);
    this.zeusAudiosCtrl.playNormalStateBg();
    /**
     * 注册按钮点击事件
     */
    this.btn_back.node.on("click", CommonFun.getInstance().debounce(this.btnClick, 1), this);
    this.btn_getCoin.node.on("click", CommonFun.getInstance().debounce(this.btnClick, 1), this);
    this.msgHandle = ClientNotify.register(GlobalCfg.MSG_TYPE.serverMsg, this.onEventMsg, this);
    this.customMsgHandle = ClientNotify.register(GlobalCfg.MSG_TYPE.clientMsg, this.onEventMsg, this);
    this.btn_getCoin.node.active = GlobalCfg.USER_DATAS.openModules.includes(4);

    /**
     * 监听后台切换事件
     */
    cc.game.on(cc.game.EVENT_HIDE, function () {
      GameServerManager.hideFilterMag(1);
      _this.isCCGameEventHideStutas = true;
    }, this);
    cc.game.on(cc.game.EVENT_SHOW, function () {
      if (_this.isCCGameEventHideStutas == false) {
        return;
      }
      ;
      GameServerManager.hideFilterMag(2, function () {
        _this.isCCGameEventHideStutas = false;
      });
    }, this);
  },
  curRoundAddCoinFinish: function curRoundAddCoinFinish() {
    if (cc.isValid(this)) {
      var minLimit = this.bottomAreaCtrl.getBetArr()[0] || 0;
      CommonFun.getInstance().gameShowSecondRecharge(minLimit, Number.MAX_SAFE_INTEGER);
      CommonFun.getInstance().showWithdrawToastInGame();
    }
  },
  start: function start() {
    var scroll = [{
      cell: [{
        elf: 11
      }, {
        elf: 3
      }, {
        elf: 3
      }, {
        elf: 4
      }, {
        elf: 4
      }]
    }, {
      cell: [{
        elf: 4
      }, {
        elf: 10
      }, {
        elf: 10
      }, {
        elf: 10
      }, {
        elf: 9
      }]
    }, {
      cell: [{
        elf: 7
      }, {
        elf: 7
      }, {
        elf: 6
      }, {
        elf: 6
      }, {
        elf: 11
      }]
    }, {
      cell: [{
        elf: 11
      }, {
        elf: 11
      }, {
        elf: 7
      }, {
        elf: 7
      }, {
        elf: 7
      }]
    }, {
      cell: [{
        elf: 9
      }, {
        elf: 9
      }, {
        elf: 7
      }, {
        elf: 7
      }, {
        elf: 11
      }]
    }, {
      cell: [{
        elf: 9
      }, {
        elf: 9
      }, {
        elf: 9
      }, {
        elf: 11
      }, {
        elf: 11
      }]
    }];
    this.centreAreaCtrl.initShowCellNodes(scroll);
    this.leftAreaCtrl.setTogDoubleMultiCheckedStatus(false);
    this.isAuto = this.bottomAreaCtrl.getTogAutoCheckedStatus();
    var proroID = "gameservice.login";
    var message = "LoginReq";
    GameServerManager.send(proroID, message, {
      userid: GlobalCfg.USER_DATAS.userId,
      token: GlobalCfg.USER_DATAS.token,
      fromid: GlobalCfg.PRODUCT_ID
    });
  },
  onDestroy: function onDestroy() {
    this.zeusAudiosCtrl.setMusicVolume(1);
    this.zeusAudiosCtrl.setSoundVolume(1);
    ClientNotify.removeByHandle(GlobalCfg.MSG_TYPE.serverMsg, this.msgHandle);
    ClientNotify.removeByHandle(GlobalCfg.MSG_TYPE.clientMsg, this.customMsgHandle);
    CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.EXIT_ZEUS_GAME);
    GlobalCfg.ACT_SCENE_CTRL = null;
  },
  onEventMsg: function onEventMsg(webData, target) {
    var self = target;
    var msgId = webData.msgCode;
    var notify = webData.msgData;
    if (msgId == 'gameservice.login' && self.isLoginFinished == false) {
      self.isLoginFinished = true;
      self.dealLoginAckEvent(notify);
    } else if (msgId === "gameservice.call" || msgId == 'gameservice.freecall') {
      self.dealCallAckEvent(notify, msgId === "gameservice.freecall");
    } else if (msgId == 'gameservice.exit') {
      self.dealExitAckEvent(notify);
    } else if (msgId == 'gameservice.updatecoinnotify') {
      self.dealUpdateCoinNotifyEvent(notify);
    } else if (msgId == GlobalCfg.CLIENT_MSG_ID.ZEUS_ALL_SPIN_FINISHED) {
      self.dealAllSpinFinishedEvent(notify);
    } else if (msgId == GlobalCfg.CLIENT_MSG_ID.ZEUS_SEND_SPIN_REQ) {
      self.dealSendSpinReqEvent(notify.bet, notify.isDoubleMulti);
    } else if (msgId == GlobalCfg.CLIENT_MSG_ID.ZEUS_TRIGGER_AUTO_TOGGLE) {
      self.dealTriggerAutoToggleEvent(notify);
    } else if (msgId == GlobalCfg.CLIENT_MSG_ID.ZEUS_SELECTED_BET_FRESH) {
      self.dealSelectedBetEvent(notify);
    } else if (msgId == GlobalCfg.CLIENT_MSG_ID.ZEUS_SHOW_BUY_FREE_TIPS) {
      self.dealShowBuyFreeTipsEvent(notify);
    } else if (msgId == GlobalCfg.CLIENT_MSG_ID.ZEUS_SEND_BUY_FREE_REQ) {
      self.dealSendBuyFreeReqEvent(notify);
    } else if (msgId == GlobalCfg.CLIENT_MSG_ID.ZEUS_ONCE_ERASE_FINISHED) {
      self.dealOnceEraseFinishedEvent(notify);
    } else if (msgId == GlobalCfg.CLIENT_MSG_ID.ZEUS_TRIGGER_DOUBLE_TOGGLE) {
      self.dealTriggerDoubleToggleEvent(notify);
    }
    // else if(msgId == GlobalCfg.CLIENT_MSG_ID.FIRST_RECHARGE_TIPS){
    //     SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.ZEUS, SceneManager.getInstance().sceneType.LOBBY);
    // }
    else if (msgId == GlobalCfg.CLIENT_MSG_ID.ZEUS_ENTER_FREE_STATUS) {
      self.dealEnterFreeStatusEvent(notify);
    } else if (msgId == GlobalCfg.CLIENT_MSG_ID.GAME_MENU_CLICK_OUT_TO_LOBBY) {
      var proroID = "gameservice.exit";
      var message = "ExitReq";
      GameServerManager.send(proroID, message, {});
    } else if (msgId == GlobalCfg.CLIENT_MSG_ID.GAME_MENU_CLICK_HOW_TO_PLAY) {
      CommonFun.getInstance().showRule("zeusGame");
    } else if (msgId == GlobalCfg.CLIENT_MSG_ID.GAME_MENU_CLOSE) {} else if (msgId == "lobbyservice.kicktolobby") {
      SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.ZEUS, SceneManager.getInstance().sceneType.LOBBY);
    }
  },
  // 监听错误消息
  checkWebMsgError: function checkWebMsgError(webData, target) {
    var self = target;
    var msgId = webData.msgCode;
    var notify = webData.msgData;
    if (!notify) {
      var info = {
        errorMessage: "zeus\u6E38\u620F\u4E2D, \u670D\u52A1\u5668\u4E0B\u53D1\u7684\u975E\u6B63\u786E\u6D88\u606F\u4E2D\u7ED3\u6784\u4F53\u5F02\u5E38$ringify(webData)}"
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
    if (msgId === "gameservice.login") {
      CommonFun.getInstance().showMsgBox(result.message, "YES", function () {
        SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.ZEUS, SceneManager.getInstance().sceneType.LOBBY);
      }, false);
    } else if (msgId === "gameservice.call" || msgId == 'gameservice.freecall') {
      self.bottomAreaCtrl.setBtnSpinInteractableStatus(true);
      self.leftAreaCtrl.setBtnBuyFreeInteractableStatus(true);
      self.leftAreaCtrl.setTogDoubleMultiInteractableStatus(true);
      if (CommonFun.getInstance().isFreePlayerDirectedToFreeTP()) {
        if (result.result == 57) {
          CommonFun.getInstance().showDiversionFreeTP(function () {
            var proroID = "gameservice.exit";
            var message = "ExitReq";
            GameServerManager.send(proroID, message, {});
            // SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.ZEUS, SceneManager.getInstance().sceneType.LOBBY);
          });
        } else {
          CommonFun.getInstance().showTips(result.message);
        }
        ;
      } else {
        CommonFun.getInstance().showTips(result.message);
      }
      ;
    } else {
      CommonFun.getInstance().showTips(result.message);
    }
    ;
  },
  dealLoginAckEvent: function dealLoginAckEvent(notify) {
    if (!notify) {
      LoggerUtil.getInstance().warn("zeus游戏中, 服务器下发的gameservice.login结构体异常");
      return;
    }
    ;
    var whole = notify.whole;
    if (!whole) {
      LoggerUtil.getInstance().warn("zeus游戏中, 服务器下发的gameservice.login结构体中whole字段异常");
      return;
    }
    ;

    /**
     * 配置信息
     */
    var config = whole.config;
    if (config) {
      var chipOption = config.chipOption;
      if (Array.isArray(chipOption) && chipOption.length > 0) {
        var state = this.leftAreaCtrl.getTogDoubleMultiCheckedStatus();
        this.bottomAreaCtrl.setDoubleMultiState(state);
        this.bottomAreaCtrl.setBetArr(chipOption);
        this.bottomAreaCtrl.setCurBetIndex(0);
        var bet = chipOption[0];
        var score = bet * 1.25 / 100;
        this.leftAreaCtrl.setMutilPrice(score);
      } else {
        LoggerUtil.getInstance().warn("zeus游戏中, 服务器下发的gameservice.login结构体中whole.config.chipOption字段异常");
      }
      ;
    } else {
      LoggerUtil.getInstance().warn("zeus游戏中, 服务器下发的gameservice.login结构体中whole.config字段异常");
    }
    ;

    /**
     * 玩家信息
     */
    var requester = whole.requester;
    if (requester) {
      var userInfo = requester.userInfo;
      if (userInfo) {
        var playerId = userInfo.playerId; // 玩家游戏Id
        var uid = userInfo.uid; // userid
        var imgUrl = userInfo.imgUrl; // 头像
        var nickname = userInfo.nickname; // 昵称
        var diamond = userInfo.diamond; // 金币
        var vipLevel = userInfo.vipLevel; // vip等级
        this.myCoinCtrl.setMyCoin(diamond);
        this.curPlayerId = playerId;
      } else {
        LoggerUtil.getInstance().warn("zeus游戏中, 服务器下发的gameservice.login结构体中whole.requester.userInfo字段异常");
      }
      ;
      var leftFreeSpin = requester.leftFreeSpin;
      this.leftAreaCtrl.setFreeCount(leftFreeSpin);
    } else {
      LoggerUtil.getInstance().warn("zeus游戏中, 服务器下发的gameservice.login结构体中whole.requester字段异常");
    }
    ;

    /**
     * 场景信息
     */
    var scene = whole.scene;
    if (scene) {
      var scroll = scene.scroll;
      if (!scroll || !Array.isArray(scroll) || scroll.length != 6) {
        LoggerUtil.getInstance().warn("zeus游戏中, 服务器下发的gameservice.login结构体中whole.scene.scroll字段异常");
      } else {}
      ;
    } else {
      LoggerUtil.getInstance().warn("zeus游戏中, 服务器下发的gameservice.login结构体中whole.scene字段异常");
    }
    ;
  },
  dealCallAckEvent: function dealCallAckEvent(notify, isBuy) {
    if (!notify) {
      this.bottomAreaCtrl.setBtnSpinInteractableStatus(true);
      this.leftAreaCtrl.setBtnBuyFreeInteractableStatus(true);
      this.leftAreaCtrl.setTogDoubleMultiInteractableStatus(true);
      LoggerUtil.getInstance().warn("zeus游戏中, 服务器下发的gameservice.call结构体异常");
      return;
    }
    ;

    /**
     * 开始时免费次数
     */
    var startFreeSpin = notify.startFreeSpin;
    /**
     * 常规SPIN
     */
    var generalSpin = notify.spin;
    /**
     * 常规SPIN结算后剩余金币
     */
    var normalAfter = notify.normalAfter;
    /**
     * FreeSPIN列表
     */
    var freeSpin = notify.freeSpin;
    /**
     * 结算后剩余金币
     */
    var finalAfter = notify.finalAfter;
    /**
     * 下注金额(底注)
     */
    var bet = notify.bet;
    if (!isBuy) {
      if (!generalSpin) {
        LoggerUtil.getInstance().warn("zeus游戏中, 服务器下发的gameservice.call结构体中spin字段异常");
        this.bottomAreaCtrl.setBtnSpinInteractableStatus(true);
        this.leftAreaCtrl.setBtnBuyFreeInteractableStatus(true);
        this.leftAreaCtrl.setTogDoubleMultiInteractableStatus(true);
        return;
      }
      ;
      var generalSpinStartScroll = generalSpin.startScroll;
      if (!generalSpinStartScroll || !Array.isArray(generalSpinStartScroll) || generalSpinStartScroll.length != 6) {
        LoggerUtil.getInstance().warn("zeus游戏中, 服务器下发的gameservice.call结构体中spin.startScroll字段异常");
        this.bottomAreaCtrl.setBtnSpinInteractableStatus(true);
        this.leftAreaCtrl.setBtnBuyFreeInteractableStatus(true);
        this.leftAreaCtrl.setTogDoubleMultiInteractableStatus(true);
        return;
      }
      ;
      for (var i = 0, len = generalSpinStartScroll.length; i < len; i++) {
        var axis = generalSpinStartScroll[i];
        var cellArr = axis.cell;
        if (!cellArr || !Array.isArray(cellArr) || cellArr.length < 5) {
          LoggerUtil.getInstance().warn("zeus\u6E38\u620F\u4E2D, \u670D\u52A1\u5668\u4E0B\u53D1\u7684gameservice.call\u7ED3\u6784\u4F53\u4E2Dspin.startScroll[" + i + "].cell\u5B57\u6BB5\u5F02\u5E38");
          this.bottomAreaCtrl.setBtnSpinInteractableStatus(true);
          this.leftAreaCtrl.setBtnBuyFreeInteractableStatus(true);
          this.leftAreaCtrl.setTogDoubleMultiInteractableStatus(true);
          return;
        }
        ;
      }
      ;
      var generalSpinErase = generalSpin.erase;
      if (!Array.isArray(generalSpinErase)) {
        LoggerUtil.getInstance().warn("zeus游戏中, 服务器下发的gameservice.call结构体中spin.erase字段异常");
        this.bottomAreaCtrl.setBtnSpinInteractableStatus(true);
        this.leftAreaCtrl.setBtnBuyFreeInteractableStatus(true);
        this.leftAreaCtrl.setTogDoubleMultiInteractableStatus(true);
        return;
      }
      ;
    }
    ;
    if (!Array.isArray(freeSpin)) {
      LoggerUtil.getInstance().warn("zeus游戏中, 服务器下发的gameservice.call结构体中freeSpin字段异常");
      this.bottomAreaCtrl.setBtnSpinInteractableStatus(true);
      this.leftAreaCtrl.setBtnBuyFreeInteractableStatus(true);
      this.leftAreaCtrl.setTogDoubleMultiInteractableStatus(true);
      return;
    }
    ;
    for (var _i = 0, _len = freeSpin.length; _i < _len; _i++) {
      var freeSpinOnce = freeSpin[_i];
      var freeSpinOnceStartScroll = freeSpinOnce.startScroll;
      if (!freeSpinOnceStartScroll || !Array.isArray(freeSpinOnceStartScroll) || freeSpinOnceStartScroll.length != 6) {
        LoggerUtil.getInstance().warn("zeus\u6E38\u620F\u4E2D, \u670D\u52A1\u5668\u4E0B\u53D1\u7684gameservice.call\u7ED3\u6784\u4F53\u4E2DfreeSpin[" + _i + "].startScroll\u5B57\u6BB5\u5F02\u5E38");
        this.bottomAreaCtrl.setBtnSpinInteractableStatus(true);
        this.leftAreaCtrl.setBtnBuyFreeInteractableStatus(true);
        this.leftAreaCtrl.setTogDoubleMultiInteractableStatus(true);
        return;
      }
      ;
      var freeSpinOnceErase = freeSpinOnce.erase;
      if (!Array.isArray(freeSpinOnceErase)) {
        LoggerUtil.getInstance().warn("zeus\u6E38\u620F\u4E2D, \u670D\u52A1\u5668\u4E0B\u53D1\u7684gameservice.call\u7ED3\u6784\u4F53\u4E2DfreeSpin[" + _i + "].erase\u5B57\u6BB5\u5F02\u5E38");
        this.bottomAreaCtrl.setBtnSpinInteractableStatus(true);
        this.leftAreaCtrl.setBtnBuyFreeInteractableStatus(true);
        this.leftAreaCtrl.setTogDoubleMultiInteractableStatus(true);
        return;
      }
      ;
      for (var k = 0, _len2 = freeSpinOnceStartScroll.length; k < _len2; k++) {
        var _axis = freeSpinOnceStartScroll[k];
        var _cellArr = _axis.cell;
        if (!_cellArr || !Array.isArray(_cellArr) || _cellArr.length < 5) {
          LoggerUtil.getInstance().warn("zeus\u6E38\u620F\u4E2D, \u670D\u52A1\u5668\u4E0B\u53D1\u7684gameservice.call\u7ED3\u6784\u4F53\u4E2DfreeSpin[" + _i + "].startScroll[" + k + "].cell\u5B57\u6BB5\u5F02\u5E38");
          this.bottomAreaCtrl.setBtnSpinInteractableStatus(true);
          this.leftAreaCtrl.setBtnBuyFreeInteractableStatus(true);
          this.leftAreaCtrl.setTogDoubleMultiInteractableStatus(true);
          return;
        }
        ;
      }
      ;
    }
    ;

    // LoggerUtil.getInstance().log("服务器下发的源数据 =======> ", JSON.parse(JSON.stringify(notify)));

    /**
     * 先扣除bet金额
     */
    var coin = this.myCoinCtrl.getMyCoin();
    var coinTemp = coin - (isBuy ? bet * 100 : bet);
    this.myCoinCtrl.setMyCoin(coinTemp);
    LoggerUtil.getInstance().log("服务器下发的源数据 =======> ", JSON.parse(JSON.stringify(notify)));

    /**
     * 清空上次SPIN相关内容
     */
    this.bottomAreaCtrl.removeWinScore();
    this.centreAreaCtrl.removeSpinData();
    this.leftAreaCtrl.removeAllRecordItems();

    /**
     * 处理本次SPIN相关内容
     */
    this.leftAreaCtrl.setFreeCount(startFreeSpin);
    this.leftAreaCtrl.setFreeStatus(false);
    this.centreAreaCtrl.dealSpinResultProcess(notify);
  },
  dealExitAckEvent: function dealExitAckEvent(notify) {
    SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.ZEUS, SceneManager.getInstance().sceneType.LOBBY);
  },
  dealUpdateCoinNotifyEvent: function dealUpdateCoinNotifyEvent(notify) {
    if (!notify) {
      return;
    }
    ;
    var playerId = notify.playerId; // 玩家Id
    var balance = notify.balance; // 剩余数量
    var reason = notify.reason; // 原因 1:支付; 其他：未知

    if (this.curPlayerId == playerId) {
      this.myCoinCtrl.setMyCoin(balance);
    }
    ;
  },
  btnClick: function btnClick(btn) {
    var btnName = btn.node.name;
    GlobalCfg.G_COMPONENTS.Audio.playButton();
    switch (btnName) {
      case this.btn_back.node.name:
        this.dealBtnBackEvent();
        break;
      case this.btn_getCoin.node.name:
        this.dealBtnGetCoinEvent();
        break;
      default:
        break;
    }
  },
  dealBtnBackEvent: function dealBtnBackEvent() {
    CommonFun.getInstance().showGameMenu(false);
  },
  dealBtnGetCoinEvent: function dealBtnGetCoinEvent() {
    CommonFun.getInstance().showSmallAddCash();
  },
  dealAllSpinFinishedEvent: function dealAllSpinFinishedEvent(notify) {
    var isHaveFreeSpin = notify.isHaveFreeSpin;
    if (isHaveFreeSpin) {
      this.playLightNingAnim("normalState");
      var finalAfter = notify.finalAfter;
      this.myCoinCtrl.setMyCoin(finalAfter);
      this.leftAreaCtrl.setBuyFreeState(false);
      this.curRoundAddCoinFinish();
    } else {
      var _finalAfter = notify.finalAfter;
      this.myCoinCtrl.setMyCoin(_finalAfter);
      if (this.isAuto) {
        this.dealSendSpinReqEvent(this.bet, this.isDoubleMulti);
      } else {
        this.bottomAreaCtrl.setBtnSpinInteractableStatus(true);
        this.leftAreaCtrl.setBtnBuyFreeInteractableStatus(true);
        this.leftAreaCtrl.setTogDoubleMultiInteractableStatus(true);
        var curBetIndex = this.bottomAreaCtrl.getCurBetIndex();
        this.bottomAreaCtrl.setBetBtnsAndLabByIndex(curBetIndex);
        this.curRoundAddCoinFinish();
      }
      ;
    }
    ;
  },
  dealSendSpinReqEvent: function dealSendSpinReqEvent(bet, isDoubleMulti) {
    if (GlobalCfg.USER_DATAS.isNotCharge == true && GlobalCfg.USER_DATAS.gamePattern == 0 && GlobalCfg.USER_DATAS.refuseUnpayHundred == true) {
      //未曾充值
      CommonFun.getInstance().showMsgBox("This feature is available only for premium players . Add cash now to become a premium player .", "SHOP", function () {
        if (GlobalCfg.USER_DATAS.openModules.includes(4)) {
          CommonFun.getInstance().showSmallAddCash();
        }
      }, false);
      return;
    }
    ;
    if (bet <= 0) {
      LoggerUtil.getInstance().warn("zeus\u6E38\u620F\u4E2D, \u81EA\u5B9A\u4E49ZEUS_SEND_SPIN_REQ\u6D88\u606F\u7684\u6570\u636E\u5F02\u5E38", bet);
      return;
    }
    ;
    var coin = this.myCoinCtrl.getMyCoin();
    if (coin < bet) {
      this.bottomAreaCtrl.setBtnSpinInteractableStatus(true);
      this.leftAreaCtrl.setBtnBuyFreeInteractableStatus(true);
      this.leftAreaCtrl.setTogDoubleMultiInteractableStatus(true);
      if (GlobalCfg.IS_CLUB_MODE == 1)
        //代理模式不跳转商城
        CommonFun.getInstance().showMsgBox('Insufficient cash', "YES", function () {}, false);else CommonFun.getInstance().showSmallAddCash();
      return;
    }
    ;
    this.leftAreaCtrl.setBtnBuyFreeInteractableStatus(false);
    this.leftAreaCtrl.setTogDoubleMultiInteractableStatus(false);
    this.bet = bet;
    this.isDoubleMulti = isDoubleMulti;
    var proroID = "gameservice.call";
    var message = "CallReq";
    GameServerManager.send(proroID, message, {
      amount: this.bet,
      "double": this.isDoubleMulti
    });
  },
  dealTriggerAutoToggleEvent: function dealTriggerAutoToggleEvent(notify) {
    if (!notify) {
      return;
    }
    ;
    this.isAuto = notify.isAuto;
  },
  dealSelectedBetEvent: function dealSelectedBetEvent(notify) {
    if (!notify) {
      return;
    }
    ;
    var bet = notify.bet;
    this.bet = bet;
    var score = bet * 1.5 / 100;
    // this.bottomAreaCtrl.setMutilPrice(score);
  },

  dealShowBuyFreeTipsEvent: function dealShowBuyFreeTipsEvent(notify) {
    var _this2 = this;
    if (!notify || notify.bet <= 0) {
      LoggerUtil.getInstance().warn("zeus\u6E38\u620F\u4E2D, dealShowBuyFreeTipsEvent", notify);
      return;
    }
    ;
    CommonFun.getInstance().loadBundle('zeusGame', function (bundle) {
      bundle.load("prefabs/zeusBuyFreeTips", cc.Prefab, function (err, prefab) {
        if (!err) {
          GlobalCfg.ACT_SCENE_CTRL.zeusAudiosCtrl.playBuyFreeTipsShowEffect();
          var zeusBuyFreeTips = cc.instantiate(prefab);
          var zeusBuyFreeTipsCtrl = zeusBuyFreeTips.getComponent("zeusBuyFreeTipsCtrl");
          zeusBuyFreeTipsCtrl.setBuyFreeTipsData(notify.bet);
          _this2.node.addChild(zeusBuyFreeTips);
        }
        ;
      });
    }, function (err) {
      LoggerUtil.getInstance().error("\u52A0\u8F7DzeusGame-Bundle\u5F02\u5E38: " + JSON.stringify(err));
    });
  },
  dealSendBuyFreeReqEvent: function dealSendBuyFreeReqEvent(notify) {
    if (!notify || notify.bet <= 0) {
      LoggerUtil.getInstance().warn("zeus\u6E38\u620F\u4E2D, dealSendBuyFreeReqEvent", notify);
      return;
    }
    ;
    var isAgree = notify.isAgree;
    if (isAgree) {
      var coin = this.myCoinCtrl.getMyCoin();
      if (coin < notify.bet * 100) {
        GlobalCfg.ACT_SCENE_CTRL.zeusAudiosCtrl.playBuyFreeTipsHideEffect();
        this.leftAreaCtrl.setBuyFreeState(false);
        this.leftAreaCtrl.playBtnFreeAnim(true);
        this.bottomAreaCtrl.setBtnSpinInteractableStatus(true);
        this.leftAreaCtrl.setBtnBuyFreeInteractableStatus(true);
        this.leftAreaCtrl.setTogDoubleMultiInteractableStatus(true);
        if (GlobalCfg.IS_CLUB_MODE == 1)
          //代理模式不跳转商城
          CommonFun.getInstance().showMsgBox('Insufficient cash', "YES", function () {}, false);else CommonFun.getInstance().showSmallAddCash();
        return;
      }
      ;
      GlobalCfg.ACT_SCENE_CTRL.zeusAudiosCtrl.playBuyFreeTipsCliclOkEffect();
      this.leftAreaCtrl.setBuyFreeState(true);
      this.leftAreaCtrl.playBtnFreeAnim(true);
      this.bottomAreaCtrl.setBtnSpinInteractableStatus(false);
      this.leftAreaCtrl.setBtnBuyFreeInteractableStatus(false);
      this.leftAreaCtrl.setTogDoubleMultiInteractableStatus(false);
      var bet = notify.bet;
      var proroID = "gameservice.freecall";
      var message = "FreeCallReq";
      GameServerManager.send(proroID, message, {
        amount: bet
      });
    } else {
      GlobalCfg.ACT_SCENE_CTRL.zeusAudiosCtrl.playBuyFreeTipsHideEffect();
      this.leftAreaCtrl.setBuyFreeState(false);
      this.leftAreaCtrl.playBtnFreeAnim(true);
      this.leftAreaCtrl.setBtnBuyFreeInteractableStatus(true);
      this.leftAreaCtrl.setTogDoubleMultiInteractableStatus(true);
    }
    ;
  },
  dealOnceEraseFinishedEvent: function dealOnceEraseFinishedEvent(notify) {
    if (!notify) {
      LoggerUtil.getInstance().warn("zeus\u6E38\u620F\u4E2D, dealOnceEraseFinishedEvent", notify);
      return;
    }
    ;
    var erase = notify.erase;
    var bet = erase.bet;
    var mul = erase.mul; // 倍数

    var addCoin = bet * mul / 20;
    if (addCoin > 0) {
      var coin = this.myCoinCtrl.getMyCoin();
      var coinTemp = coin + addCoin;
      this.myCoinCtrl.setMyCoin(coinTemp);
    }
    ;
  },
  dealTriggerDoubleToggleEvent: function dealTriggerDoubleToggleEvent(notify) {
    if (!notify) {
      LoggerUtil.getInstance().warn("zeus\u6E38\u620F\u4E2D, dealTriggerDoubleToggleEvent", notify);
      return;
    }
    ;
    this.isDoubleMulti = notify.isDoubleMulti;
    this.bottomAreaCtrl.setDoubleMultiState(this.isDoubleMulti);
    var curBetIndex = this.bottomAreaCtrl.getCurBetIndex();
    this.bottomAreaCtrl.setBetBtnsAndLabByIndex(curBetIndex);
  },
  dealEnterFreeStatusEvent: function dealEnterFreeStatusEvent() {
    this.playLightNingAnim("freeState");
  },
  playLightNingAnim: function playLightNingAnim(state) {
    this.curGameState = state;
    GlobalCfg.ACT_SCENE_CTRL.zeusAudiosCtrl.playLightNingEffect();
    this.node_lightNingBg.active = true;
    this.skeleton_lightNing.node.active = true;
    this.skeleton_lightNing.defaultSkin = 'default';
    this.skeleton_lightNing.setAnimation(0, 'animation', false);
  },
  getCoinFormatStr: function getCoinFormatStr(coin) {
    var decimalPlaces = this.getCoinDecimalPlaces(coin);
    return coin.toFixed(decimalPlaces);
  },
  getCoinDecimalPlaces: function getCoinDecimalPlaces(coin) {
    var decimalPlaces = 0;
    if (coin < 100000) {
      decimalPlaces = 2;
    } else if (100000 <= coin && coin < 1000000) {
      decimalPlaces = 1;
    } else if (1000000 <= coin) {
      decimalPlaces = 0;
    }
    ;
    return decimalPlaces;
  }
});

cc._RF.pop();