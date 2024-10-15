cc.Class({
    extends: cc.Component,

    properties: {
        btn_close: cc.Button,
        lab_playerName: cc.Label,
        lab_playerCoin: cc.Label,
        node_bgJB: cc.Node,
        node_head: cc.Sprite,
    },

    onLoad() {
        this.btn_close.node.on('click', () => {
            GlobalCfg.G_COMPONENTS.Audio.playButton();
            this.node.destroy()
        }, this)
    },

    setUserDate: function(headUrl, name, diamond, trial) {
        if (headUrl) this.loadHeadSp(headUrl, 110);
        if (name) this.lab_playerName.string = CommonFun.getInstance().getStrByLength(name, 12);
        if (diamond) this.lab_playerCoin.string = CommonFun.getInstance().numberToShow(diamond / 100);
        if (trial) this.node_bgJB.active = trial ? false : true;
    },

    loadHeadSp: function (spriteurl, realWidth) {
        if (spriteurl && spriteurl.length > 0) {
            cc.assetManager.loadRemote(spriteurl, {ext: '.png'}, (err, texture) => {
                if (!err && cc.isValid(this) && cc.isValid(this.node_head)) {
                    this.node_head.spriteFrame = new cc.SpriteFrame(texture);
                    this.node_head.node.setScale(realWidth / this.node_head.node.width);
                };
            });
        };
    },

    onDestroy: function() {
        CommonFun.getInstance().releasePrefab(GlobalCfg.PREFAB_PATH.USERHEAD);
    },
});