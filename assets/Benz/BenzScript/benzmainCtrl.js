let UINode = require('UINode');
cc.Class({
    extends: UINode,

    properties: {
        logoPab: cc.Prefab,
        btnPab: cc.Prefab,
        labCoinPab: cc.Prefab,
        pab_setting: cc.Prefab,
        nodeLizi: cc.Prefab,
    },

    ctor() {
        this.totalWinNum = 0;
        this.betIndex = 0;
        this.lastBet = [];
        this.bTouch = 0;
        this._winGold = 0;
        this.bActOver = false;
        this.startIndex = Math.ceil(Math.random() * 24)-1;
        this.betStatus = true;
        this.is_can_ackClick = true;
        // this.bPMDRun = false;
        this.curUseAdapt = 1;       // 适配模式
        this.singleBetNums = [100, 1000, 2000, 5000, 10000];        // 单注金额
        this.singleBet = this.singleBetNums[0];
        this.rotating = false;      // 旋转中
        this.showBetSpineTimeInterval = 15;      // 显示下注动画的时间间隔
        this.showBetSpineTime = 0;
    },

    onLoad() {
        CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.SHOW_BENZ_GAME);
        
        CommonFun.getInstance().addVerticalAcc();
        GlobalCfg.G_COMPONENTS.Audio.pauseMusic();
        this.msgHandle = ClientNotify.register(GlobalCfg.MSG_TYPE.serverMsg, this.onEventMsg, this);
        this.customMsgHandle = ClientNotify.register(GlobalCfg.MSG_TYPE.clientMsg, this.onEventMsg, this);
        this.ReSetPos()
        this.initNode()
        this.tipsLabel = ["Your game is not finished yet . If you wish to exit the game , you will lose your money . Do you want to leave game?", // 退出游戏
            "Your cash is insufficient, Please recharge in time!",
        ];
        // this.pmdTime = setTimeout(()=>{this.runPMD()}, 5000);
    },

    onDestroy: function () {
        GlobalCfg.G_COMPONENTS.Audio.stopAllEffects();
        clearTimeout(this.carouselTime);
        clearTimeout(this.runTime);
        clearTimeout(this.changeTime);
        clearTimeout(this.stopMusic);
        clearTimeout(this.btnTime)
        this.scheduleOnce = null;
        this.unschedule(this.scheduleBetSpineTimeCallback);
        ClientNotify.removeByHandle(GlobalCfg.MSG_TYPE.serverMsg, this.msgHandle);
        ClientNotify.removeByHandle(GlobalCfg.MSG_TYPE.clientMsg, this.customMsgHandle);
        CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.EXIT_BENZ_GAME);
    },

    start() {
        GlobalCfg.ACT_SCENE_CTRL = this;
        this.sendLoginReq();
    },

    ReSetPos:function () {
        let height = cc.winSize.height;
        let BetButton = cc.find('benz_Canvas/BetButton')
        let array = ['btnBet_1', 'btnBet_10', 'btnBet_20', 'btnBet_50', 'btnBet_100']
        let pos = [cc.v2(-311,96),cc.v2(-208,96),cc.v2(-104,96),cc.v2(-1,96),cc.v2(102,96)]
        if(height < 1400){
            for (let index = 0; index < array.length; index++) {
                let btn = BetButton.getChildByName(array[index]);
                btn.setPosition(pos[index]);
            }
            BetButton.setPosition(cc.v2(0,-715))
            BetButton.getChildByName("btn_repeat").active = true;
            BetButton.getChildByName("btn_start").active = true;
            this.curUseAdapt = 0;
        }
    },

    initNode: function () {
        this.dataConfig = this.node.getComponent("dataConfig");
        this.dataConfig.initLogo(this.logoPab, this.node.getChildByName("areaShow"));
        this.sendReqCtrl = this.node.getComponent("benzSendMessage"); //跟服务器请求数据
        this.light = this.node.getChildByName('BetButton').getChildByName('light');
        this.betAreaNode = this.node.getChildByName("BetArea");
        this.betNode = this.betAreaNode.getChildByName("bet_node");
        this.btn_add = this.node.getChildByName('node_coin').getChildByName('btn_add').getComponent(cc.Button);
        this.labTotalWin = cc.find('benz_Canvas/lab_Total').getComponent(cc.Label);
        this.labJackPot = cc.find('benz_Canvas/lab_jackPot').getComponent(cc.Label);
        this.labCoin = cc.find('benz_Canvas/node_coin/lab_coin').getComponent(cc.Label);
        this.btnStart = cc.find('benz_Canvas/BetButton/btn_start').getComponent(cc.Button);
        this.btnStart1 = cc.find('benz_Canvas/BetButton/btn_start1').getComponent(cc.Button);
        this.btnRepeat = cc.find('benz_Canvas/BetButton/btn_repeat').getComponent(cc.Button);
        this.btnRepeat1 = cc.find('benz_Canvas/BetButton/btn_repeat1').getComponent(cc.Button);
        this.btnReset = cc.find('benz_Canvas/BetButton/btn_reset').getComponent(cc.Button);
        this.btnReset1 = cc.find('benz_Canvas/BetButton/btn_reset1').getComponent(cc.Button);
        this.btnCollect = cc.find('benz_Canvas/BetButton/btn_collect').getComponent(cc.Button);
        this.btnCollect1 = cc.find('benz_Canvas/BetButton/btn_collect1').getComponent(cc.Button);
        this.nodeWinAnim = cc.find('benz_Canvas/node_winAnim').getComponent(sp.Skeleton);
        this.nodePmdAnim = cc.find('benz_Canvas/node_pmd').getComponent(sp.Skeleton);
        this.labCount = [null,]
        // this.sprGuang = [null,]
        for (let index = 1; index < 9; index++) {
            this.labCount[index] = cc.find('benz_Canvas/BetArea/btn_' + index + '/lab_count').getComponent(cc.Label);
            // this.sprGuang[index] = cc.find('benz_Canvas/BetArea/btn_' + index + '/Background/k_guang');
            let btn_bet = cc.find('benz_Canvas/BetArea/btn_' + index)
            btn_bet.on(cc.Node.EventType.TOUCH_START, this.touchstart, this)
        }
        this.addClickTouch(['btnBet_1', 'btnBet_10', 'btnBet_20', 'btnBet_50', 'btnBet_100', 'btn_repeat', 'btn_start', 'btn_start1', 'btn_repeat1', 'btn_reset', 'btn_reset1', 'btn_collect', 'btn_collect1'], cc.find('BetButton', this.node), this);
        this.addClickTouch(['btn_back', 'btn_set'], this.node, this);
        this.btn_add.node.on('click', this.btnClick, this);
        this.node.on(cc.Node.EventType.TOUCH_START, this.touchstart, this);
        this.btnBet1 = cc.find('benz_Canvas/BetButton/btnBet_1');
        this.choiceBetButton(this.btnBet1.getComponent(cc.Button));
        this.betArr = [null, 0, 0, 0, 0, 0, 0, 0, 0];
        this.betNum = [null, [0,0,0,0,0], [0,0,0,0,0], [0,0,0,0,0], [0,0,0,0,0], 
        [0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0]]
        this.rebetArr = []
        this.rebetNum = []

        this.dataConfig.changeLogo(this.startIndex, true)
    },

    btnClick: function (button) {
        if(!this.is_can_ackClick){return;}
        let btnName = button.node.name;
        LoggerUtil.getInstance().log("///:",btnName);
        if (btnName == "btn_back") {
            GlobalCfg.G_COMPONENTS.Audio.playBack();
            //退出游戏
            let betCoin = 0;
            let self = this;
            for (let index = 1; index < 9; index++) {
                betCoin += this.betArr[index];
            }
            if (betCoin > 0) {
                // CommonFun.getInstance().showMsgBox(this.tipsLabel[0], "YES_NO", () => {        
                // }, false);
                let call = []
                if(!this.betStatus){
                    this.betArr = [null, 0, 0, 0, 0, 0, 0, 0, 0];
                    this.betNum = [null, [0,0,0,0,0], [0,0,0,0,0], [0,0,0,0,0], [0,0,0,0,0], 
                    [0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0]]
                }
                for (let index = 0; index < this.betArr.length-1; index++) {
                    call[index] = {
                        Amount: self.betArr[index+1],
                        type: index+1,
                        AmountType: self.betNum[index+1],
                    }
                }
                this.sendReqCtrl.exitGameReq(call);
            } else {
                let call = []
                for (let index = 0; index < this.betArr.length-1; index++) {
                    call[index] = {
                        Amount: self.betArr[index+1],
                        type: index+1,
                        AmountType: self.betNum[index+1],
                    }
                }
                this.sendReqCtrl.exitGameReq(call);
            }
            return;
        } 
        GlobalCfg.G_COMPONENTS.Audio.playButton();
        if (btnName == 'btn_set') {
            let pab_setting = cc.instantiate(this.pab_setting);
            this.node.addChild(pab_setting);
        } else if (btnName == 'btnBet_1') {
            this.choiceBetButton(button);
            this.singleBet = this.singleBetNums[0];
            this.betIndex = 0;
        } else if (btnName == 'btnBet_10') {
            this.choiceBetButton(button);
            this.singleBet = this.singleBetNums[1];
            this.betIndex = 1;
        } else if (btnName == 'btnBet_20') {
            this.choiceBetButton(button);
            this.singleBet = this.singleBetNums[2];
            this.betIndex = 2;
        } else if (btnName == 'btnBet_50') {
            this.choiceBetButton(button);
            this.singleBet = this.singleBetNums[3];
            this.betIndex = 3;
        } else if (btnName == 'btnBet_100') {
            this.choiceBetButton(button);
            this.singleBet = this.singleBetNums[4];
            this.betIndex = 4;
        } else if (btnName == 'btn_repeat' || btnName == 'btn_repeat1') {
            if (this.betStatus) {
                this.betFunc()
            }
        } else if (btnName == 'btn_start') {
            GlobalCfg.G_COMPONENTS.Audio.stopAll();
            if (this.betStatus) {
                this.nodeWinAnim.node.active = false;
                GlobalCfg.G_COMPONENTS.Audio.stopAll();
                this.betFunc(true);
                return;
            } 
            if(Number(this.labTotalWin.string)*100 == this.totalWinNum){
                this.setBtnInteractableAndOutLineLabel(false, this.btnStart);
                this.setBtnInteractableAndOutLineLabel(false, this.btnStart1);
                this.countDown(this.labTotalWin,0,2);
                if(Number(this.labTotalWin.string) > 0){
                    this.playGameSound("Sound/D_STAR")
                }
            }
        } else if (btnName == 'btn_start1') {
            GlobalCfg.G_COMPONENTS.Audio.stopAll();
            if (this.betStatus) {
                this.nodeWinAnim.node.active = false;
                GlobalCfg.G_COMPONENTS.Audio.stopAll();
                this.betFunc(true);
                return;
            } 
            if(Number(this.labTotalWin.string)*100 == this.totalWinNum){
                this.setBtnInteractableAndOutLineLabel(false, this.btnStart);
                this.setBtnInteractableAndOutLineLabel(false, this.btnStart1);
                this.countDown(this.labTotalWin,0,2);
                if(Number(this.labTotalWin.string) > 0){
                    this.playGameSound("Sound/D_STAR")
                }
            }
        } else if (btnName == 'btn_add') {
            CommonFun.getInstance().showNewShop();
        }
        else if(btnName == 'btn_reset1' || btnName == 'btn_reset'){
            this.returnCoin();
            this.reSetData();
        }
        else if(btnName == 'btn_collect' || btnName == 'btn_collect1'){
            this.collectCoin();
        }
        this.is_can_ackClick = false;
        this.btnTime = setTimeout(()=>{this.is_can_ackClick = true;}, 300);
    },

    returnCoin:function (){
        let count = 0;
        for (let i = 1; i < this.betArr.length; i++) {
            count += this.betArr[i];
        }
        let curCoin = Number(this.labCoin.string) * 100;
        GlobalCfg.USER_DATAS.userDiamond = curCoin + count;
        this.labCoin.string = FloatCalculation.accDiv(GlobalCfg.USER_DATAS.userDiamond, 100);
    },

    betFunc:function (bBet) {
        if (GlobalCfg.USER_DATAS.isNotCharge == true && GlobalCfg.USER_DATAS.gamePattern == 0 && GlobalCfg.USER_DATAS.refuseUnpayHundred == true) { //未曾充值
            CommonFun.getInstance().showMsgBox("This feature is available only for premium players . Add cash now to become a premium player .", "SHOP", () => {
            }, false);
            return
        } 
        if(bBet){
            let BetCoin = 0;
            for (let index = 1; index < this.betArr.length; index++) {
                BetCoin += this.betArr[index];
            }
            if(BetCoin!=0){
                this.reStart();
                this.callReq();
                return;
            }
        }

        let reBetCoin = 0;
        for (let index = 1; index < this.rebetArr.length; index++) {
            reBetCoin += this.rebetArr[index];
        }
        if(reBetCoin > 0 && reBetCoin <= GlobalCfg.USER_DATAS.userDiamond){
            for (let i = 1; i < this.rebetNum.length; i++) {
                this.betArr[i] += this.rebetArr[i];
                for (let j = 0; j < this.rebetNum[i].length; j++) {
                    this.betNum[i][j] += this.rebetNum[i][j];
                }
            }
            for (let index = 1; index < 9; index++) {
                if(this.rebetArr[index]!=0){
                    this.betTypeAnim(index,this.rebetArr[index]);
                }
            }
            this.setBtnInteractableAndOutLineLabel(false, this.btnRepeat);
            this.setBtnInteractableAndOutLineLabel(false, this.btnRepeat1);
            this.showBtnReset(true);
        } else if(reBetCoin > GlobalCfg.USER_DATAS.userDiamond){
                CommonFun.getInstance().showMsgBox(this.tipsLabel[1], "SHOP", () => {
                    CommonFun.getInstance().showSmallAddCash()
                }, false);
                return;
        } else if(reBetCoin == 0) {
            if(!bBet){
                let num1 = this.betArr[1] + this.singleBet;
                if(num1 > 1000000){
                    CommonFun.getInstance().showTips("Upper limit of betting amount!");
                    return
                }
            }
            let num = this.singleBet * 8;
            if(GlobalCfg.USER_DATAS.userDiamond >= num){
                for (let i = 1; i < this.betArr.length; i++) {
                    this.betArr[i] += this.singleBet;
                    this.betNum[i][this.betIndex] += this.singleBet;
                }
                for (let index = 1; index < this.betArr.length; index++) {
                    this.betTypeAnim(index,this.singleBet);
                }
                this.showBtnReset(true);
            }else{
                CommonFun.getInstance().showMsgBox(this.tipsLabel[1], "SHOP", () => {
                    CommonFun.getInstance().showSmallAddCash()
                }, false);
                return;
            }
        }
        // if(bBet){
        //     this.reStart();
        //     this.callReq();
        // }
    },

    reStart: function(){
        this.betStatus = false;
        for (let index = 1; index < 9; index++) {
            let btn_bet = cc.find('benz_Canvas/BetArea/btn_' + index).getComponent(cc.Button)
            btn_bet.interactable = false
        }
        this.setBtnInteractableAndOutLineLabel(false, this.btnStart);
        this.setBtnInteractableAndOutLineLabel(false, this.btnStart1);
        this.setBtnInteractableAndOutLineLabel(false, this.btnRepeat);
        this.setBtnInteractableAndOutLineLabel(false, this.btnRepeat1);
        this.showBtnReset(false);
    },

    setBtnInteractableAndOutLineLabel:function (bool, button){
        if(!button) return;
        button.interactable = bool;
        button.target.getChildByName('Label').getComponent(cc.LabelOutline).enabled = bool;
    },

    // 监听错误消息
    checkWebMsgError: function(webData, target) {
        let self = target;
        var msgId = webData.msgCode;
        var notify = webData.msgData;
        if (!notify) {
            let info = {
                errorMessage: `奔驰宝马游戏中, 服务器下发的非正确消息中结构体异常, 内容为===>${JSON.stringify(webData)}`
            };
            CommonFun.getInstance().reportToTelegram(info);
            return;
        };
        let result = notify.result;
        if (notify.Result) {
            result = notify.Result;
        };
        if (msgId === "gameservice.login") {
            let msg = result.message;
            CommonFun.getInstance().showMsgBox(msg, "YES", () => {
                SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.BENZ, SceneManager.getInstance().sceneType.LOBBY);   
                CommonFun.getInstance().decVerticalAcc();        
            }, false);
        } else if (msgId === "gameservice.call") {
            this.setBtnInteractableAndOutLineLabel(true, this.btnStart);
            this.setBtnInteractableAndOutLineLabel(true, this.btnStart1);
            this.returnCoin();
            this.reSetData();
            if (CommonFun.getInstance().isFreePlayerDirectedToFreeTP()) {
                if (result.result == 57) {
                    CommonFun.getInstance().showDiversionFreeTP(() => {
                        // SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.BENZ, SceneManager.getInstance().sceneType.LOBBY);
                        CommonFun.getInstance().decVerticalAcc(); 
                    });
                }
                else {
                    CommonFun.getInstance().showTips(result.message);    
                };
            }
            else {
                CommonFun.getInstance().showTips(result.message); 
            };
        } else {
            CommonFun.getInstance().showTips(result.message);
        }
    },

    onEventMsg: function (webData, target) {
        let self = target;
        var msgId = webData.msgCode;
        var notify = webData.msgData;
        if (msgId == "gameservice.login") {
            self.login(notify)
        } else if (msgId == "gameservice.call") {
            self.callNotify(notify)
        } else if (msgId == "gameservice.gamescenenotify") {
            self.refreshJackPot(notify)
        } else if (msgId == "gameservice.gamescene") {
            self.refreshJackPot(notify)
        } else if (msgId == "gameservice.exit") {
            self.outgamenotify()
        } else if (msgId == "gameservice.updatecoinnotify"){
            if (self.DisplayName == notify.userinfo.DisplayName) {
                let betCoin = 0
                for (let index = 1; index < self.betArr.length; index++) {
                    betCoin += self.betArr[index];
                }
                if(betCoin != 0 && !self.betStatus){
                    GlobalCfg.USER_DATAS.userDiamond = notify.userinfo.Diamond;
                    let num = FloatCalculation.accDiv(GlobalCfg.USER_DATAS.userDiamond, 100);
                    self.labCoin.string = num;
                }else{
                    GlobalCfg.USER_DATAS.userDiamond = notify.userinfo.Diamond - betCoin;
                    let num = FloatCalculation.accDiv(GlobalCfg.USER_DATAS.userDiamond, 100);
                    self.labCoin.string = num;
                }
            };
        } else if(msgId == GlobalCfg.CLIENT_MSG_ID.FIRST_RECHARGE_TIPS) {
            SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.BENZ, SceneManager.getInstance().sceneType.LOBBY);
            CommonFun.getInstance().decVerticalAcc();
        }
        else if (msgId == "lobbyservice.kicktolobby") {
            SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.BENZ, SceneManager.getInstance().sceneType.LOBBY);
            CommonFun.getInstance().decVerticalAcc();
        }
    },
    

    login: function (notify) {
        this.sendReqCtrl.gameSceneReq();
        GlobalCfg.USER_DATAS.userDiamond = notify.userinfo.Diamond;
        this.DisplayName = notify.userinfo.DisplayName;
        let num = FloatCalculation.accDiv(GlobalCfg.USER_DATAS.userDiamond, 100);
        this.labCoin.string = num;
        let config = notify.config;
        this.singleBetNums = [...config.chipOption];
        this.setBtnInteractableAndOutLineLabel(true, this.btnStart);
        this.setBtnInteractableAndOutLineLabel(true, this.btnStart1);
        this.reSetData();
        this.setBetLabel();
    },

    setBetLabel:function(){
        let BetButton = this.node.getChildByName('BetButton');
        let array = ['btnBet_1', 'btnBet_10', 'btnBet_20', 'btnBet_50', 'btnBet_100'];
        for (let i = 0; i < array.length; i++) {
            let nodeBtn = BetButton.getChildByName(array[i]);
            let label = nodeBtn.getChildByName('Background').getChildByName('Label').getComponent(cc.Label);
            label.string = this.singleBetNums[i] / 100;
        }
        this.singleBet = this.singleBetNums[0];
    },

    refreshJackPot: function (notify) {
        this.labJackPot.string = notify.jackpot;
    },

    // 玩家点击下注
    touchstart: function (event) {

        let name = event.currentTarget.name;
        let types = null;
        if (name == "btn_1") {
            types = 1;
        } else if (name == "btn_2") {
            types = 2;
        } else if (name == "btn_3") {
            types = 3;
        } else if (name == "btn_4") {
            types = 4;
        } else if (name == "btn_5") {
            types = 5;
        } else if (name == "btn_6") {
            types = 6;
        } else if (name == "btn_7") {
            types = 7;
        } else if (name == "btn_8") {
            types = 8;
        }else if(name == "benz_Canvas"){
            this.collectCoin();
            return
        }
        if (this.betStatus) {
            //playnow模式下 首充玩家 弹VIP弹框
            if (GlobalCfg.USER_DATAS.recharged == 0 && GlobalCfg.GAME_ENTER_ISFREE == false) {
                CommonFun.getInstance().showVipRechargeToast();
                return;
            }
            this.playGameSound('Sound/s' + types)
            if (GlobalCfg.USER_DATAS.isNotCharge == true && GlobalCfg.USER_DATAS.gamePattern == 0 && GlobalCfg.USER_DATAS.refuseUnpayHundred == true) { //未曾充值
                CommonFun.getInstance().showMsgBox("This feature is available only for premium players . Add cash now to become a premium player .", "SHOP", () => {
                    CommonFun.getInstance().showSmallAddCash()
                }, false);
                return
            } else if (this.singleBet > GlobalCfg.USER_DATAS.userDiamond) {
                CommonFun.getInstance().showMsgBox(this.tipsLabel[1], "SHOP", () => {
                    CommonFun.getInstance().showSmallAddCash()
                }, false);
            } else {
                let num = this.betArr[types] + this.singleBet;
                if(num > 1000000){
                    CommonFun.getInstance().showTips("Upper limit of betting amount!");
                    return
                }
                this.betNum[types][this.betIndex] += this.singleBet;
                this.betArr[types] += this.singleBet;
                this.betTypeAnim(types, this.singleBet)
            }
            let count = 0;
            for (let i = 1; i < this.betArr.length; i++) {
                count += this.betArr[i];
            }
            let type = count > 0 ? true : false;
            this.showBtnReset(type);
        } else {
            LoggerUtil.getInstance().log("游戏未结束")
        }
    },

    collectCoin: function () {
        let bActable = false;
        if(this.btnStart.node.active){
            bActable = this.btnStart.interactable;
        }else{
            bActable = this.btnStart1.interactable;
        }
        if (Number(this.labTotalWin.string)*100 == this.totalWinNum && bActable && !this.betStatus){
            GlobalCfg.G_COMPONENTS.Audio.stopAll();
            this.setBtnInteractableAndOutLineLabel(false, this.btnStart);
            this.setBtnInteractableAndOutLineLabel(false, this.btnStart1);
            this.countDown(this.labTotalWin, 0, 2);
            if(Number(this.labTotalWin.string) > 0){
                this.playGameSound("Sound/D_STAR");
            }
            this.showBtnCollect(false);
        }
        if (this.bActOver && this.nodeWinAnim.node.active && !this.betStatus) {
            this.bTouch = 1;
            this.setBtnInteractableAndOutLineLabel(true, this.btnStart);
            this.setBtnInteractableAndOutLineLabel(true, this.btnStart1);
            this.labTotalWin.string = this.totalWinNum/100;
            this.nodeWinAnim.node.active = false;
            GlobalCfg.G_COMPONENTS.Audio.stopAll();
            if(this.totalWinNum > 0){
                this.showBtnCollect(true);
            }
        }
        
    },

    showBtnReset: function (type) {
        if (type == true) {
            if (this.curUseAdapt == 0) {
                this.btnReset.node.active = true;
                this.btnRepeat.node.active = false;
            } else {
                this.btnReset1.node.active = true;
                this.btnRepeat1.node.active = false;
            }
        } else {
            if (this.curUseAdapt == 0) {
                this.btnReset.node.active = false;
                this.btnRepeat.node.active = true;
            } else {
                this.btnReset1.node.active = false;
                this.btnRepeat1.node.active = true;
            }
        }
    },

    showBtnCollect: function (bool) {
        if(bool == true && this.rotating == false){
            if (this.curUseAdapt == 0) {
                this.btnCollect.node.active = true;
                this.btnStart.node.active = false;
            } else {
                this.btnCollect1.node.active = true;
                this.btnStart1.node.active = false;
            }
        } else {
            if (this.curUseAdapt == 0) {
                this.btnCollect.node.active = false;
                this.btnStart.node.active = true;
            } else {
                this.btnCollect1.node.active = false;
                this.btnStart1.node.active = true;
            }
        }
    },

    betTypeAnim: function (type, amount) {
        if (type) {
            let betAreaPos = [null, cc.v2(264, -88), cc.v2(92, -88), cc.v2(-82, -88), cc.v2(-254, -88),
                cc.v2(264, 86), cc.v2(92, 86), cc.v2(-82, 86), cc.v2(-254, 86)
            ]
            GlobalCfg.USER_DATAS.userDiamond -= amount;
            let num = FloatCalculation.accDiv(GlobalCfg.USER_DATAS.userDiamond, 100);
            this.labCoin.string = num;
            let pos = betAreaPos[type];
            let pabWinLab = cc.instantiate(this.labCoinPab)
            pabWinLab.setPosition(pos);
            pabWinLab.getComponent(cc.Label).string = '+' + amount / 100
            this.betNode.addChild(pabWinLab)
            this.labCount[type].string = this.betArr[type] / 100
            cc.tween(pabWinLab)
                .to(1, {
                    position: cc.v2(pos.x, pos.y + 60)
                    // opacity: 220
                })
                .call(() => {
                    pabWinLab.destroy()
                })
                .start()
        }
    },


    playGameSound: function (name, bBool = false) {
        this.loadAudioClip(name, (audioClip, target) => {
            GlobalCfg.G_COMPONENTS.Audio.playSound(audioClip, bBool);
        }, this);
    },

    playGameMusic: function (name) {
        this.loadAudioClip(name, (audioClip, target) => {
            GlobalCfg.G_COMPONENTS.Audio.playMusic(audioClip, true)
        }, this);
    },

    loadAudioClip: function (audioClipUrl = "", func = null, target = null) {
        if (!audioClipUrl || audioClipUrl.length == 0) {
            return;
        };

        CommonFun.getInstance().loadBundle('Benz', (bundle) => {
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

    callReq: function () {
        let self = this;
        for (let index = 1; index < 9; index++) {
            let btn_betSpr = cc.find('benz_Canvas/BetArea/btn_' + index + '/zhezhao')
            btn_betSpr.active = true;
        }
        let call = []
        for (let index = 0; index < this.betArr.length-1; index++) {
            call[index] = {
                Amount: self.betArr[index+1],
                type: index+1,
                AmountType: self.betNum[index+1],
            }
        }
        
        this.rebetArr = this.betArr.slice(0)
        this.rebetNum = this.betNum.slice(0)
        this.sendReqCtrl.sendCallReq(call)
    },

    callNotify: function (notify) {
        this.rotating = true;
        this.totalWinNum = notify.AllAmount;
        GlobalCfg.USER_DATAS.userDiamond = notify.Userinfo.Diamond
        let winArr = notify.Win;
        let winIndexArr = notify.GameScene;
        let playType = notify.PlayType;
        winIndexArr.sort(function (m, n) {
            if (m < n) return -1
            else if (m > n) return 1
            else return 0
        });

        if (winArr.length == 1) {
            let index = this.startIndex - winIndexArr[0];
            let num = index > 0 ?  96 - Math.abs(index) : 96 + Math.abs(index)
            this.runAct(num)
        } 
        else if (playType == 4) {               //点兵点将*3
            this.paintedEggDBDJ(winIndexArr)
            this.playGameSound('Sound/w1',true)
        } 
        else if (playType == 5) {               //开火车
            let num1 = winIndexArr[2];
            if (winIndexArr.indexOf(1) != -1 && winIndexArr.indexOf(2) == -1) {
                num1 = 1
            }
            else if (winIndexArr.indexOf(0) != -1 && winIndexArr.indexOf(2) == -1) {
                num1 = 0
            }
            let index = 0 - num1
            let num = index > 0 ?  96 - Math.abs(index) : 96 + Math.abs(index)
            this.paintedEggKHC(num)
            this.playGameSound('Sound/w1',true)
        } 
        else if (playType == 6) {               //点兵点将*6
            this.paintedEggDBDJ(winIndexArr)
            this.playGameSound('Sound/w2',true)
        } 
        else if (playType == 7) {               //满天星
            this.paintedEggMTX(winIndexArr)
            this.playGameSound('Sound/w2',true)
        } 
        else if (playType == 8) {               //大满贯
            this.paintedEggDMG(winIndexArr)
            this.playGameSound('Sound/w9',true)
        }
        if(winArr.length == 1){
            this.playPmdAnim("pao")
        }
        else{
            this.playPmdAnim("shan")
        }
    },

    runAct: function (runResult) {
        let runNum = 0;
        let addNum = 1
        let musicIndex = 1;
        this.loopTime = 0;
        let logoLength = this.dataConfig.logoArr.length;
        this.playGameSound('Sound/runact')
        this.loop4 = function () {
            var that = this;
            clearTimeout(this.runTime);
            this.runTime = null;
            this.runTime = setTimeout(() => {
                if (cc.isValid(this.node)) {
                    that.init4();
                }
            }, this.loopTime);
        };

        this.init4 = function () {
            if (cc.isValid(this.node)) {
                if (this.startIndex >= logoLength) {
                    this.startIndex = 0;
                }
                if(musicIndex > 8){
                    musicIndex = 1;
                }
                for (let index = 0; index < 5; index++) {
                    if (index <= runNum) {
                        let jndex = this.startIndex - index;
                        let start = jndex < 0 ? logoLength+this.startIndex : this.startIndex;
                        this.dataConfig.changeLogo(start - index, true)
                        this.dataConfig.setLogoOpacity(start - index, 255 - index * 60)
                        if(index > 3){
                            this.dataConfig.changeLogo(start - index, false)
                        }
                    } else if(addNum == -1) {
                        let jndex = this.startIndex - index;
                        let start = jndex < 0 ? logoLength+this.startIndex : this.startIndex;
                        this.dataConfig.changeLogo(start - index, false)
                    }
                }
                if (runNum >= runResult - 5) {
                    runNum = 5;
                    addNum = -1
                } else if (runNum == 0 && addNum == -1) {
                    this.bActOver = true;
                    if(this.totalWinNum > 0){
                        this.dataConfig.setLogoOpacity(this.startIndex,255,true)
                        this.rotating = false;
                        let type = this.dataConfig.getType(this.startIndex)
                        let _str = this.getTypeStr(type);
                        this.playGameSound('Sound/'+_str)
                        this.scheduleOnce(()=>{
                            this.playWinAnim(_str)
                        },0.8)
                    }else{
                        this.playGameSound('Sound/meizhongjiang');
                        this.dataConfig.setLogoOpacity(this.startIndex,255,true);
                        this.setBtnInteractableAndOutLineLabel(true, this.btnStart);
                        this.setBtnInteractableAndOutLineLabel(true, this.btnStart1);
                        this.collectCoin();
                    }
                    return;
                }
                let arr = [null,300,200,100,50,16]
                if(runNum < 6 && runNum > 0 && addNum == -1){
                    this.loopTime = arr[runNum];
                }else if(runNum < 6 && runNum > 0 && addNum == 1){
                    this.loopTime = arr[runNum];
                }else{
                    this.loopTime = 16;
                }
                musicIndex++
                this.startIndex++
                runNum += addNum
                this.loop4();
            }
        };
        this.init4();
    },
    
    playWinAnim: function (str) {
        this.nodeWinAnim.node.active = true;
        this.nodeWinAnim.setAnimation(0, str, false)
        this.playGameSound('Sound/prize')
        this.nodeWinAnim.setCompleteListener((trackEntry, loopCount) => {
            let name = trackEntry.animation.name;
            if (name == str) {
                this.playGameSound('Sound/bg')
                this.countDown(this.labTotalWin, this.totalWinNum, 1);
                this.nodeWinAnim.node.active = false;
            }
        })
    },

    playPmdAnim: function (str) {
        this.nodePmdAnim.node.active = true;
        this.nodePmdAnim.setAnimation(0, str, true)
        // this.runPMD()
    },

    getTypeStr:function (type) {
        let _str = ""
        switch (type) {
            case 1:
                _str = 'volkswagen'
                break;
            case 2:
                _str = 'lexus'
                break;
            case 3:
                _str = 'bmw'
                break;
            case 4:
                _str = 'MercedesBenz'
                break;
            case 5:
                _str = 'porsche'
                break;
            case 6:
                _str = 'maserati'
                break;
            case 7:
                _str = 'Lamborghini'
                break;
            case 8:
                _str = 'ferrari'
                break;
            default:
                break;
        }
        return _str
    },

    countDown: function (StartNumNode, endNum, bMove) {
        this.bTouch = 2; //表示正在倒数计
        // 轮询递增递减
        let StartNum = Number(StartNumNode.string) * 100;
        this.loop5 = () => {
            var that = this;
            clearTimeout(this.changeTime);
            this.changeTime = null;
            this.changeTime = setTimeout(() => {
                if (cc.isValid(this.node)) {
                    that.init5();
                }
            }, 50);
        };

        // 递增递减
        this.init5 = function () {
            if (cc.isValid(this.node)) {
                if (this.bTouch == 1) { //表示停止
                    this.bTouch = 0;    //表示既没有倒数也没有需要停止
                    this.reSetData();
                    return;
                };

                let Num = Math.abs(StartNum - endNum);
                if (Num >= 1000000) { 
                    StartNum += StartNum < endNum ? 1000000 : -1000000;
                } 
                else if (Num >= 100000) { 
                    StartNum += StartNum < endNum ? 100000 : -100000;
                } 
                else if (Num >= 10000) { 
                    StartNum += StartNum < endNum ? 10000 : -10000;
                } 
                else if (Num >= 1000) { 
                    StartNum += StartNum < endNum ? 1000 : -1000;
                }  
                else if (Num >= 100) { 
                    StartNum += StartNum < endNum ? 100 : -100;
                };

                let num = FloatCalculation.accDiv(StartNum, 100);
                StartNumNode.string = num;
                if (!bMove && Num < 100) {
                    let num = FloatCalculation.accDiv(GlobalCfg.USER_DATAS.userDiamond, 100);
                    this.labCoin.string = num;
                    this.setBtnInteractableAndOutLineLabel(true, this.btnStart);
                    this.setBtnInteractableAndOutLineLabel(true, this.btnStart1);
                    this.bTouch = 0; //表示既没有倒数也没有需要停止
                    this.reSetData();
                    return;
                };

                if (bMove == 1) {
                    if (Number(this.labTotalWin.string)*100 > this.totalWinNum) {
                        this.labTotalWin.string = this.totalWinNum/100;
                    };
                }
                if (StartNum == endNum) {
                    if (bMove == 1) {
                        if(Number(this.labTotalWin.string)*100 == this.totalWinNum && this.totalWinNum > 0){
                            if(this.rotating == false){
                                this.setBtnInteractableAndOutLineLabel(true, this.btnStart);
                                this.setBtnInteractableAndOutLineLabel(true, this.btnStart1);
                            }
                            this.showBtnCollect(true);
                        }
                    } 
                    else if (bMove == 2) {
                        // 回收金币，有获胜金币
                        let nodeLizi = cc.instantiate(this.nodeLizi)
                        if(this.totalWinNum != 0){
                            let pos = this.labTotalWin.node.getPosition()
                            nodeLizi.setPosition(pos);
                            this.node.addChild(nodeLizi)

                        }
                        this.scheduleOnce(()=>{
                            if(cc.isValid(nodeLizi)){
                                nodeLizi.destroy()
                            };
                            this.totalWinNum = 0;
                            this._winGold = 0
                            this.countDown(this.labCoin, GlobalCfg.USER_DATAS.userDiamond);
                        }, 0.5);
                    }
                    else {
                        if (Number(this.labCoin.string)*100 == GlobalCfg.USER_DATAS.userDiamond) {
                            let num = FloatCalculation.accDiv(GlobalCfg.USER_DATAS.userDiamond, 100);
                            this.labCoin.string = num;
                            this.setBtnInteractableAndOutLineLabel(true, this.btnStart);
                            this.setBtnInteractableAndOutLineLabel(true, this.btnStart1);
                            this.bTouch = 0; //表示既没有倒数也没有需要停止
                            this.reSetData();
                            return;
                        }
                    };
                    return;
                };

                this.loop5();
            };
        };
        this.init5();
    },

    reSetData: function() {
        this.betArr = [null, 0, 0, 0, 0, 0, 0, 0, 0];
        this.betNum = [
            null, [0,0,0,0,0], [0,0,0,0,0], [0,0,0,0,0], [0,0,0,0,0], 
            [0,0,0,0,0], [0,0,0,0,0], [0,0,0,0,0], [0,0,0,0,0]
        ];
        for (let index = 1; index < this.betNum.length; index++) {
            this.labCount[index].string = this.betArr[index];
        };
        for (let index = 1; index < 9; index++) {
            let btn_betSpr = cc.find('benz_Canvas/BetArea/btn_' + index + '/zhezhao')
            btn_betSpr.active = false;
        };
        for (let index = 0; index < 24; index++) {
            this.dataConfig.setLogoOpacity(index,255);                
            this.dataConfig.changeLogo(index, false)
        };

        this.showBtnReset(false);
        this.nodePmdAnim.node.active = false;
        this.dataConfig.setLogoOpacity(this.startIndex,255);                
        this.dataConfig.changeLogo(this.startIndex, true)
        this.setBtnInteractableAndOutLineLabel(true, this.btnRepeat);
        this.setBtnInteractableAndOutLineLabel(true, this.btnRepeat1);
        this.betNode.removeAllChildren()
        this.betStatus = true;
        // clearTimeout(this.zhuanTime)
        // this.zhuanTime = null;
        for (let index = 1; index < 9; index++) {
            let btn_bet = cc.find('benz_Canvas/BetArea/btn_' + index).getComponent(cc.Button)
            btn_bet.interactable = true
            // this.sprGuang[index].active = false;

        }
        this.bActOver = false;
        this.bTouch = 0;
        clearTimeout(this.runTime);
        cc.Tween.stopAll();
        this.unscheduleAllCallbacks();
    },


    getReward: function (id,bMove) {
        this.labTotalWin.string = this._winGold/100;
        switch (id) {
            case 1:
                this._winGold += this.betArr[id] * 2
                this.countDown(this.labTotalWin, this._winGold, bMove)
                break;
            case 2:
                this._winGold += this.betArr[id] * 3
                this.countDown(this.labTotalWin, this._winGold, bMove)
                break;
            case 3:
                this._winGold += this.betArr[id] * 5
                this.countDown(this.labTotalWin, this._winGold, bMove)
                break;
            case 4:
                this._winGold += this.betArr[id] * 5
                this.countDown(this.labTotalWin, this._winGold, bMove)
                break;
            case 5:
                this._winGold += this.betArr[id] * 10
                this.countDown(this.labTotalWin, this._winGold, bMove)
                break;
            case 6:
                this._winGold += this.betArr[id] * 20
                this.countDown(this.labTotalWin, this._winGold, bMove)
                break;
            case 7:
                this._winGold += this.betArr[id] * 30
                this.countDown(this.labTotalWin, this._winGold, bMove)
                break;
            case 8:
                this._winGold += this.betArr[id] * 40
                this.countDown(this.labTotalWin, this._winGold, bMove)
                break;
            default:
                break;
        }
    },


    outgamenotify: function () {
        SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.BENZ, SceneManager.getInstance().sceneType.LOBBY);     
        CommonFun.getInstance().decVerticalAcc();      
    },

    paintedEggDBDJ: function (WinArr) {
        this.dataConfig.changeLogo(this.startIndex, false);
        this.startIndex = 0;
        let index = 0;
        let runNum = 0;
        let tempArr = []
        this.checkResult = function (){
            var that = this;
            if(index == WinArr.length-1){
                if(!this.totalWinNum){
                    this.playGameSound('Sound/meizhongjiang');
                    this.setBtnInteractableAndOutLineLabel(true, this.btnStart);
                    this.setBtnInteractableAndOutLineLabel(true, this.btnStart1);
                    this.collectCoin();
                }
            }else{
                index++
                that.init6();
            }
        }

        this.loop6 = function () {
            var that = this;
            clearTimeout(this.runTime);
            this.runTime = null;
            this.runTime = setTimeout(() => {
                if (cc.isValid(this.node)) {
                    that.init6();
                }
            }, 50);
        };

        this.init6 = function () {
            if (cc.isValid(this.node)) {
                if(this.startIndex > 23){
                    this.startIndex = 0;
                }
                this.dataConfig.changeLogo(this.startIndex, true);
                this.dataConfig.setLogoOpacity(this.startIndex,255);
                let num = this.startIndex - 1 < 0 ? 23 : this.startIndex - 1
                if(tempArr.indexOf(num) == -1){
                    this.dataConfig.changeLogo(num, false);
                }
                if(this.startIndex == WinArr[index] && runNum > 23){
                    tempArr.push(this.startIndex);
                    let type = this.dataConfig.getType(this.startIndex)
                    this.playGameSound('Sound/dingdong');
                    this.dataConfig.setLogoOpacity(this.startIndex,255,true); 
                    let _str = this.getTypeStr(type);
                    this.playGameSound('Sound/'+_str)
                    if(index == WinArr.length - 1){
                        this.rotating = false;
                    }
                    this.getReward(type,1)
                    this.scheduleOnce(()=>{
                        this.startIndex = 0;
                        runNum = 0;
                        this.checkResult()
                    },1)
                    return
                }
                this.startIndex++
                runNum++
                this.loop6();
            }
        };
        this.init6();
    },

    paintedEggMTX: function (WinArr) {
        let runNum = 0;
        this.dataConfig.changeLogo(this.startIndex, false);
        this.startIndex = 0
        this.loop1 = function () {
            var that = this;
            clearTimeout(this.runTime);
            this.runTime = null;
            this.runTime = setTimeout(() => {
                if (cc.isValid(this.node)) {
                    that.init1();
                }
            }, 125);
        };

        this.init1 = function () {
            if (cc.isValid(this.node)) {
                for (let index = runNum%2; index < 24; index+=2) {
                    this.dataConfig.changeLogo(index, true);
                    this.dataConfig.setLogoOpacity(index,255);
                    this.dataConfig.changeLogo(runNum%2==0?index+1:index-1, false)
                    
                }

                if(runNum >= 23){
                    for (let index = 0; index < 24; index++) {
                        this.dataConfig.setLogoOpacity(index,255);
                        this.dataConfig.changeLogo(index, false);
                    }
                    if(this.totalWinNum > 0){
                        for (let index = 0; index < WinArr.length; index++) {
                            this.dataConfig.changeLogo(WinArr[index], true);
                        }
                        for (let index = 0; index < WinArr.length; index++) {
                            this.scheduleOnce(()=>{
                                if(index == WinArr.length - 1){
                                    this.rotating = false;
                                }
                                this.playGameSound('Sound/dingdong');
                                this.dataConfig.setLogoOpacity(WinArr[index],255,true); 
                                let type = this.dataConfig.getType(WinArr[index]);
                                    this.getReward(type,1)
                            },index*0.8)
                        }
                    }else{
                        for (let index = 0; index < WinArr.length; index++) {
                            this.dataConfig.changeLogo(WinArr[index], true);
                        }
                        // if(!this.bPMDRun){
                            this.playGameSound('Sound/meizhongjiang');
                            this.collectCoin();
                        // }
                        for (let index = 0; index < WinArr.length; index++) {
                            this.scheduleOnce(()=>{
                                this.playGameSound('Sound/dingdong');
                                this.dataConfig.setLogoOpacity(WinArr[index],255,true); 
                            },index*0.8)
                        }
                        this.setBtnInteractableAndOutLineLabel(true, this.btnStart);
                        this.setBtnInteractableAndOutLineLabel(true, this.btnStart1);
                    }
                    return;
                }
                runNum ++
                this.loop1();
            }
        };
        this.init1();
    },

    paintedEggDMG: function () {
        let runNum = 0;
        this.dataConfig.changeLogo(this.startIndex, false);
        this.startIndex = 0
        this.loop2 = function () {
            var that = this;
            clearTimeout(this.runTime);
            this.runTime = null;
            this.runTime = setTimeout(() => {
                if (cc.isValid(this.node)) {
                    that.init2();
                }
            }, 400);
        };

        this.init2 = function () {
            if (cc.isValid(this.node)) {                
                this.dataConfig.changeLogo(runNum, true);
                if(runNum == 23){
                    for (let index = 0; index < 24; index++) {
                        this.dataConfig.changeLogo(runNum, true);
                        this.scheduleOnce(()=>{
                            if(index == 24 - 1){
                                this.rotating = false;
                            }
                            this.playGameSound('Sound/dingdong');
                            this.dataConfig.setLogoOpacity(index,255,true); 
                            let type = this.dataConfig.getType(index);
                            // if(!this.bPMDRun){
                                this.getReward(type,1)
                            // }
                        },index*0.8)
                    }
                    return;
                }
                runNum ++
                this.loop2();
            }
        };
        this.init2();
    },


    paintedEggKHC: function (runResult) {
        let runNum = 0;
        let addNum = 1
        this.loopTime = 1000;
        let logoLength = this.dataConfig.logoArr.length;
        this.dataConfig.changeLogo(this.startIndex, false);
        this.startIndex = 0;
        this.loop3 = function () {
            var that = this;
            clearTimeout(this.runTime);
            this.runTime = null;
            this.runTime = setTimeout(() => {
                if (cc.isValid(this.node)) {
                    that.init3();
                }
            }, this.loopTime);
        };

        this.init3 = function () {
            if (cc.isValid(this.node)) {
                if (this.startIndex >= logoLength) {
                    this.startIndex = 0;
                }
                for (let index = 0; index < 4; index++) {
                    if(index <= runNum && addNum != -1){
                        let jndex = this.startIndex - index;
                        let start = jndex < 0 ? logoLength+this.startIndex : this.startIndex;
                        this.dataConfig.changeLogo(start - index, true)
                        if(index == 3){
                            this.dataConfig.changeLogo(start - index, false)
                        }
                    }else if(addNum == -1){
                        let jndex = this.startIndex - index;
                        let start = jndex < 0 ? logoLength+this.startIndex : this.startIndex;
                        this.dataConfig.changeLogo(start - index, true)
                        if(index == 3){
                            this.dataConfig.changeLogo(start - index, false)
                        }
                    }
                }
                if (runNum >= runResult - 7) {
                    runNum = 7;
                    addNum = -1
                } else if (runNum == 0 && addNum == -1) {
                    if(this.totalWinNum > 0){
                        for (let index = 2; index >= 0; index--) {
                            let jndex = this.startIndex - index;
                            let start = jndex < 0 ? logoLength+this.startIndex : this.startIndex;
                            this.dataConfig.changeLogo(start - index, true)
                            this.dataConfig.setLogoOpacity(start - index,255);
                            this.scheduleOnce(()=>{
                                if(index == 2){
                                    this.rotating = false;
                                }
                                this.playGameSound('Sound/dingdong');
                                this.dataConfig.setLogoOpacity(start - index,255,true); 
                                this.getReward(this.dataConfig.getType(start - index,1),1)
                            },index*0.8)
                        }
                    }else{
                        // if(!this.bPMDRun){
                            this.playGameSound('Sound/meizhongjiang');
                            this.collectCoin();
                        // }
                        for (let index = 0; index < 3; index++) {
                            this.scheduleOnce(()=>{
                                this.playGameSound('Sound/dingdong');
                                let jndex = this.startIndex - index;
                                let start = jndex < 0 ? logoLength+this.startIndex : this.startIndex;
                                this.dataConfig.setLogoOpacity(start - index,255,true); 
                            },index*0.8)
                        }
                        this.setBtnInteractableAndOutLineLabel(true, this.btnStart);
                        this.setBtnInteractableAndOutLineLabel(true, this.btnStart1);
                    }
                    return;
                }

                if(runNum < 5){
                    this.loopTime = Math.floor(750 / (runNum+1));
                }else{
                    this.loopTime = 15;
                }
                    
                this.startIndex++
                runNum += addNum
                this.loop3();
            }
        };
        this.init3();
    },


    winArrRandom:function (arr,arr1,num) {
        let randomNum = Math.ceil(Math.random() * 24)-1
        if(arr.indexOf(randomNum) == -1 && arr1.indexOf(randomNum) == -1){
            arr.push(randomNum)
            if(arr.length == num){
                return;
            } else {
                this.winArrRandom(arr,arr1,num)
            }
        } else {
            this.winArrRandom(arr,arr1,num)
        }
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

    choiceBetButton: function (button){
        let scale = 1.1;
        let btnArr = ['btnBet_1', 'btnBet_10', 'btnBet_20', 'btnBet_50', 'btnBet_100'];
        let betButtonNode = this.node.getChildByName('BetButton');
        let btnName = button.node.name;
        this.light.setScale(scale);
        for (let i = 0; i < btnArr.length; i++) {
            let btn = betButtonNode.getChildByName(btnArr[i]).getComponent(cc.Button);
            if(btn.node.name == btnName){
                btn.node.setScale(scale);
            }else{
                btn.node.setScale(1);
            }
            let widget = btn.node.getComponent(cc.Widget);
            if(widget){
                widget.updateAlignment();
            }
        }
        let pos = button.node.getPosition();
        this.light.setPosition(pos.x, pos.y);
    },

    showBtnBetSpine: function () {
        let animationName = 'animation';
        let btnArr = ['btnBet_1', 'btnBet_10', 'btnBet_20', 'btnBet_50', 'btnBet_100'];
        let betButtonNode = this.node.getChildByName('BetButton');
        let len = btnArr.length, i = 0;
        this.scheduleBetSpineTimeCallback = ()=>{
            let spine = betButtonNode.getChildByName(btnArr[i]).getChildByName('spine').getComponent(sp.Skeleton);
            spine.setAnimation(0, animationName, false);
            i++;
        }
        this.schedule(this.scheduleBetSpineTimeCallback, 0.8, len-1);
    },

    update: function (dt) {
        this.showBetSpineTime += dt;
        if (this.showBetSpineTime > this.showBetSpineTimeInterval) {
            this.showBetSpineTime = 0;
            this.showBtnBetSpine();
        }
    },
});