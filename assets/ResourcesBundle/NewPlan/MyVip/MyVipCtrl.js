cc.Class({
    extends: cc.Component,

    properties: {
        btn_close: cc.Button,
        btn_vipService: cc.Button,
        btn_vipRight: cc.Button,
        btn_vipLeft: cc.Button,

        btn_luckyDraw: cc.Button,
        btn_forOnce: cc.Button,

        btn_addCash: cc.Button,
        btn_toBet: cc.Button,
        btn_rules: cc.Button,

        btn_benefitsTips: cc.Button,

        btn_icon: cc.Button,

        progressBar_nextLevel: cc.ProgressBar,

        lab_vipLevel: cc.Label,
        lab_nextLevelTips: cc.Label,
        lab_nextLevelProgress: cc.Label,

        lab_upgradeBagAmount: cc.Label,
        lab_upgradeBagGift: cc.Label,
        lab_upgradeBagBtnAmount: cc.Label,

        node_benifits: cc.Node,

        spine_upgrade: sp.Skeleton,

        sprite_icon: cc.Sprite,
        atlas_icon: cc.SpriteAtlas,

        prefab_benifitsItem: cc.Prefab
    },

    ctor: function() {
        this.selectVipLevel = 0;

        this.vipDataList = [];

        this.customMsgEventHandle = null;

        this.expiresTimer = null;
    },

    onLoad: function() {
        this.btn_close.node.on("click", CommonFun.getInstance().debounce(this.btnClick, 1), this);
        this.btn_vipService.node.on("click", CommonFun.getInstance().debounce(this.btnClick, 1), this);
        this.btn_vipRight.node.on("click", CommonFun.getInstance().debounce(this.btnClick, 0), this);
        this.btn_vipLeft.node.on("click", CommonFun.getInstance().debounce(this.btnClick, 0), this);

        this.btn_luckyDraw.node.on("click", CommonFun.getInstance().debounce(this.btnClick, 1), this);
        this.btn_forOnce.node.on("click", CommonFun.getInstance().debounce(this.btnClick, 1), this);
        this.btn_benefitsTips.node.on("click", CommonFun.getInstance().debounce(this.btnClick, 1), this);

        this.btn_addCash.node.on("click", CommonFun.getInstance().debounce(this.btnClick, 1), this);
        this.btn_toBet.node.on("click", CommonFun.getInstance().debounce(this.btnClick, 1), this);
        this.btn_rules.node.on("click", CommonFun.getInstance().debounce(this.btnClick, 1), this);

        this.spine_upgrade.setSkin("default");
        this.spine_upgrade.animation = null;


        this.customMsgEventHandle = ClientNotify.register(GlobalCfg.MSG_TYPE.clientMsg, this.onEventMsg, this);
    },

    onDestroy: function() {
        if (this.expiresTimer) {
            clearInterval(this.expiresTimer);
            this.expiresTimer = null;
        };
        ClientNotify.removeByHandle(GlobalCfg.MSG_TYPE.clientMsg, this.customMsgEventHandle);

        CommonFun.getInstance().releasePrefab(GlobalCfg.PREFAB_PATH.MYVIP);
    },

    start: function() {
        this.setVipInfo();
        this.setUpgradeVipAnim();
    },

    setVipInfo: function() {    
        this.lab_vipLevel.string = `VIP ${GlobalCfg.USER_DATAS.userVip.level}`;
        this.selectVipLevel = GlobalCfg.USER_DATAS.userVip.level;

        for (let i = 0, len = GlobalCfg.USER_DATAS.vipLevels.length; i < len; i++) {
            const element = GlobalCfg.USER_DATAS.vipLevels[i];
            if (element.level >= GlobalCfg.USER_DATAS.userVip.level) {
                this.vipDataList.push(element);
            };
        };
        this.vipDataList.sort((a, b) => {
            return a.level - b.level;
        });

        this.showBenifitsByLevel(this.selectVipLevel, false);

        this.lab_upgradeBagAmount.string = CommonFun.getInstance().formatCurrencyAmount(GlobalCfg.USER_DATAS.userVip.upgrade_bag_amount / 100);
        this.lab_upgradeBagGift.string = CommonFun.getInstance().formatCurrencyAmount((GlobalCfg.USER_DATAS.userVip.upgrade_bag_dgift + GlobalCfg.USER_DATAS.userVip.upgrade_bag_amount) / 100);
        this.lab_upgradeBagBtnAmount.string = `Pay ${CommonFun.getInstance().formatCurrencyAmount(GlobalCfg.USER_DATAS.userVip.upgrade_bag_amount / 100)}`
    },

    setUpgradeVipAnim: function() {
        let localStorage = cc.sys.localStorage.getItem(`${GlobalCfg.USER_DATAS.userId}_VipUpgrade_LocalStorage`);
        if (!localStorage) {
            this.sprite_icon.spriteFrame = this.atlas_icon.getSpriteFrame('1');
            this.spine_upgrade.setCompleteListener(() => {
                if (CommonFun.getInstance().isValidForScr(this)) {
                    this.spine_upgrade.setSkin("default");
                    this.spine_upgrade.animation = null;
                    this.sprite_icon.spriteFrame = this.atlas_icon.getSpriteFrame(`${GlobalCfg.USER_DATAS.userVip.level}`);
                };
            });
            GlobalCfg.G_COMPONENTS.Audio.playSoundByNameInResources("vipSound/vipUpgrade", false);
            this.spine_upgrade.setAnimation(0, "animation", false);
            cc.sys.localStorage.setItem(`${GlobalCfg.USER_DATAS.userId}_VipUpgrade_LocalStorage`, `${GlobalCfg.USER_DATAS.userVip.level}`);
        }
        else {
            let level = Number(localStorage);
            if (GlobalCfg.USER_DATAS.userVip.level > level) {
                this.sprite_icon.spriteFrame = this.atlas_icon.getSpriteFrame(`${level}`);
                this.spine_upgrade.setCompleteListener(() => {
                    if (CommonFun.getInstance().isValidForScr(this)) {
                        this.spine_upgrade.setSkin("default");
                        this.spine_upgrade.animation = null;
                        this.sprite_icon.spriteFrame = this.atlas_icon.getSpriteFrame(`${GlobalCfg.USER_DATAS.userVip.level}`);
                    };
                });
                GlobalCfg.G_COMPONENTS.Audio.playSoundByNameInResources("vipSound/vipUpgrade", false);
                this.spine_upgrade.setAnimation(0, "animation", false);
                cc.sys.localStorage.setItem(`${GlobalCfg.USER_DATAS.userId}_VipUpgrade_LocalStorage`, `${GlobalCfg.USER_DATAS.userVip.level}`);
            }
            else {
                this.sprite_icon.spriteFrame = this.atlas_icon.getSpriteFrame(`${GlobalCfg.USER_DATAS.userVip.level}`);
            }
        };
    },

    onEventMsg: function(webData, target) {
        let self = target;
        let msgId = webData.msgCode;
        let notify = webData.msgData;
        if (GlobalCfg.CLIENT_MSG_ID.VIP_TAKE_WELFARE === msgId) {
            self.dealVipTakeWelfare(notify);
        }
        else if (GlobalCfg.CLIENT_MSG_ID.VIP_INFO_UPDATE === msgId) {
            self.setVipInfo();
            self.setUpgradeVipAnim();
        }
        else if (GlobalCfg.CLIENT_MSG_ID.CHANGE_LANGUAGE === msgId) {
            self.showBenifitsByLevel(self.selectVipLevel, true);
        };
    },

    getNextLevelTipsStr: function(rechargeAmount, vipLevel) {
        let languagesType = I18NUtil.getInstance().getLanguageType();
        switch (languagesType) {
            case I18NLanguagesEnum.English:
                return `Recharge ${rechargeAmount} to become VIP${vipLevel}`;
            case I18NLanguagesEnum.Hindi:
                return `VIP${vipLevel} बनने के लिए ${rechargeAmount} रिचार्ज करें`;
            case I18NLanguagesEnum.Urdu:
                return `VIP${vipLevel} بننے کے لیے ${rechargeAmount} ری چارج کریں`;
            case I18NLanguagesEnum.Bengali:
                return `VIP${vipLevel} হতে ${rechargeAmount} রিচার্জ করুন`;
            default:
                return `Recharge ${rechargeAmount} to become VIP${vipLevel}`;
        }
    },

    getUnlockMoreLevelTipsStr: function() {
        let languagesType = I18NUtil.getInstance().getLanguageType();
        switch (languagesType) {
            case I18NLanguagesEnum.English:
                return "Unlock more level";
            case I18NLanguagesEnum.Hindi:
                return "अधिक स्तर अनलॉक करें";
            case I18NLanguagesEnum.Urdu:
                return "مزید لیول ان لاک کریں";
            case I18NLanguagesEnum.Bengali:
                return "আরও লেভেল আনলক করুন";
            default:
                return "Unlock more level";
        }
    },

    btnClick: function(btn) {
        let btnName = btn.node.name;
        switch (btnName) {
            case "btn_close":
                GlobalCfg.G_COMPONENTS.Audio.playBack();
                this.dealBtnCloseEvent();
                return;
            case "btn_vipService":
                this.dealBtnVipServiceEvent();
                break;
            case "btn_vipRight":
                this.dealBtnVipRightEvent();
                break;
            case "btn_vipLeft":
                this.dealBtnVipLeftEvent();
                break;
            case "btn_luckyDraw":
                this.dealBtnLuckyDrawEvent();
                break;
            case "btn_forOnce":
                this.dealBtnForOnceEvent();
                break;
            case "btn_addCash":
                this.dealBtnAddCashEvent();
                break;
            case "btn_toBet":
                this.dealBtnToBetEvent();
                break;
            case "btn_rules":
                this.dealBtnRulesEvent();
                break;
            case "btn_benefitsTips":
                this.dealBtnBenefitsEvent();
                break;
            default:
                break;
        }
        GlobalCfg.G_COMPONENTS.Audio.playButton();
    },

    dealBtnCloseEvent: function() {
        this.node.destroy();
    },

    dealBtnVipServiceEvent: function() {
        let channel_info = {...GlobalCfg.USER_DATAS.customerService};
        let whatsAppInfos = channel_info.whatsApp.split(',');
        let mobileNum = whatsAppInfos[0].match(/\d+/g);
        APPManager.skipToOtherApp("com.whatsapp", "https://api.whatsapp.com/send?phone=" + mobileNum);
    },
    
    dealBtnVipRightEvent: function() {
        this.showBenifitsByLevel(this.selectVipLevel + 1, true);
    },

    dealBtnVipLeftEvent: function() {
        this.showBenifitsByLevel(this.selectVipLevel - 1, true); 
    },

    dealBtnLuckyDrawEvent: function() {
        CommonFun.getInstance().showVipLuckyDraw();
    },

    dealBtnForOnceEvent: function() {
        CommonFun.getInstance().showVipForOnceToast();
    },

    dealBtnAddCashEvent: function() {
        if (!GlobalCfg.USER_DATAS.openModules.includes(4)) {
            CommonFun.getInstance().showMsgBox("Not yet open", "YES_ON", () => { }, false);
            return
        };
        CommonFun.getInstance().showNewShop(true, GlobalCfg.SHOP_RECHARGE_FROM.MyVipAddCash);
    },

    dealBtnToBetEvent: function() {
        this.node.destroy();
    },
    
    dealBtnRulesEvent: function() {
        CommonFun.getInstance().showVipRules("vipRules");
    },

    dealBtnBenefitsEvent: function() {
        CommonFun.getInstance().showVipRules("benefits");
    },

    showBenifitsByLevel: function(level, isShowLevelIcon) {  
        this.node_benifits.destroyAllChildren();

        let lastBenifits = null;
        let curBenifits = null; 
        let nextBenifits = null; 
        for (let i = 0, len = this.vipDataList.length; i < len; i++) {
            let element = this.vipDataList[i];
            if (element.level === (level - 1)) {
                lastBenifits = element;
            };
            if (element.level === level) {
                curBenifits = element;
            };
            if (element.level === (level + 1)) {
                nextBenifits = element;
            };
        };

        if (!curBenifits) {
            return;
        };

        this.selectVipLevel = curBenifits.level;

        let timestamp = GlobalCfg.USER_DATAS.userVip.system_time;
        if (GlobalCfg.USER_DATAS.userVip.level == curBenifits.level && timestamp < GlobalCfg.USER_DATAS.userVip.expires_time) {
            this.btn_icon.interactable = true;
            this.btn_icon.enableAutoGrayEffect = false;

            if (this.expiresTimer) {
                clearInterval(this.expiresTimer);
                this.expiresTimer = null;
            };
            this.expiresTimer = setInterval(() => {
                timestamp += 1;
                if (timestamp >= GlobalCfg.USER_DATAS.userVip.expires_time) {
                    if (CommonFun.getInstance().isValidForScr(this)) {
                        this.btn_icon.interactable = false;
                        this.btn_icon.enableAutoGrayEffect = true;
    
                        clearInterval(this.expiresTimer);
                        this.expiresTimer = null;

                        CommonFun.getInstance().showTips("Your VIP has expired, you can activate it after recharging!");
                    };
                    return;
                };
            }, 1000);
        }
        else {
            this.btn_icon.interactable = false;
            this.btn_icon.enableAutoGrayEffect = true;

            if (this.expiresTimer) {
                clearInterval(this.expiresTimer);
                this.expiresTimer = null;
            };
        };

        /**
         *  日领取
         */
        if (curBenifits.dayTake > 0) {
            let node = cc.instantiate(this.prefab_benifitsItem);
            let scr = node.getComponent("BenefitsItemCtrl");
            scr.setBenifitsItemData(5, curBenifits);
            this.node_benifits.addChild(node);
        };
        /**
         *  周领取
         */
        if (curBenifits.weekTake > 0) {
            let node = cc.instantiate(this.prefab_benifitsItem);
            let scr = node.getComponent("BenefitsItemCtrl");
            scr.setBenifitsItemData(4, curBenifits);
            this.node_benifits.addChild(node);
        };
        /**
         *  月领取
         */
        if (curBenifits.monthTake > 0) {
            let node = cc.instantiate(this.prefab_benifitsItem);
            let scr = node.getComponent("BenefitsItemCtrl");
            scr.setBenifitsItemData(3, curBenifits);
            this.node_benifits.addChild(node);
        };
        /**
         *  提现总额
         */
        if (curBenifits.withdrawTotalLimit > 0) {
            let node = cc.instantiate(this.prefab_benifitsItem);
            let scr = node.getComponent("BenefitsItemCtrl");
            scr.setBenifitsItemData(2, curBenifits);
            this.node_benifits.addChild(node);
        };
        /**
         * 提现次数
         */
        if (curBenifits.dayWithdrawCountLimit > 0) {
            let node = cc.instantiate(this.prefab_benifitsItem);
            let scr = node.getComponent("BenefitsItemCtrl");
            scr.setBenifitsItemData(1, curBenifits);
            this.node_benifits.addChild(node);
        };
        /** 
         * 扭蛋机次数
         */
        if (curBenifits.gachaCount > 0) {
            let node = cc.instantiate(this.prefab_benifitsItem);
            let scr = node.getComponent("BenefitsItemCtrl");
            scr.setBenifitsItemData(11, curBenifits);
            this.node_benifits.addChild(node);
        };
        /**
         *  快速升级礼包
         */
        if (curBenifits.upgradeBagId > 0) {
            let node = cc.instantiate(this.prefab_benifitsItem);
            let scr = node.getComponent("BenefitsItemCtrl");
            scr.setBenifitsItemData(10, curBenifits);
            this.node_benifits.addChild(node);
        };
        /**
         * 专属客服
         */
        if (curBenifits.exService) {
            let node = cc.instantiate(this.prefab_benifitsItem);
            let scr = node.getComponent("BenefitsItemCtrl");
            scr.setBenifitsItemData(7, curBenifits);
            this.node_benifits.addChild(node);
            this.btn_vipService.node.active = (Object.values(GlobalCfg.USER_DATAS.customerService).length > 0 && Object.values(GlobalCfg.USER_DATAS.customerService).join("").length > 0) ? true : false;
        }
        else {
            this.btn_vipService.node.active = false;
        };
        /**
         * 贵宾席
         */
        if (curBenifits.vipSeats) {
            let node = cc.instantiate(this.prefab_benifitsItem);
            let scr = node.getComponent("BenefitsItemCtrl");
            scr.setBenifitsItemData(6, curBenifits);
            this.node_benifits.addChild(node);
        };


        this.sprite_icon.spriteFrame = isShowLevelIcon == true ? this.atlas_icon.getSpriteFrame(`${curBenifits.level}`) : null;
        this.lab_vipLevel.string = `VIP ${curBenifits.level}`;

        if (nextBenifits) {
            this.btn_vipRight.interactable = true;
            this.btn_vipRight.enableAutoGrayEffect = false; 

            this.lab_nextLevelTips.string = this.getNextLevelTipsStr(nextBenifits.recharge / 100, level + 1);
            this.lab_nextLevelProgress.string = `${GlobalCfg.USER_DATAS.userVip.recharged/100}/${nextBenifits.recharge/100}`;
            this.progressBar_nextLevel.progress = GlobalCfg.USER_DATAS.userVip.recharged/nextBenifits.recharge;
        }
        else {
            this.btn_vipRight.interactable = false;
            this.btn_vipRight.enableAutoGrayEffect = true; 

            this.lab_nextLevelTips.string = this.getUnlockMoreLevelTipsStr();
            this.lab_nextLevelProgress.string = `${GlobalCfg.USER_DATAS.userVip.recharged/100}/-`;
            this.progressBar_nextLevel.progress = 0;
        }; 
        
        this.lab_nextLevelProgress.node.active = false;

        if (lastBenifits) {
            this.btn_vipLeft.interactable = true;
            this.btn_vipLeft.enableAutoGrayEffect = false;
        }
        else {
            this.btn_vipLeft.interactable = false;
            this.btn_vipLeft.enableAutoGrayEffect = true;
        };
    },

    dealVipTakeWelfare: function(notify) {
        let timestamp = GlobalCfg.USER_DATAS.userVip.system_time;
        if (timestamp >= GlobalCfg.USER_DATAS.userVip.expires_time) {
            CommonFun.getInstance().showMsgBox('Your VIP has expired , you can activate it after recharging !', 'ADDCASH', ()=>{
                CommonFun.getInstance().showNewShop(false, GlobalCfg.SHOP_RECHARGE_FROM.VipExpired);
            }, false);
            return;
        };
        if (notify.type == "day" || notify.type == "week" || notify.type == "month") {
            let httpUrl = GlobalCfg.HTTP_SERVER + "/v1/vip/takewelfare/" + notify.type;
            let httpParam = {};
            CommonFun.getInstance().httpPost(httpUrl, httpParam, (strInfo) => {
                if (strInfo && strInfo.data) {
                    let take = strInfo.data.take;
                    for (let i = 0, len = take.length; i < len; i++) {
                        const element = take[i];
                        let id = element.id;
                        let amount = element.amount;
                        if (id == 10) {
                            GlobalCfg.USER_DATAS.deposit += amount;
                            GlobalCfg.USER_DATAS.userDiamond += amount;
                            CommonFun.getInstance().showVipRewardToast(amount/100, false);
                        }
                        else if (id == 11) {
                            GlobalCfg.USER_DATAS.winnings += amount;
                            GlobalCfg.USER_DATAS.userDiamond += amount;
                            CommonFun.getInstance().showVipRewardToast(amount/100, false);
                        }
                        else if (id == 12) {
                            GlobalCfg.USER_DATAS.bonus += amount;
                            CommonFun.getInstance().showVipRewardToast(amount/100, true);
                        };
                    };
                    ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, {
                        msgCode: GlobalCfg.CLIENT_MSG_ID.VIP_REWARD,
                        msgData: {}
                    });
                    ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, {
                        msgCode: GlobalCfg.CLIENT_MSG_ID.GET_MAIL_REWARD,
                        msgData: {}
                    });
                }
                else {
                    CommonFun.getInstance().showTips(strInfo.msg);
                };

                httpUrl = GlobalCfg.HTTP_SERVER + "/v1/vip/info";
                CommonFun.getInstance().httpGet(httpUrl, (strInfo) => {
                    if (strInfo && strInfo.data) {
                        GlobalCfg.USER_DATAS.userVip = strInfo.data.user_vip;
                        ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, {
                            msgCode: GlobalCfg.CLIENT_MSG_ID.VIP_INFO_UPDATE,
                            msgData: {}
                        }); 
                    };
                }, null, GlobalCfg.USER_DATAS.BearerToken);
            }, null, GlobalCfg.USER_DATAS.BearerToken);
        };
    }, 
});
