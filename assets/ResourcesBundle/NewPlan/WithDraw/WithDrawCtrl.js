cc.Class({
    extends: cc.Component,

    properties: {
        btn_back: cc.Button,
        btn_instructions: cc.Button,
        btn_record: cc.Button,
        btn_addCash: cc.Button,
        btn_depositCashTips: cc.Button,
        btn_winningsCashTips: cc.Button,
        btn_withdraw: cc.Button,

        lab_cashBalance: cc.Label,
        lab_depositCash: cc.Label,
        lab_winningsCash: cc.Label,
        lab_dailyWithdrawalCountLeft: cc.Label,
        lab_withdrawAmount: cc.Label,
        lab_btnWithDrawTips: cc.Label,
        lab_withDrawWarnTips: cc.Label,

        node_withDrawItemContent: cc.Node,
    },


    ctor: function() {
        this.selectedItemData = null;
    },


    onLoad: function() {
        this.btn_back.node.on("click", CommonFun.getInstance().debounce(this.btnClick, 1), this);
        this.btn_instructions.node.on("click", CommonFun.getInstance().debounce(this.btnClick, 1), this);
        this.btn_record.node.on("click", CommonFun.getInstance().debounce(this.btnClick, 1), this);
        this.btn_addCash.node.on("click", CommonFun.getInstance().debounce(this.btnClick, 1), this);
        this.btn_depositCashTips.node.on("click", CommonFun.getInstance().debounce(this.btnClick, 0), this);
        this.btn_winningsCashTips.node.on("click", CommonFun.getInstance().debounce(this.btnClick, 0), this);
        this.btn_withdraw.node.on("click", CommonFun.getInstance().debounce(this.btnClick, 1), this);

        this.setLabsData();

        let languagesType = I18NUtil.getInstance().getLanguageType();
        switch (languagesType) {
            case I18NLanguagesEnum.English:
                this.lab_withDrawWarnTips.string = `1. Money will be remitted to you within 1-7 days\n2. If the withdrawal application is wrong, please fill in you bank information again\n3. Withdrawal requires an additional service charge`;
                break;
            case I18NLanguagesEnum.Hindi:
                this.lab_withDrawWarnTips.string = `1. आपको 1-7 दिनों के भीतर पैसा भेज दिया जाएगा\n2. यदि निकासी आवेदन गलत है, तो कृपया अपनी बैंक जानकारी दोबारा भरें\n3. निकासी के लिए अतिरिक्त सेवा शुल्क की आवश्यकता होती है`;
                break;
            case I18NLanguagesEnum.Urdu:
                this.lab_withDrawWarnTips.string = `1. رقم آپ کو 1-7 دنوں کے اندر بھیج دی جائے گی\n2۔ اگر واپسی کی درخواست غلط ہے تو، براہ کرم اپنی بینک کی معلومات دوبارہ بھریں\n3۔ واپسی کے لیے اضافی سروس چارج کی ضرورت ہوتی ہے۔`;
                break;
            case I18NLanguagesEnum.Bengali:
                this.lab_withDrawWarnTips.string = `1. 1-7 দিনের মধ্যে আপনাকে টাকা পাঠানো হবে\n2. প্রত্যাহারের আবেদন ভুল হলে, অনুগ্রহ করে আপনার ব্যাঙ্কের তথ্য আবার পূরণ করুন\n3. প্রত্যাহার একটি অতিরিক্ত পরিষেবা চার্জ প্রয়োজন`;
                break;
            default:
                this.lab_withDrawWarnTips.string = `1. Money will be remitted to you within 1-7 days\n2. If the withdrawal application is wrong, please fill in you bank information again\n3. Withdrawal requires an additional service charge`;
                break;
        };
       
        this.msgHandle = ClientNotify.register(GlobalCfg.MSG_TYPE.serverMsg, this.onEventMsg, this);
        this.customMsgEventHandle = ClientNotify.register(GlobalCfg.MSG_TYPE.clientMsg, this.onEventMsg, this);
    },


    start: function() {
        this.setWithDrawItems();
    },

    onEventMsg: function(webData, target) {
        let self = target;
        let msgId = webData.msgCode;
        let notify = webData.msgData;
        if (msgId == GlobalCfg.CLIENT_MSG_ID.CURRENCY_CHANGED_USER_INFO) { 
            let reason = notify.reason;         // 原因
            let changed = notify.changed;       // 变化值
            let winnings = notify.winnings;     // winnings(后)
            let deposit = notify.deposit;       // deposit(后)
            let voucher = notify.voucher;       // 代金券(后)
            self.setLabsData();
        }
        else if (msgId == GlobalCfg.CLIENT_MSG_ID.WITHDRAW_SELECTED_ITEM) {
            let itemData = notify.itemData;
            self.selectedItemData = itemData;
            self.lab_withdrawAmount.string = CommonFun.getInstance().formatCurrencyAmount(FloatCalculation.accDiv(itemData.price * (1 - itemData.service_rate), 1).toFixed(1));
            let languagesType = I18NUtil.getInstance().getLanguageType();
            let descriptionStr = I18NUtil.getInstance().getLanguageStr(languagesType, I18NLabelTransIdEnum['Withdraw_Withdraw']);
            self.lab_btnWithDrawTips.string = CommonFun.getInstance().formatCurrencyText(descriptionStr, FloatCalculation.accDiv(itemData.price, 1));
        }
    },


    onDestroy: function() {
        ClientNotify.removeByHandle(GlobalCfg.MSG_TYPE.serverMsg, this.msgHandle);
        ClientNotify.removeByHandle(GlobalCfg.MSG_TYPE.clientMsg, this.customMsgEventHandle);
        CommonFun.getInstance().releasePrefab(GlobalCfg.PREFAB_PATH.WITHDRAWITEM);
        CommonFun.getInstance().releasePrefab(GlobalCfg.PREFAB_PATH.WITHDRAW);
    },


    setLabsData: function() {
        this.lab_cashBalance.string = CommonFun.getInstance().formatCurrencyAmount(FloatCalculation.accDiv(GlobalCfg.USER_DATAS.userDiamond, 100));
        this.lab_depositCash.string = CommonFun.getInstance().formatCurrencyAmount(FloatCalculation.accDiv(GlobalCfg.USER_DATAS.deposit, 100));
        this.lab_winningsCash.string = CommonFun.getInstance().formatCurrencyAmount(FloatCalculation.accDiv(GlobalCfg.USER_DATAS.winnings, 100));
        if (CommonFun.getInstance().isOpenVipModule()) { 
            let remainingTimes = GlobalCfg.USER_DATAS.userVip.day_withdraw_count_limit - GlobalCfg.USER_DATAS.userVip.day_withdraw_count;
            remainingTimes = remainingTimes <= 0 ? 0 : remainingTimes;
            this.lab_dailyWithdrawalCountLeft.string = remainingTimes;
        }
        else {
            let remainingTimes = GlobalCfg.USER_DATAS.remainWithdrawCount <= 0 ? 0 : GlobalCfg.USER_DATAS.remainWithdrawCount;
            this.lab_dailyWithdrawalCountLeft.string = remainingTimes;
        };
    },


    setWithDrawItems: function() {
        Promise.all([this.getWithDrawListInfo(), CommonFun.getInstance().loadPrefabByPromise(GlobalCfg.PREFAB_PATH.WITHDRAWITEM)])
        .then((arr) => {
            let withdrawList = arr[0];
            let itemPrefab = arr[1];
            if (CommonFun.getInstance().isValidForScr(this)) {
                this.addWithDrawItems(withdrawList, itemPrefab);         
            };       
        })
        .catch((err) => {
            
        });
    },


    getWithDrawListInfo: function() {
        return new Promise((resolve, reject) => {
            if (Reflect.has(GlobalCfg.USER_DATAS.transferConfig, 'option') == true) {
                resolve(GlobalCfg.USER_DATAS.transferConfig.option);
                return;
            }
            else {
                let url = GlobalCfg.HTTP_SERVER + "/v1/payment/transferoption/list";
                CommonFun.getInstance().httpGet(url, (json) => {
                    if (json && json.result == 0) {
                        let data = json.data;
                        let list = data.list;
                        GlobalCfg.USER_DATAS.transferConfig.option = list;
                        resolve(GlobalCfg.USER_DATAS.transferConfig.option);
                    }
                    else {
                        CommonFun.getInstance().showTips(strInfo.msg);
                    };
                }, null, GlobalCfg.USER_DATAS.BearerToken);
            };
        });
    },


    btnClick: function(btn) {
        let btnName = btn.node.name;
        switch (btnName) {
            case this.btn_back.node.name:
                GlobalCfg.G_COMPONENTS.Audio.playBack();
                this.dealBtnBackEvent();
                return;
            case this.btn_instructions.node.name:
                this.dealBtnInstructionsEvent();
                break;
            case this.btn_record.node.name:
                this.dealBtnRecordEvent();
                break;
            case this.btn_addCash.node.name:
                this.dealBtnAddCashEvent();
                break;
            case this.btn_depositCashTips.node.name:
                this.dealBtnDepositCashTipsEvent();
                break;
            case this.btn_winningsCashTips.node.name:
                this.dealBtnWinningsCashTipsEvent();
                break;
            case this.btn_withdraw.node.name:
                this.dealBtnWithdrawEvent();
                break;
            default:
                break;
        }
        GlobalCfg.G_COMPONENTS.Audio.playButton();
    },


    dealBtnBackEvent: function() {
        CommonFun.getInstance().decVerticalAcc();
        this.node.destroy();
    },


    dealBtnInstructionsEvent: function() {
        CommonFun.getInstance().showShopInstructions();
    },


    dealBtnRecordEvent: function() {
        CommonFun.getInstance().showTransactionRecord();
    },


    dealBtnAddCashEvent: function() {
        CommonFun.getInstance().showNewShop();
    },


    dealBtnDepositCashTipsEvent: function() {
        let content = "Deposit Cash is the Cash that you've added to your Wallet.\n\nYou can use Deposit Cash with Winnings Cash to pay for cash games.\n\nNote : You cannot withdraw your Deposit Cash.";
        CommonFun.getInstance().showWithDrawTips("Okay", content, () => {});
    },



    dealBtnWinningsCashTipsEvent: function() {
        let content = "Winnings Cash is the Cash that you have won in cash games.\n\nYou can use Winnings Cash and Deposit Cash to play for cash games.\n\nNote: You can withdraw your Winnings Cash.";
        CommonFun.getInstance().showWithDrawTips("Okay", content, () => {});
    },


    dealBtnWithdrawEvent: function() {
        if (this.selectedItemData === null) {
            return;
        };

        let withDrawAmount = this.selectedItemData.price;
        if (GlobalCfg.USER_DATAS.winnings < withDrawAmount * 100) {
            CommonFun.getInstance().showTips('Winning cash be not enough!');
        } 
        else {
            if (CommonFun.getInstance().isOpenVipModule()) {
                if (GlobalCfg.USER_DATAS.userVip.day_withdraw_count >= GlobalCfg.USER_DATAS.userVip.day_withdraw_count_limit 
                    || (GlobalCfg.USER_DATAS.userVip.withdraw_total + withDrawAmount * 100) > GlobalCfg.USER_DATAS.userVip.withdraw_total_limit) {
                    let content = "";
                    let languagesType = I18NUtil.getInstance().getLanguageType();
                    switch (languagesType) {
                        case I18NLanguagesEnum.English:
                            content = "Your VIP level needs to be improved, please go to upgrade your VIP level!";
                            break;
                        case I18NLanguagesEnum.Hindi:
                            content = "आपके वीआईपी स्तर में सुधार की आवश्यकता है, कृपया अपने वीआईपी स्तर को अपग्रेड करने के लिए जाएं!";
                            break;
                        case I18NLanguagesEnum.Urdu:
                            content = "آپ کے VIP لیول کو بہتر کرنے کی ضرورت ہے، براہ کرم اپنے VIP لیول کو اپ گریڈ کرنے کے لیے جائیں!";
                            break;
                        case I18NLanguagesEnum.Bengali:
                            content = "আপনার ভিআইপি স্তর উন্নত করা প্রয়োজন, অনুগ্রহ করে আপনার ভিআইপি স্তর আপগ্রেড করতে যান!";
                            break;
                        default:
                            content = "Your VIP level needs to be improved, please go to upgrade your VIP level!";
                            break;
                    };
                    CommonFun.getInstance().showWithDrawTips("Go upgrade", content, () => {
                        CommonFun.getInstance().decVerticalAcc();
                        this.node.destroy();
                        CommonFun.getInstance().showMyVip();
                    });
                }
                else {
                    this.sendWithDrawReq();
                };
            }
            else {
                if (GlobalCfg.USER_DATAS.remainWithdrawCount > 0) {
                    this.sendWithDrawReq();
                }
                else {
                    CommonFun.getInstance().showTips('Withdrawal count be not enough!');
                };
            }
        }
    },


    sendWithDrawReq: function() {
        CommonFun.getInstance().showProgress();
        let amount = this.selectedItemData.price;
        let httpUrl = `${GlobalCfg.HTTP_SERVER}/v1/payment/apply_take_profit`;
        let httpParam = {
            "amount": amount * 100,
            "way": 1,
        };
        CommonFun.getInstance().httpPost(httpUrl, httpParam, (msg) => {
            CommonFun.getInstance().hidProgress();
            let strTip = '';
            if (msg.result == 0) {
                let error = msg.data.error;
                if (error && error.status == 1) {
                    strTip = `Total Bet : ${error.total_bet / 100} \nNeed Bet : ${error.need_bet / 100} \nAlready withdrawn : ${error.withdrawal_amount / 100}`;
                    if (CommonFun.getInstance().isValidForScr(this)) {
                        CommonFun.getInstance().showWithDrawTips("Okay", strTip, null,  40, 70);
                    };
                    return;
                }
                else{
                    let languagesType = I18NUtil.getInstance().getLanguageType();
                    switch (languagesType) {
                        case I18NLanguagesEnum.English:
                            strTip = "Cash withdrawal application succeeded, please wait!";
                            break;
                        case I18NLanguagesEnum.Hindi:
                            strTip = "नकद निकासी आवेदन सफल हुआ, कृपया प्रतीक्षा करें!";
                            break;
                        case I18NLanguagesEnum.Urdu:
                            strTip = "نقد رقم نکالنے کی درخواست کامیاب، براہ کرم انتظار کریں!";
                            break;
                        case I18NLanguagesEnum.Bengali:
                            strTip = "নগদ উত্তোলনের আবেদন সফল হয়েছে, অনুগ্রহ করে অপেক্ষা করুন!";
                            break;
                        default:
                            strTip = "Cash withdrawal application succeeded, please wait!";
                            break;
                    };
                    this.isWithdrawSuccess = true;
                    if (CommonFun.getInstance().isOpenVipModule()) {
                        GlobalCfg.USER_DATAS.userVip.day_withdraw_count += 1;
                        GlobalCfg.USER_DATAS.userVip.withdraw_total += amount;
                    }
                    else {
                        GlobalCfg.USER_DATAS.remainWithdrawCount -= 1; 
                    };
                    
                    GlobalCfg.HAVE_WITHDRAW = true;
                    GlobalCfg.USER_DATAS.userDiamond = msg.data.wallet.amount;
                    GlobalCfg.USER_DATAS.deposit = msg.data.wallet.deposit;
                    GlobalCfg.USER_DATAS.winnings = msg.data.wallet.winnings;
                    GlobalCfg.USER_DATAS.undraw = msg.data.wallet.undraw;
                    GlobalCfg.USER_DATAS.bonus = msg.data.wallet.voucher;

                    if (CommonFun.getInstance().isValidForScr(this)) {
                        this.setLabsData();
                    };
                }
            } 
            else {
                this.isWithdrawSuccess = false;
                strTip = msg.msg;
            };

            if (CommonFun.getInstance().isValidForScr(this)) {
                CommonFun.getInstance().showWithDrawTips("Okay", strTip, () => {
                    if (this.isWithdrawSuccess == true) {
                        CommonFun.getInstance().showWithDrawShare();
                        this.isWithdrawSuccess = false;
                    };
                });
            };
        }, null, GlobalCfg.USER_DATAS.BearerToken);
    },


    addWithDrawItems: function(arr, itemPrefab) {
        let children = this.node_withDrawItemContent.children;
        for (let i = 0, len = children.length; i < len; i++) {
            const node = children[i];
            node.destroy();
        };

        let len = arr.length;
        if (len == 0) {
            return;
        };

        arr = arr.sort((a, b) => {
            let value1 = a["price"];
            let value2 = b["price"];
            return value1 - value2;
        });

        let index = 0;
        let addItem = () => {
            let withDrawItemData = arr[index];

            let withDrawItemNode = cc.instantiate(itemPrefab);
            this.node_withDrawItemContent.addChild(withDrawItemNode);
            let withDrawItemCtrl = withDrawItemNode.getComponent("WithDrawItemCtrl");
            withDrawItemCtrl.setWithDrawItemData(withDrawItemData);
            withDrawItemCtrl.setWithDrawItemChecked(index == 0);
         
            index += 1;
            if (index == len) {
                this.unschedule(addItem);
                return;
            }; 
        };
        this.schedule(addItem, 1/cc.game.getFrameRate(), len - 1, 0);
    },
});
