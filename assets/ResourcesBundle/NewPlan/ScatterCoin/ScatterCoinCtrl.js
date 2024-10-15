cc.Class({
    extends: cc.Component,

    properties: {
        ske_saJinBi: sp.Skeleton,
    },

    onLoad: function() {
        this.ske_saJinBi.node.active = true;
        GlobalCfg.G_COMPONENTS.Audio.playSoundByNameInResources("sajinbi", false);
        this.ske_saJinBi.setAnimation(0, 'sajinbi', false);
        this.ske_saJinBi.setCompleteListener((trackEntry, loopCount) => {
            let name = trackEntry.animation.name;
            if (name == "sajinbi") {
                this.node.destroy();
            };
        });
    },

    onDestroy: function () {
        CommonFun.getInstance().releasePrefab(GlobalCfg.PREFAB_PATH.SCATTERCOIN);
    },
});