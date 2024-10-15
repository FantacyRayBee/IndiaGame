cc.Class({
    extends: cc.Component,

    properties: {
       
    },

    onLoad () {
        let btnArr = this.node.getComponentsInChildren(cc.Button);
        for (let i = 0; i < btnArr.length; i++) {
            btnArr[i].node.on("click", this.btnClick, this)
        }
    },

    start () {

    },

    btnClick:function(button){
        GlobalCfg.G_COMPONENTS.Audio.playButton();
        this.node.destroy();
    },
    
    // update (dt) {},
});
