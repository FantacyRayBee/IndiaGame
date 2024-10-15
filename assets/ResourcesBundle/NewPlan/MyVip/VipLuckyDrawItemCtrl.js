cc.Class({
    extends: cc.Component,

    properties: {
        node_iconBonus: cc.Node,
        node_iconCash: cc.Node,
        lab_tips: cc.Label,
    },

    setVipLuckyDrawItemData: function(itemData) {
        if (!itemData) {
            this.node.active = false;
            return
        };

        let id = itemData[0] ? itemData[0] : 10;
        let mount = itemData[1] ? itemData[1] : 0;
        if (id == 12) {
            this.node_iconBonus.active = true;
            this.node_iconCash.active = false;
            this.lab_tips.string = `${mount/100} Bonus`;
        } 
        else {
            this.node_iconBonus.active = false;
            this.node_iconCash.active = true;
            this.lab_tips.string = `${mount/100} Cash`;
        };
    },
});
