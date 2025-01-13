"use strict";
cc._RF.push(module, 'c06e57z9oBESoQqsN7vH+6w', 'ChangeLabelToSetNum');
// ResourcesBundle/NewPlan/NewFirstRechargeTips/ChangeLabelToSetNum.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {},
  onLoad: function onLoad() {
    this.label = this.node.getComponent(cc.Label);
    this.sound = this.node.getComponent(cc.AudioSource);
  },
  ctor: function ctor() {
    this.reduceOldAmount = false; // 减少原始金币
    this.addOldAmount = false; // 增加原始金币
    this.oldNum = 0;
    this.newNum = 0;
    this.rateSection = 0; // 帧减少金币
  },
  start: function start() {},
  /**
   * 
   * @param {boolean} isShow 是否开始
   * @param {number} oldNum 
   * @param {number} newNum 
   * @param {LabelAnimationType} type 
   */
  setLabelShowAnimation: function setLabelShowAnimation(isShow, oldNum, newNum, type, duringTime) {
    if (duringTime === void 0) {
      duringTime = 1;
    }
    this.label.string = this.oldNum;
    this.oldNum = oldNum;
    this.newNum = newNum;
    var gameFrameRate = cc.game.getFrameRate();
    this.rateSection = Number(Number(Math.abs(oldNum - newNum) / (gameFrameRate * duringTime)).toFixed(2));
    if (type == 1) {
      this.reduceOldAmount = isShow;
    } else {
      this.addOldAmount = isShow;
    }
    var yinXiaoState = cc.sys.localStorage.getItem("toggle_yinxiao");
    if (yinXiaoState == null || yinXiaoState == "0") {
      this.sound.play();
    }
  },
  update: function update(dt) {
    if (this.reduceOldAmount == true) {
      var newNum = Number(this.oldNum - this.rateSection);
      if (newNum <= this.newNum) {
        this.label.string = this.newNum.toFixed(2);
        this.reduceOldAmount = false;
        this.sound.stop();
        this.sendClineMsg("FirstRechargeReduceLabelFinsh");
      } else {
        this.oldNum = newNum;
        this.label.string = Number(newNum).toFixed(2);
      }
    }
    if (this.addOldAmount == true) {
      var _newNum = Number(this.oldNum + this.rateSection);
      if (_newNum >= this.newNum) {
        this.label.string = this.newNum.toFixed(2);
        this.addOldAmount = false;
        this.sound.stop();
        this.sendClineMsg("FirstRechargeAddLabelFinsh");
      } else {
        this.oldNum = _newNum;
        this.label.string = Number(_newNum).toFixed(2);
      }
    }
  },
  sendClineMsg: function sendClineMsg(code) {
    ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, {
      msgCode: code,
      msgData: {}
    });
  }
});

cc._RF.pop();