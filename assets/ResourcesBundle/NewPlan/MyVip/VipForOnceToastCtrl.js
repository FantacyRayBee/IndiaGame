cc.Class({
    extends: cc.Component,

    properties: {
        btn_close: cc.Button,
        btn_tips: cc.Button,
        btn_pay: cc.Button,

        lab_upgradeBagAmount: cc.Label,
        lab_upgradeBagGift: cc.Label,
        lab_upgradeBagBtnAmount: cc.Label,
    },

    onLoad: function() {
        this.setLabs();

        this.btn_close.node.on("click", CommonFun.getInstance().debounce(this.btnClick, 1), this);
        this.btn_tips.node.on("click", CommonFun.getInstance().debounce(this.btnClick, 1), this);
        this.btn_pay.node.on("click", CommonFun.getInstance().debounce(this.btnClick, 1), this);


        this.btn_pay.node.runAction(cc.repeatForever(cc.sequence(cc.scaleTo(.5, .8), cc.scaleTo(.5, 1))));
    },

    setLabs: function() {
        this.lab_upgradeBagAmount.string = `₹${GlobalCfg.USER_DATAS.userVip.upgrade_bag_amount/100}`;
        this.lab_upgradeBagGift.string = `₹${(GlobalCfg.USER_DATAS.userVip.upgrade_bag_dgift + GlobalCfg.USER_DATAS.userVip.upgrade_bag_amount)/100}`;
        this.lab_upgradeBagBtnAmount.string = `${GlobalCfg.USER_DATAS.userVip.upgrade_bag_amount/100}`
    },

    btnClick: function(btn) {
        let btnName = btn.node.name;
        switch (btnName) {
            case "btn_close":
                GlobalCfg.G_COMPONENTS.Audio.playBack();
                this.node.destroy();
                return;
            case "btn_tips":
                this.dealBtnTipsEvent();
                break;
            case "btn_pay":
                this.dealBtnPayEvent();
                break;
            default:
                break;
        }
        GlobalCfg.G_COMPONENTS.Audio.playButton();
    },

    dealBtnTipsEvent: function() {
        CommonFun.getInstance().showVipRules("levelUpGift");
        this.node.destroy();
    },

    dealBtnPayEvent: function() {
        SHOPPING.from = GlobalCfg.SHOP_RECHARGE_FROM.VipOnceToast;;
        let _cb = ()=>{
            if (CommonFun.getInstance().isValidForScr(this)) {
                this.node.destroy();
            };
        };
        
        let rechargeNeedInfo = CommonFun.getInstance().getAppConfigValueByKey('Recharge_Need_Info', false);
        if (rechargeNeedInfo) {
            if (GlobalCfg.USER_DATAS.phone.length > 0 && GlobalCfg.USER_DATAS.mail.length > 0) {
                CommonFun.getInstance().rechargeByCommodityId(GlobalCfg.USER_DATAS.userVip.upgrade_bag_id, SHOPPING.from, _cb);
            }
            else {
                CommonFun.getInstance().showBindPhone('AddCash');
            };
        }
        else {
            CommonFun.getInstance().rechargeByCommodityId(GlobalCfg.USER_DATAS.userVip.upgrade_bag_id, SHOPPING.from, _cb);
        };
    },

    onDestroy: function() {
        CommonFun.getInstance().releasePrefab(GlobalCfg.PREFAB_PATH.VIPFORONCETOAST);
    },
});
