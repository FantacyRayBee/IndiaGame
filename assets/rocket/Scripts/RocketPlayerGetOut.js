cc.Class({
    extends: cc.Component,

    properties: {

    },

    // onLoad () {},

    start() {
        this.originY = this.node.y;
    },

    setNodeData(data) {
        let name = data.nickname;
        let rate = data.mul ? Number(data.mul / 1000).toFixed(2) : 0;
        this.node.getComponent(cc.Label).string = name + "  x" + rate;
    },

    update(dt) {
        if (this.node.y < -300) {
            this.node.destroy();
        }
        if (cc.game.getFrameRate() >= 60) {
            this.node.y -= 2 * 3;
            this.node.x -= 1 * 3;
        } else {
            this.node.y -= 1.5 * 4;
            this.node.x -= 1 * 4;
        }
    },
});
