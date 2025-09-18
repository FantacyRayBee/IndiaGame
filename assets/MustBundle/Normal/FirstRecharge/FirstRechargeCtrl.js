cc.Class({
    extends: cc.Component,

    properties: {
        lab_item0Percent: cc.Label,
        lab_item0Cash: cc.Label,
        lab_item0Bonus: cc.Label,
        lab_item0TotalGet: cc.Label,
        lab_item0Btn: cc.Label,

        lab_item1Percent: cc.Label,
        lab_item1Cash: cc.Label,
        lab_item1Bonus: cc.Label,
        lab_item1TotalGet: cc.Label,
        lab_item1Btn: cc.Label,

        btn_item0: cc.Button,
        btn_item1: cc.Button,
        btn_close: cc.Button,
        btn_otherAmount: cc.Button,
    },

    onLoad: function() {
        /**
         * 
            type PaymentProduct struct {
                Id     int32 json:"id"     // 商品ID(支付接口用)
                Amount int64 json:"amount" // 金额
                Gift   int64 json:"gift"   // 额外赠送-dep/bonus
            }
         */
        let commodity = GlobalCfg.USER_DATAS.first_pay_product.sort((a, b) => {
            return a.amount - b.amount;
        });
        for (let i = 0; i < 2; i++) {
            let data = commodity[i];
            if (data) {
                let price = Math.floor(Number(data.amount) / 100);
                let bonus = Math.floor(Number(data.gift) / 100);
                if (i == 0) {
                    this.firstCommodityId = data.id;
                    this.lab_item0Cash.string = price;
                    this.lab_item0Bonus.string = bonus;
                    let total = price + bonus;
                    this.lab_item0TotalGet.string = "₹" + total;
                    let point = bonus/price;
                    let percent = (point*100).toFixed(0);
                    this.lab_item0Percent.string = percent;
                    this.lab_item0Btn.string = "₹" + price;
                }
                else if (i == 1) {
                    this.secondCommodityId = data.id;
                    this.lab_item1Cash.string = price;
                    this.lab_item1Bonus.string = bonus;
                    let total = price + bonus;
                    this.lab_item1TotalGet.string = "₹" + total;
                    let point = bonus/price;
                    let percent = (point*100).toFixed(0);
                    this.lab_item1Percent.string = percent;
                    this.lab_item1Btn.string = "₹" + price;
                };   
            }; 
        };

        this.btn_item0.node.on("click", CommonFun.getInstance().debounce(this.btnClick, 1), this);
        this.btn_item1.node.on("click", CommonFun.getInstance().debounce(this.btnClick, 1), this);
        this.btn_close.node.on("click", CommonFun.getInstance().debounce(this.btnClick, 1), this);
        this.btn_otherAmount.node.on("click", CommonFun.getInstance().debounce(this.btnClick, 1), this);
    },

    btnClick: function(btn) {
        let btnName = btn.node.name;
        let rechargeNeedInfo = CommonFun.getInstance().getAppConfigValueByKey('Recharge_Need_Info', false);
        let commodity = GlobalCfg.USER_DATAS.first_pay_product.sort((a, b) => {
            return a.amount - b.amount;
        });
        let price = 500
        switch (btnName) {
            case "btn_close":
                GlobalCfg.G_COMPONENTS.Audio.playBack();
                this.node.destroy(); 
                return;
            case "btn_item0":
                if (commodity[0]) {
                    price = Math.floor(Number(commodity[0].amount) / 100);
                }
                // CommonFun.getInstance().ShowTipsBeforeBuy(price, ()=>{
                    let callback = ()=>{
                        if (rechargeNeedInfo) {
                            if (GlobalCfg.USER_DATAS.phone.length > 0 && GlobalCfg.USER_DATAS.mail.length > 0) {
                                // CommonFun.getInstance().showNewShop(true, GlobalCfg.SHOP_RECHARGE_FROM.firstRechargeOtherAmount);
                                CommonFun.getInstance().rechargeByCommodityId(this.firstCommodityId, GlobalCfg.SHOP_RECHARGE_FROM.firstRecharge, () => {
                                    this.node.destroy();
                                }, GlobalCfg.PAY_CHANNEL);
                            }
                            else {
                                CommonFun.getInstance().showBindPhone('AddCash');
                                SHOPPING.cashID = this.firstCommodityId;
                                this.node.destroy(); 
                            };
                        }
                        else {
                            CommonFun.getInstance().rechargeByCommodityId(this.firstCommodityId, GlobalCfg.SHOP_RECHARGE_FROM.firstRecharge, () => {
                                this.node.destroy();
                            },GlobalCfg.PAY_CHANNEL);
                        };
                    }
                    let data1 = {price:this.lab_item0Cash.string, bonus:this.lab_item0Bonus.string}
                    CommonFun.getInstance().showPayChannel(data1, callback);
                // })
                break;
            case "btn_item1":
                price = 1000
                if (commodity[1]) {
                    price = Math.floor(Number(commodity[1].amount) / 100);
                }
                // CommonFun.getInstance().ShowTipsBeforeBuy(price, ()=>{
                let callback2 = ()=>{
                    if (rechargeNeedInfo) {
                        if (GlobalCfg.USER_DATAS.phone.length > 0 && GlobalCfg.USER_DATAS.mail.length > 0) {
                            // CommonFun.getInstance().showNewShop(true, GlobalCfg.SHOP_RECHARGE_FROM.firstRechargeOtherAmount);
                            CommonFun.getInstance().rechargeByCommodityId(this.secondCommodityId, GlobalCfg.SHOP_RECHARGE_FROM.firstRecharge, () => {
                                this.node.destroy();
                            },GlobalCfg.PAY_CHANNEL);
                        }
                        else {
                            CommonFun.getInstance().showBindPhone('AddCash');
                            SHOPPING.cashID = this.secondCommodityId;
                            this.node.destroy(); 
                        };
                    }
                    else {
                        CommonFun.getInstance().rechargeByCommodityId(this.secondCommodityId, GlobalCfg.SHOP_RECHARGE_FROM.firstRecharge, () => {
                            this.node.destroy();
                        },GlobalCfg.PAY_CHANNEL);
                    };
                // })
                }
                let data2 = {price:this.lab_item1Cash.string, bonus:this.lab_item1Bonus.string}
                CommonFun.getInstance().showPayChannel(data2, callback2);
                break;
            case "btn_otherAmount":
                if (rechargeNeedInfo) {
                    if (GlobalCfg.USER_DATAS.phone.length > 0 && GlobalCfg.USER_DATAS.mail.length > 0) {
                        CommonFun.getInstance().showNewShop(true, GlobalCfg.SHOP_RECHARGE_FROM.firstRechargeOtherAmount);
                        this.node.destroy(); 
                    }
                    else {
                        CommonFun.getInstance().showBindPhone('AddCash');
                        this.node.destroy(); 
                    };
                }
                else {
                    CommonFun.getInstance().showNewShop(true, GlobalCfg.SHOP_RECHARGE_FROM.firstRechargeOtherAmount);
                    this.node.destroy(); 
                };
                break;
            default:
                break;
        }
        GlobalCfg.G_COMPONENTS.Audio.playButton();
    },


    onDestroy: function() {
        CommonFun.getInstance().releasePrefab(GlobalCfg.PREFAB_PATH.FIRSTRECHARGE);
        CommonFun.getInstance().releasePrefab(GlobalCfg.PREFAB_PATH.FIRSTRECHARGE_V);
    },
});
