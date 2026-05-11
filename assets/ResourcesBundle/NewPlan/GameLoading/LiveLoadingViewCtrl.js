cc.Class({
    extends: cc.Component,

    properties: {
        img_background: cc.Sprite,
        hor_sprites: [cc.SpriteFrame],
        ver_sprites: [cc.SpriteFrame],
    },

    onLoad: function () {
    },

    setFromLobbyEnterGame: function (isHorizotal) {
        this.img_background.spriteFrame = isHorizotal ? this.hor_sprites[Math.floor(Math.random() * 5)] : this.ver_sprites[Math.floor(Math.random() * 5)];
    },

    onDestroy: function () {
        CommonFun.getInstance().releasePrefab(GlobalCfg.PREFAB_PATH.LIVELOAD);
    },
});
