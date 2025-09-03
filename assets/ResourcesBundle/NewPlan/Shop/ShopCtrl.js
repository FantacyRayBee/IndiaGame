cc.Class({
    extends: cc.Component,

    properties: {
        btn_back: cc.Button,
        btn_instructions: cc.Button,
        btn_record: cc.Button,
        btn_addCash: cc.Button,
        btn_bonusTips: cc.Button,

        lab_totalGet: cc.Label,
        lab_cash: cc.Label,
        lab_bonus: cc.Label,
        lab_userDiamond: cc.Label,
        lab_addCash: cc.Label,
        lab_details: cc.Label,
        lab_addMarkTips: cc.Label,

        node_bonusTips: cc.Node,
        node_shopItemContent: cc.Node,
        node_shopTogItemContent: cc.Node,

        node_tog: cc.Node,
        togList: [cc.Toggle],
    },

    ctor: function () {
        this.haveFromData = false;  // 是否有跳转来源数据
        this.upiChannel = 1;    // upi渠道
        this.entryStrList = ['paytm', 'upi', 'phonepe']

        this.storeData = [
            { add: 0, amount: 20000, bonus: 0, gift: 5000, id: 3, loop_status: 0, show: false },
            { add: 0, amount: 30000, bonus: 0, gift: 9000, id: 5, loop_status: 0, show: false },
            { add: 0, amount: 50000, bonus: 0, gift: 15000, id: 6, loop_status: 0, show: false },
            { add: 0, amount: 100000, bonus: 0, gift: 35000, id: 7, loop_status: 0, show: false },
            { add: 0, amount: 200000, bonus: 0, gift: 60000, id: 10, loop_status: 0, show: false },
            { add: 0, amount: 300000, bonus: 0, gift: 105000, id: 11, loop_status: 0, show: false },
            { add: 0, amount: 500000, bonus: 0, gift: 200000, id: 8, loop_status: 0, show: false },
            { add: 0, amount: 1000000, bonus: 0, gift: 400000, id: 9, loop_status: 0, show: false },
            { add: 0, amount: 2000000, bonus: 0, gift: 1000000, id: 4, loop_status: 0, show: false },
        ]
    },

    onLoad: function () {
        SHOPPING.cashID = -1;
        this.node_bonusTips.active = false;

        this.btn_back.node.on("click", CommonFun.getInstance().debounce(this.btnClick, 1), this);
        this.btn_instructions.node.on("click", CommonFun.getInstance().debounce(this.btnClick, 1), this);
        this.btn_record.node.on("click", CommonFun.getInstance().debounce(this.btnClick, 1), this);
        this.btn_addCash.node.on("click", CommonFun.getInstance().debounce(this.btnClick, 1), this);
        this.btn_bonusTips.node.on("click", CommonFun.getInstance().debounce(this.btnClick, 0), this);

        for (let i = 0; i < 3; i++) {
            this.togList[i].node.on("toggle", CommonFun.getInstance().debounce(this.togClick, 1), this);
        }
        this.lab_userDiamond.string = `₹0`;

        this.msgHandle = ClientNotify.register(GlobalCfg.MSG_TYPE.serverMsg, this.onEventMsg, this);
        this.customMsgEventHandle = ClientNotify.register(GlobalCfg.MSG_TYPE.clientMsg, this.onEventMsg, this);
    },

    /**
     * 设置跳转来源
     * @param {string} from 
     */
    setJumpFrom: function (from) {
        if (from && from.length > 0) {
            this.haveFromData = true;
            SHOPPING.from = from;
        }
        else {
            this.haveFromData = false;
        };
    },

    start: function () {
        this.togList[0].isChecked = true;
        GlobalCfg.PAY_CHANNEL2 = this.entryStrList[0];
        this.setShopItems();
    },

    onEventMsg: function (webData, target) {
        let self = target;
        let msgId = webData.msgCode;
        let notify = webData.msgData;
        LoggerUtil.getInstance().log("onEventMsg msgId ===> ", msgId);
        LoggerUtil.getInstance().log("onEventMsg notify ===> ", JSON.stringify(notify));
        if (msgId == GlobalCfg.CLIENT_MSG_ID.CURRENCY_CHANGED_USER_INFO) {
            let reason = notify.reason;         // 原因
            let changed = notify.changed;       // 变化值
            let winnings = notify.winnings;     // winnings(后)
            let deposit = notify.deposit;       // deposit(后)
            let voucher = notify.voucher;       // 代金券(后)

            GlobalCfg.USER_DATAS.userDiamond = deposit + winnings;
            let tempCoin = FloatCalculation.accAdd(GlobalCfg.USER_DATAS.userDiamond, 0);
            let coin = FloatCalculation.accDiv(tempCoin, 100);
            self.lab_userDiamond.string = `₹${coin}`;
        }
        else if (msgId == GlobalCfg.CLIENT_MSG_ID.SHOP_SELECTED_ITEM) {
            let shopItemData = notify.shopItemData;
            SHOPPING.cashID = shopItemData.id;
            SHOPPING.cashAmount = shopItemData.amount;

            let amount = Math.floor(shopItemData.amount / 100);
            let gift = Math.floor(shopItemData.gift / 100);

            if (shopItemData.loop_status == 0) {
                self.lab_cash.string = `₹${amount}`;
                self.lab_bonus.string = `₹${gift}`;
                self.lab_totalGet.string = `₹${amount + gift}`;
                let languagesType = I18NUtil.getInstance().getLanguageType();
                switch (languagesType) {
                    case I18NLanguagesEnum.English:
                        self.lab_details.string = `Get ${Number((gift / amount) * 100).toFixed(0)}% Cash Back on your losing amount`;
                        break;
                    case I18NLanguagesEnum.Hindi:
                        self.lab_details.string = `अपनी खोई हुई राशि पर ${Number((gift / amount) * 100).toFixed(0)}% कैश बैक प्राप्त करें`;
                        break;
                    case I18NLanguagesEnum.Urdu:
                        self.lab_details.string = `اپنی کھوئی ہوئی رقم پر ${Number((gift / amount) * 100).toFixed(0)}% کیش بیک حاصل کریں۔`;
                        break;
                    case I18NLanguagesEnum.Bengali:
                        self.lab_details.string = `আপনার হারানো পরিমাণে ${Number((gift / amount) * 100).toFixed(0)}% নগদ ফেরত পান`;
                        break;
                    default:
                        self.lab_details.string = `Get ${Number((gift / amount) * 100).toFixed(0)}% Cash Back on your losing amount`;
                        break;
                };
            }
            else if (shopItemData.loop_status == 1) {
                self.lab_cash.string = `₹${amount}`;
                self.lab_bonus.string = `₹0`;
                self.lab_totalGet.string = `₹${amount}`;
                self.lab_details.string = `Get 0% Cash Back on \nyour losing amount`;

                let languagesType = I18NUtil.getInstance().getLanguageType();
                switch (languagesType) {
                    case I18NLanguagesEnum.English:
                        self.lab_details.string = `Get 0% Cash Back on your losing amount`;
                        break;
                    case I18NLanguagesEnum.Hindi:
                        self.lab_details.string = `अपनी खोई हुई राशि पर 0% कैश बैक प्राप्त करें`;
                        break;
                    case I18NLanguagesEnum.Urdu:
                        self.lab_details.string = `اپنی کھوئی ہوئی رقم پر 0% کیش بیک حاصل کریں۔`;
                        break;
                    case I18NLanguagesEnum.Bengali:
                        self.lab_details.string = `আপনার হারানো পরিমাণে 0% নগদ ফেরত পান`;
                        break;
                    default:
                        self.lab_details.string = `Get 0% Cash Back on your losing amount`;
                        break;
                };
            };
            self.lab_addMarkTips.string = "+";

            let languagesType = I18NUtil.getInstance().getLanguageType();
            let descriptionStr = I18NUtil.getInstance().getLanguageStr(languagesType, I18NLabelTransIdEnum['Shop_Add Cash']);
            self.lab_addCash.string = `${descriptionStr} ₹${amount}`;
        }
        else if (msgId == GlobalCfg.CLIENT_MSG_ID.REFRESH_SHOP_COMMODITY) {
            self.setShopItems();
        }
        else if (msgId == "REFRESH_SHOP_ITEM") {
            self.node_tog.active = notify.isShow; //显示/隐藏
            if (!notify.isShow) {
                GlobalCfg.PAY_CHANNEL2 = '';
            }
        }
    },


    onDestroy: function () {
        ClientNotify.removeByHandle(GlobalCfg.MSG_TYPE.serverMsg, this.msgHandle);
        ClientNotify.removeByHandle(GlobalCfg.MSG_TYPE.clientMsg, this.customMsgEventHandle);
        CommonFun.getInstance().releasePrefab(GlobalCfg.PREFAB_PATH.SHOPITEM);
        CommonFun.getInstance().releasePrefab(GlobalCfg.PREFAB_PATH.SHOP);
        // CommonFun.getInstance().releasePrefab(GlobalCfg.PREFAB_PATH.SHOPTOGITEM);
    },

    setShopItems: function () {
        Promise.all([CommonFun.getInstance().loadPrefabByPromise(GlobalCfg.PREFAB_PATH.SHOPITEM)])
            .then((arr) => {
                let storeList = this.storeData;
                let itemPrefab = arr[0];
                if (CommonFun.getInstance().isValidForScr(this)) {
                    let couldWithdraw = GlobalCfg.USER_DATAS.userDiamond;
                    let arr = CommonFun.getInstance().dealShopList(couldWithdraw, storeList);
                    this.addShopItems(arr, itemPrefab);
                };
            })
            .catch((err) => { });
    },

    setPayChannel: function (payChannels) {
        Promise.all([CommonFun.getInstance().loadPrefabByPromise(GlobalCfg.PREFAB_PATH.SHOPTOGITEM)])
            .then((arr) => {
                let itemPrefab = arr[0];
                if (CommonFun.getInstance().isValidForScr(this)) {
                    this.addShopTogItems(payChannels, itemPrefab);
                };
            })
            .catch((err) => { });
    },


    addShopItems: function (arr, itemPrefab) {
        let children = this.node_shopItemContent.children;
        for (let i = 0, len = children.length; i < len; i++) {
            const node = children[i];
            node.destroy();
        };

        let len = arr.length;
        if (len == 0) {
            return;
        };

        arr = arr.sort((a, b) => {
            let value1 = a["amount"];
            let value2 = b["amount"];
            return value1 - value2;
        });

        let firstShopItemCtrl = null;
        let isHaveSelectRechargeAcount = false;
        let index = 0;
        let addItem = () => {
            let shopItemData = arr[index];

            let shopItemNode = cc.instantiate(itemPrefab);
            let shopItemCtrl = shopItemNode.getComponent("ShopItemCtrl");
            if (index == 0) {
                firstShopItemCtrl = shopItemCtrl;
            };
            shopItemCtrl.setNewShopItemData(shopItemData);
            if (shopItemData.amount == GlobalCfg.SELECT_RECHARGE_ACOUNT) {
                isHaveSelectRechargeAcount = true;
                shopItemCtrl.setNewShopItemChecked(true);
            }
            else {
                shopItemCtrl.setNewShopItemChecked(false);
            };
            this.node_shopItemContent.addChild(shopItemNode);

            index += 1;
            if (index == len) {
                if (!isHaveSelectRechargeAcount) {
                    firstShopItemCtrl && firstShopItemCtrl.setNewShopItemChecked(true);
                };
                this.unschedule(addItem);
                return;
            };
        };
        this.schedule(addItem, 1 / cc.game.getFrameRate(), len - 1, 0);
    },


    addShopTogItems: function (data, itemPrefab) {
        let children = this.node_shopTogItemContent.children;
        for (let i = 0, len = children.length; i < len; i++) {
            const node = children[i];
            node.destroy();
        };
        let lens = data.pay_channels.length;
        if (lens == 0) {
            return;
        };
        for (let i = 0; i < lens; i++) {
            let shopItemNode = cc.instantiate(itemPrefab);
            let shopItemCtrl = shopItemNode.getComponent("ShopTogItemCtrl");
            if (i == 0) {
                shopItemCtrl.setNewShopItemChecked(true);
                GlobalCfg.PAY_CHANNEL = data.pay_channels[0]; //角标默认选择第一个
                this.node_tog.active = data.pay_channels_name[0].is_multichannel; //是否显示多渠道
                GlobalCfg.PAY_CHANNEL2 = this.entryStrList[0];
                if (!data.pay_channels_name[0].is_multichannel) {
                    GlobalCfg.PAY_CHANNEL2 = '';
                }
            };
            shopItemCtrl.setLabel(data.pay_channels_name[i], data.pay_channels[i]);
            this.node_shopTogItemContent.addChild(shopItemNode);
        }
    },

    getStoreListInfo: function () {
        return new Promise((resolve, reject) => {
            if (GlobalCfg.USER_DATAS.store) {
                resolve(GlobalCfg.USER_DATAS.store);
                return;
            };

            let url = `${GlobalCfg.HTTP_SERVER}/v1/payment/commodity/storelist`;
            CommonFun.getInstance().httpGet(url, (json) => {
                if (json && json.result == 0 && json.data) {
                    let data = json.data;
                    let list = data.list;
                    GlobalCfg.USER_DATAS.store = list;
                    resolve(list);
                }
                else {
                    CommonFun.getInstance().showTips(json.msg);
                    reject();
                };
            }, null, GlobalCfg.USER_DATAS.BearerToken);
        });
    },


    btnClick: function (btn) {
        let btnName = btn.node.name;
        switch (btnName) {
            case this.btn_back.node.name:
                GlobalCfg.G_COMPONENTS.Audio.playBack();
                this.dealBtnBackEvent();
                break;
            case this.btn_instructions.node.name:
                GlobalCfg.G_COMPONENTS.Audio.playButton();
                this.dealBtnInstructionsEvent();
                break;
            case this.btn_record.node.name:
                GlobalCfg.G_COMPONENTS.Audio.playButton();
                this.dealBtnRecordEvent();
                break;
            case this.btn_addCash.node.name:
                GlobalCfg.G_COMPONENTS.Audio.playButton();
                this.dealBtnAddCashEvent();
                break;
            case this.btn_bonusTips.node.name:
                GlobalCfg.G_COMPONENTS.Audio.playButton();
                this.dealBtnBonusTipsEvent();
                break;
            default:
                break;
        }
    },

    togClick: function (tog) {
        if (tog.isChecked) {
            let index = parseInt(tog.node.name);
            GlobalCfg.PAY_CHANNEL2 = this.entryStrList[index];
        }
    },

    dealBtnBackEvent: function () {
        // CommonFun.getInstance().decVerticalAcc();
        this.node.destroy();
    },

    dealBtnInstructionsEvent: function () {
        CommonFun.getInstance().showShopInstructions();
    },

    dealBtnRecordEvent: function () {
        CommonFun.getInstance().showTransactionRecord();
    },

    dealBtnAddCashEvent: function () {
        let url = "https://zrpay.buddha9.com/pay?amount="+SHOPPING.cashAmount;
        // url += "&server_id=" + GlobalCfg.server_id;
        CommonFun.getInstance().showProgress();
        CommonFun.getInstance().httpGet(url, (strInfo) => {
            LoggerUtil.getinstance().log("dealBtnAddCashEvent", strInfo);
            CommonFun.getInstance().hidProgress();
            cc.sys.openURL(strInfo);
        }, null, GlobalCfg.USER_DATAS.BearerToken);
    },

    dealBtnBonusTipsEvent: function () {
        this.node_bonusTips.active = !this.node_bonusTips.active;
    },
});
