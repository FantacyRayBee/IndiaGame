cc.Class({
    extends: cc.Component,

    properties: {
        btn_close: cc.Button,
    },
    start() {
        this.btn_close.node.on('click', this.onCloseClick, this);
    },

    onCloseClick() {
        this.node.destroy();
    },
});
