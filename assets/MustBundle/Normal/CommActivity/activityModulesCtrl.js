
cc.Class({
    extends: cc.Component,

    properties: {
        btnShowOrHide: {
            default: null,
            type: cc.Button,
            tooltip: "显示/隐藏模块",
            visible: true,
        },
        btnMobile: {
            default: null,
            type: cc.Button,
            tooltip: "绑定手机",
            visible: true,
        },
        btnActivity: {
            default: null,
            type: cc.Button,
            tooltip: "活动",
            visible: true,
        },
        btnBonusCard: {
            default: null,
            type: cc.Button,
            tooltip: "金钻卡",
            visible: true,
        },
        btnBrokeGift: {
            default: null,
            type: cc.Button,
            tooltip: "破产活动",
            visible: true,
        },
        btnSuperDiscount: {
            default: null,
            type: cc.Button,
            tooltip: "SuperDiscount活动",
            visible: true,
        },
        btnNewTGY: {
            default: null,
            type: cc.Button,
            tooltip: "推广员",
            visible: true,
        },
        btn_club: {
            default: null,
            type: cc.Button,
            tooltip: "俱乐部",
            visible: true,
        },
        node_btnDirection: {
            default: null,
            type: cc.Sprite,
            tooltip: "按钮图标方向",
            visible: true,
        },
        red_act: cc.Node, //活动红点
        btn_register: cc.Button,
        isShow: {
            get: function () {
                return this._isShow;
            },
            set: function (value) {
                this._isShow = value;
                // LoggerUtil.getInstance().warn("重新设置侧边栏显示状态", this._isShow);
                ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, { msgCode: GlobalCfg.CLIENT_MSG_ID.SIDEBAT_DISPLAYED, msgData: { isShow: this._isShow } });
                
            },
            tooltip: "是否显示",
            visible: true,

        },
        on_sf: cc.SpriteFrame,
        off_sf: cc.SpriteFrame,
    },

    ctor() {
        this._isShow = true;
        this.visibleSizeWidth = cc.view.getVisibleSize().width;
    },

    onLoad() {
        let w = this.visibleSizeWidth;
        this.node.setPosition(-(w / 2) + 69.5, -12);
        this.checkActivity();
    },

    start() {
        this.btnShowOrHide.node.on("click", CommonFun.getInstance().debounce(this.btnClick, 0.5), this);
        this.btnMobile.node.on("click", CommonFun.getInstance().debounce(this.btnClick, 1), this);
        this.btnActivity.node.on("click", CommonFun.getInstance().debounce(this.btnClick, 1), this);
        this.btnBonusCard.node.on("click", CommonFun.getInstance().debounce(this.btnClick, 1), this);
        this.btnBrokeGift.node.on("click", CommonFun.getInstance().debounce(this.btnClick, 1), this);
        this.btnSuperDiscount.node.on("click", CommonFun.getInstance().debounce(this.btnClick, 1), this);
        this.btnNewTGY.node.on("click", CommonFun.getInstance().debounce(this.btnClick, 1), this);
        this.btn_club.node.on("click", CommonFun.getInstance().debounce(this.btnClick, 1), this);
        this.customMsgEventHandle = ClientNotify.register(GlobalCfg.MSG_TYPE.clientMsg, this.onEventMsg, this);
        this.msgHandle = ClientNotify.register(GlobalCfg.MSG_TYPE.serverMsg, this.onEventMsg, this);

        this.btn_register.node.on("click", CommonFun.getInstance().debounce(this.btnClick, 1), this);


        // this.btn_club.node.active = (GlobalCfg.USER_DATAS.is_club || GlobalCfg.IS_CLUB_MODE == 0); //已经加入过俱乐部或者不是代理包展示俱乐部入口
        this.btn_register.node.active = !GlobalCfg.USER_DATAS.isBindAccount;
    },

    onDestroy: function () {
        ClientNotify.removeByHandle(GlobalCfg.MSG_TYPE.clientMsg, this.customMsgEventHandle);
        ClientNotify.removeByHandle(GlobalCfg.MSG_TYPE.serverMsg, this.msgHandle);
    },

    onEventMsg: function (webData, target) {
        let self = target;
        let msgId = webData.msgCode;
        let notify = webData.msgData;
        if (msgId == GlobalCfg.CLIENT_MSG_ID.CURRENCY_CHANGED_USER_INFO) {
            if (notify.reason == 102) {
                if (GlobalCfg.USER_DATAS.openModules.includes(11)) {
                    self.btnBonusCard.node.active = true;
                };
            };
            this.btn_register.node.active = !GlobalCfg.USER_DATAS.isBindAccount;
        }
        // if (msgId == "RefreshActivity_RedPoint") {
        //     this.red_act.active = GlobalCfg.USER_DATAS.turntableRemainCount > 0;
        // }
    },

    btnClick(button) {
        let name = button.node.name;
        if (name == this.btnShowOrHide.node.name) {
            this.isShow = !this.isShow;
            if(true == this.isShow){
                GlobalCfg.G_COMPONENTS.Audio.playButton();
            }else{
                GlobalCfg.G_COMPONENTS.Audio.playBack();
            }
            this.onBtnShowOrHideClick();
            return;
        }
        GlobalCfg.G_COMPONENTS.Audio.playButton();
        if (name == this.btnMobile.node.name) {
            this.dealBtnMobileEvent();
        }
        else if (name == this.btnActivity.node.name) {
            this.dealBtnActivityEvent();
        }
        else if (name == this.btnBonusCard.node.name) {
            this.showBonusCardToast();
        }
        else if (name == this.btnSuperDiscount.node.name) {
            this.dealBtnSuperDiscountferEvent();
        }
        else if (name == this.btnBrokeGift.node.name) {
            this.dealBtnBrokeGiftEvent();
        }
        else if (name == this.btnNewTGY.node.name) {
            this.showPromoterToast();
        }
        else if (name == this.btn_club.node.name) {
            CommonFun.getInstance().showClub();
        }
        else if (name == this.btn_register.node.name) {
            CommonFun.getInstance().showRegister();
        }
    },

    setShowState(bool) {
        this.isShow = bool;
        this.node.active = true;
        this.onBtnShowOrHideClick();
    },

    setHideActivity: function() {
        this.node.active = false;
    },

    /**
     * 数据更新，展示模块
     */
    checkActivity() {
        /**
         * 绑定手机，活动，BonusCard, 推广员
         * 四个类型的模块，有一个显示即显示
         */
        if ((GlobalCfg.USER_DATAS.openModules.includes(6) && GlobalCfg.USER_DATAS.phone.length == 0)
            || (GlobalCfg.USER_DATAS.openModules.includes(8) || GlobalCfg.USER_DATAS.openModules.includes(9) || GlobalCfg.USER_DATAS.openModules.includes(10) || GlobalCfg.USER_DATAS.openModules.includes(17))
            || GlobalCfg.USER_DATAS.openModules.includes(15)
            || (GlobalCfg.USER_DATAS.openModules.includes(11) && GlobalCfg.USER_DATAS.recharged > 0)
            || (GlobalCfg.USER_DATAS.openModules.includes(20) && GlobalCfg.USER_DATAS.recharged > 0 && GlobalCfg.USER_DATAS.nextDisco.show)) {
            this.node.active = true;
            this.showOtherModules();
            if (this.isShow == true) {
                ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, { msgCode: GlobalCfg.CLIENT_MSG_ID.SIDEBAT_DISPLAYED, msgData: { isShow: true } });
            }
        }
        else {
            this.node.active = false;
            ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, { msgCode: GlobalCfg.CLIENT_MSG_ID.SIDEBAT_DISPLAYED, msgData: { isShow: false } });
        };
    },

    onBtnShowOrHideClick() {
        let w = this.visibleSizeWidth;
        let pos = cc.v2(0, 0);
        this.node.getPosition(pos);
        if (this.isShow == true) {
            ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, { msgCode: GlobalCfg.CLIENT_MSG_ID.SIDEBAT_DISPLAYED, msgData: { isShow: true } });
            cc.tween(this.node)
                .to(0.2, { position: cc.v2(-(w / 2) + 69.5, -12) }, { easing: 'smooth' })
                .call(() => {
                    this.node_btnDirection.spriteFrame = this.on_sf;
                })
                .start();
        } 
        else {
            ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, { msgCode: GlobalCfg.CLIENT_MSG_ID.SIDEBAT_DISPLAYED, msgData: { isShow: false } });
            cc.tween(this.node)
                .to(0.2, { position: cc.v2(-(w / 2) - 69.5, -12) }, { easing: 'smooth' })
                .call(() => {
                    this.node_btnDirection.spriteFrame = this.off_sf;
                })
                .start();
        };
    },

    showOtherModules() {
        clearInterval(this.changeTime);
        /**
         * 绑定手机
         */
        if (GlobalCfg.USER_DATAS.openModules.includes(6) && GlobalCfg.USER_DATAS.phone.length == 0) {
            this.btnMobile.node.active = true;
        }
        else {
            this.btnMobile.node.active = false;
        };

        /**
         * 活动
         */
        if (GlobalCfg.USER_DATAS.openModules.includes(8) || GlobalCfg.USER_DATAS.openModules.includes(9)
            || GlobalCfg.USER_DATAS.openModules.includes(10) || GlobalCfg.USER_DATAS.openModules.includes(17)) {
            this.btnActivity.node.active = true;
            // this.red_act.active = GlobalCfg.USER_DATAS.turntableRemainCount > 0;
        }
        else {
            this.btnActivity.node.active = false;
        };

        /**
         * 破产礼包
        * 运营活动，SuperDiscount
        */
        let Show_Rate = parseFloat(CommonFun.getInstance().getAppConfigValueByKey('SuperDiscount_Show_Rate', 0.4));
        if (GlobalCfg.USER_DATAS.openModules.includes(20) && GlobalCfg.USER_DATAS.recharged > 0
            && (GlobalCfg.USER_DATAS.userDiamond <= 20 * 100 || GlobalCfg.USER_DATAS.userDiamond < GlobalCfg.USER_DATAS.recharged * Show_Rate)) {
            this.btnBrokeGift.node.active = true;
            this.btnSuperDiscount.node.active = false;
        }
        else {
            this.btnBrokeGift.node.active = false;
            this.btnSuperDiscount.node.active = false;
        };

        /**
         * Bonus系统
         * 金卡，银卡
         * 玩家未充值，该活动按钮不出现，玩家完成第一次充值后，该按钮出现在大厅内，且触发弹框机制。
         * 充值玩家（非免费玩家），每次从登录进入到游戏大厅时，触发弹框
         */
        if (GlobalCfg.USER_DATAS.openModules.includes(11)) {
            this.btnBonusCard.node.active = true;
            if (GlobalCfg.USER_DATAS.voucherCard != 0) {
                let endDay = 0;
                let seriesCard = GlobalCfg.USER_DATAS.seriesCard;
                for (let i = 0, len = seriesCard.length; i < len; i++) {
                    let cardInfo = seriesCard[i];
                    let id = cardInfo.id;
                    let days = cardInfo.days;
                    if (id === GlobalCfg.USER_DATAS.voucherCard) {
                        endDay = days;
                        break;
                    };
                };

                let lab_time = this.btnBonusCard.node.getChildByName("lab_time").getComponent(cc.Label);
                if (endDay == 0) {
                    lab_time.node.active = false;
                    return;
                };

                // 格式化时分秒
                let formatDuring = (mss) => {
                    if(mss < 0){
                        return ""
                    }
                    let days = Math.floor(mss / (24 * 60 * 60));
                    let hours = Math.floor((mss % (60 * 60 * 24)) / (60 * 60));
                    let minutes = Math.floor((mss % (60 * 60)) / 60);
                    let seconds = Math.floor(mss % 60);
                    return days + "Day " + hours + ": " + (minutes < 10 ? '0' + minutes : minutes) + ": " + (seconds < 10 ? '0' + seconds : seconds);
                };

                lab_time.node.active = true;
                let endTime = GlobalCfg.USER_DATAS.voucherCardCreated + (endDay * 24 * 60 * 60);      // 结束时间 
                let timeLeft = endTime - new Date().getTime() / 1000;   // 剩余时间
                lab_time.string = formatDuring(timeLeft);
                this.changeTime = setInterval(() => {
                    if (cc.isValid(lab_time) && lab_time.node.active) {
                        if (timeLeft == 0) {
                            lab_time.node.active = false;
                            clearInterval(this.changeTime);
                            this.changeTime = null;
                            return;
                        }
                        timeLeft -= 1;
                        lab_time.string = formatDuring(timeLeft);
                    }
                    else {
                        clearInterval(this.changeTime);
                        this.changeTime = null;
                        return;
                    };
                }, 1000);
            } else {
                this.btnBonusCard.node.getChildByName("lab_time").active = false;
            }
        }
        else {
            this.btnBonusCard.node.active = false;
        };

        // /**
        //  * 推广员
        //  * 玩家登录到游戏，并进行200局游戏以上时，退出到游戏大厅页面后，弹出该弹框
        //  * 弹出次数：每日弹1次，每天0点重置规则
        //  */
        // if (GlobalCfg.USER_DATAS.openModules.includes(15)) {
        //     this.btnNewTGY.node.active = true;
        // }
        // else {
        //     this.btnNewTGY.node.active = false;
        // };



    },

    dealBtnMobileEvent: function () {
        if (GlobalCfg.USER_DATAS.phone.length == 0) {
            CommonFun.getInstance().showBindPhoneRewards();
            
        }
        else {
            CommonFun.getInstance().showTips(`Already bind your Phone Number: ${GlobalCfg.USER_DATAS.phone}`);
        };
    },

    showPromoterToast: function () {
        CommonFun.getInstance().showPromoter();
    },

    dealClubEvent: function () {
        
    },

    dealBtnSuperDiscountferEvent: function () {
        this.showSecondRechargeToast();
    },

    dealBtnBrokeGiftEvent:function(){
        CommonFun.getInstance().showBankruptcy(true);
    }, 

    showSecondRechargeToast: function () {
        CommonFun.getInstance().showSuperDiscount('Lobby');
    },

    showBonusCardToast: function () {
        CommonFun.getInstance().showDailyBonusCard();
    },

    dealBtnActivityEvent: function () {
        CommonFun.getInstance().showActivity();
    },

    // update (dt) {},
});
