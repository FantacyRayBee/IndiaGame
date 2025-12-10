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
            this.lab_myCoin.string = `$0`;
            return;
        };
        if (GlobalCfg.USER_DATAS.isNotCharge){
            CommonFun.getInstance().refreshWalletData(this.lab_myCoin);
            return
        }
        this.myCoin = coin;
        GlobalCfg.USER_DATAS.userDiamond = coin;
        this.lab_myCoin.string = `$${this.changeNumToK(coin/100)}`;
    },

    getMyCoin: function() {
        return this.myCoin;
    },

    changeNumToK: function(num) {
        if (num < 1000) { 
            return num;
        } 
        else {
            let n = (num / 1000).toFixed(2)
            let res = n.toString() + 'K'
            return res;
        }
    }
});
