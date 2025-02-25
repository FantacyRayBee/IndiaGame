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
        this.setRewardNum()
    },

    setRewardNum: function () {
        let cfg = JSON.parse(GlobalCfg.USER_DATAS.promoterMainData.rank_reward_cfg)
        LoggerUtil.getInstance().log("caojun cfg === " , cfg);
        
        this.txt_num1.string = CommonFun.getInstance().numberToShow(cfg[1] / 100)
        this.txt_num2.string = CommonFun.getInstance().numberToShow(cfg[2] / 100)
        this.txt_num3.string = CommonFun.getInstance().numberToShow(cfg[3] / 100)
        this.txt_num4.string = CommonFun.getInstance().numberToShow(cfg[4] / 100)
        this.txt_num5.string = CommonFun.getInstance().numberToShow(cfg[11] / 100)
    },

    onDestroy: function () {
        CommonFun.getInstance().releasePrefab(GlobalCfg.PREFAB_PATH.PROMOTERRULE);
    },

    btnClick: function (btn) {
        let btnName = btn.node.name;
        GlobalCfg.G_COMPONENTS.Audio.playButton();
        if (btnName === "btn_close") {
            GlobalCfg.G_COMPONENTS.Audio.playBack();
            this.node.destroy();
            return;
        } 
    },
});