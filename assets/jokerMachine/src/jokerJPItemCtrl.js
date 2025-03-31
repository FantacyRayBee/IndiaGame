cc.Class({
    extends: cc.Component,

    properties: {
        spriteAtlas_icon: cc.SpriteAtlas,
        icon_node: cc.Node,
        jpr_node: cc.Node,
        skeleton_bottom: sp.Skeleton,
        skeleton_title: sp.Skeleton,
        lab_coin: cc.Label,
    },

    ctor: function() {
        this.spriteNameArr = [
            'MINOR',
            'MAJOR',
            'GRAND',
            'JOKER',
        ];
        this.skeletonSkinArr = [
            'Minor',
            'Major',
            'Grand',
            'Joker',
        ];
    },

    setItemData: function(itemID, coin) {
        this.itemID = itemID;
        this.coin = coin;
        let spriteFrame = this.spriteAtlas_icon.getSpriteFrame(this.spriteNameArr[itemID]);
        if (!spriteFrame) {
            return;
        };
        this.icon_node.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        this.jpr_node.active = false;
        this.icon_node.active = true;
        this.lab_coin.string = coin;
    },

    playAnimation: function() {
        this.icon_node.active = false;
        this.jpr_node.active = true;

        this.skeleton_title.setAnimation(0, 'Start', false);
        this.skeleton_title.setCompleteListener(() => {
            this.skeleton_title.setAnimation(0, 'Loop', true);
        })
        this.skeleton_title.setSkin(this.skeletonSkinArr[this.itemID])
        let startName = 'JP_' + this.skeletonSkinArr[this.itemID] + '_Start';
        let loopName = 'JP_' + this.skeletonSkinArr[this.itemID] + '_Loop';
        this.skeleton_bottom.setAnimation(0, startName, false);
        this.skeleton_bottom.setCompleteListener(() => {
            this.skeleton_bottom.setAnimation(0, loopName, true);
        })
    },

    stopAnimation: function() {
        this.icon_node.active = true;
        this.jpr_node.active = false;
    },

    initIcon: function() {
        let index = Math.floor(Math.random() * 4);
        let spriteFrame = this.spriteAtlas_icon.getSpriteFrame(this.spriteNameArr[index]);
        if (!spriteFrame) {
            return;
        };
        this.icon_node.getComponent(cc.Sprite).spriteFrame = spriteFrame;
    },
});
