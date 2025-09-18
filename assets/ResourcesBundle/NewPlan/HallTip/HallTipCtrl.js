cc.Class({
    extends: cc.Component,

    properties: {
        btn_go: cc.Button,
        txt_content: cc.Label,
    },

    onLoad: function() {
        this.btn_go.node.on('click', this.bntclick, this);
    },

    onDestroy: function() {
        CommonFun.getInstance().releasePrefab(GlobalCfg.PREFAB_PATH.HALLTIP);
    },

    setHallTipData: function(data) {
        this.data = data
        let txtstring = "Due to service upgrades, please download the latest version. If you cannot install it after downloading, please uninstall the old version and install it again."
        this.txt_content.string = txtstring;
    },

    bntclick: function (button) {
        GlobalCfg.G_COMPONENTS.Audio.playBack();
        //跳转URL
        cc.sys.openURL(this.data.url);
    },
});
