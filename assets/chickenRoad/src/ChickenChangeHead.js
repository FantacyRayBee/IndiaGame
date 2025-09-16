cc.Class({
    extends: cc.Component,

    properties: {
        btn_close1: cc.Button,
        btn_save: cc.Button,

        atlas_head: cc.SpriteAtlas,
        item: cc.Node,
        content: cc.Node,
    },
    start() {
        this.maxNumber = 12; // 最大数量
        this.headList = [];
        this.curHeadId = GlobalCfg.ACT_SCENE_CTRL.headId;
        this.btn_close1.node.on('click', this.onCloseClick, this);
        this.btn_save.node.on('click', this.onSaveClick, this);
        this.init();
    },

    onCloseClick() {
        this.node.destroy();
    },

    init() {
        for (let i = 0; i < this.maxNumber; i++) {
            let node = cc.instantiate(this.item);
            node.parent = this.content;
            node.active = true;
            node.name = i.toString();
            this.headList.push(node);
            node.getChildByName('btn').getChildByName('head').getComponent(cc.Sprite).spriteFrame = this.atlas_head.getSpriteFrame('img_head_' + (i + 1));
            if (i + 1 == parseInt(this.curHeadId)) {
                node.getChildByName('select').active = true;
            } else {
                node.getChildByName('select').active = false;
            }
            node.getChildByName('btn').on('click', this.onItemClick, this);
        }
    },

    onItemClick(btn) {
        let index = parseInt(btn.node.parent.name);
        this.curHeadId = index + 1; // 设置选中的头像ID
        for (let i = 0; i < this.headList.length; i++) {
            if (i == index) {
                this.headList[i].getChildByName('select').active = true;
            } else {
                this.headList[i].getChildByName('select').active = false;
            }
        }
    },

    onSaveClick(btn) {
        let index = parseInt(this.curHeadId);
        GlobalCfg.ACT_SCENE_CTRL.headId = index; // 设置选中的头像ID
        GameServerManager.send("gameservice.sethead", "SetHeadReq", {
            head: index + 1,
        });
        this.onCloseClick();
    },
});
