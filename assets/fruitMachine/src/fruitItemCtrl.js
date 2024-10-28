cc.Class({
    extends: cc.Component,

    properties: {
        skeleton_fruit: sp.Skeleton,
        skeleton_kuang: sp.Skeleton,
        spriteAtlas_icon: cc.SpriteAtlas,
        icon_node: cc.Node,
    },

    ctor: function() {
        this.loadBundleName = "fruitMachine";
        this.skeletonUrl = "spine/";

        this.skeletonNameArr = [
            'pingguo',
            'qingmang',
            'juzi',
            'putao',
            'xigua',
            'yingtao',
            'lingdang',
            '777',
            'bar',
            'wild',
            'sanyecao'
        ];

        this.skeletonNameArr2 = [
            'maya_icon_1', //正常元素
            'maya_icon_2', //wild，scatter元素
        ];
    },

    setFruitSkeletonJing: function(type) {
        let skeletonName = "";
        if (type < 10) {
            skeletonName = this.skeletonNameArr2[0];
        }
        else {
            skeletonName = this.skeletonNameArr2[1];
            type = type + 1; //因为spine动画给过来的时候已经给wild元素设置成11了，所以这里要加1
        }
        if (!skeletonName || skeletonName == "") {
            return;
        };
        this.icon_node.active = false;
        this.skeleton_fruit.node.active = true;
        let spriteName = "icon_" + (type * 10);
        this.loadFruitSkeletonData(skeletonName, (skeletonData, self) => {
            if (self && this.skeleton_fruit) {
                this.skeleton_fruit.skeletonData = skeletonData;
                this.skeleton_fruit.setAnimation(0, spriteName, false);
            };
        }, this);

        let spriteFrame = this.spriteAtlas_icon.getSpriteFrame(spriteName);
        if (!spriteFrame) {
            return;
        };
        this.icon_node.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        this.skeleton_fruit.node.active = false;
        this.icon_node.active = true;
    },

    setFruitSkeletonDong: function() {
        if (this.skeleton_fruit) {
            this.icon_node.active = false;
            this.skeleton_fruit.node.active = true;
            // this.skeleton_fruit.addAnimation(0, 'dong', false);
        };
    },

    setKuangSkeletonDong: function() {
        if (this.skeleton_kuang && !this.skeleton_kuang.node.active) {
            this.skeleton_kuang.node.active = true
            this.skeleton_fruit.node.active = true;
            // this.skeleton_kuang.setAnimation(0, 'LOCK_loop', true);
        };
    },

    setCloseSkeletonDong: function(time = 2) {
        this.scheduleOnce(()=>{
            this.skeleton_fruit.node.active = false;
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

    loadFruitSkeletonData: function(skeletonName, func = null, target = null) {
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
});
