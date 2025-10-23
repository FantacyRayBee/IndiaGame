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

        toggle_fast: cc.Toggle,
        toggle_auto: cc.Toggle,

        node_tcBg: cc.Node,
        node_lines: cc.Node,
        node_goodluck: cc.Node,
        lab_autoBetCiShu: cc.Label,
        node_catContent: cc.Node,
        node_catSkelContent: cc.Node,

        lab_betAmount: cc.Label,
        lab_betAmount2: cc.Label,

        lab_totalWin: cc.Label,

        lab_jb: cc.Label,

        pab_setting: cc.Prefab, 
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
        this.betAmountArr = ['1.8', '4.5', '9', '18', '90', '180', '900', '1800'];
        if(GlobalCfg.USER_DATAS.gamePattern == 1){
            this.betAmountArr = ['1.8', '4.5', '9', '18', '90', '180', '900', '1800'];
        }
        this.betAmountArrIndex = 0;

        this.finishedCatItemNum = 0;
        this.isRunningcatAnim = false; 

        this.height = 150; // 每个水果图片的高度

        this.paymentSwitch = false;

        this.frees = [];
        this.isAuto = false;

        this.isHaveMianFeiRecord = false;
        this.selectAutoBetStr = 'AUTO';
        this.selectAutoStatus = false;
        this.freeTotalWinNum = 0;           // 三叶草免费时，总获取金额

        this.node_catContentArr = []; // 每个水果图片的节点
        this.node_catSkelContentArr = []; // 每个水果图片的节点
    },

    loadAudioClip: function(audioClipUrl = "", func = null, target = null) {
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

    playGameSound: function(name) {
        let audioClipUrl = "audios/" + name;
        this.loadAudioClip(audioClipUrl, (audioClip, target)=>{
            GlobalCfg.G_COMPONENTS.Audio.playSound(audioClip, false);
        }, this);
    },

    playGameMusic: function(name) {
        let audioClipUrl = "audios/" + name;
        this.loadAudioClip(audioClipUrl, (audioClip, target)=>{
            GlobalCfg.G_COMPONENTS.Audio.playMusic(audioClip, true)
        }, this);
    },

    onLoad: function() {
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
        //自动下注次数选择的展示
        this.node_tcBg.active = false;

        //总共赢的金额
        this.lab_totalWin.string = 0;

        this.setBetCiShuAutoTips();

        this.cashSwitch();

        if(GlobalCfg.PAYMENT_SWITCH == 2 && GlobalCfg.CHANNEL == "ios") {
            let btn_add = this.btn_add.node.getChildByName('Background').getChildByName('btn_shop');
            let btn_addcash = this.btn_addcash.node.getChildByName('Background').getChildByName('btn_addcash_SHOP');
            btn_add.active = GlobalCfg.USER_DATAS.isNotCharge;
            btn_addcash.active = GlobalCfg.USER_DATAS.isNotCharge;
        }
        // ...你的原有代码...
        this._initSpinHoldonToggle();
        this.startSpinHoldonToggle(5); // 5 秒
        this._initSpinLongPress();
    },

    cashSwitch:function(){
        this.btn_add.node.active = GlobalCfg.USER_DATAS.openModules.includes(4);
        this.btn_addcash.node.active = GlobalCfg.USER_DATAS.openModules.includes(4);
        this.paymentSwitch = GlobalCfg.USER_DATAS.openModules.includes(4);
    },

    setBetCiShuAutoTips: function() {
        this.toggle_auto.isChecked = false;
        this.toggle_auto.interactable = false;
        this.lab_autoBetCiShu.string = 'AUTO'; 
    },

    debounce: function(action, delayTime) {  
        if (!delayTime) {
            return action;
        }
        let fn = function() { 
            let btnNode = arguments[0].node;
            if (!btnNode.timeOut) {
                action.apply(this, arguments);
                btnNode.timeOut = setTimeout(function() { 
                    if (btnNode) {
                        clearTimeout(btnNode.timeOut);
                        btnNode.timeOut = null;
                    }; 
                }, delayTime * 1000);  
            }
        };
        return fn;
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
        this._spinIsLongPress = false;
        this._spinHoldTime = 0;

        // 开始计时长按
        this.schedule(this._checkSpinHoldTime, 0.1);
    },

    _onSpinTouchEnd: function (event) {
        this.unschedule(this._checkSpinHoldTime);

        // 如果没触发长按 → 当成普通点击
        if (!this._spinIsLongPress) {
            this._onSpinShortClick();
        } else {
            this._onSpinLongPressRelease();
        }
    },

    _onSpinTouchCancel: function (event) {
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
    
    stopAuto: function() {
        this.isAuto = false;
        this.btn_spin.node.active = true;
        this.btn_stop.node.active = false;
    },

    start: function() {
        this.sendLoginReq();
        this.initSlotData();
    },

    
    onDestroy: function() {
        GlobalCfg.ACT_SCENE_CTRL = null;
        ClientNotify.removeByHandle(GlobalCfg.MSG_TYPE.serverMsg, this.msgHandle);
        ClientNotify.removeByHandle(GlobalCfg.MSG_TYPE.clientMsg, this.customMsgHandle);
        CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.EXIT_MAYA_GAME);
        this.stopSpinHoldonToggle();
    },


    onEventMsg: function(webData, target){
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
            let coin = notify.deposit + notify.winnings;
            self.setUserDiamond(coin);
        }
        // else if(msgId == GlobalCfg.CLIENT_MSG_ID.FIRST_RECHARGE_TIPS) {
        //     SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.MAYA, SceneManager.getInstance().sceneType.LOBBY);
        // }
        else if (msgId == GlobalCfg.CLIENT_MSG_ID.GAME_MENU_CLICK_OUT_TO_LOBBY) {
            if (self.isRunningCatAnim) {
                CommonFun.getInstance().showMsgBox(self.tipsLabel[0], "YES_NO", ()=>{
                    SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.CAT, SceneManager.getInstance().sceneType.LOBBY);
                },  false);
            }
            else {
                SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.CAT, SceneManager.getInstance().sceneType.LOBBY);
            };
        }
        else if (msgId == GlobalCfg.CLIENT_MSG_ID.GAME_MENU_CLICK_HOW_TO_PLAY) {
            CommonFun.getInstance().showRule("fruitMachine");
        }
        else if (msgId == "lobbyservice.kicktolobby") {
            SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.CAT, SceneManager.getInstance().sceneType.LOBBY);
        }
        else if (msgId == "STOP_GAME") {
            self.setBetCiShuAutoTips();
        }
    },

    checkWebMsgError: function (webData, target) {
        let self = target;
        let msgId = webData.msgCode;
        let notify = webData.msgData;
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

    setLoginNotify: function(notify) {
        if (!notify) {
            return;
        }

        this.setFreesList(notify.frees);
        this.setUserDiamond(notify.userinfo.diamond);

        let freeCountItem = this.getFreesItemOfFreeCount();
        if (freeCountItem) {
            let amount = freeCountItem.amount/100;
            let freeCount = freeCountItem.freeCount;
            let freePool = freeCountItem.freePool/100;

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

    initSlotData: function() {
        for (let j = 0, len1 = this.node_catContentArr.length; j < len1; j++) {
            let children = this.node_catContentArr[j].children;
            for (let k = 0, len2 = children.length; k < len2; k++) {
                let src = children[k].getComponent('catItemCtrl');
                src.initIcon();
            };
        };
        
    },

    setUserDiamond: function(diamond) {
        GlobalCfg.USER_DATAS.userDiamond = diamond;
        let num = FloatCalculation.accDiv(GlobalCfg.USER_DATAS.userDiamond, 100);
        this.lab_jb.string = CommonFun.getInstance().numberToShow(num);
    },

    setLabAmount: function(amount) {
        this.lab_betAmount.string = amount;
        let multiple = parseFloat(amount) / 9;
        this.lab_betAmount2.string = multiple + "x9";
    },

    setFreesList: function(frees) {
        if (!frees) {
            return;
        };
        this.frees = frees;
    },

    // 通过下注倍数，获取对应的免费情况
    getFreesItem: function(amount) {
        for (let i = 0, len = this.frees.length; i < len; i++) {
            const element = this.frees[i];
            if (element.amount == amount) {
                return element;
            }
        }
        return {};
    },

    getFreesItemOfFreeCount: function() {
        for (let i = 0, len = this.frees.length; i < len; i++) {
            const element = this.frees[i];
            if (element.freeCount > 0) {
                return element;
            }
        }
    },

    setCallNotify: function(notify) {
        this.gameResult = {};
        this.gameResult.mianfeinum = notify.mianfeinum;
        this.gameResult.rewardtype = notify.rewardtype;
        this.gameResult.userinfo = notify.userinfo;
        this.gameResult.xiannum = notify.xiannum;
        this.gameResult.cards = notify.cards;
        this.gameResult.freePool = notify.freePool;

        this.unscheduleAllCallbacks();
        this.node_lines.destroyAllChildren();
        this.node_lines.removeAllChildren();
     

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
        
        //设置转动的音效
        let isFast = this.toggle_fast.isChecked;
        this.playGameSound('scrollStart');

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

        this._spinNode   = root.getChildByName('Background').getChildByName('spin');
        this._holdonNode = root.getChildByName('Background').getChildByName('holdon');
        this._holdonSkel = this._holdonNode ? this._holdonNode.getComponent(sp.Skeleton) : null;

        // ✅ 让两个节点都保持 active=true，避免 onEnable/OnDisable 反复
        if (this._spinNode)   this._spinNode.active   = true;
        if (this._holdonNode) this._holdonNode.active = true;

        // ✅ 用透明度控制显隐（初始显示 spin，隐藏 holdon）
        if (this._spinNode)   this._spinNode.opacity   = 255;
        if (this._holdonNode) this._holdonNode.opacity = 0;

        // ✅ 关闭 Skeleton 的自动播放：清掉组件默认动画，并关掉 loop
        if (this._holdonSkel) {
            // 有的项目导出里 sd.animation 是“默认动画名”，清成空串即可阻止自动播
            this._holdonSkel.animation = '';   // 关键：阻止 onEnable 自动播放
            this._holdonSkel.loop = false;     // 组件层面的 loop 也关掉
            this._holdonSkel.clearTracks();
            this._holdonSkel.setToSetupPose();

            // 保险：如果有人在别处给它绑了 complete 里“再播一次”，这里重置一次监听
            this._holdonSkel.setCompleteListener(null);
        }

        this._showingHoldon = false;

        // 全局调度器
        this._spinToggleScheduler = cc.director.getScheduler();
        this._spinToggleTarget = this._spinToggleTarget || {};
        this._spinToggleFn = this._spinToggleFn || this._toggleSpinHoldon.bind(this);
    },
    
    startSpinHoldonToggle: function (intervalSec = 5) {
        if (!this._spinToggleScheduler) this._initSpinHoldonToggle();
        this.stopSpinHoldonToggle();
        this._spinToggleFn(); // 立即切一次（可去掉）
        this._spinToggleScheduler.schedule(
            this._spinToggleFn,
            this._spinToggleTarget,
            intervalSec,
            cc.macro.REPEAT_FOREVER,
            0,
            false
        );
    },
    stopSpinHoldonToggle: function () {
        if (this._spinToggleScheduler && this._spinToggleFn && this._spinToggleTarget) {
            this._spinToggleScheduler.unschedule(this._spinToggleFn, this._spinToggleTarget);
        }
    },

    _toggleSpinHoldon: function () {
        if (!cc.isValid(this)) return;
        const spin = this._spinNode, holdon = this._holdonNode, skel = this._holdonSkel;
        if (!spin || !holdon) return;

        this._showingHoldon = !this._showingHoldon;

        if (this._showingHoldon) {
            // 显示 holdon（不改 active），仅用透明度
            spin.opacity   = 0;
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
            spin.opacity   = 255;

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
     * 
     * @param {Number} startScore 开始分数
     * @param {Number} endedScore 结束分数
     * @param {Number} freeCount 免费次数
     * @param {*} time 
     */
    runChangeTotalWinScore: function (startScore, endedScore, freeCount, time = 0.5) {
        let obj = {};
        obj.num = startScore;
        this.lab_totalWin.node.active = true;
        this.node_goodluck.active = false;
        this.lab_totalWin.string = obj.num == 0 ? obj.num : obj.num.toFixed(2);
        cc.tween(obj)
        .to(
            time,
            {num: endedScore},
            {
                progress: (start, end, current, t) => {
                    if (this && this.lab_totalWin) {
                        if(freeCount > 0){
                            this.lab_totalWin.string = (end - start == 0) ? (endedScore == 0 ? endedScore : endedScore.toFixed(2)) : Number(start + (end - start) * t).toFixed(2); 
                        }
                        else{
                            this.lab_totalWin.string = (end - start == 0) ? 0 : Number(start + (end - start) * t).toFixed(2); 
                        }
                    };
                    return start + (end - start) * t;
                }
            }
        )
        .start();
    },

    startSlotsAnim: function() {
        if (this.isRunningCatAnim) {
            return;
        };
        this.isRunningCatAnim = true;
        let isFast = this.toggle_fast.isChecked;
        this.kRate = isFast ? 0.45 : 1.1;
        let catContentTime = 0.1 * this.kRate;
        for (let i = 0, len = this.node_catContentArr.length; i < len; i++) {
            let children = this.node_catContentArr[i].children;
            let children2 = this.node_catSkelContentArr[i].children;
            for (let k = 0, lenk = children.length; k < lenk; k++) {
                let item = children[k];
                let item2 = children2[k];
                item.repeat = 0;
                item.index = k;
                item.shu = i;
                this.scheduleOnce(() => {
                    this.runSlotsItemAnim(item, item2, item.y, item.y + this.height);
                }, catContentTime * i);
            };
        };
    },
    
    runSlotsItemAnim: function(node, skelNode, statrPositionY, endedPositionY) {
        let self = this;
        node.repeat += 1;
        node.setPosition(cc.v2(0, statrPositionY));
        let repeat = node.repeat;
        let index = node.index;
        let shu = node.shu;
        let easeType = '';
        let runTime = 0.08 * self.kRate;
        if (repeat == 20) {
            easeType = 'backOut';
            runTime = 0.5 * self.kRate;
        };
        cc.tween(node)
        .to(
            runTime, 
            {position: cc.v2(0, endedPositionY)}, 
            {easing: easeType}
        )
        .call(() => {
            if (repeat == 20) {
                if (endedPositionY >= this.height * 2) {
                    node.setPosition(cc.v2(0, -(this.height * 2)));
                };
                self.checkAnimFinish();
                return;
            };
            if (endedPositionY >= this.height * 2) {
                let src = node.getComponent('catItemCtrl');
                let src2 = skelNode.getComponent('catSkelItemCtrl');
                if (repeat == 17 && index == 0) {
                    let fruitType = self.gameResult.cards[shu].cards[0];
                    src.setItemData(fruitType);
                    src2.setItemData(fruitType);
                    node.fruitType = fruitType;
                }
                else if (repeat == 18 && index == 1) {
                    let fruitType = self.gameResult.cards[shu].cards[1];
                    src.setItemData(fruitType);
                    src2.setItemData(fruitType);
                    node.fruitType = fruitType;
                }
                else if (repeat == 19 && index == 2) {
                    let fruitType = self.gameResult.cards[shu].cards[2];
                    src.setItemData(fruitType);
                    src2.setItemData(fruitType);
                    node.fruitType = fruitType;
                }
                else {
                    let num = Math.floor(Math.random() * 10 + 1);
                    if (shu == 0 && num == 10) {
                        num = 9;
                    }
                    else if (shu >= 3 && num == 11) {
                        num = 10;
                    }
                    src.setItemData(num);
                    src2.setItemData(num);
                    node.fruitType = num;
                };
                self.runSlotsItemAnim(node, skelNode, -(this.height * 2), -this.height);
            }
            else {
                self.runSlotsItemAnim(node, skelNode, endedPositionY, endedPositionY + this.height);
            };
        })
        .start();
    },

    checkAnimFinish: function() {
        this.finishedCatItemNum += 1;
        LoggerUtil.getInstance().log("checkAnimFinish", this.finishedCatItemNum);
        if (this.finishedCatItemNum == 20) {
            this.finishedCatItemNum = 0;
            this.showResultAnima();
        };
    },

    recoverySpinBtnEvent: function() {
        this.btn_spin.interactable = true;
        this.btn_spin.enableAutoGrayEffect = false;

        this.btn_auto.interactable = true;
        this.btn_auto.enableAutoGrayEffect = false;

        let betAmount = parseFloat(this.lab_betAmount.string);
        if (betAmount != 10) {
            this.btn_betJian.interactable = true;
            this.btn_betJian.enableAutoGrayEffect = false;
        };

        if (betAmount != 2000) {
            this.btn_betJia.interactable = true;
            this.btn_betJia.enableAutoGrayEffect = false;
        };
    },

    showResultAnima: function() {
        if (this.gameResult) {
            this.setUserDiamond(this.gameResult.userinfo.diamond);

            let totalMultiple = 0;
            for (let i = 0, len = this.gameResult.xiannum.length; i < len; i++) {
                let multiple = this.gameResult.xiannum[i].multiple;
                let num = this.gameResult.xiannum[i].num;
                totalMultiple += (multiple * num);
            };
        
            //奖励类型 (1:正常金币奖励, 2:免费次数奖励)
            let startScore = Number(this.freeTotalWinNum);
            //奖励类型 (1:正常金币奖励, 2:免费次数奖励)
            let bet = parseFloat(this.lab_betAmount.string)
            let endedScore = this.gameResult.rewardtype == 2 ? this.gameResult.freePool/100 : totalMultiple *  bet / 10 + startScore;
            this.freeTotalWinNum = endedScore;
            let freeCount = this.gameResult.mianfeinum;
            let isNormal = this.gameResult.rewardtype == 1;
            let bigWinLevel = this.getBigWinLevel(isNormal, bet, endedScore / bet);
            // bigWinLevel = 2
            if (bigWinLevel > 0) {
            // if (endedScore > 0) {
                CommonFun.getInstance().loadBundle('catMachine', (bundle) => {
                    bundle.load("prefab/catRewardTips", cc.Prefab, (err, prefab) => {
                        if (!err) {
                            let scene = cc.director.getScene();
                            let catRewardTipsNode = cc.instantiate(prefab);
                            let catRewardTipsCtrl = catRewardTipsNode.getComponent("catRewardTipsCtrl");
                            scene.addChild(catRewardTipsNode);
                            catRewardTipsCtrl.showRewardTips(endedScore, bigWinLevel, isNormal)
                            .then(() => {
                                this.showSpinResult(totalMultiple);
                                this.runChangeTotalWinScore(startScore, endedScore, freeCount);
                            });
                        };
                    });
                }, (err) => {
                    LoggerUtil.getInstance().error(`加载catMachine-Bundle异常: ${JSON.stringify(err)}`);
                });
            }
            else {
                this.showSpinResult(totalMultiple);
                this.runChangeTotalWinScore(startScore, endedScore, freeCount);
            };

        };
    },

    getBigWinLevel: function(isNormal, bet, betMul) {
        let level = 0;
        if (isNormal == true) {
            if (bet <= 10) {
                if (5 <= betMul && betMul < 10) {
                    level = 1;
                }
                else if (10 <= betMul && betMul < 50) {
                    level = 2;
                }
                else if (50 <= betMul && betMul < 150) {
                    level = 3;
                }
                else if (150 <= betMul && betMul < 500) {
                    level = 4;
                }
                else if (500 <= betMul) {
                    level = 5;
                }
            }
            else if (10 < bet && bet <= 100) {
                if (4 <= betMul && betMul < 8) {
                    level = 1;
                }
                else if (8 <= betMul && betMul < 40) {
                    level = 2;
                }
                else if (40 <= betMul && betMul < 120) {
                    level = 3;
                }
                else if (120 <= betMul && betMul < 400) {
                    level = 4;
                }
                else if (400 <= betMul) {
                    level = 5;
                }
            }
            else if (100 < bet && bet <= 300) {
                if (3 <= betMul && betMul < 6) {
                    level = 1;
                }
                else if (6 <= betMul && betMul < 30) {
                    level = 2;
                }
                else if (30 <= betMul && betMul < 80) {
                    level = 3;
                }
                else if (80 <= betMul && betMul < 300) {
                    level = 4;
                }
                else if (300 <= betMul) {
                    level = 5;
                }
            }
            else if (300 < bet) {
                if (3 <= betMul && betMul < 5) {
                    level = 1;
                }
                else if (5 <= betMul && betMul < 20) {
                    level = 2;
                }
                else if (20 <= betMul && betMul < 60) {
                    level = 3;
                }
                else if (60 <= betMul && betMul < 200) {
                    level = 4;
                }
                else if (200 <= betMul) {
                    level = 5;
                }
            }
        }
        else {
            if (10 <= betMul && betMul < 20) {
                level = 1;
            }
            else if (20 <= betMul && betMul < 60) {
                level = 2;
            }
            else if (60 <= betMul && betMul < 200) {
                level = 3;
            }
            else if (200 <= betMul && betMul < 500) {
                level = 4;
            }
            else if (500 <= betMul) {
                level = 5;
            }
        }

        return level;
    },


    showSpinResult: function(totalMultiple) {
        let isNeedShowAnim = false;
        let xiannumArr = this.gameResult.xiannum;
        for (let i = 0, len = xiannumArr.length; i < len; i++) {
            let xiannum = xiannumArr[i];
            let xiannumLen = xiannum.len;   //线的长度
            if (xiannumLen >= 3) {
                isNeedShowAnim = true;
                break;
            };
        };

        let isFast = this.toggle_fast.isChecked;
        if (isNeedShowAnim) {
            this.playGameSound('lianxian');
            this.showXianNum(totalMultiple/10, isFast);
        }
        else {
            this.isRunningCatAnim = false; 
        };

        let startNextSpin = () => {
            // this.isRunningMayaAnim = false;
            if (this.isRunningCatAnim) {
                return;
            };
            this.unschedule(startNextSpin);

            if (this.gameResult.mianfeinum > 0) {
                if (this.gameResult.mianfeinum == 10 && this.isHaveMianFeiRecord == false) {
                    this.isHaveMianFeiRecord = true;
                    this.selectAutoBetStr = this.lab_autoBetCiShu.string;
                    this.selectAutoStatus = this.toggle_auto.isChecked;
                };

                this.lab_autoBetCiShu.string = this.gameResult.mianfeinum;
                this.lab_autoBetCiShu.node.color = new cc.Color(255, 255, 51);

                this.toggle_auto.interactable = false;

                this.autoSpineNode.active = true;

                let amount = parseFloat(this.lab_betAmount.string);
                let proroID = 'gameservice.call';
                let message = 'CallReq';
                GameServerManager.send(proroID, message, {              
                    amount: amount * 100
                });
            }
            else {
                if (this.isHaveMianFeiRecord) {
                    this.isHaveMianFeiRecord = false;
                    this.toggle_auto.isChecked = this.selectAutoStatus;
                    this.lab_autoBetCiShu.string = this.selectAutoBetStr;
                };

                this.lab_autoBetCiShu.node.color = new cc.Color(217, 244, 255);
                
                this.toggle_auto.interactable = true;

                this.autoSpineNode.active = false;

                this.curRoundAddCoinFinish();
                if (this.isAuto) {
                    this.sendCallReq();
                }
                else {
                    this.recoverySpinBtnEvent();
                };
            };
        };
        this.schedule(startNextSpin, 0.01); 
    },

    curRoundAddCoinFinish(){
        if(cc.isValid(this)){
            let minLimit = this.betAmountArr[0] || 0;
            minLimit = parseFloat(minLimit) * 100;
            CommonFun.getInstance().gameShowSecondRecharge(minLimit, Number.MAX_SAFE_INTEGER, ()=>{
                if(cc.isValid(this)){
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


    showXianNum: function(totalMultiple, isFast) {
        if (!this.gameResult) return;

        let lineArr = [];
        for (let i = 0, len = this.gameResult.xiannum.length; i < len; i++) {
            let xiannum = this.gameResult.xiannum[i];
            let card = xiannum.card;        // 中奖的牌
            let xiannumLen = xiannum.len;   // 线的长度
            let xiannumNum = xiannum.num;   // 线的数量
            if (xiannumLen < 3) continue;

            for (let j = 0; j < xiannumNum; j++) {
                // 第0列的起点（保持你原有的“用 i 当作行号”的逻辑）
                let shu0Icon = this.node_catContentArr[0].children[i];
                let startPair = this._makePair(shu0Icon);
                if (!startPair) continue;

                // 收集每列可匹配（card 或 10）的“配对对象”
                const col1Pairs = [];
                const col1 = this.node_catContentArr[1];
                for (let r = 0; r < 3; r++) {
                    let n = col1.children[r];
                    let t = n.fruitType;
                    if (t == card || t == 10) col1Pairs.push(this._makePair(n));
                }

                const col2Pairs = [];
                const col2 = this.node_catContentArr[2];
                for (let r = 0; r < 3; r++) {
                    let n = col2.children[r];
                    let t = n.fruitType;
                    if (t == card || t == 10) col2Pairs.push(this._makePair(n));
                }

                const col3Pairs = [];
                if (xiannumLen >= 4) {
                    const col3 = this.node_catContentArr[3];
                    for (let r = 0; r < 3; r++) {
                        let n = col3.children[r];
                        let t = n.fruitType;
                        if (t == card || t == 10) col3Pairs.push(this._makePair(n));
                    }
                }

                const col4Pairs = [];
                if (xiannumLen >= 5) {
                    const col4 = this.node_catContentArr[4];
                    for (let r = 0; r < 3; r++) {
                        let n = col4.children[r];
                        let t = n.fruitType;
                        if (t == card || t == 10) col4Pairs.push(this._makePair(n));
                    }
                }

                // 组合（保持你原本的“多重循环”结构，只是元素换成 pair）
                for (let a = 0; a < col1Pairs.length; a++) {
                    const arr1 = [startPair, col1Pairs[a]];
                    for (let b = 0; b < col2Pairs.length; b++) {
                        const arr2 = arr1.concat(col2Pairs[b]);
                        if (col3Pairs.length > 0) {
                            for (let c = 0; c < col3Pairs.length; c++) {
                                const arr3 = arr2.concat(col3Pairs[c]);
                                if (col4Pairs.length > 0) {
                                    for (let d = 0; d < col4Pairs.length; d++) {
                                        lineArr.push(arr3.concat(col4Pairs[d]));
                                    }
                                } else {
                                    lineArr.push(arr3);
                                }
                            }
                        } else {
                            lineArr.push(arr2);
                        }
                    }
                }
            }
        }

        // —— 后续逻辑：画线/高亮（改成使用 pair.icon 画线，同时预留 spine 调用）——
        if (totalMultiple >= 5) {
            let pointTime = isFast ? 0.1 : 0.2;
            for (let i = 0; i < lineArr.length; i++) {
                let typeArr = lineArr[i]; // 数组元素为 {icon, iconCtrl, skel, skelCtrl, ...}
                let lineTime = i == 0 ? 0 : (pointTime * 2.5 * (lineArr[i - 1].length - 1));
                this.scheduleOnce(() => {
                    for (let k = 0; k < typeArr.length - 1; k++) {
                        let p1 = typeArr[k];
                        let p2 = typeArr[k + 1];
                        this.scheduleOnce(() => {
                            // 仍用 icon 的位置画线
                            this.drawLine(p1.icon, p2.icon, pointTime);
                        }, pointTime * k);

                        if (k == typeArr.length - 2) {
                            this.scheduleOnce(() => {
                                this.isRunningCatAnim = false;
                            }, pointTime * k + 3);
                        }
                    }
                }, lineTime);
            }
        } else {
            for (let i = 0; i < lineArr.length; i++) {
                let typeArr = lineArr[i];
                for (let k = 0; k < typeArr.length - 1; k++) {
                    let p1 = typeArr[k];
                    let p2 = typeArr[k + 1];

                    if (p1.iconCtrl) { p1.iconCtrl.playAnimation(); p1.iconCtrl.setKuangSkeletonDong(); }
                    if (p2.iconCtrl) { p2.iconCtrl.playAnimation(); p2.iconCtrl.setKuangSkeletonDong(); }
                    if (p1.skelCtrl) { p1.skelCtrl.playAnimation()}
                    if (p2.skelCtrl) { p2.skelCtrl.playAnimation()}
                }
            }
            this.scheduleOnce(() => { this.isRunningCatAnim = false; }, 1);
        }
    },


    drawLine: function(startNode, endNode, time) {
        let worldPos1 = startNode.parent.convertToWorldSpaceAR(new cc.Vec2(startNode.x, startNode.y));
        let worldPos2 = endNode.parent.convertToWorldSpaceAR(new cc.Vec2(endNode.x, endNode.y));

        let localPos1 = this.node_lines.convertToNodeSpaceAR(worldPos1);
        let localPos2 = this.node_lines.convertToNodeSpaceAR(worldPos2);

        let lineNode = new cc.Node();
        this.node_lines.addChild(lineNode);
        let graphics = lineNode.addComponent(cc.Graphics);

        graphics.lineWidth = 10;
        graphics.lineCap = cc.Graphics.LineCap.ROUND;
        graphics.strokeColor = cc.Color.RED;

        graphics.moveTo(localPos1.x, localPos1.y);
        let src1 = startNode.getComponent('catItemCtrl');
        src1.playAnimation();
        src1.setKuangSkeletonDong();

        this.scheduleOnce(() => {
            graphics.lineTo(localPos2.x, localPos2.y);
            graphics.stroke();

            let src2 = endNode.getComponent('catItemCtrl');
            src2.playAnimation();
            src2.setKuangSkeletonDong();
        }, time);
    },

    sendLoginReq: function() {
        let proroID = 'gameservice.login';
        let message = 'LoginReq';
        GameServerManager.send(proroID, message, {
            userid: GlobalCfg.USER_DATAS.userId,
            token: GlobalCfg.USER_DATAS.token,
            fromid: 2001
        });
    },

    sendCallReq: function() {
        if (GlobalCfg.USER_DATAS.isNotCharge == true && GlobalCfg.USER_DATAS.gamePattern == 0 && GlobalCfg.USER_DATAS.refuseUnpayHundred["minicat"] == true){   //未曾充值
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
                CommonFun.getInstance().showMsgBox('Insufficient cash', "YES", () => {}, false);}
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
       
        let proroID = 'gameservice.call';
        let message = 'CallReq';
        GameServerManager.send(proroID, message, {              
            amount: betAmount
        });
    },
    
    getCoinFormatStr: function(coin) {
        let decimalPlaces = this.getCoinDecimalPlaces(coin);
        return coin.toFixed(decimalPlaces);
    },




    getCoinDecimalPlaces: function(coin) {
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