cc.Class({
    extends: cc.Component,

    properties: {
        btn_back: cc.Button,
        btn_add: cc.Button,
        btn_addcash: cc.Button,
        btn_wf: cc.Button,
        btn_setting: cc.Button,
        btn_betJian: cc.Button,
        btn_betJia: cc.Button,
        btn_betCiShuForever: cc.Button,
        btn_betCiShu100: cc.Button,
        btn_betCiShu50: cc.Button,
        btn_betCiShu20: cc.Button,
        btn_auto: cc.Button,
        btn_spin: cc.Button,
        btn_stop: cc.Button,
        btn_fg_end: cc.Button,
        btn_totalwin_end: cc.Button,
        btn_jp_end: cc.Button,

        toggle_fast: cc.Toggle,
        toggle_auto: cc.Toggle,

        node_tcBg: cc.Node,
        node_goodluck: cc.Node,
        lab_autoBetCiShu: cc.Label,
        node_catContent: cc.Node,
        node_catSkelContent: cc.Node,
        node_free: cc.Node,

        lab_betAmount: cc.Label,
        lab_betAmount2: cc.Label,
        lab_totalWin: cc.Label,
        lab_freenum: cc.Label,
        lab_fg_num: cc.Label,
        lab_totalwinpop_num: cc.Label,
        lab_jp_num: cc.Label,

        lab_jp_minor: cc.Label,
        lab_jp_major: cc.Label,
        lab_jp_grand: cc.Label,
        btn_jp_minor: cc.Button,
        btn_jp_major: cc.Button,
        btn_jp_grand: cc.Button,

        node_fg_pop: cc.Node,
        node_fg: cc.Node,
        node_totalwin_pop: cc.Node,
        node_totalwin: cc.Node,
        node_jp_pop: cc.Node,
        node_jp: cc.Node,

        node_line: cc.Node,

        lab_jb: cc.Label,

        pab_setting: cc.Prefab,

        background: cc.Sprite,
        mg_bg: cc.SpriteFrame,
        fg_bg: cc.SpriteFrame,

        //task
        node_task: cc.Node,
        btn_task_collect: cc.Button,
        spriteAtlas_icon: cc.SpriteAtlas,
    },

    ctor: function () {
        this.tipsLabel = [
            "Your game is not finished yet . If you wish to exit the table , you will lose your money . Do you want to leave table?", // 退出游戏
            "Sorry, there are not enough gold coins.", //金币不足请充值
            "In the game, unable to exit",                              // 游戏中无法退出
            "Sorry, your gold coin can't be played in this game",     // 对不起，您的金币无法在本场内游戏）
            "Can't bet temporarily",                    //请选择下注的范围
            "Your cash is insufficient, Please recharge in time!"
        ];
        //投注额度数组
        this.betAmountArr = ['4.5', '9', '45', '90', '180', '450', '900', '1800'];
        if (GlobalCfg.USER_DATAS.gamePattern == 1) {
            this.betAmountArr = ['4.5', '9', '45', '90', '180', '450', '900', '1800'];
        }
        this.betAmountArrIndex = 0;

        this.finishedCatItemNum = 0;
        this.isRunningCatAnim = false;

        this.height = 150; // 每个水果图片的高度
        this.wildId = 9
        this.paymentSwitch = false;
        this.curSendSpin = false;           // 当前是否在发送spin请求
        this.frees = [];
        this.lineArr = [];
        this.isAuto = false;

        this.isHaveMianFeiRecord = false;
        this.selectAutoBetStr = 'AUTO';
        this.selectAutoStatus = false;
        this.freeTotalWinNum = 0;           // 三叶草免费时，总获取金额

        this.node_catContentArr = []; // 每个水果图片的节点
        this.node_catSkelContentArr = []; // 每个水果图片的节点

        this._popupStates = new Map(); // key: pop.uuid -> { token, skel }
    },

    loadAudioClip: function (audioClipUrl = "", func = null, target = null) {
        if (!audioClipUrl || audioClipUrl.length == 0) {
            return;
        };
        CommonFun.getInstance().loadBundle('catMachine', (bundle) => {
            bundle.load(audioClipUrl, cc.AudioClip, (err1, audioClip) => {
                if (!err1) {
                    func && func(audioClip, target);
                }
                else {
                    LoggerUtil.getInstance().error(err1);
                };
            });
        }, (err) => {
            LoggerUtil.getInstance().error(err);
        });
    },

    playGameSound: function (name) {
        let audioClipUrl = "audios/" + name;
        this.loadAudioClip(audioClipUrl, (audioClip, target) => {
            GlobalCfg.G_COMPONENTS.Audio.playSoundPro(audioClip, false);
        }, this);
    },

    playGameMusic: function (name) {
        let audioClipUrl = "audios/" + name;

        this.loadAudioClip(audioClipUrl, (audioClip, target) => {
            GlobalCfg.G_COMPONENTS.Audio.playMusic(audioClip, true)
        }, this);
    },

    onLoad: function () {
        CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.SHOW_MAYA_GAME);

        GlobalCfg.ACT_SCENE_CTRL = this,
            this.catAudiosCtrl = this.node.getComponent("catAudiosCtrl");

        this.playGameMusic('bgm');
        this.msgHandle = ClientNotify.register(GlobalCfg.MSG_TYPE.serverMsg, this.onEventMsg, this);
        this.customMsgHandle = ClientNotify.register(GlobalCfg.MSG_TYPE.clientMsg, this.onEventMsg, this);
        this.btn_back.node.on('click', this.debounce(this.componentClickCall, 1), this);
        this.btn_add.node.on('click', this.debounce(this.componentClickCall, 1), this);
        this.btn_addcash.node.on('click', this.debounce(this.componentClickCall, 1), this);
        this.btn_wf.node.on('click', this.debounce(this.componentClickCall, 1), this);
        this.btn_setting.node.on('click', this.debounce(this.componentClickCall, 1), this);
        this.btn_betJian.node.on('click', this.debounce(this.componentClickCall, 0), this);
        this.btn_betJia.node.on('click', this.debounce(this.componentClickCall, 0), this);
        this.btn_betCiShuForever.node.on('click', this.debounce(this.componentClickCall, 1), this);
        this.btn_betCiShu100.node.on('click', this.debounce(this.componentClickCall, 1), this);
        this.btn_betCiShu50.node.on('click', this.debounce(this.componentClickCall, 1), this);
        this.btn_betCiShu20.node.on('click', this.debounce(this.componentClickCall, 1), this);
        this.btn_auto.node.on('click', this.debounce(this.componentClickCall, 0.5), this);
        // this.btn_spin.node.on('click', this.debounce(this.componentClickCall, 1), this);
        this.btn_stop.node.on('click', this.debounce(this.componentClickCall, 0.5), this);
        this.btn_fg_end.node.on('click', this.debounce(this.componentClickCall, 1), this);
        this.btn_jp_minor.node.on('click', this.debounce(this.jpClickCall, 1), this);
        this.btn_jp_major.node.on('click', this.debounce(this.jpClickCall, 1), this);
        this.btn_jp_grand.node.on('click', this.debounce(this.jpClickCall, 1), this);


        this.toggle_fast.node.on('toggle', this.debounce(this.componentClickCall, 0), this);

        this.autoSpineNode = this.btn_auto.node.getChildByName('uiquan');
        this.autoSpineNode.active = false;
        this.setLabAmount(this.betAmountArr[0]);
        for (let i = 0; i < 5; i++) {
            let obj = this.node_catContent.getChildByName("ItemContent" + i)
            this.node_catContentArr.push(obj);
            let obj2 = this.node_catSkelContent.getChildByName("ItemContent" + i)
            this.node_catSkelContentArr.push(obj2);
        }
        for (let i = 1; i < 10; i++) {
            this.lineArr.push(this.node_line.getChildByName("line" + i));
        }
        //自动下注次数选择的展示
        this.node_tcBg.active = false;

        //总共赢的金额
        this.lab_totalWin.string = 0;

        this.setBetCiShuAutoTips();

        this.cashSwitch();

        if (GlobalCfg.PAYMENT_SWITCH == 2 && GlobalCfg.CHANNEL == "ios") {
            let btn_add = this.btn_add.node.getChildByName('Background').getChildByName('btn_shop');
            let btn_addcash = this.btn_addcash.node.getChildByName('Background').getChildByName('btn_addcash_SHOP');
            btn_add.active = GlobalCfg.USER_DATAS.isNotCharge;
            btn_addcash.active = GlobalCfg.USER_DATAS.isNotCharge;
        }
        this.recoverySpinBtnEvent();

        this._initSpinHoldonToggle();
        this.startSpinHoldonToggle(5); // 5 秒
        this._initSpinLongPress();
    },

    cashSwitch: function () {
        this.btn_add.node.active = GlobalCfg.USER_DATAS.openModules.includes(4);
        this.btn_addcash.node.active = GlobalCfg.USER_DATAS.openModules.includes(4);
        this.paymentSwitch = GlobalCfg.USER_DATAS.openModules.includes(4);
    },

    setBetCiShuAutoTips: function () {
        this.toggle_auto.isChecked = false;
        this.toggle_auto.interactable = false;
        this.lab_autoBetCiShu.string = 'AUTO';
    },

    showRule: function () {
        CommonFun.getInstance().loadBundle('catMachine', (bundle) => {
            bundle.load("prefab/catRule", cc.Prefab, (err, prefab) => {
                if (!err) {
                    let catRewardTipsNode = cc.instantiate(prefab);
                    CommonFun.getInstance().addToPointParent(catRewardTipsNode, "SecondLayer");
                };
            });
        }, (err) => {
            LoggerUtil.getInstance().error(`加载catMachine-Bundle异常: ${JSON.stringify(err)}`);
        });
    },

    dealJpRank: function (notify) {
        CommonFun.getInstance().loadBundle('catMachine', (bundle) => {
            bundle.load("prefab/catJPInfo", cc.Prefab, (err, prefab) => {
                if (!err) {
                    let catJPInfoNode = cc.instantiate(prefab);
                    let catJPInfoNodeCtrl = catJPInfoNode.getComponent("catJPInfoCtrl");
                    CommonFun.getInstance().addToPointParent(catJPInfoNode, "SecondLayer");
                    catJPInfoNodeCtrl.setData(notify);
                };
            });
        }, (err) => {
            LoggerUtil.getInstance().error(`加载catMachine-Bundle异常: ${JSON.stringify(err)}`);
        });
    },

    dealTaskReward: function (notify) {
        CommonFun.getInstance().showRewardsTips([{ id: 10, amount: notify.RewardCoin / 100 }]);
        GlobalCfg.USER_DATAS.userDiamond = notify.userinfo.diamond;
        this.setMyTask();
        this.setTaskInfo();
    },

    debounce: function (action, delayTime) {
        if (!delayTime) {
            return action;
        }
        let fn = function () {
            let btnNode = arguments[0].node;
            if (!btnNode.timeOut) {
                action.apply(this, arguments);
                btnNode.timeOut = setTimeout(function () {
                    if (btnNode) {
                        clearTimeout(btnNode.timeOut);
                        btnNode.timeOut = null;
                    };
                }, delayTime * 1000);
            }
        };
        return fn;
    },

    //设置jackpot奖池
    setJackPotNum: function () {
        LoggerUtil.getInstance().log(`catMachineCtrl this.jpMub  = `, this.jpMub)
        LoggerUtil.getInstance().log(`catMachineCtrl this.betAmountArrIndex  = `, this.betAmountArrIndex)
        const betAmountNum = parseFloat(this.betAmountArr[this.betAmountArrIndex]) || 0;
        const m = this.jpMub || [2000, 5000, 10000];  // 兜底
        const minor = betAmountNum * m[0] / 100;
        const major = betAmountNum * m[1] / 100;
        const grand = betAmountNum * m[2] / 100;

        // 若需要千分位或压小数位，可用你已有封装
        this.lab_jp_minor.string = minor;
        this.lab_jp_major.string = major;
        this.lab_jp_grand.string = grand;
    },

    /**
     * 初始化 btn_spin 的短按与长按检测
     */
    _initSpinLongPress: function () {
        const spinNode = this.btn_spin.node;
        if (!spinNode || !cc.isValid(spinNode)) return;

        // 清理旧事件（避免重复绑定）
        spinNode.off(cc.Node.EventType.TOUCH_START, this._onSpinTouchStart, this);
        spinNode.off(cc.Node.EventType.TOUCH_END, this._onSpinTouchEnd, this);
        spinNode.off(cc.Node.EventType.TOUCH_CANCEL, this._onSpinTouchCancel, this);
        // 绑定新事件
        spinNode.on(cc.Node.EventType.TOUCH_START, this._onSpinTouchStart, this);
        spinNode.on(cc.Node.EventType.TOUCH_END, this._onSpinTouchEnd, this);
        spinNode.on(cc.Node.EventType.TOUCH_CANCEL, this._onSpinTouchCancel, this);

        this._spinHoldTime = 0;     // 记录长按时间
        this._spinIsLongPress = false; // 标记是否触发长按
        this._spinLongPressThreshold = 0.5; // 长按阈值（秒）可调
    },

    _onSpinTouchStart: function (event) {
        if (!this.btn_spin || !this.btn_spin.interactable) {
            event && event.stopPropagation();   // 拦截
            return;
        }
        this._spinIsLongPress = false;
        this._spinHoldTime = 0;

        this.unschedule(this._checkSpinHoldTime);
        this.schedule(this._checkSpinHoldTime, 0.1);
    },

    _onSpinTouchEnd: function (event) {
        if (!this.btn_spin || !this.btn_spin.interactable) {
            event && event.stopPropagation();
            return;
        }
        this.unschedule(this._checkSpinHoldTime);
        if (!this._spinIsLongPress) {
            this._onSpinShortClick();
        } else {
            this._onSpinLongPressRelease();
        }
    },

    _onSpinTouchCancel: function (event) {
        if (!this.btn_spin || !this.btn_spin.interactable) {
            event && event.stopPropagation();
            return;
        }
        this.unschedule(this._checkSpinHoldTime);
        this._spinIsLongPress = false;
    },

    _checkSpinHoldTime: function (dt) {
        this._spinHoldTime += dt;
        if (this._spinHoldTime >= this._spinLongPressThreshold && !this._spinIsLongPress) {
            this._spinIsLongPress = true;
            this.unschedule(this._checkSpinHoldTime);
            this._onSpinLongPress();
        }
    },

    _onSpinShortClick: function () {

        // 这里走原本逻辑，不改动
        this.sendCallReq();
    },

    /** ✅ 长按触发 — 预留接口 */
    _onSpinLongPress: function () {
        LoggerUtil.getInstance().log('[Spin] 长按触发：进入特殊状态');
        this.isAuto = !this.isAuto;
        this.btn_spin.node.active = !this.isAuto;
        this.btn_stop.node.active = this.isAuto;

        if (this.isAuto) {
            this.sendCallReq();
        }
    },

    /** ✅ 长按释放（松开时） */
    _onSpinLongPressRelease: function () {
        LoggerUtil.getInstance().log('[Spin] 长按结束');
        // 👉 如果长按释放后需要退出特殊模式，可在这里补逻辑
        // TODO: this.exitSpecialSpinMode();
    },

    stopAuto: function () {
        this.isAuto = false;
        this.btn_spin.node.active = true;
        this.btn_stop.node.active = false;
    },

    start: function () {
        this.sendLoginReq();
        this.initSlotData();
    },


    onDestroy: function () {
        // 安全清理：把仍在表演的弹窗全部停掉
        if (this._popupStates) {
            for (const [uuid, st] of this._popupStates.entries()) {
                try {
                    if (st && st.skel) {
                        st.skel.setCompleteListener(null);
                        st.skel.clearTracks();
                        st.skel.setToSetupPose();
                    }
                } catch (e) { }
            }
            this._popupStates.clear();
        }
        GlobalCfg.ACT_SCENE_CTRL = null;
        ClientNotify.removeByHandle(GlobalCfg.MSG_TYPE.serverMsg, this.msgHandle);
        ClientNotify.removeByHandle(GlobalCfg.MSG_TYPE.clientMsg, this.customMsgHandle);
        CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.EXIT_MAYA_GAME);
        this.stopSpinHoldonToggle();
        [this.node_jp_pop, this.node_totalwin_pop, this.node_fg_pop].forEach(n => this._killPopupTweens(n));
    },


    onEventMsg: function (webData, target) {
        let self = target;
        let msgId = webData.msgCode;
        let notify = webData.msgData;
        if (msgId == 'gameservice.login') {
            self.setLoginNotify(notify);
        }
        else if (msgId == 'gameservice.call') {
            self.setCallNotify(notify);
        }
        else if (msgId == GlobalCfg.CLIENT_MSG_ID.CURRENCY_CHANGED_USER_INFO) {
            if (!notify.deposit || !notify.winnings){
                let num = FloatCalculation.accDiv(GlobalCfg.USER_DATAS.userDiamond, 100);
                this.lab_jb.string = CommonFun.getInstance().numberToShow(num);   
                return;
            }
            let coin = notify.deposit + notify.winnings;
            self.setUserDiamond(coin);
        }
        // else if(msgId == GlobalCfg.CLIENT_MSG_ID.FIRST_RECHARGE_TIPS) {
        //     SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.MAYA, SceneManager.getInstance().sceneType.LOBBY);
        // }
        else if (msgId == GlobalCfg.CLIENT_MSG_ID.GAME_MENU_CLICK_OUT_TO_LOBBY) {
            if (self.isRunningCatAnim) {
                CommonFun.getInstance().showMsgBox(self.tipsLabel[0], "YES_NO", () => {
                    SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.CAT, SceneManager.getInstance().sceneType.LOBBY);
                }, false);
            }
            else {
                SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.CAT, SceneManager.getInstance().sceneType.LOBBY);
            };
        }
        else if (msgId == GlobalCfg.CLIENT_MSG_ID.GAME_MENU_CLICK_HOW_TO_PLAY) {
            self.showRule();
        }
        else if (msgId == "lobbyservice.kicktolobby") {
            SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.CAT, SceneManager.getInstance().sceneType.LOBBY);
        }
        else if (msgId == "STOP_GAME") {
            self.setBetCiShuAutoTips();
        }
        else if (msgId == 'gameservice.getranking') {
            // 获取jp排行榜
            self.dealJpRank(notify);
        }
        else if (msgId == 'gameservice.claimtaskreward') {
            self.dealTaskReward(notify);
        }
    },

    checkWebMsgError: function (webData, target) {
        let self = target;
        let msgId = webData.msgCode;
        let notify = webData.msgData;
        this.curSendSpin = false;
        if (!notify) {
            let info = {
                errorMessage: `MayaMachine游戏中, 服务器下发的非正确消息中结构体异常, 内容为===>${JSON.stringify(webData)}`
            };
            CommonFun.getInstance().reportToTelegram(info);
            return;
        };
        let result = notify.result;
        if (notify.Result) {
            result = notify.Result;
        };
        if (msgId === "gameservice.login") {
            CommonFun.getInstance().showMsgBox(result.message, "YES", () => {
                SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.CAT, SceneManager.getInstance().sceneType.LOBBY);
            }, false);
        }
        else if (msgId === "gameservice.call") {
            if (CommonFun.getInstance().isFreePlayerDirectedToFreeTP()) {
                if (result.result == 57) {
                    CommonFun.getInstance().showDiversionFreeTP(() => {
                        // SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.SGJ, SceneManager.getInstance().sceneType.LOBBY);
                    });
                }
                else {
                    CommonFun.getInstance().showTips(result.message);
                };
            }
            else {
                CommonFun.getInstance().showTips(result.message);
            };
        }
        else {
            CommonFun.getInstance().showTips(result.message);
        }
    },

    setLoginNotify: function (notify) {
        if (!notify) {
            return;
        }

        LoggerUtil.getInstance().log("catMachineCtrl setLoginNotify:", notify)

        this.setFreesList(notify.frees);
        this.setUserDiamond(notify.userinfo.diamond);
        this.jpMub = notify.jpMub; //jp倍数

        let freeCountItem = this.getFreesItemOfFreeCount();
        LoggerUtil.getInstance().log("catMachineCtrl freeCountItem:", freeCountItem)

        this.taskConfig = notify.tasks;
        this.taskMyInfo = notify.playerTasks;
        this.setTaskInfo();

        if (freeCountItem) {
            let amount = freeCountItem.amount / 100;
            let freeCount = freeCountItem.freeCount;
            let freePool = freeCountItem.freePool / 100;

            this.setLabAmount(amount)
            this.lab_totalWin.string = freePool.toFixed(2);
            this.freeTotalWinNum = freePool;
            this.lab_autoBetCiShu.string = freeCount;
            this.lab_autoBetCiShu.node.color = new cc.Color(255, 255, 51);
            this.toggle_auto.interactable = false;
            this.autoSpineNode.active = true;

            let proroID = 'gameservice.call';
            let message = 'CallReq';
            GameServerManager.send(proroID, message, {
                amount: amount * 100
            });

            return;
        }

        if (this.isAuto) {
            this.sendCallReq();
        }
        else {
            this.btn_spin.interactable = true;
            this.btn_spin.enableAutoGrayEffect = false;
        }
    },

    initSlotData: function () {
        for (let j = 0, len1 = this.node_catContentArr.length; j < len1; j++) {
            let children = this.node_catContentArr[j].children;
            for (let k = 0, len2 = children.length; k < len2; k++) {
                let src = children[k].getComponent('catItemCtrl');
                src.initIcon();
            };
        };
        this.setJackPotNum();
    },

    setTaskInfo: function () {
        if (!this.taskConfig || this.taskConfig.length === 0) {
            LoggerUtil.getInstance().error('setTaskInfo: taskConfig is empty');
            return;
        }
        if (!this.taskMyInfo || this.taskMyInfo.length === 0) {
            // 没有我的任务进度，默认用第一个配置
            this.setTaskItem(this.taskConfig[0].Cards, 0, this.taskConfig[0].Count);
            return;
        }

        const betAmountNum = parseFloat(this.betAmountArr[this.betAmountArrIndex]) || 0;
        let mybet = betAmountNum * 100;

        let curBetTaskInfo = null;
        for (let i = 0, len = this.taskMyInfo.length; i < len; i++) {
            if (this.taskMyInfo[i] && this.taskMyInfo[i].Bet == mybet) {
                curBetTaskInfo = this.taskMyInfo[i];
                break;
            }
        }

        if (!curBetTaskInfo) {
            this.setTaskItem(this.taskConfig[0].Cards, 0, this.taskConfig[0].Count);
            return;
        }

        let curTaskConfig = this.getTaskDetailById(curBetTaskInfo.Id) || this.taskConfig[0];
        this.setTaskItem(curTaskConfig.Cards, curBetTaskInfo.Count, curTaskConfig.Count);
    },

    setTaskItem: function (itemId, cur, all) {
        let taskProgress = this.node_task.getChildByName('updateLayer').getComponent(cc.ProgressBar)
        let taskinfo = this.node_task.getChildByName('taskinfo')
        let img_symbol = taskinfo.getChildByName('img_symbol').getComponent(cc.Sprite)
        let win = taskinfo.getChildByName('win')
        let lab_task = taskinfo.getChildByName('info').getChildByName('lab_task').getComponent(cc.Label)
        let rewardtips = taskinfo.getChildByName('rewardtips')
        let img_cat = taskProgress.node.getChildByName('bar').getChildByName('task_cat')
        let btn_collect = win.getComponent(cc.Button)

        let spriteFrame = this.spriteAtlas_icon.getSpriteFrame("icon_" + itemId);
        img_symbol.spriteFrame = spriteFrame;
        let progress = cur / all
        taskProgress.progress = progress;

        lab_task.string = `${cur}/${all}`
        win.active = progress == 1
        rewardtips.active = progress == 1
        img_symbol.node.active = progress != 1
        img_cat.setPosition(1040 * progress, img_cat.y);
        if (progress == 1) {
            win.getComponent(cc.Animation).play("move")
            rewardtips.getComponent(cc.Animation).play("swing")

            if (btn_collect && btn_collect.node) {
                btn_collect.node.off('click');  // 防重
                btn_collect.node.on('click', () => {
                    const betAmountNum = parseFloat(this.betAmountArr[this.betAmountArrIndex]) || 0;
                    GameServerManager.send(
                        "gameservice.claimtaskreward",
                        "ClaimTaskRewardReq",
                        { bet: betAmountNum * 100 }
                    );
                });
            }
        }
    },

    setMyTask: function (task) {
        if (task == null) {
            const betAmountNum = parseFloat(this.betAmountArr[this.betAmountArrIndex]) || 0;
            let mybet = parseFloat(betAmountNum) * 100;
            for (let i = 0, len = this.taskMyInfo.length; i < len; i++) {
                if (this.taskMyInfo[i].Bet == mybet) {
                    this.taskMyInfo.splice(i, 1);  // ✅ 改成 splice
                    break;
                }
            }
            return;
        }

        LoggerUtil.getInstance().log("setMyTask task", task)
        LoggerUtil.getInstance().log("1 setMyTask taskMyInfo", this.taskMyInfo)
        let isHave = false;
        for (let i = 0; i < this.taskMyInfo.length; i++) {
            if (this.taskMyInfo[i].Id == task.Id) {
                isHave = true;
                this.taskMyInfo[i] = task;
                break;
            }
        }
        if (!isHave) {
            this.taskMyInfo.push(task);
        }
        LoggerUtil.getInstance().log("2 setMyTask taskMyInfo", this.taskMyInfo)
    },

    getTaskDetailById: function (id) {
        for (let i = 0; i < this.taskConfig.length; i++) {
            if (this.taskConfig[i].Id == id) {
                return this.taskConfig[i]
            }
        }
        LoggerUtil.getInstance().log("getTaskDetailById error")
        return this.taskConfig[0]
    },


    setUserDiamond: function (diamond) {
        GlobalCfg.USER_DATAS.userDiamond = diamond;
        let num = FloatCalculation.accDiv(GlobalCfg.USER_DATAS.userDiamond, 100);
        this.lab_jb.string = CommonFun.getInstance().numberToShow(num);
    },

    setLabAmount: function (amount) {
        this.lab_betAmount.string = amount;
        let multiple = parseFloat(amount) / 9;
        this.lab_betAmount2.string = multiple + "x9";
    },

    setFreesList: function (frees) {
        if (!frees) {
            return;
        };
        this.frees = frees;
    },

    // 通过下注倍数，获取对应的免费情况
    getFreesItem: function (amount) {
        for (let i = 0, len = this.frees.length; i < len; i++) {
            const element = this.frees[i];
            if (element.amount == amount) {
                return element;
            }
        }
        return {};
    },

    getFreesItemOfFreeCount: function () {
        for (let i = 0, len = this.frees.length; i < len; i++) {
            const element = this.frees[i];
            if (element.freeCount > 0) {
                return element;
            }
        }
    },

    setCallNotify: function (notify) {
        this.curSendSpin = false; //当前是否在发送请求 如果收到服务器回复，说明请求已经发送 避免多次发送
        this.gameResult = {};
        this.gameResult.userinfo = notify.userinfo;
        this.gameResult.xiannum = notify.xiannum;
        this.gameResult.cards = notify.cards;
        this.gameResult.mianfeinum = notify.mianfeinum;
        this.gameResult.execNum = notify.execNum;
        this.gameResult.addFgCount = notify.addFgCount;
        this.gameResult.rewardtype = notify.rewardtype;
        this.gameResult.freePool = notify.freePool;
        this.gameResult.jpWin = notify.jpWin;
        this.setMyTask(notify.playerTask)

        this.hideSlotState();

        //设置转动的音效
        this.playGameSound('zhuang');

        //先扣除下注的金额
        if (this.gameResult.mianfeinum == 0) {
            let diamond = GlobalCfg.USER_DATAS.userDiamond - parseFloat(this.lab_betAmount.string) * 100;
            let num = FloatCalculation.accDiv(diamond, 100);
            this.lab_jb.string = CommonFun.getInstance().numberToShow(num);
        };

        if (this.gameResult.rewardtype == 1) {
            this.lab_totalWin.string = 0;
            this.freeTotalWinNum = 0;
        };

        this.dealSpinBtnEvent();
        this.startSlotsAnim();
        this.setTaskInfo(); //设置任务信息
    },

    componentClickCall: function (component) {
        let componentName = component.node.name;
        GlobalCfg.G_COMPONENTS.Audio.playButton();
        if (componentName == "btn_back") {
            CommonFun.getInstance().showGameMenu(false);
        }
        else if (componentName == "btn_add") {
            CommonFun.getInstance().showSmallAddCash()
        }
        else if (componentName == "btn_addcash") {
            CommonFun.getInstance().showSmallAddCash()
        }
        else if (componentName == "btn_wf") {
            CommonFun.getInstance().showRule("mayaMachine");
        }
        else if (componentName == "btn_setting") {
            let pab_setting = cc.instantiate(this.pab_setting);
            this.node.addChild(pab_setting);
        }
        else if (componentName == "btn_betJian") {
            this.dealbetBtnEvent("jian");
        }
        else if (componentName == "btn_betJia") {
            this.dealbetBtnEvent("jia");
        }
        else if (componentName == "toggle_fast") {
            this.dealFastBtnEvent();
        }
        else if (componentName == "btn_betCiShuForever") {
            this.dealAutoBetCiShuBtnEvent("999");
        }
        else if (componentName == "btn_betCiShu100") {
            this.dealAutoBetCiShuBtnEvent("100");
        }
        else if (componentName == "btn_betCiShu50") {
            this.dealAutoBetCiShuBtnEvent("50");
        }
        else if (componentName == "btn_betCiShu20") {
            this.dealAutoBetCiShuBtnEvent("20");
        }
        else if (componentName == "btn_auto") {
            this.dealAutoBtnEvent();
        }
        else if (componentName == "btn_spin") {
            this.sendCallReq();
        }
        else if (componentName == "btn_stop") {
            this.stopAuto();
        }
        else if (componentName == "btn_fg_end") {
            this.dealFreeGameEndEvent();
        }
    },

    jpClickCall: function () {
        GameServerManager.send("gameservice.getranking", "GetRankingReq", {});
    },

    hideSlotState: function () {
        this.unscheduleAllCallbacks();
        this.hideLine()
        for (let j = 0, len1 = this.node_catContentArr.length; j < len1; j++) {
            let children = this.node_catContentArr[j].children;
            let children2 = this.node_catSkelContentArr[j].children;
            for (let k = 0, len2 = children.length; k < len2; k++) {
                let src = children[k].getComponent('catItemCtrl');
                src.stopAnimation(0);
                let src2 = children2[k].getComponent('catSkelItemCtrl');
                src2.stopAnimation(0);
            };
        };
    },

    dealbetBtnEvent: function (btnType) {
        if (btnType == "jian" && this.betAmountArrIndex > 0) {
            this.betAmountArrIndex -= 1;
        }
        else if (btnType == "jia" && this.betAmountArrIndex < this.betAmountArr.length - 1) {
            this.betAmountArrIndex += 1;
        }
        else if (btnType == "max") {
            this.betAmountArrIndex = this.betAmountArr.length - 1;
        };

        let betAmount = this.betAmountArr[this.betAmountArrIndex];
        this.setLabAmount(betAmount)
        if (this.betAmountArrIndex == 0) {
            this.setBetBtnActive(false, true);
        }
        else if (this.betAmountArrIndex == this.betAmountArr.length - 1) {
            this.setBetBtnActive(true, false);
        }
        else {
            this.setBetBtnActive(true, true);
        };

        this.setJackPotNum();
        this.setTaskInfo(); //切换Bet金额时，更新任务信息
    },

    setBetBtnActive: function (betJianActive, betJiaActive) {
        this.btn_betJian.interactable = betJianActive;
        this.btn_betJian.enableAutoGrayEffect = !betJianActive;
        this.btn_betJia.interactable = betJiaActive;
        this.btn_betJia.enableAutoGrayEffect = !betJiaActive;
    },

    dealFastBtnEvent: function () { },

    dealAutoBetCiShuBtnEvent: function (ciShuType) {
        this.lab_autoBetCiShu.string = ciShuType;
        this.toggle_auto.isChecked = true;
        this.toggle_auto.interactable = true;
        this.node_tcBg.active = false;
    },

    dealAutoBtnEvent: function () {
        let active = this.node_tcBg.active;
        this.node_tcBg.active = !active;
    },

    dealSpinBtnEvent: function () {
        this.node_tcBg.active = false;

        this.btn_spin.interactable = false;
        this.btn_spin.enableAutoGrayEffect = true;

        this.btn_auto.interactable = false;
        this.btn_auto.enableAutoGrayEffect = true;

        this.btn_betJia.interactable = false;
        this.btn_betJia.enableAutoGrayEffect = true;

        this.btn_betJian.interactable = false;
        this.btn_betJian.enableAutoGrayEffect = true;
    },
    // 3) 切换实现（替换为这一版）
    _initSpinHoldonToggle: function () {
        const root = this.btn_spin && this.btn_spin.node;
        if (!root || !cc.isValid(root)) return;

        this._spinNode = root.getChildByName('Background').getChildByName('spin');
        this._holdonNode = root.getChildByName('Background').getChildByName('holdon');
        this._holdonSkel = this._holdonNode ? this._holdonNode.getComponent(sp.Skeleton) : null;

        // 保持 active=true，用透明度控制
        if (this._spinNode) this._spinNode.active = true;
        if (this._holdonNode) this._holdonNode.active = true;
        if (this._spinNode) this._spinNode.opacity = 255;
        if (this._holdonNode) this._holdonNode.opacity = 0;

        if (this._holdonSkel) {
            this._holdonSkel.animation = '';
            this._holdonSkel.loop = false;
            this._holdonSkel.clearTracks();
            this._holdonSkel.setToSetupPose();
            this._holdonSkel.setCompleteListener(null);
        }

        this._showingHoldon = false;

        // ❌ 不再使用 director scheduler + 自建 {} target
        // ✅ 仅保留函数引用，后续用 this.schedule/unschedule
        this._spinToggleFn = this._spinToggleFn || this._toggleSpinHoldon.bind(this);
    },

    startSpinHoldonToggle: function (intervalSec = 5) {
        // 先停再启，防重复
        this.stopSpinHoldonToggle();

        if (!this._spinToggleFn) {
            this._spinToggleFn = this._toggleSpinHoldon.bind(this);
        }

        // 先立即切一次（按需）
        this._spinToggleFn();

        // 用组件自带的 schedule，target = this（合法的 CCObject）
        // repeat = cc.macro.REPEAT_FOREVER
        this.schedule(this._spinToggleFn, intervalSec, cc.macro.REPEAT_FOREVER, 0);
    },

    stopSpinHoldonToggle: function () {
        if (this._spinToggleFn) {
            // 组件自己的 unschedule，不涉及非法 target
            this.unschedule(this._spinToggleFn);
        }
    },

    _toggleSpinHoldon: function () {
        if (!cc.isValid(this)) return;
        const spin = this._spinNode, holdon = this._holdonNode, skel = this._holdonSkel;
        if (!spin || !holdon) return;

        this._showingHoldon = !this._showingHoldon;

        if (this._showingHoldon) {
            // 显示 holdon（不改 active），仅用透明度
            spin.opacity = 0;
            holdon.opacity = 255;

            if (skel) {
                skel.clearTracks();
                skel.setToSetupPose();

                const animName = this._getFirstSkeletonAnimName(skel);
                if (animName) {
                    // 单次播放：loop = false
                    const entry = skel.setAnimation(0, animName, false);

                    // 保险：确保没人把它在 complete 里再播一次
                    skel.setCompleteListener(() => {
                        // 播完还原到 setup（按需）
                        skel.setToSetupPose();
                        // 如果你希望播完后切回 spin，在这里手动切：
                        // this._showingHoldon = false;
                        // spin.opacity = 255; holdon.opacity = 0;
                    });
                }
            }
        } else {
            // 显示 spin
            holdon.opacity = 0;
            spin.opacity = 255;

            // 停掉 holdon 的轨道，避免残留
            if (skel) {
                skel.clearTracks();
                skel.setToSetupPose();
            }
        }
    },


    _getFirstSkeletonAnimName: function (skeleton) {
        if (!skeleton) return 'animation';
        const sd = skeleton.skeletonData;
        if (sd && sd.skeletonJson && sd.skeletonJson.animations) {
            const keys = Object.keys(sd.skeletonJson.animations);
            if (keys.length) return keys[0];
        }
        if (sd && typeof sd.getAnims === 'function') {
            const arr = sd.getAnims();
            if (arr && arr.length) return arr[0].name || arr[0];
        }
        return 'animation';
    },

    /**
     * 分数变化动画
     * @param {cc.Label} label 显示分数的Label组件
     * @param {Number} startValue 开始分数
     * @param {Number} endValue 结束分数
     * @param {Number} time 动画时间(秒)
     * @param {Function} [callback] 动画结束回调
     * @param {Boolean} [isInt=false] 是否以整数形式变化(默认false，即允许小数动画)
     */
    runChangeTotalWinScore: function (label, startValue, endValue, time, callback, isInt = false) {
        // 目标无效就直接回调
        if (!cc.isValid(label) || !cc.isValid(label.node) || !cc.isValid(this)) {
            callback && callback();
            return;
        }

        this.popCoinIsRun = true;

        // 将动画状态挂到组件自身，方便 stopAllByTarget(this)
        this._numTweenVal = startValue;

        // 是否需要两位小数
        const shouldShowTwoDecimals = !isInt &&
            (Math.abs(endValue - Math.floor(endValue)) > 0.01 ||
                Math.abs(startValue - Math.floor(startValue)) > 0.01);

        cc.tween(this)
            .to(time, { _numTweenVal: endValue }, {
                onUpdate: () => {
                    // 任一对象无效 → 立刻停掉
                    if (!cc.isValid(this) || !cc.isValid(label) || !cc.isValid(label.node)) {
                        cc.Tween.stopAllByTarget(this);
                        this.popCoinIsRun = false;
                        return;
                    }

                    let v = this._numTweenVal;
                    if (isInt) {
                        v = Math.floor(v);
                    } else {
                        v = shouldShowTwoDecimals ? parseFloat(v.toFixed(2)) : parseFloat(v.toFixed(1));
                    }

                    // 再次防御
                    if (cc.isValid(label) && cc.isValid(label.node)) {
                        label.string = v.toString();
                    }
                }
            })
            .call(() => {
                if (cc.isValid(this) && cc.isValid(label) && cc.isValid(label.node)) {
                    if (isInt) label.string = Math.floor(endValue).toString();
                    else label.string = (shouldShowTwoDecimals ? endValue.toFixed(2) : endValue.toFixed(1));
                }
                this.popCoinIsRun = false;
                callback && callback();
            })
            .start();
    },

    startSlotsAnim: function () {
        if (this.isRunningCatAnim) return;
        this.isRunningCatAnim = true;
        let isFast = this.toggle_fast.isChecked;
        // ✅ 加快整体转速：把时间缩短一些（比你之前再快一档）
        this.kRate = isFast ? 0.35 : 0.80;
        // ✅ 允许停下的“当前列”从第0列开始
        this._allowStopCol = 0;

        // ✅ 每列启动间隔也缩短
        let catContentTime = 0.03 * this.kRate;

        for (let i = 0, len = this.node_catContentArr.length; i < len; i++) {
            let children = this.node_catContentArr[i].children;
            let children2 = this.node_catSkelContentArr[i].children;
            for (let k = 0, lenk = children.length; k < lenk; k++) {
                let item = children[k];
                let item2 = children2[k];
                item.repeat = 4;     // 初始循环计数
                item.index = k;       // 行索引：0=buffer 1/2/3=可见三行
                item.shu = i;         // 列索引
                this.scheduleOnce(() => {
                    this.runSlotsItemAnim(item, item2, item.y, item.y - this.height);
                }, catContentTime * i);
            }
        }
    },

    runSlotsItemAnim: function (node, skelNode, startPositionY, endedPositionY) {
        let self = this;

        // ✅ 只有“被允许的列”才能推进到 17+；其他列卡在 16 循环转动
        if (node.repeat >= 16) {
            if (node.shu <= this._allowStopCol) {
                node.repeat += 1;   // 被允许 → 可以继续走 17/18/19/20
            } else {
                node.repeat = 16;   // 未到它 → 先固定在16，保持随机滚动
            }
        } else {
            node.repeat += 1;       // 16以下都正常加
        }

        node.setPosition(cc.v2(0, startPositionY));
        let repeat = node.repeat;
        let index = node.index;
        let shu = node.shu;

        // ✅ 再次稍微加快单步时间
        let runTime = 0.06 * self.kRate;
        let easeType = '';
        if (repeat == 20) {
            easeType = 'backOut';
            runTime = 0.45 * self.kRate; // 停下来的回弹慢点更有“落停感”
        }

        cc.tween(node)
            .to(runTime, { position: cc.v2(0, endedPositionY) }, { easing: easeType })
            .call(() => {
                if (repeat == 20) {
                    // 到达底部复位
                    if (endedPositionY <= -(this.height * 2)) {
                        node.setPosition(cc.v2(0, this.height * 2));
                    }

                    // ✅ 这个列已经真正停下了，放行下一列
                    if (shu === this._allowStopCol) {
                        this._allowStopCol++;
                    }

                    self.checkAnimFinish();
                    return;
                }

                // 到达底部边界时重置 + 赋值/随机
                if (endedPositionY <= -(this.height * 2)) {
                    let src = node.getComponent('catItemCtrl');
                    let src2 = skelNode.getComponent('catSkelItemCtrl');

                    // ✅ 最后三圈按照你的结果表赋值（注意你之前的 19/18/17 与 index 映射）
                    if (repeat == 19 && index == 1) {
                        let itemID = self.gameResult.cards[shu].cards[0];
                        src.setItemData(itemID);  src2.setItemData(itemID);
                        node.itemID = itemID;     skelNode.itemID = itemID;
                    } else if (repeat == 18 && index == 2) {
                        let itemID = self.gameResult.cards[shu].cards[1];
                        src.setItemData(itemID);  src2.setItemData(itemID);
                        node.itemID = itemID;     skelNode.itemID = itemID;
                    } else if (repeat == 17 && index == 3) {
                        let itemID = self.gameResult.cards[shu].cards[2];
                        src.setItemData(itemID);  src2.setItemData(itemID);
                        node.itemID = itemID;     skelNode.itemID = itemID;
                    } else {
                        // 还在高速随机阶段
                        let num = Math.floor(Math.random() * 10 + 1);
                        if (shu == 0 && num == 10) num = 9;
                        else if (shu >= 3 && num == 11) num = 10;
                        src.setItemData(num, false);
                        src2.setItemData(num, false);
                        node.itemID = num;
                    }

                    // 复位到顶部继续向下滚
                    self.runSlotsItemAnim(node, skelNode, this.height * 2, this.height);
                } else {
                    // 继续往下移动
                    self.runSlotsItemAnim(node, skelNode, endedPositionY, endedPositionY - this.height);
                }
            })
            .start();
    },


    checkAnimFinish: function () {
        this.finishedCatItemNum += 1;
        if (this.finishedCatItemNum == 20) {
            this.finishedCatItemNum = 0;
            if (this.gameResult) {
                this.showSettlementResult();
            };
        };
    },

    recoverySpinBtnEvent: function () {
        this.btn_spin.interactable = true;
        this.btn_spin.enableAutoGrayEffect = false;
        this.btn_auto.interactable = true;
        this.btn_auto.enableAutoGrayEffect = false;
        const first = parseFloat(this.betAmountArr[0]);
        const last = parseFloat(this.betAmountArr[this.betAmountArr.length - 1]);
        const cur = parseFloat(this.lab_betAmount.string);
        this.btn_betJian.interactable = cur > first;
        this.btn_betJian.enableAutoGrayEffect = !(cur > first);
        this.btn_betJia.interactable = cur < last;
        this.btn_betJia.enableAutoGrayEffect = !(cur < last);
    },

    /**
     * 取一列中“可见三行”节点（按 y 从高到低：上/中/下）
     * @param {number} col 列索引 0..4
     * @param {number} type 1:icon 2:skel
     * @returns {cc.Node[]} [topNode, midNode, botNode]
     */
    _getVisibleRowNodes: function (col, type) {
        const colArr = (type === 2 ? this.node_catSkelContentArr : this.node_catContentArr)[col];
        if (!colArr) return [null, null, null];
        let childrenSorted = colArr.children.slice().sort((a, b) => b.y - a.y);

        // ✅ 如果是骨骼层，自动平移 y，使其与 icon 层对齐
        if (type === 2) {
            const iconArr = this.node_catContentArr[col];
            if (iconArr) {
                const iconYs = iconArr.children.slice().sort((a, b) => b.y - a.y).map(n => n.y);
                const skelYs = childrenSorted.map(n => n.y);
                const offset = (skelYs[1] - iconYs[1]) || 0;  // 取中间行偏差
                if (Math.abs(offset) > 1) {
                    childrenSorted.forEach(n => (n.y -= offset));
                }
            }
        }

        if (childrenSorted.length >= 4) {
            return [childrenSorted[1], childrenSorted[2], childrenSorted[3]];
        } else {
            return [childrenSorted[0] || null, childrenSorted[1] || null, childrenSorted[2] || null];
        }
    },
    _mapRowIndex(row) {
        // 可见三行在 children[1], [2], [3]
        return row + 1;
    },
    _getIconByColRow(col, row) {
        const parent = this.node_catContentArr[col];
        if (!parent) return null;
        const idx = this._mapRowIndex(row);
        return parent.children[idx] || null;
    },
    _getSkelByColRow(col, row) {
        const parent = this.node_catSkelContentArr[col];
        if (!parent) return null;
        const idx = this._mapRowIndex(row);
        return parent.children[idx] || null;
    },

    //结算
    showSettlementResult: function () {
        let totalMultiple = 0;
        for (let i = 0, len = this.gameResult.xiannum.length; i < len; i++) {
            let multiple = this.gameResult.xiannum[i].multiple;
            if (multiple == null) {
                multiple = 0;
            }
            totalMultiple += multiple;
        };
        let startScore = Number(this.freeTotalWinNum);
        let bet = parseFloat(this.lab_betAmount.string); //下注金额

        //奖励类型 (1:正常金币奖励, 2:免费次数奖励)
        let endedScore = this.gameResult.rewardtype == 2 ? this.gameResult.freePool / 100 : totalMultiple * bet / 100 / 9 + startScore;
        LoggerUtil.getInstance().log("caojun 结算结果 this.gameResult ：", this.gameResult);
        LoggerUtil.getInstance().log("caojun 结算结果 endedScore ：", endedScore);
        this.freeTotalWinNum = endedScore;
        let isFGEnd = false;
        if (this.gameResult.mianfeinum == null && this.gameResult.execNum > 1) {//是否是FG结束
            isFGEnd = true;
        }
        let finalScore = endedScore - startScore; //FG和MG的最终得分有区别
        if (isFGEnd == true) {
            finalScore = endedScore; //最后一把直接用总分 用于显示bigwin
        }
        this.bigWinLevel = this.getBigWinLevel(finalScore / bet);
        this.showSpinResult();
        if (finalScore > 0) {
            let time = finalScore < 1 ? 0.6 : 1; //低于1分，因为有小数点的滚动所以时间要短一些
            this.lab_totalWin.node.active = true;
            this.node_goodluck.active = false;
            this.runChangeTotalWinScore(this.lab_totalWin, startScore, endedScore, time, () => {
                let yanchiTime = 0.1;
                if (this.gameResult.mianfeinum > 0) { //如果为免费次数，则先需要让元素播放2次再进行结算
                    yanchiTime = 1;
                }
                let self = this;
                this.scheduleOnce(() => {
                    if (self.bigWinLevel > 0) { //如果有big弹窗 则需要在弹窗之后再结算
                        self.showBigWinTips(finalScore);
                    }
                    else self.startNextSpin();
                }, yanchiTime);
            })
            return;
        }
        this.startNextSpin();
    },

    showBigWinTips: function (finalScore) {
        CommonFun.getInstance().loadBundle('catMachine', (bundle) => {
            bundle.load("prefab/catRewardTips", cc.Prefab, (err, prefab) => {
                if (!err) {
                    let catRewardTipsNode = cc.instantiate(prefab);
                    let catRewardTipsCtrl = catRewardTipsNode.getComponent("catRewardTipsCtrl");
                    CommonFun.getInstance().addToPointParent(catRewardTipsNode, "SecondLayer");
                    catRewardTipsCtrl.showRewardTips(finalScore, this.bigWinLevel, () => {
                        this.startNextSpin();
                    })
                };
            });
        }, (err) => {
            LoggerUtil.getInstance().error(`加载catMachine-Bundle异常: ${JSON.stringify(err)}`);
        });
    },

    getBigWinLevel: function (betMul) {
        let level = 0;
        if (5 <= betMul && betMul < 20) { //bigwin
            level = 1;
        }
        else if (20 <= betMul && betMul < 100) { //megawin
            level = 2;
        }
        else if (100 <= betMul) { //superwin
            level = 3;
        }
        return level;
    },

    playGameBigWinSound: function () {
        let self = this;
        this.playGameMusic('win')
        this.scheduleOnce(() => {
            if (self.gameResult && self.gameResult.mianfeinum > 0) {
                this.playGameMusic('bgm')
            }
            else {
                this.playGameMusic('bgm')
            }
        }, 2);
    },

    showSpinResult: function () {
        let isNeedShowAnim = false;
        let xiannumArr = this.gameResult.xiannum;
        for (let i = 0, len = xiannumArr.length; i < len; i++) {
            let xiannum = xiannumArr[i];
            let score = xiannum.multiple;   //是否有得分
            if (score && score > 0) {
                isNeedShowAnim = true;
                break;
            };
        };
        this.showFGSymbol(1); //显示元素出现动画
        if (isNeedShowAnim) {
            this.playGameSound("lianxian");
            this.showXianNum();
            // this.node_windb.active = true;
        }
        else {
            this.isRunningCatAnim = false;
        };
    },

    showFGSymbol: function (type) {
        for (let col = 0; col < this.node_catContentArr.length; col++) {
            const iconRows = this._getVisibleRowNodes(col, 1);
            const skelRows = this._getVisibleRowNodes(col, 2);
            for (let r = 0; r < 3; r++) {
                const iconNode = iconRows[r];
                const skelNode = skelRows[r];
                if (!iconNode || !skelNode) continue;
                const id = iconNode.itemID;
                if (id == 10) {
                    iconNode.getComponent('catItemCtrl').playAnimation();
                    const skelCtrl = skelNode.getComponent('catSkelItemCtrl');
                    if (type === 1) skelCtrl.playFreeGameApppear();
                    else skelCtrl.playFreeGameWait();
                }
            }
        }
    },

    startNextSpin: function () {
        let StartNextSpin = () => {
            if (this.isRunningCatAnim) {
                return;
            };
            this.setUserDiamond(this.gameResult.userinfo.diamond); //结算完成，更新用户钻石
            this.unschedule(StartNextSpin);
            if (this.gameResult.mianfeinum > 0) {
                this.isFg = true;
                this.toggle_auto.interactable = false;
                if (this.gameResult.execNum == 1) {//刚进入FG
                    this.startFreeGame(this.gameResult.mianfeinum);
                }
                else {
                    if (this.gameResult.addFgCount && this.gameResult.addFgCount > 1) //FG过程中又中FG
                        // this.addFreeGame(this.gameResult.addFgCount);
                        this.dealFreeGame(this.lab_betAmount.string, this.gameResult.mianfeinum);
                    else
                        this.dealFreeGame(this.lab_betAmount.string, this.gameResult.mianfeinum);
                }
            }
            else {
                this.isFg = false;
                if (this.gameResult.execNum > 1) {//说明是FG最后一次spin 需要结算
                    let finalScore = CommonFun.getInstance().numberToShow(this.gameResult.freePool / 100);
                    this.PlayFGEndAnim(finalScore, () => {
                        this.curRoundAddCoinFinish();
                        if (this.isAuto) {
                            this.sendCallReq();
                        }
                        else {
                            this.recoverySpinBtnEvent();
                        };
                        this.playGameMusic("bgm");
                        this.background.spriteFrame = this.mg_bg;
                    });
                }
                else {
                    this.checkWinJp(() => {
                        this.background.spriteFrame = this.mg_bg; // 兜底
                        this.curRoundAddCoinFinish();
                        if (this.isAuto) {
                            this.sendCallReq();
                        }
                        else {
                            this.recoverySpinBtnEvent();
                        };
                    });
                }
                this.node_free.active = false;
            }
        };
        this.schedule(StartNextSpin, 0.01);
    },

    curRoundAddCoinFinish() {
        if (cc.isValid(this)) {
            let minLimit = this.betAmountArr[0] || 0;
            CommonFun.getInstance().gameShowSecondRecharge(minLimit, Number.MAX_SAFE_INTEGER, () => {
                minLimit = parseFloat(minLimit) * 100;
                if (cc.isValid(this)) {
                    if (GlobalCfg.IS_SHOW_BANKRUPT) { //破产界面显示时才需要暂停自动spin
                        this.toggle_auto.isChecked = false;
                    }
                }
            });
            CommonFun.getInstance().showWithdrawToastInGame();
        }
    },

    /** 取第 col 列第 row 行的 icon 节点 */
    _getIconByColRow: function (col, row) {
        const colNode = this.node_catContentArr[col];
        return colNode && colNode.children[row] || null;
    },

    /** 取第 col 列第 row 行的 spine 节点 */
    _getSkelByColRow: function (col, row) {
        const colNode = this.node_catSkelContentArr && this.node_catSkelContentArr[col];
        return colNode && colNode.children[row] || null;
    },

    /** 把 icon 节点配对上 skel 节点与其脚本，返回一个“配对对象” */
    _makePair: function (iconNode) {
        if (!iconNode) return null;
        // 列、行：列=父容器在 node_catContentArr 的下标；行=子节点的 index（你在滚动时已赋过 index）
        const col = iconNode.shu != null ? iconNode.shu : this.node_catContentArr.indexOf(iconNode.parent);
        const row = iconNode.index != null ? iconNode.index : iconNode.parent.children.indexOf(iconNode);

        const skelNode = this._getSkelByColRow(col, row);
        const skelCtrl = skelNode ? skelNode.getComponent('catSkelItemCtrl') : null;
        const iconCtrl = iconNode.getComponent('catItemCtrl');

        return { icon: iconNode, iconCtrl, skel: skelNode, skelCtrl, col, row };
    },

    /**
     * 显示中奖线动画
     */
    showXianNum: function () {
        if (!this.gameResult) return;

        const iconLines = this.buildLineArrayByRules(1);
        const skelLines = this.buildLineArrayByRules(2);
        LoggerUtil.getInstance().log('iconLines', iconLines);
        LoggerUtil.getInstance().log('skelLines', skelLines);
        // 播放
        this.playInstantAnimation(iconLines, 1);
        this.playInstantAnimation(skelLines, 2);

        this.setLine();
    },

    getXianRule: function (ref) {
        // 返回每条线的 [col,row] 路径（row: 0=上,1=中,2=下）
        switch (ref) {
            case 1: return [[0, 1], [1, 1], [2, 1], [3, 1], [4, 1]]; // 中线
            case 2: return [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0]]; // 上横
            case 3: return [[0, 2], [1, 2], [2, 2], [3, 2], [4, 2]]; // 下横
            case 4: return [[0, 0], [1, 1], [2, 2], [3, 1], [4, 0]];
            case 5: return [[0, 2], [1, 1], [2, 0], [3, 1], [4, 2]];
            case 6: return [[0, 0], [1, 0], [2, 1], [3, 2], [4, 2]];
            case 7: return [[0, 2], [1, 2], [2, 1], [3, 0], [4, 0]];
            case 8: return [[0, 1], [1, 2], [2, 1], [3, 0], [4, 1]];
            case 9: return [[0, 1], [1, 0], [2, 1], [3, 2], [4, 1]];
            default: return [];
        }
    },

    hideLine: function () {
        for (let index = 0; index < this.lineArr.length; index++) {
            this.lineArr[index].active = false;
        }
    },

    setLine: function () {
        if (!this.gameResult || !Array.isArray(this.gameResult.xiannum)) return;
        for (const x of this.gameResult.xiannum) {
            const ref = x && x.ref;
            if (typeof ref === 'number' && ref >= 1 && ref <= this.lineArr.length) {
                this.lineArr[ref - 1].active = true;
            }
        }
    },

    isWild: function (id) {
        return id === this.wildId || id > 100;
    },

    buildLineArrayByRules: function (type) {
        const lines = [];
        const { xiannum } = this.gameResult || {};
        if (!xiannum) return lines;

        for (let i = 0; i < xiannum.length; i++) {
            const it = xiannum[i];
            const needLen = Math.min(it.len || 0, 5);
            if (!it.multiple || it.multiple <= 0 || needLen < 3) continue;

            const card = it.card;

            // 每一条线路（ref 从 1 开始）
            for (let ref = 1; ref <= 9; ref++) {
                const path = this.getXianRule(ref);
                if (path.length < needLen) continue;

                const nodes = [];
                let ok = true;

                for (let c = 0; c < needLen; c++) {
                    const [col, row] = path[c];

                    // ✅ 使用统一入口取节点，确保 icon / skel 对齐
                    const n =
                        type === 2
                            ? this._getSkelByColRow(col, row)
                            : this._getIconByColRow(col, row);

                    if (!n) {
                        ok = false;
                        break;
                    }

                    const id = n.itemID;
                    if (!(id === card || id === this.wildId || id > 100)) {
                        ok = false;
                        break;
                    }

                    nodes.push(n);
                }

                if (ok) {
                    lines.push(nodes);
                }
            }
        }
        if (type === 1 && lines.length > 0) {
            LoggerUtil.getInstance().log("line1 sample", lines[0].map(n => n.y));
        }
        if (type === 2 && lines.length > 0) {
            LoggerUtil.getInstance().log("line2 sample", lines[0].map(n => n.y));
        }
        return lines;
    },


    /**
     * 收集匹配的节点（卡牌相同或是万能牌10）
     * @param {number} card - 目标卡牌ID
     * @param {number} xiannumLen - 中奖线长度
     * @param {number} type - 1:icon节点 2:skel节点
     * @returns {Array} 每列匹配的节点数组
     */
    collectMatchingNodes: function (card, xiannumLen, type) {
        const matchingNodes = [];
        for (let col = 1; col < Math.min(xiannumLen, this.node_catContentArr.length); col++) {
            const rows = this._getVisibleRowNodes(col, type);
            const columnNodes = [];
            for (let r = 0; r < 3; r++) {
                const itemNode = rows[r];
                if (!itemNode) continue;
                itemNode.pos = [col, r];
                if (itemNode.itemID == card || itemNode.itemID == this.wildId || itemNode.itemID > 100) {
                    columnNodes.push(itemNode);
                }
            }
            matchingNodes.push(columnNodes);
        }
        return matchingNodes;
    },

    /**
     * 递归生成所有可能的线路组合
     * @param {cc.Node} shu0Node - 第一列的固定节点
     * @param {Array} matchingNodes - 每列的匹配节点数组
     * @param {Array} lineArr - 存储结果的数组
     */
    generateLineCombinations: function (shu0Node, matchingNodes, lineArr) {
        /**
         * 递归构建组合路径
         * @param {Array} currentPath - 当前已构建的路径
         * @param {number} depth - 当前递归深度（对应列索引）
         */
        const buildCombination = (currentPath, depth) => {
            // 如果已经处理完所有列，则将完整路径加入结果
            if (depth >= matchingNodes.length) {
                lineArr.push([shu0Node, ...currentPath]);
                return;
            }

            // 遍历当前列的所有匹配节点，继续递归构建
            for (const node of matchingNodes[depth]) {
                buildCombination([...currentPath, node], depth + 1);
            }
        };

        // 从第0层开始递归
        buildCombination([], 0);
    },

    /**
     * 立即播放所有动画
     * @param {Array} lineArr - 所有中奖线节点数组
     */
    playInstantAnimation: function (lineArr, type) {
        for (const typeArr of lineArr) {
            for (let k = 0; k < typeArr.length - 1; k++) {
                const n1 = typeArr[k], n2 = typeArr[k + 1];
                if (type == 1) {
                    n1.getComponent('catItemCtrl').playAnimation();
                    n2.getComponent('catItemCtrl').playAnimation();
                }
                if (type == 2) {
                    n1.getComponent('catSkelItemCtrl').playAnimation();
                    n2.getComponent('catSkelItemCtrl').playAnimation();
                }
            }
        }
        // ✅ 纵向“龙”检测改为按可见三行
        for (let col = 0; col < this.node_catSkelContentArr.length; col++) {
            const rows = this._getVisibleRowNodes(col, 2); // [top, mid, bot]
            const row0 = rows[0], row1 = rows[1], row2 = rows[2];
            if (!row0 || !row1 || !row2) continue;

            const id0 = row0.itemID, id1 = row1.itemID, id2 = row2.itemID;
            const topTwo = (id0 == 8 && id1 == 8);
            const bottomTwo = (id1 == 8 && id2 == 8);
            const allThree = (id0 == 8 && id1 == 8 && id2 == 8);

            const midCtrl = row2.getComponent('catSkelItemCtrl'); // 以最下行为触发点
            if (allThree) {
                midCtrl.showDragon(3);
            } else {
                if (topTwo) midCtrl.showDragon(1);
                if (bottomTwo) midCtrl.showDragon(2);
            }
        }

        this.scheduleOnce(() => { this.isRunningCatAnim = false; }, 1);
    },

    sendLoginReq: function () {
        let proroID = 'gameservice.login';
        let message = 'LoginReq';
        GameServerManager.send(proroID, message, {
            userid: GlobalCfg.USER_DATAS.userId,
            token: GlobalCfg.USER_DATAS.token,
            fromid: 2001
        });
    },

    sendCallReq: function () {
        if (this.curSendSpin == true) { //避免重复发送请求
            return;
        }
        if (GlobalCfg.USER_DATAS.isNotCharge == true && GlobalCfg.USER_DATAS.gamePattern == 0 && GlobalCfg.USER_DATAS.refuseUnpayHundred["minicat"] == true) {   //未曾充值
            CommonFun.getInstance().showMsgBox("This feature is available only for premium players . Add cash now to become a premium player .", "SHOP", () => {
                if (this.paymentSwitch) {
                    CommonFun.getInstance().showSmallAddCash()
                }
            }, false);
            return;
        };

        let betAmount = parseFloat(this.lab_betAmount.string) * 100;

        let freesItem = this.getFreesItem(betAmount);
        let freeCount = freesItem.freeCount || 0;

        if (betAmount > GlobalCfg.USER_DATAS.userDiamond && freeCount <= 0) {
            this.recoverySpinBtnEvent();
            if (GlobalCfg.IS_CLUB_MODE == 1) { //代理模式不跳转商城
                CommonFun.getInstance().showMsgBox('Insufficient cash', "YES", () => { }, false);
            }
            else {
                CommonFun.getInstance().showMsgBox(this.tipsLabel[5], "SHOP", () => {
                    if (this.paymentSwitch) {
                        CommonFun.getInstance().showSmallAddCash()
                    }
                }, false);
            }
            return;
        };

        this.lab_totalWin.string = 0;
        this.freeTotalWinNum = 0;
        this.lab_totalWin.node.active = false;
        this.node_goodluck.active = true;

        this.curSendSpin = true;
        let proroID = 'gameservice.call';
        let message = 'CallReq';
        GameServerManager.send(proroID, message, {
            amount: betAmount
        });
    },

    getCoinFormatStr: function (coin) {
        let decimalPlaces = this.getCoinDecimalPlaces(coin);
        return coin.toFixed(decimalPlaces);
    },


    startFreeGame: function (num) {
        let self = this;
        this.node_fg.scale = 1;
        this.lab_fg_num.string = num;
        // this.node_windb.active = true;
        this.playGameSound('freetimes')
        this.showFGSymbol(2)
        this.scheduleOnce(() => {
            self.playGameMusic('freeBg');
            this.background.spriteFrame = this.fg_bg;
            self.node_fg_pop.active = true;
            self.btn_fg_end.interactable = false;
            self.playFreeGameAnim("1")
        }, 4);
    },

    //fg过程中又中fg
    addFreeGame: function (num) {
        this.node_addFG_pop.active = true;
        let self = this;
        let anim = this.node_addFG.getComponent(cc.Animation);
        anim.play("bigwinStart");
        this.lab_addfg_num.string = num;
        let curFreeGameNum = parseInt(this.lab_freenum.string);
        let curFreeGameFinalNum = curFreeGameNum + num - 1;
        this.scheduleOnce(() => {
            self.runChangeTotalWinScore(self.lab_addfg_num, num, 0, 1, null, true)
            self.runChangeTotalWinScore(self.lab_freenum, curFreeGameNum, curFreeGameFinalNum, 1, () => {
                self.scheduleOnce(() => {
                    anim.play("bigwinEnd");
                    self.scheduleOnce(() => {
                        self.node_addFG_pop.active = false;
                        self.dealFreeGame(self.lab_betAmount.string, curFreeGameFinalNum);
                    }, 0.5);
                }, 0.5);
            }, true)
        }, 1);
    },

    playFreeGameAnim: function (skelName) {
        const pop = this.node_fg_pop;
        const skelN = this.node_fg;

        // “关闭态”(skelName=="3") 走收尾动画通道，不必重新 setAnimation
        if (skelName === "3") {
            this._closePopupTween(pop, {
                dur: 0.18,
                ease: 'backIn',
                onAfter: () => {
                    this.dealFreeGame(this.lab_betAmount.string, this.gameResult.mianfeinum);
                }
            });
            return;
        }
        const token = this._preparePopup(pop, skelN);
        if (!token) { return; }
        const skel = skelN.getComponent(sp.Skeleton);

        if (skelName === "1") {
            // 第一段：出现
            this.playGameSound('freetimes');
            this.background && (this.background.spriteFrame = this.fg_bg);

            skel.setAnimation(0, "animation_youwin", false);
            skel.setCompleteListener(() => {
                if (!this._isPopupTokenAlive(pop, token)) return;
                this.btn_fg_end && (this.btn_fg_end.interactable = true);

                // 进入等待态
                skel.setAnimation(0, "animation_loop", true);
                // 2秒后进入 auto close（或玩家点“OK”也会走 close）
                this.scheduleOnce(() => {
                    if (!this._isPopupTokenAlive(pop, token)) return;
                    this.playFreeGameAnim("3");
                }, 2);
            });
            return;
        }

        // 其它标记统一 2 秒后自动 close
        this.scheduleOnce(() => {
            this.playFreeGameAnim("3");
        }, 2);
    },

    dealFreeGameEndEvent: function () {
        // 玩家手动关闭 FG 过场
        this.btn_fg_end && (this.btn_fg_end.interactable = false);
        this.playFreeGameAnim("3");
    },

    dealFreeGame: function (amount, freeCount) {
        this.node_free.active = true;
        this.lab_freenum.string = freeCount
        let proroID = 'gameservice.call';
        let message = 'CallReq';
        GameServerManager.send(proroID, message, {
            amount: amount * 100
        });
    },



    //播放FG结算动画
    PlayFGEndAnim: function (finalScore, callback) {
        const pop = this.node_totalwin_pop;
        const skelN = this.node_totalwin;

        const token = this._preparePopup(pop, skelN);
        if (!token) { callback && callback(); return; }

        const skel = skelN.getComponent(sp.Skeleton);
        this.playGameMusic("freeTotalWin");

        // 用纯数字做动画
        this.lab_totalwinpop_num.string = "";
        this.btn_totalwin_end.interactable = false;
        const endNum = Number(finalScore); // finalScore 直接传“数字”，不要先 numberToShow
        this.runChangeTotalWinScore(this.lab_totalwinpop_num, 0, endNum, 4, null, false);

        // 主动画一次
        skel.setAnimation(0, "animation_totalwin", false);
        skel.setCompleteListener(() => {
            if (!this._isPopupTokenAlive(pop, token)) return;
            this.btn_totalwin_end.interactable = true;

            this.scheduleOnce(() => {
                if (!this._isPopupTokenAlive(pop, token)) return;
                this._closePopupTween(pop, {
                    dur: 0.20,
                    ease: 'backIn',
                    onAfter: () => { callback && callback(); }
                });
            }, 5);
        });
    },

    checkWinJp: function (callback) {
        if (this.gameResult.jpWin && this.gameResult.jpWin > 0) {
            this.showJPpop(callback)
        }
        else {
            callback && callback();
        }
    },

    //进入JP模式
    showJPpop: function (callback) {
        const pop = this.node_jp_pop;
        const skelN = this.node_jp;

        const token = this._preparePopup(pop, skelN);
        if (!token) { callback && callback(); return; }

        const skel = skelN.getComponent(sp.Skeleton);
        const finalScore = CommonFun.getInstance().numberToShow(this.gameResult.jpWin / 100);

        this.playGameMusic("jackpot");
        this.lab_jp_num.string = "";
        this.btn_jp_end && (this.btn_jp_end.interactable = false);
        this.runChangeTotalWinScore(this.lab_jp_num, 0, finalScore, 4, null);

        skel.setAnimation(0, "animation_jackpot", false);
        skel.setCompleteListener(() => {
            if (!this._isPopupTokenAlive(pop, token)) return;
            this.btn_jp_end && (this.btn_jp_end.interactable = true);

            this.scheduleOnce(() => {
                if (!this._isPopupTokenAlive(pop, token)) return;
                this._closePopupTween(pop, {
                    dur: 0.20,
                    ease: 'backIn',
                    onAfter: () => {
                        this.playGameMusic("bgm");
                        callback && callback();
                    }
                });
            }, 5);
        });
    },

    onClickJpEnd: function () {
        this._closePopupTween(this.node_jp_pop, { dur: 0.15, ease: 'backIn' });
    },

    // 清理 Spine
    _resetSpine(node) {
        if (!node) return;
        const skel = node.getComponent(sp.Skeleton);
        if (!skel) return;
        skel.setCompleteListener(null);
        skel.clearTracks();
        skel.setToSetupPose();
        skel.timeScale = 1;
    },

    // 清理 cc.Animation
    _resetCCAnim(node) {
        if (!node) return;
        const anim = node.getComponent(cc.Animation);
        if (!anim) return;
        anim.stop();  // 停止所有状态
        // 如果需要，重置到初始帧：取第一个默认 clip
        const clips = anim.getClips();
        if (clips && clips[0]) {
            anim.play(clips[0].name);
            anim.setCurrentTime(0, clips[0].name);
            anim.sample(clips[0].name);
            anim.stop(clips[0].name);
        }
    },

    // 为节点生成/更新一个播放 token，用于“迟到回调”失效
    _newPlayToken(node) {
        const t = Symbol('pop-token');
        node.__playToken = t;
        return t;
    },
    _isTokenAlive(node, t) {
        return node && node.__playToken === t;
    },
    _preparePopup(popNode, skelNode) {
        if (!cc.isValid(popNode) || !cc.isValid(skelNode)) return null;

        // 复位 transform，保证再次打开可见
        try {
            popNode.scaleX = popNode.scaleY = 1;
            popNode.opacity = 255;
            popNode.angle = 0;
        } catch (e) { }

        // Spine 归零
        const skel = skelNode.getComponent(sp.Skeleton);
        if (!skel) return null;
        skel.setCompleteListener(null);
        skel.clearTracks();
        skel.setToSetupPose();
        skel.timeScale = 1;

        popNode.active = true;
        skelNode.active = true;

        const token = Symbol('popup');
        this._popupStates.set(popNode.uuid, { token, skel });
        return token;
    },

    _forceClosePopup(popNode) {
        const st = this._popupStates.get(popNode && popNode.uuid);

        if (st && st.skel) {
            try {
                st.skel.setCompleteListener(null);
                st.skel.clearTracks();
                st.skel.setToSetupPose();
                st.skel.timeScale = 1;
            } catch (e) { }
        }

        if (cc.isValid(popNode)) {
            this._killPopupTweens(popNode);           // 停掉残留 tween
            try {
                popNode.scaleX = popNode.scaleY = 1;  // 复位到下次可直接显示
                popNode.opacity = 255;
                popNode.angle = 0;
            } catch (e) { }
            popNode.active = false;
        }
        this._popupStates.delete(popNode && popNode.uuid);
    },
    // 停止某弹窗上还在跑的补间
    _killPopupTweens(popNode) {
        if (!cc.isValid(popNode)) return;
        try { cc.Tween.stopAllByTarget(popNode); } catch (e) { }
    },

    // 仅用于“关闭”的缩小+淡出；结束后走 _forceClosePopup 复位并 inactive
    _closePopupTween(popNode, opts = {}) {
        if (!cc.isValid(popNode)) return;
        const {
            toScale = 0.75,   // 关时缩至 75%
            toAlpha = 0,      // 淡出
            dur = 0.18,   // 关闭时长
            ease = 'backIn',
            onAfter = null,   // 关闭完后的回调（可选）
        } = opts;

        this._killPopupTweens(popNode);

        cc.tween(popNode)
            .parallel(
                cc.tween().to(dur, { opacity: toAlpha }),
                cc.tween().to(dur, { scaleX: toScale, scaleY: toScale }, { easing: ease })
            )
            .call(() => {
                this._forceClosePopup(popNode);   // 统一清理 Spine & 复位 transform & active=false
                if (typeof onAfter === 'function') onAfter();
            })
            .start();
    },
    _isPopupTokenAlive(popNode, token) {
        if (!cc.isValid(popNode)) return false;
        const st = this._popupStates.get(popNode.uuid);
        return !!(st && st.token === token && popNode.activeInHierarchy);
    },

    getCoinDecimalPlaces: function (coin) {
        let decimalPlaces = 0;
        if (coin < 100000) {
            decimalPlaces = 2;
        }
        else if (100000 <= coin && coin < 1000000) {
            decimalPlaces = 1;
        }
        else if (1000000 <= coin) {
            decimalPlaces = 0;
        };
        return decimalPlaces;
    },
});