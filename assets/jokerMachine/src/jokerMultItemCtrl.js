
cc.Class({
    extends: cc.Component,

    properties: {
        sprites: [cc.SpriteFrame],
        bg: cc.Node,
        lb_normal: cc.Label,
        lb_win: cc.Label,
    },
    ctor: function () {
        this.multArr = [1, 2, 3, 5, 10, 15];
    },

    initIcon: function() {
        let index = Math.floor(Math.random() * 6);
        this.lb_win.string = "X" + this.multArr[index];
        this.lb_normal.string = "X" + this.multArr[index];
        this.lb_win.node.active = false;
        this.lb_normal.node.active = true;
        this.setSpriteFrameByIndex(index, false);
    },

    setItemData: function(multIndex, isShowGold) {
        this.lb_win.string = "X" + this.multArr[multIndex];
        this.lb_normal.string = "X" + this.multArr[multIndex];
        this.lb_win.node.active = isShowGold;
        this.lb_normal.node.active = !isShowGold;
        this.setSpriteFrameByIndex(multIndex, isShowGold);
    },

    setSpriteFrameByIndex: function(multIndex, isShowGold) {
        if (multIndex < 4) {
            this.bg.active = false;
            return;
        }
        this.bg.active = true;
        if (multIndex == 4) {
            if (isShowGold) { //中奖的时候 底的颜色为亮色
                this.bg.getComponent(cc.Sprite).spriteFrame = this.sprites[1];
            }
            else{
                this.bg.getComponent(cc.Sprite).spriteFrame = this.sprites[0];
            }
        } else{
            if (isShowGold) { //中奖的时候 底的颜色为亮色
                this.bg.getComponent(cc.Sprite).spriteFrame = this.sprites[3];
            }
            else{
                this.bg.getComponent(cc.Sprite).spriteFrame = this.sprites[2];
            }
        }
    }

});
