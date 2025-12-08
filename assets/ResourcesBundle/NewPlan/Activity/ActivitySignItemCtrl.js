cc.Class({
    extends: cc.Component,

    properties: {
        lab_reward: cc.Label,
        lab_day: cc.Label,
        node_signed: cc.Node,
        node_unsigned: cc.Node,

        img_coin: cc.Sprite,
        sp_free: cc.SpriteFrame,
        sp_gold: cc.SpriteFrame,
    },

    setSignItemData: function(gift, today, done, day) {
        this.lab_reward.string = `${gift}`;
        this.lab_day.string = `Day${day}`;

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
        if (GlobalCfg.USER_DATAS.isNotCharge == true) {
            this.img_coin.spriteFrame = this.sp_free;
        } else {
            this.img_coin.spriteFrame = this.sp_gold;
        }
    },

    setSignItemSigned: function() {
        this.node_signed.active = true;
        this.node_unsigned.active = false;
    },
});
