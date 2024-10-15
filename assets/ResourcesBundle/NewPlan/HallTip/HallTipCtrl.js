cc.Class({
    extends: cc.Component,

    properties: {
        btn_go: cc.Button,
    },

    onLoad: function() {
        this.btn_go.node.on('click', this.bntclick, this);
    },

    onDestroy: function() {
        CommonFun.getInstance().releasePrefab(GlobalCfg.PREFAB_PATH.HALLTIP);
    },

    bntclick: function (button) {
        GlobalCfg.G_COMPONENTS.Audio.playBack();
        //跳转URL
        cc.sys.openURL(GlobalCfg.Forced_Migration);
    },
});
