cc.Class({
    extends: cc.Component,

    properties: {
        spriteAtlas_icon: cc.SpriteAtlas,
        icon_node: cc.Node,
    },

    ctor: function() {
    },

    setItemData: function(itemID) {
        this.typeId = itemID > 100 ? 12: itemID;
        let spriteName = "Symbol_" + this.typeId;
        let spriteFrame = this.spriteAtlas_icon.getSpriteFrame(spriteName);
        if (!spriteFrame) {
            return;
        };
        this.icon_node.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        this.stopAnimation();
    },

    playAnimation: function() {
        this.icon_node.active = false;
    },
    stopAnimation: function() {
        this.icon_node.active = true;
    },
    initIcon: function() {
        let type = Math.floor(Math.random() * 11) + 1; // 1-11
        let spriteName = "Symbol_" + type;
        let spriteFrame = this.spriteAtlas_icon.getSpriteFrame(spriteName);
        if (!spriteFrame) {
            return;
        };
        this.icon_node.getComponent(cc.Sprite).spriteFrame = spriteFrame;
    },
});
