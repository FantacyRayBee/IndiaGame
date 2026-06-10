cc.Class({
    extends: cc.Component,

    properties: {
        lab_myCoin: cc.Label,
    },

    ctor: function() {
        this.myCoin = 0;
    },

    setMyCoin: function(coin) {
        if (typeof coin != "number") {
            LoggerUtil.getInstance().warn("setMyCoin: coin is not a number");
            this.myCoin = 0;
            this.lab_myCoin.string = CommonFun.getInstance().getCurrencySymbol() +`$0`;
            return;
        };
        this.myCoin = coin;
        GlobalCfg.USER_DATAS.userDiamond = coin;
        this.lab_myCoin.string = CommonFun.getInstance().getCurrencySymbol() + `${this.changeNumToK(coin/100)}`;
    },

    getMyCoin: function() {
        return this.myCoin;
    },

    changeNumToK: function(num) {
        if (num < 1000) { 
            return String(num).replace('.', '_');
        } 
        else {
            let n = (num / 1000).toFixed(2)
            let res = n.toString().replace('.', '_') + 'K'
            return res;
        }
    }
});
