cc.Class({
    extends: cc.Component,

    properties: {
        content: cc.Node,
        item: cc.Node,
    },

    onLoad() {
        //top
        this.node_top = this.node.getChildByName("top");
        this.lab_Result = this.node_top.getChildByName("lab_Result").getComponent(cc.Label);
        //bottom
        this.node_bottom = this.node.getChildByName("bottom");
    },

    start() {
        
    },
});
