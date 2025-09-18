cc.Class({
    extends: cc.Component,

    properties: {
        btn_close: cc.Button,
        btn_jump: cc.Button,
    },
    start() {
        this.btn_close.node.on('click', this.onCloseClick, this);
        this.btn_jump.node.on('click', this.onJumpClick, this);
    },

    onCloseClick() {
        this.node.destroy();
    },

    onJumpClick() {
        let url = "https://m.youtube.com/watch?v=PZejs3XDCSY&source_ve_path=OTY3MTQ&embeds_referring_euri=https%3A%2F%2Faviator-next.spribegaming.com%2F"
        cc.sys.openURL(url);
    },
});
