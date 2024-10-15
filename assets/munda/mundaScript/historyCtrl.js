cc.Class({
    extends: cc.Component,

    properties: {
        spriteList: {
            default: Array,
            type: cc.SpriteFrame
        }
    },

    setSprite: function (data) {
        if (data == 0 || data == 1) {
            this.node.getComponent(cc.Sprite).spriteFrame = this.spriteList[0];
        } else {
            this.node.getComponent(cc.Sprite).spriteFrame = this.spriteList[data - 1];
        }
    },
});
