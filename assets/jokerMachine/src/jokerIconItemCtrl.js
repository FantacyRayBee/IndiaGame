cc.Class({
    extends: cc.Component,

    properties: {
        spriteAtlas_icon: cc.SpriteAtlas,
        icon_node: cc.Node,
    },

    ctor: function() {
    },

    setItemData: function(itemID) {
        this.typeId = itemID;
        let spriteName = "Symbol_0" + (itemID - 1);
        let spriteFrame = this.spriteAtlas_icon.getSpriteFrame(spriteName);
        if (!spriteFrame) {
            return;
        };
        this.icon_node.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        let sprite = this.icon_node.getComponent(cc.Sprite);
        sprite.color = new cc.Color(255, 255, 255);
    },

    playAnimation: function() {
        this.icon_node.active = false;
    },

    //未中奖的item置灰
    setGrayColor: function() {
        let sprite = this.icon_node.getComponent(cc.Sprite);
        sprite.color = new cc.Color(100, 100, 100);
    },

    stopAnimation: function() {
        this.icon_node.active = true;
    },

    initIcon: function() {
        let type = Math.floor(Math.random() * 8);
        let spriteName = "Symbol_0" + type;
        let spriteFrame = this.spriteAtlas_icon.getSpriteFrame(spriteName);
        if (!spriteFrame) {
            return;
        };
        this.icon_node.getComponent(cc.Sprite).spriteFrame = spriteFrame;
    },
});
