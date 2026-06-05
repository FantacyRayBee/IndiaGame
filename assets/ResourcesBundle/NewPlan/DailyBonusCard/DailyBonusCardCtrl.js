cc.Class({
    extends: cc.Component,

    properties: {
        scrollView: cc.ScrollView,
        btn_close: cc.Button,
        btn_rule: cc.Button,
        prefabRule: cc.Prefab,
    },

    ctor: function() {
        this.needScrolling = true;
        this.scrollPercentage = 0;
        this.isPositiveDirection = true;
    },

    update: function(dt) {
        if (this.needScrolling) {
            if (this.isPositiveDirection) {
                this.scrollPercentage += 0.002;
                if (this.scrollPercentage > 1) {
                    this.isPositiveDirection = false;
                };
            } 
            else {
                this.scrollPercentage -= 0.002;
                if (this.scrollPercentage < 0) {
                    this.isPositiveDirection = true;
                };
            };
            this.scrollView.scrollToPercentHorizontal(this.scrollPercentage, dt, false);
        };
    },

    onLoad: function() {
        this.btn_close.node.on("click", CommonFun.getInstance().debounce(() => {
            GlobalCfg.G_COMPONENTS.Audio.playBack();
            this.node.destroy();
        }, 1), this);
        this.btn_rule.node.on("click", CommonFun.getInstance().debounce(() => {
            GlobalCfg.G_COMPONENTS.Audio.playButton();
            let ruleNode = cc.instantiate(this.prefabRule);
            ruleNode.parent = this.node;
        }, 1), this);

        this.scrollView.node.on('scroll-began', () => {
            this.needScrolling = false;
        }, this);

        this.initCard();
        this.msgHandle = ClientNotify.register(GlobalCfg.MSG_TYPE.serverMsg, this.onEventMsg, this);
    },

    initCard(){
        let seriesCard = GlobalCfg.USER_DATAS.seriesCard;
        let content = this.scrollView.content;
        for (let i = 0, len = seriesCard.length; i < len; i++) {
            let cardInfo = seriesCard[i];
            let id = cardInfo.id;
            let price = cardInfo.price;
            let add = cardInfo.add;
            let days = cardInfo.days;
            let daySend = cardInfo.day_send;
            let bonus = cardInfo.bonus;

            let cardNode = content.getChildByName(`card${id}`);
            if (cardNode) {
                let lab_rate = cardNode.getChildByName("bonus_card_ico_sale").getChildByName("lab_sprjb").getComponent(cc.Label);
                let lab_amount = cardNode.getChildByName("layout").getChildByName("lab_sprjb").getComponent(cc.Label);
                let lab_reward = cardNode.getChildByName("layout").getChildByName("lab_spryb").getComponent(cc.Label);
                let lab_tips1 = cardNode.getChildByName("lab_getbonus_1").getComponent(cc.Label);
                let lab_tips2 = cardNode.getChildByName("lab_daybonusday_1").getComponent(cc.Label);
                let lab_tips3 = cardNode.getChildByName("lab_daycashday_1").getComponent(cc.Label);
                let lab_btnTips = cardNode.getChildByName("btn").getChildByName("Background").getChildByName("Label").getComponent(cc.Label);

                
                let node_btn = cardNode.getChildByName("btn");
                if (GlobalCfg.USER_DATAS.voucherCard == 0) {
                    
                    node_btn.on("click", CommonFun.getInstance().debounce(() => {
                        let cashNum = ((price + add) / 100) + (daySend * days / 100);
                        this.bonusRecharge(id, cashNum, lab_reward.string);
                    }, 1), this);
                }
                else {
                    node_btn.getComponent(cc.Button).interactable = false;
                    node_btn.getComponent(cc.Button).enableAutoGrayEffect = true;
                };

                lab_rate.string = `${parseInt(((days * daySend + bonus + add) / price) * 100)}%`;
                lab_amount.string = `${(price + add) / 100}`;
                lab_reward.string = `${(days * daySend + bonus) / 100}`;
                // lab_tips2.string = `Bonus ₹${bonus / 100} right now`;
                // lab_tips3.string = `₹${daySend / 100} Cash x${days} days`;
                
                
                let languagesType = cc.sys.localStorage.getItem("LanguageTypeStorage");
                if (languagesType == I18NLanguagesEnum.English) {
                    lab_tips1.string = `${CommonFun.getInstance().formatCurrencyAmount(price / 100)} + bonus ${bonus / 100} right now`;
                    lab_tips2.string = `${CommonFun.getInstance().formatCurrencyAmount(daySend / 100)} cash x${days} days`;
                    lab_btnTips.string = CommonFun.getInstance().formatCurrencyAmount(price / 100);
                }
                else if (languagesType == I18NLanguagesEnum.Bengali) {
                    lab_tips1.string = `এখনই ${CommonFun.getInstance().formatCurrencyAmount(price / 100)} + বোনাস ${bonus / 100}`;
                    lab_tips2.string = `${CommonFun.getInstance().formatCurrencyAmount(daySend / 100)} নগদ x${days} দিন`;
                    lab_btnTips.string = `৳${price / 100}`;
                }
            };
        };
    },

    bonusRecharge: function(id, price, bonus) {
        // CommonFun.getInstance().ShowTipsBeforeBuy(price / 100, ()=>{
            let data = {price: price, bonus: bonus}
            CommonFun.getInstance().showPayChannel(data, ()=>{
                SHOPPING.from = GlobalCfg.SHOP_RECHARGE_FROM.DailyBonusCard;
                let rechargeNeedInfo = CommonFun.getInstance().getAppConfigValueByKey('Recharge_Need_Info', false);
                if (rechargeNeedInfo) {
                    if (GlobalCfg.USER_DATAS.phone.length > 0 && GlobalCfg.USER_DATAS.mail.length > 0) {
                        CommonFun.getInstance().rechargeByCommodityId(id, SHOPPING.from, null, GlobalCfg.PAY_CHANNEL);
                    }
                    else {
                        CommonFun.getInstance().showBindPhone('AddCash');
                        SHOPPING.cashID = id;
                        this.node.destroy();
                    };
                }
                else {
                    CommonFun.getInstance().rechargeByCommodityId(id, SHOPPING.from, null, GlobalCfg.PAY_CHANNEL);
                };
            });
        // })
    },

    onEventMsg: function(webData, target) {
        let self = target;
        let msgId = webData.msgCode;
        let notify = webData.msgData;
        if (msgId == GlobalCfg.CLIENT_MSG_ID.RECHARGED_DAILYBONUS_CARD) {
            self.initCard();
        }
    },

    onDestroy: function() {
        ClientNotify.removeByHandle(GlobalCfg.MSG_TYPE.serverMsg, this.msgHandle);
        CommonFun.getInstance().releasePrefab(GlobalCfg.PREFAB_PATH.DAILYBONUSCARD);
    },
});
