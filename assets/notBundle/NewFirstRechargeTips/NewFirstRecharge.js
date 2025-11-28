const LabelAnimationType = cc.Enum({
    Add: 0,
    Reduce: 1,
});
cc.Class({
    extends: cc.Component,

    properties: {
        oldAmount: {
            type: cc.Label,
            default: null,
            tooltip: "原始金币"
        },
        newAmount: {
            type: cc.Label,
            default: null,
            tooltip: "新金币"
        },
        labelDesr: {
            type: cc.Label,
            default: null,
            tooltip: "描述"
        },
        btnNext: {
            type: cc.Button,
            default: null,
        },
        btnGet: {
            type: cc.Button,
            default: null,
        },
        spine: {
            type: sp.Skeleton,
            default: null,
            tooltip: " spine动画"
        },
        spineSkeData: {
            type: sp.SkeletonData,
            default: [],
            tooltip: " spine动画数据"
        },
        stepNodeList: {
            type: cc.Node,
            default: [],
            tooltip: "步骤节点"
        },
        audioClips: {
            type: cc.AudioClip,
            default: [],
            tooltip: "音频"
        },
    },

    ctor() {
        this.labelStrs = [
            'Congratulations, you have completed your first recharge and become a VIP player!',
            'The system will clear the experience coins earned before the recharge, and all subsequent deposits made within the game will not be cleared again.',
            'Honored VIP player, good luck to you!'
        ];
        this.btnNextLabels = [
            'Next',
            'Next',
            'Enter the new casino'
        ];
        this.curBtnLabelIndex = 0;
        this.posArr = [cc.v2(-400, 0), cc.v2(-100, 0), cc.v2(350, 0)];
        this.couldClickStep1 = false;       // 步骤1点击是否可以响应
        this.audioIDs = [];                 // 音效ID
        this.couldClickStep2 = false;
    },

    onLoad() {
        this.btnNext.node.on('click', this.onBtnClick, this);
        this.btnGet.node.active = false;
        this.btnGet.node.on('click', this.onBtnClick, this);
        this.btnLabel = this.btnNext.node.getChildByName('Background').getChildByName('Label').getComponent(cc.Label);
        this.newNode = this.stepNodeList[1].getChildByName('New Node');
        this.newNode.setPosition(this.posArr[0]);
        this.stepNodeList[0].on(cc.Node.EventType.TOUCH_END, this.onTouch, this);
        this.stepNodeList[1].on(cc.Node.EventType.TOUCH_END, this.onTouch, this);

        this.customMsgEventHandle = ClientNotify.register(GlobalCfg.MSG_TYPE.clientMsg, this.onEventMsg, this);
    },

    onDestroy() {
        for (let i = 0; i < this.audioIDs.length; i++) {
            GlobalCfg.G_COMPONENTS.Audio.stopEffect(this.audioIDs[i]);
        }
        ClientNotify.removeByHandle(GlobalCfg.MSG_TYPE.clientMsg, this.customMsgEventHandle);
    },

    start() {
        GlobalCfg.FIRST_RECHARGE_TIPS_SHOW = false;
        GlobalCfg.FIRST_RECHARGE_TIPS_SHOW_10 = false;
        this.showStep_1();
    },

    update(dt) {

    },

    onTouch(event) {
        this.playEffect(this.audioClips[0]);
        let name = event.target.name;
        if (name == "1") {
            if (this.couldClickStep1 == true) {
                this.showStep_2();
                this.unschedule(this.scheduleTimetoStep2);
            }
        }
        else if (name == "2") {
            if (this.couldClickStep2 == false) {
                return;
            }
            if (this.curBtnLabelIndex < 2) {
                this.curBtnLabelIndex++;
                this.newNode.setPosition(this.posArr[this.curBtnLabelIndex])
                this.btnLabel.string = this.btnNextLabels[this.curBtnLabelIndex];
                this.updateLabDesr(this.labelStrs[this.curBtnLabelIndex]);
                if (this.curBtnLabelIndex == 2) {
                    this.newNode.getChildByName('qpbg').setPosition(-500, 194);
                    this.newNode.getChildByName('qpbg').setScale(1, 1);
                    this.labelDesr.node.setScale(1, 1);
                    this.btnNext.node.setPosition(-500, 0);
                }
            } else {
                for (let i = 0; i < this.stepNodeList.length; i++) {
                    this.stepNodeList[i].active = false;
                }
                this.showSpineAnimation();
            }
        }
    },

    onBtnClick(Button) {
        let name = Button.node.name;
        this.playEffect(this.audioClips[0]);
        if (name == this.btnNext.node.name) {
            if (this.couldClickStep2 == false) {
                return;
            }
            if (this.curBtnLabelIndex < 2) {
                this.curBtnLabelIndex++;
                this.newNode.setPosition(this.posArr[this.curBtnLabelIndex])
                this.btnLabel.string = this.btnNextLabels[this.curBtnLabelIndex];
                this.updateLabDesr(this.labelStrs[this.curBtnLabelIndex]);
                if (this.curBtnLabelIndex == 2) {
                    this.newNode.getChildByName('qpbg').setPosition(-500, 194);
                    this.newNode.getChildByName('qpbg').setScale(1, 1);
                    this.labelDesr.node.setScale(1, 1);
                    this.btnNext.node.setPosition(-500, 0);
                }
            } else {
                for (let i = 0; i < this.stepNodeList.length; i++) {
                    this.stepNodeList[i].active = false;
                }
                this.showSpineAnimation();
            }
        }
        else if (name == this.btnGet.node.name) {
            this.node.destroy();
        }
    },

    updateLabDesr(str, time = 0.7) {
        this.couldClickStep2 = false;
        let gameFrameRate = cc.game.getFrameRate();
        let len = str.length;
        let frameAddStr = Number(Number(len / (gameFrameRate * time)).toFixed(2));
        let displayed = 0, count = 0;
        this.schedule(() => {
            count++;
            if (count == time * gameFrameRate) {
                this.labelDesr.string = str;
                this.couldClickStep2 = true;
            }else{
                displayed += frameAddStr;
                this.labelDesr.string = str.substr(0, Math.floor(displayed));
            }
        }, 1 / gameFrameRate, time * gameFrameRate - 1);
    },

    onEventMsg(msgData, target) {
        let self = target;
        let msgId = msgData.msgCode;
        let notify = msgData.msgData;
        if (msgId == "FirstRechargeReduceLabelFinsh") {
            self.couldClickStep1 = true;
            self.setTimeToStep2(10);
        }
        else if (msgId == "FirstRechargeAddLabelFinsh") {
            self.btnGet.node.active = true;
        }
    },

    /**
     * 设置经过指定时间自动跳转第二步
     * @param {number} time 时间 s 
     */
    setTimeToStep2(time) {
        this.scheduleTimetoStep2 = () => {
            this.showStep_2();
        }
        this.scheduleOnce(this.scheduleTimetoStep2, time);
    },

    showStep_1() {
        this.scheduleOnce(() => {
            this.changeStepNode(0);
            GlobalCfg.G_COMPONENTS.Audio.pauseMusic();
            let oldNum = GlobalCfg.USER_DATAS.oldUserDiamond ? GlobalCfg.USER_DATAS.oldUserDiamond / 100 : 200;
            this.setLabelToNewNumber(oldNum, 0, LabelAnimationType.Reduce, 1);
        }, 0);
    },

    showStep_2() {
        this.couldClickStep2 = true;
        this.curBtnLabelIndex = 0;
        this.btnLabel.string = this.btnNextLabels[this.curBtnLabelIndex];
        this.updateLabDesr(this.labelStrs[this.curBtnLabelIndex])
        this.changeStepNode(1);
    },

    showStep_3() {
        this.changeStepNode(2);
        this.node.getChildByName("bg").active = false;
        this.node.getChildByName('bg_zhuozi').active = false;
        this.spine.node.active = false;
        this.scheduleOnce(() => {
            GlobalCfg.G_COMPONENTS.Audio.resumeMusic();
            let newNum = Number(GlobalCfg.USER_DATAS.userDiamond / 100);
            this.setLabelToNewNumber(0, newNum, LabelAnimationType.Add, 3);
            this.playEffect(this.audioClips[2]);
        }, 0.5);
    },

    /**
     * 
     * @param {*} oldNum 
     * @param {*} newNum 
     * @param {LabelAnimationType} type 
     * @param {number} duringTime
     */
    setLabelToNewNumber(oldNum, newNum, type, duringTime) {
        oldNum = oldNum || 0;
        newNum = newNum || 0;
        duringTime = duringTime || 1;
        if (type == LabelAnimationType.Add) {
            this.newAmount.getComponent('ChangeLabelToSetNum').setLabelShowAnimation(true, oldNum, newNum, type, duringTime);
        } else if (type == LabelAnimationType.Reduce) {
            this.oldAmount.getComponent('ChangeLabelToSetNum').setLabelShowAnimation(true, oldNum, newNum, type, duringTime);
        }
    },

    changeStepNode(step) {
        for (let i = 0; i < this.stepNodeList.length; i++) {
            this.stepNodeList[i].active = false;
        }
        this.stepNodeList[step].active = true;
    },

    showSpineAnimation() {
        this.spine.skeletonData = this.spineSkeData[0];
        this.spine.node.active = true;
        this.spine.setAnimation(0, 'animation', false);
        this.playEffect(this.audioClips[1]);
        this.spine.setCompleteListener(function (trackEntry, loopCount) {
            this.showStep_3();
        }.bind(this));
    },

    playEffect(clip) {
        var audioID = GlobalCfg.G_COMPONENTS.Audio.playSound(clip, false);
        this.audioIDs.push(audioID);
    },
});
