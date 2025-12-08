cc.Class({
    extends: cc.Component,

    properties: {
        btn_addCash1: cc.Button,
        btn_addCash2: cc.Button,
        btn_otherAmount: cc.Button,
        lab_cash1: cc.Label,
        lab_cash2: cc.Label,
        lab_bonus1: cc.Label,
        lab_bonus2: cc.Label,
        lab_totalGet1: cc.Label,
        lab_totalGet2: cc.Label,
        lab_addCash1: cc.Label,
        lab_addCash2: cc.Label,
        lab_percent1: cc.Label,
        lab_percent2: cc.Label,
    },

    onLoad: function() {
        this.btn_addCash1.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
        this.btn_addCash2.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
        this.btn_otherAmount.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);

        this.lab_cash1.string = "";
        this.lab_cash2.string = "";
        this.lab_bonus1.string = "";
        this.lab_bonus2.string = "";
        this.lab_totalGet1.string = "";
        this.lab_totalGet2.string = "";
        this.lab_addCash1.string = "";
        this.lab_addCash2.string = "";
        this.lab_percent1.string = "";
        this.lab_percent2.string = "";
    },

    start () {
        LoggerUtil.getInstance().log("caojun 222 first_pay_product: ", GlobalCfg.USER_DATAS.first_pay_product);

        let commodity = GlobalCfg.USER_DATAS.first_pay_product.sort((a, b) => {
            return a.amount - b.amount;
        });
        if (CommonFun.getInstance().isValidForScr(this)) {
            for (let i = 0; i < 2; i++) {
                let data = commodity[i];
                let price = Math.floor(Number(data.amount) / 100);
                let amount = Math.floor(Number(data.amount + data.add) / 100);
                let bonus = Math.floor(Number(data.gift) / 100);
                let total = amount + bonus;
                let point = (total - price) / price;
                let percent = (point * 100).toFixed(0);
                if (i == 0) {
                    this.firstCommodityId = data.id;
                    this.lab_cash1.string = `₹${amount}`;
                    this.lab_addCash1.string = `₹${price}`;
                    this.lab_bonus1.string = `₹${bonus}`;
                    this.lab_totalGet1.string = `₹${total}`;
                    this.lab_percent1.string = `${percent}`;
                    this.price1 = price
                }
                else if (i == 1) {
                    this.secondCommodityId = data.id;
                    this.lab_cash2.string = `₹${amount}`;
                    this.lab_addCash2.string = `₹${price}`;
                    this.lab_bonus2.string = `₹${bonus}`;
                    this.lab_totalGet2.string = `₹${total}`;
                    this.lab_percent2.string = `${percent}`;
                    this.price2 = price
                };
            };
        };
    },

    btnClick: function(btn) {
        let btnName = btn.node.name;
        let rechargeNeedInfo = CommonFun.getInstance().getAppConfigValueByKey('Recharge_Need_Info', false);
        GlobalCfg.G_COMPONENTS.Audio.playButton();
        let commodity = GlobalCfg.USER_DATAS.first_pay_product.sort((a, b) => {
            return a.amount - b.amount;
        });

        switch (btnName) {
            case "btn_addCash1":
                // CommonFun.getInstance().ShowTipsBeforeBuy(this.price1, ()=>{
                // })
                let callback = ()=>{
                    if (rechargeNeedInfo) {
                        if (GlobalCfg.USER_DATAS.phone.length > 0 && GlobalCfg.USER_DATAS.mail.length > 0) {
                            CommonFun.getInstance().rechargeByCommodityId(this.firstCommodityId, GlobalCfg.SHOP_RECHARGE_FROM.ActivityFirstRecharge);
                        }
                        else {
                            CommonFun.getInstance().showBindPhone('AddCash');
                            SHOPPING.cashID = this.firstCommodityId;
                        };
                    }
                    else {
                        CommonFun.getInstance().rechargeByCommodityId(this.firstCommodityId, GlobalCfg.SHOP_RECHARGE_FROM.ActivityFirstRecharge);
                    };
                }
                let data1 = {price: Math.floor(Number(commodity[0].amount) / 100), bonus: Math.floor(Number(commodity[0].gift) / 100)}
                CommonFun.getInstance().showPayChannel(data1, callback);
                break;
            case "btn_addCash2":
                // CommonFun.getInstance().ShowTipsBeforeBuy(this.price2, ()=>{
                // })
                let callback2 = ()=>{
                    if (rechargeNeedInfo) {
                        if (GlobalCfg.USER_DATAS.phone.length > 0 && GlobalCfg.USER_DATAS.mail.length > 0) {
                            CommonFun.getInstance().rechargeByCommodityId(this.firstCommodityId, GlobalCfg.SHOP_RECHARGE_FROM.ActivityFirstRecharge);
                        }
                        else {
                            CommonFun.getInstance().showBindPhone('AddCash');
                            SHOPPING.cashID = this.firstCommodityId;
                        };
                    }
                    else {
                        CommonFun.getInstance().rechargeByCommodityId(this.firstCommodityId, GlobalCfg.SHOP_RECHARGE_FROM.ActivityFirstRecharge);
                    };
                }
                let data2 = {price: Math.floor(Number(commodity[1].amount) / 100), bonus: Math.floor(Number(commodity[1].gift) / 100)}
                CommonFun.getInstance().showPayChannel(data2, callback2);
                break;
            case "btn_otherAmount":
                if (rechargeNeedInfo) {
                    if (GlobalCfg.USER_DATAS.phone.length > 0 && GlobalCfg.USER_DATAS.mail.length > 0) {
                        CommonFun.getInstance().showNewShop(true, GlobalCfg.SHOP_RECHARGE_FROM.ActivityFirstRecharge);
                    }
                    else {
                        CommonFun.getInstance().showBindPhone('AddCash');
                    };
                }
                else {
                    CommonFun.getInstance().showNewShop(true, GlobalCfg.SHOP_RECHARGE_FROM.ActivityFirstRecharge);
                };
                break;
            default:
                break;
        };

        ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, {msgCode: GlobalCfg.CLIENT_MSG_ID.ACTIVITY_CLOSE_VIEW, msgData: {}});
    },

    compare: function(property) {
        return (a,b) => {
            let value1 = a[property];
            let value2 = b[property];
            return value1 - value2;
        };
    },
});
