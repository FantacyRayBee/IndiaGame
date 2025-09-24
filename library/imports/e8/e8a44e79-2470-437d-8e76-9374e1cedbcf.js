"use strict";
cc._RF.push(module, 'e8a4455JHBDfY52k3ThztvP', 'ActivityChallengesCtrl');
// ResourcesBundle/NewPlan/Activity/ActivityChallengesCtrl.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    lab_challengesTime: cc.Label,
    lab_challengesProgress: cc.Label,
    progress_challenges: cc.ProgressBar,
    btn_challengesBox: cc.Button,
    node_challengesContent: cc.Node
  },
  onLoad: function onLoad() {
    this.lab_challengesTime.string = "";
    this.lab_challengesProgress.string = "";
    this.progress_challenges.progress = 0;
    this.btn_challengesBox.interactable = true;
    this.btn_challengesBox.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 2), this);
    this.customMsgEventHandle = ClientNotify.register(GlobalCfg.MSG_TYPE.clientMsg, this.onEventMsg, this);
  },
  onDestroy: function onDestroy() {
    ClientNotify.removeByHandle(GlobalCfg.MSG_TYPE.clientMsg, this.customMsgEventHandle);
  },
  onEventMsg: function onEventMsg(webData, target) {
    var self = target;
    var msgId = webData.msgCode;
    var notify = webData.msgData;

    if (msgId == GlobalCfg.CLIENT_MSG_ID.ACTIVITY_CHALLENGES_COLLECT) {
      self.dealChallengesCollect(notify);
    }

    ;
  },
  start: function start() {
    var _this = this;

    Promise.all([this.getChallengesInfo(), this.getChallengesItemPrefab()]).then(function (arr) {
      if (!Array.isArray(arr)) {
        return;
      }

      ;
      var data = arr[0];
      var prefab = arr[1];

      if (!data) {
        return;
      }

      ;

      if (!prefab) {
        return;
      }

      ;
      var taskArr = data.Tasks; // 任务列表

      var duration = data.Duration; // 活动持续时间(用于完成任务的时间-3D-单位秒)

      var createdAt = data.CreatedAt; // 创建时间

      var completedAt = data.CompletedAt; // 完成时间(所有奖励已领取了)

      var receivedBoxAward = data.ReceivedBoxAward; // 领取了的宝箱奖励

      if (CommonFun.getInstance().isValidForScr(_this)) {
        _this.setChallengesEndTime(createdAt + duration, completedAt);

        _this.setChallengesProgress(taskArr, receivedBoxAward);

        _this.setChallengesTasks(taskArr, prefab);
      }

      ;
    })["catch"](function (err) {
      LoggerUtil.getInstance().error(err);
    });
  },
  btnClick: function btnClick() {
    var _this2 = this;

    GlobalCfg.G_COMPONENTS.Audio.playButton();
    var httpUrl = GlobalCfg.HTTP_SERVER + "/v1/challenge/receiveboxaward";
    CommonFun.getInstance().httpPost(httpUrl, {}, function (msg) {
      if (msg.result == 0) {
        var data = msg.data;
        var receivedAward = data.ReceivedAward; // 领取的奖励

        var afterD = data.AfterD; // 领取后Dep

        var afterW = data.AfterW; // 领取后Win

        GlobalCfg.USER_DATAS.challengeRunning = false;
        GlobalCfg.G_COMPONENTS.Audio.playSoundByNameInResources("sign", false);
        CommonFun.getInstance().showRewardsTips([{
          id: 10,
          amount: receivedAward / 100
        }]);
        ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, {
          msgCode: GlobalCfg.CLIENT_MSG_ID.GET_CHALLENGES_REWARD,
          msgData: {
            price: receivedAward
          }
        });

        if (CommonFun.getInstance().isValidForScr(_this2)) {
          _this2.btn_challengesBox.interactable = false;
        }

        ;
      } else {
        CommonFun.getInstance().showTips(msg.msg);
      }

      ;
    }, null, GlobalCfg.USER_DATAS.BearerToken);
  },
  setChallengesEndTime: function setChallengesEndTime(endTime, completedAt) {
    var nowTime = parseInt(new Date().getTime() / 1000);
    var chaTime = endTime - nowTime;

    if (chaTime <= 0) {
      this.lab_challengesTime.string = "0d:0hrs";
    } else {
      var day = Math.floor(chaTime / 86400);
      var hrs = Math.floor((chaTime - day * 86400) / 3600);
      this.lab_challengesTime.string = day + "d:" + hrs + "hrs";
    }

    ;
  },
  setChallengesProgress: function setChallengesProgress(taskArr, receivedBoxAward) {
    var _this3 = this;

    var finishNum = 0;
    var taskArrLen = taskArr.length;

    for (var i = 0; i < taskArrLen; i++) {
      var task = taskArr[i];
      var need = task.Need; // 需要完成的次数

      var progress = task.Progress; // 进度(完成次数)

      if (need == progress) {
        finishNum += 1;
      }

      ;
    }

    ;
    this.progress_challenges.progress = finishNum / taskArrLen;
    this.lab_challengesProgress.string = finishNum + "/" + taskArrLen + "Completed";

    if (finishNum == taskArrLen) {
      if (receivedBoxAward == 0) {
        this.btn_challengesBox.interactable = true;
        this.schedule(function () {
          var offset = 5;
          var x = _this3.btn_challengesBox.node.x;
          var y = _this3.btn_challengesBox.node.y;
          cc.tween(_this3.btn_challengesBox.node).to(0.1, {
            position: cc.v2(x + (1 + offset), y + (offset + 1))
          }).to(0.1, {
            position: cc.v2(x + (1 + offset), y - (1 + offset))
          }).to(0.1, {
            position: cc.v2(x - (1 + offset), y + (offset + 1))
          }).to(0.1, {
            position: cc.v2(x - (1 + offset), y - (1 + offset))
          }).to(0.1, {
            position: cc.v2(x, y)
          }).start();
        }, 1);
      } else {
        this.btn_challengesBox.interactable = false;
      }

      ;
    } else {
      this.btn_challengesBox.interactable = false;
    }

    ;
  },
  setChallengesTasks: function setChallengesTasks(taskArr, prefab) {
    var len = taskArr.length;
    var index = 0;

    var addChallengesItem = function addChallengesItem() {
      var taskData = taskArr[index];
      var state = taskData.State;

      if (state != 3) {
        var challengesItem = cc.instantiate(prefab);
        this.node_challengesContent.addChild(challengesItem);
        var activityChallengesItemCtrl = challengesItem.getComponent("ActivityChallengesItemCtrl");

        if (activityChallengesItemCtrl) {
          activityChallengesItemCtrl.setChallengesItemInfo(taskData, index);
        }

        ;
      }

      ;
      index += 1;

      if (index == len) {
        this.unschedule(addChallengesItem);
        return;
      }

      ;
    };

    this.schedule(addChallengesItem, 2 / cc.game.getFrameRate(), len - 1, 0);
  },
  getChallengesInfo: function getChallengesInfo() {
    return new Promise(function (resolve, reject) {
      var url = GlobalCfg.HTTP_SERVER + "/v1/challenge/detail";
      CommonFun.getInstance().httpGet(url, function (jsonObj) {
        if (jsonObj.result == 0) {
          var data = jsonObj.data;
          resolve(data);
        } else {
          CommonFun.getInstance().showTips(jsonObj.msg);
          reject(jsonObj.msg);
        }

        ;
      }, null, GlobalCfg.USER_DATAS.BearerToken);
    });
  },
  getChallengesItemPrefab: function getChallengesItemPrefab() {
    return new Promise(function (resolve, reject) {
      var prefabPath = GlobalCfg.PREFAB_PATH.ACTIVITYCHALLENGESITEM;
      var arr = prefabPath.split("/");
      var bundleName = arr[0];
      var path = prefabPath.substring(bundleName.length + 1);
      CommonFun.getInstance().loadBundle(bundleName, function (bundle) {
        bundle.load(path, cc.Prefab, function (error, prefab) {
          if (!error) {
            resolve(prefab);
          } else {
            reject("Failed to obtain challenges item prefab", error);
          }

          ;
        });
      }, function (err) {
        reject("Failed to obtain challenges item prefab", err);
      });
    });
  },
  dealChallengesCollect: function dealChallengesCollect(notify) {
    var _this4 = this;

    var httpUrl = GlobalCfg.HTTP_SERVER + "/v1/challenge/receivetaskaward";
    var httpParam = {
      TaskIndex: notify.taskIndex
    };
    CommonFun.getInstance().httpPost(httpUrl, httpParam, function (jsonObj) {
      if (jsonObj.result == 0) {
        var data = jsonObj.data;
        var openTask = data.OpenTask; // 新开启的任务,可能为空

        var receivedAward = data.ReceivedAward; // 领取的奖励

        var afterD = data.AfterD; // 领取后Dep

        var afterW = data.AfterW; // 领取后Win

        GlobalCfg.G_COMPONENTS.Audio.playSoundByNameInResources("sign", false);
        CommonFun.getInstance().showRewardsTips([{
          id: 10,
          amount: receivedAward / 100
        }]);
        ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, {
          msgCode: GlobalCfg.CLIENT_MSG_ID.GET_CHALLENGES_REWARD,
          msgData: {
            price: receivedAward
          }
        });

        if (CommonFun.getInstance().isValidForScr(_this4)) {
          var taskNodesArr = _this4.node_challengesContent.children;
          var openItemTaskIndex = -1;

          if (openTask) {
            openItemTaskIndex = notify.taskIndex + 1;
          }

          ;

          for (var i = 0, len = taskNodesArr.length; i < len; i++) {
            var challengesItem = taskNodesArr[i];
            var activityChallengesItemCtrl = challengesItem.getComponent("ActivityChallengesItemCtrl");

            if (activityChallengesItemCtrl) {
              var itemTaskIndex = activityChallengesItemCtrl.getChallengesItemTaskIndex();

              if (itemTaskIndex == notify.taskIndex) {
                activityChallengesItemCtrl.node.destroy();
              }

              ;

              if (openItemTaskIndex == itemTaskIndex) {
                activityChallengesItemCtrl.setChallengesItemOpenStatus();
              }

              ;
            }

            ;
          }

          ;
        }

        ;
      } else {
        CommonFun.getInstance().showTips(jsonObj.msg);
      }

      ;
    }, null, GlobalCfg.USER_DATAS.BearerToken);
  }
});

cc._RF.pop();