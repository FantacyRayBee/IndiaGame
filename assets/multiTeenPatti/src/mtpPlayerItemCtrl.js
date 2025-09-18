cc.Class({
    extends: require('UINode'),

    properties: {
        user_head:cc.Sprite,
        lab_coin:cc.Label,
        lab_name:cc.Label,
    },

    onLoad() {},

    start() {

    },

    setPlayerItemInfo: function (data) {
        this.setName(data.nickname);
        this.setCoin(data.diamond);
        this.loadHeadSp(data.imgUrl, 80,this.user_head);
    },

    setName: function (nickname) {
        this.nickname = nickname;
        if (this.lab_name) {
            this.lab_name.string = CommonFun.getInstance().getStrByLength(nickname, 12);
        }
    },

    setCoin: function (coin) {
        this.coin = FloatCalculation.accDiv(coin, 100);
        if (this.lab_coin && coin != null) {
            this.lab_coin.string =  CommonFun.getInstance().numberToShow(this.coin);
        }
    },

    // update (dt) {},
});
