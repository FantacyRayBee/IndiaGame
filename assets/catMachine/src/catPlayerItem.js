cc.Class({
    extends: cc.Component,

    properties: {
        sp_head: cc.Sprite,
        skeleton_win: sp.Skeleton,
        skeleton_zhuan: sp.Skeleton,
        lab_name: cc.Label,
        lab_score: cc.Label,
        node_win: cc.Node, 
        lab_win: cc.Label, 
    },

    ctor: function () {
        this.userId = 0; //用户id
    },

    setInfo: function (info) {
        this.Init();
        this.userId = info.userId;
        this.node.active = true;
        this.lab_name.string = CommonFun.getInstance().getStrByLength(info.nickName, 8);
        this.lab_score.string = CommonFun.getInstance().numberToShow(info.score / 100);
        this.loadHeadSp(info.headUrl, 90, this.sp_head);
    },

    Init: function () {
        this.winTimer && clearTimeout(this.winTimer);
        this.winTimer = null;
        this.skeletonTimer && clearTimeout(this.skeletonTimer);
        this.skeletonTimer = null;
    },

    hide: function () {
        this.node.active = false;
        this.Init();
    },

    setWin : function (type, winScore, finalScore) {
        this.playWin(type);
        this.node_win.active = true;
        this.lab_win.string = CommonFun.getInstance().numberToShow(winScore / 100);
        this.winTimer = setTimeout(() => {
            if (!this.node || !this.node.isValid) return; // 节点已销毁则不执行
            this.node_win.active = false;
            this.winTimer = null;
        }, 2000);
        this.setScore(finalScore);
    },

    setScore: function (score) {
        this.lab_score.string = CommonFun.getInstance().numberToShow(score / 100);
    },
    //播放元素出现动画
    playWin: function (type) {
        let animName = "";
        switch (type) {
            case 1:
                animName = "animation_mini";
                break;
            case 2:
                animName = "animation_minor2";
                break;
            case 3:
                animName = "animation_epic";
                break;
            case 4:
                animName = "animation_major";
                break;
            default:
                return;
        }
        if (this.skeleton_win) {
            this.skeleton_win.node.active = true;
            this.skeleton_win.setAnimation(0, animName, false);
        }
        if (this.skeleton_zhuan) {
            this.skeleton_zhuan.node.active = true;
            this.skeleton_zhuan.setAnimation(0, "animation", true);
        }

        this.skeletonTimer = setTimeout(() => {
            if (!this.node || !this.node.isValid) return;
            this.skeleton_win.node.active = false;
            this.skeleton_zhuan.node.active = false;
            this.skeletonTimer = null;
        }, 2000);
    },

    loadHeadSp: function (headUrl, realWidth, heaSprite) {
        if (headUrl && headUrl.length > 0) {
            cc.assetManager.loadRemote(headUrl, { ext: '.png' }, (err, texture) => {
                if (!err && cc.isValid(this) && cc.isValid(heaSprite)) {
                    heaSprite.spriteFrame = new cc.SpriteFrame(texture);
                    heaSprite.node.setScale(realWidth / heaSprite.node.width);
                }
            });
        }
    }
});
