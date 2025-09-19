cc.Class({
    extends: cc.Component,

    properties: {
        skleton1: sp.Skeleton,
        skleton2: sp.Skeleton,
    },

    ctor: function() {
        this.isNeedDestroy = true;
        this.skeletonData1 = null;
        this.skeletonData2 = null;
    },


    onDestroy: function() {
        if (this.skeletonData1) {
            this.skeletonData1.decRef();
            this.skeletonData1 = null;
        };
        if (this.skeletonData2) {
            this.skeletonData2.decRef();
            this.skeletonData2 = null;
        };
    },

    playGameGifSkeleton: function (skeletonName, senderNode, targetNode, parentNode) {
        if (cc.isValid(senderNode) && cc.isValid(targetNode)) {
            let checkIsValid = () => {
                if (cc.isValid(targetNode, true) == false) {
                    this.unschedule(checkIsValid);
                    this.node.destroy();
                    return;
                };
            };
            this.schedule(checkIsValid, 0.05);

            let senderNodeWorldPos = senderNode.parent.convertToWorldSpaceAR(new cc.Vec2(senderNode.x, senderNode.y));
            let targetNodeWorldPos = targetNode.parent.convertToWorldSpaceAR(new cc.Vec2(targetNode.x, targetNode.y));
            let senderNodePos = parentNode.convertToNodeSpaceAR(senderNodeWorldPos);
            let targetNodePos = parentNode.convertToNodeSpaceAR(targetNodeWorldPos);

            this.skleton1.node.setPosition(senderNodePos);

            // 设置动画朝向
            if (targetNodePos.x < senderNodePos.x) {
                this.skleton1.node.scaleX = 1;
            }
            else {
                this.skleton1.node.scaleX = -1;
            };
            if (skeletonName == "hd_shuaibiti01" || skeletonName == "hd_bingtong01") {
                this.skleton1.node.scaleX = -this.skleton1.node.scaleX;
            };

            LoggerUtil.getInstance().log(`playGameGifSkeleton ===================>`, targetNodePos.x < senderNodePos.x);

            let skeletonDataPromise = this.getSkeletonData(skeletonName);
            skeletonDataPromise.then((skeletonData) => {
                if (CommonFun.getInstance().isValidForScr(this)) {
                    this.skeletonData1 = skeletonData;
                    this.skleton1.node.active = false;
                    this.skleton1.skeletonData = skeletonData;
                    this.skleton1.premultipliedAlpha = false;
                    this.skleton1.setCompleteListener((trackEntry, loopCount) => {
                        let name = trackEntry.animation.name;
                        if (name == "animation" && this.isNeedDestroy == true) {
                            this.node.destroy()
                        };
                    });

                    /**
                     * 设置成fly的状态
                     */
                    if (skeletonName != "hd_huojian01" && skeletonName != "hd_dapao01") {
                        this.skleton1.node.active = true;
                        this.skleton1.setAnimation(0, 'fly', false);
                    };

                    let moveEndPos = null;
                    if (skeletonName == "hd_dapao01") {
                        moveEndPos = senderNodePos
                    } 
                    else {
                        moveEndPos = targetNodePos;
                    };

                    this.playAudioClip(skeletonName);

                    cc.tween(this.skleton1.node)
                    .to(0.3, {position: moveEndPos})
                    .call(() => {
                        if (skeletonName == "hd_dapao01") {
                            this.isNeedDestroy = false;
                            this.playCannonballAnim(targetNodePos);
                        };
                        this.skleton1.node.active = true;
                        this.skleton1.setAnimation(0, 'animation', false);
                    })
                    .start()
                }
                else {
                    skeletonData.decRef();
                };
            });
        }
        else {
            this.node.destroy();  
        };
    },


    getSkeletonData: function(skeletonName) {
        let url = `NewPlan/GameGifInteraction/res/skeleton/${skeletonName}`;
        return new Promise((resolve, reject) => {
            ResourcesBundle.load(url, sp.SkeletonData, (err, skeletonData) => {
                if (err) {
                    LoggerUtil.getInstance().log(err);
                    reject();
                }
                else {
                    resolve(skeletonData);
                };
            });
        });
    },


    playCannonballAnim: function(moveEndPos) {
        this.scheduleOnce(() => {
            let skeletonDataPromise = this.getSkeletonData("hd_dapao01_end");
            skeletonDataPromise.then((skeletonData) => {
                if (CommonFun.getInstance().isValidForScr(this)) {
                    this.skleton2.node.setPosition(moveEndPos);
                    this.skeletonData2 = skeletonData;
                    this.skleton2.skeletonData = skeletonData;
                    this.skleton2.premultipliedAlpha = false;
                    this.skleton2.setAnimation(0, 'animation', false);
                    this.skleton2.setCompleteListener((trackEntry, loopCount) => {
                        let name = trackEntry.animation.name;
                        if (name == "animation") {
                            this.node.destroy();
                        };
                    });
                }
                else {
                    skeletonData.decRef();
                };
            });
        }, 2);
    },

    playAudioClip: function (skeletonName) {
        let url = `NewPlan/GameGifInteraction/res/sound/${skeletonName}`;
        let time = 0;
        if (skeletonName == "hd_mtb01") {
            time = 0.5
        } 
        else if (skeletonName == "hd_shuaibiti01") {
            time = 1.5
        } 
        else if (skeletonName == "hd_huojian01") {
            time = 1
        };

        this.scheduleOnce(() => {
            ResourcesBundle.load(url, cc.AudioClip, (err, audioClip) => {
                if (!err) {
                    GlobalCfg.G_COMPONENTS.Audio.playSound(audioClip, false);
                }
            });
        }, time);
    },

});
