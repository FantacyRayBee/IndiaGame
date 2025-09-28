"use strict";
cc._RF.push(module, 'e5849Z5nMFPpIlshIH8tlqB', 'cricketCurBetCtrl');
// cricketGame/scripts/cricketCurBetCtrl.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    curBetNum: {
      get: function get() {
        return this._curBetNum;
      },
      set: function set(value) {
        this._curBetNum = value;
        LoggerUtil.getInstance().log("当前单注值：" + this._curBetNum);
      },
      type: cc.Integer,
      tooltip: "当前下注数"
    },
    btns: {
      "default": [],
      type: [cc.Button]
    },
    selectLight: cc.Node
  },
  ctor: function ctor() {
    this._curBetNum = 10;
    this.betNumList = [100, 1000, 2000, 5000, 10000];
    this.showBetSpineTimeInterval = 15; // 显示下注动画的时间间隔
    this.showBetSpineTime = 0;
  },
  onLoad: function onLoad() {
    var _this = this;
    this.choiceBetButton(this.btns[0], this.selectLight);
    var _loop = function _loop(i) {
      var btn = _this.btns[i];
      btn.node.on("click", function (button) {
        GlobalCfg.G_COMPONENTS.Audio.playButton();
        _this.curBetNum = _this.betNumList[i];
        _this.choiceBetButton(button, _this.selectLight);
      }, _this);
    };
    for (var i = 0; i < this.btns.length; i++) {
      _loop(i);
    }
  },
  start: function start() {},
  choiceBetButton: function choiceBetButton(button, selectLight) {
    var scale = 1.1;
    var btnName = button.node.name;
    selectLight.setScale(scale);
    for (var i = 0; i < this.btns.length; i++) {
      var btn = this.btns[i];
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
  initBetNum: function initBetNum(arr) {
    if (arr && Array.isArray(arr)) {
      this.betNumList.length = 0;
      this.betNumList = arr.slice(0, 5);
      for (var i = 0; i < this.btns.length; i++) {
        var btn = this.btns[i];
        btn.node.getChildByName('lab').getComponent(cc.Label).string = Math.round(this.betNumList[i] / 100);
      }
      this.curBetNum = this.betNumList[0];
    }
  },
  showBtnBetSpine: function showBtnBetSpine() {
    var _this2 = this;
    var animationName = 'animation';
    var len = this.btns.length,
      i = 0;
    this.scheduleBetSpineTimeCallback = function () {
      var spine = _this2.btns[i].node.getChildByName('spine').getComponent(sp.Skeleton);
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
  onDestroy: function onDestroy() {
    this.unschedule(this.scheduleBetSpineTimeCallback);
  }
});

cc._RF.pop();