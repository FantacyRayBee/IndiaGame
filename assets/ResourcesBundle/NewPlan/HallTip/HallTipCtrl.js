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
        let txtstring = "New adress：'"+ data.url + "' \n Due to server upgrade, a new installation package needs to be downloaded. Please go to 'tmaxter. in' to download the new installation package."
        this.txt_content.string = txtstring;
    },

    bntclick: function (button) {
        GlobalCfg.G_COMPONENTS.Audio.playBack();
        //跳转URL
        cc.sys.openURL(this.data.url);
    },
});
