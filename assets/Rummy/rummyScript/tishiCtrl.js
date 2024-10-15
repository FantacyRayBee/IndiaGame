cc.Class({
    extends: cc.Component,

    properties: {
        lab_tishi: cc.Label,
    },

    onLoad() {
    },

    setTishi: function (content) {
        if (this.lab_tishi) {
            this.lab_tishi.string = content;
        }
        return
    },

    removeFromParentNode: function (parentNode) {
        parentNode.removeChild(this.node);
    },

    start() {

    },

    // update (dt) {},
});
