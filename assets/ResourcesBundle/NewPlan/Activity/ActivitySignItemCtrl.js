cc.Class({
    extends: cc.Component,

    properties: {
        lab_reward: cc.Label,
        lab_day: cc.Label,
        node_signed: cc.Node,
        node_unsigned: cc.Node,
    },

    setSignItemData: function(gift, today, done, day, showNewRound) {
        this.lab_reward.string = CommonFun.getInstance().formatCurrencyAmount(gift / 100);
        let languagesType = cc.sys.localStorage.getItem("LanguageTypeStorage");
        if (languagesType == I18NLanguagesEnum.Bengali) {
            this.lab_day.string = `দিন${day}`;
        }
        else {
            this.lab_day.string = `Day${day}`;
        }
        if (showNewRound) {
            this.initSignItem();
            return;
        }
        if (today > day) {
            this.node_signed.active = true;
            this.node_unsigned.active = false;
        }
        else if (today == day && done == true) {
            this.node_signed.active = true;
            this.node_unsigned.active = false;
        }
        else if (today == day && done == false) {
            this.node_signed.active = false;
            this.node_unsigned.active = true;
        }
        else {
            this.node_signed.active = false;
            this.node_unsigned.active = false;
        };
    },

    setSignItemSigned: function() {
        this.node_signed.active = true;
        this.node_unsigned.active = false;
    },

    initSignItem:function()
    {
        this.node_signed.active = false;
        this.node_unsigned.active = false;
    }
});
