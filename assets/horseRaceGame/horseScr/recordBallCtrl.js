cc.Class({
    extends: cc.Component,

    properties: {
        
    },


    onLoad() {},

    start() {

    },

    setID: function (id) {
        if (CommonFun.getInstance().isValidForScr(this) && this.node.getChildByName("num_0" + id)) {
            this.node.getChildByName("num_0" + id).active = true;
        };
    },

    setNewState: function (state) {
        this.node.getChildByName("NEW").active = state;
    },

    setParticleState: function (state) {
    },
});