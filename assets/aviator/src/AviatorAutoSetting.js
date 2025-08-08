

cc.Class({
    extends: cc.Component,

    properties: {
        btn_close: cc.Button,
        btn_reset: cc.Button,
        btn_start: cc.Button,
        btn_counts: [cc.Button],

        node_stops: [cc.Node],

        node_msg: cc.Node,
        lab_msg_context: cc.Label,
        btn_close_msg: cc.Button,
    },

    onLoad() {
        this.btn_close.node.on('click', this.btnClick, this);
        this.btn_reset.node.on('click', this.btnClick, this);
        this.btn_start.node.on('click', this.btnClick, this);
        this.btn_close_msg.node.on('click', this.btnClick, this);
        for (let i = 0; i < this.btn_counts.length; i++) {
            this.btn_counts[i].node.on('click', this.countBtnClick, this);
        }
        this.contextStrs = [
            "please, set number of rounds",
            "Please, specify decrease or exceed stop point",
            "Can't set 0.00 as stop point",
        ]
        this.choiceCountIndex = -1; // 选择的局数索引
        this.choiceCountArr = [10,20,50,100]; // 选择的局数
    },

    start() {
        this.dealResetEvent();
    },
    
    btnClick: function (btn) {
        let btnName = btn.node.name;
        GlobalCfg.G_COMPONENTS.Audio.playButton();
        if (btnName === "btn_close") {
            this.dealCloseEvent();
        } 
        else if (btnName === "btn_reset") {
            this.dealResetEvent();
        }
        else if (btnName === "btn_start") {
            this.dealStartBetEvent();
        }
        else if (btnName === "btn_close_msg") {
            this.node_msg.active = false;
        }
    },

    countBtnClick: function (btn) {
        let btnName = btn.node.name;
        for (let i = 0; i < this.btn_counts.length; i++) {
            this.btn_counts[i].node.getChildByName("click").active = false;
            if (this.btn_counts[i].node.name === btnName) {
                this.btn_counts[i].node.getChildByName("click").active = true;
                this.choiceCountIndex = i;
            }
        }
    },

    dealCloseEvent: function () {
        this.node.active = false;
        this.dealResetEvent();
    },

    dealResetEvent: function () {
        this.choiceCountIndex = -1;
        this.node_msg.active = false;
        for (let i = 0; i < this.node_stops.length; i++) {
            this.node_stops[i].getComponent("AviatorStopItem").reset();
        }
        for (let i = 0; i < this.btn_counts.length; i++) {
            this.btn_counts[i].node.getChildByName("click").active = false;
        }
    },

    dealStartBetEvent: function () {
        if (this.choiceCountIndex == -1) { //如果没有选择倍数
            this.node_msg.active = true;
            this.lab_msg_context.string = this.contextStrs[0];
            return;
        }
        for (let i = 0; i < this.node_stops.length; i++) { //如果有勾选了按钮 但是没有输入金额 也不行
            if (this.node_stops[i].getComponent("AviatorStopItem").isError()) {
                this.node_msg.active = true;
                this.lab_msg_context.string = this.contextStrs[2];
                return;
            }
        }

        //如果没有选择按钮
        if (this.node_stops[0].getComponent("AviatorStopItem").toggle_node.isChecked == false &&
            this.node_stops[2].getComponent("AviatorStopItem").toggle_node.isChecked == false) 
        { //1和3必须勾选一个
            this.node_msg.active = true;
            this.lab_msg_context.string = this.contextStrs[1];
            return;
        }
        let infos = [];
        for (let i = 0; i < this.node_stops.length; i++) {
            infos[i] = this.node_stops[i].getComponent("AviatorStopItem").getInfo();
        }
        GlobalCfg.ACT_SCENE_CTRL.setAutoStatus(infos, this.choiceCountArr[this.choiceCountIndex]);
        this.dealCloseEvent();
    },
});
