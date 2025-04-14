cc.Class({
    extends: cc.Component,

    properties: {
        btn_close: cc.Button,
        webview: cc.WebView,
    },

    ctor() {
    },

    onLoad: function() {
        this.btn_close.node.zIndex = 100;
        this.btn_close.node.on('click', CommonFun.getInstance().debounce(this.bntclick, 1), this);
    },


    setURL(url){
        this.webview.url = url;
    },

    onDestroy: function () {
    },

    bntclick: function (button) {
        LoggerUtil.getInstance().log("caojun 按钮点击");
        let btnName = button.node.name;
        if (btnName === "btn_close") {
            GlobalCfg.G_COMPONENTS.Audio.playBack();
            this.node.destroy();
            SceneManager.getInstance().changeScene(SceneManager.getInstance().sceneType.WEBVIEW, SceneManager.getInstance().sceneType.LOBBY);
        }
    },
});
