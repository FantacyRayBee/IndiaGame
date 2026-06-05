cc.Class({
    extends: cc.Component,

    properties: {
        node_swTip: cc.Node,
        node_tumbleWin: cc.Node,

        lab_currentXMul: cc.Label,
        lab_currentXMark: cc.Label,
        lab_mulWinScore: cc.Label,
        lab_notMulWinScore: cc.Label,

        node_title0: cc.Node,
        node_title1: cc.Node,
        node_title2: cc.Node,
        node_title3: cc.Node,
    },

    ctor: function() {
        this.currentElfMul = 0;
        this.currentXMul = 0;
        this.currentBet = 0;

        this.curTitleIndex = 0;

        this.isHaveTitleTimer = false;
    },

    onLoad: function() {

        this.lab_currentXMark.string = "";
        this.lab_currentXMul.string = "";
        this.lab_mulWinScore.string = "";
        this.lab_notMulWinScore.string = CommonFun.getInstance().getCurrencySymbol() + `0.00`;

        this.startTitleAnima();

        this.customMsgHandle = ClientNotify.register(GlobalCfg.MSG_TYPE.clientMsg, this.onEventMsg, this);
    },

    onDestroy: function() {
        ClientNotify.removeByHandle(GlobalCfg.MSG_TYPE.clientMsg, this.customMsgHandle);
    },

    onEventMsg: function(webData, target){
        let self = target;
        let msgId = webData.msgCode;
        let notify = webData.msgData;
        if (msgId == GlobalCfg.CLIENT_MSG_ID.ZEUS_ONCE_ERASE_FINISHED) {
            self.dealOnceEraseFinishedEvent(notify);
        }
        else if (msgId == GlobalCfg.CLIENT_MSG_ID.ZEUS_SPIN_STARTING) {
            self.dealSpinStartingEvent(notify);
        }
        else if (msgId == GlobalCfg.CLIENT_MSG_ID.ZEUS_ALL_SPIN_FINISHED) {
            self.dealAllSpinFinishedEvent(notify);
        }
    },

    dealOnceEraseFinishedEvent: function(notify) {
        if (!notify) {
            return;
        };

        let erase = notify.erase;
        let currentElfMul = erase.currentElfMul;
        let currentXMul = erase.currentXMul;
        let bet = erase.bet;
        let isLastOne = erase.isLastOne;


        this.currentElfMul = currentElfMul;
        this.currentXMul = currentXMul;
        this.currentBet = bet;

        if (this.isHaveTitleTimer) {
            this.stopTitleAnima();
        };
     

        if (erase.elf == 12) {
            this.curSpinHaveXMul = true;
        };
     
        if (this.curSpinHaveXMul) {
            this.lab_currentXMark.string = "X";
            this.lab_notMulWinScore.string = "";
            this.setCurrentXMul(currentXMul);
            this.setCurrentElfMul(currentElfMul * bet/2000);
        }
        else {
            this.lab_currentXMark.string = "";
            this.lab_mulWinScore.string = "";
            this.lab_currentXMul.string = "";

            currentXMul = currentXMul > 0 ? currentXMul : 1;
            this.setCurrentElfMul2(currentXMul * currentElfMul * bet/2000);
        };      

        if (isLastOne && this.curSpinHaveXMul) {
            this.scheduleOnce(() => {
                GlobalCfg.ACT_SCENE_CTRL.zeusAudiosCtrl.playScoreMultiplyEffect();
                currentXMul = currentXMul > 0 ? currentXMul : 1;
                this.playMultiplyAnima(currentElfMul * currentXMul * bet/2000);
            }, 0.6);
        };
    },

    dealSpinStartingEvent: function(notify) {
        this.curSpinHaveXMul = false;
        this.currentElfMul = 0;
        this.currentXMul = 0;
        this.currentBet = 0;

        this.lab_currentXMark.string = "";
        this.lab_currentXMul.string = "";
        this.lab_mulWinScore.string = "";

        this.lab_mulWinScore.node.setPosition(cc.v2(1.6, -15));
        this.lab_currentXMul.node.setPosition(cc.v2(44.2, -15));

        this.lab_notMulWinScore.string = CommonFun.getInstance().getCurrencySymbol() + `0.00`;

        if (this.isHaveTitleTimer == false) {
            this.startTitleAnima();
        };
    },


    dealAllSpinFinishedEvent: function(notify) {
        
    },

    playMultiplyAnima: function(winScore) {
    
        cc.tween(this.lab_mulWinScore.node)
        .to(0.2, {position: cc.v2(1.6 + 50, -15)})
        .start()

        cc.tween(this.lab_currentXMul.node)
        .to(0.2, {position: cc.v2(44.2 - 50, -15)})
        .start()

        this.scheduleOnce(() => {
            GlobalCfg.ACT_SCENE_CTRL.zeusAudiosCtrl.playScoreMultiplyEndEffect();
            this.lab_mulWinScore.node.setPosition(cc.v2(1.6, -15));
            this.lab_currentXMul.node.setPosition(cc.v2(44.2, -15));

            this.lab_currentXMark.string = "";
            this.lab_currentXMul.string = "";
            this.lab_mulWinScore.string = "";
            this.lab_notMulWinScore.string = CommonFun.getInstance().getCurrencySymbol() + `${GlobalCfg.ACT_SCENE_CTRL.getCoinFormatStr(winScore)}`;

            cc.tween(this.lab_notMulWinScore.node)
            .to(0.1, {scale: 1.3})
            .to(0.1, {scale: 1})
            .start()
        }, 0.2);
    },

    setCurrentElfMul: function(score) {
        if (score == 0) {
            this.lab_mulWinScore.string = "";
            return;
        };

        let obj = {};
        let str = this.lab_mulWinScore.string;
        if (str.includes("$")) {
            obj.num = Number(str.slice(1));
        }
        else {
            obj.num = Number(str);
        };

        if (obj.num == score) {
            return;
        };

        cc.tween(obj)
        .to(
            0.5,
            {num: score},
            {
                progress: (start, end, current, t) => {
                    if (this && this.lab_mulWinScore) {
                        let temp = (end - start == 0) ? GlobalCfg.ACT_SCENE_CTRL.getCoinFormatStr(score) : GlobalCfg.ACT_SCENE_CTRL.getCoinFormatStr(start + (end - start) * t); 
                        this.lab_mulWinScore.string = CommonFun.getInstance().getCurrencySymbol() + `${temp}`;
                    };
                    return start + (end - start) * t;
                }
            }
        )
        .start();
    },


    setCurrentElfMul2: function(score) {
        if (score == 0) {
            this.lab_notMulWinScore.string = CommonFun.getInstance().getCurrencySymbol() + `0.00`;
            return;
        };

        let obj = {};
        let str = this.lab_notMulWinScore.string;
        if (str.includes("$")) {
            obj.num = Number(str.slice(1));
        }
        else {
            obj.num = Number(str);
        };
        
        if (obj.num == score) {
            return;
        };

        cc.tween(obj)
        .to(
            0.5,
            {num: score},
            {
                progress: (start, end, current, t) => {
                    if (this && this.lab_notMulWinScore) {
                        let temp = (end - start == 0) ? GlobalCfg.ACT_SCENE_CTRL.getCoinFormatStr(score) : GlobalCfg.ACT_SCENE_CTRL.getCoinFormatStr(start + (end - start) * t); 
                        this.lab_notMulWinScore.string = CommonFun.getInstance().getCurrencySymbol() + `${temp}`;
                    };
                    return start + (end - start) * t;
                }
            }
        )
        .start();
    },


    setCurrentXMul: function(mul) {
        if (mul == 0) {
            this.lab_currentXMul.string = "";
            return;
        };

        let oldXMul = Number(this.lab_currentXMul.string);
        if (oldXMul == mul) {
            return;
        };

        this.lab_currentXMul.string = Number(mul).toFixed(0);
        
        cc.tween(this.lab_currentXMul.node)
        .to(0.1, {scale: 1.3})
        .to(0.1, {scale: 1})
        .start()
    },

    getMultLabNode: function() {
        return this.lab_currentXMul.node;
    },

    getCurSpinHaveXMul: function() {
        return this.curSpinHaveXMul;
    },


    showFinishedAllMultFlyState: function(currentXMul) {
        this.lab_mulWinScore.node.setPosition(cc.v2(1.6, -15));
        this.lab_currentXMul.node.setPosition(cc.v2(44.2, -15));

        this.lab_notMulWinScore.string = "";
       
        this.lab_mulWinScore.string = CommonFun.getInstance().getCurrencySymbol() + `${GlobalCfg.ACT_SCENE_CTRL.getCoinFormatStr(this.currentElfMul * this.currentBet/2000)}`;
        this.lab_currentXMark.string = "X";
        this.lab_currentXMul.string = `${Number(currentXMul).toFixed(0)}`;

        cc.tween(this.lab_currentXMul.node)
        .to(0.1, {scale: 1.3})
        .to(0.1, {scale: 1})
        .start()
    },


    startTitleAnima: function() {
        this.isHaveTitleTimer = true;
        this.node_swTip.active = true;
        this.node_tumbleWin.active = false;
        this.schedule(this.titleAnima, 8);
    },

    stopTitleAnima: function() {
        this.isHaveTitleTimer = false;
        this.node_swTip.active = false;
        this.node_tumbleWin.active = true;
        this.unschedule(this.titleAnima);
    },

    titleAnima: function() {
        if (this.curTitleIndex >= 4) {
            this.curTitleIndex = 0;
        };

        this.node_title0.active = this.curTitleIndex == 0;
        this.node_title1.active = this.curTitleIndex == 1;
        this.node_title2.active = this.curTitleIndex == 2;
        this.node_title3.active = this.curTitleIndex == 3;

        this.curTitleIndex += 1;
    },
});
