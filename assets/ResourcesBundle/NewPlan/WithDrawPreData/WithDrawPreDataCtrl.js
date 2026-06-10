
cc.Class({
    extends: cc.Component,

    properties: {
        // 主界面
        btnBack: cc.Button,
        btnAddAccount: cc.Button,
        btnWithDraw: cc.Button,
        btnRule: cc.Button,
        labTotalBalance: cc.Label,
        labWithdrawAble: cc.Label,
        labBankAccount: cc.Label,
        nodeBankAccountDefault: cc.Node,
        nodeMain: cc.Node,
        togglesParent: cc.Node,
        lab_user_name: cc.Label,
        headSp: cc.Sprite,

        // Rule
        nodeRule: cc.Node,
        btnCLoseRule: cc.Button,

        // WriteData
        nodeWirte: cc.Node,
        btnSave: cc.Button,
        btnCloseWrite: cc.Button,
        AccountEditBox: cc.EditBox,
        UserNameEditBox: cc.EditBox,
        IFSCEditBox: cc.EditBox,
        BankNameEditBox: cc.EditBox,
        BranchBankNameEditBox: cc.EditBox,
        EmailEditBox: cc.EditBox,
        MobileEditBox: cc.EditBox,

        lab_num: [cc.Label],
    },

    // LIFE-CYCLE CALLBACKS:

    ctor() {
        this.remainingTimes = 0;        // 剩余提现次数
        this.firstRegisterRequiredFields = new Set(['bank_card_id', 'name', 'mobile']);
        this.address = {            // 当前脚本主要数据
            uid: GlobalCfg.USER_DATAS.userid,
            bank_card_id: "",       // 银行个人卡号
            name: "",
            ifsc: "",
            bank_code: "",          // 银行
            email: "",
            mobile: "",
            // 非必须
            // upi: "",
            // pan: "",
        };
        this.writeDataErrorList = new Set();   // 填写信息错误
        this.errorStrArr = {
            bank_card_id: {
                English: 'Account must be 11 digits',
                Bengali: 'অ্যাকাউন্ট নম্বর অবশ্যই ১১ সংখ্যার হতে হবে'
            },        // 银行个人卡号
            name: {
                English: 'The User Name only contain letters',
                Bengali: 'ইউজার নেমে শুধুমাত্র অক্ষর থাকতে হবে'
            },    // UserName
            ifsc: {
                English: 'The IFSC is invalid , top 4s should \n be upper letters the 5th should be zero',
                Bengali: 'IFSC ভুল। প্রথম ৪টি বড় হাতের অক্ষর \n এবং ৫মটি 0 হতে হবে'
            },   // IFSC
            ifsc_1: {
                English: 'Invalid IFSC, please confirm \n it is the correct 11 bit length',
                Bengali: 'IFSC ভুল, অনুগ্রহ করে নিশ্চিত করুন \n এটি ১১ অক্ষরের সঠিক দৈর্ঘ্য'
            },   // IFSC
            bank_code: {
                English: 'Please fill in the correct bank',
                Bengali: 'সঠিক ব্যাংকের নাম লিখুন'
            },     // 银行
            email: {
                English: 'Error Email',
                Bengali: 'ইমেইল ভুল'
            },  // Email
            mobile: {
                English: 'Mobile must be 11 digits',
                Bengali: 'মোবাইল নম্বর অবশ্যই ১১ সংখ্যার হতে হবে'
            },      // Mobile
        };
        this.commonTipsStrArr = {
            saveInfoSuccess: {
                English: 'Save Info Success!',
                Bengali: 'তথ্য সফলভাবে সংরক্ষণ করা হয়েছে!'
            }
        };
    },

    onLoad() {
        this.customMsgEventHandle = ClientNotify.register(GlobalCfg.MSG_TYPE.clientMsg, this.onEventMsg, this);
        this.checkShipei(this.node);
        this.nodeWirte.account = false;
        this.nodeMain.account = true;

        if (GlobalCfg.USER_DATAS.recharged == 0) {
            this.remainingTimes = 3;
        }
        else  {
            if (CommonFun.getInstance().isOpenVipModule()) {
                this.remainingTimes = GlobalCfg.USER_DATAS.userVip.day_withdraw_count_limit - GlobalCfg.USER_DATAS.userVip.day_withdraw_count;
                this.remainingTimes = this.remainingTimes <= 0 ? 0 : this.remainingTimes;
            }
            else {
                this.remainingTimes = GlobalCfg.USER_DATAS.remainWithdrawCount <= 0 ? 0 : GlobalCfg.USER_DATAS.remainWithdrawCount;
            };
        };
        this.updateWithDrawRemainingCount();
        this.togglesParent.children.forEach((item)=> {
            item.on('toggle', ()=>{
                GlobalCfg.G_COMPONENTS.Audio.playButton();
            })
        });
        for (let i = 0, len = this.lab_num.length; i < len; i++) {
            this.lab_num[i].string = CommonFun.getInstance().formatCurrencyAmount(this.lab_num[i].string);
        }

        // this.AccountEditBox.node.active = false;
        this.BranchBankNameEditBox.node.active = false;
        this.EmailEditBox.node.active = false;
        // this.MobileEditBox.node.active = false;
    },

    onDestroy: function() {
        ClientNotify.removeByHandle(GlobalCfg.MSG_TYPE.clientMsg, this.customMsgEventHandle);
    },

    checkShipei(node) {
        // if (GlobalCfg.DEVICE_MODEL != "iphone X") {
        //     node.scaleX = 0.9;
        // }
        let frameSize = cc.view.getFrameSize();
        let w = frameSize.width;
        let h = frameSize.height;
        if (w / h < 2) { //宽高比小于2
            node.getChildByName('sps').scale = 0.9;
        }
    },

    start() {
        this.btnBack.node.on('click', this.clickCallback, this);
        this.btnAddAccount.node.on('click', this.clickCallback, this);
        this.btnWithDraw.node.on('click', this.clickCallback, this);
        this.btnRule.node.on('click', this.clickCallback, this);
        this.btnCLoseRule.node.on('click', this.clickCallback, this);
        this.btnCloseWrite.node.on('click', this.clickCallback, this);

        this.btnSave.node.on('click', this.clickCallback, this);
        this.AccountEditBox.node.on('editing-did-ended', this.checkAccound, this);
        this.UserNameEditBox.node.on('editing-did-ended', this.checkUserName, this);
        this.IFSCEditBox.node.on('editing-did-ended', this.checkIFSCCode, this);
        this.BankNameEditBox.node.on('editing-did-ended', this.checkBankName, this);
        this.BranchBankNameEditBox.node.on('editing-did-ended', this.checkBranchBankName, this);
        this.EmailEditBox.node.on('editing-did-ended', this.checkEmail, this);
        this.MobileEditBox.node.on('editing-did-ended', this.checkMobile, this);

        this.initConfigData();
    },

    onEventMsg: function (webData, target) {
        let self = target;
        let msgId = webData.msgCode;
        let notify = webData.msgData;
        if (msgId == GlobalCfg.CLIENT_MSG_ID.REMAIN_WITH_DRAW_UPDATE) {
            if (CommonFun.getInstance().isValidForScr(self)) {
                self.remainingTimes = GlobalCfg.USER_DATAS.remainWithdrawCount <= 0 ? 0 : GlobalCfg.USER_DATAS.remainWithdrawCount;
                self.updateWithDrawRemainingCount();
            }; 
        }
        else if (msgId == GlobalCfg.CLIENT_MSG_ID.VIP_INFO_UPDATE) {
            if (CommonFun.getInstance().isValidForScr(self)) {
                self.remainingTimes = GlobalCfg.USER_DATAS.userVip.day_withdraw_count_limit - GlobalCfg.USER_DATAS.userVip.day_withdraw_count;
                self.remainingTimes = self.remainingTimes <= 0 ? 0 : self.remainingTimes;
                self.updateWithDrawRemainingCount();
            }; 
        }
    },

    clickCallback(button) {
        let name = button.node.name;
        if (name == this.btnBack.node.name) {
            GlobalCfg.G_COMPONENTS.Audio.playBack();
            this.node.destroy();
            return;
        }else if (name == this.btnCLoseRule.node.name) {
            GlobalCfg.G_COMPONENTS.Audio.playBack();
            this.nodeRule.active = false;
            return;
        }
        GlobalCfg.G_COMPONENTS.Audio.playButton();
        if (name == this.btnAddAccount.node.name) {
            this.showWriteData();
        }
        else if (name == this.btnWithDraw.node.name) {
            if (this.labBankAccount.node.active == true) {       // 已有银行卡号，
                if (GlobalCfg.USER_DATAS.recharged == 0) {       // 未充值
                    if (CommonFun.getInstance().isOpenVipModule()) {
                        CommonFun.getInstance().showVipRechargeToast();
                    }
                    else {
                        CommonFun.getInstance().showMsgBox("You can recharge any amount to active \n the withdraw function,recharge now?", "ADDCASH", () => {
                            CommonFun.getInstance().showNewShop(false, GlobalCfg.SHOP_RECHARGE_FROM.WithDrawPreData);
                        }, false); 
                    };
                }
                else {
                    if (CommonFun.getInstance().isOpenVipModule()) {
                        let option = GlobalCfg.USER_DATAS.transferConfig.option ? GlobalCfg.USER_DATAS.transferConfig.option.sort((a, b) => {return a.price - b.price;}) : [];
                        let miniWithDraw = option.length > 0 ? option[0].price : 0;
                        if (GlobalCfg.USER_DATAS.userVip.day_withdraw_count >= GlobalCfg.USER_DATAS.userVip.day_withdraw_count_limit 
                            || (GlobalCfg.USER_DATAS.userVip.withdraw_total + miniWithDraw * 100) > GlobalCfg.USER_DATAS.userVip.withdraw_total_limit) {
                            CommonFun.getInstance().showVipUpgradeToast();
                        }
                        else {
                            // 已充值，跳转提现界面
                            CommonFun.getInstance().showWithDraw(()=>{
                                this.node.destroy();
                            });
                        };
                    }
                    else {
                        CommonFun.getInstance().showWithDraw(()=>{
                            this.node.destroy();
                        });
                    };
                };
            } 
            else {
                this.showWriteData();
            };
        }
        else if (name == this.btnRule.node.name) {
            this.nodeRule.active = true;
        }
        else if (name == this.btnSave.node.name) {
            this.saveAddress();
        }
        else if (name == this.btnCloseWrite.node.name) {
            this.nodeWirte.active = false;
            this.nodeMain.active = true;
        }
    },

    setData(data) {
        /**
         * type data {
         *      address: {},
         *      third_id: number,
         *      third_open_withdraw_way: [number]
         * }
         */
        if (data) {
            this.address = CommonFun.getInstance().deepCopy(data);
            this.initServiceData();
            this.initWriteDataErrorList();
        } else {
            LoggerUtil.getInstance().error("Service WithDrawAddress Data Error!!!");
            this.node.destroy();
        }
    },

    initWriteDataErrorList() {
        this.writeDataErrorList.clear();
        this.firstRegisterRequiredFields.forEach((key) => {
            if (this.address[key] == "") {
                this.writeDataErrorList.add(key);
            }
        });

        let accountPattern = new RegExp('^[0-9]{11}$');
        if (!accountPattern.test(this.address.bank_card_id || "")) {
            this.writeDataErrorList.add('bank_card_id');
        }

        let mobilePattern = new RegExp('^[0-9]{11}$');
        if (!mobilePattern.test(this.address.mobile || "")) {
            this.writeDataErrorList.add('mobile');
        }
        // LoggerUtil.getInstance().warn(">>>>>>>填写信息错误>>>>>>Set====", this.writeDataErrorList);
    },

    initConfigData() {
        this.labTotalBalance.string = "" + (GlobalCfg.USER_DATAS.userDiamond / 100);
        if(GlobalCfg.USER_DATAS.recharged > 0){
            // 已充值
            this.labWithdrawAble.string = "" + Number(GlobalCfg.USER_DATAS.winnings) / 100;
        }else{
            this.labWithdrawAble.string = "" + (GlobalCfg.USER_DATAS.userDiamond / 100);
        }

        this.loadHeadSp(GlobalCfg.USER_DATAS.userHeadimgurl, 70, this.headSp);
        this.lab_user_name.string = CommonFun.getInstance().getStrByLength(GlobalCfg.USER_DATAS.userName, 12);
    },

    initServiceData() {
        this.setBankAccount(this.address.bank_card_id);
    },

    /**
     * 更新提现按钮显示次数
     */
    updateWithDrawRemainingCount() {
        let lab = this.btnWithDraw.target.getChildByName('Label').getComponent(cc.Label);
        let languagesType = cc.sys.localStorage.getItem("LanguageTypeStorage");
        let withdrawStr = I18NUtil.getInstance().getLanguageStr(languagesType, I18NLabelTransIdEnum['Withdraw_Title']);
        lab.string = `${withdrawStr}(${this.remainingTimes})`;
    },

    setBankAccount(account) {
        if (account && account.length > 0) {
            this.nodeBankAccountDefault.active = false;
            this.labBankAccount.string = account;
            this.labBankAccount.node.active = true;
        } else {
            this.nodeBankAccountDefault.active = true;
            this.labBankAccount.node.active = false;
        }
    },

    showWriteData() {
        LoggerUtil.getInstance().log("展示玩家WithDraw信息", this.address);
        this.AccountEditBox.string = this.address.bank_card_id;
        this.UserNameEditBox.string = this.address.name;
        this.IFSCEditBox.string = this.address.ifsc;
        this.BankNameEditBox.string = this.address.bank_code;
        this.EmailEditBox.string = this.address.email;
        let mobile = this.address.mobile || "";
        // 兼容旧数据：历史上可能保存为 91 + 10 位
        if (/^91\d{10}$/.test(mobile)) {
            mobile = mobile.slice(2);
        }
        this.MobileEditBox.string = mobile;

        this.nodeMain.active = false;
        this.nodeWirte.active = true;

    },

    saveAddress() {
        if (this.writeDataErrorList.size == 0) {
            this.address.country = 2;   // 1 印度 2 孟加拉
            CommonFun.getInstance().showProgress();
            let httpUrl = GlobalCfg.HTTP_SERVER + "/v1/payment/india_address";
            CommonFun.getInstance().httpPost(httpUrl, { address: this.address }, (msg) => {
                CommonFun.getInstance().hidProgress();
                if (msg.result == 0) {
                    CommonFun.getInstance().showTips(this.getCommonTipStrByLanguage('saveInfoSuccess'));
                    if (CommonFun.getInstance().isValidForScr(this)) { 
                        this.initServiceData();
                        this.nodeMain.active = true;
                        this.nodeWirte.active = false;
                        GlobalCfg.USER_DATAS.transferAddress = CommonFun.getInstance().deepCopy(this.address);
                        if (GlobalCfg.USER_DATAS.recharged == 0) {// 未充值的玩家 第一次保存消息时 自动打开vip提示界面
                            if (CommonFun.getInstance().isOpenVipModule()) {
                                CommonFun.getInstance().showVipRechargeToast();
                            }
                            else {
                                CommonFun.getInstance().showMsgBox("You can recharge any amount to active \n the withdraw function,recharge now?", "ADDCASH", () => {
                                    CommonFun.getInstance().showNewShop(false, GlobalCfg.SHOP_RECHARGE_FROM.WithDrawPreData);
                                }, false); 
                            };
                        }
                    };

                } 
                else {
                    CommonFun.getInstance().showTips(msg.msg);
                };
            }, null, GlobalCfg.USER_DATAS.BearerToken);
        } else {
            const iterator1 = this.writeDataErrorList.values();
            let value = iterator1.next().value;
            let errorStr = this.getErrorStrByLanguage(value);
            CommonFun.getInstance().showTips(errorStr);
        }
    },

    isBengaliLanguage() {
        let languagesType = I18NUtil.getInstance().getLanguageType();
        let languageTypeStorage = cc.sys.localStorage.getItem("LanguageTypeStorage");
        let legacyLanguage = cc.sys.localStorage.getItem("language");
        return languagesType == I18NLanguagesEnum.Bengali || languageTypeStorage == "Bengali" || String(legacyLanguage) == "4";
    },

    getErrorStrByLanguage(errorKey) {
        let languageKey = this.isBengaliLanguage() ? "Bengali" : "English";
        let errorConfig = this.errorStrArr[errorKey];
        if (errorConfig && typeof errorConfig === 'object') {
            return errorConfig[languageKey] || errorConfig.English || '';
        }
        return errorConfig || '';
    },

    getCommonTipStrByLanguage(tipKey) {
        let languageKey = this.isBengaliLanguage() ? "Bengali" : "English";
        let tipConfig = this.commonTipsStrArr[tipKey];
        if (tipConfig && typeof tipConfig === 'object') {
            return tipConfig[languageKey] || tipConfig.English || '';
        }
        return tipConfig || '';
    },

    loadHeadSp: function (headUrl,realWidth,heaSprite) {
        if (headUrl && headUrl.length > 0) {
            cc.assetManager.loadRemote(headUrl,{ext: '.png'}, (err, texture) => {
                if(!err && cc.isValid(this) && cc.isValid(heaSprite)){
                    heaSprite.spriteFrame = new cc.SpriteFrame(texture);
                    heaSprite.node.setScale(realWidth/heaSprite.node.width);
                }
            });
        }
    },
    // -----------------------------------------EditBox-------------------------------------------------------------
    checkAccound(editBox) {
        if (!this.AccountEditBox.node.active) {
            this.writeDataErrorList.delete("bank_card_id");
            return;
        }
        let str = editBox.string;
        let pattern = new RegExp('^[0-9]{11}$');
        if (pattern.test(str) == true) {
            this.writeDataErrorList.delete("bank_card_id");
            this.address.bank_card_id = str;
        } else {
            this.writeDataErrorList.add('bank_card_id');
        }
    },

    checkUserName(editBox) {
        let str = editBox.string;
        // let pattern = new RegExp('[0-9]+');
        // let pattern = new RegExp('^[A-Za-z]*(\s[A-Za-z]*)*$');
        // 名字必须为英文，可包含空格
        if (str.length > 0) {
            this.address.name = str;
            this.writeDataErrorList.delete('name');
        } else {
            this.writeDataErrorList.add('name');
        }
    },

    checkIFSCCode(editBox) {
        let str = editBox.string;
        this.address.ifsc = str;
        this.writeDataErrorList.delete('ifsc');
        this.writeDataErrorList.delete('ifsc_1');

    },

    checkBankName(editBox) {
        let str = editBox.string;
        this.address.bank_code = str;
        this.writeDataErrorList.delete('bank_code');
    },

    checkBranchBankName(editBox) {
        // 分行名称不参与必填校验
        this.writeDataErrorList.delete('branch_bank_name');
    },

    checkEmail(editBox) {
        if (!this.EmailEditBox.node.active) {
            this.writeDataErrorList.delete('email');
            return;
        }
        let str = editBox.string;
        this.address.email = str;
        this.writeDataErrorList.delete('email');
    },

    checkMobile(editBox) {
        if (!this.MobileEditBox.node.active) {
            this.writeDataErrorList.delete('mobile');
            return;
        }
        let str = editBox.string;
        let pattern = new RegExp('^[0-9]{11}$');
        if (pattern.test(str) == true) {
            this.address.mobile = str;
            this.writeDataErrorList.delete('mobile');
        } else {
            this.writeDataErrorList.add('mobile');
        }
    },
});
