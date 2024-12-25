"use strict";
cc._RF.push(module, '9377bfImxdDioe3piLJtN1U', 'fruitMachineCtrl');
// fruitMachine/src/fruitMachineCtrl.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    btn_back: cc.Button,
    btn_add: cc.Button,
    btn_addcash: cc.Button,
    btn_wf: cc.Button,
    btn_setting: cc.Button,
    btn_betJian: cc.Button,
    btn_betJia: cc.Button,
    btn_betMax: cc.Button,
    btn_betCiShuForever: cc.Button,
    btn_betCiShu100: cc.Button,
    btn_betCiShu50: cc.Button,
    btn_betCiShu20: cc.Button,
    btn_auto: cc.Button,
    btn_spin: cc.Button,
    toggle_fast: cc.Toggle,
    toggle_auto: cc.Toggle,
    node_tcBg: cc.Node,
    node_lines: cc.Node,
    node_fruitContentArr: [cc.Node],
    lab_autoBetCiShu: cc.Label,
    lab_betAmount: cc.Label,
    lab_totalWin: cc.Label,
    lab_jb: cc.Label,
    pab_setting: cc.Prefab
  },
  ctor: function ctor() {
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
    //投注额度数组
    this.betAmountArr = ['10', '20', '50', '100', '200', '500', '1000', '2000'];
    if (GlobalCfg.USER_DATAS.gamePattern == 1) {
      this.betAmountArr = ['1', '10', '20', '50', '100', '200', '500', '1000', '2000'];
    }
    this.betAmountArrIndex = 0;
    this.finishedFruitItemNum = 0;
    this.isRunningFruitAnim = false;
    this.paymentSwitch = false;
    this.frees = [];
    this.isHaveMianFeiRecord = false;
    this.selectAutoBetStr = 'AUTO';
    this.selectAutoStatus = false;
    this.freeTotalWinNum = 0; // 三叶草免费时，总获取金额
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
    CommonFun.getInstance().loadBundle('fruitMachine', function (bundle) {
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
  playGameSound: function playGameSound(name) {
    this.loadAudioClip(name, function (audioClip, target) {
      GlobalCfg.G_COMPONENTS.Audio.playSound(audioClip, false);
    }, this);
  },
  playGameMusic: function playGameMusic(name) {
    this.loadAudioClip(name, function (audioClip, target) {
      GlobalCfg.G_COMPONENTS.Audio.playMusic(audioClip, true);
    }, this);
  },
  onLoad: function onLoad() {
    CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.SHOW_FRUIT_GAME);
    GlobalCfg.ACT_SCENE_CTRL = this, this.playGameMusic('sound/bg');
    this.msgHandle = ClientNotify.register(GlobalCfg.MSG_TYPE.serverMsg, this.onEventMsg, this);
    this.customMsgHandle = ClientNotify.register(GlobalCfg.MSG_TYPE.clientMsg, this.onEventMsg, this);
    this.btn_back.node.on('click', this.debounce(this.componentClickCall, 1), this);
    this.btn_add.node.on('click', this.debounce(this.componentClickCall, 1), this);
    this.btn_addcash.node.on('click', this.debounce(this.componentClickCall, 1), this);
    this.btn_wf.node.on('click', this.debounce(this.componentClickCall, 1), this);
    this.btn_setting.node.on('click', this.debounce(this.componentClickCall, 1), this);
    this.btn_betJian.node.on('click', this.debounce(this.componentClickCall, 0), this);
    this.btn_betJia.node.on('click', this.debounce(this.componentClickCall, 0), this);
    this.btn_betMax.node.on('click', this.debounce(this.componentClickCall, 1), this);
    this.btn_betCiShuForever.node.on('click', this.debounce(this.componentClickCall, 1), this);
    this.btn_betCiShu100.node.on('click', this.debounce(this.componentClickCall, 1), this);
    this.btn_betCiShu50.node.on('click', this.debounce(this.componentClickCall, 1), this);
    this.btn_betCiShu20.node.on('click', this.debounce(this.componentClickCall, 1), this);
    this.btn_auto.node.on('click', this.debounce(this.componentClickCall, 0.5), this);
    this.btn_spin.node.on('click', this.debounce(this.componentClickCall, 1), this);
    this.toggle_fast.node.on('toggle', this.debounce(this.componentClickCall, 0), this);
    this.autoSpineNode = this.btn_auto.node.getChildByName('uiquan');
    this.autoSpineNode.active = false;
    this.lab_betAmount.string = this.betAmountArr[0];

    //自动下注次数选择的展示
    this.node_tcBg.active = false;

    //总共赢的金额
    this.lab_totalWin.string = 0;
    this.setBetCiShuAutoTips();
    this.cashSwitch();
    if (GlobalCfg.PAYMENT_SWITCH == 2 && GlobalCfg.CHANNEL == "ios") {
      var btn_add = this.btn_add.node.getChildByName('Background').getChildByName('btn_shop');
      var btn_addcash = this.btn_addcash.node.getChildByName('Background').getChildByName('btn_addcash_SHOP');
      btn_add.active = GlobalCfg.USER_DATAS.isNotCharge;
      btn_addcash.active = GlobalCfg.USER_DATAS.isNotCharge;
    }
  },
  cashSwitch: function cashSwitch() {
    this.btn_add.node.active = GlobalCfg.USER_DATAS.openModules.includes(4);
    this.btn_addcash.node.active = GlobalCfg.USER_DATAS.openModules.includes(4);
    this.paymentSwitch = GlobalCfg.USER_DATAS.openModules.includes(4);
  },
  setBetCiShuAutoTips: function setBetCiShuAutoTips() {
    this.toggle_auto.isChecked = false;
    this.toggle_auto.interactable = false;
    this.lab_autoBetCiShu.string = 'AUTO';
  },
  debounce: function debounce(action, delayTime) {
    if (!delayTime) {
      return action;
    }
    var fn = function fn() {
      var btnNode = arguments[0].node;
      if (!btnNode.timeOut) {
        action.apply(this, arguments);
        btnNode.timeOut = setTimeout(function () {
          if (btnNode) {
            clearTimeout(btnNode.timeOut);
            btnNode.timeOut = null;
          }
          ;
        }, delayTime * 1000);
      }
    };
    return fn;
  },
  start: function start() {
    this.sendLoginReq();
  },
  onDestroy: function onDestroy() {
    GlobalCfg.ACT_SCENE_CTRL = null;
    ClientNotify.removeByHandle(GlobalCfg.MSG_TYPE.serverMsg, this.msgHandle);
    ClientNotify.removeByHandle(GlobalCfg.MSG_TYPE.clientMsg, this.customMsgHandle);
    CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.EXIT_FRUIT_GAME);
  },
  onEventMsg: function onEventMsg(webData, target) {
    var self = target;
    var msgId = webData.msgCode;
    var notify = webData.msgData;
    if (msgId == 'gameservice.login') {
      self.setLoginNotify(notify);
    } else if (msgId == 'gameservice.call') {
      self.setCallNotify(notify);
    } else if (msgId == GlobalCfg.CLIENT_MSG_ID.CURRENCY_CHANGED_USER_INFO) {
      var coin = notify.deposit + notify.winnings;
      self.setUserDiamond(coin);
    } else if (msgId == GlobalCfg.CLIENT_MSG_ID.FIRST_RECHARGE_TIPS) {
      SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.SGJ, SceneManager.getInstance().sceneType.LOBBY);
    } else if (msgId == GlobalCfg.CLIENT_MSG_ID.GAME_MENU_CLICK_OUT_TO_LOBBY) {
      if (self.isRunningFruitAnim) {
        CommonFun.getInstance().showMsgBox(self.tipsLabel[0], "YES_NO", function () {
          SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.SGJ, SceneManager.getInstance().sceneType.LOBBY);
        }, false);
      } else {
        SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.SGJ, SceneManager.getInstance().sceneType.LOBBY);
      }
      ;
    } else if (msgId == GlobalCfg.CLIENT_MSG_ID.GAME_MENU_CLICK_HOW_TO_PLAY) {
      CommonFun.getInstance().showRule("fruitMachine");
    } else if (msgId == "lobbyservice.kicktolobby") {
      SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.SGJ, SceneManager.getInstance().sceneType.LOBBY);
    }
  },
  checkWebMsgError: function checkWebMsgError(webData, target) {
    var self = target;
    var msgId = webData.msgCode;
    var notify = webData.msgData;
    if (!notify) {
      var info = {
        errorMessage: "FruitMachine\u6E38\u620F\u4E2D, \u670D\u52A1\u5668\u4E0B\u53D1\u7684\u975E\u6B63\u786E\u6D88\u606F\u4E2D\u7ED3\u6784\u4F53\u5F02\u5E38, \u5185\u5BB9\u4E3A===>" + JSON.stringify(webData)
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
        SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.SGJ, SceneManager.getInstance().sceneType.LOBBY);
      }, false);
    } else if (msgId === "gameservice.call") {
      if (CommonFun.getInstance().isFreePlayerDirectedToFreeTP()) {
        if (result.result == 57) {
          CommonFun.getInstance().showDiversionFreeTP(function () {
            // SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.SGJ, SceneManager.getInstance().sceneType.LOBBY);
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
  setLoginNotify: function setLoginNotify(notify) {
    if (!notify) {
      return;
    }
    this.setFreesList(notify.frees);
    this.setUserDiamond(notify.userinfo.diamond);
    var freeCountItem = this.getFreesItemOfFreeCount();
    if (freeCountItem) {
      var amount = freeCountItem.amount / 100;
      var freeCount = freeCountItem.freeCount;
      var freePool = freeCountItem.freePool / 100;
      this.lab_betAmount.string = amount;
      this.lab_totalWin.string = freePool.toFixed(1);
      this.freeTotalWinNum = freePool;
      this.lab_autoBetCiShu.string = freeCount;
      this.lab_autoBetCiShu.node.color = new cc.Color(255, 255, 51);
      this.toggle_auto.interactable = false;
      this.autoSpineNode.active = true;
      var proroID = 'gameservice.call';
      var message = 'CallReq';
      GameServerManager.send(proroID, message, {
        amount: amount * 100
      });
      return;
    }
    var betStr = this.lab_autoBetCiShu.string;
    var isAuto = this.toggle_auto.isChecked;
    if (betStr != 'AUTO' && isAuto) {
      this.sendCallReq();
    } else {
      this.btn_spin.interactable = true;
      this.btn_spin.enableAutoGrayEffect = false;
    }
  },
  setUserDiamond: function setUserDiamond(diamond) {
    GlobalCfg.USER_DATAS.userDiamond = diamond;
    var num = FloatCalculation.accDiv(GlobalCfg.USER_DATAS.userDiamond, 100);
    this.lab_jb.string = CommonFun.getInstance().numberToShow(num);
  },
  setFreesList: function setFreesList(frees) {
    if (!frees) {
      return;
    }
    ;
    this.frees = frees;
  },
  // 通过下注倍数，获取对应的免费情况
  getFreesItem: function getFreesItem(amount) {
    for (var i = 0, len = this.frees.length; i < len; i++) {
      var element = this.frees[i];
      if (element.amount == amount) {
        return element;
      }
    }
    return {};
  },
  getFreesItemOfFreeCount: function getFreesItemOfFreeCount() {
    for (var i = 0, len = this.frees.length; i < len; i++) {
      var element = this.frees[i];
      if (element.freeCount > 0) {
        return element;
      }
    }
  },
  setCallNotify: function setCallNotify(notify) {
    this.gameResult = {};
    this.gameResult.mianfeinum = notify.mianfeinum;
    this.gameResult.rewardtype = notify.rewardtype;
    this.gameResult.userinfo = notify.userinfo;
    this.gameResult.xiannum = notify.xiannum;
    this.gameResult.cards = notify.cards;
    this.gameResult.freePool = notify.freePool;
    this.unscheduleAllCallbacks();
    this.node_lines.destroyAllChildren();
    this.node_lines.removeAllChildren();
    for (var j = 0, len1 = this.node_fruitContentArr.length; j < len1; j++) {
      var children = this.node_fruitContentArr[j].children;
      for (var k = 0, len2 = children.length; k < len2; k++) {
        var src = children[k].getComponent('fruitItemCtrl');
        src.setCloseSkeletonDong(0);
      }
      ;
    }
    ;

    //设置转动的音效
    var isFast = this.toggle_fast.isChecked;
    var zhuangClipName = isFast ? 'sound/zhuang-fast' : 'sound/zhuang';
    this.playGameSound(zhuangClipName);

    //先扣除下注的金额
    if (this.gameResult.mianfeinum == 0) {
      var diamond = GlobalCfg.USER_DATAS.userDiamond - parseInt(this.lab_betAmount.string) * 100;
      var num = FloatCalculation.accDiv(diamond, 100);
      this.lab_jb.string = CommonFun.getInstance().numberToShow(num);
    }
    ;
    if (this.gameResult.rewardtype == 1) {
      this.lab_totalWin.string = 0;
      this.freeTotalWinNum = 0;
    }
    ;

    //次数递减
    var betStr = this.lab_autoBetCiShu.string;
    if (betStr != 'AUTO') {
      var betNum = parseInt(betStr) - 1;
      if (betNum == 0) {
        this.setBetCiShuAutoTips();
      } else {
        this.lab_autoBetCiShu.string = betNum;
      }
      ;
    }
    ;
    this.dealSpinBtnEvent();
    this.startFruitAnim();
  },
  componentClickCall: function componentClickCall(component) {
    var componentName = component.node.name;
    GlobalCfg.G_COMPONENTS.Audio.playButton();
    if (componentName == "btn_back") {
      CommonFun.getInstance().showGameMenu(false);
    } else if (componentName == "btn_add") {
      CommonFun.getInstance().showSmallAddCash();
    } else if (componentName == "btn_addcash") {
      CommonFun.getInstance().showSmallAddCash();
    } else if (componentName == "btn_wf") {
      CommonFun.getInstance().showRule("fruitMachine");
    } else if (componentName == "btn_setting") {
      var pab_setting = cc.instantiate(this.pab_setting);
      this.node.addChild(pab_setting);
    } else if (componentName == "btn_betJian") {
      this.dealbetBtnEvent("jian");
    } else if (componentName == "btn_betJia") {
      this.dealbetBtnEvent("jia");
    } else if (componentName == "btn_betMax") {
      this.dealbetBtnEvent("max");
    } else if (componentName == "toggle_fast") {
      this.dealFastBtnEvent();
    } else if (componentName == "btn_betCiShuForever") {
      this.dealAutoBetCiShuBtnEvent("999");
    } else if (componentName == "btn_betCiShu100") {
      this.dealAutoBetCiShuBtnEvent("100");
    } else if (componentName == "btn_betCiShu50") {
      this.dealAutoBetCiShuBtnEvent("50");
    } else if (componentName == "btn_betCiShu20") {
      this.dealAutoBetCiShuBtnEvent("20");
    } else if (componentName == "btn_auto") {
      this.dealAutoBtnEvent();
    } else if (componentName == "btn_spin") {
      this.sendCallReq();
    }
  },
  dealbetBtnEvent: function dealbetBtnEvent(btnType) {
    if (btnType == "jian" && this.betAmountArrIndex > 0) {
      this.betAmountArrIndex -= 1;
    } else if (btnType == "jia" && this.betAmountArrIndex < this.betAmountArr.length - 1) {
      this.betAmountArrIndex += 1;
    } else if (btnType == "max") {
      this.betAmountArrIndex = this.betAmountArr.length - 1;
    }
    ;
    var betAmount = this.betAmountArr[this.betAmountArrIndex];
    this.lab_betAmount.string = betAmount;
    if (this.betAmountArrIndex == 0) {
      this.setBetBtnActive(false, true);
    } else if (this.betAmountArrIndex == this.betAmountArr.length - 1) {
      this.setBetBtnActive(true, false);
    } else {
      this.setBetBtnActive(true, true);
    }
    ;
  },
  setBetBtnActive: function setBetBtnActive(betJianActive, betJiaActive) {
    this.btn_betJian.interactable = betJianActive;
    this.btn_betJian.enableAutoGrayEffect = !betJianActive;
    this.btn_betJia.interactable = betJiaActive;
    this.btn_betJia.enableAutoGrayEffect = !betJiaActive;
    this.btn_betMax.interactable = betJiaActive;
    this.btn_betMax.enableAutoGrayEffect = !betJiaActive;
  },
  dealFastBtnEvent: function dealFastBtnEvent() {},
  dealAutoBetCiShuBtnEvent: function dealAutoBetCiShuBtnEvent(ciShuType) {
    this.lab_autoBetCiShu.string = ciShuType;
    this.toggle_auto.isChecked = true;
    this.toggle_auto.interactable = true;
    this.node_tcBg.active = false;
  },
  dealAutoBtnEvent: function dealAutoBtnEvent() {
    var active = this.node_tcBg.active;
    this.node_tcBg.active = !active;
  },
  dealSpinBtnEvent: function dealSpinBtnEvent() {
    this.node_tcBg.active = false;
    this.btn_spin.interactable = false;
    this.btn_spin.enableAutoGrayEffect = true;
    this.btn_auto.interactable = false;
    this.btn_auto.enableAutoGrayEffect = true;
    this.btn_betMax.interactable = false;
    this.btn_betMax.enableAutoGrayEffect = true;
    this.btn_betJia.interactable = false;
    this.btn_betJia.enableAutoGrayEffect = true;
    this.btn_betJian.interactable = false;
    this.btn_betJian.enableAutoGrayEffect = true;
  },
  /**
   * 
   * @param {Number} startScore 开始分数
   * @param {Number} endedScore 结束分数
   * @param {Number} freeCount 免费次数
   * @param {*} time 
   */
  runChangeTotalWinScore: function runChangeTotalWinScore(startScore, endedScore, freeCount, time) {
    var _this = this;
    if (time === void 0) {
      time = 0.5;
    }
    var obj = {};
    obj.num = startScore;
    this.lab_totalWin.string = obj.num == 0 ? obj.num : obj.num.toFixed(1);
    cc.tween(obj).to(time, {
      num: endedScore
    }, {
      progress: function progress(start, end, current, t) {
        if (_this && _this.lab_totalWin) {
          if (freeCount > 0) {
            _this.lab_totalWin.string = end - start == 0 ? endedScore == 0 ? endedScore : endedScore.toFixed(1) : Number(start + (end - start) * t).toFixed(1);
          } else {
            _this.lab_totalWin.string = end - start == 0 ? 0 : Number(start + (end - start) * t).toFixed(1);
          }
        }
        ;
        return start + (end - start) * t;
      }
    }).start();
  },
  startFruitAnim: function startFruitAnim() {
    var _this2 = this;
    if (this.isRunningFruitAnim) {
      return;
    }
    ;
    this.isRunningFruitAnim = true;
    var isFast = this.toggle_fast.isChecked;
    this.kRate = isFast ? 0.45 : 1.1;
    var fruitContentTime = 0.1 * this.kRate;
    for (var i = 0, len = this.node_fruitContentArr.length; i < len; i++) {
      var children = this.node_fruitContentArr[i].children;
      var _loop = function _loop() {
        var item = children[k];
        item.repeat = 0;
        item.index = k;
        item.shu = i;
        _this2.scheduleOnce(function () {
          _this2.runFruitItemAnim(item, item.y, item.y + 165);
        }, fruitContentTime * i);
      };
      for (var k = 0, lenk = children.length; k < lenk; k++) {
        _loop();
      }
      ;
    }
    ;
  },
  runFruitItemAnim: function runFruitItemAnim(node, statrPositionY, endedPositionY) {
    var self = this;
    node.repeat += 1;
    node.setPosition(cc.v2(0, statrPositionY));
    var repeat = node.repeat;
    var index = node.index;
    var shu = node.shu;
    var easeType = '';
    var runTime = 0.08 * self.kRate;
    if (repeat == 20) {
      easeType = 'backOut';
      runTime = 0.5 * self.kRate;
    }
    ;
    cc.tween(node).to(runTime, {
      position: cc.v2(0, endedPositionY)
    }, {
      easing: easeType
    }).call(function () {
      if (repeat == 20) {
        if (endedPositionY >= 330) {
          node.setPosition(cc.v2(0, -330));
        }
        ;
        self.checkAnimFinish();
        return;
      }
      ;
      if (endedPositionY >= 330) {
        var src = node.getComponent('fruitItemCtrl');
        if (repeat == 17 && index == 0) {
          var fruitType = self.gameResult.cards[shu].cards[0];
          src.setFruitSkeletonJing(fruitType);
          node.fruitType = fruitType;
        } else if (repeat == 18 && index == 1) {
          var _fruitType = self.gameResult.cards[shu].cards[1];
          src.setFruitSkeletonJing(_fruitType);
          node.fruitType = _fruitType;
        } else if (repeat == 19 && index == 2) {
          var _fruitType2 = self.gameResult.cards[shu].cards[2];
          src.setFruitSkeletonJing(_fruitType2);
          node.fruitType = _fruitType2;
        } else {
          var num = Math.floor(Math.random() * 10 + 1);
          if (shu == 0 && num == 10) {
            num = 9;
          } else if (shu >= 3 && num == 11) {
            num = 10;
          }
          src.setFruitSkeletonJing(num);
          node.fruitType = num;
        }
        ;
        self.runFruitItemAnim(node, -330, -165);
      } else {
        self.runFruitItemAnim(node, endedPositionY, endedPositionY + 165);
      }
      ;
    }).start();
  },
  checkAnimFinish: function checkAnimFinish() {
    this.finishedFruitItemNum += 1;
    if (this.finishedFruitItemNum == 20) {
      this.finishedFruitItemNum = 0;
      this.showResultAnima();
    }
    ;
  },
  recoverySpinBtnEvent: function recoverySpinBtnEvent() {
    this.btn_spin.interactable = true;
    this.btn_spin.enableAutoGrayEffect = false;
    this.btn_auto.interactable = true;
    this.btn_auto.enableAutoGrayEffect = false;
    var betAmount = parseInt(this.lab_betAmount.string);
    if (betAmount != 10) {
      this.btn_betJian.interactable = true;
      this.btn_betJian.enableAutoGrayEffect = false;
    }
    ;
    if (betAmount != 2000) {
      this.btn_betJia.interactable = true;
      this.btn_betJia.enableAutoGrayEffect = false;
      this.btn_betMax.interactable = true;
      this.btn_betMax.enableAutoGrayEffect = false;
    }
    ;
  },
  showResultAnima: function showResultAnima() {
    var _this3 = this;
    if (this.gameResult) {
      this.setUserDiamond(this.gameResult.userinfo.diamond);
      var totalMultiple = 0;
      for (var i = 0, len = this.gameResult.xiannum.length; i < len; i++) {
        var multiple = this.gameResult.xiannum[i].multiple;
        var num = this.gameResult.xiannum[i].num;
        totalMultiple += multiple * num;
      }
      ;

      //奖励类型 (1:正常金币奖励, 2:免费次数奖励)
      var startScore = Number(this.freeTotalWinNum);
      //奖励类型 (1:正常金币奖励, 2:免费次数奖励)
      var endedScore = this.gameResult.rewardtype == 2 ? this.gameResult.freePool / 100 : totalMultiple * parseInt(this.lab_betAmount.string) / 10 + startScore;
      this.freeTotalWinNum = endedScore;
      var freeCount = this.gameResult.mianfeinum;
      this.runChangeTotalWinScore(startScore, endedScore, freeCount);
      var isNeedShowAnim = false;
      var xiannumArr = this.gameResult.xiannum;
      for (var _i = 0, _len = xiannumArr.length; _i < _len; _i++) {
        var xiannum = xiannumArr[_i];
        var xiannumLen = xiannum.len; //线的长度
        if (xiannumLen >= 3) {
          isNeedShowAnim = true;
          break;
        }
        ;
      }
      ;
      var isFast = this.toggle_fast.isChecked;
      if (isNeedShowAnim) {
        var winClipName = isFast ? 'sound/win-fast' : 'sound/win';
        this.playGameSound(winClipName);
        this.showXianNun(totalMultiple / 10, isFast);
      } else {
        this.isRunningFruitAnim = false;
      }
      ;
      var startNextSpin = function startNextSpin() {
        // this.isRunningFruitAnim = false;
        if (_this3.isRunningFruitAnim) {
          return;
        }
        ;
        _this3.unschedule(startNextSpin);
        if (_this3.gameResult.mianfeinum > 0) {
          if (_this3.gameResult.mianfeinum == 10 && _this3.isHaveMianFeiRecord == false) {
            _this3.isHaveMianFeiRecord = true;
            _this3.selectAutoBetStr = _this3.lab_autoBetCiShu.string;
            _this3.selectAutoStatus = _this3.toggle_auto.isChecked;
          }
          ;
          _this3.lab_autoBetCiShu.string = _this3.gameResult.mianfeinum;
          _this3.lab_autoBetCiShu.node.color = new cc.Color(255, 255, 51);
          _this3.toggle_auto.interactable = false;
          _this3.autoSpineNode.active = true;
          var amount = parseInt(_this3.lab_betAmount.string);
          var proroID = 'gameservice.call';
          var message = 'CallReq';
          GameServerManager.send(proroID, message, {
            amount: amount * 100
          });
        } else {
          if (_this3.isHaveMianFeiRecord) {
            _this3.isHaveMianFeiRecord = false;
            _this3.toggle_auto.isChecked = _this3.selectAutoStatus;
            _this3.lab_autoBetCiShu.string = _this3.selectAutoBetStr;
          }
          ;
          _this3.lab_autoBetCiShu.node.color = new cc.Color(217, 244, 255);
          _this3.toggle_auto.interactable = true;
          _this3.autoSpineNode.active = false;
          _this3.curRoundAddCoinFinish();
          var isAuto = _this3.toggle_auto.isChecked;
          if (isAuto) {
            _this3.sendCallReq();
          } else {
            _this3.recoverySpinBtnEvent();
          }
          ;
        }
        ;
      };
      this.schedule(startNextSpin, 0.01);
    }
    ;
  },
  curRoundAddCoinFinish: function curRoundAddCoinFinish() {
    var _this4 = this;
    if (cc.isValid(this)) {
      var minLimit = this.betAmountArr[0] || 0;
      minLimit = parseInt(minLimit) * 100;
      CommonFun.getInstance().gameShowSecondRecharge(minLimit, Number.MAX_SAFE_INTEGER, function () {
        if (cc.isValid(_this4)) {
          if (GlobalCfg.IS_SHOW_BANKRUPT) {
            //破产界面显示时才需要暂停自动spin
            _this4.toggle_auto.isChecked = false;
          }
        }
      });
      CommonFun.getInstance().showWithdrawToastInGame();
    }
  },
  showXianNun: function showXianNun(totalMultiple, isFast) {
    var _this5 = this;
    if (this.gameResult) {
      var lineArr = [];
      for (var i = 0, len = this.gameResult.xiannum.length; i < len; i++) {
        var xiannum = this.gameResult.xiannum[i];
        var card = xiannum.card; //中奖的牌
        var xiannumLen = xiannum.len; //线的长度
        var xiannumNum = xiannum.num; //线的数量
        if (xiannumLen >= 3) {
          for (var j = 0; j < xiannumNum; j++) {
            var shu0 = this.node_fruitContentArr[0];
            var shu0Node = shu0.children[i];
            var shu1TypeArr = [];
            var shu1 = this.node_fruitContentArr[1];
            for (var _j = 0; _j < 3; _j++) {
              var fruitNode = shu1.children[_j];
              var fruitType = fruitNode.fruitType;
              if (fruitType == card || fruitType == 10) {
                shu1TypeArr.push(fruitNode);
              }
              ;
            }
            ;
            var shu2TypeArr = [];
            var shu2 = this.node_fruitContentArr[2];
            for (var _j2 = 0; _j2 < 3; _j2++) {
              var _fruitNode = shu2.children[_j2];
              var _fruitType3 = _fruitNode.fruitType;
              if (_fruitType3 == card || _fruitType3 == 10) {
                shu2TypeArr.push(_fruitNode);
              }
              ;
            }
            ;
            var shu3TypeArr = [];
            if (xiannumLen >= 4) {
              var shu3 = this.node_fruitContentArr[3];
              for (var _j3 = 0; _j3 < 3; _j3++) {
                var _fruitNode2 = shu3.children[_j3];
                var _fruitType4 = _fruitNode2.fruitType;
                if (_fruitType4 == card || _fruitType4 == 10) {
                  shu3TypeArr.push(_fruitNode2);
                }
                ;
              }
              ;
            }
            ;
            var shu4TypeArr = [];
            if (xiannumLen >= 5) {
              var shu4 = this.node_fruitContentArr[4];
              for (var _j4 = 0; _j4 < 3; _j4++) {
                var _fruitNode3 = shu4.children[_j4];
                var _fruitType5 = _fruitNode3.fruitType;
                if (_fruitType5 == card || _fruitType5 == 10) {
                  shu4TypeArr.push(_fruitNode3);
                }
                ;
              }
              ;
            }
            ;
            for (var _i2 = 0; _i2 < shu1TypeArr.length; _i2++) {
              var typeArr = [];
              typeArr.push(shu0Node);
              var shu1Node = shu1TypeArr[_i2];
              typeArr.push(shu1Node);
              for (var i2 = 0; i2 < shu2TypeArr.length; i2++) {
                var typeArr2 = [].concat(typeArr);
                var shu2Node = shu2TypeArr[i2];
                typeArr2.push(shu2Node);
                if (shu3TypeArr.length > 0) {
                  for (var i3 = 0; i3 < shu3TypeArr.length; i3++) {
                    var typeArr3 = [].concat(typeArr2);
                    var shu3Node = shu3TypeArr[i3];
                    typeArr3.push(shu3Node);
                    if (shu4TypeArr.length > 0) {
                      for (var i4 = 0; i4 < shu4TypeArr.length; i4++) {
                        var typeArr4 = [].concat(typeArr3);
                        var shu4Node = shu4TypeArr[i4];
                        typeArr4.push(shu4Node);
                        lineArr.push(typeArr4);
                      }
                      ;
                    } else {
                      lineArr.push(typeArr3);
                    }
                    ;
                  }
                  ;
                } else {
                  lineArr.push(typeArr2);
                }
                ;
              }
              ;
            }
            ;
          }
          ;
        }
        ;
      }
      ;
      if (totalMultiple >= 5) {
        var allTime = 0;
        var _loop2 = function _loop2() {
          var typeArr = lineArr[_i3];
          var pointTime = isFast ? 0.1 : 0.2;
          var lineTime = _i3 == 0 ? 0 : pointTime * 2.5 * (lineArr[_i3 - 1].length - 1);
          allTime += lineTime;
          _this5.scheduleOnce(function () {
            var _loop3 = function _loop3() {
              var itemNode1 = typeArr[k];
              var itemNode2 = typeArr[k + 1];
              _this5.scheduleOnce(function () {
                _this5.drawLine(itemNode1, itemNode2, pointTime);
              }, pointTime * k);
              if (k == len1 - 2) {
                _this5.scheduleOnce(function () {
                  _this5.isRunningFruitAnim = false;
                }, pointTime * k + 3);
              }
              ;
            };
            for (var k = 0, len1 = typeArr.length; k < len1 - 1; k++) {
              _loop3();
            }
            ;
          }, lineTime);
        };
        for (var _i3 = 0, _len2 = lineArr.length; _i3 < _len2; _i3++) {
          _loop2();
        }
        ;
      } else {
        for (var _i4 = 0, _len3 = lineArr.length; _i4 < _len3; _i4++) {
          var _typeArr = lineArr[_i4];
          for (var k = 0, len1 = _typeArr.length; k < len1 - 1; k++) {
            var itemNode1 = _typeArr[k];
            var itemNode2 = _typeArr[k + 1];
            var src1 = itemNode1.getComponent('fruitItemCtrl');
            src1.setFruitSkeletonDong();
            src1.setKuangSkeletonDong();
            var src2 = itemNode2.getComponent('fruitItemCtrl');
            src2.setFruitSkeletonDong();
            src2.setKuangSkeletonDong();
          }
          ;
        }
        ;
        this.scheduleOnce(function () {
          _this5.isRunningFruitAnim = false;
        }, 1);
      }
      ;
    }
    ;
  },
  drawLine: function drawLine(startNode, endNode, time) {
    var worldPos1 = startNode.parent.convertToWorldSpaceAR(new cc.Vec2(startNode.x, startNode.y));
    var worldPos2 = endNode.parent.convertToWorldSpaceAR(new cc.Vec2(endNode.x, endNode.y));
    var localPos1 = this.node_lines.convertToNodeSpaceAR(worldPos1);
    var localPos2 = this.node_lines.convertToNodeSpaceAR(worldPos2);
    var lineNode = new cc.Node();
    this.node_lines.addChild(lineNode);
    var graphics = lineNode.addComponent(cc.Graphics);
    graphics.lineWidth = 10;
    graphics.lineCap = cc.Graphics.LineCap.ROUND;
    graphics.strokeColor = cc.Color.RED;
    graphics.moveTo(localPos1.x, localPos1.y);
    var src1 = startNode.getComponent('fruitItemCtrl');
    src1.setFruitSkeletonDong();
    src1.setKuangSkeletonDong();
    this.scheduleOnce(function () {
      graphics.lineTo(localPos2.x, localPos2.y);
      graphics.stroke();
      var src2 = endNode.getComponent('fruitItemCtrl');
      src2.setFruitSkeletonDong();
      src2.setKuangSkeletonDong();
    }, time);
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
  sendCallReq: function sendCallReq() {
    var _this6 = this;
    if (GlobalCfg.USER_DATAS.isNotCharge == true && GlobalCfg.USER_DATAS.gamePattern == 0 && GlobalCfg.USER_DATAS.refuseUnpayHundred == true) {
      //未曾充值
      CommonFun.getInstance().showMsgBox("This feature is available only for premium players . Add cash now to become a premium player .", "SHOP", function () {
        if (_this6.paymentSwitch) {
          CommonFun.getInstance().showSmallAddCash();
        }
      }, false);
      return;
    }
    ;
    var betAmount = parseInt(this.lab_betAmount.string) * 100;
    var freesItem = this.getFreesItem(betAmount);
    var freeCount = freesItem.freeCount;
    if (betAmount > GlobalCfg.USER_DATAS.userDiamond && freeCount <= 0) {
      this.recoverySpinBtnEvent();
      CommonFun.getInstance().showMsgBox(this.tipsLabel[5], "SHOP", function () {
        if (_this6.paymentSwitch) {
          CommonFun.getInstance().showSmallAddCash();
        }
      }, false);
      return;
    }
    ;
    var proroID = 'gameservice.call';
    var message = 'CallReq';
    GameServerManager.send(proroID, message, {
      amount: betAmount
    });
  }
});

cc._RF.pop();