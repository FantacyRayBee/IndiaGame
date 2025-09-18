cc.Class({
    extends: cc.Component,

    properties: {
        rectLight: cc.Node,
        blueLabColor: cc.Color,
        purpleLabColor: cc.Color,
        redLabColor: cc.Color,
    },
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
        if (value >= 0 && value < 2) {
            color = this.blueLabColor;
        } else if (value >= 2 && value < 10) {
            color = this.purpleLabColor;
        } else if (value >= 10) {
            color = this.redLabColor;
        }
        // this.node.getComponent(cc.Sprite).spriteFrame = _sp;
        this.node.getChildByName('Label').color = color;
        this.node.getChildByName('Label').getComponent(cc.Label).string =  CommonFun.getInstance().fixed(data.mul / 1000) + 'x ';
    },

    showLight(bool) {
        this.isShowLight = false;
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

