cc.Class({
    extends: cc.Component,

    properties: {
        rectLight: cc.Node,
        greenLabColor: cc.Color,
        orangeLabColor: cc.Color,
        purpleLabColor: cc.Color,
        blueLabColor: cc.Color,
        greenSpriteFrame: cc.SpriteFrame,
        orangeSpriteFrame: cc.SpriteFrame,
        purpleSpriteFrame: cc.SpriteFrame,
        blueSpriteFrame: cc.SpriteFrame,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        this.duringTime = 0;
    },

    /**
     * 
     * @param {Point {x,mul}} data 
     */
    init(data) {
        let value = Number((data.mul / 1000).toFixed(2));
        let color = this.node.getChildByName('Label').color;
        let _sp = this.node.getComponent(cc.Sprite).spriteFrame;
        if (value >= 0 && value < 3) {
            color = this.greenLabColor;
            _sp = this.greenSpriteFrame;
        } else if (value >= 3 && value < 6) {
            color = this.blueLabColor;
            _sp = this.blueSpriteFrame;
        } else if (value >= 6 && value < 12) {
            color = this.purpleLabColor;
            _sp = this.purpleSpriteFrame;
        } else if (value >= 12) {
            color = this.orangeLabColor;
            _sp = this.orangeSpriteFrame;
        }
        this.node.getComponent(cc.Sprite).spriteFrame = _sp;
        this.node.getChildByName('Label').color = color;
        this.node.getChildByName('Label').getComponent(cc.Label).string = value + 'x';
    },

    showLight(bool) {
        this.isShowLight = bool;
    },

    update(dt) {
        if (this.isShowLight == true) {
            this.duringTime += dt;
            let count = Math.floor(this.duringTime / 0.2);
            if (count % 2 == 0) {
                this.rectLight.active = true;
            } else if (count % 2 == 1) {
                this.rectLight.active = false;
            }
            if (count > 10) {
                this.isShowLight = false;
            }
        }
    },
});

