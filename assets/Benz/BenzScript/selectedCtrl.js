
cc.Class({
    extends: cc.Component,

    properties: {
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.sprSelected = this.node.getChildByName("spr_selected");
        this.sprSelectedAnim = this.node.getChildByName("spr_selectedAnim");
    },

    start () {
    },

    setSelfOpacity:function (value,blink) {
        this.sprSelected.opacity = value
        this.sprSelectedAnim.active = blink
        if(blink){
            this.sprSelected.active = false;
        }
    }

    

    // update (dt) {},
});
