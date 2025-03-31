cc.Class({
    extends: cc.Component,

    properties: {
        btn_help: cc.Button,
        btn_helpclose: cc.Button,

        btn_back: cc.Button,
        btn_exInfo: cc.Button,
        btn_setting: cc.Button,
        btn_sound: cc.Button,
        btn_rule: cc.Button,
        btn_rule_close: cc.Button,
        btn_bet: cc.Button,
        btn_db: cc.Button,
        btn_spin: cc.Button,
        btn_spin2: cc.Button,
        btn_jpSpinArr: [cc.Button],
        btn_bigwin_end: cc.Button,
        btn_jpPop_end: cc.Button,
        btn_autoSpinSet: cc.Button,

        toggle_fast: cc.Toggle,
        toggle_auto: cc.Toggle,
        toggle_extra: cc.Toggle,

        node_iconItemContentArr: [cc.Node],
        node_skelItemContentArr: [cc.Node],
        node_jpItemContent: cc.Node,
        node_multItemContent: cc.Node,
        node_skelRespin: [cc.Node],
        node_skelNearwin: [cc.Node],
        node_skel2wait1: [cc.Node],

        lab_betAmount: cc.Label,
        lab_totalWin: cc.Label,
        lab_jb: cc.Label,
        lab_autoBetCiShu: cc.Label,
        lab_reward: cc.Label,
        lab_winMul: cc.Label,
        lab_bigwin: cc.Label,
        lab_jpPopWin: cc.Label,
        lab_FGpopJpLab: [cc.Label],
        lab_skelRespinBet: [cc.Label],

        node_help: cc.Node,
        node_setting: cc.Node,
        node_bet: cc.Node,
        node_extra: cc.Node,
        node_helpcontent: cc.Node,
        node_skel_extra: cc.Node,
        node_reward_bg: cc.Node,
        node_winMulStartPos: cc.Node,
        node_winMulEndPos: cc.Node,
        node_winJpEndPos: cc.Node,
        node_jackpotArr: [cc.Node],
        node_bigwin_pop: cc.Node,
        node_jp_pop: cc.Node,
        node_top_extra: cc.Node,
        node_winMult: cc.Node,
        node_rule: cc.Node,
        anim_rotate: cc.Node,
        node_entry: cc.Node,
        node_FG: cc.Node,
        
        node_lines:[cc.Node],
        anim_extraInfo: cc.Animation,
        anim_root_set: cc.Animation,
        anim_root_bet: cc.Animation,
        anim_root_help: cc.Animation,

        skel_extra: cc.Node,
        skel_FG: sp.Skeleton,
        skel_bigWin_bg: sp.Skeleton,
        skel_bigWin_character: sp.Skeleton,
        skel_bigWin_title: sp.Skeleton,
        skel_winMul_kuang: sp.Skeleton,
        skel_bottomRespin: sp.Skeleton,
        skel_multArr: [sp.Skeleton],
        skel_kuang: sp.Skeleton,

        betSpriteFrames: [cc.SpriteFrame],
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
        this.finishedJpRunItemNum = 0; //已经滚动停止的jpItem数量
        this.isRunningSlotAnim = false; 
        this.isRunningMultAnim = false; 
        this.isRunningJpAnim = false; 
        //投注额度数组
        this.betAmountArr = [1, 2, 3, 5, 10, 20, 30, 40, 50, 80, 100, 200, 500, 800, 1000];
        this.jackpotArr = [5, 10, 15, 30, 50, 200, 1000]; //分别对应的是minor 5-10倍 major 15-30倍 grand 50-200倍 joker 1000倍
        this.multArr = [1, 2, 3, 5, 10, 15];
        this.autoSpinTypeNumArr = [50, 100, 800, 3000];
        this.bigWinSkelNameStartArr = ["BigWin_Start", "MegaWin_Start", "SuperWin_Start"];
        this.bigWinSkelNameEndArr = ["BigWin_End", "MegaWin_End", "SuperWin_End"];
        this.autoSpinData = [true, false, false, false];
        this.betAmountArrIndex = 0;
        this.itemHeight = 138; // 每个slotitem的高度
        this.itemWidth = 162; // 每个multitem的宽度
        this.JpItemWidth = 411; // 每个multitem的宽度
        this.extraAnimIsComplete = true // extar动画是否播放完成
        this.paymentSwitch = false;
        this.isExtra = false; //是否加倍
        this.popCoinIsRun = false; // 弹窗金币是否在滚动中
        this.frees = [];
        this.node_betInfos = {};
        this.isHaveMianFeiRecord = false;
        this.selectAutoBetStr = 'AUTO';
        this.selectAutoStatus = false;
        this.curNeedBuyJpObj = null;        // 当前需要购买的jp轴对象
        this.isHopeSlotRunAnim = false;     // 是否出现第三轴期待动画

        this.coinRunAnimTween = null;
        this.fakeSlotRunTween = {};
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
        CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.SHOW_MAYA_GAME);

        GlobalCfg.ACT_SCENE_CTRL = this,
        this.jokerAudiosCtrl = this.node.getComponent("jokerAudiosCtrl");

        this.msgHandle = ClientNotify.register(GlobalCfg.MSG_TYPE.serverMsg, this.onEventMsg, this);
        this.customMsgHandle = ClientNotify.register(GlobalCfg.MSG_TYPE.clientMsg, this.onEventMsg, this);
        this.btn_back.node.on('click', this.debounce(this.componentClickCall, 1), this);
        this.btn_help.node.on('click', this.debounce(this.componentClickCall, 1), this);
        this.btn_helpclose.node.on('click', this.debounce(this.componentClickCall, 1), this);
        this.btn_setting.node.on('click', this.debounce(this.componentClickCall, 1), this);
        this.btn_spin.node.on('click', this.debounce(this.componentClickCall, 1), this);
        this.btn_spin2.node.on('click', this.debounce(this.componentClickCall, 1), this);
        this.btn_jpSpinArr[0].node.on('click', this.debounce(this.jpSlotClickCall, 1), this);
        this.btn_jpSpinArr[1].node.on('click', this.debounce(this.jpSlotClickCall, 1), this);
        this.btn_jpSpinArr[2].node.on('click', this.debounce(this.jpSlotClickCall, 1), this);

        this.btn_bigwin_end.node.on('click', this.debounce(this.componentClickCall, 1), this);
        this.btn_jpPop_end.node.on('click', this.debounce(this.componentClickCall, 1), this);
        
        this.btn_db.node.on('click', this.debounce(this.componentClickCall, 1), this);
        this.btn_bet.node.on('click', this.debounce(this.componentClickCall, 1), this);
        this.btn_exInfo.node.on('click', this.debounce(this.componentClickCall, 1), this);
        this.btn_sound.node.on('click', this.debounce(this.componentClickCall, 1), this);
        this.btn_rule.node.on('click', this.debounce(this.componentClickCall, 1), this);
        this.btn_rule_close.node.on('click', this.debounce(this.componentClickCall, 1), this);
        this.btn_autoSpinSet.node.on('click', this.debounce(this.componentClickCall, 1), this);
        
        this.toggle_fast.node.on('toggle', this.debounce(this.componentClickCall, 0), this);
        this.toggle_auto.node.on('toggle', this.debounce(this.componentClickCall, 0), this);
        this.toggle_extra.node.on('toggle', this.debounce(this.componentClickCall, 0), this);
        this.betIndex = 0;
        this.curBetAmount = this.betAmountArr[this.betIndex];
        this.lab_betAmount.string = "bet " + this.betAmountArr[this.betIndex];
        //总共赢的金额
        this.lab_totalWin.string = 0;
        this.extraInfoIsOpen = false; //extra详情信息是否打开
        this.helprootIsOpen = false; //help详情信息是否打开
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

    playEntryAnim: function() {
        let self = this;
        this.node_entry.active = true;

        let skel_entry = this.node_entry.getChildByName('rw').getComponent(sp.Skeleton);
        this.playGameSound('Play_Ready');
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
        for (let j = 0, len1 = this.node_iconItemContentArr.length; j < len1; j++) {
            let children = this.node_iconItemContentArr[j].children;
            for (let k = 0, len2 = children.length; k < len2; k++) {
                let src = children[k].getComponent('jokerIconItemCtrl');
                src.initIcon();
            };
        };
        let randomIndex1 = Math.floor(Math.random() * 6); // 0-5
        let randomIndex2;
        do {
            randomIndex2 = Math.floor(Math.random() * 6); // 0-5
        } while (randomIndex2 === randomIndex1);
        let randomIndex3;
        do {
            randomIndex3 = Math.floor(Math.random() * 6); // 0-5
        } while (randomIndex3 === randomIndex1 || randomIndex3 === randomIndex2);

        let randomIndexArr = [0, randomIndex1, randomIndex2, randomIndex3];
        let multChildrens = this.node_multItemContent.children;
        for (let j = 0, len1 = multChildrens.length; j < len1; j++) {
            let src = multChildrens[j].getComponent('jokerMultItemCtrl');
            src.initIcon(this.multArr[randomIndexArr[j]]);
        };

        let jpChildrens = this.node_jpItemContent.children;
        for (let j = 0, len1 = jpChildrens.length; j < len1; j++) {
            let src = jpChildrens[j].getComponent('jokerJPItemCtrl');
            src.initIcon();
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
        this.setJackPotNum();
        this.startAutoRotateAnim();
    },

    //设置jackpot奖池
    setJackPotNum: function(ShowAnim = false) {
        if (ShowAnim) {
            // this.lab_jackpotNum.node.runAction(cc.sequence(cc.scaleTo(0.3, 1.2), cc.scaleTo(0.3, 1)));
            for (let i = 0, len = 4; i < len; i++) {
                this.playJackpotAnimation(i, 'Start', false);
            }
        }
        let bet = this.betAmountArr[this.betIndex];
        this.node_jackpotArr[3].getChildByName("lb").getComponent(cc.Label).string = CommonFun.getInstance().numberToShow2(this.jackpotArr[6] * bet);
        this.node_jackpotArr[2].getChildByName("lb").getComponent(cc.Label).string = 
        CommonFun.getInstance().numberToShow2(this.jackpotArr[4] * bet) + "-" + CommonFun.getInstance().numberToShow2(this.jackpotArr[5] * bet);
        this.node_jackpotArr[1].getChildByName("lb").getComponent(cc.Label).string = 
        CommonFun.getInstance().numberToShow2(this.jackpotArr[2] * bet) + "-" + CommonFun.getInstance().numberToShow2(this.jackpotArr[3] * bet);
        this.node_jackpotArr[0].getChildByName("lb").getComponent(cc.Label).string = 
        CommonFun.getInstance().numberToShow2(this.jackpotArr[0] * bet) + "-" + CommonFun.getInstance().numberToShow2(this.jackpotArr[1] * bet);

        this.lab_FGpopJpLab[0].string = this.jackpotArr[0] * bet + "-" + this.jackpotArr[1] * bet;
        this.lab_FGpopJpLab[1].string = this.jackpotArr[2] * bet + "-" + this.jackpotArr[3] * bet;
        this.lab_FGpopJpLab[2].string = this.jackpotArr[4] * bet + "-" + this.jackpotArr[5] * bet;
        this.lab_FGpopJpLab[3].string = this.jackpotArr[6] * bet;
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

    playJackpotAnimation: function(index, animName, isLoop) {
        let nameArr = ["MINOR_","MAJOR_","GRAND_","JOKER_"]
        let skel_jp = this.node_jackpotArr[index].getChildByName("skel").getComponent(sp.Skeleton)
        let skelName = nameArr[index] + animName;
        LoggerUtil.getInstance().log(`caojun playJackpotAnimation index = ${index} skelName = ${skelName}`);
        skel_jp.node.active = true;
        skel_jp.setAnimation(0, skelName, isLoop);
        if (!isLoop) {
            skel_jp.setCompleteListener((trackEntry, loopCount) => {
                skel_jp.node.active = false;
            })
        }
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
        this.gameResult = {};
        this.gameResult.userinfo = notify.userinfo;
        this.gameResult.xiannum = notify.xiannum;
        this.gameResult.cards = notify.cards;
        this.gameResult.buy = notify.buy;
        this.gameResult.restartCards = notify.restartCards;

        this.unscheduleAllCallbacks();
        this.startAutoRotateAnim();
        this.scatterIndex = 1;
        if (this.curNeedBuyJpObj == null) //如果这次spin是JP购买的，则不清盘面数据
        {
            this.setKuangAnim(1); //播放底框待机动画
            this.hideSlotState();
            let userDiamond = (parseFloat(this.lab_jb.string) * 100 - parseFloat(this.curBetAmount) * 100).toFixed(0);
            this.setUserDiamond(userDiamond);
        }
        else{
            let curSpinUse = this.curNeedBuyJpObj.getRespinBet(this.jpBuyIndex); //获取当前JP购买的spin使用金额
            let userDiamond = ((parseFloat(this.lab_jb.string) * 100) - parseFloat(curSpinUse) * 100).toFixed(0);
            this.setUserDiamond(userDiamond);
            this.showSkelJpNearWin(this.curNeedBuyJpObj.index);
            this.playSlotItemJpWowAnimation(this.jpBuyIndex);
        }
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
        this.isHopeSlotRunAnim = this.getIsHope();
        this.dealSpinBtnEvent();
        if (this.curNeedBuyJpObj == null) { //如果这次spin是JP购买的，则不用转上面的倍数轴
            this.startMultAnim();
        }
        this.startSlotsAnim();
    },

    componentClickCall: function (component) {
        let componentName = component.node.name;
        GlobalCfg.G_COMPONENTS.Audio.playButton();
        if (componentName == "btn_back") {
            this.dealbetBtnEvent("db");
            ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, {msgCode: GlobalCfg.CLIENT_MSG_ID.GAME_MENU_CLICK_OUT_TO_LOBBY, msgData: {}});
        }
        else if (componentName == "btn_help") {
            this.dealhelpBtnEvent();
        }
        else if (componentName == "btn_helpclose") {
            this.dealhelpBtnEvent();
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
        else if (componentName == "toggle_auto") {
            this.dealAutoBtnEvent();
        }
        else if (componentName == "toggle_ex") {
            this.dealExtraEvent();
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
        this.setJackPotNum(true);

        if (this.curNeedBuyJpObj) {
            this.curNeedBuyJpObj.setData();
        }

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
        else if (btnType == "info") {
            this.extraInfoIsOpen = !this.extraInfoIsOpen;
            this.anim_extraInfo.stop();
            if (this.extraInfoIsOpen) {
                this.anim_extraInfo.play("exopenAnim");
                this.toggle_extra.interactable = true;
            }
            else {
                this.anim_extraInfo.play("excloseAnim");
                this.toggle_extra.interactable = false;
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

    //判断该次spin是否需要播放期待动画
    getIsHope: function () {
        let hopeNum = 0;
        //判断前两轴是否全是9 说明需要播放期待动画了
        for (let i = 0; i < 2; i++) {
            let cards = this.gameResult.cards[i].cards;
            for (let index = 0; index < cards.length; index++) {
                if (cards[index] == 9) {
                    hopeNum++;
                }
            }
        }
        if (hopeNum == 6) {
            let successful = (Math.random() * 9) + 1; //1-10
            if(successful > 5) //新需求：如果满足播放期待动画，则50%概率播放
                return true;
            if(successful <= 5)
                return false;
        }
        return false;
    },

    //进入JP模式
    showFGpop: function () {
        let self = this;
        this.setJackPotNum()
        this.node_FG.active = true
        this.playGameMusic("JP_Declare")
        this.skel_FG.setAnimation(0, "Start", false);
        this.skel_FG.setCompleteListener((trackEntry, loopCount) => {
            self.skel_FG.setAnimation(0, "Loop", true);
            self.scheduleOnce(()=>{
                self.lab_FGpopJpLab[0].string = '';
                self.lab_FGpopJpLab[1].string = '';
                self.lab_FGpopJpLab[2].string = '';
                self.lab_FGpopJpLab[3].string = '';
                self.skel_FG.setAnimation(0, "End", false);
                self.skel_FG.setCompleteListener((trackEntry, loopCount) => {
                    self.node_FG.active = false
                    self.playGameMusic("Bonus_bgm");
                    //开启JP滚轴动画
                    self.startJpSlotAnim();
                })
            }, 2);
        });
    },

    startJpSlotAnim: function () {
        this.node_jpItemContent.active = true;
        let kRate = 1.1;
        let slotContentTime = 0.1 * kRate;
        let children = this.node_jpItemContent.children;
        this.playGameSound("JP_Reel")
        for (let k = 0, lenk = children.length; k < lenk; k++) {
            let item = children[k];
            item.repeat = 0;
            item.index = k;
            this.scheduleOnce(() => {
                this.runJpItemAnim(item, item.y, item.y + this.JpItemWidth);
            }, slotContentTime);
        };
    },
    
    runJpItemAnim: function(node, statrPositionY, endedPositionY) {
        let self = this;
        node.repeat += 1;
        let kRate = 1.1;
        node.setPosition(cc.v2(0, statrPositionY));
        let repeat = node.repeat;
        let index = node.index;
        let runTime = 0.08 * kRate;
        let targetNum = 20;

        cc.tween(node)
        .to(
            runTime, 
            {position: cc.v2(0, endedPositionY)}, 
        )
        .call(() => {
            if (repeat == targetNum) {
                if (endedPositionY >= this.JpItemWidth * 2) {
                    node.setPosition(cc.v2(0, -(this.JpItemWidth * 2)));
                };
                self.checkJpRunAnimFinish();
                return;
            };
            if (endedPositionY >= this.JpItemWidth * 2) {
                let src = node.getComponent('jokerJPItemCtrl');
                if (repeat == (targetNum - 2) && index == 0) {
                    let itemID = self.gameResult.cards[3].cards[1];
                    let bet = parseFloat(this.curBetAmount)
                    let coin = self.gameResult.cards[3].cards[2] * bet;
                    src.setItemData(itemID, coin);
                    node.itemID = itemID;
                }
                else {
                    let num = Math.floor(Math.random() * 4);
                    src.setItemData(num, 0);
                    node.itemID = num;
                };
                self.runJpItemAnim(node, -(this.JpItemWidth * 2), -this.JpItemWidth);
            }
            else {
                self.runJpItemAnim(node, endedPositionY, endedPositionY + this.JpItemWidth);
            };
        })
        .start();
    },

    showJpSlotResult: function () {
        if (!this.toggle_auto.isChecked) { //如果不是自动spin，这个阶段就可以解开spin按钮了
            this.isRunningSlotAnim = false;
            this.isRunningMultAnim = false;
        }
        let node = this.node_jpItemContent.children[0];
        let bet = parseFloat(this.curBetAmount);
        let src = node.getComponent('jokerJPItemCtrl');
        let curSpinmult = this.gameResult.cards[3].cards[0]; //当前spin中的倍数
        let jpIndex = this.gameResult.cards[3].cards[1];
        let self = this;
        this.playJackpotAnimation(jpIndex, 'Loop', true);
        src.playAnimation();

        this.scheduleOnce(() => {
            if (curSpinmult > 1) {
                self.node_reward_bg.active = false;
                let curWinJpNum = self.gameResult.cards[3].cards[2] * bet
                let winNumFinal = curWinJpNum * curSpinmult
                self.winMultDropAnim(src.lab_coin, curSpinmult, winNumFinal, self.node_winJpEndPos, ()=>{
                    self.showJpResultPop(curSpinmult)
                    self.node_jackpotArr[jpIndex].getChildByName("skel").getComponent(sp.Skeleton).node.active = false;
                });
            }
            else {
                self.showJpResultPop(curSpinmult)
                self.node_jackpotArr[jpIndex].getChildByName("skel").getComponent(sp.Skeleton).node.active = false;
            }
        }, 0.85);
    },

    //顶部倍数掉落动画
    winMultDropAnim: function(label, curSpinmult, finalScore, endPos, callback){
        this.node_winMult.active = true;
        this.node_winMult.getComponent(cc.Animation).play("popAnim");
        this.node_winMult.position = this.node_winMulStartPos.position;
        this.skel_winMul_kuang.node.active = true;
        this.lab_winMul.string = "X" + curSpinmult;
        this.playGameSound("Small_Win_Multiply");
        this.skel_winMul_kuang.setAnimation(0, "2", false);
        this.skel_winMul_kuang.setCompleteListener(()=>{
            this.skel_winMul_kuang.node.active = false;
        })

        this.scheduleOnce(()=>{
            this.skel_multArr[0].node.active = true;
            let bet = parseFloat(this.curBetAmount);
            // 判断是否为整数
            const isInteger = (value) => Math.floor(value) === value;
            this.playGameSound("Fly");
            //顶部倍数播放大小闪动动画
            let src = this.node_multItemContent.children[2].getComponent('jokerMultItemCtrl');
            src.playAnimation();
            cc.tween(this.node_winMult)
            .to(0.2, {position: cc.v2(0, this.node_winMult.position.y + 20) }) // 往上抬一下
            .to(0.6, {position: cc.v2(0, endPos.y)}, )
            .call(() => {
                this.skel_multArr[0].node.active = false;
                this.skel_multArr[1].node.active = true;
                this.lab_winMul.string = '';
                this.playGameSound("JP_Win_Multiply");
                this.skel_multArr[1].setAnimation(0, "over", false);
                this.skel_multArr[1].setCompleteListener(()=>{
                    this.skel_multArr[1].node.active = false;
                    this.node_winMult.active = false;
                })
                let labAnimation = label.node.getComponent(cc.Animation)
                if (labAnimation) {
                    labAnimation.play('FontBig');
                }
                label.string = isInteger(finalScore) ? Math.floor(finalScore).toString() : finalScore.toFixed(1);
                this.setTotalWin(label.string)
                this.bigWinLevel = this.getBigWinLevel(finalScore / bet);
                this.scheduleOnce(()=>{
                    if (callback) {
                        callback(finalScore)
                    }
                    this.node_reward_bg.active = false;
                }, 1.2);
            })
            .start();
        }, 0.6);
    },

    setExtraChanged: function () {
        let mult = 1;
        if (this.isExtra) {
            mult = 1.5;
        }
        for (let i = 0, len = 15; i < len; i++) {
            this.node_betInfos[i].label.string = this.betAmountArr[i] * mult;
        }
        this.curBetAmount = this.betAmountArr[this.betIndex] * mult
        this.lab_betAmount.string = 'bet ' + this.curBetAmount;
    },

    dealAutoBetCiShuBtnEvent: function (ciShuType) {
        this.lab_autoBetCiShu.string = ciShuType;
        this.toggle_auto.isChecked = true;
        this.toggle_auto.interactable = true;
        this.anim_rotate.active = false;
    },

    dealAutoBtnEvent: function () {
        if (this.toggle_auto.isChecked) {
            this.dealAutoBetCiShuBtnEvent("50");
            this.sendCallReq(); //新需求：点击自动下注的时候 直接开始spin
        }
        if (!this.toggle_auto.isChecked) {
            this.toggle_auto.interactable = this.btn_spin.interactable;
        }
    },
    dealExtraEvent: function () {
        if (this.toggle_extra.isChecked) {
            if (this.extraAnimIsComplete) {
                this.toggle_extra.interactable = false;
                let tmp_skel_extar = cc.instantiate(this.skel_extra);
                tmp_skel_extar.setParent(this.node_skel_extra);
                tmp_skel_extar.active = true;
                this.extraAnimIsComplete = false;
                this.btn_bet.node.getChildByName("Background").getComponent(cc.Sprite).spriteFrame = this.betSpriteFrames[1];
                this.playGameSound("Extra_Bet_Show");
                tmp_skel_extar.getComponent(sp.Skeleton).setCompleteListener((trackEntry, loopCount) => {
                    this.playGameSound("Extra_Bet_Light");
                    this.extraAnimIsComplete = true;
                    this.toggle_extra.interactable = true;
                    this.node_top_extra.active = true;
                    tmp_skel_extar.destroy();
                });
            }
            this.isExtra = true;
        }
        else {
            this.isExtra = false;
            this.node_top_extra.active = false;
            this.btn_bet.node.getChildByName("Background").getComponent(cc.Sprite).spriteFrame = this.betSpriteFrames[0];
        }
        this.setExtraChanged();
    },

    dealSpinBtnEvent: function () {
        this.btn_spin.interactable = false;
        this.btn_spin2.interactable = false;
        this.btn_spin.enableAutoGrayEffect = true;
        if (!this.toggle_auto.isChecked) { //如果不是自动spin 此时不让开启自动spin
            this.toggle_auto.interactable = false;
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
        if (this.curNeedBuyJpObj) //说明这次spin是购买的中JP单轴转动，需要特殊处理
        {
            this.initSlotPos(this.curNeedBuyJpObj.index);
            let index = this.curNeedBuyJpObj.index;
            let children = this.node_iconItemContentArr[index].children;
            let children2 = this.node_skelItemContentArr[index].children;
            for (let k = 0, lenk = children.length; k < lenk; k++) {
                let item = children[k];
                let skelItem = children2[k];
                item.repeat = 0;
                item.index = k;
                item.shu = index;
                this.scheduleOnce(() => {
                    this.runSlotsItemAnim(item, skelItem, item.y, item.y + this.itemHeight);
                }, slotContentTime);
            };
            return;
        }
        for (let i = 0, len = this.node_iconItemContentArr.length; i < len; i++) {
            let children = this.node_iconItemContentArr[i].children;
            let children2 = this.node_skelItemContentArr[i].children;
            for (let k = 0, lenk = children.length; k < lenk; k++) {
                let item = children[k];
                let skelItem = children2[k];
                item.repeat = 0;
                item.index = k;
                item.shu = i;
                if (isFast) {
                    // this.scheduleOnce(() => {
                        this.runSlotsItemAnim(item, skelItem, item.y, item.y + this.itemHeight);
                    // }, slotContentTime);
                }
                else{
                    this.scheduleOnce(() => {
                        this.runSlotsItemAnim(item, skelItem, item.y, item.y + this.itemHeight);
                    }, (slotContentTime * i * 3));
                }

            };
        };
    },

    checkPlayJpSound: function(index) {
        let card9 = 0;
        let cards = this.gameResult.cards[index].cards;
        for (let index = 0; index < cards.length; index++) {
            if (cards[index] == 9) {
                card9++;
            }
        }
        if (card9 == 3) {
            let clipName = 'Scatter_Show' + this.scatterIndex;
            this.playGameSound(clipName);
            this.scatterIndex++;
        }
    },

    // 初始化位置
    initSlotPos: function(index ,isFroceHide = false) {
        if (this.curNeedBuyJpObj == null && isFroceHide == false) {
            return;
        }
        let children = this.node_iconItemContentArr[index].children
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
    
    runSlotsItemAnim: function(node, skelNode, statrPositionY, endedPositionY, curTargetNum = 8) {
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

        if (this.isHopeSlotRunAnim && shu == 2) { //如果需要出现期待动画 且为第三轴的时候需要特殊处理
            targetNum = targetNum * 8; //需要多转8圈
        }

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
                let src = node.getComponent('jokerIconItemCtrl');
                let src2 = skelNode.getComponent('jokerSkelItemCtrl');
                if (repeat == (targetNum - 3) && index == 0) {
                    let itemID = this.gameResult.cards[shu].cards[0];
                    src.setItemData(itemID);
                    src2.setItemData(itemID);
                    node.itemID = itemID;
                }
                else if (repeat == (targetNum - 2) && index == 1) {
                    let itemID = this.gameResult.cards[shu].cards[1];
                    src.setItemData(itemID);
                    src2.setItemData(itemID);
                    node.itemID = itemID;
                }
                else if (repeat == (targetNum - 1) && index == 2) {
                    let itemID = this.gameResult.cards[shu].cards[2];
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
                self.runSlotsItemAnim(node, skelNode, -(this.itemHeight * 2), -this.itemHeight, curTargetNum);
            }
            else {
                self.runSlotsItemAnim(node, skelNode, endedPositionY, endedPositionY + this.itemHeight, curTargetNum);
            };
        })
        .start();
    },

    //假转动 出JP中奖的时候
    runSlotsItemAnimFake: function (node, index,  statrPositionY, endedPositionY) {
        if (this.fakeSlotRunTween[index]) {
            this.fakeSlotRunTween[index].stop();
            this.fakeSlotRunTween[index] = null; // 清空引用
        }
        let self = this;
        node.setPosition(cc.v2(0, statrPositionY));
        let runTime = 0.08 * self.kRate * 3;
        this.fakeSlotRunTween[index] = cc.tween(node)
        .to(
            runTime, 
            {position: cc.v2(0, endedPositionY)}, 
        )
        .call(() => {
            if (endedPositionY >= this.itemHeight * 2) {
                let src = node.getComponent('jokerIconItemCtrl');
                let num = Math.floor(Math.random() * 9 + 1);
                src.setItemData(num);
                node.itemID = num;
                self.runSlotsItemAnimFake(node, index,  -(this.itemHeight * 2), -this.itemHeight);
            }
            else {
                self.runSlotsItemAnimFake(node, index, endedPositionY, endedPositionY + this.itemHeight);
            };
        })
        .start();
    },

    getIndexByMultiple:function(multiple){
        let index = 0;
        for (let i = 0; i < this.multArr.length; i++) {
            if (this.multArr[i] == multiple) {
                index = i;
                break;
            }
        }
        return index;
    },

    startMultAnim:function(){
        if (this.isRunningMultAnim) {
            return;
        };
        this.isRunningMultAnim = true;
        this.kRate = 0.55;
        let slotContentTime = 0.1 * this.kRate;
        let children = this.node_multItemContent.children;
        // 在动画开始前，预先生成两个不重复的随机数（0-5）
        let multiple = this.gameResult.cards[3].cards[0]; //取得第4个位置上的元素（[0,0,0], 第一个元素代表这次转到的倍数）
        let randomIndex1 = this.getIndexByMultiple(multiple);
        let randomIndex2;
        do {
            randomIndex2 = Math.floor(Math.random() * 6); // 0-5
        } while (randomIndex2 === randomIndex1);
        // 3. 生成第三个数（0-5，且不等于前两个数）
        let randomIndex3;
        do {
            randomIndex3 = Math.floor(Math.random() * 6); // 0-5
        } while (randomIndex3 === randomIndex1 || randomIndex3 === randomIndex2);
        this.gameResult.cards[3].cards[3] = this.multArr[randomIndex2];
        this.gameResult.cards[3].cards[4] = this.multArr[randomIndex3];

        LoggerUtil.getInstance().log("caojun multiple: " + multiple + ", randomIndex2: " + randomIndex2 + ", randomIndex3: " + randomIndex3);

        for (let k = 0, len = children.length; k < len; k++) {
            let item = children[k];
            item.repeat = 0;
            item.index = k;
            this.scheduleOnce(() => {
                this.runMultItemAnim(item, item.x, item.x + this.itemWidth);
            }, slotContentTime);
        };
    },

    runMultItemAnim: function(node, statrPositionX, endedPositionX) {
        let self = this;
        node.repeat += 1;
        node.setPosition(cc.v2(statrPositionX, 0));
        let repeat = node.repeat;
        let index = node.index;
        let easeType = '';
        let runTime = 0.08 * self.kRate;
        let isFast = this.toggle_fast.isChecked;
        // let targetNum = isFast ? 4 : 8;
        let targetNum = 8;

        if (repeat == targetNum && !isFast) {
            easeType = 'backOut';
            runTime = 0.5 * self.kRate;
        };

        cc.tween(node)
        .to(
            runTime, 
            {position: cc.v2(endedPositionX, 0)}, 
            {easing: easeType}
        )
        .call(() => {
            if (repeat == targetNum) {
                if (endedPositionX >= self.itemWidth * 2) {
                    node.setPosition(cc.v2(-(self.itemWidth * 2), 0));
                };
                return;
            };
            if (endedPositionX >= self.itemWidth * 2) {
                let src = node.getComponent('jokerMultItemCtrl');
                let xiannumArr = self.gameResult.xiannum;
                let isNeedShowAnim = false; //这次spin是否赢钱了
                for (let i = 0, len = xiannumArr.length; i < len; i++) {
                    let xiannum = xiannumArr[i];
                    let xiannumLen = xiannum.len;
                    if (xiannumLen >= 3) {
                        isNeedShowAnim = true;
                        break;
                    };
                };
                isNeedShowAnim = self.gameResult.cards[3].cards[2] > 0;
                if (repeat == (targetNum - 3) && index == 3) {
                    LoggerUtil.getInstance().log('caojun index = 3 self.gameResult.cards[3].cards[3] == ', self.gameResult.cards[3].cards[3]);
                    src.setItemData(self.gameResult.cards[3].cards[3], false);
                }
                else if (repeat == (targetNum - 2) && index == 2) { //中间位置上的为本次中奖的倍数
                    src.setItemData(self.gameResult.cards[3].cards[0], isNeedShowAnim);
                }
                else if (repeat == (targetNum - 1) && index == 1) {
                    LoggerUtil.getInstance().log('caojun index = 1 self.gameResult.cards[3].cards[4] == ', self.gameResult.cards[3].cards[4]);
                    src.setItemData(self.gameResult.cards[3].cards[4], false);
                }
                else {
                    let index = Math.floor(Math.random() * 4 + 2); // （2-5）假轴滚动的时候，随机的倍数尽可能偏大一点，让玩家看着更容易中奖
                    src.setItemData(index, false);
                };
                self.runMultItemAnim(node, -(self.itemWidth * 2), -self.itemWidth);
            }
            else {
                self.runMultItemAnim(node, endedPositionX, endedPositionX + self.itemWidth);
            };
        })
        .start();
    },

    checkAnimFinish: function() {
        this.finishedSlotItemNum += 1;
        let isFast = this.toggle_fast.isChecked;
        //所有轴停下来之后再执行结果动画
        if (this.curNeedBuyJpObj) { //如果是付费抽单轴，则只需要判断一个轴是否停下来
            if (this.finishedSlotItemNum == 4) {
                this.finishedSlotItemNum = 0;
                this.curNeedBuyJpObj = null;
                this.checkIsWinJackpot()
            }
        }
        else if (this.is2Wait1 == true) { //如果是2等1
            if (this.finishedSlotItemNum == 4) {
                this.finishedSlotItemNum = 0;
                this.is2Wait1 = false;
                this.hideSkel();
                this.stopFadeInOut();
                //延迟一会儿再进入结算 过度比较平缓
                this.scheduleOnce(() => {
                    this.checkIsWinJackpot()
                }, 1);
            }
        }
        else{
            //如果需要出现JP期待动画且前两轴都停下来的时候，需要打开第三轴的期待动画
            if (this.finishedSlotItemNum == 4) {
                if (this.isHopeSlotRunAnim && isFast) { //如果进入了JP期待动画，且为快速模式，则不用播放第一轴的JP出现动画
                    return;
                }
                this.checkPlayJpSound(0);
            }
            else if (this.finishedSlotItemNum == 8) {
                this.checkPlayJpSound(1);
                if (this.isHopeSlotRunAnim) {
                    this.showSkelJpNearWin(2);
                    this.playSlotItemJpWowAnimation(2);
                    this.setKuangAnim(4);
                }
            }
            else if (this.finishedSlotItemNum == 12) {
                this.checkPlayJpSound(2);
                this.finishedSlotItemNum = 0;
                this.checkIsWinJackpot()
            }
        }
    },

    
    checkJpRunAnimFinish: function() {
        this.finishedJpRunItemNum += 1;
        //所有轴停下来之后再执行结果动画
        if (this.finishedJpRunItemNum == 4) {
            this.finishedJpRunItemNum = 0;
            this.showJpSlotResult();
            this.playGameSound("JP_Show_Win");
            this.playGameMusic("Mg_bgm");
        };
    },

    recoverySpinBtnEvent: function() {
        this.btn_spin.interactable = true;
        this.btn_spin2.interactable = true;
        this.btn_spin.enableAutoGrayEffect = false;
        this.toggle_auto.interactable = true;
    },

    //停轴之后检查本次是否中了JP
    checkIsWinJackpot: function() {
        this.hideSkel();
        this.isHopeSlotRunAnim = false;
        if (this.gameResult) {
            let isWinJp = this.gameResult.cards[3].cards[2] > 0 ? true : false; //是否中奖jp
            if(isWinJp){
                this.playGameSound("Small_Win08")
                this.playSlotItemJpWinAnimation(()=>{
                    this.showFGpop()
                });
            }
            else{
                //如果没中JP，先判断是否有10倍价格购买一次的机会 否则直接显示本次spin结果
                if (this.gameResult.buy == true) {
                    this.showJpBuyState();
                    this.setKuangAnim(4);
                }else{
                    this.showResultAnima();
                }
            }
        }
    },

    //显示购买JP机会
    showJpBuyState: function() {
        this.toggle_auto.isChecked = false;
        //先找到是哪一条轴需要购买
        this.jpBuyIndex = -1;
        for (let i = 0; i < this.gameResult.cards.length; i++) {
            let same9 = 0; //记录相同9的数量
            for (let j = 0; j < this.gameResult.cards[i].cards.length; j++) {
                if (this.gameResult.cards[i].cards[j] == 9) same9++;
            }
            if (same9 != 3) { //不是3个9，说明这条轴没有中奖JP，需要购买
                this.jpBuyIndex = i;
                break;
            }
        }
        this.playSlotItemJpStartAnimation(this.jpBuyIndex);
        //延迟 再进入JP购买模式 不然太突兀
        this.scheduleOnce(() => {
            this.btn_jpSpinArr[this.jpBuyIndex].node.active = true;
            let children = this.node_iconItemContentArr[this.jpBuyIndex].children;
            for (let k = 0, lenk = children.length; k < lenk; k++) {
                let item = children[k];
                this.scheduleOnce(() => {
                    //购买轴开始假转
                    this.runSlotsItemAnimFake(item, k, item.y, item.y + this.itemHeight);
                }, 0.1 * this.kRate);
            };
            this.playGameSound('ExtraBuy_Show')
            this.curNeedBuyJpObj = this.setSkelRespinByIndex(this.jpBuyIndex);
            this.curNeedBuyJpObj.show();

            this.isRunningSlotAnim = false; 
            this.isRunningMultAnim = false; 
            this.recoverySpinBtnEvent();
        }, 1);
    },

    //播放购买前的另两轴的JP开始动画
    playSlotItemJpStartAnimation: function(index) {
        let skelName1 = '';
        let skelName2 = '';
        for (let i = 0; i < 3; i++) {
            if (i != index) {
                for (let j = 0; j < 3; j++) {
                    if (i == 0) { //最左边的需要将脸转向右边
                        skelName1 = "Right_Stare_Start";
                        skelName2 = "Right_Stare_Loop1";
                    }
                    if (i == 1) { //中间需要判断 期待的那一轴在左还是右
                        if (index == 0) { //因为默认朝左，所以如果期待的是最左边，则不需要改变朝向
                            skelName1 = "";
                            skelName2 = "Left_Stare_Loop1";
                        } else if (index == 2) { //向右转
                            skelName1 = "Right_Stare_Start";
                            skelName2 = "Right_Stare_Loop1";
                        }
                    }
                    if (i == 2) { //因为默认朝左，所以如果期待的是最左边，则不需要改变朝向
                        skelName1 = "";
                        skelName2 = "Left_Stare_Loop1";
                    }
                    let skelItem = this.node_skelItemContentArr[i].children[j].getComponent('jokerSkelItemCtrl');
                    skelItem.playJpStartAnimation(skelName1, skelName2);
                }
            }
        }
    },
    //播放另外两轴JP的待机动画
    playSlotItemJpIdelAnimation: function() {
        let skelName = 'Left_Stare_Loop1';
        for (let i = 0; i < 3; i++) {
            if (i != this.jpBuyIndex) {
                for (let j = 0; j < 3; j++) {
                    let skelItem = this.node_skelItemContentArr[i].children[j].getComponent('jokerSkelItemCtrl');
                    skelItem.playJpWowAnimation(skelName);
                }
            }
        }
    },

    //播放另外两轴JP的期待动画
    playSlotItemJpWowAnimation: function(index) {
        let skelName = '';
        for (let i = 0; i < 3; i++) {
            if (i != index) {
                for (let j = 0; j < 3; j++) {
                    if (i == 0) {
                        skelName = "Right_Stare_Loop2";
                    }
                    if (i == 1) {
                        if (index == 0) {
                            skelName = "Left_Stare_Loop2";
                        } else if (index == 2) {
                            skelName = "Right_Stare_Loop2";
                        }
                    }
                    if (i == 2) {
                        skelName = "Left_Stare_Loop2";
                    }
                    let skelItem = this.node_skelItemContentArr[i].children[j].getComponent('jokerSkelItemCtrl');
                    skelItem.playJpWowAnimation(skelName);
                }
            }
        }
    },

    //播放三轴的中奖庆祝动画
    playSlotItemJpWinAnimation: function(callback) {
        let skelName1 = 'Right_Turn_Left';
        let skelName2 = 'Win';
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                let skelItem = this.node_skelItemContentArr[i].children[j].getComponent('jokerSkelItemCtrl');
                skelItem.playJpWinAnimation(skelName1, skelName2);
            }
        }
        this.scheduleOnce(() => {
            if (callback) {
                callback()
            }
            this.hideSlotState();
        }, 2.8);
    },

    showSkel2wait1: function(index) {
        this.node_skel2wait1[index].active = true;
    },

    showSkelJpNearWin: function(index) {
        this.playGameSound("JP_NearWin");
        this.node_skelNearwin[index].active = true;
    },

    hideSkel: function() {
        for (let i = 0, len = this.node_skelNearwin.length; i < len; i++) {
            this.node_skelNearwin[i].active = false;
            this.node_skel2wait1[i].active = false;
        }
        this.skel_bottomRespin.setAnimation(0, 'End', false);
        this.skel_bottomRespin.setCompleteListener(()=>{
            this.skel_bottomRespin.node.active = false;
        });
    },

    //设置单条轴的respin状态
    setSkelRespinByIndex: function(index) {
        let obj = {};
        obj.this = this.node_skelRespin[index]
        obj.index = index;
        obj.skel = obj.this.getComponent(sp.Skeleton);
        obj.self = this;

        obj.show = function() {
            obj.this.active = true;
            obj.skel.setAnimation(0, "Respin_Buy_Start", false);
            obj.self.dealbetBtnEvent('bet');
            obj.skel.setCompleteListener(function() {
                // 移除监听器，避免重复触发
                obj.skel.setCompleteListener(null);
                obj.skel.setAnimation(0, "Respin_Buy_Loop", true);
                //打开下注界面
            })
            let bet = parseFloat(obj.self.curBetAmount)
            let curSpinmult = obj.self.gameResult.cards[3].cards[0]
            obj.self.lab_skelRespinBet[obj.index].string = bet * 10 * curSpinmult
        }

        obj.hide = function(){
            obj.skel.clearTrack(0);
            obj.this.active = false;
        }

        obj.setData = function() {
            let bet = parseFloat(obj.self.curBetAmount)
            let curSpinmult = obj.self.gameResult.cards[3].cards[0]
            obj.self.lab_skelRespinBet[obj.index].string = bet * 10 * curSpinmult
        }

        obj.getRespinBet = function() {
            let bet = parseFloat(obj.self.curBetAmount)
            let curSpinmult = obj.self.gameResult.cards[3].cards[0]
            return bet * 10 * curSpinmult
        }

        return obj;
    },

    showResultAnima: function() {
        if (this.gameResult) {
            //先判断是否是二等一的情况
            if (this.gameResult.restartCards.length == 0) {
                //没有二等一的情况，直接显示结算界面
                this.showSettlementResult();
            } 
            else {
                this.start2wait1();
            }
        };
    },

    //结算
    showSettlementResult: function() {
        let totalMultiple = 0;
        for (let i = 0, len = this.gameResult.xiannum.length; i < len; i++) {
            let multiple = this.gameResult.xiannum[i].multiple;
            // let num = this.gameResult.xiannum[i].num;
            let num = 1; //该机台比较特殊 只会中一次线
            totalMultiple += (multiple * num);
        };
        let bet = parseFloat(this.curBetAmount)
        let curSpinmult = this.gameResult.cards[3].cards[0]
        let endedScore = totalMultiple *  bet / 10
        this.checkAutoSpinSet(totalMultiple);
        this.showSpinResult();
        if (endedScore > 0) {
            this.lab_reward.string = '';
            let time = endedScore < 1 ? 0.3 : 0.8; //低于1分，因为有小数点的滚动所以时间要短一些
            this.node_reward_bg.active = true;
            this.runChangeTotalWinScore(this.lab_reward, 0, endedScore, time, ()=>{
                if (curSpinmult > 1) {
                    let finalScore = endedScore * curSpinmult;
                    this.winMultDropAnim(this.lab_reward, curSpinmult, finalScore,  this.node_winMulEndPos, (winNumFinal)=>{
                        if (this.bigWinLevel > 0) { //如果有big弹窗 则需要在弹窗之后再结算
                            this.showBigWinTips(winNumFinal);
                        }
                        else{
                            this.startNextSpin();
                        }
                    });
                }else{
                    this.startNextSpin();
                }
            })
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

    //开始2等1
    start2wait1: function () {
        this.is2Wait1 = true;
        let sameZhou1 = this.gameResult.cards[0].cards[0]
        let sameZhou2 = this.gameResult.cards[1].cards[0]
        let sameZhou3 = this.gameResult.cards[2].cards[0]
        if (sameZhou1 == sameZhou2) {
            this.startFadeInOut(0);
            this.startFadeInOut(1);
            this.col2wait1 = 2;
        }
        else if (sameZhou1 == sameZhou3) {
            this.startFadeInOut(0);
            this.startFadeInOut(2);
            this.col2wait1 = 1;
        }
        else if (sameZhou2 == sameZhou3) {
            this.startFadeInOut(1);
            this.startFadeInOut(2);
            this.col2wait1 = 0;
        }
        this.playGameSound('Respin_Declare');
        this.setKuangAnim(3);
        this.skel_bottomRespin.node.active = true;
        this.skel_bottomRespin.setAnimation(0, 'Start', false);
        this.skel_bottomRespin.setCompleteListener(()=>{
            this.skel_bottomRespin.setCompleteListener(null);
            this.skel_bottomRespin.setAnimation(0, 'Loop', true);
            this.scheduleOnce(() => {
                let kRate = 0.65;
                this.scheduleOnce(() => {
                    this.showSkel2wait1(this.col2wait1);
                }, 0.1 * kRate);
                this.gameResult.cards[this.col2wait1].cards[0] = this.gameResult.restartCards[this.col2wait1].cards[0];
                this.gameResult.cards[this.col2wait1].cards[1] = this.gameResult.restartCards[this.col2wait1].cards[1];
                this.gameResult.cards[this.col2wait1].cards[2] = this.gameResult.restartCards[this.col2wait1].cards[2];
                this.gameResult.restartCards = [];
                this.isRunningSlotAnim = true;
                let slotContentTime = 0.1 * kRate;
                let children = this.node_iconItemContentArr[this.col2wait1].children;
                let children2 = this.node_skelItemContentArr[this.col2wait1].children;
                this.playGameSound('JP_Reel');
                for (let k = 0, lenk = children.length; k < lenk; k++) {
                    let item = children[k];
                    let skelItem = children2[k];
                    item.repeat = 0;
                    item.index = k;
                    item.shu = this.col2wait1;
                    this.scheduleOnce(() => {
                        this.runSlotsItemAnim(item, skelItem, item.y, item.y + this.itemHeight, 4 * 12);
                    }, slotContentTime);
                };
            }, 1);
        });
    },

    setTotalWin: function(finalScore) {
        LoggerUtil.getInstance().error('caojun setTotalWin')
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
        this.playBigWinAnim(this.bigWinSkelNameStartArr[this.curBigWinAnimIndex], false)
    },

    playBigWinAnim: function(skelName, isChange, callback) {
        let self = this;
        if(isChange){ //如果是切换动画 只需要切换title的动画
            self.skel_bigWin_title.setAnimation(0, skelName, false);
        }
        else{
            self.skel_bigWin_character.setAnimation(0, skelName, false);
            self.skel_bigWin_bg.setAnimation(0, skelName, false);
            self.skel_bigWin_title.setAnimation(0, skelName, false);
        }
        if (callback) { //结束bigwin播放结束音效
            LoggerUtil.getInstance().log('caojun bigwin播放结束音效');
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
        if (this.curBigWinAnimIndex == this.bigWinLevel - 1) {
            this.playBigWinAnim(this.bigWinSkelNameEndArr[this.curBigWinAnimIndex], false, ()=>{
                self.node_bigwin_pop.active = false;
                self.btn_bigwin_end.interactable = true;
                self.stopNumScroll = false;
                self.startNextSpin();
            });
            return;
        }
        this.curBigWinAnimIndex++;
        if (this.curBigWinAnimIndex == 1) {
            this.playGameSound('Big_Win_Change');
        }
        else if (this.curBigWinAnimIndex == 2) {
            this.playGameSound('Big_Win_Change_2');
        }
        this.playBigWinAnim(this.bigWinSkelNameStartArr[this.curBigWinAnimIndex], true)
    },

    dealBigWinEndEvent: function() {
        if (this.popCoinIsRun) { //如果是播放中 则停止动画 直接显示结果
            this.popCoinIsRun = false;
            this.stopNumScroll = true; //停止金币滚动
            this.btn_bigwin_end.interactable = false;

            this.skel_bigWin_character.setCompleteListener(null); // 清除之前的回调
            //如果中断 直接播放bigwinlevel-1的动画
            this.playBigWinAnim(this.bigWinSkelNameEndArr[this.bigWinLevel - 1], false, ()=>{
                this.node_bigwin_pop.active = false;
                this.btn_bigwin_end.interactable = true;
                this.stopNumScroll = false;
                this.startNextSpin();
            });
        }
    },

    
    //jp中奖结果弹窗
    showJpResultPop:function(curSpinmult){
        this.node_jp_pop.active = true;
        this.btn_jpPop_end.interactable = true; // 初始状态设为可点击
        let winIndex = this.gameResult.cards[3].cards[1] //jp中奖索引 0:minor 1:major 2:grand 3:joker
        let nameArrr = ["MINOR", "MAJOR", "GRAND", "JOKER"];
        let skel_bg = this.node_jp_pop.getChildByName("bg").getComponent(sp.Skeleton);
        let skel_character = this.node_jp_pop.getChildByName("character").getComponent(sp.Skeleton);
        let skel_title = this.node_jp_pop.getChildByName("title").getComponent(sp.Skeleton);
        let bet = parseFloat(this.curBetAmount);
        let endedScore = this.gameResult.cards[3].cards[2] * bet * curSpinmult
        this.playGameMusic('JP_Compliment');
        this.runChangeTotalWinScore(this.lab_jpPopWin, 0, endedScore, 4.5)
        let self = this;
        skel_bg.setSkin(nameArrr[winIndex]);
        skel_title.setSkin(nameArrr[winIndex]);
        skel_bg.setAnimation(0, "Start", false);
        skel_character.setAnimation(0, "FG_Compliment", false);
        skel_title.setAnimation(0, "Start", false);
        this.scheduleOnce(() => {
            if (self.btn_jpPop_end.interactable == false) { //说明已经提前点了关闭按钮
                return;
            }
            self.btn_jpPop_end.interactable = false; //播放关闭动画过程中不允许点击
            self.scheduleOnce(()=>{
                self.playGameMusic('Mg_bgm');
            }, 2.3);
            skel_bg.setAnimation(0, "Start2", false);
            skel_character.setAnimation(0, "FG_Compliment2", false);
            skel_title.setAnimation(0, "Start2", false);
            skel_title.setCompleteListener(()=>{
                self.node_jp_pop.active = false;
                self.btn_jpPop_end.interactable = true;
                self.recoverySpinBtnEvent(); //恢复spin按钮事件
                if (self.toggle_auto.isChecked) {
                    self.isRunningSlotAnim = false;
                    self.isRunningMultAnim = false;
                }
                self.startNextSpin(); //自动模式，播放完动画后自动开始下一局
            })
        }, 4.5); //3秒之后播放关闭动画
    },

    dealJpPopEndEvent: function() {
        if (this.popCoinIsRun) { //如果是播放中 则停止动画 直接显示结果
            this.isRunningSlotAnim = false;
            this.isRunningMultAnim = false;
            this.popCoinIsRun = false;
            this.btn_jpPop_end.interactable = false;
            this.stopNumScroll = true;
            
            let self = this;
            let skel_bg = this.node_jp_pop.getChildByName("bg").getComponent(sp.Skeleton);
            let skel_character = this.node_jp_pop.getChildByName("character").getComponent(sp.Skeleton);
            let skel_title = this.node_jp_pop.getChildByName("title").getComponent(sp.Skeleton);

            this.playGameMusic('Big_Win_End');
            this.scheduleOnce(()=>{
                self.playGameMusic('Mg_bgm');
                self.startNextSpin(); //自动模式，播放完动画后自动开始下一局
            }, 2.3);

            skel_bg.setAnimation(0, "Start2", false);
            skel_character.setAnimation(0, "FG_Compliment2", false);
            skel_title.setAnimation(0, "Start2", false);
            
            skel_title.setCompleteListener(() => {
                self.node_jp_pop.active = false;
                self.btn_jpPop_end.interactable = true;
                self.recoverySpinBtnEvent();
                self.stopNumScroll = false;
            })
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
            this.isRunningMultAnim = false; 
        };
    },

    startNextSpin:function () {
        this.toggle_auto.interactable = true;
        let StartNextSpin = () => {
            if (this.isRunningSlotAnim || this.isRunningMultAnim) {
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

    setKuangAnim: function (index) {
        this.skel_kuang.setAnimation(0, 'anim' + index, true);
    },

    // 二轴都转出同一元素，获得第三轴重新spin时播放的闪动期待动画
    startFadeInOut (index) {
        for (let i = 0; i < 3; i++) {
            if(i == index)  {
                for (let j = 0; j < 3; j++) {
                    let item = this.node_iconItemContentArr[i].children[j].getComponent('jokerIconItemCtrl');
                    item.startFadeInOut();
                }
            }
        }
    },

    stopFadeInOut () {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                let item = this.node_iconItemContentArr[i].children[j].getComponent('jokerIconItemCtrl');
                item.stopFadeInOut();
            }
        }
    },

    showXianNum: function() {
        if (this.gameResult) {
            for (let i = 0, len = this.gameResult.xiannum.length; i < len; i++) {
                let xiannum = this.gameResult.xiannum[i];
                let xianID = xiannum.xianID;         //中奖的线id 1-5
                this.node_lines[xianID - 1].active = true;
                this.setItemIsAnimByLineID(xianID);
            };
            this.setItemState()
            this.scheduleOnce(() => {
                this.isRunningSlotAnim = false;
                this.isRunningMultAnim = false;
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
        let soundIndex = this.gameResult.xiannum.length;
        soundIndex = soundIndex > 3 ? 3 : soundIndex;
        this.playGameSound("Small_Win0" + soundIndex);
        this.setKuangAnim(2);
    },

    hideSlotState: function() {
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
        this.node_reward_bg.active = false;
        this.lab_reward.string = '';
        this.lab_winMul.string = '';
        this.node_winMult.active = false;
        this.node_winMult.position = this.node_winMulStartPos.position;
        this.node_jpItemContent.active = false;
        for (let index = 0; index < 3; index++) {
            let children = this.node_jpItemContent.children[index];
            let src = children.getComponent('jokerJPItemCtrl');
            src.stopAnimation();
        }
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

    jpSlotClickCall: function() {
        this.btn_jpSpinArr[this.curNeedBuyJpObj.index].node.active = false;
        this.btn_spin2.interactable = false; //防止多次点击屏幕 发送两次spin请求
        if (this.curNeedBuyJpObj) {
            this.curNeedBuyJpObj.hide();
        }
        for (let index = 0; index < 4; index++) {
            if (this.fakeSlotRunTween[index]) {
                this.fakeSlotRunTween[index].stop();
                this.fakeSlotRunTween[index] = null; // 清空引用
            }
        }
        this.sendCallReq(10);
    },

    sendCallReq: function(jpMult = 1) {
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

        if (jpMult == 1 && this.curNeedBuyJpObj) { //说明是JP购买模式 但是选择了普通spin 也需要清掉当次购买JP的数据
            for (let index = 0; index < 4; index++) {
                if (this.fakeSlotRunTween[index]) {
                    this.fakeSlotRunTween[index].stop();
                    this.fakeSlotRunTween[index] = null; // 清空引用
                }
            }
            this.btn_jpSpinArr[this.curNeedBuyJpObj.index].node.active = false;
            this.hideSlotState();
            this.hideSkel();
            this.curNeedBuyJpObj.hide();
            this.initSlotPos(this.curNeedBuyJpObj.index, true);
            this.curNeedBuyJpObj = null;
        }
        let proroID = 'gameservice.call';
        let message = 'CallReq';
        GameServerManager.send(proroID, message, {              
            amount: betAmount,
            isExtra: this.isExtra,
            buy: jpMult > 1, //是否购买免费次数
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