cc.Class({
    extends: cc.Component,

    properties: {
        btnOK: cc.Button,
        node_ResetWallet: cc.Node,
        node_ToBonus: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.node_ResetWallet.active = GlobalCfg.FIRST_RECHARGE_RETAIN_BONUS > 0 ? false : true;
        this.node_ToBonus.active = GlobalCfg.FIRST_RECHARGE_RETAIN_BONUS > 0 ? true : false;
        this.btnOK.node.on('click', () => {
            GlobalCfg.G_COMPONENTS.Audio.playButton();
            this.node.destroy();
        }, this);
    },

    start() {
    },

    onDestroy() {
        this.unschedule(this.scheduleCallback);
        CommonFun.getInstance().releasePrefab(GlobalCfg.PREFAB_PATH.ADVANCEDMODE);
        CommonFun.getInstance().releasePrefab(GlobalCfg.PREFAB_PATH.ADVANCEDMODE_V);

        // let changed = GlobalCfg.USER_DATAS.changed = notify.deposit; // 变化值
        // let coin = GlobalCfg.USER_DATAS.deposit / 100; //本次充值获得的金币
        // let getBouns = GlobalCfg.USER_DATAS.firstGetBonus/ 100; //本次充值获得的代金券
        // CommonFun.getInstance()._showShopNewTip(changed, coin, getBouns); //显示首充转换界面
    },

    show(bool) {
        GlobalCfg.FIRST_RECHARGE_TIPS_SHOW = false;
        if(bool == true){
            this.btnOK.target.getChildByName('Label').getComponent(cc.Label).string = "Okay";
            this.btnOK.interactable = true;
            return
        }
        this.btnOK.interactable = false;
        let count = 5,time = 5;
        let lab = this.btnOK.target.getChildByName('Label').getComponent(cc.Label);

        this.scheduleCallback = () => {
            time--;
            lab.string = "Okay(" + time + ")";
            if (time == 0) {
                this.btnOK.interactable = true;
            }
        };
        this.schedule(this.scheduleCallback, 1, count - 1);
    },

    // update (dt) {},
});
