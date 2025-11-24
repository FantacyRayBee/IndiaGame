
cc.Class({
    extends: cc.Component,
    properties: {
        lab_1: cc.Label,
        lab_2: cc.Label,
    },
    // onLoad () {},

    start () {

    },

    // update (dt) {},

    setLabel: function(txt) {
        this.lab_1.string = txt;
        this.lab_2.string = txt;
    },


    setNewShopItemChecked: function(isChecked) {
        this.node.getComponent(cc.Toggle).isChecked = isChecked;
        if (isChecked) {
            // ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, {msgCode: GlobalCfg.CLIENT_MSG_ID.SHOP_SELECTED_ITEM, msgData: {shopItemData: this.shopItemData}});
        };
    },
});
