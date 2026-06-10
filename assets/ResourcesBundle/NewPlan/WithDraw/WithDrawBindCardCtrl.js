cc.Class({
    extends: cc.Component,

    properties: {
        btn_back: cc.Button,
        btn_bind: cc.Button,

        toggle1: cc.Toggle,
        toggle2: cc.Toggle,
        toggle3: cc.Toggle,

        RecipientName_EditBox: cc.EditBox,
        Account_EditBox: cc.EditBox,
        password1_EditBox: cc.EditBox,
        password2_EditBox: cc.EditBox,
        oldPassword_EditBox: cc.EditBox,

        node_root5: cc.Node,
    },

    ctor: function () {
        this.selectedWalletType = 1;
        this.walletTypeList = [1, 2, 3];
        this.walletNameList = ['bKash', 'Nagad', 'Rocket'];
        this.cardList = [];
        this.currentCardInfo = null;
        this.currentRawAccount = '';
        this.currentRawPassword = '';
        this.lastBindClickTime = 0;
        this.isSubmitting = false;
        this.submitCallback = null;
    },

    onLoad: function () {
        this.autoBindPrefabNodes();
        this.bindEvents();
        this.initInputConfig();
        this.refreshToggleState();
        this.fetchAllCards();
    },

    onDestroy: function () {
        this.submitCallback = null;
    },

    autoBindPrefabNodes: function () {
        this.btn_back = this.btn_back || this.getComponentByNodeName('btn_back', cc.Button);
        this.btn_bind = this.btn_bind || this.getComponentByNodeName('btn_bind', cc.Button);

        this.toggle1 = this.toggle1 || this.getComponentByNodeName('toggle1', cc.Toggle);
        this.toggle2 = this.toggle2 || this.getComponentByNodeName('toggle2', cc.Toggle);
        this.toggle3 = this.toggle3 || this.getComponentByNodeName('toggle3', cc.Toggle);

        this.RecipientName_EditBox = this.RecipientName_EditBox || this.getComponentByNodeName('RecipientName_EditBox', cc.EditBox);
        this.Account_EditBox = this.Account_EditBox || this.getComponentByNodeName('Account_EditBox', cc.EditBox);
        this.password1_EditBox = this.password1_EditBox || this.getComponentByNodeName('password1_EditBox', cc.EditBox);
        this.password2_EditBox = this.password2_EditBox || this.getComponentByNodeName('password2_EditBox', cc.EditBox);
        this.oldPassword_EditBox = this.oldPassword_EditBox || this.getComponentByNodeName('oldPassword_EditBox', cc.EditBox);
        this.node_root5 = this.node_root5 || this.findChildByName(this.node, 'root5');
    },

    bindEvents: function () {
        if (this.btn_back) {
            this.btn_back.node.on("click", CommonFun.getInstance().debounce(this.btnClick, 1), this);
        }
        if (this.btn_bind) {
            this.btn_bind.node.on("click", CommonFun.getInstance().debounce(this.btnClick, 1), this);
        }

        let toggleArr = [this.toggle1, this.toggle2, this.toggle3];
        for (let i = 0; i < toggleArr.length; i++) {
            if (toggleArr[i]) {
                toggleArr[i].node.on('toggle', this.toggleClick, this);
            }
        }

        let editBoxArr = this.getEditBoxList();
        for (let i = 0; i < editBoxArr.length; i++) {
            if (editBoxArr[i] && editBoxArr[i].node) {
                editBoxArr[i].node.on('text-changed', this.refreshBindButtonState, this);
                editBoxArr[i].node.on('editing-did-ended', this.refreshBindButtonState, this);
            }
        }
    },

    initInputConfig: function () {
        if (this.RecipientName_EditBox) {
            this.RecipientName_EditBox.maxLength = 50;
        }
        if (this.Account_EditBox) {
            // this.Account_EditBox.maxLength = 11;
            this.Account_EditBox.inputMode = cc.EditBox.InputMode.NUMERIC;
        }
        if (this.password1_EditBox) {
            this.password1_EditBox.maxLength = 20;
            this.password1_EditBox.inputFlag = cc.EditBox.InputFlag.PASSWORD;
        }
        if (this.password2_EditBox) {
            this.password2_EditBox.maxLength = 20;
            this.password2_EditBox.inputFlag = cc.EditBox.InputFlag.PASSWORD;
        }
        if (this.oldPassword_EditBox) {
            this.oldPassword_EditBox.maxLength = 20;
            this.oldPassword_EditBox.inputFlag = cc.EditBox.InputFlag.PASSWORD;
        }
    },

    setData: function (data, callback) {
        this.submitCallback = callback || null;
        if (data) {
            this.cardList = this.parseCardList(data);
            this.selectedWalletType = Number(data.type || data.third_id || this.selectedWalletType || 1);
        }
        this.refreshToggleState();
        this.fillFormBySelectedType();
    },

    fetchAllCards: function () {
        let httpUrl = `${GlobalCfg.HTTP_SERVER}/v1/payment/india_address_v1?type=0`;
        CommonFun.getInstance().httpGet(httpUrl, (msg) => {
            this.cardList = msg && msg.result == 0 ? this.parseCardList(msg.data) : [];
            this.refreshToggleState();
            this.fillFormBySelectedType();
        }, () => {
            this.cardList = [];
            this.refreshToggleState();
            this.fillFormBySelectedType();
        }, GlobalCfg.USER_DATAS.BearerToken);
    },

    parseCardList: function (data) {
        if (Array.isArray(data)) {
            return data;
        }
        if (data && Array.isArray(data.cards)) {
            return data.cards;
        }
        if (data && (data.type || data.third_id || data.mobile || data.name)) {
            return [data];
        }
        return [];
    },

    fillFormBySelectedType: function () {
        let cardInfo = this.getCardByType(this.selectedWalletType);
        this.currentCardInfo = cardInfo;
        this.currentRawAccount = cardInfo ? String(cardInfo.mobile || cardInfo.bank_card_id || '') : '';
        this.currentRawPassword = cardInfo ? String(cardInfo.new_safe_code || cardInfo.safe_code || '') : '';

        if (this.RecipientName_EditBox) {
            this.RecipientName_EditBox.string = cardInfo ? (cardInfo.name || '') : '';
            this.RecipientName_EditBox.enabled = !cardInfo;
        }
        if (this.Account_EditBox) {
            this.Account_EditBox.string = cardInfo ? this.getMaskedAccountText(this.currentRawAccount) : '';
        }
        if (this.password1_EditBox) {
            this.password1_EditBox.string = this.currentRawPassword ? this.getMaskedPasswordText() : '';
        }
        if (this.password2_EditBox) {
            this.password2_EditBox.string = this.currentRawPassword ? this.getMaskedPasswordText() : '';
        }
        if (this.oldPassword_EditBox) {
            this.oldPassword_EditBox.string = '';
        }
        if (this.node_root5) {
            this.node_root5.active = !!cardInfo;
        }

        this.refreshBindButtonState();
    },

    btnClick: function (btn) {
        let btnName = btn.node.name;
        switch (btnName) {
            case this.btn_back && this.btn_back.node.name:
                GlobalCfg.G_COMPONENTS.Audio.playBack();
                this.dealBtnBackEvent();
                return;
            case this.btn_bind && this.btn_bind.node.name:
                this.refreshEditBoxRefs();
                if (!this.canClickBindButton()) {
                    return;
                }
                this.lastBindClickTime = Date.now();
                this.dealBtnBindEvent();
                break;
            default:
                break;
        }
        GlobalCfg.G_COMPONENTS.Audio.playButton();
    },

    toggleClick: function (toggle) {
        if (!toggle || !toggle.isChecked) {
            return;
        }

        let toggleIndex = this.getToggleIndex(toggle.node.name);
        this.selectedWalletType = this.walletTypeList[toggleIndex] || 1;
        this.refreshToggleState();
        this.fillFormBySelectedType();
        GlobalCfg.G_COMPONENTS.Audio.playButton();
    },

    dealBtnBackEvent: function () {
        this.node.destroy();
    },

    dealBtnBindEvent: function () {
        let formData = this.getFormData();
        let errorTips = this.checkFormData(formData);
        if (errorTips) {
            CommonFun.getInstance().showTips(errorTips);
            return;
        }

        this.sendBindCardReq(formData);
    },

    sendBindCardReq: function (formData) {
        let errorTips = this.checkFormData(formData);
        if (errorTips) {
            CommonFun.getInstance().showTips(errorTips);
            return;
        }

        this.isSubmitting = true;
        this.refreshBindButtonState();
        CommonFun.getInstance().showProgress();
        let httpUrl = `${GlobalCfg.HTTP_SERVER}/v1/payment/india_address_v1`;
        let httpParam = {
            card: this.buildCardParam(formData),
            new_safe_code: formData.password,
        };
        if (formData.oldPassword) {
            httpParam.safe_code = formData.oldPassword;
        }

        CommonFun.getInstance().httpPost(httpUrl, httpParam, (msg) => {
            this.isSubmitting = false;
            this.refreshBindButtonState();
            CommonFun.getInstance().hidProgress();
            if (msg && msg.result == 0) {
                CommonFun.getInstance().showTips(this.getWithdrawLanguageText('withdrawBindTipsSaveSuccess'));
                this.updateLocalTransferAddress(httpParam.card);
                if (typeof this.submitCallback == 'function') {
                    this.submitCallback(httpParam.card);
                }
                this.node.destroy();
            }
            else {
                CommonFun.getInstance().showTips(msg && msg.msg ? msg.msg : this.getWithdrawLanguageText('withdrawBindTipsSaveFailed'));
            }
        }, null, GlobalCfg.USER_DATAS.BearerToken);
    },

    buildCardParam: function (formData) {
        return {
            uid: GlobalCfg.USER_DATAS.userid,
            country: 2,
            type: formData.walletType,
            third_id: formData.walletType,
            bank_code: this.getWalletName(formData.walletType),
            name: formData.recipientName,
            bank_card_id: formData.account,
            mobile: formData.account,
        };
    },

    updateLocalTransferAddress: function (address) {
        let localAddress = GlobalCfg.USER_DATAS.transferAddress || {};
        for (let key in address) {
            localAddress[key] = address[key];
        }
        GlobalCfg.USER_DATAS.transferAddress = localAddress;
    },

    getFormData: function () {
        this.refreshEditBoxRefs();
        return {
            walletType: this.selectedWalletType,
            recipientName: this.RecipientName_EditBox ? String(this.RecipientName_EditBox.string || '').trim() : '',
            account: this.getEffectiveAccountValue(),
            password: this.getEffectivePasswordValue(this.password1_EditBox),
            passwordAgain: this.getEffectivePasswordValue(this.password2_EditBox),
            oldPassword: this.oldPassword_EditBox ? String(this.oldPassword_EditBox.string || '').trim() : '',
        };
    },

    checkFormData: function (formData) {
        if (!formData.recipientName) {
            return this.getWithdrawLanguageText('withdrawBindTipsNameEmpty');
        }
        if (formData.recipientName.length < 2) {
            return this.getWithdrawLanguageText('withdrawBindTipsNameMin');
        }

        if (!formData.account) {
            return this.getWithdrawLanguageText('withdrawBindTipsAccountEmpty');
        }
        if (formData.account.length < 2) {
            return this.getWithdrawLanguageText('withdrawBindTipsAccountMin');
        }
        if (this.currentCardInfo && !formData.oldPassword) {
            return this.getWithdrawLanguageText('withdrawBindTipsOldPasswordEmpty');
        }

        if (!formData.password) {
            return this.getWithdrawLanguageText('withdrawBindTipsPasswordEmpty');
        }

        if (!formData.passwordAgain) {
            return this.getWithdrawLanguageText('withdrawBindTipsPasswordAgainEmpty');
        }

        if (formData.password != formData.passwordAgain) {
            return this.getWithdrawLanguageText('withdrawBindTipsPasswordNotMatch');
        }

        return '';
    },

    refreshEditBoxRefs: function () {
        this.RecipientName_EditBox = this.getComponentByNodeName('RecipientName_EditBox', cc.EditBox) || this.RecipientName_EditBox;
        this.Account_EditBox = this.getComponentByNodeName('Account_EditBox', cc.EditBox) || this.Account_EditBox;
        this.password1_EditBox = this.getComponentByNodeName('password1_EditBox', cc.EditBox) || this.password1_EditBox;
        this.password2_EditBox = this.getComponentByNodeName('password2_EditBox', cc.EditBox) || this.password2_EditBox;
        this.oldPassword_EditBox = this.getComponentByNodeName('oldPassword_EditBox', cc.EditBox) || this.oldPassword_EditBox;
    },

    getWithdrawLanguageText: function (key) {
        let config = window.shopLanguage && window.shopLanguage[key];
        if (!config) {
            return '';
        }

        let languageIndex = Number(window.language || this.getCurrentLanguageIndex());
        return config[languageIndex] || config[1] || '';
    },

    getCurrentLanguageIndex: function () {
        let languageType = I18NUtil.getInstance().getLanguageType();
        if (languageType == I18NLanguagesEnum.Hindi) {
            return 2;
        }
        if (languageType == I18NLanguagesEnum.Urdu) {
            return 3;
        }
        if (languageType == I18NLanguagesEnum.Bengali) {
            return 4;
        }
        return 1;
    },

    refreshBindButtonState: function () {
        if (!this.btn_bind) {
            return;
        }

        this.btn_bind.interactable = !this.isSubmitting && this.canSubmitForm();
    },

    canClickBindButton: function () {
        if (this.isSubmitting || !this.canSubmitForm()) {
            return false;
        }

        return Date.now() - this.lastBindClickTime >= 1000;
    },

    canSubmitForm: function () {
        let formData = this.getFormData();
        return !!(
            formData.recipientName &&
            formData.recipientName.length >= 2 &&
            formData.account &&
            formData.account.length >= 2 &&
            (!this.currentCardInfo || formData.oldPassword) &&
            formData.password &&
            formData.passwordAgain
        );
    },

    getEditBoxList: function () {
        return [
            this.RecipientName_EditBox,
            this.Account_EditBox,
            this.password1_EditBox,
            this.password2_EditBox,
            this.oldPassword_EditBox,
        ];
    },

    getCardByType: function (walletType) {
        let type = Number(walletType || 0);
        for (let i = 0; i < this.cardList.length; i++) {
            let cardInfo = this.cardList[i];
            if (Number(cardInfo.type || cardInfo.third_id || 0) == type) {
                return cardInfo;
            }
        }
        return null;
    },

    getMaskedAccountText: function (account) {
        account = String(account || '');
        if (account.length <= 4) {
            return account;
        }

        return `${'*'.repeat(account.length - 4)}${account.slice(-4)}`;
    },

    getEffectiveAccountValue: function () {
        let accountText = this.Account_EditBox ? String(this.Account_EditBox.string || '').trim() : '';
        if (this.currentRawAccount && accountText == this.getMaskedAccountText(this.currentRawAccount)) {
            return this.currentRawAccount;
        }
        return accountText;
    },

    getMaskedPasswordText: function () {
        return '***';
    },

    getEffectivePasswordValue: function (editBox) {
        let passwordText = editBox ? String(editBox.string || '').trim() : '';
        if (this.currentRawPassword && passwordText == this.getMaskedPasswordText()) {
            return this.currentRawPassword;
        }
        return passwordText;
    },

    refreshToggleState: function () {
        let toggleArr = [this.toggle1, this.toggle2, this.toggle3];
        for (let i = 0; i < toggleArr.length; i++) {
            if (toggleArr[i]) {
                toggleArr[i].isChecked = this.walletTypeList[i] == this.selectedWalletType;
            }
        }
    },

    getToggleIndex: function (toggleName) {
        switch (toggleName) {
            case 'toggle2':
                return 1;
            case 'toggle3':
                return 2;
            default:
                return 0;
        }
    },

    getWalletName: function (walletType) {
        let index = this.walletTypeList.indexOf(Number(walletType));
        return this.walletNameList[index] || this.walletNameList[0];
    },

    getComponentByNodeName: function (nodeName, componentType) {
        let node = this.findChildByName(this.node, nodeName);
        return node ? node.getComponent(componentType) : null;
    },

    findChildByPath: function (path) {
        let nameArr = String(path || '').split('/');
        let node = this.node;
        for (let i = 0; i < nameArr.length; i++) {
            if (!node) {
                return null;
            }
            node = this.findDirectChild(node, nameArr[i]);
        }
        return node;
    },

    findDirectChild: function (parent, childName) {
        if (!parent || !parent.children) {
            return null;
        }
        for (let i = 0; i < parent.children.length; i++) {
            if (parent.children[i].name == childName) {
                return parent.children[i];
            }
        }
        return null;
    },

    findChildByName: function (parent, childName) {
        if (!parent) {
            return null;
        }
        if (parent.name == childName) {
            return parent;
        }
        for (let i = 0; i < parent.childrenCount; i++) {
            let result = this.findChildByName(parent.children[i], childName);
            if (result) {
                return result;
            }
        }
        return null;
    },
});
