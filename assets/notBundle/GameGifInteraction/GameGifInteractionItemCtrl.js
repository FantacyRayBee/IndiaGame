cc.Class({
    extends: cc.Component,

    properties: {
        sprite_icon: cc.Sprite,
        lab_price: cc.Label,
    },

    ctor: function() {
        this.icon_spriteFrame = null;
        this.itemData = {};
    },

    onLoad: function() {
        this.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
    },

    onDestroy: function() {
        if (this.icon_spriteFrame) {
            this.icon_spriteFrame.decRef();
            this.icon_spriteFrame = null;
        };
    },

    btnClick: function() {
        GlobalCfg.G_COMPONENTS.Audio.playButton();
        ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, {msgCode: GlobalCfg.CLIENT_MSG_ID.GAME_GIF_CLICK_ITEM, msgData: {itemData: this.itemData}});
    },

    setGameGiftItemData(data) {
        let price = data.price;
        let name = data.name;

        this.itemData = data;

        this.lab_price.string = `$${price}`;
        ResourcesBundle.load(`NewPlan/GameGifInteraction/res/item/${name}`, cc.SpriteFrame, (err, spriteFrame) => {
            if (!err) {
                if (CommonFun.getInstance().isValidForScr(this)) {
                    spriteFrame.addRef();
                    this.icon_spriteFrame = spriteFrame;
                    this.sprite_icon.spriteFrame = spriteFrame;
                    this.node.active = true;
                }
                else {
                    spriteFrame.addRef();
                    spriteFrame.decRef();
                    spriteFrame = null;
                };
            }
            else {
                LoggerUtil.getInstance().error(err);
            };
        });
    },
});
