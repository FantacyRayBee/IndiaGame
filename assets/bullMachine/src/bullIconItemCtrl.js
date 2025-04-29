cc.Class({
    extends: cc.Component,

    properties: {
        spriteAtlas_icon: cc.SpriteAtlas,
        skeleton_item: sp.Skeleton,
        icon_node: cc.Node,
    },

    ctor: function() {
        this.loadBundleName = "bullMachine";
        this.skeletonUrl = "spine/";
    },

    setItemData: function(itemID) {
        this.typeId = itemID;
        let spriteName = "Symbol_" + (itemID - 1);
        let spriteFrame = this.spriteAtlas_icon.getSpriteFrame(spriteName);
        if (!spriteFrame) {
            return;
        };
        this.icon_node.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        this.icon_node.color = new cc.Color(255, 255, 255);
    },

    playAnimation: function() {
        let skeletonName = "";
        if (!skeletonName || skeletonName == "") {
            return;
        };
        this.icon_node.active = false;
        this.skeleton_item.node.active = true;
        let spriteName = "icon_" + (type * 10);
        let animName = "icon_" + (type * 10);
        this.loadMayaSkeletonData(skeletonName, (skeletonData, self) => {
            if (self && this.skeleton_item) {
                this.skeleton_item.skeletonData = skeletonData;
                this.skeleton_item.setAnimation(0, animName, false);
            };
        }, this);

        let spriteFrame = this.spriteAtlas_icon.getSpriteFrame(spriteName);
        if (!spriteFrame) {
            return;
        };
        this.icon_node.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        if(type == 11) return; //scatter元素出现时需要播放动画
        this.skeleton_item.node.active = false;
        this.icon_node.active = true;
    },

    //未中奖的item置灰
    setGrayColor: function() {
        this.icon_node.color = new cc.Color(100, 100, 100);
    },

    stopAnimation: function() {
        this.icon_node.active = true;
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

    initIcon: function() {
        let type = Math.floor(Math.random() * 8);
        let spriteName = "Symbol_0" + type;
        let spriteFrame = this.spriteAtlas_icon.getSpriteFrame(spriteName);
        if (!spriteFrame) {
            return;
        };
        this.icon_node.getComponent(cc.Sprite).spriteFrame = spriteFrame;
    },
});
