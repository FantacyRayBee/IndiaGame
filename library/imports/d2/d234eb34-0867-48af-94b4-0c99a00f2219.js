"use strict";
cc._RF.push(module, 'd234es0CGdIr5S0DJmgDyIZ', 'benzmainCtrl');
// Benz/BenzScript/benzmainCtrl.js

"use strict";

var UINode = require('UINode');
cc.Class({
  "extends": UINode,
  properties: {
    logoPab: cc.Prefab,
    btnPab: cc.Prefab,
    labCoinPab: cc.Prefab,
    pab_setting: cc.Prefab,
    nodeLizi: cc.Prefab
  },
  ctor: function ctor() {
    this.totalWinNum = 0;
    this.betIndex = 0;
    this.lastBet = [];
    this.bTouch = 0;
    this._winGold = 0;
    this.bActOver = false;
    this.startIndex = Math.ceil(Math.random() * 24) - 1;
    this.betStatus = true;
    this.is_can_ackClick = true;
    // this.bPMDRun = false;
    this.curUseAdapt = 1; // 适配模式
    this.singleBetNums = [50, 1000, 2000, 5000, 10000]; // 单注金额
    this.singleBet = this.singleBetNums[0];
    this.rotating = false; // 旋转中
    this.showBetSpineTimeInterval = 15; // 显示下注动画的时间间隔
    this.showBetSpineTime = 0;
  },
  onLoad: function onLoad() {
    CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.SHOW_BENZ_GAME);
    CommonFun.getInstance().addVerticalAcc();
    GlobalCfg.G_COMPONENTS.Audio.pauseMusic();
    this.msgHandle = ClientNotify.register(GlobalCfg.MSG_TYPE.serverMsg, this.onEventMsg, this);
    this.customMsgHandle = ClientNotify.register(GlobalCfg.MSG_TYPE.clientMsg, this.onEventMsg, this);
    this.ReSetPos();
    this.initNode();
    this.tipsLabel = ["Your game is not finished yet . If you wish to exit the game , you will lose your money . Do you want to leave game?",
    // 退出游戏
    "Your cash is insufficient, Please recharge in time!"];
    // this.pmdTime = setTimeout(()=>{this.runPMD()}, 5000);
  },

  onDestroy: function onDestroy() {
    GlobalCfg.G_COMPONENTS.Audio.stopAllEffects();
    clearTimeout(this.carouselTime);
    clearTimeout(this.runTime);
    clearTimeout(this.changeTime);
    clearTimeout(this.stopMusic);
    clearTimeout(this.btnTime);
    // ❌ 不要覆盖 scheduleOnce：this.scheduleOnce = null;
    if (this.scheduleBetSpineTimeCallback) {
      this.unschedule(this.scheduleBetSpineTimeCallback);
    }
    ClientNotify.removeByHandle(GlobalCfg.MSG_TYPE.serverMsg, this.msgHandle);
    ClientNotify.removeByHandle(GlobalCfg.MSG_TYPE.clientMsg, this.customMsgHandle);
    CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.EXIT_BENZ_GAME);
    try {
      cc.Tween.stopAllByTarget && cc.Tween.stopAllByTarget(this.node);
      this.betNode && cc.Tween.stopAllByTarget(this.betNode);
      this.nodeWinAnim && this.nodeWinAnim.node && cc.Tween.stopAllByTarget(this.nodeWinAnim.node);
      this.nodePmdAnim && this.nodePmdAnim.node && cc.Tween.stopAllByTarget(this.nodePmdAnim.node);
    } catch (e) {}
    this.unscheduleAllCallbacks();
  },
  start: function start() {
    GlobalCfg.ACT_SCENE_CTRL = this;
    this.sendLoginReq();
  },
  ReSetPos: function ReSetPos() {
    var height = cc.winSize.height;
    var BetButton = cc.find('benz_Canvas/BetButton');
    var array = ['btnBet_1', 'btnBet_10', 'btnBet_20', 'btnBet_50', 'btnBet_100'];
    var pos = [cc.v2(-311, 96), cc.v2(-208, 96), cc.v2(-104, 96), cc.v2(-1, 96), cc.v2(102, 96)];
    if (height < 1400) {
      for (var index = 0; index < array.length; index++) {
        var btn = BetButton.getChildByName(array[index]);
        btn.setPosition(pos[index]);
      }
      BetButton.setPosition(cc.v2(0, -715));
      BetButton.getChildByName("btn_repeat").active = true;
      BetButton.getChildByName("btn_start").active = true;
      this.curUseAdapt = 0;
    }
  },
  initNode: function initNode() {
    this.dataConfig = this.node.getComponent("dataConfig");
    this.dataConfig.initLogo(this.logoPab, this.node.getChildByName("areaShow"));
    this.sendReqCtrl = this.node.getComponent("benzSendMessage"); //跟服务器请求数据
    this.light = this.node.getChildByName('BetButton').getChildByName('light');
    this.betAreaNode = this.node.getChildByName("BetArea");
    this.betNode = this.betAreaNode.getChildByName("bet_node");
    this.btn_add = this.node.getChildByName('node_coin').getChildByName('btn_add').getComponent(cc.Button);
    this.labTotalWin = cc.find('benz_Canvas/lab_Total').getComponent(cc.Label);
    this.labJackPot = cc.find('benz_Canvas/lab_jackPot').getComponent(cc.Label);
    this.labCoin = cc.find('benz_Canvas/node_coin/lab_coin').getComponent(cc.Label);
    this.btnStart = cc.find('benz_Canvas/BetButton/btn_start').getComponent(cc.Button);
    this.btnStart1 = cc.find('benz_Canvas/BetButton/btn_start1').getComponent(cc.Button);
    this.btnRepeat = cc.find('benz_Canvas/BetButton/btn_repeat').getComponent(cc.Button);
    this.btnRepeat1 = cc.find('benz_Canvas/BetButton/btn_repeat1').getComponent(cc.Button);
    this.btnReset = cc.find('benz_Canvas/BetButton/btn_reset').getComponent(cc.Button);
    this.btnReset1 = cc.find('benz_Canvas/BetButton/btn_reset1').getComponent(cc.Button);
    this.btnCollect = cc.find('benz_Canvas/BetButton/btn_collect').getComponent(cc.Button);
    this.btnCollect1 = cc.find('benz_Canvas/BetButton/btn_collect1').getComponent(cc.Button);
    this.nodeWinAnim = cc.find('benz_Canvas/node_winAnim').getComponent(sp.Skeleton);
    this.nodePmdAnim = cc.find('benz_Canvas/node_pmd').getComponent(sp.Skeleton);
    this.labCount = [null];
    for (var index = 1; index < 9; index++) {
      this.labCount[index] = cc.find('benz_Canvas/BetArea/btn_' + index + '/lab_count').getComponent(cc.Label);
      var btn_bet = cc.find('benz_Canvas/BetArea/btn_' + index);
      btn_bet.on(cc.Node.EventType.TOUCH_START, this.touchstart, this);
    }
    this.addClickTouch(['btnBet_1', 'btnBet_10', 'btnBet_20', 'btnBet_50', 'btnBet_100', 'btn_repeat', 'btn_start', 'btn_start1', 'btn_repeat1', 'btn_reset', 'btn_reset1', 'btn_collect', 'btn_collect1'], cc.find('BetButton', this.node), this);
    this.addClickTouch(['btn_back', 'btn_set'], this.node, this);
    this.btn_add.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
    this.node.on(cc.Node.EventType.TOUCH_START, this.touchstart, this);
    this.btnBet1 = cc.find('benz_Canvas/BetButton/btnBet_1');
    this.choiceBetButton(this.btnBet1.getComponent(cc.Button));
    this.betArr = [null, 0, 0, 0, 0, 0, 0, 0, 0];
    this.betNum = [null, [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]];
    this.rebetArr = [];
    this.rebetNum = [];
    this.dataConfig.changeLogo(this.startIndex, true);
  },
  btnClick: function btnClick(button) {
    var _this = this;
    if (!this.is_can_ackClick) {
      return;
    }
    var btnName = button.node.name;
    LoggerUtil.getInstance().log("///:", btnName);
    if (btnName == "btn_back") {
      GlobalCfg.G_COMPONENTS.Audio.playBack();
      //退出游戏
      var betCoin = 0;
      var self = this;
      for (var index = 1; index < 9; index++) {
        betCoin += this.betArr[index];
      }
      if (betCoin > 0) {
        var call = [];
        if (!this.betStatus) {
          this.betArr = [null, 0, 0, 0, 0, 0, 0, 0, 0];
          this.betNum = [null, [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]];
        }
        for (var _index = 0; _index < this.betArr.length - 1; _index++) {
          call[_index] = {
            Amount: self.betArr[_index + 1],
            type: _index + 1,
            AmountType: self.betNum[_index + 1]
          };
        }
        this.sendReqCtrl.exitGameReq(call);
      } else {
        var _call = [];
        for (var _index2 = 0; _index2 < this.betArr.length - 1; _index2++) {
          _call[_index2] = {
            Amount: self.betArr[_index2 + 1],
            type: _index2 + 1,
            AmountType: self.betNum[_index2 + 1]
          };
        }
        this.sendReqCtrl.exitGameReq(_call);
      }
      return;
    }
    GlobalCfg.G_COMPONENTS.Audio.playButton();
    if (btnName == 'btn_set') {
      var pab_setting = cc.instantiate(this.pab_setting);
      this.node.addChild(pab_setting);
    } else if (btnName == 'btnBet_1') {
      this.choiceBetButton(button);
      this.singleBet = this.singleBetNums[0];
      this.betIndex = 0;
    } else if (btnName == 'btnBet_10') {
      this.choiceBetButton(button);
      this.singleBet = this.singleBetNums[1];
      this.betIndex = 1;
    } else if (btnName == 'btnBet_20') {
      this.choiceBetButton(button);
      this.singleBet = this.singleBetNums[2];
      this.betIndex = 2;
    } else if (btnName == 'btnBet_50') {
      this.choiceBetButton(button);
      this.singleBet = this.singleBetNums[3];
      this.betIndex = 3;
    } else if (btnName == 'btnBet_100') {
      this.choiceBetButton(button);
      this.singleBet = this.singleBetNums[4];
      this.betIndex = 4;
    } else if (btnName == 'btn_repeat' || btnName == 'btn_repeat1') {
      if (this.betStatus) {
        this.betFunc();
      }
    } else if (btnName == 'btn_start') {
      GlobalCfg.G_COMPONENTS.Audio.stopAll();
      if (this.betStatus) {
        this.nodeWinAnim.node.active = false;
        GlobalCfg.G_COMPONENTS.Audio.stopAll();
        this.betFunc(true);
        return;
      }
      if (Number(this.labTotalWin.string) * 100 == this.totalWinNum) {
        this.setBtnInteractableAndOutLineLabel(false, this.btnStart);
        this.setBtnInteractableAndOutLineLabel(false, this.btnStart1);
        this.countDown(this.labTotalWin, 0, 2);
        if (Number(this.labTotalWin.string) > 0) {
          this.playGameSound("Sound/D_STAR");
        }
      }
    } else if (btnName == 'btn_start1') {
      GlobalCfg.G_COMPONENTS.Audio.stopAll();
      if (this.betStatus) {
        this.nodeWinAnim.node.active = false;
        GlobalCfg.G_COMPONENTS.Audio.stopAll();
        this.betFunc(true);
        return;
      }
      if (Number(this.labTotalWin.string) * 100 == this.totalWinNum) {
        this.setBtnInteractableAndOutLineLabel(false, this.btnStart);
        this.setBtnInteractableAndOutLineLabel(false, this.btnStart1);
        this.countDown(this.labTotalWin, 0, 2);
        if (Number(this.labTotalWin.string) > 0) {
          this.playGameSound("Sound/D_STAR");
        }
      }
    } else if (btnName == 'btn_add') {
      CommonFun.getInstance().showNewShop();
    } else if (btnName == 'btn_reset1' || btnName == 'btn_reset') {
      this.returnCoin();
      this.reSetData();
    } else if (btnName == 'btn_collect' || btnName == 'btn_collect1') {
      this.collectCoin();
    }
    this.is_can_ackClick = false;
    this.btnTime = setTimeout(function () {
      _this.is_can_ackClick = true;
    }, 300);
  },
  returnCoin: function returnCoin() {
    var count = 0;
    for (var i = 1; i < this.betArr.length; i++) {
      count += this.betArr[i];
    }
    var curCoin = Number(this.labCoin.string) * 100;
    GlobalCfg.USER_DATAS.userDiamond = curCoin + count;
    this.labCoin.string = FloatCalculation.accDiv(GlobalCfg.USER_DATAS.userDiamond, 100);
  },
  betFunc: function betFunc(bBet) {
    if (GlobalCfg.USER_DATAS.isNotCharge == true && GlobalCfg.USER_DATAS.gamePattern == 0 && GlobalCfg.USER_DATAS.refuseUnpayHundred["minibenzbmw"] == true) {
      //未曾充值
      CommonFun.getInstance().showMsgBox("This feature is available only for premium players . Add cash now to become a premium player .", "SHOP", function () {
        CommonFun.getInstance().showSmallAddCash();
      }, false);
      return;
    }
    if (bBet) {
      var BetCoin = 0;
      for (var index = 1; index < this.betArr.length; index++) {
        BetCoin += this.betArr[index];
      }
      if (BetCoin != 0) {
        this.reStart();
        this.callReq();
        return;
      }
    }
    var reBetCoin = 0;
    for (var _index3 = 1; _index3 < this.rebetArr.length; _index3++) {
      reBetCoin += this.rebetArr[_index3];
    }
    if (reBetCoin > 0 && reBetCoin <= GlobalCfg.USER_DATAS.userDiamond) {
      for (var i = 1; i < this.rebetNum.length; i++) {
        this.betArr[i] += this.rebetArr[i];
        for (var j = 0; j < this.rebetNum[i].length; j++) {
          this.betNum[i][j] += this.rebetNum[i][j];
        }
      }
      for (var _index4 = 1; _index4 < 9; _index4++) {
        if (this.rebetArr[_index4] != 0) {
          this.betTypeAnim(_index4, this.rebetArr[_index4]);
        }
      }
      this.setBtnInteractableAndOutLineLabel(false, this.btnRepeat);
      this.setBtnInteractableAndOutLineLabel(false, this.btnRepeat1);
      this.showBtnReset(true);
    } else if (reBetCoin > GlobalCfg.USER_DATAS.userDiamond) {
      if (GlobalCfg.IS_CLUB_MODE == 1) {
        //代理模式不跳转商城
        CommonFun.getInstance().showMsgBox('Insufficient cash', "YES", function () {}, false);
      } else {
        CommonFun.getInstance().showMsgBox(this.tipsLabel[1], "SHOP", function () {
          CommonFun.getInstance().showSmallAddCash();
        }, false);
      }
      return;
    } else if (reBetCoin == 0) {
      if (!bBet) {
        var num1 = this.betArr[1] + this.singleBet;
        if (num1 > 1000000) {
          CommonFun.getInstance().showTips("Upper limit of betting amount!");
          return;
        }
      }
      var num = this.singleBet * 8;
      if (GlobalCfg.USER_DATAS.userDiamond >= num) {
        for (var _i = 1; _i < this.betArr.length; _i++) {
          this.betArr[_i] += this.singleBet;
          this.betNum[_i][this.betIndex] += this.singleBet;
        }
        for (var _index5 = 1; _index5 < this.betArr.length; _index5++) {
          this.betTypeAnim(_index5, this.singleBet);
        }
        this.showBtnReset(true);
      } else {
        if (GlobalCfg.IS_CLUB_MODE == 1) {
          //代理模式不跳转商城
          CommonFun.getInstance().showMsgBox('Insufficient cash', "YES", function () {}, false);
        } else {
          CommonFun.getInstance().showMsgBox(this.tipsLabel[1], "SHOP", function () {
            CommonFun.getInstance().showSmallAddCash();
          }, false);
        }
        return;
      }
    }
  },
  reStart: function reStart() {
    this.betStatus = false;
    for (var index = 1; index < 9; index++) {
      var btn_bet = cc.find('benz_Canvas/BetArea/btn_' + index).getComponent(cc.Button);
      btn_bet.interactable = false;
    }
    this.setBtnInteractableAndOutLineLabel(false, this.btnStart);
    this.setBtnInteractableAndOutLineLabel(false, this.btnStart1);
    this.setBtnInteractableAndOutLineLabel(false, this.btnRepeat);
    this.setBtnInteractableAndOutLineLabel(false, this.btnRepeat1);
    this.showBtnReset(false);
  },
  setBtnInteractableAndOutLineLabel: function setBtnInteractableAndOutLineLabel(bool, button) {
    if (!button) return;
    button.interactable = bool;
    button.target.getChildByName('Label').getComponent(cc.LabelOutline).enabled = bool;
  },
  // 监听错误消息
  checkWebMsgError: function checkWebMsgError(webData, target) {
    var self = target;
    var msgId = webData.msgCode;
    var notify = webData.msgData;
    if (!notify) {
      var info = {
        errorMessage: "\u5954\u9A70\u5B9D\u9A6C\u6E38\u620F\u4E2D, \u670D\u52A1\u5668\u4E0B\u53D1\u7684\u975E\u6B63\u786E\u6D88\u606F\u4E2D\u7ED3\u6784\u4F53\u5F02\u5E38, \u5185\u5BB9\u4E3A===>" + JSON.stringify(webData)
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
      var msg = result.message;
      CommonFun.getInstance().showMsgBox(msg, "YES", function () {
        SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.BENZ, SceneManager.getInstance().sceneType.LOBBY);
        CommonFun.getInstance().decVerticalAcc();
      }, false);
    } else if (msgId === "gameservice.call") {
      this.setBtnInteractableAndOutLineLabel(true, this.btnStart);
      this.setBtnInteractableAndOutLineLabel(true, this.btnStart1);
      this.returnCoin();
      this.reSetData();
      if (CommonFun.getInstance().isFreePlayerDirectedToFreeTP()) {
        if (result.result == 57) {
          CommonFun.getInstance().showDiversionFreeTP(function () {
            CommonFun.getInstance().decVerticalAcc();
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
  },
  onEventMsg: function onEventMsg(webData, target) {
    var self = target;
    var msgId = webData.msgCode;
    var notify = webData.msgData;
    if (msgId == "gameservice.login") {
      self.login(notify);
    } else if (msgId == "gameservice.call") {
      self.callNotify(notify);
    } else if (msgId == "gameservice.gamescenenotify") {
      self.refreshJackPot(notify);
    } else if (msgId == "gameservice.gamescene") {
      self.refreshJackPot(notify);
    } else if (msgId == "gameservice.exit") {
      self.outgamenotify();
    } else if (msgId == "gameservice.updatecoinnotify") {
      if (self.DisplayName == notify.userinfo.DisplayName) {
        var betCoin = 0;
        for (var index = 1; index < self.betArr.length; index++) {
          betCoin += self.betArr[index];
        }
        if (betCoin != 0 && !self.betStatus) {
          GlobalCfg.USER_DATAS.userDiamond = notify.userinfo.Diamond;
          var num = FloatCalculation.accDiv(GlobalCfg.USER_DATAS.userDiamond, 100);
          self.labCoin.string = num;
        } else {
          GlobalCfg.USER_DATAS.userDiamond = notify.userinfo.Diamond - betCoin;
          var _num = FloatCalculation.accDiv(GlobalCfg.USER_DATAS.userDiamond, 100);
          self.labCoin.string = _num;
        }
      }
      ;
    } else if (msgId == "lobbyservice.kicktolobby") {
      SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.BENZ, SceneManager.getInstance().sceneType.LOBBY);
      CommonFun.getInstance().decVerticalAcc();
    }
  },
  login: function login(notify) {
    this.sendReqCtrl.gameSceneReq();
    GlobalCfg.USER_DATAS.userDiamond = notify.userinfo.Diamond;
    this.DisplayName = notify.userinfo.DisplayName;
    var num = FloatCalculation.accDiv(GlobalCfg.USER_DATAS.userDiamond, 100);
    this.labCoin.string = num;
    var config = notify.config;
    this.singleBetNums = [].concat(config.chipOption);
    this.setBtnInteractableAndOutLineLabel(true, this.btnStart);
    this.setBtnInteractableAndOutLineLabel(true, this.btnStart1);
    this.reSetData();
    this.setBetLabel();
  },
  setBetLabel: function setBetLabel() {
    var BetButton = this.node.getChildByName('BetButton');
    var array = ['btnBet_1', 'btnBet_10', 'btnBet_20', 'btnBet_50', 'btnBet_100'];
    for (var i = 0; i < array.length; i++) {
      var nodeBtn = BetButton.getChildByName(array[i]);
      var label = nodeBtn.getChildByName('Background').getChildByName('Label').getComponent(cc.Label);
      label.string = this.singleBetNums[i] / 100;
    }
    this.singleBet = this.singleBetNums[0];
  },
  refreshJackPot: function refreshJackPot(notify) {
    this.labJackPot.string = notify.jackpot;
  },
  // 玩家点击下注
  touchstart: function touchstart(event) {
    var name = event.currentTarget.name;
    var types = null;
    if (name == "btn_1") {
      types = 1;
    } else if (name == "btn_2") {
      types = 2;
    } else if (name == "btn_3") {
      types = 3;
    } else if (name == "btn_4") {
      types = 4;
    } else if (name == "btn_5") {
      types = 5;
    } else if (name == "btn_6") {
      types = 6;
    } else if (name == "btn_7") {
      types = 7;
    } else if (name == "btn_8") {
      types = 8;
    } else if (name == "benz_Canvas") {
      this.collectCoin();
      return;
    }
    if (this.betStatus) {
      this.playGameSound('Sound/s' + types);
      if (GlobalCfg.USER_DATAS.isNotCharge == true && GlobalCfg.USER_DATAS.gamePattern == 0 && GlobalCfg.USER_DATAS.refuseUnpayHundred["minibenzbmw"] == true) {
        //未曾充值
        CommonFun.getInstance().showMsgBox("This feature is available only for premium players . Add cash now to become a premium player .", "SHOP", function () {
          CommonFun.getInstance().showSmallAddCash();
        }, false);
        return;
      } else if (this.singleBet > GlobalCfg.USER_DATAS.userDiamond) {
        CommonFun.getInstance().showMsgBox(this.tipsLabel[1], "SHOP", function () {
          CommonFun.getInstance().showSmallAddCash();
        }, false);
      } else {
        var num = this.betArr[types] + this.singleBet;
        if (num > 1000000) {
          CommonFun.getInstance().showTips("Upper limit of betting amount!");
          return;
        }
        this.betNum[types][this.betIndex] += this.singleBet;
        this.betArr[types] += this.singleBet;
        this.betTypeAnim(types, this.singleBet);
      }
      var count = 0;
      for (var i = 1; i < this.betArr.length; i++) {
        count += this.betArr[i];
      }
      var type = count > 0 ? true : false;
      this.showBtnReset(type);
    } else {
      LoggerUtil.getInstance().log("游戏未结束");
    }
  },
  // 零中奖/异常统一收尾（一定会触发 countDown -> reSetData）
  _endRoundNoWin: function _endRoundNoWin() {
    this.bActOver = true;
    this.rotating = false;

    // UI
    this.setBtnInteractableAndOutLineLabel(true, this.btnStart);
    this.setBtnInteractableAndOutLineLabel(true, this.btnStart1);
    this.showBtnCollect(false);

    // 确保总赢额清 0，避免上局残留
    this._winGold = 0;
    this.totalWinNum = 0;
    if (this.labTotalWin && cc.isValid(this.labTotalWin.node)) {
      this.labTotalWin.string = '0';
    }

    // 用普通分支把余额同步显示，并在完成时 reSetData
    this.countDown(this.labCoin, GlobalCfg.USER_DATAS.userDiamond);
  },
  collectCoin: function collectCoin() {
    // 兜底：如果没有在播中奖动画且处于结算中，直接结束
    if (!this.nodeWinAnim.node.active && !this.betStatus) {
      if (this.totalWinNum > 0) {
        this.setBtnInteractableAndOutLineLabel(false, this.btnStart);
        this.setBtnInteractableAndOutLineLabel(false, this.btnStart1);
        this.countDown(this.labTotalWin, 0, 2);
        this.showBtnCollect(false);
      } else {
        this._endRoundNoWin();
      }
      return;
    }
    var bActable = false;
    if (this.btnStart.node.active) {
      bActable = this.btnStart.interactable;
    } else {
      bActable = this.btnStart1.interactable;
    }
    if (Number(this.labTotalWin.string) * 100 == this.totalWinNum && bActable && !this.betStatus) {
      GlobalCfg.G_COMPONENTS.Audio.stopAll();
      this.setBtnInteractableAndOutLineLabel(false, this.btnStart);
      this.setBtnInteractableAndOutLineLabel(false, this.btnStart1);
      this.countDown(this.labTotalWin, 0, 2);
      if (Number(this.labTotalWin.string) > 0) {
        this.playGameSound("Sound/D_STAR");
      }
      this.showBtnCollect(false);
    }
    if (this.bActOver && this.nodeWinAnim.node.active && !this.betStatus) {
      this.bTouch = 1;
      this.setBtnInteractableAndOutLineLabel(true, this.btnStart);
      this.setBtnInteractableAndOutLineLabel(true, this.btnStart1);
      this.labTotalWin.string = this.totalWinNum / 100;
      this.nodeWinAnim.node.active = false;
      GlobalCfg.G_COMPONENTS.Audio.stopAll();
      if (this.totalWinNum > 0) {
        this.showBtnCollect(true);
      }
    }
  },
  showBtnReset: function showBtnReset(type) {
    if (type == true) {
      if (this.curUseAdapt == 0) {
        this.btnReset.node.active = true;
        this.btnRepeat.node.active = false;
      } else {
        this.btnReset1.node.active = true;
        this.btnRepeat1.node.active = false;
      }
    } else {
      if (this.curUseAdapt == 0) {
        this.btnReset.node.active = false;
        this.btnRepeat.node.active = true;
      } else {
        this.btnReset1.node.active = false;
        this.btnRepeat1.node.active = true;
      }
    }
  },
  showBtnCollect: function showBtnCollect(bool) {
    if (bool == true && this.rotating == false) {
      if (this.curUseAdapt == 0) {
        this.btnCollect.node.active = true;
        this.btnStart.node.active = false;
      } else {
        this.btnCollect1.node.active = true;
        this.btnStart1.node.active = false;
      }
    } else {
      if (this.curUseAdapt == 0) {
        this.btnCollect.node.active = false;
        this.btnStart.node.active = true;
      } else {
        this.btnCollect1.node.active = false;
        this.btnStart1.node.active = true;
      }
    }
  },
  betTypeAnim: function betTypeAnim(type, amount) {
    if (type) {
      var betAreaPos = [null, cc.v2(264, -88), cc.v2(92, -88), cc.v2(-82, -88), cc.v2(-254, -88), cc.v2(264, 86), cc.v2(92, 86), cc.v2(-82, 86), cc.v2(-254, 86)];
      GlobalCfg.USER_DATAS.userDiamond -= amount;
      var num = FloatCalculation.accDiv(GlobalCfg.USER_DATAS.userDiamond, 100);
      this.labCoin.string = num;
      var pos = betAreaPos[type];
      var pabWinLab = cc.instantiate(this.labCoinPab);
      pabWinLab.setPosition(pos);
      pabWinLab.getComponent(cc.Label).string = '+' + amount / 100;
      this.betNode.addChild(pabWinLab);
      this.labCount[type].string = this.betArr[type] / 100;
      cc.tween(pabWinLab).to(1, {
        position: cc.v2(pos.x, pos.y + 60)
      }).call(function () {
        pabWinLab.destroy();
      }).start();
    }
  },
  playGameSound: function playGameSound(name, bBool) {
    if (bBool === void 0) {
      bBool = false;
    }
    this.loadAudioClip(name, function (audioClip, target) {
      GlobalCfg.G_COMPONENTS.Audio.playSound(audioClip, bBool);
    }, this);
  },
  playGameMusic: function playGameMusic(name) {
    this.loadAudioClip(name, function (audioClip, target) {
      GlobalCfg.G_COMPONENTS.Audio.playMusic(audioClip, true);
    }, this);
  },
  loadAudioClip: function loadAudioClip(audioClipUrl, func, target) {
    if (audioClipUrl === void 0) {
      audioClipUrl = "";
    }
    if (func === void 0) {
      func = null;
    }
    if (target === void 0) {
      target = null;
    }
    if (!audioClipUrl || audioClipUrl.length == 0) {
      return;
    }
    ;
    CommonFun.getInstance().loadBundle('Benz', function (bundle) {
      bundle.load(audioClipUrl, cc.AudioClip, function (err1, audioClip) {
        if (!err1) {
          func && func(audioClip, target);
        } else {
          LoggerUtil.getInstance().error(err1);
        }
        ;
      });
    }, function (err) {
      LoggerUtil.getInstance().error(err);
    });
  },
  callReq: function callReq() {
    var self = this;
    for (var index = 1; index < 9; index++) {
      var btn_betSpr = cc.find('benz_Canvas/BetArea/btn_' + index + '/zhezhao');
      btn_betSpr.active = true;
    }
    var call = [];
    for (var _index6 = 0; _index6 < this.betArr.length - 1; _index6++) {
      call[_index6] = {
        Amount: self.betArr[_index6 + 1],
        type: _index6 + 1,
        AmountType: self.betNum[_index6 + 1]
      };
    }
    this.rebetArr = this.betArr.slice(0);
    this.rebetNum = this.betNum.slice(0);
    this.sendReqCtrl.sendCallReq(call);
  },
  callNotify: function callNotify(notify) {
    // --- 服务端数据兜底校验 ---
    LoggerUtil.getInstance().log('[BENZ notify]', JSON.stringify({
      AllAmount: notify && notify.AllAmount,
      Diamond: notify && notify.Userinfo && notify.Userinfo.Diamond,
      WinLen: notify && Array.isArray(notify.Win) ? notify.Win.length : 'NA',
      GameSceneLen: notify && Array.isArray(notify.GameScene) ? notify.GameScene.length : 'NA',
      PlayType: notify && notify.PlayType
    }));
    if (!notify || typeof notify.AllAmount !== 'number' || !notify.Userinfo || typeof notify.Userinfo.Diamond !== 'number') {
      LoggerUtil.getInstance().error('[BENZ] bad notify payload, force end no-win');
      this._endRoundNoWin();
      return;
    }
    this.rotating = true;
    this.totalWinNum = notify.AllAmount;
    GlobalCfg.USER_DATAS.userDiamond = notify.Userinfo.Diamond;
    var winArr = notify.Win || [];
    var winIndexArr = (notify.GameScene || []).slice();
    var playType = notify.PlayType;
    winIndexArr.sort(function (m, n) {
      if (m < n) return -1;else if (m > n) return 1;else return 0;
    });
    if (winArr.length == 1) {
      var index = this.startIndex - winIndexArr[0];
      var num = index > 0 ? 96 - Math.abs(index) : 96 + Math.abs(index);
      this.runAct(num);
    } else if (playType == 4) {
      //点兵点将*3
      this.paintedEggDBDJ(winIndexArr);
      this.playGameSound('Sound/w1', true);
    } else if (playType == 5) {
      //开火车
      var num1 = winIndexArr[2];
      if (winIndexArr.indexOf(1) != -1 && winIndexArr.indexOf(2) == -1) {
        num1 = 1;
      } else if (winIndexArr.indexOf(0) != -1 && winIndexArr.indexOf(2) == -1) {
        num1 = 0;
      }
      var _index7 = 0 - num1;
      var _num2 = _index7 > 0 ? 96 - Math.abs(_index7) : 96 + Math.abs(_index7);
      this.paintedEggKHC(_num2);
      this.playGameSound('Sound/w1', true);
    } else if (playType == 6) {
      //点兵点将*6
      this.paintedEggDBDJ(winIndexArr);
      this.playGameSound('Sound/w2', true);
    } else if (playType == 7) {
      //满天星
      this.paintedEggMTX(winIndexArr);
      this.playGameSound('Sound/w2', true);
    } else if (playType == 8) {
      //大满贯
      this.paintedEggDMG(winIndexArr);
      this.playGameSound('Sound/w9', true);
    }
    if (winArr.length == 1) {
      this.playPmdAnim("pao");
    } else {
      this.playPmdAnim("shan");
    }
  },
  runAct: function runAct(runResult) {
    var runNum = 0;
    var addNum = 1;
    var musicIndex = 1;
    this.loopTime = 0;
    var logoLength = this.dataConfig.logoArr.length;
    this.playGameSound('Sound/runact');
    this.loop4 = function () {
      var _this2 = this;
      var that = this;
      clearTimeout(this.runTime);
      this.runTime = null;
      this.runTime = setTimeout(function () {
        if (cc.isValid(_this2.node)) {
          that.init4();
        }
      }, this.loopTime);
    };
    this.init4 = function () {
      var _this3 = this;
      if (!cc.isValid(this.node)) return;
      if (this.startIndex >= logoLength) {
        this.startIndex = 0;
      }
      if (musicIndex > 8) musicIndex = 1;
      for (var index = 0; index < 5; index++) {
        if (index <= runNum) {
          var jndex = this.startIndex - index;
          var start = jndex < 0 ? logoLength + this.startIndex : this.startIndex;
          this.dataConfig.changeLogo(start - index, true);
          this.dataConfig.setLogoOpacity(start - index, 255 - index * 60);
          if (index > 3) {
            this.dataConfig.changeLogo(start - index, false);
          }
        } else if (addNum == -1) {
          var _jndex = this.startIndex - index;
          var _start = _jndex < 0 ? logoLength + this.startIndex : this.startIndex;
          this.dataConfig.changeLogo(_start - index, false);
        }
      }
      if (runNum >= runResult - 5) {
        runNum = 5;
        addNum = -1;
      } else if (runNum == 0 && addNum == -1) {
        this.bActOver = true;
        if (this.totalWinNum > 0) {
          // ✅ 有中奖
          this.dataConfig.setLogoOpacity(this.startIndex, 255, true);
          this.rotating = false;
          var type = this.dataConfig.getType(this.startIndex);
          var _str = this.getTypeStr(type);
          this.playGameSound('Sound/' + _str);
          this.scheduleOnce(function () {
            _this3.playWinAnim(_str);
          }, 0.8);
        } else {
          // ❌ 没中奖
          this.playGameSound('Sound/meizhongjiang');
          this.dataConfig.setLogoOpacity(this.startIndex, 255, true);
          // 👉 延迟 0.8 秒再解锁按钮
          this.scheduleOnce(function () {
            if (!cc.isValid(_this3.node)) return;
            _this3.setBtnInteractableAndOutLineLabel(true, _this3.btnStart);
            _this3.setBtnInteractableAndOutLineLabel(true, _this3.btnStart1);
            _this3.collectCoin();
          }, 0.8);
        }
        return;
      }
      var arr = [null, 300, 200, 100, 50, 16];
      if (runNum < 6 && runNum > 0 && addNum == -1) {
        this.loopTime = arr[runNum];
      } else if (runNum < 6 && runNum > 0 && addNum == 1) {
        this.loopTime = arr[runNum];
      } else {
        this.loopTime = 16;
      }
      musicIndex++;
      this.startIndex++;
      runNum += addNum;
      this.loop4();
    };
    this.init4();
  },
  playWinAnim: function playWinAnim(animName) {
    var _this4 = this;
    var skel = this.nodeWinAnim; // sp.Skeleton
    if (!skel || !skel.skeletonData) return;
    skel.node.active = true;

    // 清旧监听，避免多次叠加
    skel.setCompleteListener(null);

    // 统一的完成函数（带去重）
    var done = false;
    var finish = function finish() {
      if (done) return;
      done = true;
      _this4.playGameSound('Sound/bg');
      _this4.countDown(_this4.labTotalWin, _this4.totalWinNum, 1); // ✅ 保证一定进来
      skel.node.active = false;
    };

    // 先挂监听，再开播；并做“动画名一致”的保护
    skel.setCompleteListener(function (trackEntry /*, loopCount*/) {
      var name = trackEntry && trackEntry.animation ? trackEntry.animation.name : animName;
      if (name === animName) finish();
    });
    var entry = skel.setAnimation(0, animName, false);
    this.playGameSound('Sound/prize');

    // 兜底：按动画时长 + 偏移定时触发 finish，防止“监听丢失/早完成”
    var dur = this._getSpineAnimDurationSafe(skel, animName);
    this.scheduleOnce(function () {
      return finish();
    }, Math.max(0.1, dur + 0.1));
  },
  _getSpineAnimDurationSafe: function _getSpineAnimDurationSafe(skel, animName) {
    try {
      var sd = skel.skeletonData;
      var rd = sd && sd.getRuntimeData ? sd.getRuntimeData() : null;
      if (rd) {
        if (typeof rd.findAnimation === 'function') {
          var anim = rd.findAnimation(animName);
          if (anim && typeof anim.duration === 'number') return anim.duration;
        }
        if (Array.isArray(rd.animations)) {
          var _anim = rd.animations.find(function (a) {
            return a && a.name === animName;
          });
          if (_anim && typeof _anim.duration === 'number') return _anim.duration;
        }
      }
    } catch (e) {}
    return 0.8;
  },
  playPmdAnim: function playPmdAnim(str) {
    this.nodePmdAnim.node.active = true;
    this.nodePmdAnim.setAnimation(0, str, true);
  },
  getTypeStr: function getTypeStr(type) {
    var _str = "";
    switch (type) {
      case 1:
        _str = 'volkswagen';
        break;
      case 2:
        _str = 'lexus';
        break;
      case 3:
        _str = 'bmw';
        break;
      case 4:
        _str = 'MercedesBenz';
        break;
      case 5:
        _str = 'porsche';
        break;
      case 6:
        _str = 'maserati';
        break;
      case 7:
        _str = 'Lamborghini';
        break;
      case 8:
        _str = 'ferrari';
        break;
      default:
        break;
    }
    return _str;
  },
  countDown: function countDown(StartNumNode, endNum, bMove) {
    var _this5 = this;
    LoggerUtil.getInstance().error("countDown : ", StartNumNode, endNum, bMove);

    // --- 统一用“分”为单位并四舍五入，干掉浮点误差 ---
    var toCents = function toCents(v) {
      return Math.round(Number(v) * 100);
    };
    var StartNum = toCents(StartNumNode && StartNumNode.string ? StartNumNode.string : 0);
    endNum = Math.round(endNum); // 服务器这边都是“分”，这里确保整数

    this.bTouch = 2; // 表示正在倒数计

    var stepOnce = function stepOnce() {
      // 组件被销毁时停止
      if (!cc.isValid(_this5.node) || !StartNumNode || !cc.isValid(StartNumNode.node)) return;

      // 外部要求立即停止（例如中奖动画被点跳过）
      if (_this5.bTouch == 1) {
        _this5.bTouch = 0;
        _this5.reSetData();
        return;
      }

      // 与目标差值（分）
      var Num = Math.abs(StartNum - endNum);

      // --- 这里是原先卡死的点：Num < 100 且 bMove != 0 时没有推进 ---
      // 现在直接“贴合”到目标，保证能收敛退出。
      if (Num < 100) {
        StartNum = endNum;
      } else {
        // 大步长优先，快速收敛
        if (Num >= 1000000) {
          StartNum += StartNum < endNum ? 1000000 : -1000000;
        } else if (Num >= 100000) {
          StartNum += StartNum < endNum ? 100000 : -100000;
        } else if (Num >= 10000) {
          StartNum += StartNum < endNum ? 10000 : -10000;
        } else if (Num >= 1000) {
          StartNum += StartNum < endNum ? 1000 : -1000;
        } else {
          // 100 <= Num < 1000
          StartNum += StartNum < endNum ? 100 : -100;
        }
      }

      // 同步数值到 UI（单位：元）
      StartNumNode.string = FloatCalculation.accDiv(StartNum, 100);

      // bMove==1：防止越界
      if (bMove == 1) {
        if (Number(_this5.labTotalWin.string) * 100 > _this5.totalWinNum) {
          _this5.labTotalWin.string = _this5.totalWinNum / 100;
        }
      }

      // 是否到达目标
      if (StartNum === endNum) {
        if (bMove == 1) {
          // 奖金跳字完成
          if (Number(_this5.labTotalWin.string) * 100 == _this5.totalWinNum && _this5.totalWinNum > 0) {
            if (_this5.rotating == false) {
              _this5.setBtnInteractableAndOutLineLabel(true, _this5.btnStart);
              _this5.setBtnInteractableAndOutLineLabel(true, _this5.btnStart1);
            }
            _this5.showBtnCollect(true);
          }
          return;
        } else if (bMove == 2) {
          // 从“总赢额”收集到“余额”
          var nodeLizi = cc.instantiate(_this5.nodeLizi);
          if (_this5.totalWinNum != 0) {
            var pos = _this5.labTotalWin.node.getPosition();
            nodeLizi.setPosition(pos);
            _this5.node.addChild(nodeLizi);
          }
          _this5.scheduleOnce(function () {
            if (cc.isValid(nodeLizi)) nodeLizi.destroy();
            _this5.totalWinNum = 0;
            _this5._winGold = 0;
            // 再把余额跳到服务器最新值（普通分支，结束自动 reSetData）
            _this5.countDown(_this5.labCoin, GlobalCfg.USER_DATAS.userDiamond);
          }, 0.5);
          return;
        } else {
          // 普通分支：余额跳字结束，收尾
          if (Number(_this5.labCoin.string) * 100 == GlobalCfg.USER_DATAS.userDiamond) {
            _this5.labCoin.string = FloatCalculation.accDiv(GlobalCfg.USER_DATAS.userDiamond, 100);
            _this5.setBtnInteractableAndOutLineLabel(true, _this5.btnStart);
            _this5.setBtnInteractableAndOutLineLabel(true, _this5.btnStart1);
            _this5.bTouch = 0;
            _this5.reSetData();
            return;
          }
        }
      }

      // 继续下一帧
      clearTimeout(_this5.changeTime);
      _this5.changeTime = setTimeout(stepOnce, 50);
      LoggerUtil.getInstance().log('caojun Num:' + Math.abs(StartNum - endNum) + ' bMove' + bMove);
    };

    // 启动循环
    clearTimeout(this.changeTime);
    this.changeTime = setTimeout(stepOnce, 50);
  },
  reSetData: function reSetData() {
    LoggerUtil.getInstance().error("caojun reSetData....");
    this.betArr = [null, 0, 0, 0, 0, 0, 0, 0, 0];
    this.betNum = [null, [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]];
    for (var index = 1; index < this.betNum.length; index++) {
      this.labCount[index].string = this.betArr[index];
    }
    ;
    for (var _index8 = 1; _index8 < 9; _index8++) {
      var btn_betSpr = cc.find('benz_Canvas/BetArea/btn_' + _index8 + '/zhezhao');
      btn_betSpr.active = false;
    }
    ;
    for (var _index9 = 0; _index9 < 24; _index9++) {
      this.dataConfig.setLogoOpacity(_index9, 255);
      this.dataConfig.changeLogo(_index9, false);
    }
    ;
    this.showBtnReset(false);
    this.nodePmdAnim.node.active = false;
    this.dataConfig.setLogoOpacity(this.startIndex, 255);
    this.dataConfig.changeLogo(this.startIndex, true);
    this.setBtnInteractableAndOutLineLabel(true, this.btnRepeat);
    this.setBtnInteractableAndOutLineLabel(true, this.btnRepeat1);
    this.betNode.removeAllChildren();
    this.betStatus = true;
    for (var _index10 = 1; _index10 < 9; _index10++) {
      var btn_bet = cc.find('benz_Canvas/BetArea/btn_' + _index10).getComponent(cc.Button);
      btn_bet.interactable = true;
    }
    this.bActOver = false;
    this.bTouch = 0;
    clearTimeout(this.runTime);
    try {
      cc.Tween.stopAllByTarget && cc.Tween.stopAllByTarget(this.node);
    } catch (e) {}
    this.unscheduleAllCallbacks();
  },
  getReward: function getReward(id, bMove) {
    this.labTotalWin.string = this._winGold / 100;
    switch (id) {
      case 1:
        this._winGold += this.betArr[id] * 2;
        this.countDown(this.labTotalWin, this._winGold, bMove);
        break;
      case 2:
        this._winGold += this.betArr[id] * 3;
        this.countDown(this.labTotalWin, this._winGold, bMove);
        break;
      case 3:
        this._winGold += this.betArr[id] * 5;
        this.countDown(this.labTotalWin, this._winGold, bMove);
        break;
      case 4:
        this._winGold += this.betArr[id] * 5;
        this.countDown(this.labTotalWin, this._winGold, bMove);
        break;
      case 5:
        this._winGold += this.betArr[id] * 10;
        this.countDown(this.labTotalWin, this._winGold, bMove);
        break;
      case 6:
        this._winGold += this.betArr[id] * 20;
        this.countDown(this.labTotalWin, this._winGold, bMove);
        break;
      case 7:
        this._winGold += this.betArr[id] * 30;
        this.countDown(this.labTotalWin, this._winGold, bMove);
        break;
      case 8:
        this._winGold += this.betArr[id] * 40;
        this.countDown(this.labTotalWin, this._winGold, bMove);
        break;
      default:
        break;
    }
  },
  outgamenotify: function outgamenotify() {
    SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.BENZ, SceneManager.getInstance().sceneType.LOBBY);
    CommonFun.getInstance().decVerticalAcc();
  },
  paintedEggDBDJ: function paintedEggDBDJ(WinArr) {
    this.dataConfig.changeLogo(this.startIndex, false);
    this.startIndex = 0;
    var index = 0;
    var runNum = 0;
    var tempArr = [];
    this.checkResult = function () {
      var that = this;
      if (index == WinArr.length - 1) {
        if (!this.totalWinNum) {
          this.playGameSound('Sound/meizhongjiang');
          // 统一走零中奖收尾，避免 collectCoin 条件卡死
          this._endRoundNoWin();
        }
      } else {
        index++;
        that.init6();
      }
    };
    this.loop6 = function () {
      var _this6 = this;
      var that = this;
      clearTimeout(this.runTime);
      this.runTime = null;
      this.runTime = setTimeout(function () {
        if (cc.isValid(_this6.node)) {
          that.init6();
        }
      }, 50);
    };
    this.init6 = function () {
      var _this7 = this;
      if (cc.isValid(this.node)) {
        if (this.startIndex > 23) {
          this.startIndex = 0;
        }
        this.dataConfig.changeLogo(this.startIndex, true);
        this.dataConfig.setLogoOpacity(this.startIndex, 255);
        var num = this.startIndex - 1 < 0 ? 23 : this.startIndex - 1;
        if (tempArr.indexOf(num) == -1) {
          this.dataConfig.changeLogo(num, false);
        }
        if (this.startIndex == WinArr[index] && runNum > 23) {
          tempArr.push(this.startIndex);
          var type = this.dataConfig.getType(this.startIndex);
          this.playGameSound('Sound/dingdong');
          this.dataConfig.setLogoOpacity(this.startIndex, 255, true);
          var _str = this.getTypeStr(type);
          this.playGameSound('Sound/' + _str);
          if (index == WinArr.length - 1) {
            this.rotating = false;
          }
          this.getReward(type, 1);
          this.scheduleOnce(function () {
            _this7.startIndex = 0;
            runNum = 0;
            _this7.checkResult();
          }, 1);
          return;
        }
        this.startIndex++;
        runNum++;
        this.loop6();
      }
    };
    this.init6();
  },
  paintedEggMTX: function paintedEggMTX(WinArr) {
    var runNum = 0;
    this.dataConfig.changeLogo(this.startIndex, false);
    this.startIndex = 0;
    this.loop1 = function () {
      var _this8 = this;
      var that = this;
      clearTimeout(this.runTime);
      this.runTime = null;
      this.runTime = setTimeout(function () {
        if (cc.isValid(_this8.node)) {
          that.init1();
        }
      }, 125);
    };
    this.init1 = function () {
      var _this9 = this;
      if (cc.isValid(this.node)) {
        for (var index = runNum % 2; index < 24; index += 2) {
          this.dataConfig.changeLogo(index, true);
          this.dataConfig.setLogoOpacity(index, 255);
          this.dataConfig.changeLogo(runNum % 2 == 0 ? index + 1 : index - 1, false);
        }
        if (runNum >= 23) {
          for (var _index11 = 0; _index11 < 24; _index11++) {
            this.dataConfig.setLogoOpacity(_index11, 255);
            this.dataConfig.changeLogo(_index11, false);
          }
          if (this.totalWinNum > 0) {
            for (var _index12 = 0; _index12 < WinArr.length; _index12++) {
              this.dataConfig.changeLogo(WinArr[_index12], true);
            }
            var _loop = function _loop(_index13) {
              _this9.scheduleOnce(function () {
                if (_index13 == WinArr.length - 1) {
                  _this9.rotating = false;
                }
                _this9.playGameSound('Sound/dingdong');
                _this9.dataConfig.setLogoOpacity(WinArr[_index13], 255, true);
                var type = _this9.dataConfig.getType(WinArr[_index13]);
                _this9.getReward(type, 1);
              }, _index13 * 0.8);
            };
            for (var _index13 = 0; _index13 < WinArr.length; _index13++) {
              _loop(_index13);
            }
          } else {
            for (var _index14 = 0; _index14 < WinArr.length; _index14++) {
              this.dataConfig.changeLogo(WinArr[_index14], true);
            }
            this.playGameSound('Sound/meizhongjiang');
            // 统一走零中奖收尾
            this._endRoundNoWin();
            var _loop2 = function _loop2(_index15) {
              _this9.scheduleOnce(function () {
                _this9.playGameSound('Sound/dingdong');
                _this9.dataConfig.setLogoOpacity(WinArr[_index15], 255, true);
              }, _index15 * 0.8);
            };
            for (var _index15 = 0; _index15 < WinArr.length; _index15++) {
              _loop2(_index15);
            }
            this.setBtnInteractableAndOutLineLabel(true, this.btnStart);
            this.setBtnInteractableAndOutLineLabel(true, this.btnStart1);
          }
          return;
        }
        runNum++;
        this.loop1();
      }
    };
    this.init1();
  },
  paintedEggDMG: function paintedEggDMG() {
    var runNum = 0;
    this.dataConfig.changeLogo(this.startIndex, false);
    this.startIndex = 0;
    this.loop2 = function () {
      var _this10 = this;
      var that = this;
      clearTimeout(this.runTime);
      this.runTime = null;
      this.runTime = setTimeout(function () {
        if (cc.isValid(_this10.node)) {
          that.init2();
        }
      }, 400);
    };
    this.init2 = function () {
      var _this11 = this;
      if (cc.isValid(this.node)) {
        this.dataConfig.changeLogo(runNum, true);
        if (runNum == 23) {
          var _loop3 = function _loop3(index) {
            _this11.dataConfig.changeLogo(runNum, true);
            _this11.scheduleOnce(function () {
              if (index == 24 - 1) {
                _this11.rotating = false;
              }
              _this11.playGameSound('Sound/dingdong');
              _this11.dataConfig.setLogoOpacity(index, 255, true);
              var type = _this11.dataConfig.getType(index);
              _this11.getReward(type, 1);
            }, index * 0.8);
          };
          for (var index = 0; index < 24; index++) {
            _loop3(index);
          }
          return;
        }
        runNum++;
        this.loop2();
      }
    };
    this.init2();
  },
  paintedEggKHC: function paintedEggKHC(runResult) {
    var runNum = 0;
    var addNum = 1;
    this.loopTime = 1000;
    var logoLength = this.dataConfig.logoArr.length;
    this.dataConfig.changeLogo(this.startIndex, false);
    this.startIndex = 0;
    this.loop3 = function () {
      var _this12 = this;
      var that = this;
      clearTimeout(this.runTime);
      this.runTime = null;
      this.runTime = setTimeout(function () {
        if (cc.isValid(_this12.node)) {
          that.init3();
        }
      }, this.loopTime);
    };
    this.init3 = function () {
      var _this13 = this;
      if (cc.isValid(this.node)) {
        if (this.startIndex >= logoLength) {
          this.startIndex = 0;
        }
        for (var index = 0; index < 4; index++) {
          if (index <= runNum && addNum != -1) {
            var jndex = this.startIndex - index;
            var start = jndex < 0 ? logoLength + this.startIndex : this.startIndex;
            this.dataConfig.changeLogo(start - index, true);
            if (index == 3) {
              this.dataConfig.changeLogo(start - index, false);
            }
          } else if (addNum == -1) {
            var _jndex2 = this.startIndex - index;
            var _start2 = _jndex2 < 0 ? logoLength + this.startIndex : this.startIndex;
            this.dataConfig.changeLogo(_start2 - index, true);
            if (index == 3) {
              this.dataConfig.changeLogo(_start2 - index, false);
            }
          }
        }
        if (runNum >= runResult - 7) {
          runNum = 7;
          addNum = -1;
        } else if (runNum == 0 && addNum == -1) {
          if (this.totalWinNum > 0) {
            var _loop4 = function _loop4(_index16) {
              var jndex = _this13.startIndex - _index16;
              var start = jndex < 0 ? logoLength + _this13.startIndex : _this13.startIndex;
              _this13.dataConfig.changeLogo(start - _index16, true);
              _this13.dataConfig.setLogoOpacity(start - _index16, 255);
              _this13.scheduleOnce(function () {
                if (_index16 == 2) {
                  _this13.rotating = false;
                }
                _this13.playGameSound('Sound/dingdong');
                _this13.dataConfig.setLogoOpacity(start - _index16, 255, true);
                _this13.getReward(_this13.dataConfig.getType(start - _index16, 1), 1);
              }, _index16 * 0.8);
            };
            for (var _index16 = 2; _index16 >= 0; _index16--) {
              _loop4(_index16);
            }
          } else {
            this.playGameSound('Sound/meizhongjiang');
            // 统一零中奖收尾
            this._endRoundNoWin();
            var _loop5 = function _loop5(_index17) {
              _this13.scheduleOnce(function () {
                _this13.playGameSound('Sound/dingdong');
                var jndex = _this13.startIndex - _index17;
                var start = jndex < 0 ? logoLength + _this13.startIndex : _this13.startIndex;
                _this13.dataConfig.setLogoOpacity(start - _index17, 255, true);
              }, _index17 * 0.8);
            };
            for (var _index17 = 0; _index17 < 3; _index17++) {
              _loop5(_index17);
            }
            this.setBtnInteractableAndOutLineLabel(true, this.btnStart);
            this.setBtnInteractableAndOutLineLabel(true, this.btnStart1);
          }
          return;
        }
        if (runNum < 5) {
          this.loopTime = Math.floor(750 / (runNum + 1));
        } else {
          this.loopTime = 15;
        }
        this.startIndex++;
        runNum += addNum;
        this.loop3();
      }
    };
    this.init3();
  },
  winArrRandom: function winArrRandom(arr, arr1, num) {
    var randomNum = Math.ceil(Math.random() * 24) - 1;
    if (arr.indexOf(randomNum) == -1 && arr1.indexOf(randomNum) == -1) {
      arr.push(randomNum);
      if (arr.length == num) {
        return;
      } else {
        this.winArrRandom(arr, arr1, num);
      }
    } else {
      this.winArrRandom(arr, arr1, num);
    }
  },
  sendLoginReq: function sendLoginReq() {
    var proroID = 'gameservice.login';
    var message = 'LoginReq';
    GameServerManager.send(proroID, message, {
      userid: GlobalCfg.USER_DATAS.userId,
      token: GlobalCfg.USER_DATAS.token,
      fromid: 2001
    });
  },
  choiceBetButton: function choiceBetButton(button) {
    var scale = 1.1;
    var btnArr = ['btnBet_1', 'btnBet_10', 'btnBet_20', 'btnBet_50', 'btnBet_100'];
    var betButtonNode = this.node.getChildByName('BetButton');
    var btnName = button.node.name;
    this.light.setScale(scale);
    for (var i = 0; i < btnArr.length; i++) {
      var btn = betButtonNode.getChildByName(btnArr[i]).getComponent(cc.Button);
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
    this.light.setPosition(pos.x, pos.y);
  },
  showBtnBetSpine: function showBtnBetSpine() {
    var animationName = 'animation';
    var btnArr = ['btnBet_1', 'btnBet_10', 'btnBet_20', 'btnBet_50', 'btnBet_100'];
    var betButtonNode = this.node.getChildByName('BetButton');
    var len = btnArr.length,
      i = 0;
    this.scheduleBetSpineTimeCallback = function () {
      var spine = betButtonNode.getChildByName(btnArr[i]).getChildByName('spine').getComponent(sp.Skeleton);
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