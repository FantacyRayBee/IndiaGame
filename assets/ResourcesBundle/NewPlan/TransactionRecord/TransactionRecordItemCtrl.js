let EnumRecord = cc.Enum({
    RECHARGE: 0,
    WITHDRAW: 1,
});

cc.Class({
    extends: cc.Component,

    properties: {
        lab_amount: cc.Label,
        lab_state: cc.Label,
        lab_changeAmount: cc.Label,
        lab_before: cc.Label,
        lab_after: cc.Label,
        lab_id: cc.Label,
        lab_time: cc.Label,

        lab_btnDetailTips: cc.Label,
        btn_detail: cc.Button,
    },


    ctor: function() {
        this.itemType = null;
        this.itemData = null;
    },


    onLoad: function() {
        this.btn_detail.node.on("click", CommonFun.getInstance().debounce(this.btnClick, 1), this);
    },


    btnClick: function(btn) {
        GlobalCfg.G_COMPONENTS.Audio.playButton();
        if (this.itemType == EnumRecord.RECHARGE) {
            this.dealRechargeStateBtnDetailEvent();
        }
        else if (this.itemType == EnumRecord.WITHDRAW) {
            this.dealWithDrawStateBtnDetailEvent();
        };
    },


    dealRechargeStateBtnDetailEvent: function() {
        if (this.lab_btnDetailTips.string == "Help") {
            // 上传支付凭证
            CommonFun.getInstance().showTransactionRecordHelp(this.itemData);
        }
        else if (this.lab_btnDetailTips.string == "Detail") {
            CommonFun.getInstance().showAdvancedMode(true);
        };
    },


    dealWithDrawStateBtnDetailEvent: function() {
        let feedback = Reflect.has(this.itemData, 'feedback') == true ? this.itemData.feedback : "";
        let callback_detail = Reflect.has(this.itemData, 'callback_detail') == true ? this.itemData.callback_detail : "";
        
        let content = "";
        if (this.itemData.status == 0) {
            content = 'Waiting for review, please wait!';
        }
        else if (this.itemData.status == 1) {
            content = 'Bank review in progress, please wait!';
        }
        else if (this.itemData.status == 3) {
            content = 'Sorry, after review, your withdrawal is suspected of violating regulations';
        }
        else if (this.itemData.status == 4) {
            if (notify.data.callback_detail != '') {
                content = notify.data.callback_detail;
            } 
            else {
                content = 'unknown error';
            };
        }
    },


    setTransactionRecordItemData: function(data, type) {
        this.itemType = type;
        this.itemData = data;
        if (type == EnumRecord.RECHARGE) {
            this.setRechargeItemData(data);
        }
        else if (type == EnumRecord.WITHDRAW) {
            this.setWithdrawItemData(data);
        };
    },


    setRechargeItemData: function(data) {
        let createdAt = data.created_at;
        let amount = data.amount;
        let before = data.before;
        let id = data.id;
        let status = data.status;
        let previous_pay = data.previous_pay;   // 充值之前的金额，为 0 代表 此条记录为首充订单

        this.lab_amount.string = CommonFun.getInstance().formatCurrencyAmount((Number(amount) / 100).toFixed(2));
        this.lab_id.string = `${id}`;
        this.lab_time.string = `${this.getTimeStrByCreatedAt(createdAt)}`;
        let languagesType = I18NUtil.getInstance().getLanguageType();
        if (status == 0) {              // 支付处理中
            let descriptionStr = I18NUtil.getInstance().getLanguageStr(languagesType, I18NLabelTransIdEnum['TransactionRecord_Processing']);
            this.lab_state.string = descriptionStr;
            this.lab_state.node.color = new cc.color(247, 114, 21, 255);
            this.lab_changeAmount.string = CommonFun.getInstance().formatCurrencyAmount(Number(amount / 100).toFixed(2), { prefix: '+' });
            this.lab_before.string = CommonFun.getInstance().formatCurrencyAmount(Number(before / 100).toFixed(2));
            this.lab_after.string = CommonFun.getInstance().formatCurrencyAmount(((Number(before) + Number(amount)) / 100).toFixed(2))
            this.btn_detail.node.active = true;
            this.lab_btnDetailTips.string = "Help";
        }
        else if (status == 1) {        // 已支付
            let descriptionStr = I18NUtil.getInstance().getLanguageStr(languagesType, I18NLabelTransIdEnum['TransactionRecord_Succeeded']);
            this.lab_state.string = descriptionStr;
            this.lab_state.node.color = new cc.color(26, 182, 51, 255);
            this.lab_changeAmount.string = CommonFun.getInstance().formatCurrencyAmount(Number(amount / 100).toFixed(2), { prefix: '+' });
            
            if (previous_pay == 0 && GlobalCfg.uncleaned == false) {
                let descriptionStr1 = I18NUtil.getInstance().getLanguageStr(languagesType, I18NLabelTransIdEnum['TransactionRecord_Experience Coins']);
                this.lab_before.string = descriptionStr1;                                                    
                this.lab_after.string = CommonFun.getInstance().formatCurrencyAmount(Number(amount / 100).toFixed(2));   
                this.btn_detail.node.active = true;
                this.lab_btnDetailTips.string = "Detail";
            }
            else {
                this.lab_before.string = CommonFun.getInstance().formatCurrencyAmount(Number(before / 100).toFixed(2));             
                this.lab_after.string = CommonFun.getInstance().formatCurrencyAmount(((Number(before) + Number(amount)) / 100).toFixed(2));
                this.lab_btnDetailTips.string = "";
                this.btn_detail.node.active = false;
            };
        }
        else if (status == 2) {        // 支付失败
            let descriptionStr = I18NUtil.getInstance().getLanguageStr(languagesType, I18NLabelTransIdEnum['TransactionRecord_Failed']);
            this.lab_state.string = descriptionStr;
            this.lab_state.node.color = new cc.color(255, 125, 0, 255);
            this.lab_changeAmount.string = CommonFun.getInstance().formatCurrencyAmount(0);
            this.lab_before.string = CommonFun.getInstance().formatCurrencyAmount(0);
            this.lab_after.string = CommonFun.getInstance().formatCurrencyAmount(0);
            this.lab_btnDetailTips.string = "";
            this.btn_detail.node.active = false;
        };
    },

    setWithdrawItemData: function(data) {
        let applytime = data.applytime;
        let amount = data.amount;
        let deduction = data.deduction;
        let before = data.before;
        let id = data.id;
        let orderno = data.orderno;
        let status = data.status;

        this.btn_detail.node.active = false;
        this.lab_btnDetailTips.string = "";

        this.lab_amount.string = CommonFun.getInstance().formatCurrencyAmount((Number(amount) / 100).toFixed(2));
        this.lab_id.string = `${orderno}`;
        this.lab_time.string = `${this.getTimeStrByCreatedAt(applytime)}`;
        this.lab_changeAmount.string = CommonFun.getInstance().formatCurrencyAmount((Number(deduction) / 100).toFixed(2), { prefix: '-' });
        this.lab_before.string = CommonFun.getInstance().formatCurrencyAmount((Number(before) / 100).toFixed(2));
        this.lab_after.string = CommonFun.getInstance().formatCurrencyAmount(((Number(before) - Number(deduction)) / 100).toFixed(2));

        let languagesType = I18NUtil.getInstance().getLanguageType();
        if (status == 0) {                   // 等待审核 
            let descriptionStr = I18NUtil.getInstance().getLanguageStr(languagesType, I18NLabelTransIdEnum['TransactionRecord_Pending']);
            this.lab_state.string = descriptionStr;
            this.lab_state.node.color = new cc.color(247, 114, 21, 255);
        }
        else if (status == 1) {              // 等待三方操作
            let descriptionStr = I18NUtil.getInstance().getLanguageStr(languagesType, I18NLabelTransIdEnum['TransactionRecord_Processing']);
            this.lab_state.string = descriptionStr;
            this.lab_state.node.color = new cc.color(247, 114, 21, 255);
        }
        else if (status == 2) {              // 提现成功
            let descriptionStr = I18NUtil.getInstance().getLanguageStr(languagesType, I18NLabelTransIdEnum['TransactionRecord_Succeeded']);
            this.lab_state.string = descriptionStr;
            this.lab_state.node.color = new cc.color(26, 182, 51, 255);
        }
        else if (status == 3) {              // 三方失败
            let descriptionStr = I18NUtil.getInstance().getLanguageStr(languagesType, I18NLabelTransIdEnum['TransactionRecord_Failed']);
            this.lab_state.string = descriptionStr;
            this.lab_state.node.color = new cc.color(255, 125, 0, 255);
        }
        else if (status == 4) {              // 审核拒绝
            let descriptionStr = I18NUtil.getInstance().getLanguageStr(languagesType, I18NLabelTransIdEnum['TransactionRecord_Rejected']);
            this.lab_state.string = descriptionStr;
            this.lab_state.node.color = new cc.color(255, 125, 0, 255);
        };
    },


    getTimeStrByCreatedAt(createdAt) {
        let timestamp = Date.parse(createdAt);
        let date = new Date(timestamp);
        let year = date.getFullYear(); // 获取年份
        let month = date.getMonth() + 1; // 获取月份（返回值为0~11，需要加1）
        let day = date.getDate(); // 获取日期
        let hours = date.getHours(); // 获取小时
        let minutes = date.getMinutes(); // 获取分钟
        let seconds = date.getSeconds(); // 获取秒数
        return `${year}-${month >= 10 ? month : '0' + month}-${day >= 10 ? day : '0' + day  } ${hours >= 10 ? hours : "0" + hours}:${minutes >= 10 ? minutes : "0" + minutes}:${seconds >= 10 ? seconds : "0" + seconds}`;
    },
});
