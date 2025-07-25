

cc.Class({
    extends: cc.Component,

    properties: {
        tog_allbet: cc.Toggle,
        tog_previous: cc.Toggle,
        tog_top: cc.Toggle,

        node_root1: cc.Node,
        node_root2: cc.Node,
        node_root3: cc.Node,


        btn_provably: cc.Button,
        prefabRule: cc.Prefab,
        prefabProvably: cc.Prefab,
        
    },

    
    onLoad() {
        this.tog_allbet.node.on('toggle', this.toggleClick, this);
        this.tog_previous.node.on('toggle', this.toggleClick, this);
        this.tog_top.node.on('toggle', this.toggleClick, this);

        this.btn_provably.node.on('click', this.onBtnProvably, this);

        this.msgHandle = ClientNotify.register(GlobalCfg.MSG_TYPE.serverMsg, this.onEventMsg, this);
        this.customMsgHandle = ClientNotify.register(GlobalCfg.MSG_TYPE.clientMsg, this.onEventMsg, this);
    },

    start() {
        this.NowToggleName = "tog_allbet"
        this.setViewByToggleName(this.NowToggleName)
    },

    onDestroy() {
        ClientNotify.removeByHandle(GlobalCfg.MSG_TYPE.serverMsg, this.msgHandle);
        ClientNotify.removeByHandle(GlobalCfg.MSG_TYPE.clientMsg, this.customMsgHandle);
    },

    toggleClick: function(toggle) {
        GlobalCfg.G_COMPONENTS.Audio.playButton();
        let toggleName = toggle.node.name;
        this.setViewByToggleName(toggleName);
    },

    setViewByToggleName(toggleName) {
        if(toggleName == this.NowToggleName)
            return
        if (this.node_root1) {
            this.node_root1.active = toggleName == "tog_allbet";
        };
        if (this.node_root2) {
            this.node_root2.active = toggleName == "tog_previous";
        };
        if (this.node_root3) {
            this.node_root3.active = toggleName == "tog_top";
        };
        this.NowToggleName = toggleName
    },

    onBtnProvably: function() {
        let node = cc.instantiate(this.prefabRule);
        node.setPosition(cc.v2(0, 0));
        GlobalCfg.ACT_SCENE_CTRL.popupLayer.addChild(node);
        GlobalCfg.ACT_SCENE_CTRL.popupLayer.active = true;
    },

    onEventMsg(webData, target) {
        let self = target;
        var msgId = webData.msgCode;
        var notify = webData.msgData;
        if (msgId === "gameservice.readandsortranking") {
            //更新排行榜
            self.refreshRank(notify);
        }
        else if (msgId === "gameservice.seed") {
            //玩家seed
            self.refreshSeed(notify);
        }
        else if (msgId === "gameservice.betnotify") {
            //其他玩家下注消息
            self.refreshPlayerBet(notify);
        }
    },

    refreshRank(notify){
        LoggerUtil.getInstance().log("refreshRank", notify);
    },
    refreshSeed(notify){
        let node = cc.instantiate(this.prefabProvably);
        node.setPosition(cc.v2(0, 0));
        node.getComponent("AviatorProvably").init(notify);
        GlobalCfg.ACT_SCENE_CTRL.popupLayer.addChild(node);
        GlobalCfg.ACT_SCENE_CTRL.popupLayer.active = true;
    },
    refreshPlayerBet(notify){
        this.node_root1.getComponent("AviatorRoundRoot1").refreshPlayerBet(notify);
    },
});