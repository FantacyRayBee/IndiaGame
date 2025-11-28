cc.Class({
    extends: cc.Component,

    properties: {
        lab_challengesTime: cc.Label,
        lab_challengesProgress: cc.Label,
        progress_challenges: cc.ProgressBar,
        btn_challengesBox: cc.Button,
        node_challengesContent: cc.Node,
    },

    onLoad: function() {
        this.lab_challengesTime.string = "";
        this.lab_challengesProgress.string = "";
        this.progress_challenges.progress = 0;
        this.btn_challengesBox.interactable = true;
        this.btn_challengesBox.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 2), this);
        this.customMsgEventHandle = ClientNotify.register(GlobalCfg.MSG_TYPE.clientMsg, this.onEventMsg, this);
    },

    onDestroy: function() {
        ClientNotify.removeByHandle(GlobalCfg.MSG_TYPE.clientMsg, this.customMsgEventHandle);
    },

    onEventMsg: function(webData, target) {
        let self = target;
        let msgId = webData.msgCode;
        let notify = webData.msgData;
        if (msgId == GlobalCfg.CLIENT_MSG_ID.ACTIVITY_CHALLENGES_COLLECT) {
            self.dealChallengesCollect(notify);
        };
    },

    start: function() {
        Promise.all([this.getChallengesInfo(), this.getChallengesItemPrefab()])
        .then((arr) => {
            if (!Array.isArray(arr)) {
                return;
            };

            let data = arr[0];
            let prefab = arr[1];
            if (!data) {
                return;
            };

            if (!prefab) {
                return;
            };

            let taskArr = data.Tasks;                               // 任务列表
            let duration = data.Duration;                           // 活动持续时间(用于完成任务的时间-3D-单位秒)
            let createdAt = data.CreatedAt;                         // 创建时间
            let completedAt = data.CompletedAt;                     // 完成时间(所有奖励已领取了)
            let receivedBoxAward = data.ReceivedBoxAward;           // 领取了的宝箱奖励

            if (CommonFun.getInstance().isValidForScr(this)) {
                this.setChallengesEndTime(createdAt + duration, completedAt);
                this.setChallengesProgress(taskArr, receivedBoxAward);
                this.setChallengesTasks(taskArr, prefab);
            };
        })
        .catch((err) => {
            LoggerUtil.getInstance().error(err);
        });
    },

    btnClick: function() {
        GlobalCfg.G_COMPONENTS.Audio.playButton();
        let httpUrl = GlobalCfg.HTTP_SERVER + "/v1/challenge/receiveboxaward";
        CommonFun.getInstance().httpPost(httpUrl, {}, (msg) => {
            if (msg.result == 0) {
                let data = msg.data;
                let receivedAward = data.ReceivedAward;     // 领取的奖励
                let afterD = data.AfterD;                   // 领取后Dep
                let afterW = data.AfterW;                   // 领取后Win
                
                GlobalCfg.USER_DATAS.challengeRunning = false;
                GlobalCfg.G_COMPONENTS.Audio.playSoundByNameInResources("sign", false);
                CommonFun.getInstance().showRewardsTips([{ id: 10, amount: receivedAward / 100 }]);
                ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, {msgCode: GlobalCfg.CLIENT_MSG_ID.GET_CHALLENGES_REWARD, msgData: {price: receivedAward}});
                if (CommonFun.getInstance().isValidForScr(this)) {
                    this.btn_challengesBox.interactable = false;
                };
            }
            else {
                CommonFun.getInstance().showTips(msg.msg);
            };
        }, null, GlobalCfg.USER_DATAS.BearerToken);
    },

    setChallengesEndTime: function(endTime, completedAt) {
        let nowTime = parseInt(new Date().getTime()/1000);
        let chaTime = endTime - nowTime;

        if (chaTime <= 0) {
            this.lab_challengesTime.string = "0d:0hrs";
        }
        else {
            let day = Math.floor(chaTime/86400);
            let hrs = Math.floor((chaTime - day * 86400)/3600);
            this.lab_challengesTime.string = `${day}d:${hrs}hrs`;
        };
    },

    setChallengesProgress: function(taskArr, receivedBoxAward) {
        let finishNum = 0;
        let taskArrLen = taskArr.length;
        for (let i = 0; i < taskArrLen; i++) {
            let task = taskArr[i];
            let need = task.Need;                   // 需要完成的次数
            let progress = task.Progress;           // 进度(完成次数)
            if (need == progress) {
                finishNum += 1;
            };
        };
        this.progress_challenges.progress = finishNum/taskArrLen;
        this.lab_challengesProgress.string = `${finishNum}/${taskArrLen}Completed`;

        if (finishNum == taskArrLen) {
            if (receivedBoxAward == 0) {
                this.btn_challengesBox.interactable = true;

                this.schedule(() => {
                    let offset = 5;
                    let x = this.btn_challengesBox.node.x;
                    let y = this.btn_challengesBox.node.y;
                    cc.tween(this.btn_challengesBox.node)
                    .to(0.1, {position: cc.v2(x + (1 + offset), y + (offset + 1))})
                    .to(0.1, {position: cc.v2(x + (1 + offset), y - (1 + offset))})
                    .to(0.1, {position: cc.v2(x - (1 + offset), y + (offset + 1))})
                    .to(0.1, {position: cc.v2(x - (1 + offset), y - (1 + offset))})
                    .to(0.1, {position: cc.v2(x, y)})
                    .start();
                }, 1);
            }
            else {
                this.btn_challengesBox.interactable = false;
            };
        }
        else {
            this.btn_challengesBox.interactable = false;
        };
    },

    setChallengesTasks: function(taskArr, prefab) {
        let len = taskArr.length;
        let index = 0;
        let addChallengesItem = function() {
            let taskData = taskArr[index];
            let state = taskData.State;
            
            if (state != 3) {
                let challengesItem = cc.instantiate(prefab);
                this.node_challengesContent.addChild(challengesItem);
    
                let activityChallengesItemCtrl = challengesItem.getComponent("ActivityChallengesItemCtrl");
                if (activityChallengesItemCtrl) {
                    activityChallengesItemCtrl.setChallengesItemInfo(taskData, index);
                };
            };

            index += 1;
            if (index == len) {
                this.unschedule(addChallengesItem);
                return;
            };
        };
        this.schedule(addChallengesItem, 2/cc.game.getFrameRate(), len - 1, 0);
    },

    getChallengesInfo: function() {
        return new Promise((resolve, reject) => {
            let url =  GlobalCfg.HTTP_SERVER + "/v1/challenge/detail";  
            CommonFun.getInstance().httpGet(url, (jsonObj) => {  
                if (jsonObj.result == 0) { 
                    let data = jsonObj.data;
                    resolve(data); 
                }
                else {
                    CommonFun.getInstance().showTips(jsonObj.msg);
                    reject(jsonObj.msg);
                };
            }, null, GlobalCfg.USER_DATAS.BearerToken);
        });
    },

    getChallengesItemPrefab: function() {
        return new Promise((resolve, reject) => {
            let prefabPath = GlobalCfg.PREFAB_PATH.ACTIVITYCHALLENGESITEM;
            let arr = prefabPath.split("/");
            let bundleName = arr[0];
            let path = prefabPath.substring(bundleName.length + 1);
            CommonFun.getInstance().loadBundle(bundleName, (bundle) => {
                bundle.load(path, cc.Prefab, (error, prefab) => {
                    if (!error) {
                        resolve(prefab);
                    }
                    else {
                        reject(`Failed to obtain challenges item prefab`, error);
                    };
                });
            }, (err) => {
                reject(`Failed to obtain challenges item prefab`, err);
            });
        });
    },


    dealChallengesCollect: function(notify) {
        let httpUrl =  GlobalCfg.HTTP_SERVER + "/v1/challenge/receivetaskaward";  
        let httpParam = {TaskIndex: notify.taskIndex};
        CommonFun.getInstance().httpPost(httpUrl, httpParam, (jsonObj) => { 
            if (jsonObj.result == 0) { 
                let data = jsonObj.data;
                let openTask = data.OpenTask;               // 新开启的任务,可能为空
                let receivedAward = data.ReceivedAward;     // 领取的奖励
                let afterD = data.AfterD;                   // 领取后Dep
                let afterW = data.AfterW;                   // 领取后Win
                GlobalCfg.G_COMPONENTS.Audio.playSoundByNameInResources("sign", false);
                CommonFun.getInstance().showRewardsTips([{ id: 10, amount: receivedAward / 100 }]);
                ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, {msgCode: GlobalCfg.CLIENT_MSG_ID.GET_CHALLENGES_REWARD, msgData: {price: receivedAward}});

                if (CommonFun.getInstance().isValidForScr(this)) {
                    let taskNodesArr = this.node_challengesContent.children;
                    let openItemTaskIndex = -1;
                    if (openTask) {
                        openItemTaskIndex = notify.taskIndex + 1;
                    };
                    for (let i = 0, len = taskNodesArr.length; i < len; i++) {
                        let challengesItem = taskNodesArr[i];
                        let activityChallengesItemCtrl = challengesItem.getComponent("ActivityChallengesItemCtrl");
                        if (activityChallengesItemCtrl) {
                            let itemTaskIndex = activityChallengesItemCtrl.getChallengesItemTaskIndex();
                            if (itemTaskIndex == notify.taskIndex) {
                                activityChallengesItemCtrl.node.destroy();
                            };
                            if (openItemTaskIndex == itemTaskIndex) {
                                activityChallengesItemCtrl.setChallengesItemOpenStatus();
                            };
                        };
                    };
                };
            }
            else {
                CommonFun.getInstance().showTips(jsonObj.msg);
            };
        }, null, GlobalCfg.USER_DATAS.BearerToken);
    },
});
