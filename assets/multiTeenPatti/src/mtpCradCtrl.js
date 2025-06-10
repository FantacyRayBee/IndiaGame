cc.Class({
    extends: cc.Component,

    properties: {
        pokseAtlas: cc.SpriteAtlas,
        card: cc.Sprite,
    },

    ctor: function () {
    },

    onLoad: function () {
    },

    initCardInfo:function () {
        this.setCardInfo(52);
    },
    
    setCardInfo:function (crad) {
        // LoggerUtil.getInstance().log(`setCardInfo crad = ${crad}`);
        this.card.spriteFrame = this.pokseAtlas.getSpriteFrame(crad.toString());
    },
}); 
