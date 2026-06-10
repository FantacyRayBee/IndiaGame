cc.Class({
    extends: cc.Component,

    properties: {
        btn_back: cc.Button,
        btn_instructions: cc.Button,
        btn_record: cc.Button,
        btn_addCard: cc.Button,
        btn_empty: cc.Button,
        btn_withdraw: cc.Button,
        btn_refresh: cc.Button,
        btn_eyes: cc.Button,
        btn_eyes_none: cc.Button,
        btn_card_info: cc.Button,

        toggle1: cc.Toggle,
        toggle2: cc.Toggle,
        toggle3: cc.Toggle,

        lab_wallect: cc.Label,
        node_card_empty: cc.Node,
        node_card_info: cc.Node,

        // Prefab node name is lab_my_account; keep the old property name to avoid breaking existing bindings.
        lab_my_cardAccount: cc.Label,
        lab_my_bindTime: cc.Label,

        lab_withdraw_time: cc.Label,
        lab_withdraw_limit: cc.Label,
        lab_withdraw_remain: cc.Label,

        lab_WalletBalance: cc.Label,
        lab_WithdrawableBalance: cc.Label,

        editBox_with_amount: cc.EditBox,
        editBox_password: cc.EditBox,

    },

    ctor: function () {
        this.selectedItemData = null;
        this.isWithdrawSuccess = false;
        this.NowToggleName = 'toggle1';
        this.selectedWithdrawWay = 1;
        this.selectedCardType = 0;
        // 3个toggle常驻，通道固定映射：toggle1->1, toggle2->2, toggle3->4
        this.withdrawWayList = [1, 2, 4];
        this.indiaAddressV1Cards = [];
    },

    onLoad: function () {
        this.bindButtonEvents();
        this.bindToggleEvents();
        this.bindInputEvents();
        this.refreshWithdrawButtonState();
        this.customMsgEventHandle = ClientNotify.register(GlobalCfg.MSG_TYPE.clientMsg, this.onEventMsg, this);
    },

    start: function () {
        this.initView();
    },

    onDestroy: function () {
        ClientNotify.removeByHandle(GlobalCfg.MSG_TYPE.clientMsg, this.customMsgEventHandle);
    },

    onEventMsg: function (webData, target) {
        let self = target;
        if (webData.msgCode != GlobalCfg.CLIENT_MSG_ID.WITHDRAW_SELECTED_ITEM) {
            return;
        }

        self.selectedItemData = webData.msgData.itemData;
        if (self.editBox_with_amount && !self.editBox_with_amount.string) {
            self.editBox_with_amount.string = self.formatAmountForEditBox(self.selectedItemData.price);
            self.refreshWithdrawButtonState();
        }
    },

    bindButtonEvents: function () {
        // 统一绑定按钮事件，避免 onLoad 里堆一长串 node.on。
        let buttonList = [
            this.btn_back,
            this.btn_instructions,
            this.btn_record,
            this.btn_addCard,
            this.btn_empty,
            this.btn_card_info,
            this.btn_withdraw,
            this.btn_refresh,
            this.btn_eyes,
            this.btn_eyes_none,
        ];

        for (let i = 0; i < buttonList.length; i++) {
            if (buttonList[i]) {
                buttonList[i].node.on("click", CommonFun.getInstance().debounce(this.btnClick, 1), this);
            }
        }
    },

    bindToggleEvents: function () {
        // 三个 toggle 对应不同提现通道，实际显示数量由后端返回的通道列表决定。
        let toggleList = [this.toggle1, this.toggle2, this.toggle3];
        for (let i = 0; i < toggleList.length; i++) {
            if (toggleList[i]) {
                toggleList[i].node.on('toggle', this.toggleClick, this);
            }
        }
    },

    bindInputEvents: function () {
        if (this.editBox_with_amount && this.editBox_with_amount.node) {
            this.editBox_with_amount.node.on('text-changed', this.refreshWithdrawButtonState, this);
            this.editBox_with_amount.node.on('editing-did-ended', this.fixWithdrawAmountRange, this);
        }
        if (this.editBox_password && this.editBox_password.node) {
            this.editBox_password.node.on('text-changed', this.refreshWithdrawButtonState, this);
            this.editBox_password.node.on('editing-did-ended', this.refreshWithdrawButtonState, this);
        }
    },

    /**
     * 先用本地登录数据兜底刷新 UI，再拉取 v1 钱包账户列表覆盖展示。
     */
    initView: function () {
        this.setPasswordVisible(false);
        this.refreshWithdrawButtonState();
        this.initWithdrawWayConfig();
        this.refreshPanelByToggleName(this.NowToggleName);
        this.fetchCardsAndRefresh();
    },

    btnClick: function (btn) {
        let btnName = btn.node.name;
        switch (btnName) {
            case this.btn_back.node.name:
                GlobalCfg.G_COMPONENTS.Audio.playBack();
                this.closeView();
                return;
            case this.btn_instructions.node.name:
                this.showShopInstructions();
                break;
            case this.btn_record.node.name:
                CommonFun.getInstance().showTransactionRecord();
                break;
            case this.btn_addCard.node.name:
            case this.btn_empty.node.name:
            case this.btn_card_info.node.name:
                this.openBindCardView();
                break;
            case this.btn_withdraw.node.name:
                if (!this.btn_withdraw.interactable || !this.canSubmitWithdraw()) {
                    return;
                }
                this.dealBtnWithdrawEvent();
                break;
            case this.btn_refresh.node.name:
                this.fillMaxWithdrawAmount();
                break;
            case this.btn_eyes.node.name:
                this.setPasswordVisible(true);
                break;
            case this.btn_eyes_none.node.name:
                this.setPasswordVisible(false);
                break;
            default:
                break;
        }

        GlobalCfg.G_COMPONENTS.Audio.playButton();
    },

    toggleClick: function (toggle) {
        let toggleName = toggle.node.name;
        if (toggleName == this.NowToggleName) {
            return;
        }

        this.NowToggleName = toggleName;
        this.refreshPanelByToggleName(toggleName);
        GlobalCfg.G_COMPONENTS.Audio.playButton();
    },

    closeView: function () {
        // CommonFun.getInstance().decVerticalAcc();
        this.node.destroy();
    },

    openBindCardView: function () {
        // 绑定成功后重新拉取 v1 钱包列表，让新账号立即显示在提现页。
        CommonFun.getInstance().showWithDrawBindCard({ type: this.selectedCardType || this.getSelectedCardType() }, (cardInfo) => {
            let cardType = Number(cardInfo && (cardInfo.type || cardInfo.third_id || 0));
            let toggleName = this.getToggleNameByCardType(cardType);
            if (toggleName) {
                this.NowToggleName = toggleName;
                this.selectedCardType = cardType;
            }
            this.fetchCardsAndRefresh();
        });
    },

    fetchCardsAndRefresh: function () {
        this.fetchIndiaAddressV1Cards(() => {
            this.initWithdrawWayConfig();
            this.refreshPanelByToggleName(this.NowToggleName);
        });
    },

    fillMaxWithdrawAmount: function () {
        this.refreshBalanceInfo();
        this.refreshWithdrawButtonState();
    },

    showShopInstructions: function () {
        let str = GlobalCfg.USER_DATAS.web_customer_service;
        str += "?userId=" + GlobalCfg.USER_DATAS.userId + "_" + (GlobalCfg.USER_DATAS.recharged / 100) + "_" + (GlobalCfg.USER_DATAS.allWithdraw / 100);
        str += "&nickname=" + GlobalCfg.USER_DATAS.userName;
        str += "&mobile=" + (GlobalCfg.USER_DATAS.phone || '');
        str += "&email=" + (GlobalCfg.USER_DATAS.mail || '');
        LoggerUtil.getInstance().log('btn_service str:', str);
        cc.sys.openURL(str);
    },

    dealBtnWithdrawEvent: function () {
        // 提现校验顺序：账号 -> 金额 -> 安全码 -> 钱包类型 -> 可提现余额。
        // 顺序越靠前的问题越基础，优先提示能减少不必要的接口请求。
        let transferAddress = this.getSelectedCardInfo();
        if (!this.hasTransferCard(transferAddress)) {
            CommonFun.getInstance().showTips(this.getLocalizedText('pleaseAddCard'));
            this.openBindCardView();
            return;
        }

        let withdrawAmount = this.getWithdrawAmount();
        let amountCent = Math.round(withdrawAmount * 100);
        if (amountCent <= 0) {
            CommonFun.getInstance().showTips(this.getLocalizedText('pleaseInputAmount'));
            return;
        }

        let safeCode = this.getSafeCode();
        if (!safeCode) {
            CommonFun.getInstance().showTips(this.getLocalizedText('pleaseInputSafeCode'));
            return;
        }

        if (this.selectedCardType <= 0) {
            CommonFun.getInstance().showTips(this.getLocalizedText('pleaseAddCard'));
            return;
        }

        if (!this.canWithdrawAmount(amountCent)) {
            CommonFun.getInstance().showTips(this.getLocalizedText('winningCashNotEnough'));
            return;
        }

        this.sendWithDrawReq(withdrawAmount, safeCode);
    },

    canWithdrawAmount: function (amountCent) {
        let withdrawableBalanceCent = this.getWithdrawableBalanceCent();
        return withdrawableBalanceCent >= 10000 && amountCent >= 10000 && amountCent <= withdrawableBalanceCent;
    },

    /**
     * v1 提现接口必传：
     * amount: 分，way: 当前提现通道，type: 当前钱包类型。
     * safe_code 只有该钱包账户已设置安全码时才传。
     */
    sendWithDrawReq: function (amount, safeCode) {
        CommonFun.getInstance().showProgress();

        let amountCent = Math.round(Number(amount) * 100);
        let httpParam = {
            amount: amountCent,
            way: this.getSelectedWithdrawWayForReq(),
            type: this.selectedCardType,
        };
        if (safeCode) {
            httpParam.safe_code = safeCode;
        }

        CommonFun.getInstance().httpPost(`${GlobalCfg.HTTP_SERVER}/v1/payment/apply_take_profit_v1`, httpParam, (msg) => {
            CommonFun.getInstance().hidProgress();
            this.handleWithdrawResponse(msg, amountCent);
        }, null, GlobalCfg.USER_DATAS.BearerToken);
    },

    handleWithdrawResponse: function (msg, amountCent) {
        // result=0 仍可能带打码量错误，服务端会放在 data.error 里，需要优先弹出说明。
        let strTip = '';
        this.isWithdrawSuccess = false;

        if (msg.result == 0) {
            let error = msg.data && msg.data.error ? msg.data.error : null;
            if (error && error.status == 1) {
                strTip = `Total Bet : ${error.total_bet / 100} \nNeed Bet : ${error.need_bet / 100} \nAlready withdrawn : ${error.withdrawal_amount / 100}`;
                CommonFun.getInstance().showWithDrawTips("Okay", strTip, null, 40, 70);
                return;
            }

            this.isWithdrawSuccess = true;
            strTip = this.getLocalizedText('withdrawSuccess');
            this.updateWithdrawLocalData(msg.data, amountCent);
            this.clearWithdrawInputs();
            this.fetchCardsAndRefresh();
        }
        else {
            strTip = msg.msg;
            if (msg.result == 322 && this.editBox_password) {
                this.editBox_password.string = "";
            }
        }

        this.showWithdrawResultTips(strTip);
    },

    updateWithdrawLocalData: function (data, amountCent) {
        // 请求成功后先同步本地钱包，避免接口刷新完成前页面仍显示旧余额。
        GlobalCfg.HAVE_WITHDRAW = true;
        if (data && data.wallet) {
            GlobalCfg.USER_DATAS.userDiamond = data.wallet.amount;
            GlobalCfg.USER_DATAS.deposit = data.wallet.deposit;
            GlobalCfg.USER_DATAS.winnings = data.wallet.winnings;
            GlobalCfg.USER_DATAS.undraw = data.wallet.undraw;
            GlobalCfg.USER_DATAS.bonus = data.wallet.voucher;
        }
    },

    clearWithdrawInputs: function () {
        if (this.editBox_with_amount) {
            this.editBox_with_amount.string = '';
        }
        if (this.editBox_password) {
            this.editBox_password.string = '';
        }
        this.refreshWithdrawButtonState();
    },

    showWithdrawResultTips: function (strTip) {
        if (!CommonFun.getInstance().isValidForScr(this)) {
            return;
        }

        CommonFun.getInstance().showWithDrawTips("Okay", strTip, () => {
            if (this.isWithdrawSuccess) {
                CommonFun.getInstance().showWithDrawShare();
                this.isWithdrawSuccess = false;
            }
        });
    },

    refreshPanelByToggleName: function (toggleName) {
        let toggleIndex = this.getToggleIndex(toggleName);
        this.selectedWithdrawWay = this.withdrawWayList[toggleIndex] || this.withdrawWayList[0] || 1;
        this.selectedCardType = this.getSelectedCardType();
        this.refreshAllViews();
    },

    refreshAllViews: function () {
        this.refreshCardInfo();
        this.refreshWithdrawInfo();
        this.refreshBalanceInfo();
    },

    /**
     * 从 v1 地址接口拉取所有钱包账户。失败时保留空数组，后续用旧 transferAddress 兜底。
     */
    fetchIndiaAddressV1Cards: function (callback) {
        // type=0 表示查询所有钱包账户；查询失败时不阻塞页面，用旧 transferAddress 兜底。
        let url = `${GlobalCfg.HTTP_SERVER}/v1/payment/india_address_v1?type=0`;
        CommonFun.getInstance().httpGet(url, (msg) => {
            this.indiaAddressV1Cards = msg && msg.result == 0 ? this.parseIndiaAddressV1Cards(msg) : [];
            if (typeof callback === 'function' && CommonFun.getInstance().isValidForScr(this)) {
                callback();
            }
        }, null, GlobalCfg.USER_DATAS.BearerToken);
    },

    parseIndiaAddressV1Cards: function (msg) {
        let data = msg && msg.data ? msg.data : {};
        let cards = Array.isArray(data.cards) ? data.cards : [];
        return cards.filter((item) => {
            return item && (item.type || item.bank_card_id || item.name || item.mobile);
        });
    },

    /**
     * 3个toggle常驻：通道映射固定，不再由服务端返回数量控制显隐。
     */
    initWithdrawWayConfig: function () {
        this.withdrawWayList = [1, 2, 4];
        this.refreshToggleVisible();
        this.syncToggleSelection();
        this.selectedCardType = this.getSelectedCardType();
    },

    refreshToggleVisible: function () {
        let toggleArr = [this.toggle1, this.toggle2, this.toggle3];
        for (let i = 0; i < toggleArr.length; i++) {
            if (toggleArr[i] && toggleArr[i].node) {
                toggleArr[i].node.active = true;
            }
        }
    },

    /**
     * 通道列表变化后，保证当前 toggle 和 selectedWithdrawWay 始终有效。
     */
    syncToggleSelection: function () {
        let toggleNameList = ['toggle1', 'toggle2', 'toggle3'];
        let toggleArr = [this.toggle1, this.toggle2, this.toggle3];
        let currentIndex = this.getToggleIndex(this.NowToggleName);
        let targetIndex = this.withdrawWayList[currentIndex] ? currentIndex : 0;

        this.NowToggleName = toggleNameList[targetIndex] || 'toggle1';
        this.selectedWithdrawWay = this.withdrawWayList[targetIndex] || 1;
        this.selectedCardType = targetIndex + 1;

        for (let i = 0; i < toggleArr.length; i++) {
            if (toggleArr[i] && toggleArr[i].node && toggleArr[i].node.active) {
                toggleArr[i].isChecked = i == targetIndex;
            }
        }
    },

    refreshCardInfo: function () {
        let transferAddress = this.getSelectedCardInfo();
        let hasCard = this.hasTransferCard(transferAddress);
        if (this.node_card_empty) {
            this.node_card_empty.active = !hasCard;
        }
        if (this.node_card_info) {
            this.node_card_info.active = hasCard;
        }
        if (this.lab_my_cardAccount) {
            this.lab_my_cardAccount.string = hasCard ? this.getMaskedCardText(transferAddress) : '';
        }
        if (this.btn_addCard && this.btn_addCard.node) {
            this.btn_addCard.node.active = !hasCard;
        }
        this.refreshWithdrawButtonState();

        if (this.lab_wallect) {
            this.lab_wallect.string = this.getWalletCountText();
        }
    },

    refreshBalanceInfo: function () {
        if (this.lab_WalletBalance) {
            this.lab_WalletBalance.string = CommonFun.getInstance().formatCurrencyAmount(FloatCalculation.accDiv(Number(GlobalCfg.USER_DATAS.userDiamond || 0), 100));
        }

        if (this.lab_WithdrawableBalance) {
            this.lab_WithdrawableBalance.string = CommonFun.getInstance().formatCurrencyAmount(FloatCalculation.accDiv(this.getWithdrawableBalanceCent(), 100));
        }
    },

    refreshWithdrawInfo: function () {
        if (this.lab_withdraw_time) {
            this.lab_withdraw_time.string = '1-7 Days';
        }

        if (this.lab_withdraw_limit) {
            // this.lab_withdraw_limit.string = CommonFun.getInstance().formatCurrencyAmount(FloatCalculation.accDiv(this.getWithdrawLimitCent(), 100));
        }

        if (this.lab_withdraw_remain) {
            // this.lab_withdraw_remain.string = `${this.getRemainWithdrawCount()}`;
        }
    },

    setPasswordVisible: function (isVisible) {
        if (this.btn_eyes && this.btn_eyes.node) {
            this.btn_eyes.node.active = !isVisible;
        }
        if (this.btn_eyes_none && this.btn_eyes_none.node) {
            this.btn_eyes_none.node.active = isVisible;
        }
        if (this.editBox_password) {
            this.editBox_password.inputFlag = isVisible ? cc.EditBox.InputFlag.DEFAULT : cc.EditBox.InputFlag.PASSWORD;
        }
    },

    getWithdrawLimitCent: function () {
        return this.getWithdrawableBalanceCent();
    },

    getRemainWithdrawCount: function () {
        let remainCount = Number(GlobalCfg.USER_DATAS.remainWithdrawCount || 0);
        return remainCount <= 0 ? 0 : remainCount;
    },

    getTransferAddress: function () {
        return GlobalCfg.USER_DATAS.transferAddress || {};
    },

    getSelectedCardInfo: function () {
        return this.getCardInfoByType(this.selectedCardType || this.selectedWithdrawWay);
    },

    getCardInfoByType: function (cardType) {
        let type = Number(cardType || 0);
        if (isNaN(type) || this.indiaAddressV1Cards.length <= 0) {
            return null;
        }

        for (let i = 0; i < this.indiaAddressV1Cards.length; i++) {
            let cardInfo = this.indiaAddressV1Cards[i];
            if (Number(cardInfo.type || cardInfo.third_id || 0) == type) {
                return cardInfo;
            }
        }

        return null;
    },

    hasTransferCard: function (transferAddress) {
        return !!(transferAddress && (transferAddress.bank_card_id || transferAddress.name || transferAddress.mobile));
    },

    getSelectedCardType: function () {
        let toggleIndex = this.getToggleIndex(this.NowToggleName);
        return toggleIndex + 1;
    },

    needSafeCode: function (transferAddress) {
        return !!(transferAddress && transferAddress.has_safe_code);
    },

    getSelectedWithdrawWayForReq: function () {
        let transferAddress = this.getSelectedCardInfo();
        let wayList = transferAddress && Array.isArray(transferAddress.third_open_withdraw_way) ? transferAddress.third_open_withdraw_way : [];
        let way = Number(wayList[0] || this.selectedWithdrawWay || 1);
        return isNaN(way) ? 1 : way;
    },

    getSafeCode: function () {
        return this.editBox_password ? String(this.editBox_password.string || '').trim() : '';
    },

    getWithdrawAmountInputText: function () {
        return this.editBox_with_amount ? String(this.editBox_with_amount.string || '').trim() : '';
    },

    getWithdrawAmount: function () {
        let amountStr = this.getWithdrawAmountInputText();
        if (!amountStr && this.selectedItemData && this.selectedItemData.price) {
            return Number(this.selectedItemData.price) || 0;
        }

        let amount = Number(amountStr.replace(/,/g, ''));
        return isNaN(amount) ? 0 : amount;
    },

    fixWithdrawAmountRange: function () {
        if (!this.editBox_with_amount) {
            return;
        }

        let amountStr = this.getWithdrawAmountInputText();
        if (!amountStr) {
            this.refreshWithdrawButtonState();
            return;
        }

        let amount = Number(amountStr.replace(/,/g, ''));
        if (isNaN(amount)) {
            this.editBox_with_amount.string = '';
            this.refreshWithdrawButtonState();
            return;
        }

        if (amount < 100) {
            amount = 100;
        }
        else if (amount > 4999) {
            amount = 4999;
        }

        this.editBox_with_amount.string = this.formatAmountForEditBox(amount);
        this.refreshWithdrawButtonState();
    },

    refreshWithdrawButtonState: function () {
        if (!this.btn_withdraw) {
            return;
        }

        this.btn_withdraw.interactable = this.canSubmitWithdraw();
    },

    canSubmitWithdraw: function () {
        let transferAddress = this.getSelectedCardInfo();
        let amountCent = Math.round(this.getWithdrawAmount() * 100);
        return !!(this.hasTransferCard(transferAddress) && this.getWithdrawAmountInputText() && this.getSafeCode() && this.canWithdrawAmount(amountCent));
    },

    getWithdrawableBalanceCent: function () {
        return Number(GlobalCfg.USER_DATAS.winnings || 0) + Number(GlobalCfg.USER_DATAS.welfare || 0);
    },

    getWalletCountText: function () {
        let walletTitle = this.getPlayerCenterLanguageText('lab_withdrawWallect') || 'E Wallect';
        let currentCount = this.getCardCountByType(this.selectedCardType);
        let totalCount = this.getTotalWalletCount();
        return `${walletTitle} (${currentCount}/${totalCount})`;
    },

    getCardCountByType: function (cardType) {
        let type = Number(cardType || 0);
        if (isNaN(type) || this.indiaAddressV1Cards.length <= 0) {
            return 0;
        }

        let count = 0;
        for (let i = 0; i < this.indiaAddressV1Cards.length; i++) {
            let cardInfo = this.indiaAddressV1Cards[i];
            if (Number(cardInfo.type || cardInfo.third_id || 0) == type) {
                count += 1;
            }
        }
        return count;
    },

    getTotalWalletCount: function () {
        if (this.indiaAddressV1Cards.length <= 0) {
            return 0;
        }

        let totalCount = 0;
        for (let i = 1; i <= 3; i++) {
            totalCount += this.getCardCountByType(i);
        }
        return totalCount;
    },

    getMaskedCardText: function (transferAddress) {
        if (!transferAddress) {
            return '';
        }

        let account = transferAddress.bank_card_id || transferAddress.mobile || transferAddress.account || '';
        account = String(account);
        if (account.length <= 4) {
            return account;
        }

        return `**** ${account.slice(-4)}`;
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

    getToggleNameByCardType: function (cardType) {
        switch (Number(cardType || 0)) {
            case 2:
                return 'toggle2';
            case 3:
                return 'toggle3';
            case 1:
                return 'toggle1';
            default:
                return '';
        }
    },

    formatAmountForEditBox: function (amount) {
        let num = Number(amount);
        if (isNaN(num)) {
            return '';
        }
        return Number.isInteger(num) ? `${num}` : `${num.toFixed(2)}`;
    },

    getLocalizedText: function (key) {
        let config = window.commonTipsLanguage && window.commonTipsLanguage[key];
        // commonTipsLanguage 的结构是 [key, English, Hindi, Urdu, Bengali]。
        if (!config) {
            return '';
        }

        let languageIndex = this.getCurrentLanguageIndex();
        return config[languageIndex] || config[1] || '';
    },

    getPlayerCenterLanguageText: function (key) {
        let config = window.playerCenterLanguage && window.playerCenterLanguage[key];
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
});
