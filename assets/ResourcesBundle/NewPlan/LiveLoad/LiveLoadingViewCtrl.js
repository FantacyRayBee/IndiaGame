cc.Class({
    extends: cc.Component,

    properties: {
    },

    onLoad: function () {
    },

    onDestroy: function () {
        CommonFun.getInstance().releasePrefab(GlobalCfg.PREFAB_PATH.LIVELOAD);
    },
});
