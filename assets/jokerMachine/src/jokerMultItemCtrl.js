
cc.Class({
    extends: cc.Component,

    properties: {
        sprites: [cc.SpriteFrame],
        bg: cc.Node,
        lb_normal: cc.Label,
        lb_win: cc.Label,
    },
    ctor: function () {
    },

    initIcon: function(mult) {
        this.lb_win.string = "X" + mult;
        this.lb_normal.string = "X" + mult;
        this.lb_win.node.active = false;
        this.lb_normal.node.active = true;
        this.setSpriteFrameByMult(mult, false);
        let anim = this.lb_win.getComponent(cc.Animation)
        if (anim) {
            anim.stop();
        }
    },

    setItemData: function(mult, isShowGold) {
        this.lb_win.string = "X" + mult;
        this.lb_normal.string = "X" + mult;
        this.lb_win.node.active = isShowGold;
        this.lb_normal.node.active = !isShowGold;
        this.setSpriteFrameByMult(mult, isShowGold);
    },

    playAnimation: function() {
        let anim = this.lb_win.getComponent(cc.Animation)
        if (anim) {
            anim.play("multIdle");
        }
    },

    setSpriteFrameByMult: function(mult, isShowGold) {
        if (mult < 10) {
            this.bg.active = false;
            return;
        }
        this.bg.active = true;
        if (mult == 10) {
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
