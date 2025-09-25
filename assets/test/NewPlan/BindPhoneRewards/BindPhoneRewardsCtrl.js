cc.Class({
    extends: cc.Component,

    properties: {
        btn_close: cc.Button,
        btn_bd: cc.Button,
        zhuNode: cc.Node,
    },

    onLoad: function() {
        this.btn_bd.node.on('click', this.bntclick, this);
        this.btn_close.node.on('click', this.bntclick, this);
    },

    onDestroy: function() {
        CommonFun.getInstance().releasePrefab(GlobalCfg.PREFAB_PATH.BINDPHONEREWARDS);
    },

    bntclick: function (button) {
        let btnName = button.node.name;
        if (btnName === "btn_close") {
            GlobalCfg.G_COMPONENTS.Audio.playBack();
            this.node.destroy()
        } else{
            GlobalCfg.G_COMPONENTS.Audio.playButton();
            if (btnName === "btn_binding") {
                CommonFun.getInstance().showBindPhone('Lobby');
                this.node.destroy();
            }
        } 
    },
});
