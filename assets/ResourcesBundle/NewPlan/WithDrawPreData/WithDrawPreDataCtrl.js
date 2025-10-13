
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
    },

    // LIFE-CYCLE CALLBACKS:

    ctor() {
        this.remainingTimes = 0;        // 剩余提现次数
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
            bank_card_id: 'Must be number in Account',        // 银行个人卡号
            name: 'The User Name only contain letters',    // UserName
            ifsc: 'The IFSC is invalid , top 4s should \n be upper letters the 5th should be zero',   // IFSC
            ifsc_1: 'Invalid IFSC, please confirm \n it is the correct 11 bit length',   // IFSC
            bank_code: 'Please fill in the correct bank',     // 银行
            email: 'Error Email',  // Email
            mobile: 'The Mobile Number is invalid',      // Mobile
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
        for (const key in this.address) {
            if (Object.hasOwnProperty.call(this.address, key)) {
                // if (this.address[key] == "") {
                if (Reflect.has(this.errorStrArr, key) && this.address[key] == "") {
                    this.writeDataErrorList.add(key)
                }
            }
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
        lab.string = `WITHDRAW(${this.remainingTimes})`;
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
        this.MobileEditBox.string = this.address.mobile.slice(2, this.address.mobile.length);

        this.nodeMain.active = false;
        this.nodeWirte.active = true;

    },

    saveAddress() {
        if (this.writeDataErrorList.size == 0) {
            CommonFun.getInstance().showProgress();
            let httpUrl = GlobalCfg.HTTP_SERVER + "/v1/payment/india_address";
            CommonFun.getInstance().httpPost(httpUrl, { address: this.address }, (msg) => {
                CommonFun.getInstance().hidProgress();
                if (msg.result == 0) {
                    CommonFun.getInstance().showTips('Save Info Success!');
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
            let errorStr = this.errorStrArr[value];
            CommonFun.getInstance().showTips(errorStr);
        }
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
        let str = editBox.string;
        let pattern = new RegExp('^[0-9]+$');
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
        let pattern = new RegExp('^[A-Z]{4}[0]{1}');
        if (pattern.test(str) == true) {
            this.writeDataErrorList.delete('ifsc');
            if (str.length == 11) {
                this.writeDataErrorList.delete('ifsc_1');
                this.address.ifsc = str;
            } else {
                this.writeDataErrorList.add('ifsc_1');
            }
        } else {
            this.writeDataErrorList.add('ifsc');
        }

    },

    checkBankName(editBox) {
        let str = editBox.string;
        let pattern = /^[A-Za-z0-9]*(\s[A-Za-z0-9]*)*$/;
        // 纯英文 + 数字 + 空格
        if (pattern.test(str) == true && str.length > 0) {
            this.address.bank_code = str;
            this.writeDataErrorList.delete('bank_code');
        } else {
            this.writeDataErrorList.add('bank_code');
        }
    },

    checkBranchBankName(editBox) {
        // 参数暂未使用
    },

    checkEmail(editBox) {
        let str = editBox.string;
        let validateEmail = (email) => {
            return email.match(
                /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
        };
        if (validateEmail(str)) {
            this.address.email = str;
            this.writeDataErrorList.delete('email');
        } 
        else {
            this.writeDataErrorList.add('email');
        };
    },

    checkMobile(editBox) {
        let str = editBox.string;
        if (str.length == 10) {
            this.address.mobile = "91"+str;
            this.writeDataErrorList.delete('mobile');
        } else {
            this.writeDataErrorList.add('mobile');
        }
    },
});
