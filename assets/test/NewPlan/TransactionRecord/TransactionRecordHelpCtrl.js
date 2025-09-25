cc.Class({
    extends: cc.Component,

    properties: {
        btn_close: cc.Button,
        btn_how: cc.Button,
        btn_submit: cc.Button,

        lab_rechargeAmount: cc.Label,
        lab_date: cc.Label,
        lab_state: cc.Label,

        editBox_utr: cc.EditBox,
        btn_upload: cc.Button,

        sprite_upload: cc.Sprite,

        btn_tipClose: cc.Button,

        node_upload: cc.Node,
        node_tip: cc.Node,
    },

    ctor: function() {
        this.uploadPhotoBase64Data = null;
        this.uploadPhotoFormat = "jpg";
        this.orderId = '';
        this.stateArr = ["Processing", "Succeeded", "Failed"];
    },

    onLoad: function() {
        this.node_upload.active = true;
        this.node_tip.active = false;
        this.btn_close.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
        this.btn_how.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
        this.btn_submit.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 2), this);
        this.btn_upload.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 2), this);
        this.btn_tipClose.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);

        this.customMsgEventHandle = ClientNotify.register(GlobalCfg.MSG_TYPE.clientMsg, this.onEventMsg, this);
    },

    onEventMsg: function (webData, target) {
        let msgId = webData.msgCode;
        let notify = webData.msgData;
        if (msgId == "SelectPhotoCallBack") {
            let photoPath = notify.photoPath;
            let width = notify.width;
            let height = notify.height;

            let byteData = jsb.fileUtils.getDataFromFile(photoPath);
            this.uploadPhotoBase64Data = CommonFun.getInstance().arrayBufferToBase64(byteData);
            this.uploadPhotoFormat = photoPath.endsWith("jpg") ? "jpg" : "png";
            cc.assetManager.loadRemote(photoPath, (err, img) => {
                if (!err && cc.isValid(this) && cc.isValid(this.sprite_upload)) {
                    this.sprite_upload.spriteFrame = new cc.SpriteFrame(img);
                };
            });
        };
    },


    btnClick: function(btn) {
        let btnName = btn.node.name;
        switch (btnName) {
            case this.btn_close.node.name:
                this.dealBtnCloseEvent();
                break;
            case this.btn_how.node.name:
                this.dealBtnHowEvent();
                break;
            case this.btn_submit.node.name:
                this.dealBtnSubmitEvent();
                break;
            case this.btn_upload.node.name:
                this.dealBtnUploadEvent();
                break;
            case this.btn_tipClose.node.name:
                this.dealBtnTipCloseEvent();
                break;
            default:
                break;
        }
    },

    dealBtnCloseEvent() {
        this.node.destroy();
    },

    dealBtnHowEvent() {
        this.node_upload.active = true;
        this.node_tip.active = true;
    },

    dealBtnSubmitEvent() {
        let utrString = this.editBox_utr.string;
        if (utrString.length < 12) {
            CommonFun.getInstance().showTips('Input a 12 digit combination.\nClick "How to Find Your UTR for help."');
            return;
        };
        if (this.uploadPhotoBase64Data == null) {
            CommonFun.getInstance().showTips('Please upload a screenshot of your payment voucher');
            return;
        };
        this.uploadFeedback();
    },

    dealBtnUploadEvent() {
        APPManager.selectPhoto();
    },

    dealBtnTipCloseEvent() {
        this.node_upload.active = true;
        this.node_tip.active = false;
    },

    uploadFeedback() {
        CommonFun.getInstance().showProgress();
        let url = GlobalCfg.HTTP_SERVER + '/v1/payment/uploadfeedback';
        let httpParam = {
            "order_id": this.orderId,            // 订单ID
            "photo_data": this.uploadPhotoBase64Data,         // 截图二进制base64数据
            "format": this.uploadPhotoFormat,            // 截图文件格式(png，jpg等)
        };
        CommonFun.getInstance().httpPost(url, httpParam, (msg) => {
            CommonFun.getInstance().hidProgress();
            if (msg && msg.result == 0) {
                CommonFun.getInstance().showTips("Submit successful!");
            }
            else {
                CommonFun.getInstance().showTips(msg.msg);
            };
        }, null, GlobalCfg.USER_DATAS.BearerToken);

        this.node.destroy();
    },


    setTransactionRecordHelpData(data) {
        let createdAt = data.created_at;
        let state = data.status;
        let amount = data.amount;

        this.orderId = data.id;

        this.lab_date.string = `${this.getTimeStrByCreatedAt(createdAt)}`;
        this.lab_state.string = `${this.stateArr[state]}`;
        this.lab_rechargeAmount.string = `$${(Number(amount)/100).toFixed(2)}`;
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
