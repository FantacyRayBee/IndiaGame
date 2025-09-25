cc.Class({
    extends: cc.Component,

    properties: {
        btn_close: cc.Button,
        btn_goUpgrade: cc.Button,
    },

    onLoad: function() {
        this.btn_close.node.on("click", CommonFun.getInstance().debounce(this.btnClick, 1), this);
        this.btn_goUpgrade.node.on("click", CommonFun.getInstance().debounce(this.btnClick, 1), this);
    },

    btnClick: function(btn) {
        let btnName = btn.node.name;

        switch (btnName) {
            case "btn_close":
                GlobalCfg.G_COMPONENTS.Audio.playBack();
                this.dealBtnCloseEvent();
                break;
            case "btn_goUpgrade":
                GlobalCfg.G_COMPONENTS.Audio.playButton();
                this.dealBtnGoUpgradeEvent();
                break;
            default:
                break;
        }
    },

    dealBtnCloseEvent: function() {
        this.node.destroy();
    },

    dealBtnGoUpgradeEvent: function() {
        CommonFun.getInstance().showMyVip();
        this.node.destroy();
    },

    onDestroy: function() {
        CommonFun.getInstance().releasePrefab(GlobalCfg.PREFAB_PATH.VIPUPGRADETOAST);
    },
});
