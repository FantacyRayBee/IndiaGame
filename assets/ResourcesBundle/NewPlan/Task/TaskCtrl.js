cc.Class({
    extends: cc.Component,

    properties: {
        btn_close: cc.Button,
        content: cc.Node,
        item: cc.Node,

        sp_btn_collect: cc.SpriteFrame,
        sp_btn_uncollect: cc.SpriteFrame,
    },

    ctor() {
        this.taskList = [];
        this.itemNodeList = [];
        this.taskInfoData = null;
        this.isClaiming = false;
        this.isFetchingTaskInfo = false;
        this.taskServerTime = 0;
        this.taskLocalFetchTime = 0;
        this.countdownCallback = null;
    },

    onLoad: function () {
        this.bindEvents();
        if (this.item) {
            this.item.active = false;
        }
        this.setPanelVisible(false);
        CommonFun.getInstance().showProgress();
        this.fetchTaskInfo();
    },

    onDestroy: function () {
        this.clearItemButtons();
        CommonFun.getInstance().hidProgress();
        CommonFun.getInstance().releasePrefab(GlobalCfg.PREFAB_PATH.TASK);
        ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, {
            msgCode: 'TASK_POPUP_CLOSED',
            msgData: {}
        });
    },

    bindEvents: function () {
        if (this.btn_close && this.btn_close.node) {
            this.btn_close.node.on('click', CommonFun.getInstance().debounce(this.bntclick, 1), this);
        }
    },

    fetchTaskInfo: function () {
        if (this.isFetchingTaskInfo) {
            return;
        }

        this.isFetchingTaskInfo = true;
        let httpUrl = `${GlobalCfg.HTTP_SERVER}/v1/taskv1/info${this.getTaskInfoQuery()}`;
        CommonFun.getInstance().httpGet(httpUrl, (msg) => {
            this.isFetchingTaskInfo = false;
            CommonFun.getInstance().hidProgress();
            if (!msg || Number(msg.result) !== 0 || !msg.data) {
                this.setPanelVisible(true);
                CommonFun.getInstance().showTips(msg && msg.msg ? msg.msg : 'task info error');
                return;
            }

            this.taskInfoData = msg.data || {};
            this.taskServerTime = Number(this.taskInfoData.server_time || 0);
            this.taskLocalFetchTime = Date.now();
            this.taskList = Array.isArray(this.taskInfoData.tasks) ? this.taskInfoData.tasks : [];
            this.refreshView();
            this.startTaskCountdown();
            this.setPanelVisible(true);
        }, () => {
            this.isFetchingTaskInfo = false;
            CommonFun.getInstance().hidProgress();
            this.setPanelVisible(true);
            CommonFun.getInstance().showTips('task info error');
        }, GlobalCfg.USER_DATAS.BearerToken);
    },

    claimTaskReward: function (taskData, taskInfo) {
        if (!taskData || !taskInfo || this.isClaiming || !taskInfo.canGet) {
            return;
        }

        let round = Number(taskInfo.claimRound || taskData.current_round || 0);
        if (!taskData.task_id || round <= 0) {
            return;
        }

        this.isClaiming = true;
        this.refreshView();

        let httpUrl = `${GlobalCfg.HTTP_SERVER}/v1/taskv1/claim`;
        let httpParam = {
            task_id: taskData.task_id,
            round: round,
        };

        CommonFun.getInstance().httpPost(httpUrl, httpParam, (msg) => {
            this.isClaiming = false;
            if (!msg || Number(msg.result) !== 0 || !msg.data) {
                CommonFun.getInstance().showTips(msg && msg.msg ? msg.msg : 'task claim error');
                if (msg && Number(msg.result) === 55) {
                    this.fetchTaskInfo();
                } else {
                    this.refreshView();
                }
                return;
            }

            this.applyWalletData(msg.data.wallet);

            let reward = Number(msg.data.reward || 0);
            if (reward > 0) {
                CommonFun.getInstance().showRewardsTips([{ id: 10, amount: reward / 100 }]);
            }

            ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, {
                msgCode: GlobalCfg.CLIENT_MSG_ID.GET_MAIL_REWARD,
                msgData: {}
            });

            this.fetchTaskInfo();
        }, () => {
            this.isClaiming = false;
            this.refreshView();
            CommonFun.getInstance().showTips('task claim error');
        }, GlobalCfg.USER_DATAS.BearerToken);
    },

    applyWalletData: function (wallet) {
        if (!wallet) {
            return;
        }

        GlobalCfg.USER_DATAS.userDiamond = Number(wallet.amount || 0);
        GlobalCfg.USER_DATAS.deposit = Number(wallet.deposit || 0);
        GlobalCfg.USER_DATAS.winnings = Number(wallet.winnings || 0);
        GlobalCfg.USER_DATAS.bonus = Number(wallet.voucher || 0);
        GlobalCfg.USER_DATAS.undraw = Number(wallet.undraw || 0);
    },

    refreshView: function () {
        if (!this.content || !this.item) {
            return;
        }

        this.clearItemButtons();
        this.ensureItemCount(this.taskList.length);

        for (let i = 0; i < this.itemNodeList.length; i++) {
            let itemNode = this.itemNodeList[i];
            let taskData = this.taskList[i];
            itemNode.active = !!taskData;
            if (!taskData) {
                continue;
            }
            this.updateItem(itemNode, taskData, i);
        }
    },

    ensureItemCount: function (count) {
        while (this.itemNodeList.length < count) {
            let node = cc.instantiate(this.item);
            node.active = true;
            node.parent = this.content;
            this.itemNodeList.push(node);
        }

        while (this.itemNodeList.length > count) {
            let node = this.itemNodeList.pop();
            if (node) {
                node.destroy();
            }
        }
    },

    updateItem: function (itemNode, taskData, index) {
        let taskInfo = this.normalizeTaskData(taskData);

        let titleLabel = this.getLabelByName(itemNode, 'lab_title');
        if (titleLabel) {
            titleLabel.string = taskInfo.title;
        }

        let descLabel = this.getLabelByName(itemNode, 'lab_desc');
        if (descLabel) {
            descLabel.string = taskInfo.desc;
        }

        let progressLabel = this.getLabelByName(itemNode, 'lab_progress');
        if (progressLabel) {
            progressLabel.string = `${this.formatTaskValue(taskInfo.current, taskInfo.type)}/${this.formatTaskValue(taskInfo.total, taskInfo.type)}`;
        }

        let timeLabel = this.getLabelByName(itemNode, 'lab_time');
        if (timeLabel) {
            timeLabel.string = this.getTaskCountdownText(taskInfo.resetAt);
        }

        this.updateProgressSprite(itemNode, taskInfo.current, taskInfo.total);
        this.updateGetButton(itemNode, taskInfo, taskData, index);
    },

    normalizeTaskData: function (taskData) {
        let rounds = Array.isArray(taskData.rounds) ? taskData.rounds : [];
        let title = taskData.name || taskData.title || taskData.taskName || '';
        let desc = taskData.description || taskData.desc || '';
        let type = `${taskData.type || ''}`;
        let reward = this.pickNumber(taskData.reward, 0);
        let current = this.pickNumber(taskData.progress, 0);
        let total = this.pickNumber(taskData.target, taskData.total, 0);
        let status = `${taskData.status || ''}`;
        let claimRound = 0;

        for (let i = 0; i < rounds.length; i++) {
            if (`${rounds[i].status || ''}` === 'claimable') {
                claimRound = Number(rounds[i].round || 0);
                break;
            }
        }

        if (claimRound <= 0 && status === 'claimable') {
            claimRound = Number(taskData.current_round || 0);
        }

        let canGet = status === 'claimable';
        let received = status === 'claimed';

        return {
            title: `${title || ''}`,
            desc: `${desc || ''}`,
            type: type,
            reward: reward,
            current: current,
            total: total,
            canGet: canGet,
            received: received,
            status: status,
            claimRound: claimRound,
            resetAt: this.pickNumber(taskData.reset_at, 0),
        };
    },

    updateProgressSprite: function (itemNode, current, total) {
        let progressNode = this.findNodeByName(itemNode, 'progress');
        if (!progressNode) {
            return;
        }

        let progressSprite = progressNode.getComponent(cc.Sprite);
        if (!progressSprite) {
            return;
        }

        let value = 0;
        let numberTotal = Number(total || 0);
        if (numberTotal > 0) {
            value = Number(current || 0) / numberTotal;
        }
        progressSprite.fillRange = Math.max(0, Math.min(1, value));
    },

    updateGetButton: function (itemNode, taskInfo, taskData, index) {
        let btnGetNode = this.findNodeByName(itemNode, 'btn_get');
        if (!btnGetNode) {
            return;
        }

        let btnGet = btnGetNode.getComponent(cc.Button);
        let btnTargetNode = btnGet && btnGet.target ? btnGet.target : this.findNodeByName(btnGetNode, 'Background');
        let btnSprite = btnTargetNode ? btnTargetNode.getComponent(cc.Sprite) : null;
        if (btnGet) {
            btnGet.interactable = !taskInfo.received && !this.isClaiming;
            btnGet.enableAutoGrayEffect = false;
        }
        if (btnSprite) {
            btnSprite.spriteFrame = taskInfo.canGet ? this.sp_btn_collect : this.sp_btn_uncollect;
        }

        btnGetNode.off('click');
        btnGetNode.on('click', () => {
            this.handleGetClick(taskInfo, taskData, index);
        });
    },

    handleGetClick: function (taskInfo, taskData, index) {
        GlobalCfg.G_COMPONENTS.Audio.playButton();

        if (taskInfo.received) {
            return;
        }

        if (!taskInfo.canGet) {
            this.handleTaskJump(taskInfo);
            return;
        }

        this.claimTaskReward(taskData, taskInfo);
    },

    handleTaskJump: function (taskInfo) {
        if (!taskInfo) {
            return;
        }

        if (taskInfo.type === 'recharge') {
            this.node.destroy();
            CommonFun.getInstance().showSmallAddCash();
            return;
        }

        if (taskInfo.type === 'bet') {
            this.node.destroy();
        }
    },

    getTaskInfoQuery: function () {
        let lang = this.getTaskRequestLang();
        return lang ? `?lang=${lang}` : '';
    },

    getTaskRequestLang: function () {
        if (typeof I18NUtil === 'undefined') {
            return this.getTaskRequestLangByStorage();
        }

        if (typeof I18NLanguagesEnum === 'undefined') {
            return this.getTaskRequestLangByStorage();
        }

        let languageType = I18NUtil.getInstance().getLanguageType();
        switch (languageType) {
            case I18NLanguagesEnum.Bengali:
                return 'bn';
            case I18NLanguagesEnum.English:
                return 'en';
            default:
                return this.getTaskRequestLangByStorage();
        }
    },

    getTaskRequestLangByStorage: function () {
        let languageTypeStorage = cc.sys.localStorage.getItem('LanguageTypeStorage');
        if (languageTypeStorage === 'Bengali') {
            return 'bn';
        }
        return 'en';
    },

    formatTaskValue: function (value, type) {
        let numberValue = Number(value || 0);
        if (!isFinite(numberValue)) {
            numberValue = 0;
        }

        return `${numberValue / 100}`;
    },

    pickNumber: function () {
        for (let i = 0; i < arguments.length - 1; i++) {
            let value = arguments[i];
            if (value !== undefined && value !== null && value !== '') {
                let numberValue = Number(value);
                if (!isNaN(numberValue)) {
                    return numberValue;
                }
            }
        }
        return arguments[arguments.length - 1];
    },

    setPanelVisible: function (visible) {
        this.node.opacity = visible ? 255 : 0;
    },

    startTaskCountdown: function () {
        if (this.countdownCallback) {
            this.unschedule(this.countdownCallback);
        }

        this.countdownCallback = () => {
            this.refreshTaskCountdownLabels();
        };

        this.refreshTaskCountdownLabels();
        this.schedule(this.countdownCallback, 1);
    },

    refreshTaskCountdownLabels: function () {
        let isNeedRefreshTaskInfo = false;

        for (let i = 0; i < this.itemNodeList.length; i++) {
            let itemNode = this.itemNodeList[i];
            let taskData = this.taskList[i];
            if (!itemNode || !itemNode.active || !taskData) {
                continue;
            }

            let timeLabel = this.getLabelByName(itemNode, 'lab_time');
            if (!timeLabel) {
                continue;
            }

            let remainSeconds = this.getTaskRemainSeconds(taskData.reset_at);
            timeLabel.string = this.formatTaskCountdown(remainSeconds);
            if (remainSeconds <= 0) {
                isNeedRefreshTaskInfo = true;
            }
        }

        if (isNeedRefreshTaskInfo && !this.isFetchingTaskInfo) {
            CommonFun.getInstance().showProgress();
            this.fetchTaskInfo();
        }
    },

    getTaskCountdownText: function (resetAt) {
        let remainSeconds = this.getTaskRemainSeconds(resetAt);
        return this.formatTaskCountdown(remainSeconds);
    },

    getTaskRemainSeconds: function (resetAt) {
        let numberResetAt = Number(resetAt || 0);
        if (!isFinite(numberResetAt) || numberResetAt <= 0 || this.taskServerTime <= 0) {
            return 0;
        }

        let elapsedSeconds = Math.floor((Date.now() - this.taskLocalFetchTime) / 1000);
        let currentServerTime = this.taskServerTime + Math.max(0, elapsedSeconds);
        return Math.max(0, numberResetAt - currentServerTime);
    },

    formatTaskCountdown: function (totalSeconds) {
        let remain = Math.max(0, Number(totalSeconds || 0));
        let hours = Math.floor(remain / 3600);
        let minutes = Math.floor((remain % 3600) / 60);
        let seconds = remain % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    },

    getLabelByName: function (parentNode, nodeName) {
        let node = this.findNodeByName(parentNode, nodeName);
        return node ? node.getComponent(cc.Label) : null;
    },

    findNodeByName: function (parentNode, nodeName) {
        if (!parentNode || !nodeName) {
            return null;
        }
        if (parentNode.name === nodeName) {
            return parentNode;
        }
        return this.findNodeByNameRecursive(parentNode, nodeName);
    },

    findNodeByNameRecursive: function (parentNode, nodeName) {
        if (!parentNode || !parentNode.children) {
            return null;
        }

        for (let i = 0; i < parentNode.childrenCount; i++) {
            let child = parentNode.children[i];
            if (!child) {
                continue;
            }
            if (child.name === nodeName) {
                return child;
            }
            let target = this.findNodeByNameRecursive(child, nodeName);
            if (target) {
                return target;
            }
        }
        return null;
    },

    clearItemButtons: function () {
        if (this.countdownCallback) {
            this.unschedule(this.countdownCallback);
            this.countdownCallback = null;
        }

        for (let i = 0; i < this.itemNodeList.length; i++) {
            let btnGetNode = this.findNodeByName(this.itemNodeList[i], 'btn_get');
            if (btnGetNode) {
                btnGetNode.off('click');
            }
        }
    },

    bntclick: function (button) {
        let btnName = button.node.name;
        if (btnName === 'btn_close') {
            GlobalCfg.G_COMPONENTS.Audio.playBack();
            this.node.destroy();
        }
    },
});
