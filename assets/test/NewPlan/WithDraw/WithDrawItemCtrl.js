cc.Class({
    extends: cc.Component,

    properties: {
        lab_amoount1: cc.Label,
        lab_amoount2: cc.Label,
        lab_handlingFee: cc.Label,
        node_handlingFee: cc.Node,
    },

    onLoad: function() {
        this.node.on('toggle', this.toggleCallback, this);
    },

    toggleCallback: function(toggle) {
        GlobalCfg.G_COMPONENTS.Audio.playButton();
        let toggleName = toggle.node.name;
        if (this.node.getComponent(cc.Toggle).isChecked) {
            ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, {msgCode: GlobalCfg.CLIENT_MSG_ID.WITHDRAW_SELECTED_ITEM, msgData: {itemData: this.itemData}});
        };
    },

    setWithDrawItemData: function(data) {
        if (!data) {
            return;
        };

        this.itemData = data;

        let price = data.price;
        this.lab_amoount1.string = `$${price}`;
        this.lab_amoount2.string = `$${price}`;

        let service_rate = data.service_rate;
        if (service_rate > 0) {
            this.node_handlingFee.active = true;
            this.lab_handlingFee.string = `${(Number(service_rate) * 100).toFixed(1)}%`;
        };
    },

    setWithDrawItemChecked: function(isChecked) {
        this.node.getComponent(cc.Toggle).isChecked = isChecked;
        if (isChecked) {
            ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, {msgCode: GlobalCfg.CLIENT_MSG_ID.WITHDRAW_SELECTED_ITEM, msgData: {itemData: this.itemData}});
        };
    },
});
