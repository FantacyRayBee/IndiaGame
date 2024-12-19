"use strict";
cc._RF.push(module, 'ee68a5NIJVEUKIur+TpDFbX', 'zeusHeadAreaCtrl');
// zeusGame/src/zeusHeadAreaCtrl.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    node_swTip: cc.Node,
    node_tumbleWin: cc.Node,
    lab_currentXMul: cc.Label,
    lab_currentXMark: cc.Label,
    lab_mulWinScore: cc.Label,
    lab_notMulWinScore: cc.Label,
    node_title0: cc.Node,
    node_title1: cc.Node,
    node_title2: cc.Node,
    node_title3: cc.Node
  },
  ctor: function ctor() {
    this.currentElfMul = 0;
    this.currentXMul = 0;
    this.currentBet = 0;
    this.curTitleIndex = 0;
    this.isHaveTitleTimer = false;
  },
  onLoad: function onLoad() {
    this.lab_currentXMark.string = "";
    this.lab_currentXMul.string = "";
    this.lab_mulWinScore.string = "";
    this.lab_notMulWinScore.string = "$0.00";
    this.startTitleAnima();
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
    } else if (msgId == GlobalCfg.CLIENT_MSG_ID.ZEUS_SPIN_STARTING) {
      self.dealSpinStartingEvent(notify);
    } else if (msgId == GlobalCfg.CLIENT_MSG_ID.ZEUS_ALL_SPIN_FINISHED) {
      self.dealAllSpinFinishedEvent(notify);
    }
  },
  dealOnceEraseFinishedEvent: function dealOnceEraseFinishedEvent(notify) {
    var _this = this;
    if (!notify) {
      return;
    }
    ;
    var erase = notify.erase;
    var currentElfMul = erase.currentElfMul;
    var currentXMul = erase.currentXMul;
    var bet = erase.bet;
    var isLastOne = erase.isLastOne;
    this.currentElfMul = currentElfMul;
    this.currentXMul = currentXMul;
    this.currentBet = bet;
    if (this.isHaveTitleTimer) {
      this.stopTitleAnima();
    }
    ;
    if (erase.elf == 12) {
      this.curSpinHaveXMul = true;
    }
    ;
    if (this.curSpinHaveXMul) {
      this.lab_currentXMark.string = "X";
      this.lab_notMulWinScore.string = "";
      this.setCurrentXMul(currentXMul);
      this.setCurrentElfMul(currentElfMul * bet / 2000);
    } else {
      this.lab_currentXMark.string = "";
      this.lab_mulWinScore.string = "";
      this.lab_currentXMul.string = "";
      currentXMul = currentXMul > 0 ? currentXMul : 1;
      this.setCurrentElfMul2(currentXMul * currentElfMul * bet / 2000);
    }
    ;
    if (isLastOne && this.curSpinHaveXMul) {
      this.scheduleOnce(function () {
        GlobalCfg.ACT_SCENE_CTRL.zeusAudiosCtrl.playScoreMultiplyEffect();
        currentXMul = currentXMul > 0 ? currentXMul : 1;
        _this.playMultiplyAnima(currentElfMul * currentXMul * bet / 2000);
      }, 0.6);
    }
    ;
  },
  dealSpinStartingEvent: function dealSpinStartingEvent(notify) {
    this.curSpinHaveXMul = false;
    this.currentElfMul = 0;
    this.currentXMul = 0;
    this.currentBet = 0;
    this.lab_currentXMark.string = "";
    this.lab_currentXMul.string = "";
    this.lab_mulWinScore.string = "";
    this.lab_mulWinScore.node.setPosition(cc.v2(1.6, -15));
    this.lab_currentXMul.node.setPosition(cc.v2(44.2, -15));
    this.lab_notMulWinScore.string = "$0.00";
    if (this.isHaveTitleTimer == false) {
      this.startTitleAnima();
    }
    ;
  },
  dealAllSpinFinishedEvent: function dealAllSpinFinishedEvent(notify) {},
  playMultiplyAnima: function playMultiplyAnima(winScore) {
    var _this2 = this;
    cc.tween(this.lab_mulWinScore.node).to(0.2, {
      position: cc.v2(1.6 + 50, -15)
    }).start();
    cc.tween(this.lab_currentXMul.node).to(0.2, {
      position: cc.v2(44.2 - 50, -15)
    }).start();
    this.scheduleOnce(function () {
      GlobalCfg.ACT_SCENE_CTRL.zeusAudiosCtrl.playScoreMultiplyEndEffect();
      _this2.lab_mulWinScore.node.setPosition(cc.v2(1.6, -15));
      _this2.lab_currentXMul.node.setPosition(cc.v2(44.2, -15));
      _this2.lab_currentXMark.string = "";
      _this2.lab_currentXMul.string = "";
      _this2.lab_mulWinScore.string = "";
      _this2.lab_notMulWinScore.string = "$" + GlobalCfg.ACT_SCENE_CTRL.getCoinFormatStr(winScore);
      cc.tween(_this2.lab_notMulWinScore.node).to(0.1, {
        scale: 1.3
      }).to(0.1, {
        scale: 1
      }).start();
    }, 0.2);
  },
  setCurrentElfMul: function setCurrentElfMul(score) {
    var _this3 = this;
    if (score == 0) {
      this.lab_mulWinScore.string = "";
      return;
    }
    ;
    var obj = {};
    var str = this.lab_mulWinScore.string;
    if (str.includes("$")) {
      obj.num = Number(str.slice(1));
    } else {
      obj.num = Number(str);
    }
    ;
    if (obj.num == score) {
      return;
    }
    ;
    cc.tween(obj).to(0.5, {
      num: score
    }, {
      progress: function progress(start, end, current, t) {
        if (_this3 && _this3.lab_mulWinScore) {
          var temp = end - start == 0 ? GlobalCfg.ACT_SCENE_CTRL.getCoinFormatStr(score) : GlobalCfg.ACT_SCENE_CTRL.getCoinFormatStr(start + (end - start) * t);
          _this3.lab_mulWinScore.string = "$" + temp;
        }
        ;
        return start + (end - start) * t;
      }
    }).start();
  },
  setCurrentElfMul2: function setCurrentElfMul2(score) {
    var _this4 = this;
    if (score == 0) {
      this.lab_notMulWinScore.string = "$0.00";
      return;
    }
    ;
    var obj = {};
    var str = this.lab_notMulWinScore.string;
    if (str.includes("$")) {
      obj.num = Number(str.slice(1));
    } else {
      obj.num = Number(str);
    }
    ;
    if (obj.num == score) {
      return;
    }
    ;
    cc.tween(obj).to(0.5, {
      num: score
    }, {
      progress: function progress(start, end, current, t) {
        if (_this4 && _this4.lab_notMulWinScore) {
          var temp = end - start == 0 ? GlobalCfg.ACT_SCENE_CTRL.getCoinFormatStr(score) : GlobalCfg.ACT_SCENE_CTRL.getCoinFormatStr(start + (end - start) * t);
          _this4.lab_notMulWinScore.string = "$" + temp;
        }
        ;
        return start + (end - start) * t;
      }
    }).start();
  },
  setCurrentXMul: function setCurrentXMul(mul) {
    if (mul == 0) {
      this.lab_currentXMul.string = "";
      return;
    }
    ;
    var oldXMul = Number(this.lab_currentXMul.string);
    if (oldXMul == mul) {
      return;
    }
    ;
    this.lab_currentXMul.string = Number(mul).toFixed(0);
    cc.tween(this.lab_currentXMul.node).to(0.1, {
      scale: 1.3
    }).to(0.1, {
      scale: 1
    }).start();
  },
  getMultLabNode: function getMultLabNode() {
    return this.lab_currentXMul.node;
  },
  getCurSpinHaveXMul: function getCurSpinHaveXMul() {
    return this.curSpinHaveXMul;
  },
  showFinishedAllMultFlyState: function showFinishedAllMultFlyState(currentXMul) {
    this.lab_mulWinScore.node.setPosition(cc.v2(1.6, -15));
    this.lab_currentXMul.node.setPosition(cc.v2(44.2, -15));
    this.lab_notMulWinScore.string = "";
    this.lab_mulWinScore.string = "$" + GlobalCfg.ACT_SCENE_CTRL.getCoinFormatStr(this.currentElfMul * this.currentBet / 2000);
    this.lab_currentXMark.string = "X";
    this.lab_currentXMul.string = "" + Number(currentXMul).toFixed(0);
    cc.tween(this.lab_currentXMul.node).to(0.1, {
      scale: 1.3
    }).to(0.1, {
      scale: 1
    }).start();
  },
  startTitleAnima: function startTitleAnima() {
    this.isHaveTitleTimer = true;
    this.node_swTip.active = true;
    this.node_tumbleWin.active = false;
    this.schedule(this.titleAnima, 8);
  },
  stopTitleAnima: function stopTitleAnima() {
    this.isHaveTitleTimer = false;
    this.node_swTip.active = false;
    this.node_tumbleWin.active = true;
    this.unschedule(this.titleAnima);
  },
  titleAnima: function titleAnima() {
    if (this.curTitleIndex >= 4) {
      this.curTitleIndex = 0;
    }
    ;
    this.node_title0.active = this.curTitleIndex == 0;
    this.node_title1.active = this.curTitleIndex == 1;
    this.node_title2.active = this.curTitleIndex == 2;
    this.node_title3.active = this.curTitleIndex == 3;
    this.curTitleIndex += 1;
  }
});

cc._RF.pop();