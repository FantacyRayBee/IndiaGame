"use strict";
cc._RF.push(module, '2e694dKQWFHRKfwa70sLEVJ', 'CarouselStripCtrl');
// ResourcesBundle/NewPlan/CarouselStrip/CarouselStripCtrl.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    label: cc.RichText
  },
  ctor: function ctor() {
    this.isPlayPMD = true; // 是否播放下一条广播

    this.isRobot = 2; // 0是机器人 1真人 2 没有人
  },
  onLoad: function onLoad() {
    this.node_PMD = this.node.getChildByName("pmd");
    this.showPMDlabel();
  },

  /**
   * 监听有没有跑马灯消息
   */
  showPMDlabel: function showPMDlabel() {
    var _this = this;

    if (GlobalCfg.USER_DATAS.openModules.includes(16) == false) {
      return;
    }

    ;
    this.unscheduleAllCallbacks();
    this.schedule(function () {
      if (_this.isPlayPMD) {
        _this.isPlayPMD = false;
        _this.node_PMD.active = true;

        _this.label.node.setPosition(340, 0);

        if (GlobalCfg.MAR_QUEE_DATA.length > 0) {
          // 真人
          _this.isRobot = 0;
          _this.label.string = _this.switchText(GlobalCfg.MAR_QUEE_DATA[0]);
        } else if (GlobalCfg.MAR_QUEE_DATA_ROBOT.length > 0) {
          //机器人     
          _this.isRobot = 1;
          _this.label.string = _this.switchText(GlobalCfg.MAR_QUEE_DATA_ROBOT[0]);
        } else {
          // 没有人
          _this.node_PMD.active = false;
        }

        ;
        var X = -324 - _this.label.node.width;
        cc.tween(_this.label.node).tag(100).to(10, {
          position: cc.v2(X, 0)
        }).call(function () {
          if (_this.isRobot == 0) {
            GlobalCfg.MAR_QUEE_DATA.splice(0, 1);
          } else if (_this.isRobot == 1) {
            GlobalCfg.MAR_QUEE_DATA_ROBOT.splice(0, 1);
          }

          ;
          _this.isPlayPMD = true;
        }).start();
      }
    }, 0.5);
  },

  /**
  * 显示跑马灯文字内容的颜色
  * @param {跑马灯数据} data 
  * @returns 
  */
  switchText: function switchText(data) {
    var event = data.event;
    var str = '';
    var C1 = '<color=#98EAB0>player' + data.params[0];
    var C2 = "<color=#98EAB0>";
    var b = Number(data.params[1]) / 100;
    var c = data.params[3];

    if (event == 0) {
      str = data.params[0];
    } else if (event == 1) {
      str = C1 + "</c>  Recharge  " + C2 + b + "</c>  Rs";
    } else if (event == 2) {
      str = C1 + "</c>  Withdraw  " + C2 + b + "</c>  Rs";
    } else if (event == 3) {
      var productId = data.productId;
      var product = Reflect.has(data, 'product') ? data.product : "";
      var gameName = "  in  " + data.params[2];

      if (product == "miniteenpatti") {
        str = C1 + "</c>  get " + C2 + c + "</c>  and  win  " + C2 + b + "</c>" + gameName;
      } else {
        str = C1 + "</c>  win " + C2 + c + "</c>" + C2 + " " + b + "</c>" + gameName;
      }
    }

    ;
    return str;
  }
});

cc._RF.pop();