cc.Class({
    extends: cc.Component,

    properties: {
        skeleton_icon: sp.Skeleton,
        skeleton_kuang: sp.Skeleton,
        spriteAtlas_icon: cc.SpriteAtlas,
        icon_node: cc.Node,
    },

    ctor: function() {
        this.loadBundleName = "catMachine";
        this.skeletonUrl = "spine/sysboms/";
    },

    setSkeletonJing: function(type) {
        let spriteName = "icon_" + type;
        let spriteFrame = this.spriteAtlas_icon.getSpriteFrame(spriteName);
        if (!spriteFrame) {
            return;
        };
        this.icon_node.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        this.skeleton_icon.node.active = false;
        this.icon_node.active = true;
    },

    setSkeletonDong: function() {
        // if (this.skeleton_icon) {
        //     if (this.typeId == 10) {
        //         this.skeleton_icon.setAnimation(0, "dong", true);
        //     }
        //     else{
        //         this.icon_node.active = false;
        //         this.skeleton_icon.node.active = true;
        //     }
        // };
    },

    setKuangSkeletonDong: function() {
        if (this.skeleton_kuang && !this.skeleton_kuang.node.active) {
            this.skeleton_kuang.node.active = true
            // this.skeleton_icon.node.active = true;
            // this.skeleton_kuang.setAnimation(0, 'LOCK_loop', true);
        };
    },

    setCloseSkeletonDong: function(time = 2) {
        this.scheduleOnce(()=>{
            this.skeleton_icon.node.active = false;
            this.icon_node.active = true;
            if (this && this.skeleton_kuang) {
                this.skeleton_kuang.node.active = false;
            };
        }, time);
    },

    loadGameAssets: function (gameBundleName, func, target) {
        if (gameBundleName) {
            CommonFun.getInstance().loadBundle(gameBundleName, (bundle) => {
                func && func(bundle, target);
            }, (err) => {
                LoggerUtil.getInstance().error(err);
            });
        }
    },

    loadMayaSkeletonData: function(skeletonName, func = null, target = null) {
        if (!skeletonName || skeletonName.length == 0) {
            return;
        };
        let self = this;
        this.loadGameAssets(self.loadBundleName, (bundle, target) => {
            bundle.load(self.skeletonUrl + skeletonName, sp.SkeletonData, (err, skeletonData) => {
                if (!err) {
                    func && func(skeletonData, target);
                }
                else{
                    LoggerUtil.getInstance().error(err);
                }
            });
        }, target);
    },

    initIcon: function() {
        let type = Math.floor(Math.random() * 10 + 1);
        let spriteName = "icon_" + type;
        let spriteFrame = this.spriteAtlas_icon.getSpriteFrame(spriteName);
        if (!spriteFrame) {
            return;
        };
        this.icon_node.getComponent(cc.Sprite).spriteFrame = spriteFrame;
    },
});
