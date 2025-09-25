cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    onLoad: function() {
        cc.tween(this.node)
        .to(2, { opacity: 0})
        .call(()=>{
            this.node.destroy();
        })
        .start(); 
    },


    onDestroy: function() {
        CommonFun.getInstance().releasePrefab(GlobalCfg.PREFAB_PATH.GAMESTARTMASK);
    },
});
