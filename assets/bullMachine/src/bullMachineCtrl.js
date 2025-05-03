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
        btn_autoSpinSet: cc.Button,

        btn_auto: cc.Button,
        toggle_fast: cc.Toggle,
        toggle_auto: cc.Toggle,
        node_itemContentArr: [cc.Node],

        lab_betAmount: cc.Label,
        lab_totalWin: cc.Label,
        lab_jb: cc.Label,
        lab_autoBetCiShu: cc.Label,
        lab_bigwin: cc.Label,

        node_bet: cc.Node,

        node_bigwin_pop: cc.Node,
        node_rule: cc.Node,
        node_entry: cc.Node,
        anim_rotate: cc.Node,
        
        anim_root_set: cc.Animation,
        anim_root_bet: cc.Animation,
        skel_bigWin: sp.Skeleton,

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
        this.multArr = [1, 2, 3, 5, 10, 15];
        this.autoSpinTypeNumArr = [50, 100, 800, 3000];
        this.autoSpinData = [true, false, false, false];
        this.betAmountArrIndex = 0;
        this.itemHeight = 130; // 每个slotitem的高度
        this.paymentSwitch = false;
        this.popCoinIsRun = false; // 弹窗金币是否在滚动中
        this.frees = [];
        this.node_betInfos = {};
        this.selectAutoBetStr = 'AUTO';
        this.selectAutoStatus = false;
        this.curSendSpin = false;           // 当前是否在发送spin请求
        this.coinRunAnimTween = null;
        this.fakeSlotRunTween = {};
        this.currentSpriteIndex = 0;
        this.isShowLogo1 = true;
    },

    loadAudioClip: function(audioClipUrl = "", func = null, target = null) {
        if (!audioClipUrl || audioClipUrl.length == 0) {
            return;
        };
        
        // CommonFun.getInstance().loadBundle('bullMachine', (bundle) => {
        //     bundle.load(audioClipUrl, cc.AudioClip, (err1, audioClip) => {
        //         if (!err1) {
        //             func && func(audioClip, target);
        //         }
        //         else {
        //             LoggerUtil.getInstance().error(err1); 
        //         };
        //     });
        // }, (err) => {
        //     LoggerUtil.getInstance().error(err);
        // });
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
        // let audioClipUrl = "sound/" + name;
        // this.loadAudioClip(audioClipUrl, (audioClip, target)=>{
        //     GlobalCfg.G_COMPONENTS.Audio.playMusic(audioClip, true)
        // }, this);
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
        
        this.btn_db.node.on('click', this.debounce(this.componentClickCall, 1), this);
        this.btn_bet.node.on('click', this.debounce(this.componentClickCall, 1), this);
        this.btn_sound.node.on('click', this.debounce(this.componentClickCall, 1), this);
        this.btn_rule.node.on('click', this.debounce(this.componentClickCall, 1), this);
        this.btn_rule_close.node.on('click', this.debounce(this.componentClickCall, 1), this);
        this.btn_autoSpinSet.node.on('click', this.debounce(this.componentClickCall, 1), this);
        this.btn_auto.node.on('click', this.debounce(this.componentClickCall, 2), this);
        
        this.toggle_fast.node.on('toggle', this.debounce(this.componentClickCall, 1), this);
        this.betIndex = 0;
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
        // 定时切换
        this.schedule(this.switchSprite, 3);
    },

    playEntryAnim: function() {
        let self = this;
        this.node_entry.active = true;

        let skel_entry = this.node_entry.getChildByName('rw').getComponent(sp.Skeleton);
        this.playGameMusic('Play_Ready');
        skel_entry.setAnimation(0, 'GameIntro_L', false);
        skel_entry.setCompleteListener(function() {
            self.node_entry.active = false;
            self.playGameMusic('Mg_bgm');
        })
    },
    
    onDestroy: function() {
        GlobalCfg.ACT_SCENE_CTRL = null;
        ClientNotify.removeByHandle(GlobalCfg.MSG_TYPE.serverMsg, this.msgHandle);
        ClientNotify.removeByHandle(GlobalCfg.MSG_TYPE.clientMsg, this.customMsgHandle);
        CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.EXIT_BULL_GAME);
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
        else if(msgId == GlobalCfg.CLIENT_MSG_ID.FIRST_RECHARGE_TIPS) {
            SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.BULL, SceneManager.getInstance().sceneType.LOBBY);
        }
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
        this.node_betInfos[0].mark.active = true;
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
        this.gameResult.buy = notify.buy;
        this.gameResult.restartCards = notify.restartCards;

        this.unscheduleAllCallbacks();
        this.startAutoRotateAnim();
        
        //设置转动的音效
        this.playGameSound("Reel_Spin");
        //次数递减
        let betStr = this.lab_autoBetCiShu.string;
        if (betStr != 'AUTO') {
            let betNum = parseInt(betStr) - 1;
            if (betNum == 0) {
                this.toggle_auto.isChecked = false;
                this.toggle_auto.interactable = false;
            }
            else {
                this.lab_autoBetCiShu.string = betNum; 
            };
        };
        this.lab_totalWin.string = 0;
        this.dealSpinBtnEvent();
        this.startSlotsAnim();
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
        else if (componentName == "btn_backgrand") {
            this.dealJpPopEndEvent();
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
        this.btn_auto.interactable = true;
        this.anim_rotate.active = false;
    },

    dealAutoBtnEvent: function () {
        this.toggle_auto.isChecked = !this.toggle_auto.isChecked

        if (this.toggle_auto.isChecked) {
            this.dealAutoBetCiShuBtnEvent("50");
            this.sendCallReq(); //新需求：点击自动下注的时候 直接开始spin
        }
        if (!this.toggle_auto.isChecked) {
            this.toggle_auto.interactable = this.btn_spin.interactable;
            this.btn_auto.interactable = this.btn_spin.interactable;
        }
    },

    dealSpinBtnEvent: function () {
        this.btn_spin.interactable = false;
        this.btn_spin2.interactable = false;
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
            for (let k = 0, lenk = children.length; k < lenk; k++) {
                let item = children[k];
                item.repeat = 0;
                item.index = k;
                item.shu = i;
                if (isFast) {
                    // this.scheduleOnce(() => {
                        this.runSlotsItemAnim(item, item.y, item.y + this.itemHeight);
                    // }, slotContentTime);
                }
                else{
                    this.scheduleOnce(() => {
                        this.runSlotsItemAnim(item, item.y, item.y + this.itemHeight);
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
    
    runSlotsItemAnim: function(node, statrPositionY, endedPositionY, curTargetNum = 10) {
        let self = this;
        node.repeat += 1;
        node.setPosition(cc.v2(0, statrPositionY));
        let repeat = node.repeat;
        let index = node.index;
        let shu = node.shu;
        let easeType = '';
        let runTime = 0.08 * self.kRate;
        let isFast = this.toggle_fast.isChecked;
        // let targetNum = isFast ? 4 : 8;
        let targetNum = curTargetNum;

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
                if (repeat == (targetNum - 4) && index == 0) {
                    let itemID = this.gameResult.cards[shu].cards[0];
                    src.setItemData(itemID);
                    node.itemID = itemID;
                }
                else if (repeat == (targetNum - 3) && index == 1) {
                    let itemID = this.gameResult.cards[shu].cards[1];
                    src.setItemData(itemID);
                    node.itemID = itemID;
                }
                else if (repeat == (targetNum - 2) && index == 2) {
                    let itemID = this.gameResult.cards[shu].cards[2];
                    src.setItemData(itemID);
                    node.itemID = itemID;
                }
                else if (repeat == (targetNum - 1) && index == 3) {
                    let itemID = this.gameResult.cards[shu].cards[3];
                    src.setItemData(itemID);
                    node.itemID = itemID;
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
                self.runSlotsItemAnim(node, -(this.itemHeight * 2), -this.itemHeight, curTargetNum);
            }
            else {
                self.runSlotsItemAnim(node, endedPositionY, endedPositionY + this.itemHeight, curTargetNum);
            };
        })
        .start();
    },

    checkAnimFinish: function() {
        this.finishedSlotItemNum += 1;
        if (this.finishedSlotItemNum == 30) {
            this.finishedSlotItemNum = 0;
            this.showResultAnima();
        };
    },

    recoverySpinBtnEvent: function() {
        this.btn_spin.interactable = true;
        this.btn_spin2.interactable = true;
        this.btn_spin.enableAutoGrayEffect = false;
        this.toggle_auto.interactable = true;
        this.btn_auto.interactable = true;
    },

    hideSkel: function() {
        for (let i = 0, len = this.node_skelNearwin.length; i < len; i++) {
            this.node_skelNearwin[i].active = false;
            this.node_skel2wait1[i].active = false;
        }

    },

    showResultAnima: function() {
        if (this.gameResult) {
            this.showSettlementResult();
        };
    },

    //结算
    showSettlementResult: function() {
        let totalMultiple = 0;
        for (let i = 0, len = this.gameResult.xiannum.length; i < len; i++) {
            let multiple = this.gameResult.xiannum[i].multiple;
            let num = this.gameResult.xiannum[i].num;
            totalMultiple += (multiple * num);
        };

        let bet = parseFloat(this.curBetAmount)
        let endedScore = totalMultiple *  bet / 10
        this.checkAutoSpinSet(totalMultiple);
        this.showSpinResult();
        if (endedScore > 0) {
            if (this.bigWinLevel > 0) { //如果有big弹窗 则需要在弹窗之后再结算
                this.showBigWinTips();
            }
            else{
                this.startNextSpin();
            }
            return;
        }
        this.startNextSpin();
    },

    /**
     * 分数变化动画
     * @param {Number} startValue 开始分数
     * @param {Number} endValue 结束分数
     * @param {*} time 动画时间
     */
    runChangeTotalWinScore: function(label, startValue, endValue, time, callback) {
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
                    label.string = isInteger(value) ? Math.floor(value).toString() : value.toFixed(1);
                } else { 
                    // 立即停止动画，并且不执行后续的 call()
                    this.coinRunAnimTween.stop(); // 停止 Tween 动画
                    // 如果停止了，则直接显示最终值
                    label.string = isInteger(endValue) ? Math.floor(endValue).toString() : endValue.toFixed(1);
                    this.popCoinIsRun = false; // 手动标记动画结束
                    return; // 提前退出，避免后续逻辑
                }
            }
        }).call(() => {
            // 最后要显示的值，根据是否为整数决定显示格式
            label.string = isInteger(endValue) ? Math.floor(endValue).toString() : endValue.toFixed(1);
            this.setTotalWin(label.string)
            this.popCoinIsRun = false; // 动画结束
            if (callback) {
                callback();
            }

        }).start();
    },

    //检查下次spin是否达到自动spin条件
    checkAutoSpinSet: function (totalMultiple) {
        if(this.autoSpinData[1] == true){ //如果设置了单次spin获得指定倍数 停止自动spin
            if (totalMultiple >= this.autoSpinTypeNumArr[1]) {
                this.toggle_auto.isChecked = false;
            }
        }
        let balance = this.gameResult.userinfo.diamond;
        if(this.autoSpinData[2] == true){ //如果设置了本金下限 停止自动spin
            if (balance < this.autoSpinTypeNumArr[2]) {
                this.toggle_auto.isChecked = false;
            }
        }
        if(this.autoSpinData[3] == true){ //如果设置了本金上限 停止自动spin
            if (balance > this.autoSpinTypeNumArr[3]) {
                this.toggle_auto.isChecked = false;
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
    
    showBigWinTips: function(winNumFinal) {
        if (this.bigWinLevel == 0) return;
        this.node_bigwin_pop.active = true;
        this.playGameMusic('Big_win');
        let time = this.bigWinLevel * 1.8; //因为要从bigwin开始播放，每个动画时间3秒
        this.runChangeTotalWinScore(this.lab_bigwin, 0, winNumFinal, time)
        this.curBigWinAnimIndex = 0;
        this.playBigWinAnim("start", false)
    },

    playBigWinAnim: function(skelName, callback) {
        let self = this;
        self.skel_bigWin_bg.setAnimation(0, skelName, false);

        if (callback) { //结束bigwin播放结束音效
            self.playGameMusic('Big_Win_End');
        }
        self.scheduleOnce(()=>{
            if (callback) {
                callback();
                self.playGameMusic('Mg_bgm');
                return;
            }
            self.onBigWinAnimComplete();
        }, 1.8); 
    },

    onBigWinAnimComplete: function() {
        if (this.stopNumScroll) return;
        let self = this;
        this.playBigWinAnim("end", false, ()=>{
            self.node_bigwin_pop.active = false;
            self.btn_bigwin_end.interactable = true;
            self.stopNumScroll = false;
            self.startNextSpin();
        });
    },

    dealBigWinEndEvent: function() {
        if (this.popCoinIsRun) { //如果是播放中 则停止动画 直接显示结果
            this.popCoinIsRun = false;
            this.stopNumScroll = true; //停止金币滚动
            this.btn_bigwin_end.interactable = false;

            this.skel_bigWin.setCompleteListener(null); // 清除之前的回调
            //如果中断
            this.playBigWinAnim("end", false, ()=>{
                this.node_bigwin_pop.active = false;
                this.btn_bigwin_end.interactable = true;
                this.stopNumScroll = false;
                this.startNextSpin();
            });
        }
    },


    showSpinResult: function() {
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

        if (isNeedShowAnim) {
            this.showXianNum();
        }
        else {
            this.isRunningSlotAnim = false; 
        };
    },

    startNextSpin:function () {
        this.toggle_auto.interactable = true;
        this.btn_auto.interactable = true;
        let StartNextSpin = () => {
            if (this.isRunningSlotAnim) {
                return;
            };
            this.setUserDiamond(this.gameResult.userinfo.diamond); //结算完成，更新用户钻石
            this.unschedule(StartNextSpin);
            this.curRoundAddCoinFinish();
            let isAuto = this.toggle_auto.isChecked;
            if (isAuto) {
                this.sendCallReq();
            }
            else {
                this.recoverySpinBtnEvent();
            };
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
                    }
                }
            });
            CommonFun.getInstance().showWithdrawToastInGame();
        }
    },

    /**
     * 显示中奖线动画
     * @param {number} totalMultiple - 总倍数
     * @param {boolean} isFast - 是否快速播放
     */
    showXianNum: function(totalMultiple, isFast) {
        if (!this.gameResult) return;
        // 构建所有中奖线的节点数组
        const lineArr = this.buildLineArray();
        if (totalMultiple >= 5) {
            // 高倍数时播放序列动画（带延迟效果）
            this.playAnimatedSequence(lineArr, isFast);
        } else {
            // 低倍数时立即播放所有动画
            this.playInstantAnimation(lineArr);
        }
    },

    /**
     * 构建所有中奖线的节点数组
     * @returns {Array} 包含所有中奖线节点组合的数组
     */
    buildLineArray: function() {
        const lineArr = [];
        const { xiannum } = this.gameResult;  // 解构获取中奖线数据
        // 遍历每条中奖线
        for (let i = 0; i < xiannum.length; i++) {
            // 解构获取当前线的卡牌、长度和数量
            const { card, len: xiannumLen, num: xiannumNum } = xiannum[i];
            // 只处理长度≥3的中奖线
            if (xiannumLen < 3) continue;
            // 根据线的数量循环
            for (let j = 0; j < xiannumNum; j++) {
                // 获取第一列的节点（固定位置）
                const node0 = this.node_itemContentArr[0].children[i];
                // 收集后续列中匹配的节点（卡牌相同或是万能牌10）
                const matchingNodes = this.collectMatchingNodes(card, xiannumLen);
                // 生成所有可能的线路组合
                this.generateLineCombinations(node0, matchingNodes, lineArr);
            }
        }
        return lineArr;
    },

    /**
     * 收集匹配的节点（卡牌相同或是万能牌10）
     * @param {number} card - 目标卡牌ID
     * @param {number} xiannumLen - 中奖线长度
     * @returns {Array} 每列匹配的节点数组
     */
    collectMatchingNodes: function(card, xiannumLen) {
        const matchingNodes = [];
        // 从第2列开始遍历（第1列已固定）
        for (let col = 1; col < Math.min(xiannumLen + 1, this.node_itemContentArr.length); col++) {
            const columnNodes = [];
            const shu = this.node_itemContentArr[col];  // 当前列的所有节点
            // 遍历当前列的4个节点
            for (let j = 0; j < 4; j++) {
                const itemNode = shu.children[j];
                // 如果节点卡牌匹配目标卡牌或是万能牌(10)
                if (itemNode.itemID === card || itemNode.itemID === 10) {
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
     * 播放带延迟的序列动画（用于高倍数）
     * @param {Array} lineArr - 所有中奖线节点数组
     * @param {boolean} isFast - 是否快速播放
     */
    playAnimatedSequence: function(lineArr, isFast) {
        const pointTime = isFast ? 0.1 : 0.2;  // 每个节点的动画间隔时间
        let allTime = 0;  // 累计时间
        
        for (let i = 0; i < lineArr.length; i++) {
            const typeArr = lineArr[i];
            // 计算当前线的开始时间（前一条线的长度影响延迟）
            const lineTime = i === 0 ? 0 : (pointTime * 2.5 * (lineArr[i - 1].length - 1));
            allTime += lineTime;
            
            // 调度当前线的动画
            this.scheduleOnce(() => {
                const lastIndex = typeArr.length - 1;
                // 如果不是单节点线，则在动画结束后设置运行状态为false
                if (lastIndex > 0) {
                    this.scheduleOnce(() => {
                        this.isRunningSlotAnim = false;
                    }, pointTime * (lastIndex - 1) + 3);  // 3秒额外延迟
                }
            }, lineTime);
        }
    },

    /**
     * 立即播放所有动画（用于低倍数）
     * @param {Array} lineArr - 所有中奖线节点数组
     */
    playInstantAnimation: function(lineArr) {
        // 遍历所有线
        for (const typeArr of lineArr) {
            // 遍历线中的每个相邻节点对
            for (let k = 0; k < typeArr.length - 1; k++) {
                const itemNode1 = typeArr[k];
                const itemNode2 = typeArr[k + 1];
                
                // 播放两个节点的动画
                itemNode1.getComponent('bullIconItemCtrl').playAnimation();
                itemNode2.getComponent('bullIconItemCtrl').playAnimation();
            }
        }
        
        // 1秒后设置动画状态为结束
        this.scheduleOnce(() => {
            this.isRunningSlotAnim = false;
        }, 1);
    },

    hideSlotState: function() {
        for (let j = 0, len1 = this.node_itemContentArr.length; j < len1; j++) {
            let children = this.node_itemContentArr[j].children;
            for (let k = 0, len2 = children.length; k < len2; k++) {
                children[k].isAnim = false;
                let src = children[k].getComponent('bullIconItemCtrl');
                src.stopAnimation();
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
            }, false);
            return;
        };
        let betAmount = parseFloat(this.curBetAmount) * 100;
        if (betAmount > GlobalCfg.USER_DATAS.userDiamond) {
            this.recoverySpinBtnEvent();
            CommonFun.getInstance().showMsgBox(this.tipsLabel[5], "SHOP", () => {
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


    switchSprite() {
        // 设置当前图片
        let self = this;
        if (this.isShowLogo1) {
            this.isShowLogo1 = false;
            self.title_logo2.spriteFrame = self.title_spriteFrame[self.currentSpriteIndex];
            self.currentSpriteIndex = (self.currentSpriteIndex + 1) % self.title_spriteFrame.length;
            var fadeOut = cc.fadeOut(0.2); // 参数表示动作持续的时间，单位为秒
            self.title_logo1.node.runAction(fadeOut);
            self.scheduleOnce(() => {
                self.title_logo1.node.setPosition(self.title_logo1.node.x, 30);
                fadeIn = cc.fadeIn(0.1);
                self.title_logo1.node.runAction(fadeIn);
                cc.tween(self.title_logo2.node)
                .to(
                    0.3, {position: cc.v2(0, -30)}, 
                ).start();
            }, 0.3);
            
        }
        else {
            this.isShowLogo1 = true;
            var fadeOut = cc.fadeOut(0.2); // 参数表示动作持续的时间，单位为秒
            self.title_logo2.node.runAction(fadeOut);
            self.scheduleOnce(() => {
                self.title_logo2.node.setPosition(self.title_logo2.node.x, 30);
                fadeIn = cc.fadeIn(0.1);
                self.title_logo2.node.runAction(fadeIn);
                cc.tween(self.title_logo1.node)
                .to(
                    0.3, {position: cc.v2(0, -30)}, 
                ).start();
            }, 0.3);
        }
    },
});