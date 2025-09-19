
cc.Class({
    extends: cc.Component,

    properties: {
        btn_close:cc.Button
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.btn_close.node.on('click',()=>{
            GlobalCfg.G_COMPONENTS.Audio.playBack();
            this.node.destroy();
        });
    },

    // update (dt) {},
});
