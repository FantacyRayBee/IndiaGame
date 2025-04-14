cc.Class({
    extends: cc.Component,

    properties: {
        game_content: [cc.Node],
        gamePrefab: cc.Node,
        toggleParent: cc.Node,
        toggles: [cc.Toggle],
        game_scroll: cc.ScrollView,
    },
    ctor: function () {

    },

    onLoad: function () {
        for (var i = 0; i < this.toggles.length; i++) {
            this.toggles[i].node.on('toggle', this.toggleClick, this);
        }
        this.loadItem();
    },
    
    start: function() {
        this.NowToggleName = "toggle_1"
        this.setViewByToggleName(this.NowToggleName)
    },

    onDestroy: function () {
    },

    loadItem: function () {
        LoggerUtil.getInstance().log("caojun 游戏配置：", GameManager.getInstance().getGameConfig());
        let gameConfig = GameManager.getInstance().getGameConfig();
        this.game_content[1].removeAllChildren();
        this.game_content[2].removeAllChildren();
        this.game_content[3].removeAllChildren();
        for (var i = 0; i < gameConfig['PG'].length; i++) {
            let data = gameConfig['PG'][i];
            let pab_player = cc.instantiate(this.gamePrefab);
            pab_player.active = true;
            pab_player.setPosition(0, 0);
            let ctrl = pab_player.getComponent('gameIconCtrl');
            ctrl.setItemData(data.gameID, data.isVertical)
            this.game_content[1].addChild(pab_player);
        }
        for (var i = 0; i < gameConfig['JL'].length; i++) {
            let data = gameConfig['JL'][i];
            let pab_player = cc.instantiate(this.gamePrefab);
            pab_player.active = true;
            pab_player.setPosition(0, 0);
            let ctrl = pab_player.getComponent('gameIconCtrl');
            ctrl.setItemData(data.gameID, data.isVertical)
            this.game_content[2].addChild(pab_player);
        }
        for (var i = 0; i < gameConfig['PP'].length; i++) {
            let data = gameConfig['PP'][i];
            let pab_player = cc.instantiate(this.gamePrefab);
            pab_player.active = true;
            pab_player.setPosition(0, 0);
            let ctrl = pab_player.getComponent('gameIconCtrl');
            ctrl.setItemData(data.gameID, data.isVertical)
            this.game_content[3].addChild(pab_player);
        }
    },

    toggleClick: function(toggle) {
        GlobalCfg.G_COMPONENTS.Audio.playButton();
        let toggleName = toggle.node.name;
        this.setViewByToggleName(toggleName);
    },

    setViewByToggleName(toggleName) {
        if(toggleName == this.NowToggleName)
            return

        for (let i = 0; i < this.game_content.length; i++) {
            if (this.game_content[i]) {
                let _toggleName = "toggle_" + (i + 1)
                this.game_content[i].active = toggleName == _toggleName;
            };
        }

        for (let i = 0; i < this.game_content.length; i++) {
            if (this.game_content[i].active == true) {
                this.game_scroll.content = this.game_content[i];
                break;
            }
        }
        this.NowToggleName = toggleName
    },

});