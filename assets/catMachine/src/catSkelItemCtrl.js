cc.Class({
    extends: cc.Component,

    properties: {
        skeleton_icon: sp.Skeleton,
    },

    ctor: function() {
        this.loadBundleName = "catMachine";
        this.skeletonUrl = "spine/symbol/";
    },

    onLoad: function() {
        this.skeleton_kuang = this.node.getChildByName("skeleton_kuang").getComponent(sp.Skeleton);
        this.mask_dragon = this.node.getChildByName("mask")
        this.skel_dragon = this.mask_dragon.getChildByName("dragon")
    },

    setItemData: function(itemID) {
        this.typeId = itemID;
        let spriteName = itemID == 8 ? "icon_8" : "tubiao";
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
            let typeId = this.typeId;
            if (typeId == 8) { //龙骨动画
                this.skeleton_icon.setAnimation(0, "skill", true);
            }
            else{
                this.skeleton_icon.setAnimation(0, "item_" + typeId, true);
            }
            this.setKuangSkeletonDong();
        };
    },

    stopAnimation: function(time = 2, isHideDragon = true) {
        this.scheduleOnce(()=>{
            this.skeleton_icon.node.active = false;
            if (isHideDragon) {
                this.skeleton_kuang.node.active = false
                this.mask_dragon.active = false;
            }
        }, time);
    },

    setKuangSkeletonDong: function () {
        if (this.skeleton_kuang && !this.skeleton_kuang.node.active) {
            this.skeleton_kuang.node.active = true
            this.skeleton_kuang.setAnimation(0, 'idle', true);
        };
    },

    //type: 1为 1,2行 2为 2,3行 3为 1,2,3行
    showDragon: function (type) {
        this.mask_dragon.active = true;
        if (type == 1) {
            this.mask_dragon.height = 326;
            this.mask_dragon.position = cc.v2(0, -66.863);
            this.skel_dragon.position = cc.v2(0, -81.078);

        } else if (type == 2) {
            this.mask_dragon.height = 326;
            this.mask_dragon.position = cc.v2(0, -214.276);
            this.skel_dragon.position = cc.v2(0, -81.078);
        } 
        else if (type == 3) {
            this.mask_dragon.height = 457.7;
            this.mask_dragon.position = cc.v2(0, -153.177);
            this.skel_dragon.position = cc.v2(0, 0);
        }
    },

    //播放元素出现动画
    playFreeGameApppear: function () {
        if (this.skeleton_icon) {
            this.skeleton_icon.node.active = true;
            this.skeleton_icon.setAnimation(0, "item_" + this.typeId, false);
        };
    },

    //播放Free元素 等待弹框动画
    playFreeGameWait: function () {
        if (this.skeleton_icon) {
            this.skeleton_icon.setAnimation(0, "item_10_1", true);
            this.scheduleOnce(()=>{
                this.skeleton_icon.setAnimation(0, "item_10_2", true);
            }, 2);
        };
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
        let url = this.skeletonUrl + skeletonName;

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
