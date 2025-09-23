cc.Class({
    extends: cc.Component,

    properties: {
        lab_reward: cc.Label,
        lab_day: cc.Label,
        node_signed: cc.Node,
        node_unsigned: cc.Node,
    },

    setSignItemData: function(gift, today, done, day) {
        this.lab_reward.string = `$${gift/100}`;
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
    },

    setSignItemSigned: function() {
        this.node_signed.active = true;
        this.node_unsigned.active = false;
    },
});
