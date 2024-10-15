cc.Class({
    extends: cc.Component,

    properties: {
        skeleton_role: sp.Skeleton,
    },

    checkShiPei: function() {
        let w = cc.view.getVisibleSize().width;
        let x = (w/2 - 470)/2 + 470;
        this.node.x = x;
    },

    onLoad: function() {
        this.checkShiPei();
    },

    playRoleDongZuoAnim: function() {
        this.skeleton_role.defaultSkin = 'default';
        this.skeleton_role.timeScale = 0.8;
        this.skeleton_role.setAnimation(0, 'dongzuo', false);
        this.skeleton_role.setCompleteListener((trackEntry, loopCount) => {
            let name = trackEntry.animation.name;
            if (name == 'dongzuo') {
                this.playRoleDaiJiAnim();
            }
        });
    },

    playRoleDaiJiAnim: function() {
        this.skeleton_role.defaultSkin = 'default';
        this.skeleton_role.setAnimation(0, 'daiji', true);
    },
});
