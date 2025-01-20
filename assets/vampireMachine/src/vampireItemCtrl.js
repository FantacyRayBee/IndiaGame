cc.Class({
    extends: cc.Component,

    properties: {
        skeleton_icon: sp.Skeleton,
        skeleton_kuang: sp.Skeleton,
        spriteAtlas_icon: cc.SpriteAtlas,
        icon_node: cc.Node,
    },

    ctor: function() {
        this.loadBundleName = "vampireMachine";
        this.skeletonUrl = "spine/sysboms/";

        this.skeletonNameArr = [
            'G007_J_YS1','G007_Q_YS1','G007_K_YS1','G007_A_YS1',
            'G007_shizijia_YS7','G007_jiubei_YS4','G007_bianfu_YS2','G007_langtou_YS.skel',
            'G007_xixuegui_YS8','G007_meigui_YS6','G007_langrenyl_YS5',
        ];
    },

    setSkeletonJing: function(type) {
        this.typeId = type;
        let skeletonName = this.skeletonNameArr[type - 1];
        if (!skeletonName || skeletonName == "") {
            return;
        };
        this.icon_node.active = false;
        this.skeleton_icon.node.active = true;
        let spriteName = "icon_" + type;
        this.loadMayaSkeletonData(skeletonName, (skeletonData, self) => {
            if (self && this.skeleton_icon) {
                this.skeleton_icon.skeletonData = skeletonData;
                if (type == 8) {
                    this.skeleton_icon.setAnimation(0, "animation", true);
                }else{
                    this.skeleton_icon.setAnimation(0, "circulate", true);
                }
            };
        }, this);
        let spriteFrame = this.spriteAtlas_icon.getSpriteFrame(spriteName);
        if (!spriteFrame) {
            return;
        };
        this.icon_node.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        this.skeleton_icon.node.active = false;
        this.icon_node.active = true;
    },

    setSkeletonDong: function() {
        if (this.skeleton_icon) {
            this.icon_node.active = false;
            this.skeleton_icon.node.active = true;
        };
    },

    setKuangSkeletonDong: function() {
        if (this.skeleton_kuang && !this.skeleton_kuang.node.active) {
            this.skeleton_kuang.node.active = true
            this.skeleton_icon.node.active = true;
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
