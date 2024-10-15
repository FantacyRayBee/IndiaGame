cc.Class({
    extends: cc.Component,

    properties: {
        labRecharge: cc.Label,
        labDate: cc.Label,
        labState: cc.Label,
        editBoxUTR: cc.EditBox,
        btnUploadPhoto: cc.Button,
        btnHow: cc.Button,
        btnOkay: cc.Button,
        btnClose: cc.Button,

        // how to find UTR
        nodeHow: cc.Node,
        btnLeft: cc.Button,
        btnRight: cc.Button,
        btnCloseHow: cc.Button,
        labTitle: cc.Label,
        pageView: cc.PageView,

    },

    ctor: function () {
        this.uploadPhotoBase64Data = null;
        this.uploadPhotoFormat = "jpg";
        this.utrString = '';
        this.orderId = '';
    },

    onLoad() {
        this.nodeHow.active = false;
        this.editBoxUTR.node.on('editing-did-ended', (editbox) => {
            this.utrString = editbox.string;
        }, this);
        this.customMsgEventHandle = ClientNotify.register(GlobalCfg.MSG_TYPE.clientMsg, this.onEventMsg, this);

    },

    onDestroy: function () {
        ClientNotify.removeByHandle(GlobalCfg.MSG_TYPE.clientMsg, this.customMsgEventHandle);
    },

    start() {

        this.btnClose.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
        this.btnOkay.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
        this.btnHow.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 2), this);
        this.btnUploadPhoto.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 2), this);
        this.btnLeft.node.on('click', this.btnClick, this);
        this.btnRight.node.on('click', this.btnClick, this);
        this.btnCloseHow.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 2), this);
    },

    onEventMsg: function (webData, target) {
        let self = target;
        let msgId = webData.msgCode;
        let notify = webData.msgData;
        if (msgId == "SelectPhotoCallBack") {
            self.photoPath = notify.photoPath;
            let width = notify.width;
            let height = notify.height;

            let byteData = jsb.fileUtils.getDataFromFile(self.photoPath);
            self.uploadPhotoBase64Data = CommonFun.getInstance().arrayBufferToBase64(byteData);
            self.uploadPhotoFormat = self.photoPath.endsWith("jpg") ? "jpg" : "png";
            cc.assetManager.loadRemote(self.photoPath, (err, img) => {
                if (!err && cc.isValid(self) && cc.isValid(self.sprite_upload) && cc.isValid(self.btnUploadPhoto)) {
                    self.sprite_upload.spriteFrame = new cc.SpriteFrame(img);
                    self.btnUploadPhoto.interactable = true;
                };
            });
        };
    },

    /**
     * 
     * @param {Object} data 
     * 
     * data{
     *      id:string
     *      amount: string,
     *      date: string,
     *      state: string,
     *      feedback: string,
     * }
     */
    initData(data) {
        this.orderId = data.id;
        this.sprite_upload = this.btnUploadPhoto.target.getComponent(cc.Sprite);
        this.labRecharge.string = data.amount;
        this.labDate.string = data.date;
        this.labState.string = data.state;
        let self = this;
        if (data.feedback && data.feedback.length > 0) {
            let remoteUrl = data.feedback;
            cc.assetManager.loadRemote(remoteUrl, function (err, texture) {
                // Use texture to create sprite frame
                if (!err) {
                    self.sprite_upload.spriteFrame = new cc.SpriteFrame(texture);
                } else {
                    LoggerUtil.getInstance().error("LoadRemote Feedback Image ERROR!");
                }
            });
        }
    },

    // update (dt) {},

    btnClick(button) {
        let btnName = button.node.name;
        if (btnName == this.btnClose.node.name) {
            this.node.destroy();
        }
        else if (btnName == this.btnOkay.node.name) {
            // 上传UTR
            if (this.utrString.length > 0 && this.uploadPhotoBase64Data) {
                this.checkSubmit();
            } else {
                CommonFun.getInstance().showTips('Submission Failed');
            }
        }
        else if (btnName == this.btnHow.node.name) {
            // 引导
            this.pageView.scrollToPage(0);
            this.labTitle.string = "TYPE" + 1;
            this.nodeHow.active = true;
        }
        else if (btnName == this.btnUploadPhoto.node.name) {
            APPManager.selectPhoto();
        }
        else if (btnName == this.btnLeft.node.name) {
            this.scrollPageView('left');
        }
        else if (btnName == this.btnRight.node.name) {
            this.scrollPageView('right');
        }
        else if (btnName == this.btnCloseHow.node.name) {
            this.nodeHow.active = false;
        }
    },

    scrollPageView(type) {
        let pages = this.pageView.getPages();
        let curIndex = this.pageView.getCurrentPageIndex();

        switch (type) {
            case 'left':
                curIndex--;
                if (curIndex < 0) {
                    curIndex = pages.length - 1;
                }
                break;
            case 'right':
                curIndex++;
                if (curIndex >= pages.length) {
                    curIndex = 0;
                }
                break;

            default:
                break;
        }
        this.labTitle.string = "TYPE" + (Number(curIndex) + 1);
        this.pageView.scrollToPage(curIndex);
    },

    checkSubmit() {
        let pattern = new RegExp('^[0-9]+$');
        if (this.utrString.length < 12 || pattern.test(this.utrString) == false) {
            CommonFun.getInstance().showTips('Input a 12 digit combination.\nClick "How to Find Your UTR for help."');
        } else {
            this.uploadFeedback();
        }
    },

    uploadFeedback() {
        if (!this.uploadPhotoBase64Data) {
            return;
        };
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
    },
});
