"use strict";
cc._RF.push(module, '34219qYHZBGEIsHS24RmoEu', 'ActivityTurnTableCtrl');
// ResourcesBundle/NewPlan/Activity/ActivityTurnTableCtrl.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    lab_remainingTimes: cc.RichText,
    lab_endTime: cc.Label,
    lab_tips3: cc.Label,
    btn_go: cc.Button,
    node_wheel: cc.Node,
    normal_mat: cc.Material,
    gray_mat: cc.Material
  },
  ctor: function ctor() {
    // 各个奖励角度
    this.awardAngle = [338.5, 293.5, 249.5, 204.5, 156.5, 112.5, 69.5, 22.5];
    this.shopPayinfo = [200, 300, 500, 1000, 2000, 3000, 5000, 10000];
  },
  onLoad: function onLoad() {
    this.wheel_jinbSprite = {};
    this.wheel_jinbLabel = {};
    for (var i = 0; i < 8; i++) {
      this.wheel_jinbSprite[i] = this.node_wheel.getChildByName("jb_" + (i + 1)).getComponent(cc.Sprite);
      this.wheel_jinbLabel[i] = this.node_wheel.getChildByName("lab_" + (i + 1)).getComponent(cc.Label);
    }
    this.btn_go.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
  },
  start: function start() {
    var _this = this;
    var remainCountPromise = this.getTurnTableRemainCount();
    remainCountPromise.then(function (turntableData) {
      if (CommonFun.getInstance().isValidForScr(_this)) {
        // let turntableData = GlobalCfg.USER_DATAS.turntableData;
        _this.wheel_labs = []; // 改成数组
        for (var i = 0; i < 8; i++) {
          var amount = turntableData.amountActivity[i];
          _this.wheel_labs.push({
            num: amount % 100000000 / 100,
            // 计算金额
            isBonus: amount > 1000000 // 是否是大奖
          });
        }

        _this.lab_tips3.string = "3.Number of uses remaining: " + turntableData.countRemainingTurns;
        // 按 num 升序排序
        _this.wheel_labs.sort(function (a, b) {
          return a.num - b.num;
        });
        for (var _i = 0; _i < 8; _i++) {
          if (_this.wheel_labs[_i].isBonus) {
            _this.wheel_jinbLabel[_i].string = "Bouns\n" + _this.wheel_labs[_i].num;
          } else {
            _this.wheel_jinbLabel[_i].string = "₹" + _this.wheel_labs[_i].num;
          }
        }
        var payIndex = _this.getCurrentPayIndex();
        _this.lab_remainingTimes.string = "Recharge <color=#fff670>₹" + _this.shopPayinfo[payIndex] + "</color> to get 1 spin";
        _this.checkWheelState();
        _this.startCountdown(turntableData.expireTime);
      }
      ;
    });
  },
  onDestroy: function onDestroy() {
    clearInterval(this.countdownInterval);
  },
  getCurrentPayIndex: function getCurrentPayIndex() {
    for (var i = 0; i < 8; i++) {
      if (GlobalCfg.USER_DATAS.turntableData.signInStatus[i] == false) return i;
    }
    return 0;
  },
  btnClick: function btnClick(btn) {
    var _this2 = this;
    GlobalCfg.G_COMPONENTS.Audio.playButton();
    if (GlobalCfg.USER_DATAS.turntableData.countRemainingTurns == 0) {
      //没有旋转次数 这时需要跳转商城
      var payIndex = this.getCurrentPayIndex();
      GlobalCfg.SELECT_RECHARGE_ACOUNT = this.shopPayinfo[payIndex] * 100; //跳转商城 选中本次能够获取转盘机会的金额
      CommonFun.getInstance().showNewShop(true);
      ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, {
        msgCode: GlobalCfg.CLIENT_MSG_ID.ACTIVITY_CLOSE_VIEW,
        msgData: {}
      });
      return;
    }
    this.btn_go.interactable = false;
    this.btn_go.enableAutoGrayEffect = true;
    var url = GlobalCfg.HTTP_SERVER + "/v1/turntabledraw";
    CommonFun.getInstance().httpGet(url, function (jsonObj) {
      if (jsonObj.result == 0) {
        GlobalCfg.USER_DATAS.turntableData.countCurrentTurns = jsonObj.data.countCurrentTurns;
        GlobalCfg.USER_DATAS.turntableData.countRemainingTurns = jsonObj.data.countRemainingTurns;
        GlobalCfg.USER_DATAS.turntableRemainCount = jsonObj.data.countRemainingTurns;
        _this2.lab_tips3.string = "3.Number of uses remaining: " + GlobalCfg.USER_DATAS.turntableData.countRemainingTurns;
        ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, {
          msgCode: "RefreshActivity_RedPoint",
          msgData: {}
        });
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
  },
  checkWheelState: function checkWheelState() {
    LoggerUtil.getInstance().log("checkWheelState count: ", GlobalCfg.USER_DATAS.turntableData.countCurrentTurns);
    for (var i = 0; i < 8; i++) {
      if (i < GlobalCfg.USER_DATAS.turntableData.countCurrentTurns) {
        var index = this.getStopIndex(i); //通过第几次抽奖计算出转盘下标
        // this.wheel_jinbSprite[i].materials[0] = this.gray_mat;
        this.wheel_jinbSprite[index].node.getChildByName("yes").active = true;
      }
    }
  },
  // 启动倒计时
  startCountdown: function startCountdown(expireTimestamp) {
    var _this3 = this;
    // 先立即更新一次显示
    this.updateCountdownDisplay(expireTimestamp);

    // 每秒更新一次
    this.countdownInterval = setInterval(function () {
      _this3.updateCountdownDisplay(expireTimestamp);
    }, 1000);
  },
  // 更新倒计时显示
  updateCountdownDisplay: function updateCountdownDisplay(expireTimestamp) {
    var remainingMs = Math.max(0, expireTimestamp - Date.now());
    this.lab_endTime.string = "End time: " + this.formatToHMS(remainingMs);

    // 倒计时结束时的处理
    if (remainingMs <= 0) {
      clearInterval(this.countdownInterval);
      ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, {
        msgCode: GlobalCfg.CLIENT_MSG_ID.ACTIVITY_CLOSE_VIEW,
        msgData: {}
      });
    }
  },
  /**
   * 将毫秒转换为 HH:MM:SS 格式
   * @param {number} ms 剩余毫秒数
   * @returns {string} 格式化后的时间字符串
   */
  formatToHMS: function formatToHMS(ms) {
    if (ms <= 0) return "00:00:00"; // 倒计时结束
    var totalSeconds = Math.floor(ms / 1000);
    var hours = Math.floor(totalSeconds / 3600);
    var minutes = Math.floor(totalSeconds % 3600 / 60);
    var seconds = totalSeconds % 60;

    // 补零显示（如 1 → "01"）
    var pad = function pad(num) {
      return num.toString().padStart(2, '0');
    };
    return pad(hours) + ":" + pad(minutes) + ":" + pad(seconds);
  },
  trunPlateRotation: function trunPlateRotation(data) {
    var _this4 = this;
    var stopIndex = this.getStopIndex();
    LoggerUtil.getInstance().log("caojun stopIndex = ", stopIndex);
    this.compensation = this.node_wheel.angle % 360 + 360;
    //旋转时间
    var rotationTime = 3.59;
    //旋转圈数
    var rotationcircle = 2;
    //奖励圈数
    var RotationAngle = this.node_wheel.angle - rotationcircle * 360 - this.awardAngle[stopIndex] - this.compensation;
    cc.tween(this.node_wheel).to(rotationTime, {
      angle: RotationAngle
    }, {
      easing: 'sineInOut'
    }).call(function () {
      GlobalCfg.G_COMPONENTS.Audio.playSoundByNameInResources("sign", false);
      if (data.activity < 10000000) {
        CommonFun.getInstance().showRewardsTips([{
          id: 10,
          amount: data.activity / 100
        }]);
      } else {
        //该次抽奖中的是bouns
        CommonFun.getInstance().showRewardsTips([{
          id: 12,
          amount: data.activity % 100000000 / 100
        }]);
      }
      _this4.checkWheelState();
      _this4.btn_go.interactable = true;
      _this4.btn_go.enableAutoGrayEffect = false;
    }).start();
  },
  getStopIndex: function getStopIndex(currentTurn) {
    var turn = currentTurn || GlobalCfg.USER_DATAS.turntableData.countCurrentTurns;
    var index = 0;
    //根据当前处于第N次抽奖，找到这次转盘应该转到的奖励
    var amount = GlobalCfg.USER_DATAS.turntableData.amountActivity[turn - 1];
    amount = amount % 100000000 / 100;
    LoggerUtil.getInstance().log("找到这次转盘应该转到的奖励 amount:", amount);
    LoggerUtil.getInstance().log("找到这次转盘应该转到的奖励 this.wheel_labs:", this.wheel_labs);
    for (var i = 0; i < 8; i++) {
      //通过奖励找到盘面上中奖的index
      if (this.wheel_labs[i].num == amount) {
        index = i;
        break;
      }
    }
    return index;
  },
  getTurnTableRemainCount: function getTurnTableRemainCount() {
    return new Promise(function (resolve, reject) {
      // if (Reflect.has(GlobalCfg.USER_DATAS, 'turntableData')) {
      //     resolve(GlobalCfg.USER_DATAS.turntableData);
      //     return;
      // };
      var url = GlobalCfg.HTTP_SERVER + "/v1/getturntableinfo";
      CommonFun.getInstance().httpGet(url, function (jsonObj) {
        if (jsonObj.result == 0) {
          GlobalCfg.USER_DATAS.turntableRemainCount = jsonObj.data.countRemainingTurns;
          GlobalCfg.USER_DATAS.turntableData = jsonObj.data;
          resolve(GlobalCfg.USER_DATAS.turntableData);
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