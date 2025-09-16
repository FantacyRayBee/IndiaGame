cc.Class({
    extends: cc.Component,

    properties: {
        sp_bg: cc.Sprite,
        spriteframe_bg: [cc.SpriteFrame],
        
        node_normal: cc.Node,
        node_pass: cc.Node,
        node_final: cc.Node,

        spriteframe_egg1: cc.SpriteFrame,
        spriteframe_egg2: cc.SpriteFrame,
    },

    ctor() {
        this.isPass = false;
    },

    start() {
    },
    onDestroy() {
        this.unschedule(this._fireTimerCb);
    },

    setPanel(index, isEnd) {
        this.sp_bg.spriteFrame = isEnd ? this.spriteframe_bg[4] : this.spriteframe_bg[index];
        this.init(isEnd);
    },

    init(isEnd){
        this.isPass = false;    
        this.node_normal.active = true;
        this.node_normal.scaleX = 0.4;
        this.node_pass.active = false;
        this.node_final.active = false;
        if (isEnd) {
            this.node_normal.active = false;
            this.node_final.active = true;
            this.node_final.getComponent(cc.Animation).play("wing"); 
            this.node_final.getComponent(cc.Sprite).SpriteFrame = this.spriteframe_egg1;
            this.node_final.getChildByName('lab_final').active = true;
            this.node_final.getChildByName('lab_final2').active = false;
        }
    },
    
    setData(mult){
        this.node_normal.getChildByName('lab_normal').getComponent(cc.Label).string = mult + 'x';
        this.node_pass.getChildByName('lab_pass').getComponent(cc.Label).string = mult + 'x';
        this.node_final.getChildByName('lab_final').getComponent(cc.Label).string = mult + 'x';
        this.node_final.getChildByName('lab_final2').getComponent(cc.Label).string = mult + 'x';
    },

    /**
     * 通用切换动画 (scaleX 翻转衔接)
     */
    switchNode(fromNode, toNode) {
        if (!fromNode || !toNode) return;

        toNode.scaleX = 0;
        toNode.active = false;

        cc.tween(fromNode)
            .to(0.2, { scaleX: 0 })
            .call(() => {
                fromNode.active = false;
                toNode.active = true;
                cc.tween(toNode).to(0.2, { scaleX: 0.4 }).start();
            })
            .start();
    },

    rotate(type) {
        if (type == 1) { // normal -> pass
            this.isPass = true;
            this.switchNode(this.node_normal, this.node_pass);
        }
        else if (type == 4) { // 达到终点
            this.node_final.getComponent(cc.Sprite).SpriteFrame = this.spriteframe_egg2;
            this.node_final.getChildByName('lab_final').active = false;
            this.node_final.getChildByName('lab_final2').active = true;
        }
        else if (type == 5) { // pass -> normal
            this.switchNode(this.node_pass, this.node_normal);
        }
        else if (type == 6) { // final -> normal
            this.node_final.getComponent(cc.Sprite).SpriteFrame = this.spriteframe_egg1;
            this.node_final.getChildByName('lab_final').active = true;
            this.node_final.getChildByName('lab_final2').active = false;
        }
    },
});
