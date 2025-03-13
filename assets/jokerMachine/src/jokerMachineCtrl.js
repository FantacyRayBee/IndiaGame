cc.Class({
    extends: cc.Component,

    properties: {
        btn_help: cc.Button,
        btn_helpclose: cc.Button,

        btn_back: cc.Button,
        btn_exInfo: cc.Button,
        btn_setting: cc.Button,
        btn_bet: cc.Button,
        btn_db: cc.Button,
        btn_spin: cc.Button,

        toggle_fast: cc.Toggle,
        toggle_auto: cc.Toggle,
        toggle_extra: cc.Toggle,

        node_iconItemContentArr: [cc.Node],
        node_skelItemContentArr: [cc.Node],
        node_multItemContent: cc.Node,
        lab_betAmount: cc.Label,
        lab_totalWin: cc.Label,
        lab_jb: cc.Label,
        lab_autoBetCiShu: cc.Label,

        node_help: cc.Node,
        node_setting: cc.Node,
        node_bet: cc.Node,
        node_extra: cc.Node,
        node_helpcontent: cc.Node,
        node_skel_extra: cc.Node,

        node_lines:[cc.Node],
        anim_extraInfo: cc.Animation,
        anim_root_set: cc.Animation,
        anim_root_bet: cc.Animation,
        anim_root_help: cc.Animation,

        skel_extra: cc.Node,
        skel_FG: sp.Skeleton,
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
        this.betAmountArr = ['0.5', '1', '2', '3', '5', '10', '20', '30', '40', '50', '80', '100', '200', '500', '1000'];
        this.betAmountArrIndex = 0;
        this.itemHeight = 138; // 每个slotitem的高度
        this.itemWidth = 160; // 每个multitem的宽度
        this.extraAnimIsComplete = true // extar动画是否播放完成
        this.paymentSwitch = false;

        this.frees = [];
        this.node_betInfos = {};
        this.isHaveMianFeiRecord = false;
        this.selectAutoBetStr = 'AUTO';
        this.selectAutoStatus = false;
        this.freeTotalWinNum = 0;           // 三叶草免费时，总获取金额
    },

    loadAudioClip: function(audioClipUrl = "", func = null, target = null) {
        if (!audioClipUrl || audioClipUrl.length == 0) {
            return;
        };
        
        CommonFun.getInstance().loadBundle('jokerMachine', (bundle) => {
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
        CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.SHOW_MAYA_GAME);

        GlobalCfg.ACT_SCENE_CTRL = this,
        this.jokerAudiosCtrl = this.node.getComponent("jokerAudiosCtrl");

        this.playGameMusic('sound/Mg_bgm');
        this.msgHandle = ClientNotify.register(GlobalCfg.MSG_TYPE.serverMsg, this.onEventMsg, this);
        this.customMsgHandle = ClientNotify.register(GlobalCfg.MSG_TYPE.clientMsg, this.onEventMsg, this);
        this.btn_back.node.on('click', this.debounce(this.componentClickCall, 1), this);
        this.btn_help.node.on('click', this.debounce(this.componentClickCall, 1), this);
        this.btn_helpclose.node.on('click', this.debounce(this.componentClickCall, 1), this);
        this.btn_setting.node.on('click', this.debounce(this.componentClickCall, 1), this);
        this.btn_spin.node.on('click', this.debounce(this.componentClickCall, 1), this);
        this.btn_db.node.on('click', this.debounce(this.componentClickCall, 1), this);
        this.btn_bet.node.on('click', this.debounce(this.componentClickCall, 1), this);
        this.btn_exInfo.node.on('click', this.debounce(this.componentClickCall, 1), this);
        
        this.toggle_fast.node.on('toggle', this.debounce(this.componentClickCall, 0), this);
        this.toggle_auto.node.on('toggle', this.debounce(this.componentClickCall, 0), this);
        this.toggle_extra.node.on('toggle', this.debounce(this.componentClickCall, 0), this);
        
        this.lab_betAmount.string = this.betAmountArr[0];
        //总共赢的金额
        this.lab_totalWin.string = 0;
        this.extraInfoIsOpen = false; //extra详情信息是否打开
        this.helprootIsOpen = false; //help详情信息是否打开
        this.setBetCiShuAutoTips();

    },

    setBetCiShuAutoTips: function() {
        this.toggle_auto.isChecked = false;
        this.toggle_auto.interactable = false;
        this.lab_autoBetCiShu.string = '50'; 
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
        this.initSlotData();
    },

    
    onDestroy: function() {
        GlobalCfg.ACT_SCENE_CTRL = null;
        ClientNotify.removeByHandle(GlobalCfg.MSG_TYPE.serverMsg, this.msgHandle);
        ClientNotify.removeByHandle(GlobalCfg.MSG_TYPE.clientMsg, this.customMsgHandle);
        CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.EXIT_JOKER_GAME);
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
            SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.MAYA, SceneManager.getInstance().sceneType.LOBBY);
        }
        else if (msgId == GlobalCfg.CLIENT_MSG_ID.GAME_MENU_CLICK_OUT_TO_LOBBY) {
            if (self.isRunningMayaAnim) {
                CommonFun.getInstance().showMsgBox(self.tipsLabel[0], "YES_NO", ()=>{
                    SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.MAYA, SceneManager.getInstance().sceneType.LOBBY);
                },  false);
            }
            else {
                SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.MAYA, SceneManager.getInstance().sceneType.LOBBY);
            };
        }
        else if (msgId == GlobalCfg.CLIENT_MSG_ID.GAME_MENU_CLICK_HOW_TO_PLAY) {
            CommonFun.getInstance().showRule("fruitMachine");
        }
        else if (msgId == "lobbyservice.kicktolobby") {
            SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.MAYA, SceneManager.getInstance().sceneType.LOBBY);
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
                SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.MAYA, SceneManager.getInstance().sceneType.LOBBY);           
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

    initSlotData: function() {
        for (let j = 0, len1 = this.node_iconItemContentArr.length; j < len1; j++) {
            let children = this.node_iconItemContentArr[j].children;
            for (let k = 0, len2 = children.length; k < len2; k++) {
                let src = children[k].getComponent('jokerIconItemCtrl');
                src.initIcon();
            };
        };

        for (let i = 0, len = 15; i < len; i++) {
            this.node_betInfos[i] = {};
            this.node_betInfos[i].node = this.node_bet.children[i];
            let button = this.node_bet.children[i].getComponent(cc.Button);
            this.node_betInfos[i].label = this.node_bet.children[i].getChildByName("num").getComponent(cc.Label);
            this.node_betInfos[i].label.string = this.betAmountArr[i];
            button.node.on('click', this.debounce(this.betClickCall, 1), this);
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
        this.hideLineState();
        
        //设置转动的音效
        let isFast = this.toggle_fast.isChecked;
        let zhuangClipName = isFast ? 'sound/zhuang-fast' : 'sound/zhuang';
        // this.playGameSound(zhuangClipName);

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
        this.startSlotsAnim();
    },

    componentClickCall: function (component) {
        let componentName = component.node.name;
        GlobalCfg.G_COMPONENTS.Audio.playButton();
        if (componentName == "btn_back") {
            CommonFun.getInstance().showGameMenu(false);
        }
        else if (componentName == "btn_help") {
            this.dealhelpBtnEvent();
        }
        else if (componentName == "btn_helpclose") {
            this.dealhelpBtnEvent();
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
        else if (componentName == "toggle_auto") {
            this.dealAutoBtnEvent();
        }
        else if (componentName == "toggle_ex") {
            this.dealExtraEvent();
        }
        else if (componentName == "btn_spin") {
            this.sendCallReq();
        }
    },

    betClickCall: function (component) {
        let label = component.node.getChildByName("num").getComponent(cc.Label);
        this.lab_betAmount.string = label.string;
        //TODO 切换下注的时候 需要刷新界面上的各种相关金额
        this.anim_root_bet.play("popCloseAnim");
        this.betrootIsOpen = false;
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
        else if (btnType == "info") {
            this.extraInfoIsOpen = !this.extraInfoIsOpen;
            this.anim_extraInfo.stop();
            if (this.extraInfoIsOpen) {
                this.anim_extraInfo.play("exopenAnim");
            }
            else {
                this.anim_extraInfo.play("excloseAnim");
            }
        }
        // let betAmount = this.betAmountArr[this.betAmountArrIndex];
        // this.lab_betAmount.string = betAmount;
    },

    dealhelpBtnEvent: function () {
        this.helprootIsOpen = !this.helprootIsOpen;
        if (this.helprootIsOpen) {
            this.anim_root_help.stop();
            this.anim_root_help.play("popAnim");
        }
        else {
            this.node_helpcontent.position = cc.v2(0, 0);
            this.anim_root_help.stop();
            this.anim_root_help.play("popCloseAnim");
        }
    },

    dealFastBtnEvent: function () {},

    //TODO
    testFGpop: function () {
        if (this.skel_FG.node.active == false) {
            this.skel_FG.node.active = true
            this.skel_FG.setAnimation(0, "Start", false);
            this.skel_FG.setCompleteListener((trackEntry, loopCount) => {
                this.skel_FG.setAnimation(0, "Loop", true);
                this.scheduleOnce(()=>{
                    this.skel_FG.setAnimation(0, "End", false);
                    this.skel_FG.setCompleteListener((trackEntry, loopCount) => {
                        this.skel_FG.node.active = false;
                    })
                }, 2);
            });
        }
    },

    dealAutoBetCiShuBtnEvent: function (ciShuType) {
        this.lab_autoBetCiShu.string = ciShuType;
        this.toggle_auto.isChecked = true;
        this.toggle_auto.interactable = true;
    },

    dealAutoBtnEvent: function () {
        if (this.toggle_auto.isChecked) {
            this.toggle_auto.isChecked = false;
        }
        else {
            this.dealAutoBetCiShuBtnEvent("50");
        }
    },
    dealExtraEvent: function () {
        if (this.toggle_extra.isChecked) {
            if (this.extraAnimIsComplete) {
                let tmp_skel_extar = cc.instantiate(this.skel_extra);
                tmp_skel_extar.setParent(this.node_skel_extra);
                tmp_skel_extar.active = true;
                this.extraAnimIsComplete = false;
                tmp_skel_extar.getComponent(sp.Skeleton).setCompleteListener((trackEntry, loopCount) => {
                    this.extraAnimIsComplete = true;
                    tmp_skel_extar.destroy();
                });
            }
            //给服务器发送打开了extra请求
        }
        else {
            //给服务器发送关闭了extra请求
        }
    },

    dealSpinBtnEvent: function () {
        this.btn_spin.interactable = false;
        this.btn_spin.enableAutoGrayEffect = true;

        this.toggle_auto.interactable = false;
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

    startSlotsAnim: function() {
        if (this.isRunningSlotAnim) {
            return;
        };
        this.isRunningSlotAnim = true;
        let isFast = this.toggle_fast.isChecked;
        // this.kRate = isFast ? 0.45 : 1.1;
        this.kRate = isFast ? 0.65 : 1.1;
        let slotContentTime = 0.1 * this.kRate;
        for (let i = 0, len = this.node_iconItemContentArr.length; i < len; i++) {
            let children = this.node_iconItemContentArr[i].children;
            let children2 = this.node_skelItemContentArr[i].children;
            for (let k = 0, lenk = children.length; k < lenk; k++) {
                let item = children[k];
                let skelItem = children2[k];
                item.repeat = 0;
                item.index = k;
                item.shu = i;
                this.scheduleOnce(() => {
                    this.runSlotsItemAnim(item, skelItem, item.y, item.y + this.itemHeight);
                }, slotContentTime * i);
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
        let isFast = this.toggle_fast.isChecked;
        let targetNum = isFast ? 8 : 20;

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
                if (endedPositionY >= this.itemHeight * 2) {
                    node.setPosition(cc.v2(0, -(this.itemHeight * 2)));
                };
                self.checkAnimFinish();
                return;
            };
            if (endedPositionY >= this.itemHeight * 2) {
                let multiple = self.gameResult.cards[3].cards[0];
                let src = node.getComponent('jokerMultItemCtrl');

                if (repeat == (targetNum - 3) && index == 0) {
                    src.setItemData(itemID);
                    node.itemID = itemID;
                }
                else if (repeat == (targetNum - 2) && index == 1) {
                    let itemID = self.gameResult.cards[shu].cards[1];
                    src.setItemData(itemID);
                    src2.setItemData(itemID);
                    node.itemID = itemID;
                }
                else if (repeat == (targetNum - 1) && index == 2) {
                    let itemID = self.gameResult.cards[shu].cards[2];
                    src.setItemData(itemID);
                    src2.setItemData(itemID);
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
                    src2.setItemData(num);
                    node.itemID = num;
                };
                self.runSlotsItemAnim(node, skelNode, -(this.itemHeight * 2), -this.itemHeight);
            }
            else {
                self.runSlotsItemAnim(node, skelNode, endedPositionY, endedPositionY + this.itemHeight);
            };
        })
        .start();
    },

    startMultAnim:function(){
        if (this.isRunningMultAnim) {
            return;
        };
        this.isRunningMultAnim = true;
        let isFast = this.toggle_fast.isChecked;
        // this.kRate = isFast ? 0.45 : 1.1;
        this.kRate = isFast ? 0.65 : 1.1;
        let slotContentTime = 0.1 * this.kRate;
        let children = this.node_multItemContent.children;
        for (let k = 0, len = children.length; k < len; k++) {
            let item = children[k];
            item.repeat = 0;
            item.index = k;
            this.scheduleOnce(() => {
                this.runMultItemAnim(item, item.x, item.x + this.itemWidth);
            }, slotContentTime * i);
        };
    },

    runMultItemAnim: function(node, statrPositionX, endedPositionX) {
        let self = this;
        node.repeat += 1;
        node.setPosition(cc.v2(0, statrPositionX));
        let repeat = node.repeat;
        let index = node.index;
        let shu = node.shu;
        let easeType = '';
        let runTime = 0.08 * self.kRate;
        let isFast = this.toggle_fast.isChecked;
        let targetNum = isFast ? 8 : 20;

        if (repeat == targetNum && !isFast) {
            easeType = 'backOut';
            runTime = 0.5 * self.kRate;
        };
        cc.tween(node)
        .to(
            runTime, 
            {position: cc.v2(0, endedPositionX)}, 
            {easing: easeType}
        )
        .call(() => {
            if (repeat == targetNum) {
                if (endedPositionX >= this.itemWidth * 2) {
                    node.setPosition(cc.v2(0, -(this.itemWidth * 2)));
                };
                self.checkAnimFinish();
                return;
            };
            if (endedPositionX >= this.itemWidth * 2) {
                let src = node.getComponent('jokerIconItemCtrl');
                if (repeat == (targetNum - 3) && index == 0) {
                    let itemID = self.gameResult.cards[shu].cards[0];
                    src.setItemData(itemID);
                    node.itemID = itemID;
                }
                else if (repeat == (targetNum - 2) && index == 1) {
                    let itemID = self.gameResult.cards[shu].cards[1];
                    src.setItemData(itemID);
                    node.itemID = itemID;
                }
                else if (repeat == (targetNum - 1) && index == 2) {
                    let itemID = self.gameResult.cards[shu].cards[2];
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
                self.runSlotsItemAnim(node, -(this.itemWidth * 2), -this.itemWidth);
            }
            else {
                self.runSlotsItemAnim(node, endedPositionX, endedPositionX + this.itemWidth);
            };
        })
        .start();
    },

    checkAnimFinish: function() {
        this.finishedSlotItemNum += 1;
        //所有轴停下来之后再执行结果动画
        if (this.finishedSlotItemNum == 12) {
            this.finishedSlotItemNum = 0;
            this.showResultAnima();
        };
    },

    

    recoverySpinBtnEvent: function() {
        this.btn_spin.interactable = true;
        this.btn_spin.enableAutoGrayEffect = false;

        this.toggle_auto.interactable = true;

        let betAmount = parseInt(this.lab_betAmount.string);
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
            let bet = parseInt(this.lab_betAmount.string)
            let endedScore = this.gameResult.rewardtype == 2 ? this.gameResult.freePool/100 : totalMultiple *  bet / 10 + startScore;
            this.freeTotalWinNum = endedScore;
            let freeCount = this.gameResult.mianfeinum;
            let isNormal = this.gameResult.rewardtype == 1;
            let bigWinLevel = this.getBigWinLevel(isNormal, bet, endedScore / bet);
            // if (bigWinLevel > 0) {
            //     CommonFun.getInstance().loadBundle('mayaMachine', (bundle) => {
            //         bundle.load("prefab/mayaRewardTips", cc.Prefab, (err, prefab) => {
            //             if (!err) {
            //                 let scene = cc.director.getScene();
            //                 let mayaRewardTipsNode = cc.instantiate(prefab);
            //                 let mayaRewardTipsCtrl = mayaRewardTipsNode.getComponent("mayaRewardTipsCtrl");
            //                 scene.addChild(mayaRewardTipsNode);
            //                 mayaRewardTipsCtrl.showRewardTips(endedScore, bigWinLevel, isNormal)
            //                 .then(() => {
            //                     this.showSpinResult(totalMultiple);
            //                     this.runChangeTotalWinScore(startScore, endedScore, freeCount);
            //                 });
            //             };
            //         });
            //     }, (err) => {
            //         LoggerUtil.getInstance().error(`加载mayaMachine-Bundle异常: ${JSON.stringify(err)}`);
            //     });
            // }
            // else {
                this.showSpinResult(totalMultiple);
                this.runChangeTotalWinScore(startScore, endedScore, freeCount);
            // };

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
            let winClipName = isFast ? 'sound/win-fast' : 'sound/win';
            // this.playGameSound(winClipName);
            this.showXianNum(totalMultiple / 10, isFast);
        }
        else {
            this.isRunningSlotAnim = false; 
        };

        let startNextSpin = () => {
            // this.isRunningSlotAnim = false;
            LoggerUtil.getInstance().log('caojun this.isRunningSlotAnim: ' + this.isRunningSlotAnim);
            if (this.isRunningSlotAnim) {
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

    showXianNum: function(totalMultiple, isFast) {
        if (this.gameResult) {
            for (let i = 0, len = this.gameResult.xiannum.length; i < len; i++) {
                let xiannum = this.gameResult.xiannum[i];
                let card = xiannum.card;                //中奖的牌
                let xianID = xiannum.xianID;         //中奖的线id 1-5
                let xianMul = xiannum.multiple;      //中奖的倍数

                this.node_lines[xianID - 1].active = true;
                this.setItemIsAnimByLineID(xianID);
            };

            this.setItemState()
            this.scheduleOnce(() => {
                this.isRunningSlotAnim = false;
            }, 1);
        };
    },

    //通过线ID 找到需要播放动画的Item
    setItemIsAnimByLineID: function(lineID) {
        if (lineID == 1) {
            this.node_iconItemContentArr[0].children[0].isAnim = true;
            this.node_iconItemContentArr[1].children[0].isAnim = true;
            this.node_iconItemContentArr[2].children[0].isAnim = true;
        }
        if (lineID == 2) {
            this.node_iconItemContentArr[0].children[1].isAnim = true;
            this.node_iconItemContentArr[1].children[1].isAnim = true;
            this.node_iconItemContentArr[2].children[1].isAnim = true;
        }
        if (lineID == 3) {
            this.node_iconItemContentArr[0].children[2].isAnim = true;
            this.node_iconItemContentArr[1].children[2].isAnim = true;
            this.node_iconItemContentArr[2].children[2].isAnim = true;
        }
        if (lineID == 4) {
            this.node_iconItemContentArr[0].children[0].isAnim = true;
            this.node_iconItemContentArr[1].children[1].isAnim = true;
            this.node_iconItemContentArr[2].children[2].isAnim = true;
        }
        if (lineID == 5) {
            this.node_iconItemContentArr[0].children[2].isAnim = true;
            this.node_iconItemContentArr[1].children[1].isAnim = true;
            this.node_iconItemContentArr[2].children[0].isAnim = true;
        }
    },

    setItemState: function() {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (this.node_iconItemContentArr[i].children[j].isAnim) {
                    let item = this.node_iconItemContentArr[i].children[j].getComponent('jokerIconItemCtrl');
                    item.playAnimation();
                    let skelItem = this.node_skelItemContentArr[i].children[j].getComponent('jokerSkelItemCtrl');
                    skelItem.playAnimation();
                }
                else {
                    let item = this.node_iconItemContentArr[i].children[j].getComponent('jokerIconItemCtrl');
                    item.setGrayColor();
                }
            }
        }
    },

    hideLineState: function() {
        for (let index = 0; index < 5; index++) {
            this.node_lines[index].active = false;
        }
        for (let j = 0, len1 = this.node_iconItemContentArr.length; j < len1; j++) {
            let children = this.node_iconItemContentArr[j].children;
            let children2 = this.node_skelItemContentArr[j].children;
            for (let k = 0, len2 = children.length; k < len2; k++) {
                children[k].isAnim = false;
                let src = children[k].getComponent('jokerIconItemCtrl');
                src.stopAnimation();
                let src2 = children2[k].getComponent('jokerSkelItemCtrl');
                src2.stopAnimation(0);
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
        //playnow模式下 首充玩家 弹VIP弹框
        if (GlobalCfg.USER_DATAS.recharged == 0 && GlobalCfg.GAME_ENTER_ISFREE == false) {
            CommonFun.getInstance().showVipRechargeToast();
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

        let betAmount = parseInt(this.lab_betAmount.string) * 100;

        let freesItem = this.getFreesItem(betAmount);
        let freeCount = freesItem.freeCount;

        LoggerUtil.getInstance().error("GlobalCfg.USER_DATAS.userDiamond == " ,GlobalCfg.USER_DATAS.userDiamond); 
        if (betAmount > GlobalCfg.USER_DATAS.userDiamond && freeCount <= 0) {
            this.recoverySpinBtnEvent();
            CommonFun.getInstance().showMsgBox(this.tipsLabel[5], "SHOP", () => {
                if (this.paymentSwitch) {
                    CommonFun.getInstance().showSmallAddCash()
                }
            }, false);
            return;
        };
       
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

    loadGameAssets: function (gameBundleName, func, target) {
        if (gameBundleName) {
            CommonFun.getInstance().loadBundle(gameBundleName, (bundle) => {
                func && func(bundle, target);
            }, (err) => {
                LoggerUtil.getInstance().error(err);
            });
        }
    },

    loadSkeletonData: function(skeletonName, func = null, target = null) {
        if (!skeletonName || skeletonName.length == 0) {
            return;
        };
        let self = this;
        let skeletonUrl = "anim/spine/";
        this.loadGameAssets("jokerMachine", (bundle, target) => {
            bundle.load(skeletonUrl + skeletonName + "/" + skeletonName, sp.SkeletonData, (err, skeletonData) => {
                if (!err) {
                    func && func(skeletonData, target);
                }
                else{
                    LoggerUtil.getInstance().error(err);
                }
            });
        }, target);
    },
});