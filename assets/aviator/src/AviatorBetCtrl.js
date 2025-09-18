

cc.Class({
    extends: cc.Component,

    properties: {
        node_betinfo: cc.Node,
        node_autoinfo: cc.Node,
        node_waitnextround: cc.Node,
        node_left: cc.Node,
        node_choice: cc.Node,

        toggle_bet: cc.Toggle,
        toggle_auto: cc.Toggle,
        toggle_isAuto: cc.Toggle,
        toggle_autoPlay: cc.Toggle,

        lab_curBet1: cc.Label,
        lab_curBet2: cc.Label,
        lab_bet_tip: cc.Label,

        btn_add: cc.Button,
        btn_att: cc.Button,
        btn_bet_quicks: [cc.Button],
        btn_bet: cc.Button,
        btn_bet_cancel: cc.Button,
        btn_open: cc.Button,


        edit_Mult: cc.EditBox,
        edit_Bet: cc.EditBox,

        greenSpriteFrame: cc.SpriteFrame,
        orangeSpriteFrame: cc.SpriteFrame,

        root_index: cc.Integer
    },

    onLoad() {
        this.btn_add.node.on('click', this.btnClick, this);
        this.btn_att.node.on('click', this.btnClick, this);
        for (let i = 0; i < this.btn_bet_quicks.length; i++) {
            this.btn_bet_quicks[i].node.on('click', this.btnClick, this);
        }
        this.btn_bet.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
        this.btn_bet_cancel.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
        this.btn_open.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
        
        this.toggle_bet.node.on('toggle', this.toggleClick, this);
        this.toggle_auto.node.on('toggle', this.toggleClick, this);
        this.toggle_isAuto.node.on('toggle', this.toggleSetAutoClick, this);
        this.toggle_autoPlay.node.on('toggle', this.toggleAutoPlayClick, this);
        
        this.msgHandle = ClientNotify.register(GlobalCfg.MSG_TYPE.serverMsg, this.onEventMsg, this);
        this.customMsgHandle = ClientNotify.register(GlobalCfg.MSG_TYPE.clientMsg, this.onEventMsg, this);
        this.edit_Bet.node.on('editing-did-ended', this.onBetEditEnd, this);
    },

    start() {
        this.NowToggleName = 'tog_bet';
        this.isAuto = false; //是否自动投注
        this.autoCount = 0;
        this.quickBetStr = [10000, 20000, 50000, 100000]; //需要除以100
        this.choiceQuickIndex = -1; //当前选择的快捷下注索引，如果和上次一样则执行加法逻辑
        this.curBet = 1000;
        this.minBet = 1000; //最小下注
        this.maxBet = 1000000; //最大下注
        for (let i = 0; i < this.btn_bet_quicks.length; i++) {
            this.btn_bet_quicks[i].node.getChildByName('lab').getComponent(cc.Label).string = this.quickBetStr[i] / 100 + '';
        }
        this.edit_Mult.string = this.edit_Mult.placeholder
        this.Init();
    },

    onDestroy() {
        ClientNotify.removeByHandle(GlobalCfg.MSG_TYPE.serverMsg, this.msgHandle);
        ClientNotify.removeByHandle(GlobalCfg.MSG_TYPE.clientMsg, this.customMsgHandle);
    },

    onEventMsg(webData, target) {
        let self = target;
        var msgId = webData.msgCode;
    },

    Init() {
        this.betStatus = 0; //0：待机状态 1:点了下注 但是需要等待下一局 2:点了下注 正好是在下注状态
        this.btn_bet.node.active = true;
        this.btn_bet_cancel.node.active = false;
        this.btn_bet.node.getChildByName("Background").getComponent(cc.Sprite).spriteFrame = this.greenSpriteFrame;
        this.lab_bet_tip.string = "Bet";
        // this.lab_curBet1.string = this.curBet + ".00";
        this.edit_Bet.string = CommonFun.getInstance().fixed(this.curBet / 100);
        this.lab_curBet2.string = CommonFun.getInstance().fixed(this.curBet / 100) + " INR";
        this.setButtonEnabled(true);
    },

    StartBet() {
        if (this.autoCount > 0) {//如果为自动下注
            this.betStatus = 1
        }
        if (this.betStatus == 1) {//如果为等待下一局 则变成下注状态
            this.betStatus = 2;
            this.btn_bet.node.active = false;
            this.btn_bet_cancel.node.active = true;
            this.node_waitnextround.active = false;
            this.lab_bet_tip.string = "Bet";
            this.btn_bet.node.getChildByName("Background").getComponent(cc.Sprite).spriteFrame = this.greenSpriteFrame;
            this.lab_curBet2.string = CommonFun.getInstance().fixed(this.curBet / 100) + " INR";
        }
        else{
            this.Init();
        }
    },

    flyEnd() {
        this.toggle_isAuto.enabled = true;
        if (this.autoCount > 0) { //如果为自动下注
            this.autoCount--;
            if (this.autoCount <= 0) {
                this.autoCount = 0;
                this.toggle_isAuto.enabled = true;
                this.setButtonEnabled(true);
            }
            return;
        }
        if (this.betStatus != 1) {//如果为等待下一局 则变成下注状态
            this.btn_bet.node.active = true;
            this.btn_bet_cancel.node.active = false;
            this.lab_bet_tip.string = "Bet";
            this.btn_bet.node.getChildByName("Background").getComponent(cc.Sprite).spriteFrame = this.greenSpriteFrame;
            this.lab_curBet2.string = CommonFun.getInstance().fixed(this.curBet / 100) + " INR";
        }
    },

    toggleClick: function(toggle) {
        GlobalCfg.G_COMPONENTS.Audio.playButton();
        let toggleName = toggle.node.name;
        this.setViewByToggleName(toggleName);
    },

    toggleSetAutoClick: function(toggle) {
        if (GlobalCfg.ACT_SCENE_CTRL.betStatus == 1 && this.betStatus == 2) {//飞行阶段&&下注状态 不允许切换自动下注
            return; //自动下注
        }
        GlobalCfg.G_COMPONENTS.Audio.playButton();
        if (toggle.isChecked) {
            this.edit_Mult.enabled = true;
            this.edit_Mult.node.opacity = 255;
        }
        else {
            this.edit_Mult.enabled = false;
            this.edit_Mult.node.opacity = 160;
        }
        this.toggle_auto.interactable = !toggle.isChecked;
        this.toggle_bet.interactable = !toggle.isChecked;
        this.node_choice.opacity = toggle.isChecked ? 160 : 255;
    },

    toggleAutoPlayClick: function(toggle) {
        GlobalCfg.G_COMPONENTS.Audio.playButton();
        if (toggle.isChecked) {
            this.setAutoInfo(99999);
        }
        else {
            this.dealStopAutoEvent();
        }
    },

    btnClick: function (btn) {
        let btnName = btn.node.name;
        GlobalCfg.G_COMPONENTS.Audio.playButton();
        if (btnName === "btn_add") {
            this.dealBetChangeEvent(1);
        } 
        else if (btnName === "btn_att") {
            this.dealBetChangeEvent(2);
        }
        else if (btnName === "btn_bet_quick1") {
            this.dealQuickBetEvent(0);
        }
        else if (btnName === "btn_bet_quick2") {
            this.dealQuickBetEvent(1);
        }
        else if (btnName === "btn_bet_quick3") {
            this.dealQuickBetEvent(2);
        }
        else if (btnName === "btn_bet_quick4") {
            this.dealQuickBetEvent(3);
        }
        else if (btnName === "btn_bet") {
            this.dealBetEvent();
        }
        else if (btnName === "btn_bet_cancel") {
            this.dealBetCancelEvent();
        }
        else if (btnName === "btn_open") {
            this.dealOpenEvent();
        }
    },
    
    dealBetStatus: function () {
        //进入飞行状态 开始判断当前是否是下注状态
        if (this.betStatus == 2) {
            this.btn_bet.node.active = true;
            this.btn_bet_cancel.node.active = false;
            this.btn_bet.node.getChildByName("Background").getComponent(cc.Sprite).spriteFrame = this.orangeSpriteFrame;
            this.lab_bet_tip.string = "Cash Out";
            this.toggle_isAuto.enabled = false; //飞行状态&&下注状态 不能自动下注
        }
    },

    /**
    * 更新当前 Rate
    * @param {Number} value Rate
    */
    updateRate(value) {
        if(!value) return;
        if(this.betStatus != 2) return;
        value = Number(value);
        let finalValue = value * this.curBet /100;
        this.lab_curBet2.string = CommonFun.getInstance().fixed(finalValue) + " INR";

        if (this.toggle_isAuto.isChecked) { //自动下注 需要判断是否达到设置的倍率
            let curValue = Number(this.edit_Mult.string);
            if(value == curValue){
                if (GlobalCfg.ACT_SCENE_CTRL.betStatus == 1) { //飞行阶段 点击下注按钮 说明是要领取奖励
                    // this.sendGetCashMessage();
                    if (this.autoCount <= 0) {
                        this.Init();
                    }
                }
            }
        }
    },

    showReward() {
        if (this.autoCount > 0) {
            this.btn_bet.node.active = false;
            this.btn_bet_cancel.node.active = true;
            this.node_waitnextround.active = true;
            this.betStatus = 1;
        }
    },

    checkSendStatus: function () {
        //关闭一切下注相关操作
        if (this.betStatus == 2) {
            this.sendBetReq();
        }
    },

    dealBetChangeEvent: function (type) {
        if (type == 1) {
            this.curBet += 100;
            if (this.curBet > this.maxBet)
                this.curBet = this.maxBet;
        } else if (type == 2) {
            this.curBet -= 100;
            if (this.curBet < this.minBet)
                this.curBet = this.minBet;
        }
        // this.lab_curBet1.string = this.curBet + ".00";
        this.edit_Bet.string = CommonFun.getInstance().fixed(this.curBet / 100);
        this.lab_curBet2.string = CommonFun.getInstance().fixed(this.curBet / 100) + " INR";
    },

    dealQuickBetEvent: function (type) {
        if (this.choiceQuickIndex == type) { //如果是上次选择的索引，则直接相加
            this.curBet += this.quickBetStr[type];
            if (this.curBet > this.maxBet)
                this.curBet = this.maxBet;

            // this.lab_curBet1.string = this.curBet + ".00";
            this.edit_Bet.string = CommonFun.getInstance().fixed(this.curBet / 100);
            this.lab_curBet2.string = CommonFun.getInstance().fixed(this.curBet / 100) + " INR";
        }
        else{
            this.choiceQuickIndex = type;
            this.curBet = this.quickBetStr[type];
            // this.lab_curBet1.string = this.quickBetStr[type] + ".00";
            this.edit_Bet.string = CommonFun.getInstance().fixed(this.quickBetStr[type] / 100);
            this.lab_curBet2.string = CommonFun.getInstance().fixed(this.quickBetStr[type] / 100) + " INR";
        }
    },

    dealBetEvent: function () {
        if (this.betStatus == 0) {//可下注状态
            if (GlobalCfg.USER_DATAS.isNotCharge == true){   //未曾充值
                CommonFun.getInstance().showMsgBox("This feature is available only for premium players . Add cash now to become a premium player .", "SHOP", () => {
                    CommonFun.getInstance().showSmallAddCash()
                }, false, null, null, null, null, 0.85);
                return;
            };
            let num = this.curBet;
            if (num > GlobalCfg.USER_DATAS.userDiamond) {
                CommonFun.getInstance().showMsgBox('Your cash is insufficient, Please recharge in time!', "SHOP", () => {
                    CommonFun.getInstance().showSmallAddCash()
                }, false, null, null, null, null, 0.85);
            } else {
                this.btn_bet.node.active = false;
                this.btn_bet_cancel.node.active = true;
                this.setButtonEnabled(false);
                if (GlobalCfg.ACT_SCENE_CTRL.betStatus == 0) { //下注阶段
                    this.node_waitnextround.active = false;
                    this.betStatus = 2;
                }
                else { //得等待下一局
                    this.node_waitnextround.active = true;
                    this.betStatus = 1;
                }
            }
        }
        else if (this.betStatus == 2) {//下注阶段
            if (this.toggle_isAuto.isChecked) {
                return; //自动下注阶段，不能取消下注
            }
            if (GlobalCfg.ACT_SCENE_CTRL.betStatus == 1) { //飞行阶段 点击下注按钮 说明是要领取奖励
                this.sendGetCashMessage();
            }
            if (this.autoCount > 0) { //处于自动下注阶段
                //手动领取奖励，等待下一局
                this.btn_bet.node.active = false;
                this.btn_bet_cancel.node.active = true;
                this.node_waitnextround.active = true;
                this.betStatus = 1;
            }
            else
                this.Init();
        }
    },

    sendGetCashMessage: function () {
        let rate = GlobalCfg.ACT_SCENE_CTRL.centerRateNode.getChildByName('Label').getComponent(cc.Label).string;
        let _time = GlobalCfg.ACT_SCENE_CTRL.duringFlyTime;
        let _mul = rate.split('x')[0];
        this.betStatus = 1;
        GameServerManager.send("gameservice.cash", "CashReq", {
            x: Math.round(_time * 1000),
            mul: Math.round(Number(_mul) * 1000),
            pos: this.root_index
        });
    },

    sendBetReq: function () {
        let amount = this.curBet;
        if (amount > GlobalCfg.USER_DATAS.userDiamond) {
            CommonFun.getInstance().showMsgBox('Your cash is insufficient, Please recharge in time!', "SHOP", () => {
                CommonFun.getInstance().showSmallAddCash()
            }, false, null, null, null, null, 0.85);
            this.dealStopAutoEvent();
            return;
        }
        let mult = this.toggle_isAuto.isChecked ? Math.round(Number(this.edit_Mult.string) * 1000): 0;
        GameServerManager.send("gameservice.bet", "BetReq", {
            amount: amount,
            pos: this.root_index,
            mul: mult
        });
    },

    //取消下注
    dealBetCancelEvent: function () {
        this.betStatus = 0;
        this.btn_bet.node.active = true;
        this.btn_bet_cancel.node.active = false;
        this.node_waitnextround.active = false;
        this.setButtonEnabled(true);
        if (this.autoCount > 0) { //如果为自动下注，则取消自动下注
            this.dealStopAutoEvent();
        }
    },

    dealAutoPlayEvent: function () {
        if (GlobalCfg.USER_DATAS.isNotCharge == true && GlobalCfg.USER_DATAS.gamePattern == 0 && GlobalCfg.USER_DATAS.refuseUnpayHundred == true){   //未曾充值
            CommonFun.getInstance().showMsgBox("This feature is available only for premium players . Add cash now to become a premium player .", "SHOP", () => {
                CommonFun.getInstance().showSmallAddCash()
            }, false, null, null, null, null, 0.85);
            return;
        };
        GlobalCfg.ACT_SCENE_CTRL.openAutoSetting(this.root_index);
    },

    //取消自动下注
    dealStopAutoEvent: function () {
        this.autoCount = 0;
        this.toggle_isAuto.enabled = true;
        this.setButtonEnabled(true);
        this.Init();
    },

    dealOpenEvent: function () {
        if (this.root_index == 0) {
            GlobalCfg.ACT_SCENE_CTRL.node_betinfo2.active = true;
            // this.setBgWidth(false)
        } else {
            let betinfo1 = GlobalCfg.ACT_SCENE_CTRL.node_betinfo1.getComponent('AviatorBetCtrl');
            this.node.active = false;
            // betinfo1.setBgWidth(true);
        }
    },

    setBgWidth: function (isOne) {
        let widthBg = isOne ? 700 : 574;
        let widthLine = isOne ? 520 : 425;
        this.node.getChildByName('bg').width = widthBg;
        this.node.getChildByName('autoinfo').getChildByName('line').width = widthLine;
        this.btn_open.node.active = isOne;
    },

    setButtonEnabled: function (enabled) {
        LoggerUtil.getInstance().error("setButtonEnabled enabled:", enabled);
        this.btn_add.interactable = enabled;
        this.btn_att.interactable = enabled;
        for (let i = 0; i < this.btn_bet_quicks.length; i++) {
            this.btn_bet_quicks[i].interactable = enabled;
        }
        this.edit_Bet.enabled = enabled;

        this.node_left.opacity = enabled ? 255 : 160;
    },

    onBetEditEnd: function (editBox) {
        if (editBox.string == "") {
            editBox.string = editBox.placeholder;
        }
        const value = editBox.string < 10 ? 10 : editBox.string;
        this.curBet = parseFloat(value) * 100;
        this.lab_curBet2.string = CommonFun.getInstance().fixed(this.curBet / 100) + " INR";
    },

    //设置自动下注次数
    setAutoInfo: function (count) {
        this.autoCount = count; //自动下注次数
        this.toggle_isAuto.enabled = false;
        this.edit_Mult.enabled = false; //自动下注时，倍数不可用
        this.setButtonEnabled(false); //自动下注时，按钮不可用
        this.betStatus = 0;
        this.dealBetEvent();
    },

    setViewByToggleName(toggleName) {
        if(toggleName == this.NowToggleName)
            return;
        if (this.node_betinfo) {
            this.node_betinfo.position = toggleName == "tog_bet" ? cc.v2(0, 0) : cc.v2(0, 35);
        };
        if (this.node_autoinfo) {
            this.node_autoinfo.active = toggleName == "tog_auto";
        };
        this.NowToggleName = toggleName
    },
});
