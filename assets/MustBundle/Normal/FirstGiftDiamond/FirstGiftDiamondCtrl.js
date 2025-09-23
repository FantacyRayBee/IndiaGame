cc.Class({
    extends: cc.Component,

    properties: {
        
        btn_get: {
            default: null,
            type: cc.Button
        },

        btn_close: {
            default: null,
            type: cc.Button
        },

        lab_diamond: {
            default: null,
            type: cc.Label
        },

        lab_diamondMini: {
            default: null,
            type: cc.Label
        },
    },

    onLoad () {
        CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.SHOW_CASH_GIFT);
        let languagesType = I18NUtil.getInstance().getLanguageType();
        switch (languagesType) {
            case I18NLanguagesEnum.English:
                this.lab_diamondMini.node.setPosition(cc.v2(89, 76));
                break;
            case I18NLanguagesEnum.Hindi:
                this.lab_diamondMini.node.setPosition(cc.v2(115, 76));
                break;
            case I18NLanguagesEnum.Urdu:
                this.lab_diamondMini.node.setPosition(cc.v2(95, 76));
                break;
            case I18NLanguagesEnum.Bengali:
                this.lab_diamondMini.node.setPosition(cc.v2(115, 76));
                break;
            default:
                this.lab_diamondMini.node.setPosition(cc.v2(115, 76));
                break;
        };
        this.lab_diamond.string = `$${GlobalCfg.USER_DATAS.firstGiftDiamond/100}`;
        this.lab_diamondMini.string = `Get $${GlobalCfg.USER_DATAS.firstGiftDiamond/100} for free`;
        this.btn_get.node.on("click", CommonFun.getInstance().debounce(this.btnClick, 1), this);
        this.btn_close.node.on("click", CommonFun.getInstance().debounce(this.btnClick, 1), this);
    },

    btnClick: function(btn) {
        GlobalCfg.G_COMPONENTS.Audio.playButton();
        CommonFun.getInstance().showRewardsTips([{ id: 10, amount: GlobalCfg.USER_DATAS.firstGiftDiamond / 100 }]);
        GlobalCfg.USER_DATAS.userDiamond += GlobalCfg.USER_DATAS.firstGiftDiamond;
        GlobalCfg.USER_DATAS.firstGiftDiamond = 0;
        ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, {msgCode: GlobalCfg.CLIENT_MSG_ID.GET_FIRST_GIFT_REWARD, msgData: {}});
        // //新手领取奖励之后 需要弹出诱导充值的弹窗
        let data = GlobalCfg.USER_DATAS.inducement;
        let curRound = data.task_info.rounds;
        let time = data.end_time - Date.now();
        let inducementIsOpen = time > 0 && curRound > 0 && GlobalCfg.USER_DATAS.openModules.includes(24);
        if (inducementIsOpen && CommonFun.getInstance().isNeedShowPointToastByHours("Inducement", 4)) {
            CommonFun.getInstance().updateToastLocalStorageByHours("Inducement", 4);
            CommonFun.getInstance().showInducement();
        }
        this.node.destroy();
    },

    onDestroy: function() {
        CommonFun.getInstance().behaviorReporting(GlobalCfg.BEHAVIOR_TYPE.HIDE_CASH_GIFT);
        CommonFun.getInstance().releasePrefab(GlobalCfg.PREFAB_PATH.FIRSTGIFTDIAMOND);
    },
});
