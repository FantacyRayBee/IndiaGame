
cc.Class({
    extends: cc.Component,

    properties: {
        sprites: [cc.SpriteFrame],
        bg: cc.Node,
        lb_normal: cc.Label,
        lb_win: cc.Label,
    },

    setItemData: function(itemID) {
        this.typeId = itemID;
        this.lb_win.string = "X" + itemID;
        this.lb_normal.string = "X" + itemID;
    },

    getSpriteFrameByType(type) {
        let sp = null;
        switch (type) {
            case 'win1': //蓝色底 赢
                sp = this.sprites[0];
                break;
            case 'lose1': //蓝色底 输
                sp = this.sprites[1];
                break;
            case 'win2': //红色底 赢
                sp = this.sprites[2];
                break;
            case 'lose2': //红色底 输
                sp = this.sprites[3];
                break;
            default:
                break;
        }
        return sp;
    },
});
