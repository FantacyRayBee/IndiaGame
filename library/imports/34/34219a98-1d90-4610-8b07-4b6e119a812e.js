"use strict";
cc._RF.push(module, '34219qYHZBGEIsHS24RmoEu', 'ActivityTurnTableCtrl');
// ResourcesBundle/NewPlan/Activity/ActivityTurnTableCtrl.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    lab_remainingTimes: cc.Label,
    btn_go: cc.Button,
    node_wheel: cc.Node
  },
  ctor: function ctor() {
    // 各个奖励角度
    this.awardAngle = [338.5, 293.5, 249.5, 204.5, 156.5, 112.5, 69.5, 22.5];
  },
  onLoad: function onLoad() {
    this.btn_go.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
    this.btn_go.interactable = false;
    this.lab_remainingTimes.string = "0";
  },
  start: function start() {
    var _this = this;
    var remainCountPromise = this.getTurnTableRemainCount();
    remainCountPromise.then(function (remainCount) {
      if (CommonFun.getInstance().isValidForScr(_this)) {
        _this.lab_remainingTimes.string = remainCount;
        if (remainCount > 0) {
          _this.btn_go.interactable = true;
          _this.btn_go.enableAutoGrayEffect = false;
        } else {
          _this.btn_go.interactable = false;
          _this.btn_go.enableAutoGrayEffect = true;
        }
        ;
      }
      ;
    })["catch"](function (error) {
      LoggerUtil.getInstance().log(error);
    });
  },
  btnClick: function btnClick(btn) {
    var _this2 = this;
    GlobalCfg.G_COMPONENTS.Audio.playButton();
    var timestamp = GlobalCfg.USER_DATAS.userVip.system_time;
    if (GlobalCfg.USER_DATAS.userVip.level == false || GlobalCfg.USER_DATAS.userVip.level == 0 || GlobalCfg.USER_DATAS.userVip.level > 0 && timestamp < GlobalCfg.USER_DATAS.userVip.expires_time) {
      this.btn_go.interactable = false;
      var url = GlobalCfg.HTTP_SERVER + "/v1/turntabledraw";
      CommonFun.getInstance().httpGet(url, function (jsonObj) {
        if (jsonObj.result == 0) {
          GlobalCfg.USER_DATAS.turntableRemainCount = jsonObj.data.remaincount;
          if (CommonFun.getInstance().isValidForScr(_this2)) {
            GlobalCfg.G_COMPONENTS.Audio.playSoundByNameInResources("turnPlate", false);
            _this2.trunPlateRotation(jsonObj.data);
          }
          ;
        } else {
          CommonFun.getInstance().showTips(jsonObj.msg);
        }
        ;
      }, null, GlobalCfg.USER_DATAS.BearerToken);
    } else {
      CommonFun.getInstance().showMsgBox('Your VIP has expired , you can activate it after recharging !', 'ADDCASH', function () {
        CommonFun.getInstance().showNewShop(false, GlobalCfg.SHOP_RECHARGE_FROM.VipExpired);
      }, false);
    }
  },
  trunPlateRotation: function trunPlateRotation(data) {
    var _this3 = this;
    var awardno = data.awardno;
    var remaincount = data.remaincount;
    this.compensation = this.node_wheel.angle % 360 + 360;
    //旋转时间
    var rotationTime = 3.59;
    //旋转圈数
    var rotationcircle = 2;
    //奖励圈数
    var RotationAngle = this.node_wheel.angle - rotationcircle * 360 - this.awardAngle[awardno - 1] - this.compensation;
    cc.tween(this.node_wheel).to(rotationTime, {
      angle: RotationAngle
    }, {
      easing: 'sineInOut'
    }).call(function () {
      if (awardno != 2) {
        GlobalCfg.G_COMPONENTS.Audio.playSoundByNameInResources("sign", false);
        var rewaird = {
          1: 5,
          3: 10,
          4: 1000,
          5: 1,
          6: 50,
          7: 100,
          8: 500
        };
        CommonFun.getInstance().showRewardsTips([{
          id: 10,
          amount: rewaird[awardno]
        }]);
      }
      ;
      if (remaincount <= 0) {
        _this3.btn_go.interactable = false;
        _this3.btn_go.enableAutoGrayEffect = true;
      } else {
        _this3.btn_go.interactable = true;
        _this3.btn_go.enableAutoGrayEffect = false;
      }
      ;
      _this3.lab_remainingTimes.string = remaincount;
    }).start();
  },
  getTurnTableRemainCount: function getTurnTableRemainCount() {
    return new Promise(function (resolve, reject) {
      if (Reflect.has(GlobalCfg.USER_DATAS, 'turntableRemainCount')) {
        resolve(GlobalCfg.USER_DATAS.turntableRemainCount);
        return;
      }
      ;
      var url = GlobalCfg.HTTP_SERVER + "/v1/turntableremaincount";
      CommonFun.getInstance().httpGet(url, function (jsonObj) {
        if (jsonObj.result == 0) {
          GlobalCfg.USER_DATAS.turntableRemainCount = jsonObj.data.remaincount;
          resolve(GlobalCfg.USER_DATAS.turntableRemainCount);
        } else {
          CommonFun.getInstance().showTips(jsonObj.msg);
          reject(jsonObj.msg);
        }
        ;
      }, null, GlobalCfg.USER_DATAS.BearerToken);
    });
  }
});

cc._RF.pop();