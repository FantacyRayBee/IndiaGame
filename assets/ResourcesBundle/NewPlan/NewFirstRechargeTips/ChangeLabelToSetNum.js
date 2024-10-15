cc.Class({
    extends: cc.Component,

    properties: {

    },

    onLoad() {
        this.label = this.node.getComponent(cc.Label);
        this.sound = this.node.getComponent(cc.AudioSource);
    },

    ctor() {
        this.reduceOldAmount = false;   // 减少原始金币
        this.addOldAmount = false;   // 增加原始金币
        this.oldNum = 0;
        this.newNum = 0;
        this.rateSection = 0;           // 帧减少金币
    },

    start() {
    },

    /**
     * 
     * @param {boolean} isShow 是否开始
     * @param {number} oldNum 
     * @param {number} newNum 
     * @param {LabelAnimationType} type 
     */
    setLabelShowAnimation(isShow, oldNum, newNum, type, duringTime = 1) {
        this.label.string = this.oldNum;
        this.oldNum = oldNum;
        this.newNum = newNum;
        let gameFrameRate = cc.game.getFrameRate();
        this.rateSection = Number(Number(Math.abs(oldNum - newNum) / (gameFrameRate * duringTime)).toFixed(2));
        if (type == 1) {
            this.reduceOldAmount = isShow;
        } else {
            this.addOldAmount = isShow;
        }
        let yinXiaoState = cc.sys.localStorage.getItem("toggle_yinxiao")
        if(yinXiaoState == null || yinXiaoState == "0"){
            this.sound.play();
        }
    },



    update(dt) {
        if (this.reduceOldAmount == true) {
            let newNum = Number(this.oldNum - this.rateSection);
            if (newNum <= this.newNum) {
                this.label.string = this.newNum.toFixed(2);
                this.reduceOldAmount = false;
                this.sound.stop();
                this.sendClineMsg("FirstRechargeReduceLabelFinsh");
            } else {
                this.oldNum = newNum;
                this.label.string = Number(newNum).toFixed(2);
            }
        }
        if (this.addOldAmount == true) {
            let newNum = Number(this.oldNum + this.rateSection);
            if (newNum >= this.newNum) {
                this.label.string = this.newNum.toFixed(2);
                this.addOldAmount = false;
                this.sound.stop();
                this.sendClineMsg("FirstRechargeAddLabelFinsh");
            } else {
                this.oldNum = newNum;
                this.label.string = Number(newNum).toFixed(2);
            }
        }
    },

    sendClineMsg(code){
        ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, {
            msgCode: code,
            msgData: {}
        }); 
    }
});
