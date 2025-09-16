cc.Class({
    extends: cc.Component,

    properties: {
        btn_play: cc.Button,
        btn_go: cc.Button,
        btn_withdraw: cc.Button,
        btn_auto: cc.Button,
        btn_cancelAuto: cc.Button,

        btn_min: cc.Button,
        btn_max: cc.Button,
        btn_bet_quicks: [cc.Button],

        node_button: cc.Node,
        lab_curBet: cc.Label,
        lab_withdraw: cc.Label,

        lab_autoTime: cc.Label,

        tog_difficulty1: cc.Toggle,
        tog_difficulty2: cc.Toggle,
        tog_difficulty3: cc.Toggle,
        tog_difficulty4: cc.Toggle,
        edit_Bet: cc.EditBox,

    },

    onLoad() {
        this.btn_min.node.on('click', this.btnClick, this);
        this.btn_max.node.on('click', this.btnClick, this);
        for (let i = 0; i < this.btn_bet_quicks.length; i++) {
            this.btn_bet_quicks[i].node.on('click', this.btnClick, this);
        }

        this.btn_play.node.on('click', this.onPlayClick, this);
        this.btn_go.node.on('click', this.onMoveClick, this);
        this.btn_withdraw.node.on('click', this.onWithDrawClick, this);
        this.btn_auto.node.on('click', this.onAutoClick, this);
        this.btn_cancelAuto.node.on('click', this.onAutoCancelClick, this);
        

        this.tog_difficulty1.node.on('toggle', this.toggleClick, this);
        this.tog_difficulty2.node.on('toggle', this.toggleClick, this);
        this.tog_difficulty3.node.on('toggle', this.toggleClick, this);
        this.tog_difficulty4.node.on('toggle', this.toggleClick, this);
    },

    start() {
        this.quickBetStr = [1000, 2000, 5000, 10000]; //需要除以100
        this.minBet = 1000;
        this.maxBet = 100000;
        this.curBet = 1000;
        this.isPause = false;
        this.NowToggleName = "tog_difficulty1"
        this.setViewByToggleName(this.NowToggleName)
        this.init()
    },

    init(){
        if (this.isAutoGame == true) {
            return; //自动游戏，不初始化
        }
        this.btn_play.node.active = true
        this.btn_auto.node.active = true
        this.btn_go.node.active = false
        this.btn_withdraw.node.active = false
    },

    btnClick: function (btn) {
        let btnName = btn.node.name;
        GlobalCfg.G_COMPONENTS.Audio.playButton();
        if (btnName === "btn_min") {
            this.dealBetChangeEvent(2);
        } 
        else if (btnName === "btn_max") {
            this.dealBetChangeEvent(1);
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
    },

    dealBetChangeEvent: function (type) {
        if (type == 1) {
            this.curBet = this.maxBet;
        } else if (type == 2) {
            this.curBet = this.minBet;
        }
        this.edit_Bet.string = CommonFun.getInstance().fixed(this.curBet / 100);
    },

    dealQuickBetEvent: function (type) {
        this.curBet = this.quickBetStr[type];
        this.edit_Bet.string = CommonFun.getInstance().fixed(this.curBet / 100);
    },

    onPlayClick() {
        if (this.isAutoGame) {
            //如果是自动游戏 逻辑为 暂停
            this.isPause = !this.isPause
            GlobalCfg.ACT_SCENE_CTRL.pauseGame(this.isPause)
        }
        else{
            GlobalCfg.ACT_SCENE_CTRL.startGame()
            this.setButtonEnabled(false)
            this.btn_play.node.active = false
            this.btn_auto.node.active = false
            this.btn_go.node.active = true
            this.btn_withdraw.node.active = true
        }
    },
    onMoveClick() {
        GlobalCfg.ACT_SCENE_CTRL.chickenMove()  
    },

    onWithDrawClick() {
        GlobalCfg.ACT_SCENE_CTRL.withDraw()
    },
    onAutoClick() {
        GlobalCfg.ACT_SCENE_CTRL.showAutoSetting()
    },

    onAutoCancelClick() {
        GlobalCfg.ACT_SCENE_CTRL.stopAutoSchedule()
        this.btn_play.node.active = false
        this.btn_auto.node.active = false
        this.btn_go.node.active = true
        this.btn_withdraw.node.active = true
    },

    setButtonEnabled: function (enabled) {
        this.btn_min.interactable = enabled;
        this.btn_max.interactable = enabled;
        for (let i = 0; i < this.btn_bet_quicks.length; i++) {
            this.btn_bet_quicks[i].interactable = enabled;
        }
        this.edit_Bet.enabled = enabled;
        this.node_button.opacity = enabled ? 255 : 160;
        
        this.tog_difficulty1.interactable = enabled;
        this.tog_difficulty2.interactable = enabled;
        this.tog_difficulty3.interactable = enabled;
        this.tog_difficulty4.interactable = enabled;
    },

    setPlayButtonEnabled: function (enabled) {
        this.btn_play.interactable = enabled;
        this.btn_auto.interactable = enabled;
        this.btn_go.interactable = enabled;
        this.btn_withdraw.interactable = enabled;
    },

    setMultiplier: function (curWinMoney) {
        let ret = curWinMoney / 100;
        this.lab_withdraw.string = CommonFun.getInstance().fixed(ret) + " INR";
    },

    getCurBet: function () {
        return this.curBet;
    },

    toggleClick: function (toggle) {
        GlobalCfg.G_COMPONENTS.Audio.playButton();
        let toggleName = toggle.node.name;
        this.setViewByToggleName(toggleName);
    },

    startAutoGame: function (time) {
        this.isAutoGame = true;
        this.autoTime = time;

        this.btn_play.node.active = true
        this.btn_auto.node.active = false
        this.btn_withdraw.node.active = false
        this.btn_go.node.active = false
        this.btn_cancelAuto.node.active = true
        this.lab_autoTime.string = this.autoTime;
    },


    endAutoGame: function () {
        this.isAutoGame = false;

        this.btn_play.node.active = true
        this.btn_auto.node.active = true
        this.btn_withdraw.node.active = false
        this.btn_go.node.active = false
        this.btn_cancelAuto.node.active = false
        this.lab_autoTime.string = "GO";
    },
    
    setViewByToggleName(toggleName) {
        let difficulty = 0;
        if (toggleName == this.NowToggleName)
            return
        else if (toggleName == 'tog_difficulty1') {
            difficulty = 0;
        } else if (toggleName == 'tog_difficulty2') {
            difficulty = 1;
        } else if (toggleName == 'tog_difficulty3') {
            difficulty = 2;
        } else if (toggleName == 'tog_difficulty4') {
            difficulty = 3;
        }
        this.NowToggleName = toggleName;
        GlobalCfg.ACT_SCENE_CTRL.setDiffculty(difficulty)
    }
});