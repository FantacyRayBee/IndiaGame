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
        btn_betMax: cc.Button,
        btn_betCiShuForever: cc.Button,
        btn_betCiShu100: cc.Button,
        btn_betCiShu50: cc.Button,
        btn_betCiShu20: cc.Button,
        btn_auto: cc.Button,
        btn_spin: cc.Button,

        toggle_fast: cc.Toggle,
        toggle_auto: cc.Toggle,

        node_tcBg: cc.Node,
        node_lines: cc.Node,

        node_fruitContentArr: [cc.Node],

        lab_autoBetCiShu: cc.Label,

        lab_betAmount: cc.Label,

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
        this.betAmountArr = ['10', '20', '50', '100', '200', '500', '1000', '2000'];
        if(GlobalCfg.USER_DATAS.gamePattern == 1){
            this.betAmountArr = ['1', '10', '20', '50', '100', '200', '500', '1000', '2000'];
        }
        this.betAmountArrIndex = 0;

        this.finishedFruitItemNum = 0;
        this.isRunningFruitAnim = false; 

        this.paymentSwitch = false;

        this.frees = [];

        this.isHaveMianFeiRecord = false;
        this.selectAutoBetStr = 'AUTO';
        this.selectAutoStatus = false;
        this.freeTotalWinNum = 0;           // 三叶草免费时，总获取金额
    },

    loadAudioClip: function(audioClipUrl = "", func = null, target = null) {
        if (!audioClipUrl || audioClipUrl.length == 0) {
            return;
        };
        
        CommonFun.getInstance().loadBundle('fruitMachine', (bundle) => {
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
        this.loadAudioClip(name, (audioClip, target)=>{
            GlobalCfg.G_COMPONENTS.Audio.playSound(audioClip, false);
        }, this);
    },

    playGameMusic: function(name) {
        this.loadAudioClip(name, (audioClip, target)=>{
            GlobalCfg.G_COMPONENTS.Audio.playMusic(audioClip, true)
        }, this);
    },

    onLoad: function() {
        CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.SHOW_FRUIT_GAME);

        GlobalCfg.ACT_SCENE_CTRL = this,
        this.playGameMusic('sound/bg');
        this.msgHandle = ClientNotify.register(GlobalCfg.MSG_TYPE.serverMsg, this.onEventMsg, this);
        this.customMsgHandle = ClientNotify.register(GlobalCfg.MSG_TYPE.clientMsg, this.onEventMsg, this);
        this.btn_back.node.on('click', this.debounce(this.componentClickCall, 1), this);
        this.btn_add.node.on('click', this.debounce(this.componentClickCall, 1), this);
        this.btn_addcash.node.on('click', this.debounce(this.componentClickCall, 1), this);
        this.btn_wf.node.on('click', this.debounce(this.componentClickCall, 1), this);
        this.btn_setting.node.on('click', this.debounce(this.componentClickCall, 1), this);
        this.btn_betJian.node.on('click', this.debounce(this.componentClickCall, 0), this);
        this.btn_betJia.node.on('click', this.debounce(this.componentClickCall, 0), this);
        this.btn_betMax.node.on('click', this.debounce(this.componentClickCall, 1), this);
        this.btn_betCiShuForever.node.on('click', this.debounce(this.componentClickCall, 1), this);
        this.btn_betCiShu100.node.on('click', this.debounce(this.componentClickCall, 1), this);
        this.btn_betCiShu50.node.on('click', this.debounce(this.componentClickCall, 1), this);
        this.btn_betCiShu20.node.on('click', this.debounce(this.componentClickCall, 1), this);
        this.btn_auto.node.on('click', this.debounce(this.componentClickCall, 0.5), this);
        this.btn_spin.node.on('click', this.debounce(this.componentClickCall, 1), this);

        this.toggle_fast.node.on('toggle', this.debounce(this.componentClickCall, 0), this);

        this.autoSpineNode = this.btn_auto.node.getChildByName('uiquan');
        this.autoSpineNode.active = false;

        this.lab_betAmount.string = this.betAmountArr[0];

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

    start: function() {
        this.sendLoginReq();
    },

    
    onDestroy: function() {
        GlobalCfg.ACT_SCENE_CTRL = null;
        ClientNotify.removeByHandle(GlobalCfg.MSG_TYPE.serverMsg, this.msgHandle);
        ClientNotify.removeByHandle(GlobalCfg.MSG_TYPE.clientMsg, this.customMsgHandle);
        CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.EXIT_FRUIT_GAME);
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
        //     SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.SGJ, SceneManager.getInstance().sceneType.LOBBY);
        // }
        else if (msgId == GlobalCfg.CLIENT_MSG_ID.GAME_MENU_CLICK_OUT_TO_LOBBY) {
            if (self.isRunningFruitAnim) {
                CommonFun.getInstance().showMsgBox(self.tipsLabel[0], "YES_NO", ()=>{
                    SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.SGJ, SceneManager.getInstance().sceneType.LOBBY);
                },  false);
            }
            else {
                SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.SGJ, SceneManager.getInstance().sceneType.LOBBY);
            };
        }
        else if (msgId == GlobalCfg.CLIENT_MSG_ID.GAME_MENU_CLICK_HOW_TO_PLAY) {
            CommonFun.getInstance().showRule("fruitMachine");
        }
        else if (msgId == "lobbyservice.kicktolobby") {
            SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.SGJ, SceneManager.getInstance().sceneType.LOBBY);
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
                errorMessage: `FruitMachine游戏中, 服务器下发的非正确消息中结构体异常, 内容为===>${JSON.stringify(webData)}`
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
                SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.SGJ, SceneManager.getInstance().sceneType.LOBBY);           
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

            this.lab_betAmount.string = amount;
            this.lab_totalWin.string = freePool.toFixed(1);
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

        let betStr = this.lab_autoBetCiShu.string;
        let isAuto = this.toggle_auto.isChecked;
        if (betStr != 'AUTO' && isAuto) {
            this.sendCallReq();
        }
        else {
            this.btn_spin.interactable = true;
            this.btn_spin.enableAutoGrayEffect = false;
        }
    },

    setUserDiamond: function(diamond) {
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
     

        for (let j = 0, len1 = this.node_fruitContentArr.length; j < len1; j++) {
            let children = this.node_fruitContentArr[j].children;
            for (let k = 0, len2 = children.length; k < len2; k++) {
                let src = children[k].getComponent('fruitItemCtrl');
                src.setCloseSkeletonDong(0);
            };
        };
        
        //设置转动的音效
        let isFast = this.toggle_fast.isChecked;
        let zhuangClipName = isFast ? 'sound/zhuang-fast' : 'sound/zhuang';
        this.playGameSound(zhuangClipName);

        //先扣除下注的金额
        if (this.gameResult.mianfeinum == 0) {
            let diamond = GlobalCfg.USER_DATAS.userDiamond - parseInt(this.lab_betAmount.string) * 100;
            let num = FloatCalculation.accDiv(diamond, 100);
            this.lab_jb.string = CommonFun.getInstance().numberToShow(num);
        };

        if (this.gameResult.rewardtype == 1) {
            this.lab_totalWin.string = 0;
            this.freeTotalWinNum = 0;
        };

        //次数递减
        let betStr = this.lab_autoBetCiShu.string;
        if (betStr != 'AUTO') {
            let betNum = parseInt(betStr) - 1;
            if (betNum == 0) {
                this.setBetCiShuAutoTips();
            }
            else {
                this.lab_autoBetCiShu.string = betNum; 
            };
        };

        this.dealSpinBtnEvent();
        this.startFruitAnim();
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
            CommonFun.getInstance().showRule("fruitMachine");
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
        else if (componentName == "btn_betMax") {
            this.dealbetBtnEvent("max");
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
        this.lab_betAmount.string = betAmount;

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
        this.btn_betMax.interactable = betJiaActive;
        this.btn_betMax.enableAutoGrayEffect = !betJiaActive;
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

        this.btn_betMax.interactable = false;
        this.btn_betMax.enableAutoGrayEffect = true;

        this.btn_betJia.interactable = false;
        this.btn_betJia.enableAutoGrayEffect = true;

        this.btn_betJian.interactable = false;
        this.btn_betJian.enableAutoGrayEffect = true;
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
        this.lab_totalWin.string = obj.num == 0 ? obj.num : obj.num.toFixed(1);
        cc.tween(obj)
        .to(
            time,
            {num: endedScore},
            {
                progress: (start, end, current, t) => {
                    if (this && this.lab_totalWin) {
                        if(freeCount > 0){
                            this.lab_totalWin.string = (end - start == 0) ? (endedScore == 0 ? endedScore : endedScore.toFixed(1)) : Number(start + (end - start) * t).toFixed(1); 
                        }
                        else{
                            this.lab_totalWin.string = (end - start == 0) ? 0 : Number(start + (end - start) * t).toFixed(1); 
                        }
                    };
                    return start + (end - start) * t;
                }
            }
        )
        .start();
    },

    startFruitAnim: function() {
        if (this.isRunningFruitAnim) {
            return;
        };
        this.isRunningFruitAnim = true;
        let isFast = this.toggle_fast.isChecked;
        this.kRate = isFast ? 0.45 : 1.1;
        let fruitContentTime = 0.1 * this.kRate;
        for (let i = 0, len = this.node_fruitContentArr.length; i < len; i++) {
            let children = this.node_fruitContentArr[i].children;
            for (let k = 0, lenk = children.length; k < lenk; k++) {
                let item = children[k];
                item.repeat = 0;
                item.index = k;
                item.shu = i;
                this.scheduleOnce(() => {
                    this.runFruitItemAnim(item, item.y, item.y + 165);
                }, fruitContentTime * i);
            };
        };
    },

    runFruitItemAnim: function(node, statrPositionY, endedPositionY) {
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
                if (endedPositionY >= 330) {
                    node.setPosition(cc.v2(0, -330));
                };
                self.checkAnimFinish();
                return;
            };
            if (endedPositionY >= 330) {
                let src = node.getComponent('fruitItemCtrl');
                if (repeat == 17 && index == 0) {
                    let fruitType = self.gameResult.cards[shu].cards[0];
                    src.setFruitSkeletonJing(fruitType);
                    node.fruitType = fruitType;
                }
                else if (repeat == 18 && index == 1) {
                    let fruitType = self.gameResult.cards[shu].cards[1];
                    src.setFruitSkeletonJing(fruitType);
                    node.fruitType = fruitType;
                }
                else if (repeat == 19 && index == 2) {
                    let fruitType = self.gameResult.cards[shu].cards[2];
                    src.setFruitSkeletonJing(fruitType);
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
                    src.setFruitSkeletonJing(num);
                    node.fruitType = num;
                };
                self.runFruitItemAnim(node, -330, -165);
            }
            else {
                self.runFruitItemAnim(node, endedPositionY, endedPositionY + 165);
            };
        })
        .start();
    },

    checkAnimFinish: function() {
        this.finishedFruitItemNum += 1;
        if (this.finishedFruitItemNum == 20) {
            this.finishedFruitItemNum = 0;
            this.showResultAnima();
        };
    },

    recoverySpinBtnEvent: function() {
        this.btn_spin.interactable = true;
        this.btn_spin.enableAutoGrayEffect = false;

        this.btn_auto.interactable = true;
        this.btn_auto.enableAutoGrayEffect = false;

        let betAmount = parseInt(this.lab_betAmount.string);
        if (betAmount != 10) {
            this.btn_betJian.interactable = true;
            this.btn_betJian.enableAutoGrayEffect = false;
        };

        if (betAmount != 2000) {
            this.btn_betJia.interactable = true;
            this.btn_betJia.enableAutoGrayEffect = false;

            this.btn_betMax.interactable = true;
            this.btn_betMax.enableAutoGrayEffect = false;
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
            let endedScore = this.gameResult.rewardtype == 2 ? this.gameResult.freePool/100 : totalMultiple * parseInt(this.lab_betAmount.string) / 10 + startScore;
            this.freeTotalWinNum = endedScore;
            let freeCount = this.gameResult.mianfeinum;
            this.runChangeTotalWinScore(startScore, endedScore, freeCount );

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
                let winClipName = isFast ? 'sound/win-fast' : 'sound/win';
                this.playGameSound(winClipName);
                this.showXianNun(totalMultiple/10, isFast);
            }
            else {
                this.isRunningFruitAnim = false; 
            };

            let startNextSpin = () => {
                // this.isRunningFruitAnim = false;
                if (this.isRunningFruitAnim) {
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

                    let amount = parseInt(this.lab_betAmount.string);
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
                    let isAuto = this.toggle_auto.isChecked;
                    if (isAuto) {
                        this.sendCallReq();
                    }
                    else {
                        this.recoverySpinBtnEvent();
                    };
                };
            };
            this.schedule(startNextSpin, 0.01); 
        };
    },

    curRoundAddCoinFinish(){
        if(cc.isValid(this)){
            let minLimit = this.betAmountArr[0] || 0;
            minLimit = parseInt(minLimit) * 100;
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

    showXianNun: function(totalMultiple, isFast) {
        if (this.gameResult) {
            let lineArr = [];
            for (let i = 0, len = this.gameResult.xiannum.length; i < len; i++) {
                let xiannum = this.gameResult.xiannum[i];
                let card = xiannum.card;        //中奖的牌
                let xiannumLen = xiannum.len;   //线的长度
                let xiannumNum = xiannum.num;   //线的数量
                if (xiannumLen >= 3) {
                    for (let j = 0; j < xiannumNum; j++) {
                    
                        let shu0 = this.node_fruitContentArr[0];
                        let shu0Node = shu0.children[i];

                        let shu1TypeArr = [];
                        let shu1 = this.node_fruitContentArr[1];
                        for (let j = 0; j < 3; j++) {
                            let fruitNode = shu1.children[j];
                            let fruitType = fruitNode.fruitType;
                            if (fruitType == card || fruitType == 10) {
                                shu1TypeArr.push(fruitNode);
                            };
                        };

                        let shu2TypeArr = [];
                        let shu2 = this.node_fruitContentArr[2];
                        for (let j = 0; j < 3; j++) {
                            let fruitNode = shu2.children[j];
                            let fruitType = fruitNode.fruitType;
                            if (fruitType == card || fruitType == 10) {
                                shu2TypeArr.push(fruitNode);
                            };
                        };


                        let shu3TypeArr = [];
                        if (xiannumLen >= 4) {
                            let shu3 = this.node_fruitContentArr[3];
                            for (let j = 0; j < 3; j++) {
                                let fruitNode = shu3.children[j];
                                let fruitType = fruitNode.fruitType;
                                if (fruitType == card || fruitType == 10) {
                                    shu3TypeArr.push(fruitNode);
                                };
                            };
                        };

                        let shu4TypeArr = [];
                        if (xiannumLen >= 5) {
                            let shu4 = this.node_fruitContentArr[4];
                            for (let j = 0; j < 3; j++) {
                                let fruitNode = shu4.children[j];
                                let fruitType = fruitNode.fruitType;
                                if (fruitType == card || fruitType == 10) {
                                    shu4TypeArr.push(fruitNode);
                                };
                            };
                        };

                     
                        for (let i = 0; i < shu1TypeArr.length; i++) {
                            let typeArr = [];
                            typeArr.push(shu0Node);
                            let shu1Node = shu1TypeArr[i];
                            typeArr.push(shu1Node);
                            for (let i2 = 0; i2 < shu2TypeArr.length; i2++) {
                                let typeArr2 = [].concat(typeArr);
                                let shu2Node = shu2TypeArr[i2];
                                typeArr2.push(shu2Node);
                                if (shu3TypeArr.length > 0) {
                                    for (let i3 = 0; i3 < shu3TypeArr.length; i3++) {
                                        let typeArr3 = [].concat(typeArr2);
                                        let shu3Node = shu3TypeArr[i3];
                                        typeArr3.push(shu3Node);
                                        if (shu4TypeArr.length > 0) {
                                            for (let i4 = 0; i4 < shu4TypeArr.length; i4++) {
                                                let typeArr4 = [].concat(typeArr3);
                                                let shu4Node = shu4TypeArr[i4];
                                                typeArr4.push(shu4Node);
                                                lineArr.push(typeArr4); 
                                            };
                                        }
                                        else {
                                            lineArr.push(typeArr3);  
                                        };
                                    };
                                }
                                else {
                                    lineArr.push(typeArr2); 
                                };
                            };
                        };
                    };
                };
            };


            if (totalMultiple >= 5) {
                let allTime = 0;
                for (let i = 0, len = lineArr.length; i < len; i++) {
                    let typeArr = lineArr[i];
                    let pointTime = isFast ? 0.1 : 0.2;
                    let lineTime = i == 0 ? 0 : (pointTime * 2.5 * (lineArr[i - 1].length - 1));
                    allTime += lineTime;
                    this.scheduleOnce(() => {
                        for (let k = 0, len1 = typeArr.length; k < len1 - 1; k++) {
                            let itemNode1 = typeArr[k];
                            let itemNode2 = typeArr[k + 1];
                            this.scheduleOnce(() => {
                                this.drawLine(itemNode1, itemNode2, pointTime);
                            }, pointTime * k);

                            if (k == len1 - 2) {
                                this.scheduleOnce(() => {
                                    this.isRunningFruitAnim = false;
                                }, pointTime * k + 3);
                            };
                        };
                    }, lineTime);
                };
            }
            else {
                for (let i = 0, len = lineArr.length; i < len; i++) {
                    let typeArr = lineArr[i];
                    for (let k = 0, len1 = typeArr.length; k < len1 - 1; k++) {
                        let itemNode1 = typeArr[k];
                        let itemNode2 = typeArr[k + 1];
                        let src1 = itemNode1.getComponent('fruitItemCtrl');
                        src1.setFruitSkeletonDong();
                        src1.setKuangSkeletonDong();
                        let src2 = itemNode2.getComponent('fruitItemCtrl');
                        src2.setFruitSkeletonDong();
                        src2.setKuangSkeletonDong();
                    };
                };
                this.scheduleOnce(() => {
                    this.isRunningFruitAnim = false;
                }, 1);
            };
        };
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
        let src1 = startNode.getComponent('fruitItemCtrl');
        src1.setFruitSkeletonDong();
        src1.setKuangSkeletonDong();

        this.scheduleOnce(() => {
            graphics.lineTo(localPos2.x, localPos2.y);
            graphics.stroke();

            let src2 = endNode.getComponent('fruitItemCtrl');
            src2.setFruitSkeletonDong();
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
        // if (GlobalCfg.IS_CLUB_MODE == 0 && GlobalCfg.USER_DATAS.isNotCharge == true && GlobalCfg.USER_DATAS.gamePattern == 0 && GlobalCfg.USER_DATAS.refuseUnpayHundred == true){   //未曾充值
        //     CommonFun.getInstance().showMsgBox("This feature is available only for premium players . Add cash now to become a premium player .", "SHOP", () => {
        //         if (this.paymentSwitch) {
        //             CommonFun.getInstance().showSmallAddCash()
        //         }
        //     }, false);
        //     return;
        // };

        let betAmount = parseInt(this.lab_betAmount.string) * 100;

        let freesItem = this.getFreesItem(betAmount);
        let freeCount = freesItem.freeCount;

        if (betAmount > GlobalCfg.USER_DATAS.userDiamond && freeCount <= 0) {
            this.recoverySpinBtnEvent();
            if (GlobalCfg.IS_CLUB_MODE == 1) { //代理模式不跳转商城
                CommonFun.getInstance().showMsgBox('Insufficient cash', "YES", () => {}, false);
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
       
        let proroID = 'gameservice.call';
        let message = 'CallReq';
        GameServerManager.send(proroID, message, {              
            amount: betAmount
        });
    },
});