cc.Class({
    extends: cc.Component,

    properties: {
        skeleton_fruit: sp.Skeleton,
        skeleton_kuang: sp.Skeleton,
    },

    ctor: function() {
        this.loadBundleName = "fruitMachine";
        this.skeletonUrl = "skeleton/";

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
    },

    setFruitSkeletonJing: function(type) {
        let skeletonName = this.skeletonNameArr[type - 1];
        if (!skeletonName) {
            return;
        };   
        this.loadFruitSkeletonData(skeletonName, (skeletonData, self) => {
            if (self && self.skeleton_fruit) {
                self.skeleton_fruit.skeletonData = skeletonData;
                self.skeleton_fruit.setAnimation(0, 'jing', false);
            };
        }, this);
    },

    setFruitSkeletonDong: function() {
        if (this.skeleton_fruit) {
            this.skeleton_fruit.addAnimation(0, 'dong', false);
        };
    },

    setKuangSkeletonDong: function() {
        if (this.skeleton_kuang && !this.skeleton_kuang.node.active) {
            this.skeleton_kuang.node.active = true
            this.skeleton_kuang.setAnimation(0, 'animation', true);
        };
    },

    setCloseSkeletonDong: function(time = 2) {
        this.scheduleOnce(()=>{
            if (this && this.skeleton_fruit) {
                this.skeleton_fruit.setAnimation(0, 'jing', false);
            };
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
