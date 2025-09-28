cc.Class({
    extends: cc.Component,

    properties: {
        btn_close: cc.Button,
        btn_spin: cc.Button,
        btn_reduce: cc.Button,
        btn_add: cc.Button,

        lab_spinLeft: cc.Label,
        lab_selectSpinNum: cc.Label,

        node_content: cc.Node,

        spine_niuDan: sp.Skeleton,
        spine_poDan: sp.Skeleton,

        prefab_item: cc.Prefab,
    },

    ctor: function() {
        this.niuDanSkinArr = [
            "qiu1", "qiu2", "qiu3", "qiu4", "qiu5", "qiu6", "qiu7"
        ];
        this.selectSpinNum = 0;
        this.customMsgEventHandle = null;
        this.isPlayingNiuDan = false;
    },

    onLoad: function() {
        this.spine_niuDan.setSkin("default");
        this.spine_niuDan.animation = null;
        this.spine_poDan.setSkin("default");
        this.spine_poDan.animation = null;

        this.btn_close.node.on("click", CommonFun.getInstance().debounce(this.btnClick, 1), this);
        this.btn_spin.node.on("click", CommonFun.getInstance().debounce(this.btnClick, 1), this);
        this.btn_reduce.node.on("click", CommonFun.getInstance().debounce(this.btnClick, 0), this);
        this.btn_add.node.on("click", CommonFun.getInstance().debounce(this.btnClick, 0), this);

        this.customMsgEventHandle = ClientNotify.register(GlobalCfg.MSG_TYPE.clientMsg, this.onEventMsg, this);

        
    },

    start: function() {
        this.setItems();
        this.setSpinLeft();
        this.setSelectSpinNum(GlobalCfg.USER_DATAS.userVip.gacha_quota >= 1 ? 1 : 0);
    },

    onDestroy: function() {
        ClientNotify.removeByHandle(GlobalCfg.MSG_TYPE.clientMsg, this.customMsgEventHandle);

        CommonFun.getInstance().releasePrefab(GlobalCfg.PREFAB_PATH.VIPLUCKYDRAW);
    },

    onEventMsg: function(webData, target) {
        let self = target;
        let msgId = webData.msgCode;
        let notify = webData.msgData;
        if (GlobalCfg.CLIENT_MSG_ID.VIP_INFO_UPDATE === msgId) {
            self.setSpinLeft();
        };
    },

    btnClick: function(btn) {
        let btnName = btn.node.name;
        switch (btnName) {
            case "btn_close":
                GlobalCfg.G_COMPONENTS.Audio.playBack();
                this.dealBtnCloseEvent();
                return;
            case "btn_spin":
                this.dealBtnSpinEvent();
                break;
            case "btn_reduce":
                this.dealBtnReduceEvent();
                break;
            case "btn_add":
                this.dealBtnAddEvent();
                break;
            default:
                break;
        }
        GlobalCfg.G_COMPONENTS.Audio.playButton();
    },

    dealBtnCloseEvent: function() {
        this.node.destroy();
    },

    dealBtnReduceEvent: function() {
        this.setSelectSpinNum(this.selectSpinNum - 1);
    },

    dealBtnAddEvent: function() {
        this.setSelectSpinNum(this.selectSpinNum + 1);
    },

    setItems: function() {
        let index = 0;
        let len = GlobalCfg.USER_DATAS.gacha.length;
        let addItemFun = () => {
            if (index >= len) {
                this.unschedule(addItemFun);
                return; 
            };
            let itemData = GlobalCfg.USER_DATAS.gacha[index];
            let itemNode = cc.instantiate(this.prefab_item);
            let scr = itemNode.getComponent("VipLuckyDrawItemCtrl");
            scr.setVipLuckyDrawItemData(itemData);
            this.node_content.addChild(itemNode);
            index += 1;
        };
        this.schedule(addItemFun, 1 / Number(cc.game.getFrameRate()), len, 0);
    },

    setSelectSpinNum: function(spinNum) {
        let miniSpinNum = GlobalCfg.USER_DATAS.userVip.gacha_quota >= 1 ? 1 : 0;
        if (spinNum <= miniSpinNum) {
            this.selectSpinNum = miniSpinNum;
            this.btn_reduce.interactable = false;
            this.btn_reduce.enableAutoGrayEffect = true; 
        }
        else {
            this.selectSpinNum = spinNum;
            this.btn_reduce.interactable = true;
            this.btn_reduce.enableAutoGrayEffect = false; 
        };

        if (spinNum >= GlobalCfg.USER_DATAS.userVip.gacha_quota) {
            this.selectSpinNum = GlobalCfg.USER_DATAS.userVip.gacha_quota;
            this.btn_add.interactable = false;
            this.btn_add.enableAutoGrayEffect = true; 
        }
        else {
            this.selectSpinNum = spinNum;
            this.btn_add.interactable = true;
            this.btn_add.enableAutoGrayEffect = false; 
        };

        this.lab_selectSpinNum.string = this.selectSpinNum;
    },

    setSpinLeft: function() {
        this.lab_spinLeft.string = GlobalCfg.USER_DATAS.userVip.gacha_quota;
    },

    dealBtnSpinEvent: function() {
        if (this.selectSpinNum == 0) {
            CommonFun.getInstance().showTips("Insufficient number of lucky");
            return;
        };
        if (GlobalCfg.USER_DATAS.userVip.gacha_quota <= 0) {
            CommonFun.getInstance().showTips("Insufficient number of lucky");
            return;
        };
        if (this.selectSpinNum > GlobalCfg.USER_DATAS.userVip.gacha_quota) {
            CommonFun.getInstance().showTips("Exceeded the number of lucky times");
            return;
        };

        if (this.isPlayingNiuDan) {
            return;
        };
        this.isPlayingNiuDan = true;

        let httpUrl = GlobalCfg.HTTP_SERVER + "/v1/vip/gacha";
        let httpParam = {count: this.selectSpinNum};
        CommonFun.getInstance().httpPost(httpUrl, httpParam, (strInfo) => {
            if (strInfo && strInfo.data) {
                let takeArr = strInfo.data.take ? strInfo.data.take : [];
                if (CommonFun.getInstance().isValidForScr(this)) {
                    GlobalCfg.USER_DATAS.userVip.gacha_quota -= this.selectSpinNum;
                    this.setSpinLeft();
                    this.setSelectSpinNum(GlobalCfg.USER_DATAS.userVip.gacha_quota >= 1 ? 1 : 0);
                    this.playNiuDanAnimation(takeArr);
                };
            }
            else {
                this.isPlayingNiuDan = false;
                CommonFun.getInstance().showTips(strInfo.msg);
            };
        }, () => {
            this.isPlayingNiuDan = false; 
        }, GlobalCfg.USER_DATAS.BearerToken);
    },


    playNiuDanAnimation: function(takeArr) {
        GlobalCfg.G_COMPONENTS.Audio.playSoundByNameInResources("vipSound/btnNiu", false);
        GlobalCfg.G_COMPONENTS.Audio.playSoundByNameInResources("vipSound/qiuNiu", false);

        let randomIndex = Math.floor(Math.random() * this.niuDanSkinArr.length);
        let randomSkin = this.niuDanSkinArr[randomIndex];
        LoggerUtil.getInstance().log("Default Skin: ", randomSkin);

        this.spine_niuDan.setCompleteListener(() => {
            if (CommonFun.getInstance().isValidForScr(this)) {
                GlobalCfg.G_COMPONENTS.Audio.playSoundByNameInResources("vipSound/qiuOut", false);
                this.spine_niuDan.setSkin("default");
                this.spine_niuDan.animation = null;

                this.spine_poDan.setSkin(randomSkin);
                this.spine_poDan.setAnimation(0, "animation", false);
            };
        });

        this.spine_poDan.setCompleteListener(() => {
            if (CommonFun.getInstance().isValidForScr(this)) {
                this.spine_poDan.setSkin("default");
                this.spine_poDan.animation = null;
                this.isPlayingNiuDan = false;
                for (let i = 0, len = takeArr.length; i < len; i++) {
                    const element = takeArr[i];
                    let id = element.id;
                    let amount = element.amount;
                    if (id == 10) {
                        GlobalCfg.USER_DATAS.deposit += amount;
                        GlobalCfg.USER_DATAS.userDiamond += amount;
                        // CommonFun.getInstance().showVipRewardToast(amount/100, false);
                        CommonFun.getInstance().showRewardsTips([{ id: 10, amount: amount/100 }]);
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

                    ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, {
                        msgCode: GlobalCfg.CLIENT_MSG_ID.CURRENCY_CHANGED_USER_INFO,
                        msgData: {}
                    }); 
                    ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, {
                        msgCode: GlobalCfg.CLIENT_MSG_ID.CURRENCY_CHANGED_USER_INFO,
                        msgData: {}
                    });
                };
                ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, {
                    msgCode: GlobalCfg.CLIENT_MSG_ID.VIP_REWARD,
                    msgData: {}
                }); 
            };
        });
    
        this.spine_niuDan.setSkin(randomSkin);
        this.spine_niuDan.setAnimation(0, "animation", false);
    },
});
