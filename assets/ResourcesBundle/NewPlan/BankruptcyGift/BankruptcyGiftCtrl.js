
cc.Class({
    extends: cc.Component,

    properties: {
        btnClose: {
            default: null,
            type: cc.Button
        },
        item1: {
            default: null,
            type: cc.Node
        },
        item2: {
            default: null,
            type: cc.Node
        },
    },

    // onLoad () {},

    start() {
        this.btnClose.node.on('click', () => {
            this.node.destroy();
        });
    },

    update(dt) {

    },

    onDestroy() {
        CommonFun.getInstance().releasePrefab(GlobalCfg.PREFAB_PATH.BANKRUPTCY_GIFT);
        GlobalCfg.IS_SHOW_BANKRUPT = false; //破产界面关闭时 置为false
    },

    /**
     * 获取当前低商品 Index 通过用户总充值金额
     * @param {Array<PaymentProduct>} arr 
     * @param {Number} allRecharged 
     */
    getLowerOptionIndexByAllRecharge: function (arr, allRecharged) {
        let index = -1;
        let all_recharged = allRecharged / 100;
        let putAmount = 300;
        if (all_recharged <= 5000) {
            putAmount = 300;
        }else if(all_recharged <= 10000){
            putAmount = 500;
        }else if(all_recharged <= 20000){
            putAmount = 1000;
        }else{
            putAmount = 2000;
        }
        for (let i = 0; i < arr.length; i++) {
            const element = arr[i];
            if(element && element.amount == putAmount * 100){
                index = i;
                break;
            }
        }
        return index;
    },

    /**
     * 获取当前低商品 Index 通过用户最后一次充值金额
     * @param {*} arr 
     * @param {*} lastRecharged 
     * @returns 
     */
    getLowerOptionIndexByLastRecharge: function (arr, lastRecharged) {
        let index = -1;
        for (let i = 0; i < arr.length; i++) {
            const element = arr[i];
            if(element && element.amount > lastRecharged){
                index = i;
                break;
            }
            if(i == arr.length - 1){
                index = arr.length - 1;
            }
        }
        return index;
    },

    /**
     * 
     * @param {Array<PaymentProduct>} options 
     * message PaymentProduct {
            int32 id = 1;       // 商品ID(支付接口用)
            int32 amount = 2;   // 金额
            int32 add = 3;      // 额外赠送-dep
            int32 bonus = 4;    // 额外赠送-bonus
            bool plot = 5;      // 暂无意义，默认false
        }
     */
    init(isPLotPlay) {
        let list = isPLotPlay ? GlobalCfg.USER_DATAS.plotPay : GlobalCfg.USER_DATAS.discoList
        list = list.sort((a,b) => a.amount - b.amount);
        let options = [...list];
        let curIndex = this.getLowerOptionIndexByLastRecharge(options, GlobalCfg.USER_DATAS.lastRecharged);
        let curIndex2 = this.getLowerOptionIndexByAllRecharge(options, GlobalCfg.USER_DATAS.recharged);
        curIndex = curIndex2 > curIndex ? curIndex2 : curIndex;
        if((curIndex + 2) >= options.length){
            curIndex2 = options.length - 1;
        }else{
            curIndex2 = curIndex + 2;
        }
        if(curIndex == options.length - 1){
            curIndex -= 1;
        }
        let option_1 = options[curIndex];
        let option_2 = options[curIndex2];

        this.initItem(option_1, this.item1);
        this.initItem(option_2, this.item2);
    },

    initItem(data, node) {
        if (!data) {
            LoggerUtil.getInstance().error('BankruptcyGiftCtrl.initItem Data error')
            this.node.destroy();
            return;
        }
        let id = data.id;
        let cash = data.amount;
        let extraCash = data.add;
        let bonus = data.bonus;
        let rate = Math.round((extraCash + bonus) * 100 / cash);

        let labelRate = node.getChildByName('LabelRate').getComponent(cc.Label);
        let labelCash = node.getChildByName('LabelCash').getComponent(cc.Label);
        let labelExtraCash = node.getChildByName('LabelExtraCash').getComponent(cc.Label);
        let labelBonus = node.getChildByName('LabelBonus').getComponent(cc.Label);
        let labelTotalGet = node.getChildByName('LabelTotalGet').getComponent(cc.Label);
        let button = node.getChildByName('Button').getComponent(cc.Button);
        let buttonLabelNum = button.node.getChildByName('LabelNum').getComponent(cc.Label);

        labelRate.string = rate + '%';
        labelCash.string = Math.round(cash / 100);
        labelExtraCash.string = Math.round(extraCash / 100);
        labelBonus.string = Math.round(bonus / 100);
        labelTotalGet.string = Math.round((cash + extraCash + bonus) / 100);
        buttonLabelNum.string = Math.round(cash / 100);
        button.node.on('click', () => {
            CommonFun.getInstance().rechargeByCommodityId(id, GlobalCfg.SHOP_RECHARGE_FROM.BankruptcyGift, () => {
                button.node.off('click');
                this.node.destroy();
            });
        });
    },
});
