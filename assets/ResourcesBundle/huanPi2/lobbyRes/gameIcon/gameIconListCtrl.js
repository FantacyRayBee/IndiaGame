cc.Class({
    extends: cc.Component,

    properties: {
        content: cc.Node,
        game_content: [cc.Node],
        gamePrefab: cc.Node,
        toggleParent: cc.Node,
        toggles: [cc.Toggle],

        btn_close: cc.Button,
        btn_add: cc.Button,

        lb_coin: cc.Label,
    },
    ctor: function () {
        this.heightList = [];
    },

    onLoad: function () {
        this.customMsgEventHandle = ClientNotify.register(GlobalCfg.MSG_TYPE.clientMsg, this.onEventMsg, this);

        for (var i = 0; i < this.toggles.length; i++) {
            this.toggles[i].node.on('toggle', this.toggleClick, this);
        }

        this.btn_close.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
        this.btn_add.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);

        this.gameConfig = GameManager.getInstance().getGameConfig();
        this.lb_coin.string = CommonFun.getInstance().numberToShow(GlobalCfg.USER_DATAS.userDiamond / 100);
        this.getHeightList()
        this.loadItem();
    },
    
    start: function() {
        this.NowToggleName = "toggle_1"
        this.setViewByToggleName(this.NowToggleName)
    },

    onEventMsg: function(webData, target) {
        let msgId = webData.msgCode;
        if (msgId == GlobalCfg.CLIENT_MSG_ID.CLOSE_SSCGAME_REFRESH_LOBBY) {
            this.lb_coin.string = CommonFun.getInstance().numberToShow(GlobalCfg.USER_DATAS.userDiamond / 100);
        }
    },

    onDestroy: function () {
        ClientNotify.removeByHandle(GlobalCfg.MSG_TYPE.clientMsg, this.customMsgEventHandle);
        CommonFun.getInstance().releasePrefab(GlobalCfg.PREFAB_PATH.GAMEICONLIST);
    },

    loadItem: function () {
        this.game_content[0].removeAllChildren();
        this.game_content[1].removeAllChildren();
        this.game_content[2].removeAllChildren();
        this.game_content[3].removeAllChildren();
        for (var i = 0; i < this.gameConfig['quente'].length; i++) {
            let data = this.gameConfig['quente'][i];
            let pab_player = cc.instantiate(this.gamePrefab);
            pab_player.active = true;
            pab_player.setPosition(0, 0);
            let ctrl = pab_player.getComponent('gameIconCtrl');
            ctrl.setItemData(data.gameID, data.isVertical)
            this.game_content[0].addChild(pab_player);
        }
        for (var i = 0; i < this.gameConfig['JL'].length; i++) {
            let data = this.gameConfig['JL'][i];
            let pab_player = cc.instantiate(this.gamePrefab);
            pab_player.active = true;
            pab_player.setPosition(0, 0);
            let ctrl = pab_player.getComponent('gameIconCtrl');
            ctrl.setItemData(data.gameID, data.isVertical)
            this.game_content[3].addChild(pab_player);
        }
        for (var i = 0; i < this.gameConfig['PP'].length; i++) {
            let data = this.gameConfig['PP'][i];
            let pab_player = cc.instantiate(this.gamePrefab);
            pab_player.active = true;
            pab_player.setPosition(0, 0);
            let ctrl = pab_player.getComponent('gameIconCtrl');
            ctrl.setItemData(data.gameID, data.isVertical)
            this.game_content[2].addChild(pab_player);
        }
        for (var i = 0; i < this.gameConfig['PG'].length; i++) {
            let data = this.gameConfig['PG'][i];
            let pab_player = cc.instantiate(this.gamePrefab);
            pab_player.active = true;
            pab_player.setPosition(0, 0);
            let ctrl = pab_player.getComponent('gameIconCtrl');
            ctrl.setItemData(data.gameID, data.isVertical)
            this.game_content[1].addChild(pab_player);
        }
    },

    getHeightList:function(){
        let spacing = 5; //间距
        this.heightList[0] = 0;
        this.heightList[1] = spacing + this.heightList[0] + this.getHeightByItemNum(this.gameConfig['quente'].length);
        this.heightList[2] = spacing + this.heightList[1] + this.getHeightByItemNum(this.gameConfig['PG'].length);
        this.heightList[3] = spacing + this.heightList[2] + this.getHeightByItemNum(this.gameConfig['PP'].length);

        LoggerUtil.getInstance().log('caojun heightList = ', this.heightList);
    },

    // 根据item的数量计算高度
    getHeightByItemNum: function(itemNum) {
        let col = Math.ceil(itemNum / 4); // 得出行数
        let spacing = 20 * (col - 1); // 行间距
        let itemHeight = 160;
        let top = 10;
        let bottom = 10;
        let titleImgHeight = 75;
        let height = titleImgHeight + top + bottom + (col * itemHeight) + spacing;  // 每行4个，向上取整
        return height;
    },

    btnClick: function(btn) {
        let btnName = btn.node.name;
        if (btnName === "btn_close") {
            GlobalCfg.G_COMPONENTS.Audio.playBack();
            this.node.destroy();
            CommonFun.getInstance().decVerticalAcc();
            ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, {
                msgCode: "CLOSE_GAMEICONLIST",
                msgData: {}
            });
            return;
        } 
        if (btnName === "btn_add") {
            this.dealBtnAddEvent();
        } 
        GlobalCfg.G_COMPONENTS.Audio.playButton();
    },

    toggleClick: function(toggle) {
        GlobalCfg.G_COMPONENTS.Audio.playButton();
        let toggleName = toggle.node.name;
        this.setViewByToggleName(toggleName);
    },

    dealBtnAddEvent: function() {
        if (!GlobalCfg.USER_DATAS.openModules.includes(4)) {
            CommonFun.getInstance().showMsgBox("Not yet open", "YES_ON", () => { }, false);
            return
        };
        CommonFun.getInstance().showNewShop(true);
    },

    setViewByToggleName(toggleName) {
        if(toggleName == this.NowToggleName)
            return

        for (let i = 0; i < this.game_content.length; i++) {
            let _toggleName = "toggle_" + (i + 1)
            if (_toggleName == toggleName) {
                this.content.position = cc.v2(0, this.heightList[i]);
            };
        }
        this.NowToggleName = toggleName
    },
});