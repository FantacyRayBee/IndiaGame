cc.Class({
    extends: cc.Component,

    properties: {
        node_info1: cc.Node,
        node_info2: cc.Node,
    },
    ctor: function () {
    },

    onLoad: function () {
        let btnArr = this.node.getComponentsInChildren(cc.Button);
        for (let i = 0; i < btnArr.length; i++) {
            btnArr[i].node.on("click", this.btnClick, this)
        }
    },

    btnClick: function (button) {
        let btnName = button.node.name;
        if (btnName == "btn_close") {
            GlobalCfg.G_COMPONENTS.Audio.playBack();
            this.node.destroy();
            return;
        }
        else if ( btnName == "btn_left") {
            GlobalCfg.G_COMPONENTS.Audio.playButton();
            this.node_info1.active = true;
            this.node_info2.active = false;
        } 
        else if ( btnName == "btn_right") {
            GlobalCfg.G_COMPONENTS.Audio.playButton();
            this.node_info1.active = false;
            this.node_info2.active = true;
        } 
    },
}); 
