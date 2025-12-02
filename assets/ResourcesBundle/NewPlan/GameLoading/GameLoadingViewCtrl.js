cc.Class({
    extends: cc.Component,

    properties: {
        hor_node: cc.Node,
        ver_node: cc.Node,

        hor_sprites: [cc.SpriteFrame],
        ver_sprites: [cc.SpriteFrame],

        img_background: cc.Sprite,
    },


    onLoad: function () {
        this.progressBar_hor = this.node.getChildByName("hor").getComponent(cc.ProgressBar);
        this.progressBar_ver = this.node.getChildByName("ver").getComponent(cc.ProgressBar);

        this.labBar_hor = this.node.getChildByName("hor").getChildByName("lab").getComponent(cc.Label);
        this.labBar_ver = this.node.getChildByName("ver").getChildByName("lab").getComponent(cc.Label);

        this.customMsgEventHandle = ClientNotify.register(GlobalCfg.MSG_TYPE.clientMsg, this.onEventMsg, this);
        this.msgHandle = ClientNotify.register(GlobalCfg.MSG_TYPE.serverMsg, this.onEventMsg, this);
    },

    init: function (isVertical, callback) {
        this.LoadCompletedCallback = callback;
        this.hor_node.active = !isVertical;
        this.ver_node.active = isVertical;
    },

    onEventMsg: function (webData, target) {
        let self = target;
        let msgId = webData.msgCode;
        let notify = webData.msgData;
        LoggerUtil.getInstance().log("msgId === ", msgId);
        if (msgId == GlobalCfg.CLIENT_MSG_ID.GD_SMALLGAME_LOAD_PROGRESS) {
            self.setSmallGameLoadProgress(notify);
        }
        else if (msgId == GlobalCfg.CLIENT_MSG_ID.GD_SMALLGAME_LOAD_COMPLETE) {
            self.setSmallGameLoadComplete(notify);
        } 
        else if (msgId == GlobalCfg.CLIENT_MSG_ID.CHANGE_SCENE_COMPLETE) {
            this.node.destroy();
        }
    },

    setSmallGameLoadProgress: function (notify) {
        if (!notify) {
            return;
        };
        let progress = notify.progress;
        this.setUpdateProgressBarProgress(progress / 100);
        this.labBar_hor.string = `${progress}%`;
        this.labBar_ver.string = `${progress}%`;
    },

    setSmallGameLoadComplete: function(notify) {
        if (!notify) {
            return;
        };
        if (this.LoadCompletedCallback) {
            this.LoadCompletedCallback();
            this.LoadCompletedCallback = null;
        }
    },

    setUpdateProgressBarProgress: function (progress = 0) {
        this.progressBar_hor.progress = progress;
        this.progressBar_ver.progress = progress;
    },

    onDestroy: function () {
        CommonFun.getInstance().releasePrefab(GlobalCfg.PREFAB_PATH.GAMELOADING);
        ClientNotify.removeByHandle(GlobalCfg.MSG_TYPE.clientMsg, this.customMsgEventHandle);
        ClientNotify.removeByHandle(GlobalCfg.MSG_TYPE.serverMsg, this.msgHandle);
    },
});
