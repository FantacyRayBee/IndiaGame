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
        GlobalCfg.ACT_SCENE_CTRL.popupLayer.destroyAllChildren();
        GlobalCfg.ACT_SCENE_CTRL.popupLayer.active = false;
        GlobalCfg.ACT_SCENE_CTRL.touchbg.active = false;
    },
});
