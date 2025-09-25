

cc.Class({
    extends: cc.Component,

    properties: {
        btn_closeMenu: cc.Button,
        btn_outToLobby: cc.Button,
        btn_switchTable: cc.Button,
        btn_howToPlay: cc.Button,
        btn_setting: cc.Button,

        node_openMenuBg: cc.Node,
    },

    ctor: function() {
        this.node_openMenuBg_initX = 0;
    },


    onLoad: function() {
        let w = cc.view.getVisibleSize().width;
        this.node_openMenuBg_initX = -(w / 2 - this.node_openMenuBg.width / 2);
        this.node_openMenuBg.setPosition(cc.v2(this.node_openMenuBg_initX, 780));
        this.node_openMenuBg.active = true;
        
        this.node.on('click', CommonFun.getInstance().debounce(() => {
            this.closeMenuAct();
        }, 0.5), this);
        this.btn_closeMenu.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 0.5), this);
        this.btn_outToLobby.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 0.5), this);
        this.btn_switchTable.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 0.5), this);
        this.btn_howToPlay.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 0.5), this);
        this.btn_setting.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 0.5), this);

        this.openMenuAct();
    },


    btnClick: function(btn) {
        let btnName = btn.node.name;
        switch (btnName) {
            case this.btn_closeMenu.node.name:
                this.dealBtnCloseMenuEvent();
                GlobalCfg.G_COMPONENTS.Audio.playBack();
                return;
            case this.btn_outToLobby.node.name:
                GlobalCfg.G_COMPONENTS.Audio.playBack();
                this.dealBtnOutToLobbyEvent();
                return;
            case this.btn_switchTable.node.name:
                this.dealBtnSwitchTableEvent();
                break;
            case this.btn_howToPlay.node.name:
                this.dealBtnHowToPlayEvent();
                break;
            case this.btn_setting.node.name:
                this.dealBtnSettingEvent();
                break;
            default:
                break;
        }
        GlobalCfg.G_COMPONENTS.Audio.playButton();
    },


    dealBtnCloseMenuEvent: function() {
        this.closeMenuAct();
    },


    dealBtnOutToLobbyEvent: function() {
        this.closeMenuAct(() => {
            ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, {msgCode: GlobalCfg.CLIENT_MSG_ID.GAME_MENU_CLICK_OUT_TO_LOBBY, msgData: {}});
        });
    },


    dealBtnSwitchTableEvent: function() {
        this.closeMenuAct(() => {
            ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, {msgCode: GlobalCfg.CLIENT_MSG_ID.GAME_MENU_CLICK_SWITCH_TABLE, msgData: {}});
        });
    },


    dealBtnHowToPlayEvent: function() {
        this.closeMenuAct(() => {
            ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, {msgCode: GlobalCfg.CLIENT_MSG_ID.GAME_MENU_CLICK_HOW_TO_PLAY, msgData: {}});
        });
    },

    dealBtnSettingEvent: function() {
        this.closeMenuAct();
        CommonFun.getInstance().showGameSetting();
    },

    closeMenuAct: function(callback) {
        cc.tween(this.node_openMenuBg)
        .to(0.1, {position: cc.v2(this.node_openMenuBg_initX, 780)}, {easing: 'smooth'})
        .call(() => {
            callback && callback();
            this.node.destroy();
        })
        .start()
    },
    

    openMenuAct: function() {
        cc.tween(this.node_openMenuBg)
        .to(0.1, {position: cc.v2(this.node_openMenuBg_initX, 0)}, {easing: 'smooth'})
        .start()
    },

    setSwitchTableBtnActive: function(active) {
        this.btn_switchTable.node.active = active;
    },

    
    onDestroy: function() {
        CommonFun.getInstance().releasePrefab(GlobalCfg.PREFAB_PATH.GAMEMENU);
        ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, {msgCode: GlobalCfg.CLIENT_MSG_ID.GAME_MENU_CLOSE, msgData: {}});
    },
});
