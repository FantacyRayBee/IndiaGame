cc.Class({
    extends: cc.Component,

    properties: {
        skeleton_kuang: sp.Skeleton,
        spriteAtlas_icon: cc.SpriteAtlas,
        icon_node: cc.Node,
    },

    ctor: function () {
        this.loadBundleName = "catMachine";
    },

    playAnimation: function () {
        this.icon_node.active = false;
    },

    stopAnimation: function () {
        this.icon_node.active = true;
        this.skeleton_kuang.node.active = false;
    },

    setItemData: function (type) {
        let spriteName = "icon_" + type;
        let spriteFrame = this.spriteAtlas_icon.getSpriteFrame(spriteName);
        this.icon_node.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        this.icon_node.active = true;
    },

    initIcon: function () {
        let type = Math.floor(Math.random() * 10 + 1);
        let spriteName = "icon_" + type;
        let spriteFrame = this.spriteAtlas_icon.getSpriteFrame(spriteName);
        if (!spriteFrame) {
            return;
        };
        this.icon_node.getComponent(cc.Sprite).spriteFrame = spriteFrame;
    },
});
