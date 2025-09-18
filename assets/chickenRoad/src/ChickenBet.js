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
        this.btn_withdraw.node.on('click', this.onWithDrawClick, this);
        this.btn_auto.node.on('click', this.onAutoClick, this);
        this.btn_cancelAuto.node.on('click', this.onAutoCancelClick, this);
        this.btn_go.node.on('click', CommonFun.getInstance().debounce(this.onMoveClick, 1.2), this);

        this.tog_difficulty1.node.on('toggle', this.toggleClick, this);
        this.tog_difficulty2.node.on('toggle', this.toggleClick, this);
        this.tog_difficulty3.node.on('toggle', this.toggleClick, this);
        this.tog_difficulty4.node.on('toggle', this.toggleClick, this);

        let playNode = this.btn_play.node.getChildByName("play");
        let pauseNode = this.btn_play.node.getChildByName("pause");
        let labAutoCountNode = this.lab_autoTime.node;  // 如果 lab_autoTime 是 cc.Label
        const scene = GlobalCfg.ACT_SCENE_CTRL;
        // 鼠标进入按钮区域
        this.btn_play.node.on(cc.Node.EventType.MOUSE_ENTER, () => {
            if(scene.isAutoGame){
                labAutoCountNode.active = false;
                playNode.active = scene.isPause;
                pauseNode.active = !scene.isPause;
            }
        });
        // 鼠标移出按钮区域
        this.btn_play.node.on(cc.Node.EventType.MOUSE_LEAVE, () => {
            labAutoCountNode.active = true;
            playNode.active = false;
            pauseNode.active = false;
        });
    },

    start() {
        this.quickBetStr = [1000, 2000, 5000, 10000];
        this.minBet = 1000;
        this.maxBet = 100000;
        this.curBet = 1000;

        this.NowToggleName = "tog_difficulty1";
        this.setViewByToggleName(this.NowToggleName);
        this.init();
    },

    init() {
        this.btn_play.node.active = true;
        this.btn_auto.node.active = true;
        this.btn_go.node.active = false;
        this.btn_withdraw.node.active = false;
        this.btn_cancelAuto.node.active = false;
        this.lab_autoTime.string = "GO";
        this.edit_Bet.string = this.curBet / 100;
    },

    // ====== 下注按钮 ======
    btnClick(btn) {
        GlobalCfg.G_COMPONENTS.Audio.playButton();
        const n = btn.node.name;
        if (n === "btn_min") {
            this.dealBetChangeEvent(2);
        } else if (n === "btn_max") {
            this.dealBetChangeEvent(1);
        } else if (n === "btn_bet_quick1") {
            this.dealQuickBetEvent(0);
        } else if (n === "btn_bet_quick2") {
            this.dealQuickBetEvent(1);
        } else if (n === "btn_bet_quick3") {
            this.dealQuickBetEvent(2);
        } else if (n === "btn_bet_quick4") {
            this.dealQuickBetEvent(3);
        }
    },

    dealBetChangeEvent(type) {
        let curBet = (type === 1) ? this.maxBet : this.minBet;
        this.edit_Bet.string = curBet / 100
    },

    dealQuickBetEvent(idx) {
        let curBet = this.quickBetStr[idx];
        this.edit_Bet.string = curBet / 100
    },

    // ====== 按钮交互 ======
    onPlayClick() {
        const scene = GlobalCfg.ACT_SCENE_CTRL;
        if (!scene) return;
        if (scene.isAutoGame) {
            scene.togglePause();
            return;
        }
        if (this.curBet > GlobalCfg.USER_DATAS.userDiamond) {
            CommonFun.getInstance().showMsgBox('Your cash is insufficient, Please recharge in time!', "SHOP", () => {
                CommonFun.getInstance().showSmallAddCash()
            }, false);
            return;
        }
        scene.startGame();
        this.setButtonEnabled(false);
        this.btn_play.node.active = false;
        this.btn_auto.node.active = false;
        this.btn_go.node.active = true;
        this.btn_withdraw.node.active = true;
    },

    onMoveClick() {
        const scene = GlobalCfg.ACT_SCENE_CTRL;
        if (scene) scene.sendMove();
    },

    onWithDrawClick() {
        const scene = GlobalCfg.ACT_SCENE_CTRL;
        if (scene) scene.withDraw();
    },

    onAutoClick() {
        const scene = GlobalCfg.ACT_SCENE_CTRL;
        if (scene) scene.showAutoSetting();
    },

    onAutoCancelClick() {
        const scene = GlobalCfg.ACT_SCENE_CTRL;
        if (scene) scene.stopAutoSchedule(true);
    },

    // ====== 控件状态 ======
    setButtonEnabled(enabled) {
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

    setPlayButtonEnabled(enabled) {
        this.btn_play.interactable = enabled;
        this.btn_auto.interactable = enabled;
        this.btn_go.interactable = enabled;
        this.btn_withdraw.interactable = enabled;
    },

    setMultiplier(curWinMoney) {
        let ret = curWinMoney / 100;
        this.lab_withdraw.string = CommonFun.getInstance().fixed(ret) + " INR";
    },

    getCurBet() { return this.curBet; },

    // ====== 自动模式 UI ======
    startAutoGame(autoTime) {
        this.btn_play.node.active = true;
        this.btn_auto.node.active = false;
        this.btn_withdraw.node.active = false;
        this.btn_go.node.active = false;
        this.btn_cancelAuto.node.active = true;

        // ★ 次数显示逻辑
        this.lab_autoTime.string = autoTime > 0 ? autoTime.toString() : "GO";
    },

    endAutoGame(isGameing) {
        if (isGameing) {
            this.btn_play.node.active = false;
            this.btn_auto.node.active = false;
            this.btn_withdraw.node.active = true;
            this.btn_go.node.active = true;
        }
        else{
            this.btn_play.node.active = true;
            this.btn_auto.node.active = true;
            this.btn_withdraw.node.active = false;
            this.btn_go.node.active = false;
        }
        this.btn_cancelAuto.node.active = false;
        this.lab_autoTime.string = "GO";
    },

    // ====== 难度切换 ======
    toggleClick(toggle) {
        GlobalCfg.G_COMPONENTS.Audio.playButton();
        this.setViewByToggleName(toggle.node.name);
    },

    setViewByToggleName(toggleName) {
        if (toggleName === this.NowToggleName) return;

        let difficulty = 0;
        if (toggleName === 'tog_difficulty1') difficulty = 0;
        else if (toggleName === 'tog_difficulty2') difficulty = 1;
        else if (toggleName === 'tog_difficulty3') difficulty = 2;
        else if (toggleName === 'tog_difficulty4') difficulty = 3;

        this.NowToggleName = toggleName;
        GlobalCfg.ACT_SCENE_CTRL.setDiffculty(difficulty);
    },

    update(){
        this.curBet = parseInt(this.edit_Bet.string) * 100;
    }
});
