

cc.Class({
    extends: cc.Component,

    properties: {
        btn_close: cc.Button,
        btn_reset: cc.Button,
        btn_start: cc.Button,
        btn_counts: [cc.Button],

        node_stops: [cc.Node],
    },

    onLoad() {
        this.btn_close.node.on('click', this.btnClick, this);
        this.btn_reset.node.on('click', this.btnClick, this);
        this.btn_start.node.on('click', this.btnClick, this);
        for (let i = 0; i < this.btn_counts.length; i++) {
            this.btn_counts[i].node.on('click', this.btnClick, this);
        }
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
    },

    dealCloseEvent: function () {
        this.node.active = false;
        this.dealResetEvent();
    },

    dealResetEvent: function () {
        for (let i = 0; i < this.node_stops.length; i++) {
            this.node_stops[i].getComponent("AviatorStopItem").reset();
        }
    },

    dealStartBetEvent: function () {
        let infos = [];
        for (let i = 0; i < this.node_stops.length; i++) {
            infos[i] = this.node_stops[i].getComponent("AviatorStopItem").getInfo();
        }
        GlobalCfg.ACT_SCENE_CTRL.autoInfos = infos;
    },
});
