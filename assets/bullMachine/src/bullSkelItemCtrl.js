cc.Class({
    extends: cc.Component,

    properties: {
        skeleton_item: sp.Skeleton,
    },

    ctor: function() {
        this.loadBundleName = "bullMachine";
        this.skeletonUrl = "spine/symbol/";

        this.skeletonNameArr = [
            '9','10','J','Q','K','A','milu','lang','xiong','laoying','niu','wild','jb'
        ];
    },

    setItemData: function(itemID) {
        this.typeId = itemID;
        this.stopAnimation();
    },

    playAnimation: function() {
        let skelName = this.typeId > 100 ? 12: this.typeId;
        let skeletonName = this.skeletonNameArr[skelName - 1];
        if (!skeletonName || skeletonName == "") {
            return;
        };
        let animName = "animation";
        if (this.typeId == 12) {
            animName = "wild";
        }
        else if (this.typeId > 100) {
            //说明是带倍数的wild，百位是倍数
            animName = Math.floor(this.typeId / 100) + "x";
        }
        this.loadSkeletonData(skeletonName, (skeletonData, self) => {
            if (self && self.skeleton_item) {
                self.skeleton_item.skeletonData = skeletonData;
                self.skeleton_item.setAnimation(0, animName, true);
            };
        }, this);
        this.skeleton_item.node.active = true;
    },
    stopAnimation: function() {
        this.skeleton_item.node.active = false;
    },

    loadSkeletonData: function(skeletonName, func = null, target = null) {
        if (!skeletonName || skeletonName.length == 0) {
            return;
        };
        let self = this;
        this.loadGameAssets(self.loadBundleName, (bundle, target) => {
            bundle.load(self.skeletonUrl + skeletonName, sp.SkeletonData, (err, skeletonData) => {
                if (!err) {
                    func && func(skeletonData, target);
                }
            });
        }, target);
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
});
