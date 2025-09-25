
cc.Class({
    extends: cc.Component,

    properties: {
        btn_close:cc.Button,
        lab:cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.btn_close.node.on('click',()=>{
            GlobalCfg.G_COMPONENTS.Audio.playBack();
            this.node.destroy();
        });
    },

    setContent: function (str) {
        this.lab.string = str;
    }

    // update (dt) {},
});
