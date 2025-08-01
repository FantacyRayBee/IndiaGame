cc.Class({
    extends: cc.Component,

    properties: {
        btn_close1: cc.Button,
        btn_close2: cc.Button,

        atlas_head: cc.SpriteAtlas,
        item: cc.Node,
        content: cc.Node,
    },
    start() {
        this.maxNumber = 72; // 最大数量
        this.btn_close1.node.on('click', this.onCloseClick, this);
        this.btn_close2.node.on('click', this.onCloseClick, this);
    },

    onCloseClick() {
        this.node.destroy();
    },

    init(userHeadId) {
        for (let i = 0; i < this.maxNumber; i++) {
            let node = cc.instantiate(this.item);
            node.parent = this.content;
            node.active = true;
            node.name = i;
            node.getChildByName('head').getComponent(cc.Sprite).spriteFrame = this.atlas_head.getSpriteFrame('head' + i);
            if (i == userHeadId) {
                node.getChildByName('select').active = true;
            } else {
                node.getChildByName('select').active = false;
            }
            node.getChildByName('btn').on('click', this.onItemClick, this);
        }
    },

    onItemClick(event) {
        
    },
});
