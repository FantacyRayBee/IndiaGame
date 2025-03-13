cc.Class({
    extends: cc.Component,

    properties: {
        skeleton_icon: sp.Skeleton,
    },

    ctor: function() {
        this.loadBundleName = "jokerMachine";
        this.skeletonUrl = "anim/sysboms/";
    },

    setItemData: function(itemID) {
        this.typeId = itemID;
        let spriteName = "Symbol_0" + (itemID - 1);
        this.loadSkeletonData(spriteName, (skeletonData, self) => {
            if (self && this.skeleton_icon) {
                this.skeleton_icon.skeletonData = skeletonData;
            };
        }, this);
        this.skeleton_icon.node.active = false;
    },

    playAnimation: function() {
        if (this.skeleton_icon) {
            this.skeleton_icon.node.active = true;
            this.skeleton_icon.setAnimation(0, "Win", true);
        };
    },

    stopAnimation: function(time = 2) {
        this.scheduleOnce(()=>{
            this.skeleton_icon.node.active = false;
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

    loadSkeletonData: function(skeletonName, func = null, target = null) {
        if (!skeletonName || skeletonName.length == 0) {
            return;
        };
        let self = this;
        let url = this.skeletonUrl + skeletonName + "/" + skeletonName;
        this.loadGameAssets(self.loadBundleName, (bundle, target) => {
            bundle.load(url, sp.SkeletonData, (err, skeletonData) => {
                if (!err) {
                    func && func(skeletonData, target);
                }
                else{
                    LoggerUtil.getInstance().error(err);
                }
            });
        }, target);
    },
});
