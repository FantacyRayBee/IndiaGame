cc.Class({
    extends: cc.Component,

    properties: {
        btn_back: cc.Button,
        btn_setting: cc.Button,
        btn_sound: cc.Button,
        btn_rule: cc.Button,
        btn_rule_close: cc.Button,
        btn_bet: cc.Button,
        btn_db: cc.Button,
        btn_spin: cc.Button,
        btn_spin2: cc.Button,
        btn_bigwin_end: cc.Button,
        btn_fg_end: cc.Button,
        btn_autoSpinSet: cc.Button,

        btn_auto: cc.Button,
        toggle_fast: cc.Toggle,
        toggle_auto: cc.Toggle,
        node_toggle_auto: cc.Node,
        node_itemContentArr: [cc.Node],
        node_skelContentArr: [cc.Node],
        lab_bigwin: [cc.Label],

        lab_betAmount: cc.Label,
        lab_totalWin: cc.Label,
        lab_jb: cc.Label,
        lab_autoBetCiShu: cc.Label,
        lab_curWin: cc.Label,
        lab_freenum: cc.Label,
        lab_fg_num: cc.Label,
        lab_fgwin_num: cc.Label,
        lab_fgwin_coin: cc.Label,
        lab_addfg_num: cc.Label,

        node_bet: cc.Node,
        node_windb: cc.Node,

        node_bigwin_pop: cc.Node,
        node_bigwin: cc.Node,
        node_megawin: cc.Node,
        node_superwin: cc.Node,
        node_fg_pop: cc.Node,
        node_fg: cc.Node,
        node_fgwin_pop: cc.Node,
        node_fgwin: cc.Node,
        node_addFG_pop: cc.Node,
        node_addFG: cc.Node,

        node_rule: cc.Node,
        node_entry: cc.Node,
        anim_rotate: cc.Node,
        node_free: cc.Node,
        
        anim_root_set: cc.Animation,
        anim_root_bet: cc.Animation,

        title_logo1: cc.Sprite,
        title_logo2: cc.Sprite,
        title_spriteFrame: [cc.SpriteFrame],
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
        this.finishedSlotItemNum = 0; //已经滚动停止的item数量
        this.isRunningSlotAnim = false; 
        //投注额度数组
        this.betAmountArr = [1, 2, 3, 5, 10, 20, 30, 40, 50, 80, 100, 200, 500, 800, 1000];
        this.autoSpinTypeNumArr = [50, 100, 800, 3000];
        this.autoSpinData = [true, false, false, false];
        this.itemHeight = 130; // 每个slotitem的高度
        this.paymentSwitch = false;
        this.popCoinIsRun = false; // 弹窗金币是否在滚动中
        this.frees = [];
        this.node_betInfos = {};
        this.selectAutoBetStr = 'AUTO';
        this.selectAutoStatus = false;
        this.curSendSpin = false;           // 当前是否在发送spin请求
        this.coinRunAnimTween = null;
        this.currentSpriteIndex = 0;
        this.isShowLogo1 = true;
        this.wildId = 12; // 癞子牌ID
        this.freeTotalWinNum = 0;           // 三叶草免费时，总获取金额
        this.isSwitching = false;
        this.switchInterval = 2.0;  // 自动切换间隔
        this.switchTimer = 0;
        this.isFg = false;
    },

    loadAudioClip: function(audioClipUrl = "", func = null, target = null) {
        if (!audioClipUrl || audioClipUrl.length == 0) {
            return;
        };
        
        CommonFun.getInstance().loadBundle('bullMachine', (bundle) => {
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
        let audioClipUrl = "sound/" + name;
        this.loadAudioClip(audioClipUrl, (audioClip, target)=>{
            GlobalCfg.G_COMPONENTS.Audio.playSound(audioClip, false);
        }, this);
    },

    stopAllEffects: function() {
        GlobalCfg.G_COMPONENTS.Audio.stopAllEffects()
    },

    stopAll: function() {
        GlobalCfg.G_COMPONENTS.Audio.stopAll()
    },

    playGameMusic: function(name) {
        let audioClipUrl = "sound/" + name;
        this.loadAudioClip(audioClipUrl, (audioClip, target)=>{
            GlobalCfg.G_COMPONENTS.Audio.playMusic(audioClip, true)
        }, this);
    },

    onLoad: function() {
        CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.SHOW_BULL_GAME);

        GlobalCfg.ACT_SCENE_CTRL = this,
        this.jokerAudiosCtrl = this.node.getComponent("bullAudiosCtrl");

        this.msgHandle = ClientNotify.register(GlobalCfg.MSG_TYPE.serverMsg, this.onEventMsg, this);
        this.customMsgHandle = ClientNotify.register(GlobalCfg.MSG_TYPE.clientMsg, this.onEventMsg, this);
        this.btn_back.node.on('click', this.debounce(this.componentClickCall, 1), this);

        this.btn_setting.node.on('click', this.debounce(this.componentClickCall, 1), this);
        this.btn_spin.node.on('click', this.debounce(this.componentClickCall, 1), this);
        this.btn_spin2.node.on('click', this.debounce(this.componentClickCall, 1), this);

        this.btn_bigwin_end.node.on('click', this.debounce(this.componentClickCall, 1), this);
        this.btn_fg_end.node.on('click', this.debounce(this.componentClickCall, 1), this);
        
        this.btn_db.node.on('click', this.debounce(this.componentClickCall, 1), this);
        this.btn_bet.node.on('click', this.debounce(this.componentClickCall, 1), this);
        this.btn_sound.node.on('click', this.debounce(this.componentClickCall, 1), this);
        this.btn_rule.node.on('click', this.debounce(this.componentClickCall, 1), this);
        this.btn_rule_close.node.on('click', this.debounce(this.componentClickCall, 1), this);
        this.btn_autoSpinSet.node.on('click', this.debounce(this.componentClickCall, 1), this);
        this.btn_auto.node.on('click', this.debounce(this.componentClickCall, 2), this);
        
        this.toggle_fast.node.on('toggle', this.debounce(this.componentClickCall, 1), this);
        this.anim_curwin = this.lab_curWin.node.getComponent(cc.Animation);

        this.betIndex = 4;
        this.curBetAmount = this.betAmountArr[this.betIndex];
        this.lab_betAmount.string = "bet " + this.betAmountArr[this.betIndex];
        //总共赢的金额
        this.lab_totalWin.string = 0;
        this.bigWinLevel = 0;
        this.stopNumScroll = false;
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

    start: function() {
        this.playEntryAnim()
        this.sendLoginReq();
        this.initSlotData();
    },

    // update 函数
    update: function(dt) {
        if (this.isSwitching) return;
        
        this.switchTimer += dt;
        if (this.switchTimer >= this.switchInterval) {
            this.switchTimer = 0;
            this.executeSwitchAnimation();
        }
    },

    playEntryAnim: function() {
        let self = this;
        this.node_entry.active = true;

        let skel_entry = this.node_entry.getChildByName('rw').getComponent(sp.Skeleton);
        this.playGameMusic('zc');
        skel_entry.setAnimation(0, 'GameIntro_L', false);
        skel_entry.setCompleteListener(function() {
            self.node_entry.active = false;
            self.playGameMusic('mg_bgm');
        })
    },
    
    onDestroy: function() {
        GlobalCfg.ACT_SCENE_CTRL = null;
        ClientNotify.removeByHandle(GlobalCfg.MSG_TYPE.serverMsg, this.msgHandle);
        ClientNotify.removeByHandle(GlobalCfg.MSG_TYPE.clientMsg, this.customMsgHandle);
        CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.EXIT_BULL_GAME);
        cc.Tween.stopAllByTarget(this.title_logo1.node);
        cc.Tween.stopAllByTarget(this.title_logo2.node);
        this.stopAutoSwitch();
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
        //     SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.BULL, SceneManager.getInstance().sceneType.LOBBY);
        // }
        else if (msgId == GlobalCfg.CLIENT_MSG_ID.GAME_MENU_CLICK_OUT_TO_LOBBY) {
            if (self.isRunningSlotAnim) {
                CommonFun.getInstance().showMsgBox(self.tipsLabel[0], "YES_NO", ()=>{
                    SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.BULL, SceneManager.getInstance().sceneType.LOBBY);
                },  false);
            }
            else {
                SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.BULL, SceneManager.getInstance().sceneType.LOBBY);
            };
        }
        else if (msgId == GlobalCfg.CLIENT_MSG_ID.GAME_MENU_CLICK_HOW_TO_PLAY) {
            CommonFun.getInstance().showRule("fruitMachine");
        }
        else if (msgId == "lobbyservice.kicktolobby") {
            SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.BULL, SceneManager.getInstance().sceneType.LOBBY);
        }
        else if (msgId == GlobalCfg.CLIENT_MSG_ID.SAVE_AUTOSPIN) {
            this.autoSpinTypeNumArr = notify.autoSpinTypeNumArr;
            if (notify.isDeal) {
                this.sendCallReq();
                this.autoSpinData = notify.toggleTypeArr;
                this.dealAutoBetCiShuBtnEvent(this.autoSpinTypeNumArr[0]); //设置自动spin次数
            }
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
                SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.BULL, SceneManager.getInstance().sceneType.LOBBY);           
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
            let amount = freeCountItem.amount / 100;
            let freeCount = freeCountItem.freeCount;

            let freePool = freeCountItem.freePool/100;
            this.lab_betAmount.string = "bet " + amount;
            this.lab_totalWin.string = freePool.toFixed(2);
            this.freeTotalWinNum = freePool;
            // this.dealAutoBetCiShuBtnEvent(freeCount);
            this.anim_rotate.active = false;
            this.dealFreeGame(amount, freeCount);
            return;
        }
        let betStr = this.lab_autoBetCiShu.string;
        let isAuto = this.toggle_auto.isChecked;
        if (betStr != 'AUTO' && isAuto) {
            this.sendCallReq();
        }
        else {
            this.btn_spin.interactable = true;
            this.btn_spin2.interactable = true;
            this.btn_spin.enableAutoGrayEffect = false;
        }
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

    initSlotData: function() {
        for (let j = 0, len1 = this.node_itemContentArr.length; j < len1; j++) {
            let children = this.node_itemContentArr[j].children;
            for (let k = 0, len2 = children.length; k < len2; k++) {
                let src = children[k].getComponent('bullIconItemCtrl');
                src.initIcon();
            };
        };
        for (let i = 0, len = 15; i < len; i++) {
            this.node_betInfos[i] = {};
            this.node_betInfos[i].node = this.node_bet.children[i];
            let button = this.node_bet.children[i].getComponent(cc.Button);
            this.node_betInfos[i].label = this.node_bet.children[i].getChildByName("num").getComponent(cc.Label);
            this.node_betInfos[i].mark = this.node_bet.children[i].getChildByName("mark");
            this.node_betInfos[i].label.string = this.betAmountArr[i];
            button.node.on('click', this.debounce(this.betClickCall, 0.5), this);
        }
        this.node_betInfos[this.betIndex].mark.active = true;
        this.startAutoRotateAnim();
    },

    startAutoRotateAnim:function() {
        this.schedule(()=>{
            if(this.toggle_auto.isChecked){
                this.anim_rotate.active = false;
            }
            else{
                this.anim_rotate.active = !this.anim_rotate.active;
            }
        }, 5);
    },

    setUserDiamond: function(diamond) {
        LoggerUtil.getInstance().log(`caojun setUserDiamond diamond = ${diamond}`);
        GlobalCfg.USER_DATAS.userDiamond = diamond;
        let num = FloatCalculation.accDiv(GlobalCfg.USER_DATAS.userDiamond, 100);
        this.lab_jb.string = CommonFun.getInstance().numberToShow(num);
    },

    setFreesList: function(frees) {
        if (!frees) {
            return;
        };
        this.frees = frees;
    },

    setCallNotify: function(notify) {
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
        this.clearSlot();
        this.unscheduleAllCallbacks();
        this.startAutoRotateAnim();
        //设置转动的音效
        let isFast = this.toggle_fast.isChecked;
        let zhuangClipName = isFast ? 'zhuang-fast' : 'zhuang';
        this.playGameSound(zhuangClipName);

        //先扣除下注的金额
        if (this.gameResult.mianfeinum == 0) {
            let diamond = GlobalCfg.USER_DATAS.userDiamond - (parseFloat(this.curBetAmount) * 100);
            let num = FloatCalculation.accDiv(diamond, 100);
            this.lab_jb.string = CommonFun.getInstance().numberToShow(num);
        };
        if (this.gameResult.rewardtype == 1) {
            this.lab_totalWin.string = 0;
            this.lab_curWin.string = 0;
            this.freeTotalWinNum = 0;
        };
        //次数递减
        let betStr = this.lab_autoBetCiShu.string;
        if (this.gameResult.rewardtype == 1) { //FG不需要减少自动spin次数
            let betNum = parseInt(betStr) - 1;
            if (betNum == 0) {
                this.toggle_auto.isChecked = false;
                this.toggle_auto.interactable = false;
                this.node_toggle_auto.active = true;
            }
            else {
                this.lab_autoBetCiShu.string = betNum;
            };
        };
        this.dealSpinBtnEvent();
        this.startSlotsAnim();
    },

    clearSlot: function () {
        this.node_windb.active = false;
        this.lab_curWin.node.active = false;
        for (let i = 0, len = this.node_skelContentArr.length; i < len; i++) {
            let children = this.node_itemContentArr[i].children;
            let children2 = this.node_skelContentArr[i].children;
            for (let k = 0, lenk = children.length; k < lenk; k++) {
                children[k].getComponent('bullIconItemCtrl').stopAnimation();
                children2[k].getComponent('bullSkelItemCtrl').stopAnimation();
            };
        };
    },

    componentClickCall: function (component) {
        let componentName = component.node.name;
        GlobalCfg.G_COMPONENTS.Audio.playButton();
        if (componentName == "btn_back") {
            this.dealbetBtnEvent("db");
            ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, {msgCode: GlobalCfg.CLIENT_MSG_ID.GAME_MENU_CLICK_OUT_TO_LOBBY, msgData: {}});
        }
        else if (componentName == "btn_sound") {
            CommonFun.getInstance().showGameSetting(2);
            this.dealbetBtnEvent("db");
        }
        else if (componentName == "btn_rule") {
            this.dealbetBtnEvent("db");
            this.node_rule.active = true;
        }
        else if (componentName == "btn_rule_close") {
            this.node_rule.active = false;
        }
        else if (componentName == "btn_autoSpinSet") {
            this.dealbetBtnEvent("autoSpinSet");
        }   
        else if (componentName == "btn_set") {
            this.dealbetBtnEvent("set");
        }   
        else if (componentName == "btn_bet") {
            this.dealbetBtnEvent("bet");
        }
        else if (componentName == "btn_info") {
            this.dealbetBtnEvent("info");
        }
        else if (componentName == "btn_db") {
            this.dealbetBtnEvent("db");
        }
        else if (componentName == "toggle_fast") {
            this.dealFastBtnEvent();
        }
        else if (componentName == "btn_auto") {
            this.dealAutoBtnEvent();
        }
        else if (componentName == "btn_bigwin_end") {
            this.dealBigWinEndEvent();
        }
        else if (componentName == "btn_fg_end") {
            this.dealFreeGameEndEvent();
        }
        else if (componentName == "btn_spin" || componentName == "btn_spin2") {
            this.sendCallReq();
        }
    },

    betClickCall: function (component) {
        this.betIndex = parseInt(component.node.name) - 1;
        let label = component.node.getChildByName("num").getComponent(cc.Label);
        this.btn_db.node.active = false;

        this.curBetAmount = parseFloat(label.string);
        this.lab_betAmount.string = "bet " + label.string;

        //TODO 切换下注的时候 需要刷新界面上的各种相关金额
        this.anim_root_bet.play("popCloseAnim");
        this.betrootIsOpen = false;
        for (let i = 0; i < 15; i++) {
            this.node_betInfos[i].mark.active = false;
        }
        this.node_betInfos[this.betIndex].mark.active = true;
    },

    dealbetBtnEvent: function (btnType) {
        if (btnType == "set") {
            this.btn_db.node.active = true;
            this.anim_root_set.play("popAnim");
            this.setrootIsOpen = true;
        }
        else if (btnType == "bet") {
            this.btn_db.node.active = true;
            this.anim_root_bet.play("popAnim");
            this.betrootIsOpen = true;
        }
        else if (btnType == "db") {
            this.btn_db.node.active = false;
            this.anim_root_set.stop()
            this.anim_root_bet.stop()
            if (this.setrootIsOpen) {
                this.anim_root_set.play("popCloseAnim");
                this.setrootIsOpen = false;
            }
            if (this.betrootIsOpen) {
                this.anim_root_bet.play("popCloseAnim");
                this.betrootIsOpen = false;
            }
        }
        else if (btnType == "autoSpinSet") {
            let num = FloatCalculation.accDiv(GlobalCfg.USER_DATAS.userDiamond, 100);
            let balanceLess = num * 0.4;
            let balanceMore = num * 1.5;
            this.autoSpinTypeNumArr[2] = Math.floor(balanceLess);
            this.autoSpinTypeNumArr[3] = Math.floor(balanceMore);
            let autoSpinPrefabPromise = CommonFun.getInstance().loadPrefabByPromise(GlobalCfg.PREFAB_PATH.AUTOSPINSETTING);
            autoSpinPrefabPromise.then((prefab) => {
                let autoSpinNode = cc.instantiate(prefab);
                let autoSpinSetCtrl = autoSpinNode.getComponent('autoSpinSettingCtrl');
                autoSpinSetCtrl.initData(this.autoSpinTypeNumArr,  this.autoSpinData);
                CommonFun.getInstance().addToPointParent(autoSpinNode, GlobalCfg.PREFAB_PARENT.AUTOSPINSETTING);
            });
            this.dealbetBtnEvent("db");
        }
    },

    dealFastBtnEvent: function () {},

    dealAutoBetCiShuBtnEvent: function (ciShuType) {
        this.lab_autoBetCiShu.string = ciShuType;
        this.toggle_auto.isChecked = true;
        this.toggle_auto.interactable = true;
        this.node_toggle_auto.active = false;
        this.btn_auto.interactable = true;
        this.anim_rotate.active = false;
    },

    dealAutoBtnEvent: function () {
        this.toggle_auto.isChecked = !this.toggle_auto.isChecked

        if (this.toggle_auto.isChecked) {
            this.dealAutoBetCiShuBtnEvent("50");
            this.sendCallReq(); //新需求：点击自动下注的时候 直接开始spin
            this.node_toggle_auto.active = false;
        }
        if (!this.toggle_auto.isChecked) {
            this.toggle_auto.interactable = this.btn_spin.interactable;
            this.btn_auto.interactable = this.btn_spin.interactable;
            this.node_toggle_auto.active = true;
        }
    },

    dealSpinBtnEvent: function () {
        this.btn_spin.interactable = false;
        this.btn_spin2.interactable = false;
        this.btn_bet.interactable = false;
        this.btn_spin.enableAutoGrayEffect = true;
        if (!this.toggle_auto.isChecked) { //如果不是自动spin 此时不让开启自动spin
            this.toggle_auto.interactable = false;
            this.btn_auto.interactable = false;
        }
    },

    startSlotsAnim: function() {
        if (this.isRunningSlotAnim) {
            return;
        };
        this.isRunningSlotAnim = true;
        let isFast = this.toggle_fast.isChecked;
        this.kRate = 0.55;
        let slotContentTime = 0.1 * this.kRate;
        for (let i = 0, len = this.node_itemContentArr.length; i < len; i++) {
            let children = this.node_itemContentArr[i].children;
            let children2 = this.node_skelContentArr[i].children;
            for (let k = 0, lenk = children.length; k < lenk; k++) {
                let item = children[k];
                item.repeat = 0;
                item.index = k;
                item.shu = i;
                if (isFast) {
                    // this.scheduleOnce(() => {
                        this.runSlotsItemAnim(item, children2[k], item.y, item.y + this.itemHeight, isFast);
                    // }, slotContentTime);
                }
                else{
                    this.scheduleOnce(() => {
                        this.runSlotsItemAnim(item, children2[k], item.y, item.y + this.itemHeight, isFast);
                    }, (slotContentTime * i * 3));
                }

            };
        };
    },

    // 初始化位置
    initSlotPos: function(index) {
        let children = this.node_itemContentArr[index].children
        for (let i = 0; i < children.length; i++) {
            if (i == 0) {
                children[i].position = cc.v2(0, this.itemHeight);
            }
            else if (i == 1) {
                children[i].position = cc.v2(0, 0);
            }
            else if (i == 2) {
                children[i].position = cc.v2(0, -this.itemHeight);
            }
            else if (i == 3) {
                children[i].position = cc.v2(0, -this.itemHeight * 2);
            }
        }
    },
    
    runSlotsItemAnim: function(node, skelnode, statrPositionY, endedPositionY, isFast) {
        let self = this;
        node.repeat += 1;
        node.setPosition(cc.v2(0, statrPositionY));
        let repeat = node.repeat;
        let index = node.index;
        let shu = node.shu;
        let easeType = '';
        let runTime = 0.08 * self.kRate;
        let targetNum = isFast? 10 : 20;

        if (repeat == targetNum && !isFast) {
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
            if (repeat == targetNum) {
                if (endedPositionY >= this.itemHeight * 3) {
                    node.setPosition(cc.v2(0, -(this.itemHeight * 2)));
                };
                self.checkAnimFinish();
                return;
            };
            if (endedPositionY >= this.itemHeight * 3) {
                let src = node.getComponent('bullIconItemCtrl');
                let src2 = skelnode.getComponent('bullSkelItemCtrl');
                if (repeat == (targetNum - 4) && index == 0) {
                    let itemID = this.gameResult.cards[shu].cards[0];
                    src.setItemData(itemID);
                    src2.setItemData(itemID);
                    node.itemID = itemID;
                    skelnode.itemID = itemID;
                }
                else if (repeat == (targetNum - 3) && index == 1) {
                    let itemID = this.gameResult.cards[shu].cards[1];
                    src.setItemData(itemID);
                    src2.setItemData(itemID);
                    node.itemID = itemID;
                    skelnode.itemID = itemID;
                }
                else if (repeat == (targetNum - 2) && index == 2) {
                    let itemID = this.gameResult.cards[shu].cards[2];
                    src.setItemData(itemID);
                    src2.setItemData(itemID);
                    node.itemID = itemID;
                    skelnode.itemID = itemID;
                }
                else if (repeat == (targetNum - 1) && index == 3) {
                    let itemID = this.gameResult.cards[shu].cards[3];
                    src.setItemData(itemID);
                    src2.setItemData(itemID);
                    node.itemID = itemID;
                    skelnode.itemID = itemID;
                }
                else {
                    let num = Math.floor(Math.random() * 9 + 1);
                    if (shu == 0 && num == 8) {
                        num = 7;
                    }
                    else if (shu >= 3 && num == 9) {
                        num = 8;
                    }
                    src.setItemData(num);
                    node.itemID = num;
                };
                self.runSlotsItemAnim(node,skelnode, -(this.itemHeight * 2), -this.itemHeight, isFast);
            }
            else {
                self.runSlotsItemAnim(node,skelnode, endedPositionY, endedPositionY + this.itemHeight, isFast);
            };
        })
        .start();
    },

    checkAnimFinish: function() {
        this.finishedSlotItemNum += 1;
        if (this.finishedSlotItemNum == 30) {
            this.finishedSlotItemNum = 0;
            if (this.gameResult) {
                this.showSettlementResult();
            };
        };
    },

    recoverySpinBtnEvent: function() {
        this.btn_spin.interactable = true;
        this.btn_spin2.interactable = true;
        this.btn_bet.interactable = true;
        this.btn_spin.enableAutoGrayEffect = false;
        this.toggle_auto.interactable = true;
        this.btn_auto.interactable = true;
    },

    //结算
    showSettlementResult: function() {
        let totalMultiple = 0;
        for (let i = 0, len = this.gameResult.xiannum.length; i < len; i++) {
            let multiple = this.gameResult.xiannum[i].multiple;
            let num = this.gameResult.xiannum[i].num;
            if (multiple == null) {
                multiple = 0;
            }
            totalMultiple += (multiple * num);
        };
        let startScore = Number(this.freeTotalWinNum);
        let bet = parseFloat(this.curBetAmount); //下注金额
        
        //奖励类型 (1:正常金币奖励, 2:免费次数奖励)
        let endedScore = this.gameResult.rewardtype == 2 ? this.gameResult.freePool / 100 : totalMultiple * bet / 100 + startScore;
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
        this.checkAutoSpinSet(totalMultiple);
        this.showSpinResult();
        if (finalScore > 0) {
            let time = finalScore < 1 ? 0.6 : 1; //低于1分，因为有小数点的滚动所以时间要短一些
            if (this.bigWinLevel == 0) {
                if (finalScore >= 1) {
                    this.lab_curWin.node.active = true;
                    this.anim_curwin.play("fontbig");
                    this.runChangeTotalWinScore(this.lab_curWin, 0, finalScore, 1)
                }
            }
            this.runChangeTotalWinScore(this.lab_totalWin, startScore, endedScore, time, ()=>{
                // 判断是否为整数
                const isInteger = (value) => Math.floor(value) === value;
                let winScore = isInteger(endedScore) ? Math.floor(endedScore).toString() : endedScore.toFixed(2);
                // LoggerUtil.getInstance().log("caojun 结算结果 winScore ：", winScore);
                this.setTotalWin(winScore)
                let yanchiTime = 0.1;
                if (this.gameResult.mianfeinum > 0) { //如果为免费次数，则先需要让元素播放2次再进行结算
                    yanchiTime = 1;
                }
                let self = this;
                this.scheduleOnce(()=>{
                    if (self.bigWinLevel > 0) { //如果有big弹窗 则需要在弹窗之后再结算
                        self.showBigWinTips(finalScore);}
                    else self.startNextSpin();
                }, yanchiTime);
            })
            return;
        }
        this.startNextSpin();
    },

    /**
     * bigwin分数变化动画
     * @param {Number} startValue 开始分数
     * @param {Number} endValue 结束分数
     * @param {*} time 动画时间
     */
    runChangeBigWinScore: function(label, startValue, endValue, time, callback) {
        if (startValue == 0 && endValue == 0) {
            if (callback) {
                callback();
            }
            return;
        }
        if (this.coinRunAnimTween) {
            this.coinRunAnimTween.stop();
            this.coinRunAnimTween = null; // 清空引用
        }
        let obj = {};
        obj.currentValue = startValue;
        this.popCoinIsRun = true;
        // 判断是否为整数
        const isInteger = (value) => Math.floor(value) === value;
        this.coinRunAnimTween = cc.tween(obj)
        .to(time, { currentValue: endValue }, {
            onUpdate: (target, ratio) => {
                if (this.stopNumScroll == false) {
                    const value = startValue + (endValue - startValue) * ratio;
                    // 根据是否为整数决定显示格式
                    label.string = isInteger(value) ? Math.floor(value).toString() : value.toFixed(2);
                } else { 
                    // 立即停止动画，并且不执行后续的 call()
                    this.coinRunAnimTween.stop(); // 停止 Tween 动画
                    // 如果停止了，则直接显示最终值
                    label.string = isInteger(endValue) ? Math.floor(endValue).toString() : endValue.toFixed(2);
                    this.popCoinIsRun = false; // 手动标记动画结束
                    return; // 提前退出，避免后续逻辑
                }
            }
        }).call(() => {
            // 最后要显示的值，根据是否为整数决定显示格式
            label.string = isInteger(endValue) ? Math.floor(endValue).toString() : endValue.toFixed(2);
            this.popCoinIsRun = false; // 动画结束
            if (callback) {
                callback();
            }

        }).start();
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
    runChangeTotalWinScore: function(label, startValue, endValue, time, callback, isInt = false) {
        if (startValue === 0 && endValue === 0) {
            callback && callback();
            return;
        }
    
        let obj = { currentValue: startValue };
        this.popCoinIsRun = true;
        const shouldShowTwoDecimals = !isInt && 
            (Math.abs(endValue - Math.floor(endValue)) > 0.01 || 
             Math.abs(startValue - Math.floor(startValue)) > 0.01);
    
        cc.tween(obj)
            .to(time, { currentValue: endValue }, {
                onUpdate: function(_, ratio) {
                    let currentValue = startValue + (endValue - startValue) * ratio;
                    if (isInt) {
                        currentValue = Math.floor(currentValue);
                    } else {
                        if (shouldShowTwoDecimals) {
                            currentValue = parseFloat(currentValue.toFixed(2));
                        } else {
                            currentValue = parseFloat(currentValue.toFixed(1));
                        }
                    }
                    label.string = currentValue.toString();
                }
            })
            .call(function() {
                if (isInt) {
                    label.string = Math.floor(endValue).toString();
                } else {
                    label.string = shouldShowTwoDecimals ? endValue.toFixed(2) : endValue.toFixed(1);
                }
                this.popCoinIsRun = false;
                callback && callback();
            }.bind(this))
            .start();
    },

    //检查下次spin是否达到自动spin条件
    checkAutoSpinSet: function (totalMultiple) {
        if(this.autoSpinData[1] == true){ //如果设置了单次spin获得指定倍数 停止自动spin
            if (totalMultiple >= this.autoSpinTypeNumArr[1]) {
                this.toggle_auto.isChecked = false;
                this.node_toggle_auto.active = true;
            }
        }
        let balance = this.gameResult.userinfo.diamond;
        if(this.autoSpinData[2] == true){ //如果设置了本金下限 停止自动spin
            if (balance < this.autoSpinTypeNumArr[2]) {
                this.toggle_auto.isChecked = false;
                this.node_toggle_auto.active = true;
            }
        }
        if(this.autoSpinData[3] == true){ //如果设置了本金上限 停止自动spin
            if (balance > this.autoSpinTypeNumArr[3]) {
                this.toggle_auto.isChecked = false;
                this.node_toggle_auto.active = true;
            }
        }
    },

    setTotalWin: function(finalScore) {
        this.lab_totalWin.string = finalScore;
        let labAnimation = this.lab_totalWin.node.getComponent(cc.Animation)
        if (labAnimation) {
            labAnimation.play('FontBig2');
        }
    },

    getBigWinLevel: function(betMul) {
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
    
    showBigWinTips: function(endScore) {
        if (this.bigWinLevel == 0) return;
        this.node_bigwin_pop.active = true;
        this.playGameMusic('bigwin');
        this.node_bigwin.active = false;
        this.node_megawin.active = false;
        this.node_superwin.active = false;
        this.playBigWinAnim("1")
        this.runChangeBigWinScore(this.lab_bigwin[this.bigWinLevel - 1], 0, endScore, 2)
    },

    playBigWinAnim: function(skelName, callback) {
        let self = this;
        let tmpNode = this.node_bigwin;
        if (self.bigWinLevel == 2) {
            tmpNode = this.node_megawin;
        }
        else if (self.bigWinLevel == 3) {
            tmpNode = this.node_superwin;
        }
        tmpNode.active = true;
        tmpNode.scale = 1;
        if (skelName == "3") { //关闭动画，因为外包做不好 只能用animation实现
            tmpNode.getComponent(cc.Animation).play("bigwinEnd");
            self.scheduleOnce(()=>{
                callback && callback();
                tmpNode.getComponent(sp.Skeleton).setToSetupPose(); // 重置到初始姿势
                tmpNode.getComponent(cc.Animation).stop();
                if (self.isFg) {
                    self.playGameMusic('fg_bgm');
                }
                else{
                    self.playGameMusic('mg_bgm');
                }
            }, 0.5);
            return;
        }
        else {
            tmpNode.getComponent(sp.Skeleton).setAnimation(0, skelName, false);
            if (skelName == "1") {
                tmpNode.getComponent(sp.Skeleton).setCompleteListener(function() {
                    self.playBigWinAnim("2");})
                return;}
        }
        self.scheduleOnce(()=>{
            self.onBigWinAnimComplete();
        }, 3);
    },

    onBigWinAnimComplete: function() {
        if (this.stopNumScroll) return;
        let self = this;
        this.playBigWinAnim("3", ()=>{
            self.node_bigwin_pop.active = false;
            self.btn_bigwin_end.interactable = true;
            self.stopNumScroll = false;
            self.startNextSpin();
        });
    },

    dealBigWinEndEvent: function() {
        if (this.popCoinIsRun) { //如果是播放中 则停止动画 直接显示结果
            let self = this;
            this.popCoinIsRun = false;
            this.stopNumScroll = true; //停止金币滚动
            this.btn_bigwin_end.interactable = false;
            //如果中断
            this.playBigWinAnim("3", ()=>{
                self.node_bigwin_pop.active = false;
                self.btn_bigwin_end.interactable = true;
                self.stopNumScroll = false;
                self.startNextSpin();
            });
        }
    },

    startFreeGame: function(num) {
        let self = this;
        this.node_fg.scale = 1;
        this.lab_fg_num.string = num;
        this.node_windb.active = true;
        this.playGameSound('FGling')
        this.scheduleOnce(()=>{
            self.playGameMusic('fg_bgm');
            self.playGameSound('FGstart')
            self.node_fg_pop.active = true;
            self.btn_fg_end.interactable = false;
            self.playFreeGameAnim("1")
        }, 1);
    },

    //fg过程中又中fg
    addFreeGame: function(num) {
        this.node_addFG_pop.active = true;
        let self = this;
        let anim = this.node_addFG.getComponent(cc.Animation);
        anim.play("bigwinStart");
        this.lab_addfg_num.string = num;
        let curFreeGameNum = parseInt(this.lab_freenum.string);
        let curFreeGameFinalNum = curFreeGameNum + num - 1;
        this.scheduleOnce(()=>{
            self.runChangeTotalWinScore(self.lab_addfg_num, num, 0, 1, null, true)
            self.runChangeTotalWinScore(self.lab_freenum, curFreeGameNum, curFreeGameFinalNum, 1, ()=>{
                self.scheduleOnce(()=>{
                    anim.play("bigwinEnd");
                    self.scheduleOnce(()=>{
                        self.node_addFG_pop.active = false;
                        self.dealFreeGame(self.curBetAmount, curFreeGameFinalNum);
                    }, 0.5);
                }, 0.5);
            }, true)
        }, 1);
    },

    playFreeGameAnim: function(skelName, callback) {
        let self = this;
        self.node_fg.active = true;
        if (skelName == "3") { //关闭动画，因为外包做不好 只能用animation实现
            self.node_fg.getComponent(cc.Animation).play("bigwinEnd");
            self.scheduleOnce(()=>{
                callback && callback();
                self.node_fg.getComponent(cc.Animation).stop();
            }, 0.5);
            return;
        }
        else {
            self.node_fg.getComponent(sp.Skeleton).setAnimation(0, skelName, false);
            if (skelName == "1") {
                self.node_fg.getComponent(sp.Skeleton).setCompleteListener(function() {
                    self.btn_fg_end.interactable = true;
                    self.playFreeGameAnim("2");})
                return;}
        }
        self.scheduleOnce(()=>{
            self.onFreeGameAnimComplete();
        }, 2);
    },

    dealFreeGameEndEvent: function() {
        let self = this;
        this.btn_fg_end.interactable = false;
        //如果中断
        this.playFreeGameAnim("3", ()=>{
            self.node_fg_pop.active = false;
            self.node_fg.active = false;
            self.dealFreeGame(self.curBetAmount, self.gameResult.mianfeinum);
        });
    },

    onFreeGameAnimComplete: function() {
        let self = this;
        this.playFreeGameAnim("3", ()=>{
            self.node_fg_pop.active = false;
            self.node_fg.active = false;
            self.dealFreeGame(self.curBetAmount, self.gameResult.mianfeinum);
        });
    },

    dealFreeGame: function(amount, freeCount) {
        this.node_free.active = true;
        this.lab_freenum.string = freeCount
        let proroID = 'gameservice.call';
        let message = 'CallReq';
        GameServerManager.send(proroID, message, {              
            amount: amount * 100
        });
    },

    //播放FG结算动画
    PlayFGEndAnim: function(callback) {
        let self = this;
        this.node_fgwin_pop.active = true;
        let skel = this.node_fgwin.getComponent(sp.Skeleton);
        this.playGameMusic("winFG");
        skel.setAnimation(0, '1', false);
        skel.setCompleteListener(function() {
            skel.setAnimation(0, '2', false);})
        this.scheduleOnce(()=>{
            skel.setAnimation(0, '3', false);
            skel.setCompleteListener(function() {
                self.node_fgwin_pop.active = false;
                self.lab_curWin.node.active = false;
                skel.setToSetupPose(); // 重置到初始姿势
                self.playGameMusic("mg_bgm");
                callback && callback();
            })
        }, 4);
        this.lab_fgwin_coin.string = CommonFun.getInstance().numberToShow(this.gameResult.freePool/100);
        this.lab_fgwin_num.string = this.gameResult.execNum - 1;
    },

    showSpinResult: function() {
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

        this.showScatter();
        if (isNeedShowAnim) {
            //设置转动的音效
            let isFast = this.toggle_fast.isChecked;
            let winClipName = isFast ? 'win-fast' : 'win';
            this.playGameSound(winClipName);
            this.showXianNum();
            this.node_windb.active = true;
        }
        else {
            this.isRunningSlotAnim = false; 
        };
    },

    startNextSpin:function () {
        let StartNextSpin = () => {
            if (this.isRunningSlotAnim) {
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
                else{
                    if (this.gameResult.addFgCount && this.gameResult.addFgCount > 1) //FG过程中又中FG
                        this.addFreeGame(this.gameResult.addFgCount);
                    else
                        this.dealFreeGame(this.curBetAmount, this.gameResult.mianfeinum);
                }
            }
            else {
                this.isFg = false;
                if (this.gameResult.execNum > 1) {//说明是FG最后一次spin 需要结算
                    this.PlayFGEndAnim(()=>{
                        this.curRoundAddCoinFinish();
                        let isAuto = this.toggle_auto.isChecked;
                        if (isAuto) {
                            this.sendCallReq();
                        }
                        else {
                            this.recoverySpinBtnEvent();
                        };
                    });
                }
                else{
                    this.curRoundAddCoinFinish();
                    let isAuto = this.toggle_auto.isChecked;
                    if (isAuto) {
                        this.sendCallReq();
                    }
                    else {
                        this.recoverySpinBtnEvent();
                    };
                }
                this.node_free.active = false;
            }
        };
        this.schedule(StartNextSpin, 0.01); 
    },

    curRoundAddCoinFinish(){
        if(cc.isValid(this)){
            let minLimit = this.betAmountArr[0] || 0;
            minLimit = parseInt(minLimit) * 100;
            CommonFun.getInstance().gameShowSecondRecharge(minLimit, Number.MAX_SAFE_INTEGER, ()=>{
                if(cc.isValid(this)){
                    if (GlobalCfg.IS_SHOW_BANKRUPT) { //破产界面显示时 需要暂停自动spin
                        this.toggle_auto.isChecked = false;
                        this.node_toggle_auto.active = true;
                    }
                }
            });
            CommonFun.getInstance().showWithdrawToastInGame();
        }
    },

    showScatter: function() {
        for (let j = 0, len1 = this.node_itemContentArr.length; j < len1; j++) {
            let children = this.node_itemContentArr[j].children;
            let children2 = this.node_skelContentArr[j].children;
            for (let k = 0, len2 = children.length; k < len2; k++) {
                if (children[k].itemID && children[k].itemID == 13) { //scatter元素停轴时需要播放动画
                    children[k].getComponent('bullIconItemCtrl').playAnimation();
                    children2[k].getComponent('bullSkelItemCtrl').playAnimation();
                }
            };
        };
    },

    /**
     * 显示中奖线动画
     */
    showXianNum: function() {
        if (!this.gameResult) return;
        // 构建所有中奖线的节点数组
        const lineArr1 = this.buildLineArray(1);
        const lineArr2 = this.buildLineArray(2);
        this.playInstantAnimation(lineArr1,1);
        this.playInstantAnimation(lineArr2,2);
        this.playInstantSound(lineArr1);
    },

    /**
     * 构建所有中奖线的节点数组
     * @param {number} type - 1:icon节点 2:skel节点
     * @returns {Array} 包含所有中奖线节点组合的数组
     */
    buildLineArray: function(type) {
        const lineArr = [];
        const { xiannum } = this.gameResult;  // 解构获取中奖线数据
        // 遍历每条中奖线
        for (let i = 0; i < xiannum.length; i++) {
            // 解构获取当前线的卡牌、长度和数量
            const { card, num: xiannumNum,  len: xiannumLen, multiple: multiple} = xiannum[i];
            if (multiple == null || multiple == 0) continue;
            for (let j = 0; j < xiannumNum; j++) {
                // 获取第一列的节点（固定位置）
                let node0 = this.node_itemContentArr[0].children[i];
                if (type == 2) {
                    node0 = this.node_skelContentArr[0].children[i];
                }
                // 收集后续列中匹配的节点（卡牌相同或是万能牌10）
                const matchingNodes = this.collectMatchingNodes(card, xiannumLen, type);
                // 生成所有可能的线路组合
                this.generateLineCombinations(node0, matchingNodes, lineArr);
            }
        }
        return lineArr;
    },

    /**
     * 收集匹配的节点（卡牌相同或是万能牌12）
     * @param {number} card - 目标卡牌ID
     * @param {number} xiannumLen - 中奖线长度
     * @param {number} type - 1:icon节点 2:skel节点
     * @returns {Array} 每列匹配的节点数组
     */
    collectMatchingNodes: function(card, xiannumLen, type) {
        const matchingNodes = [];
        // 从第2列开始遍历（第1列已固定）
        for (let col = 1; col < Math.min(xiannumLen, this.node_itemContentArr.length); col++) {
            const columnNodes = [];
            let shu = this.node_itemContentArr[col];  // 当前列的所有节点
            if (type == 2) {
                shu = this.node_skelContentArr[col];
            }
            // 遍历当前列的4个节点
            for (let j = 0; j < 4; j++) {
                const itemNode = shu.children[j];
                // 如果节点卡牌匹配目标卡牌或是万能牌(12)
                if (itemNode.itemID === card || itemNode.itemID === this.wildId || itemNode.itemID > 100) {
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
    generateLineCombinations: function(shu0Node, matchingNodes, lineArr) {
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
    playInstantAnimation: function(lineArr, type) {
        // 遍历所有线
        for (const typeArr of lineArr) {
            // 遍历线中的每个相邻节点对
            for (let k = 0; k < typeArr.length - 1; k++) {
                const itemNode1 = typeArr[k];
                const itemNode2 = typeArr[k + 1];
                // 播放两个节点的动画
                if (type == 1) {
                    itemNode1.getComponent('bullIconItemCtrl').playAnimation();
                    itemNode2.getComponent('bullIconItemCtrl').playAnimation();
                }
                if (type == 2) {
                    itemNode1.getComponent('bullSkelItemCtrl').playAnimation();
                    itemNode2.getComponent('bullSkelItemCtrl').playAnimation();
                }
            }
        }
        // 1秒后设置动画状态为结束
        this.scheduleOnce(() => {
            this.isRunningSlotAnim = false;
        }, 1);
    },

    playInstantSound: function(lineArr) {
        const soundIDs = [7, 8, 9, 10, 11];
        const activeSounds = new Set();
        // 收集所有需要播放的音效ID
        for (const typeArr of lineArr) {
            for (let k = 0; k < typeArr.length - 1; k++) {
                activeSounds.add(typeArr[k].itemID);
            }
        }
        soundIDs.forEach(id => {
            if (activeSounds.has(id)) {
                console.log(`检测到音效ID symbol_${id} 需要播放`);
                // 这里添加播放音效的代码
                this.playGameSound("symbol_" + id);
            }
        });
    },

    hideSlotState: function() {
        this.lab_curWin.node.active = false;
        for (let j = 0, len1 = this.node_itemContentArr.length; j < len1; j++) {
            let children = this.node_itemContentArr[j].children;
            let children2 = this.node_skelContentArr[j].children;
            for (let k = 0, len2 = children.length; k < len2; k++) {
                children[k].isAnim = false;
                let src = children[k].getComponent('bullIconItemCtrl');
                let src2 = children2[k].getComponent('bullSkelItemCtrl');
                src.stopAnimation();
                src2.stopAnimation();
            };
        };
    },

    sendLoginReq: function() {
        let proroID = 'gameservice.login';
        let message = 'LoginReq';
        GameServerManager.send(proroID, message, {
            userid: GlobalCfg.USER_DATAS.userId,
            token: GlobalCfg.USER_DATAS.token,
            fromid: 2001,
            isFree: GlobalCfg.GAME_ENTER_ISFREE,       //是否进入免费场
        });
    },

    sendCallReq: function() {
        if (this.curSendSpin == true) { //避免重复发送请求
            return;
        }
        if (GlobalCfg.USER_DATAS.isNotCharge == true && GlobalCfg.USER_DATAS.gamePattern == 0 && GlobalCfg.USER_DATAS.refuseUnpayHundred == true){   //未曾充值
            CommonFun.getInstance().showMsgBox("This feature is available only for premium players . Add cash now to become a premium player .", "SHOP", () => {
                if (this.paymentSwitch) {
                    CommonFun.getInstance().showSmallAddCash()
                }
                this.recoverySpinBtnEvent();
                this.toggle_auto.isChecked = false; //关闭自动
                this.node_toggle_auto.active = true;
            }, false);
            return;
        };

        let betAmount = parseFloat(this.curBetAmount) * 100;
        let freesItem = this.getFreesItem(betAmount);
        let freeCount = freesItem.freeCount;
        if (betAmount > GlobalCfg.USER_DATAS.userDiamond && freeCount <= 0) {
            this.recoverySpinBtnEvent();
            this.toggle_auto.isChecked = false; //关闭自动
            this.node_toggle_auto.active = true;
            CommonFun.getInstance().showMsgBox('Insufficient Coins', "YES", () => {
                if (this.paymentSwitch) {
                    CommonFun.getInstance().showSmallAddCash()
                }
            }, false);
            return;
        };
        this.curSendSpin = true;
        let proroID = 'gameservice.call';
        let message = 'CallReq';
        GameServerManager.send(proroID, message, {              
            amount: betAmount,
        });
    },

    executeSwitchAnimation: function() {
        this.isSwitching = true;
        
        // 明确区分固定Logo和切换Logo
        var fixedLogo = this.title_logo1;  // 永远不切换图片的Logo
        var switchingLogo = this.title_logo2; // 会切换图片的Logo
        
        // 确定当前显示的是哪个Logo
        var currentLogo = this.isShowLogo1 ? fixedLogo : switchingLogo;
        var nextLogo = this.isShowLogo1 ? switchingLogo : fixedLogo;
    
        // 只有当切换到switchingLogo时才更换图片
        if (nextLogo === switchingLogo) {
            switchingLogo.spriteFrame = this.title_spriteFrame[this.currentSpriteIndex];
            this.currentSpriteIndex = (this.currentSpriteIndex + 1) % this.title_spriteFrame.length;
        }
    
        // 当前Logo消失动画（淡出）
        cc.tween(currentLogo.node)
            .to(0.5, { opacity: 0 })
            .call(function() {
                currentLogo.node.setPosition(currentLogo.node.x, 30);
            })
            .start();
    
        // 新Logo出现动画（从上方落下+淡入）
        cc.tween(nextLogo.node)
            .delay(0.3)
            .set({ 
                opacity: 0, 
                position: cc.v2(0, 30)
            })
            .parallel(
                cc.tween().to(0.3, { opacity: 255 }),
                cc.tween().to(0.3, { position: cc.v2(0, -30) })
            )
            .call(function() {
                this.isShowLogo1 = !this.isShowLogo1;
                this.isSwitching = false;
            }.bind(this))
            .start();
    },

    // 开始自动轮播
    startAutoSwitch: function() {
        this.schedule(this.executeSwitchAnimation.bind(this), this.switchInterval);
    },

    // 停止自动轮播
    stopAutoSwitch: function() {
        this.unschedule(this.executeSwitchAnimation.bind(this));
    },

});