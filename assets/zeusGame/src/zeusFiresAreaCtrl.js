cc.Class({
    extends: cc.Component,

    properties: {
        skeleton_fireArr: [sp.Skeleton],
        skeletonData_fireNormal: sp.SkeletonData,
        skeletonData_fireFree: sp.SkeletonData,
    },

    setFireSpinFreeType: function() {
        this.skeleton_fireArr.forEach(skeleton_fire => {
            skeleton_fire.skeletonData = this.skeletonData_fireFree;
            skeleton_fire.defaultSkin = 'default';
            skeleton_fire.setAnimation(0, 'animation', true);
        });
    },

    setFireSpinNormalType: function() {
        this.skeleton_fireArr.forEach(skeleton_fire => {
            skeleton_fire.skeletonData = this.skeletonData_fireNormal;
            skeleton_fire.defaultSkin = 'default';
            skeleton_fire.setAnimation(0, 'animation', true);
        });
    },
});
