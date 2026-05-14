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
        let targetArr = isHorizotal ? this.hor_sprites : this.ver_sprites;
        let fallbackArr = isHorizotal ? this.ver_sprites : this.hor_sprites;

        if (Array.isArray(targetArr) && targetArr.length > 0) {
            this.img_background.spriteFrame = targetArr[Math.floor(Math.random() * targetArr.length)];
            return;
        }

        // 目标数组为空时兜底，避免保留上一次的背景造成“方向看起来没变”
        if (Array.isArray(fallbackArr) && fallbackArr.length > 0) {
            this.img_background.spriteFrame = fallbackArr[Math.floor(Math.random() * fallbackArr.length)];
        }
    },

    onDestroy: function () {
        CommonFun.getInstance().releasePrefab(GlobalCfg.PREFAB_PATH.LIVELOAD);
    },
});
