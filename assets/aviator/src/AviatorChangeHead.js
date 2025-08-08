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
        this.init();
    },

    onCloseClick() {
        this.node.destroy();
    },

    init() {
        let userHeadId = GlobalCfg.ACT_SCENE_CTRL.headId

        for (let i = 0; i < this.maxNumber; i++) {
            let node = cc.instantiate(this.item);
            node.parent = this.content;
            node.active = true;
            node.name = i.toString();
            node.getChildByName('btn').getChildByName('head').getComponent(cc.Sprite).spriteFrame = this.atlas_head.getSpriteFrame('head_' + (i + 1));
            if (i + 1 == parseInt(userHeadId)) {
                node.getChildByName('select').active = true;
            } else {
                node.getChildByName('select').active = false;
            }
            node.getChildByName('btn').on('click', this.onItemClick, this);
        }
    },

    onItemClick(btn) {
        let index = parseInt(btn.node.parent.name);
        GlobalCfg.ACT_SCENE_CTRL.headId = index + 1; // 设置选中的头像ID
        GameServerManager.send("gameservice.sethead", "SetHeadReq", {
            head: index + 1,
        });
        this.onCloseClick();
    },
});
