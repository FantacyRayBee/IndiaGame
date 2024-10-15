cc.Class({
    extends: cc.Component,

    properties: {
        skeleton_animIcon: sp.Skeleton,
        skeleton_outLine: sp.Skeleton,
        skeleton_boom: sp.Skeleton,
        lab_mul: cc.Label,

        skeletonData_1: sp.SkeletonData,
        skeletonData_3: sp.SkeletonData,
        skeletonData_4: sp.SkeletonData,
        skeletonData_5: sp.SkeletonData,
        skeletonData_6: sp.SkeletonData,
        skeletonData_7: sp.SkeletonData,
        skeletonData_8: sp.SkeletonData,
        skeletonData_9: sp.SkeletonData,
        skeletonData_10: sp.SkeletonData,
        skeletonData_11: sp.SkeletonData,
        skeletonData_12: sp.SkeletonData,
    },

    ctor: function() {
        this.cellData = null;
    },

    onLoad: function() {
        this.skeleton_animIcon.node.active = false;
        this.skeleton_outLine.node.active = false;
        this.skeleton_boom.node.active = false;
        this.lab_mul.string = "";
    },

    reSetting: function() {
        this.cellData = null;
        this.skeleton_animIcon.node.active = false;
        this.skeleton_outLine.node.active = false;
        this.skeleton_boom.node.active = false;
        this.lab_mul.string = "";
    },

    setItemData: function(cellData) {
        if (!cellData) {
            return;
        };

        this.cellData = cellData;

        let elf = cellData.elf;             // 元素内容
        let x = cellData.x;                 // 附加属性:X倍数
        let read = cellData.read;           // 已读

        if (elf == 0 || elf == 2) {
            LoggerUtil.getInstance().warn(`setItemData: Elf ${elf} exceeds the scope of use`);
            return;
        };

        let animationName = 'Standby';
        if (elf == 12) {
            if (x <= 8) {
                animationName = 'VStandby';
            }
            else if (x <= 20) {
                animationName = 'LStandby';
            }
            else if (x <= 100) {
                animationName = 'HStandby';
            }
            else {
                animationName = 'ZiStandby';
            }
        };

        this.skeleton_animIcon.node.active = true;
        this.skeleton_animIcon.skeletonData = this[`skeletonData_${elf}`];
        this.skeleton_animIcon.defaultSkin = 'default';
        this.skeleton_animIcon.setAnimation(0, animationName, true);


        if (elf == 12 && x > 1) {
            this.lab_mul.string = `${x}X`; 
        }
        else {
            this.lab_mul.string = "";
        };
    },


    playScatterShowAnim: function() {
        this.skeleton_animIcon.setAnimation(0, 'Show', false);
    },

    playAccumulatePowerAnims: function() {
        if (this.cellData.elf != 1) {
            this.playSkeletonOutLineAnim();
        };

        let animArr = [this.playSkeletonIconTriggerAnim(this.cellData.elf, this.cellData.x)];
        return new Promise((resolve, reject) => {
            Promise.all(animArr)
            .then(() => {
                this.skeleton_outLine.node.active = false;
                this.skeleton_animIcon.node.active = false;
                resolve();
            });
        });
    },

    playBoomAnim: function() {
        return new Promise((resolve, reject) => {
            this.skeleton_boom.node.active = true;
            this.skeleton_boom.setCompleteListener((trackEntry, loopCount) => {
                resolve();
            });
            this.skeleton_boom.timeScale = 0.67;
            this.skeleton_boom.defaultSkin = 'default';
            this.skeleton_boom.setAnimation(0, 'animation', false);
        });
    },

    playMulAnims: function() {
        return new Promise((resolve, reject) => {
            if (this.cellData.elf != 12) {
                resolve();
                return;
            };
            let animArr = [this.playSkeletonIconTriggerAnim(this.cellData.elf, this.cellData.x)];
            Promise.all(animArr)
            .then(() => {
                resolve();
            });
        });
    },

    playSkeletonOutLineAnim: function() {
        this.skeleton_outLine.node.active = true;
        this.skeleton_outLine.timeScale = 1.6;
        this.skeleton_outLine.defaultSkin = 'default';
        this.skeleton_outLine.setAnimation(0, 'animation', true);
    },

    playSkeletonIconTriggerAnim: function(elf, x) {
        return new Promise((resolve, reject) => {
            if (elf == 0) {
                resolve();
                return;
            };
            let animationName = 'Pay';
            if (elf == 1) {
                animationName = 'Trigger';
            }
            else if (elf == 12) {
                if (x <= 8) {
                    animationName = 'V';
                }
                else if (x <= 20) {
                    animationName = 'Lan';
                }
                else if (x <= 100) {
                    animationName = 'Hong';
                }
                else {
                    animationName = 'Zi';
                }
            };
            this.skeleton_animIcon.node.active = true;
            this.skeleton_animIcon.setCompleteListener((trackEntry, loopCount) => {
                resolve();
            });
            this.skeleton_animIcon.timeScale = 1.3;
            this.skeleton_animIcon.skeletonData = this[`skeletonData_${elf}`];
            this.skeleton_animIcon.defaultSkin = 'default';
            this.skeleton_animIcon.setAnimation(0, animationName, false);
        });
    },

    getLabMultiNode: function() {
        return this.lab_mul.node;
    },
});
