cc.Class({
    extends: cc.Component,

    properties: {
        pokseAtlas: cc.SpriteAtlas,
        card: cc.Sprite,
    },

    ctor: function () {
    },
    
    onLoad: function () {
        this.cardMark = this.node.getChildByName("cradMsak");
    },

    initCardInfo:function () {
        this.setCardInfo(52);
        this.cardMark.active = true;
    },
    
    setCardInfo:function (crad) {
        // LoggerUtil.getInstance().log(`setCardInfo crad = ${crad}`);
        this.card.spriteFrame = this.pokseAtlas.getSpriteFrame(crad.toString());
        this.cardMark.active = false;
    },
}); 
