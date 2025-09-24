"use strict";
cc._RF.push(module, 'ca6e6BMoO5Jc6cObxHNd+EJ', 'cricketSeatCtrl');
// cricketGame/scripts/cricketSeatCtrl.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    seatId: {
      "default": 0,
      type: cc.Integer,
      tooltip: CC_DEV && '请在Inspector中设置'
    },
    // 是否是自己的座位,减少离座消息的发送
    isSelf: {
      "default": false,
      visible: false
    }
  },
  // LIFE-CYCLE CALLBACKS:
  // onLoad () {},
  start: function start() {
    var _this = this;

    this.node.on(cc.Node.EventType.TOUCH_END, function () {
      GlobalCfg.G_COMPONENTS.Audio.playButton();

      if (_this.node.childrenCount == 0) {
        // 当前座位无人，入座
        ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, {
          msgCode: "GAME_CRICKET_SEAT_Site",
          msgData: {
            seatId: _this.seatId
          }
        });
      } else {
        if (_this.isSelf) {
          // 出座
          ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, {
            msgCode: "GAME_CRICKET_SEAT_Leave",
            msgData: {
              seatId: _this.seatId
            }
          });
        } else {
          CommonFun.getInstance().showMsgBox("The seat is already occupied by someone else. Please go to another seat to take your seat!", "YES", function () {}, false);
        }
      }
    });
  } // update (dt) {},

});

cc._RF.pop();