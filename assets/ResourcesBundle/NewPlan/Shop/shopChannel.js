
cc.Class({
    extends: cc.Component,
    properties: {
        lab_num: cc.RichText,
        btn_close: cc.Button,
        btn_pay: cc.Button,

        content: cc.Node,
        item: cc.Node,
    },
    onLoad() {
        this.btn_close.node.on('click', this.btnCloseClick, this);
        this.btn_pay.node.on('click', this.btnPayClick, this);
    },

    start () {
    },

    setData: function(payChannels, infos, callback) {
        LoggerUtil.getInstance().log("setData infos:", infos);
        this.callback = callback;
        this.addShopTogItems(payChannels);   
        let final = parseFloat(infos.price) + parseFloat(infos.bonus);
        this.lab_num.string = `<color=#EE6E37>${infos.price}</c> deposit + <color=#EE6E37>${infos.bonus}</c> Bonus = <color=#EE6E37>${final}</c>`
    },

    addShopTogItems: function(data) {
        let children = this.content.children;
        for (let i = 0, len = children.length; i < len; i++) {
            const node = children[i];
            node.destroy();
        };
        let lens = data.pay_channels.length > 8 ? 8 : data.pay_channels.length;
        if (lens == 0) {
            return;
        };
        for (let i = 0; i < lens; i++) {
            let shopItemNode = cc.instantiate(this.item);
            shopItemNode.active = true;
            let shopItemCtrl = shopItemNode.getComponent("ShopTogItemCtrl");
            if (i == 0) {
                shopItemCtrl.setNewShopItemChecked(true);
                GlobalCfg.PAY_CHANNEL = data.pay_channels[0]; //角标默认选择第一个
            };
            shopItemCtrl.setLabel(data.pay_channels_name[i], data.pay_channels[i]);
            this.content.addChild(shopItemNode);
        }
    },

    btnCloseClick: function() {
        GlobalCfg.G_COMPONENTS.Audio.playBack();
        this.node.destroy();
    },

    btnPayClick: function() {
        if (this.callback) {
            this.callback()
        }
        this.node.destroy();
    }
});