"use strict";
cc._RF.push(module, 'fd457hX6ZJNhY5MWV+YsBO5', 'zeusBottomAreaCtrl');
// zeusGame/src/zeusBottomAreaCtrl.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    btn_rule: cc.Button,
    btn_reduce: cc.Button,
    btn_add: cc.Button,
    btn_maxBet: cc.Button,
    btn_spin: cc.Button,
    tog_auto: cc.Toggle,
    lab_bet: cc.Label,
    lab_allWin: cc.Label
  },
  ctor: function ctor() {
    this.betArr = [];
    this.betIndex = 0;
    this.normalWinMul = 0;
    this.isDoubleMulti = false;
  },
  onLoad: function onLoad() {
    this.setAllWinScore(0, false);
    this.btn_rule.node.on("click", CommonFun.getInstance().debounce(this.btnClick, 1), this);
    this.btn_reduce.node.on("click", CommonFun.getInstance().debounce(this.btnClick, 0), this);
    this.btn_add.node.on("click", CommonFun.getInstance().debounce(this.btnClick, 0), this);
    this.btn_maxBet.node.on("click", CommonFun.getInstance().debounce(this.btnClick, 0), this);
    this.btn_spin.node.on("click", CommonFun.getInstance().debounce(this.btnClick, 1), this);
    this.tog_auto.node.on("toggle", this.toggleClick, this);
    this.customMsgHandle = ClientNotify.register(GlobalCfg.MSG_TYPE.clientMsg, this.onEventMsg, this);
  },
  onDestroy: function onDestroy() {
    ClientNotify.removeByHandle(GlobalCfg.MSG_TYPE.clientMsg, this.customMsgHandle);
  },
  onEventMsg: function onEventMsg(webData, target) {
    var self = target;
    var msgId = webData.msgCode;
    var notify = webData.msgData;
    if (msgId == GlobalCfg.CLIENT_MSG_ID.ZEUS_ONCE_ERASE_FINISHED) {
      self.dealOnceEraseFinishedEvent(notify);
    }
  },
  setDoubleMultiState: function setDoubleMultiState(state) {
    this.isDoubleMulti = state;
  },
  dealOnceEraseFinishedEvent: function dealOnceEraseFinishedEvent(notify) {
    if (!notify) {
      return;
    }
    ;
    var erase = notify.erase;
    var bet = erase.bet;
    var progressAllMul = erase.progressAllMul;
    this.setAllWinScore(progressAllMul * bet / 2000, true);
  },
  setAllWinScore: function setAllWinScore(score, isAnim) {
    var _this = this;
    if (!isAnim || score == 0) {
      this.lab_allWin.string = GlobalCfg.ACT_SCENE_CTRL.getCoinFormatStr(score);
      return;
    }
    ;
    var oldScore = Number(this.lab_allWin.string);
    if (score == oldScore) {
      this.lab_allWin.string = GlobalCfg.ACT_SCENE_CTRL.getCoinFormatStr(score);
      return;
    }
    ;
    var obj = {};
    obj.num = Number(this.lab_allWin.string);
    cc.tween(obj).to(0.5, {
      num: score
    }, {
      progress: function progress(start, end, current, t) {
        if (_this && _this.lab_allWin) {
          var temp = end - start == 0 ? GlobalCfg.ACT_SCENE_CTRL.getCoinFormatStr(score) : GlobalCfg.ACT_SCENE_CTRL.getCoinFormatStr(start + (end - start) * t);
          _this.lab_allWin.string = temp;
        }
        ;
        return start + (end - start) * t;
      }
    }).start();
  },
  removeWinScore: function removeWinScore() {
    this.setAllWinScore(0, false);
  },
  btnClick: function btnClick(btn) {
    var btnName = btn.node.name;
    switch (btnName) {
      case this.btn_rule.node.name:
        GlobalCfg.G_COMPONENTS.Audio.playButton();
        this.dealBtnRuleEvent();
        break;
      case this.btn_reduce.node.name:
        GlobalCfg.ACT_SCENE_CTRL.zeusAudiosCtrl.playClickNormalBtnEffect();
        this.dealBtnReduceEvent();
        break;
      case this.btn_add.node.name:
        GlobalCfg.ACT_SCENE_CTRL.zeusAudiosCtrl.playClickNormalBtnEffect();
        this.dealBtnAddEvent();
        break;
      case this.btn_maxBet.node.name:
        GlobalCfg.ACT_SCENE_CTRL.zeusAudiosCtrl.playClickNormalBtnEffect();
        this.dealBtnMaxBetEvent();
        break;
      case this.btn_spin.node.name:
        GlobalCfg.ACT_SCENE_CTRL.zeusAudiosCtrl.playClickSpinBtnEffect();
        this.dealBtnSpinEvent();
        break;
      default:
        break;
    }
  },
  toggleClick: function toggleClick(tog) {
    var togName = tog.node.name;
    GlobalCfg.ACT_SCENE_CTRL.zeusAudiosCtrl.playClickNormalBtnEffect();
    switch (togName) {
      case this.tog_auto.node.name:
        this.dealTogAutoEvent();
        break;
      default:
        break;
    }
  },
  dealTogAutoEvent: function dealTogAutoEvent() {
    ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, {
      msgCode: GlobalCfg.CLIENT_MSG_ID.ZEUS_TRIGGER_AUTO_TOGGLE,
      msgData: {
        isAuto: this.getTogAutoCheckedStatus()
      }
    });
  },
  dealBtnRuleEvent: function dealBtnRuleEvent() {
    CommonFun.getInstance().showRule("zeusGame");
  },
  dealBtnReduceEvent: function dealBtnReduceEvent() {
    if (this.betIndex > 0) {
      this.betIndex -= 1;
    }
    ;
    this.setBetBtnsAndLabByIndex(this.betIndex);
  },
  dealBtnAddEvent: function dealBtnAddEvent() {
    if (this.betIndex < this.betArr.length - 1) {
      this.betIndex += 1;
    }
    ;
    this.setBetBtnsAndLabByIndex(this.betIndex);
  },
  dealBtnMaxBetEvent: function dealBtnMaxBetEvent() {
    this.betIndex = this.betArr.length - 1;
    this.setBetBtnsAndLabByIndex(this.betIndex);
  },
  dealBtnSpinEvent: function dealBtnSpinEvent() {
    //playnow模式下 首充玩家 弹VIP弹框
    if (GlobalCfg.USER_DATAS.recharged == 0 && GlobalCfg.GAME_ENTER_ISFREE == false) {
      CommonFun.getInstance().showVipRechargeToast();
      return;
    }
    this.setBtnSpinInteractableStatus(false);
    var bet = this.betArr[this.betIndex];
    ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, {
      msgCode: GlobalCfg.CLIENT_MSG_ID.ZEUS_SEND_SPIN_REQ,
      msgData: {
        bet: bet,
        isDoubleMulti: this.isDoubleMulti
      }
    });
  },
  setBetArr: function setBetArr(arr) {
    if (!Array.isArray(arr)) {
      LoggerUtil.getInstance().warn("setBetArr: arr is not an array");
      return;
    }
    ;
    this.betArr = arr;
  },
  getBetArr: function getBetArr() {
    return this.betArr;
  },
  setCurBetIndex: function setCurBetIndex(betIndex) {
    if (betIndex === void 0) {
      betIndex = 0;
    }
    this.betIndex = betIndex;
    this.setBetBtnsAndLabByIndex(this.betIndex);
  },
  getCurBetIndex: function getCurBetIndex() {
    return this.betIndex;
  },
  setBetBtnsAndLabByIndex: function setBetBtnsAndLabByIndex(betIndex) {
    if (betIndex >= this.betArr.length - 1) {
      this.setBtnAddInteractableStatus(false);
      this.setBtnMaxBetInteractableStatus(false);
    } else {
      this.setBtnAddInteractableStatus(true);
      this.setBtnMaxBetInteractableStatus(true);
    }
    ;
    if (betIndex == 0) {
      this.setBtnReduceInteractableStatus(false);
    } else {
      this.setBtnReduceInteractableStatus(true);
    }
    ;
    var bet = this.betArr[betIndex];
    if (typeof bet != "number") {
      LoggerUtil.getInstance().warn("bet is not a number");
      this.lab_bet.string = "$0";
      return;
    }
    ;
    var tempBet = this.isDoubleMulti ? bet * 1.25 : bet;
    this.lab_bet.string = "$" + tempBet / 100;
    ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, {
      msgCode: GlobalCfg.CLIENT_MSG_ID.ZEUS_SELECTED_BET_FRESH,
      msgData: {
        bet: bet
      }
    });
  },
  setBtnReduceInteractableStatus: function setBtnReduceInteractableStatus(bool) {
    this.btn_reduce.interactable = bool;
    this.btn_reduce.enableAutoGrayEffect = !bool;
  },
  setBtnAddInteractableStatus: function setBtnAddInteractableStatus(bool) {
    this.btn_add.interactable = bool;
    this.btn_add.enableAutoGrayEffect = !bool;
  },
  setBtnMaxBetInteractableStatus: function setBtnMaxBetInteractableStatus(bool) {
    this.btn_maxBet.interactable = bool;
    this.btn_maxBet.enableAutoGrayEffect = !bool;
  },
  setTogAutoCheckedStatus: function setTogAutoCheckedStatus(bool) {
    this.tog_auto.isChecked = bool;
  },
  setTogAutoInteractableStatus: function setTogAutoInteractableStatus(bool) {
    this.tog_auto.interactable = bool;
    this.tog_auto.enableAutoGrayEffect = !bool;
  },
  getTogAutoCheckedStatus: function getTogAutoCheckedStatus() {
    return this.tog_auto.isChecked;
  },
  setBtnSpinInteractableStatus: function setBtnSpinInteractableStatus(bool) {
    this.btn_spin.interactable = bool;
    this.btn_spin.enableAutoGrayEffect = !bool;
  }
});

cc._RF.pop();