cc.Class({
    extends: cc.Component,

    properties: {
        lab_shopCoin1: cc.Label,
        lab_shopCoin2: cc.Label,
        lab_bonus: cc.Label,
        node_bonus: cc.Node,
    },

    onLoad: function () {
        this.node.on('toggle', this.toggleCallback, this);

    },

    toggleCallback: function (toggle) {
        GlobalCfg.G_COMPONENTS.Audio.playButton();
        let toggleName = toggle.node.name;
        if (this.node.getComponent(cc.Toggle).isChecked) {
            ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, { msgCode: GlobalCfg.CLIENT_MSG_ID.SHOP_SELECTED_ITEM, msgData: { shopItemData: this.shopItemData } });
        };
    },

    setNewShopItemData: function (data) {
        if (!data) {
            return;
        };

        this.shopItemData = data;

        let amount = Math.floor(data.amount / 100);
        let id = data.id;
        let loop_status = data.loop_status;
        let gift = Math.floor(data.gift / 100);   // 赠送


        if (loop_status == 0 && gift != 0) {
            this.node_bonus.active = true;
            let languagesType = cc.sys.localStorage.getItem("LanguageTypeStorage");
            if (languagesType == I18NLanguagesEnum.English) {
                this.lab_shopCoin1.string = `₹${amount}`;
                this.lab_shopCoin2.string = `₹${amount}`;
                this.lab_bonus.string = '+₹' + Number(gift);
            }
            else if (languagesType == I18NLanguagesEnum.Bengali) {
                this.lab_shopCoin1.string = `৳${amount}`;
                this.lab_shopCoin2.string = `৳${amount}`;
                this.lab_bonus.string = '+৳' + Number(gift);
            }
        }
        else if (loop_status == 1) {
            this.node_bonus.active = false;
        };
    },

    setNewShopItemChecked: function (isChecked) {
        this.node.getComponent(cc.Toggle).isChecked = isChecked;
        if (isChecked) {
            ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, { msgCode: GlobalCfg.CLIENT_MSG_ID.SHOP_SELECTED_ITEM, msgData: { shopItemData: this.shopItemData } });
        };
    },
});
