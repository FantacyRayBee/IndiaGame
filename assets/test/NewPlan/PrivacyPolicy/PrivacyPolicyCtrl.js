cc.Class({
    extends: cc.Component,

    properties: {
        btn_close: cc.Button,
        webView: cc.WebView,
    },

    ctor: function() {
        this.url = "";
    },

    onLoad: function() {
        this.webView.url = this.url;
        this.btn_close.node.on("click", () => {
            if (GlobalCfg.G_COMPONENTS.Audio) {
                GlobalCfg.G_COMPONENTS.Audio.playBack();
            };
            CommonFun.getInstance().decVerticalAcc();
            this.node.destroy();
        }, this);
    },

    setUrlType: function (urlType) {
        this.url = urlType === 1 ? "https://download.tpgame.in/whwh/useragreement.html" : "https://download.tpgame.in/whwh/privacy.html";
    },

    onDestroy: function() {
        CommonFun.getInstance().releasePrefab(GlobalCfg.PREFAB_PATH.PRIVACYPOLICY);
       
    },
});