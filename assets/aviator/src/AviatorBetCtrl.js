

cc.Class({
    extends: cc.Component,

    properties: {
        node_betinfo: cc.Node,
        node_autoinfo: cc.Node,
        node_waitnextround: cc.Node,

        toggle_bet: cc.Toggle,
        toggle_auto: cc.Toggle,
        toggle_isAuto: cc.Toggle,

        lab_curBet1: cc.Label,
        lab_curBet2: cc.Label,
        lab_bet_tip: cc.Label,
        label_autoCount: cc.Label,

        btn_add: cc.Button,
        btn_att: cc.Button,
        btn_bet_quicks: [cc.Button],
        btn_bet: cc.Button,
        btn_bet_cancel: cc.Button,
        btn_autoplay: cc.Button,
        btn_stopAuto: cc.Button,


        edit_Mult: cc.EditBox,

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
        this.btn_autoplay.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
        this.btn_stopAuto.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
        
        this.toggle_bet.node.on('toggle', this.toggleClick, this);
        this.toggle_auto.node.on('toggle', this.toggleClick, this);
        this.toggle_isAuto.node.on('toggle', this.toggleAutoClick, this);
        this.msgHandle = ClientNotify.register(GlobalCfg.MSG_TYPE.serverMsg, this.onEventMsg, this);
        this.customMsgHandle = ClientNotify.register(GlobalCfg.MSG_TYPE.clientMsg, this.onEventMsg, this);
    },

    start() {
        this.NowToggleName = 'tog_bet';
        this.isAuto = false; //是否自动投注
        this.autoCount = 0;
        this.quickBetStr = [100, 200, 500, 1000];
        this.choiceQuickIndex = -1; //当前选择的快捷下注索引，如果和上次一样则执行加法逻辑
        this.curBet = 10;
        this.maxBet = 10000; //最大下注
        for (let i = 0; i < this.btn_bet_quicks.length; i++) {
            this.btn_bet_quicks[i].node.getChildByName('lab').getComponent(cc.Label).string = this.quickBetStr[i]+'';
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
        this.lab_curBet1.string = this.curBet + ".00";
        this.lab_curBet2.string = this.curBet + ".00";
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
            this.btn_bet.node.getChildByName("Background").getComponent(cc.Sprite).spriteFrame = this.greenSpriteFrame;
        }
        else{
            this.Init();
        }
    },

    flyEnd() {
        if (this.autoCount > 0) { //如果为自动下注
            this.autoCount--;
            if (this.autoCount <= 0) {
                this.autoCount = 0;
                this.toggle_isAuto.enabled = true;
                this.setButtonEnabled(true);
                this.btn_stopAuto.node.active = false;
                this.btn_autoplay.node.active = true;
            }
            this.label_autoCount.string = `stop (${this.autoCount})`;
        }
    },

    toggleClick: function(toggle) {
        GlobalCfg.G_COMPONENTS.Audio.playButton();
        let toggleName = toggle.node.name;
        this.setViewByToggleName(toggleName);
    },

    toggleAutoClick: function(toggle) {
        GlobalCfg.G_COMPONENTS.Audio.playButton();
        if (toggle.isChecked) {
            this.edit_Mult.enabled = true;
        }
        else {
            this.edit_Mult.enabled = false;
        }
        this.toggle_auto.interactable = !toggle.isChecked;
        this.toggle_bet.interactable = !toggle.isChecked;
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
        else if (btnName === "btn_autoplay") {
            this.dealAutoPlayEvent();
        }
        else if (btnName === "btn_stopAuto") {
            this.dealStopAutoEvent();
        }
    },
    
    dealBetStatus: function () {
        //进入飞行状态 开始判断当前是否是下注状态
        if (this.betStatus == 2) {
            this.btn_bet.node.active = true;
            this.btn_bet_cancel.node.active = false;
            this.btn_bet.node.getChildByName("Background").getComponent(cc.Sprite).spriteFrame = this.orangeSpriteFrame;
            this.lab_bet_tip.string = "Cash Out";
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
        let finalValue = value * this.curBet;
        this.lab_curBet2.string = finalValue.toFixed(2);

        if (this.toggle_isAuto.isChecked) { //自动下注 需要判断是否达到设置的倍率
            let curValue = Number(this.edit_Mult.string);
            if(value == curValue){
                if (GlobalCfg.ACT_SCENE_CTRL.betStatus == 1) { //飞行阶段 点击下注按钮 说明是要领取奖励
                    this.sendGetCashMessage();
                    if (this.autoCount > 0) {
                        this.btn_bet.node.active = false;
                        this.btn_bet_cancel.node.active = true;
                        this.node_waitnextround.active = true;
                        this.betStatus = 1;
                    }
                    else
                        this.Init();
                }
            }
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
            this.curBet += 10;
            if (this.curBet > this.maxBet)
                this.curBet = this.maxBet;
        } else if (type == 2) {
            this.curBet -= 10;
            if (this.curBet < 10)
                this.curBet = 10;
        }
        this.lab_curBet1.string = this.curBet + ".00";
        this.lab_curBet2.string = this.curBet + ".00";
    },

    dealQuickBetEvent: function (type) {
        if (this.choiceQuickIndex == type) { //如果是上次选择的索引，则直接相加
            this.curBet += this.quickBetStr[type];
            if (this.curBet > this.maxBet)
                this.curBet = this.maxBet;

            this.lab_curBet1.string = this.curBet + ".00";
            this.lab_curBet2.string = this.curBet + ".00";
        }
        else{
            this.choiceQuickIndex = type;
            this.curBet = this.quickBetStr[type];
            this.lab_curBet1.string = this.quickBetStr[type] + ".00";
            this.lab_curBet2.string = this.quickBetStr[type] + ".00";
        }
    },

    dealBetEvent: function () {
        if (this.betStatus == 0) {//可下注状态
            let num = this.curBet * 100;
            if (num > GlobalCfg.USER_DATAS.userDiamond) {
                CommonFun.getInstance().showMsgBox('Your cash is insufficient, Please recharge in time!', "SHOP", () => {
                    CommonFun.getInstance().showSmallAddCash()
                }, false);
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
        GameServerManager.send("gameservice.cash", "CashReq", {
            x: Math.round(_time * 1000),
            mul: Math.round(Number(_mul) * 1000),
            pos: this.root_index
        });
    },

    sendBetReq: function () {
        let amount = this.curBet * 100;
        if (amount > GlobalCfg.USER_DATAS.userDiamond) {
            CommonFun.getInstance().showMsgBox('Your cash is insufficient, Please recharge in time!', "SHOP", () => {
                CommonFun.getInstance().showSmallAddCash()
            }, false);
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
        GlobalCfg.ACT_SCENE_CTRL.openAutoSetting(this.root_index);
    },

    //取消自动下注
    dealStopAutoEvent: function () {
        this.autoCount = 0;
        this.btn_stopAuto.node.active = false;
        this.btn_autoplay.node.active = true;
        this.toggle_isAuto.enabled = true;
        this.setButtonEnabled(true);
        this.Init();
    },
    
    setButtonEnabled: function (enabled) {
        this.btn_add.interactable = enabled;
        this.btn_att.interactable = enabled;
        for (let i = 0; i < this.btn_bet_quicks.length; i++) {
            this.btn_bet_quicks[i].interactable = enabled;
        }
    },

    //设置自动下注次数
    setAutoInfo: function (count) {
        this.autoCount = count; //自动下注次数
        this.btn_stopAuto.node.active = true;
        this.btn_autoplay.node.active = false;
        this.label_autoCount.string = `stop (${this.autoCount})`;
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
            this.node_betinfo.position = toggleName == "tog_bet" ? cc.v2(0, 0) : cc.v2(0, 15);
        };
        if (this.node_autoinfo) {
            this.node_autoinfo.active = toggleName == "tog_auto";
        };
        this.NowToggleName = toggleName
    },
});
