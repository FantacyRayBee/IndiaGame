cc.Class({
    extends: cc.Component,

    properties: {
        btn_close: cc.Button,
        btn_addCash: cc.Button,
        btn_otherAmount: cc.Button,
        lab_addCashTips: cc.Label,
    },

    onLoad: function() {
        this.btn_close.node.on("click", CommonFun.getInstance().debounce(this.btnClick, 1), this);
        this.btn_addCash.node.on("click", CommonFun.getInstance().debounce(this.btnClick, 1), this);
        this.btn_otherAmount.node.on("click", CommonFun.getInstance().debounce(this.btnClick, 1), this);
        this.lab_addCashTips.string = `Add cash any amount now to become a VlP player.`;
    },

    btnClick: function(btn) {
        let btnName = btn.node.name;

        switch (btnName) {
            case "btn_close":
                GlobalCfg.G_COMPONENTS.Audio.playBack();
                this.dealBtnCloseEvent();
                break;
            case "btn_addCash":
                GlobalCfg.G_COMPONENTS.Audio.playButton();
                this.dealBtnAddCashEvent();
                break;
            case "btn_otherAmount":
                GlobalCfg.G_COMPONENTS.Audio.playButton();
                this.dealBtnOtherAmountEvent();
                break;
            default:
                break;
        }
    },

    dealBtnCloseEvent: function() {
        this.node.destroy();
    },

    dealBtnAddCashEvent: function() {
        let _cb = ()=>{
        };
        let commoditys = [...GlobalCfg.USER_DATAS.store];
        let commodityId = commoditys[0].id;

        let rechargeNeedInfo = CommonFun.getInstance().getAppConfigValueByKey('Recharge_Need_Info', false);
        if (rechargeNeedInfo) {
            if (GlobalCfg.USER_DATAS.phone.length > 0 && GlobalCfg.USER_DATAS.mail.length > 0) {
                // CommonFun.getInstance().rechargeByCommodityId(commodityId, GlobalCfg.SHOP_RECHARGE_FROM.VipRechargeToast, _cb);
                CommonFun.getInstance().showNewShop(true, GlobalCfg.SHOP_RECHARGE_FROM.VipRechargeToast);
            }
            else {
                CommonFun.getInstance().showFirstRecharge();
            };
        }
        else {
            CommonFun.getInstance().rechargeByCommodityId(commodityId, GlobalCfg.SHOP_RECHARGE_FROM.VipRechargeToast, _cb);
        };
        this.node.destroy();
    },

    dealBtnOtherAmountEvent: function() {
        let rechargeNeedInfo = CommonFun.getInstance().getAppConfigValueByKey('Recharge_Need_Info', false);
        if (rechargeNeedInfo) {
            if (GlobalCfg.USER_DATAS.phone.length > 0 && GlobalCfg.USER_DATAS.mail.length > 0) {
                CommonFun.getInstance().showNewShop(true, GlobalCfg.SHOP_RECHARGE_FROM.VipRechargeToast);
            }
            else {
                CommonFun.getInstance().showBindPhone('AddCash');
                this.node.destroy();
            };
        }
        else {
            CommonFun.getInstance().showNewShop(true, GlobalCfg.SHOP_RECHARGE_FROM.VipRechargeToast);
        };
    },

    onDestroy: function() {
        CommonFun.getInstance().releasePrefab(GlobalCfg.PREFAB_PATH.VIPRECHARGETOAST);
    },
});
