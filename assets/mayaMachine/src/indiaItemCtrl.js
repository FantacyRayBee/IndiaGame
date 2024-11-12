cc.Class({
    extends: cc.Component,

    properties: {
        skeleton_maya: sp.Skeleton,
        skeleton_kuang: sp.Skeleton,
        spriteAtlas_icon: cc.SpriteAtlas,
        icon_node: cc.Node,
    },

    ctor: function() {
        this.loadBundleName = "mayaMachine";
        this.skeletonUrl = "spine/sysboms/";

        this.skeletonNameArr = [
            'l1.skel38','L2.skel','l3.skel38','l4.skel38',
            'H7.skel','h1.skel38','H2.skel','h3.skel38',
            'h5.skel38','wild','scatter.skel',
        ];

    },

    setSkeletonJing: function(type) {
        this.typeId = type;
        let skeletonName = this.skeletonNameArr[type - 1];
        if (!skeletonName || skeletonName == "") {
            return;
        };
        this.icon_node.active = false;
        this.skeleton_maya.node.active = true;
        if (type == 10) { //wild元素特殊判断 因为没有sprite只能用spine的静态动画当做图片
            this.loadMayaSkeletonData('wild', (skeletonData, self) => {
                if (self && this.skeleton_maya) {
                    this.skeleton_maya.skeletonData = skeletonData;
                    this.skeleton_maya.setAnimation(0, "jing", false);
                };
            }, this);
            return;
        };
        let spriteName = "icon_" + type;
        this.loadMayaSkeletonData(skeletonName, (skeletonData, self) => {
            if (self && this.skeleton_maya) {
                this.skeleton_maya.skeletonData = skeletonData;
                if (type == 11) {
                    this.skeleton_maya.setAnimation(0, "act", false);
                }else{
                    this.skeleton_maya.setAnimation(0, "act", true);
                }
            };
        }, this);
        let spriteFrame = this.spriteAtlas_icon.getSpriteFrame(spriteName);
        if (!spriteFrame) {
            return;
        };
        this.icon_node.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        if (type == 11) {
            return;
        };
        this.skeleton_maya.node.active = false;
        this.icon_node.active = true;
    },

    setSkeletonDong: function() {
        if (this.skeleton_maya) {
            if (this.typeId == 10) {
                this.skeleton_maya.setAnimation(0, "dong", true);
            }
            else{
                this.icon_node.active = false;
                this.skeleton_maya.node.active = true;
            }
        };
    },

    setKuangSkeletonDong: function() {
        if (this.skeleton_kuang && !this.skeleton_kuang.node.active) {
            this.skeleton_kuang.node.active = true
            this.skeleton_maya.node.active = true;
            // this.skeleton_kuang.setAnimation(0, 'LOCK_loop', true);
        };
    },

    setCloseSkeletonDong: function(time = 2) {
        this.scheduleOnce(()=>{
            if (this.typeId == 10) {
                this.skeleton_maya.setAnimation(0, "jing", false);
            }
            else{
                this.skeleton_maya.node.active = false;
                this.icon_node.active = true;
            }
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
