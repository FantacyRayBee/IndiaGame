cc.Class({
    extends: cc.Component,

    properties: {
        btn_close: cc.Button,
        txt_num1:cc.Label,
        txt_num2:cc.Label,
        txt_num3:cc.Label,
        txt_num4:cc.Label,
        txt_num5:cc.Label,
    },
    onLoad: function () {
        this.btn_close.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
    },

    onDestroy: function () {
        CommonFun.getInstance().releasePrefab(GlobalCfg.PREFAB_PATH.PROMOTERRULE);
    },

    btnClick: function (btn) {
        let btnName = btn.node.name;
        if (btnName === "btn_close") {
            GlobalCfg.G_COMPONENTS.Audio.playBack();
            this.node.destroy();
            return;
        } 
    },
});